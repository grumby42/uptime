/* ============================================================
   UPTIME · editions/charter/budget-story.js
   Charter district 1: Budget (Days 65 to 67). The three drills (Tuesday), the
   allocation (Wednesday 09:00), the directive (Joanna asks you to sign her
   acceptance), the Risk & Budget terminals, the Compact Board's budget round
   (Thursday 14:00) with its decision and the acceptances it leaves, the Ballast
   Badge, and the week's summary ("Next: Suppliers").
   The Board decides the budget, and minutes and approves carrying what its
   decision leaves above appetite; each line's owner signs the acceptance, for
   the interim measures and the treatment plan;
   the CISO advises, keeps the register and writes each acceptance up.
   Timeline: scratchpad charter-timeline.md (Days 65 to 67).
   ============================================================ */
'use strict';

/* ---------- Drills (Day 65, Tuesday) ---------- */
async function chDrill(key) {
  const c = G.ch;
  const r = await doDrill(CH_DRILLS[key]);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys};
  c.needs.total++; if (r.verdictOk && r.supported) c.needs.met++;
  track();
  return r;
}
async function chDrillA() {
  const who = 'Beatriz Solano';
  await say('09:00. The sign-in policy and its exceptions, exported at 08:40, and the shared directory’s sign-in records for the 30 days to 08:00. Edda’s request says MFA is on for every sign-in. Read it like a finding.', who);
  await chDrill('mfaclaim');
  await say('10:15: Edda reads the records. “I wrote it from memory. I’ll correct my line before the papers go.” fin-ap goes to its owner, Marit: line R4. board-display gets an owner, Edda, and an expiry. The six service accounts keep their exception, each with an owner and an expiry. (game)');
  G.f.chDrillA = true; track();
  await say('11:00: Edda has the incident log at her desk.');
}
async function chDrillB() {
  const who = 'Edda Thornquist';
  await say('11:00. This year’s night-cover line: the members’ night thresholds paging our on-call lead, and the rota’s overtime. Marit wants to know if it worked before she prices it again. The log and the change record are here.', who);
  await chDrill('nightline');
  await say('Put the runbook in the paper beside the paging, then. Fair. It was both.', who);
  G.f.chDrillB = true; track();
  await say('14:00: Marit, and the two quotes for R1.');
}
async function chDrillC() {
  const who = 'Marit Quellan';
  await say('14:00. Two quotes for R1, Quote A at $70k and Quote B at $110k. Before I look at the price: which one buys what the register asks for?', who);
  await chDrill('quotes');
  await say('Quote B, then, at $110k, if the Board funds the line. I run the purchase under the Compact’s procurement rules (game). Quote A stays on file, and I’ll ask its supplier for Dispatch’s price, for the record.', who);
  G.f.chDrillC = true; unlock('act', 'chquote'); track();
  await say('End the day at your desk. Tomorrow at 09:00, the allocation.');
}

/* ---------- The allocation (Day 66, Wednesday 09:00) ---------- */
async function chAllocTask() {
  await say('09:00. Six lines, $480k, and the appetite and tolerances the Board signed on Monday. Each line shows what it costs, the risk it leaves, the tolerance it serves, and whose risk it is. (game)');
  const a = await chAllocate();
  G.ch.sent = Object.assign({}, a);
  G.f.chAlloc = true; unlock('act', 'challoc'); touchCSF('Govern'); track();
  const s = chAllocStats(a);
  await say('10:00: Marit puts your allocation in the Board papers: ' + chMoney(s.total) + ', ' + s.within + ' of 6 lines within appetite. Beside it, Edda’s alternative: the upgrade in full, $250k. (game)');
  await say('11:30: Joanna Ferreday, the airport manager, is waiting by the register.');
}

/* ---------- The directive (game; Day 66 11:30): Joanna asks you to sign her acceptance ---------- */
async function chDirective() {
  const who = 'Joanna Ferreday', f = G.f;
  if (f.chDirective) { await say('Signed, with a date to look at it again. Thank you for not signing it for me.', who); return; }
  await say('The council’s risk committee named the airport its owner, and the Airport Authority made me its signatory (game).', who);
  await say('The open risk from our weekend: the airport’s directory trusts the town’s, so the Compact’s admins can sign in. Nobody had accepted it. I’ve decided to keep the trust until the Compact’s admins have another way in.', who);
  await say('You understand it far better than I do. Just sign it off for me, would you?', who);
  const items = CH_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Joanna’s acceptance: what do you tell her?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_DIRECTIVE[i].why);
  }
  G.ch.directive = {first: first};
  G.ch.accept.push({line: 'AP', name: 'The airport’s directory trusts the town’s', owner: 'Joanna Ferreday', residual: 'Medium', appetite: chAppetite('privacy'), signedBy: 'Joanna Ferreday', breaks: [], decider: 'Joanna', decidedBy: 'Joanna Ferreday, for the airport', approvedBy: null, day: 66,
    expiry: CH_EXPIRY_DAY, review: CH_REVIEW_DAY, interim: 'Dario reviews the airport directory’s lookups by town accounts each month. It closes when the Compact’s admins can sign in to the airport another way.'});
  await say('11:50: written up together. On the Compact’s register because the trust exists for the Compact’s admins; measured against the Compact’s privacy appetite, which the airport’s representative voted for on Monday. (game)');
  await say('The trust, residual Medium against the Low privacy appetite. Joanna signs, as its owner. Meanwhile Dario reviews the directory’s lookups by town accounts each month; it expires on Day 428 and is reviewed on Day 155; what closes it is written in. The Board sees it on Thursday. (game)');
  f.chDirective = true; unlock('act', 'chaccept'); touchCSF('Govern'); track();
  await say('13:00: Marit has three terminals for you.');
}

/* ---------- The Risk & Budget terminals (Marit) ---------- */
async function chDojoIntro() {
  G.f.chDojoMet = true;
  await say('While the papers print: three terminals, south-west. Residual risk, cost against benefit, and who signs. They’re mine; I use them on every new budget holder.', 'Marit Quellan');
}
async function chDojoPuzzle(i) {
  const f = G.f, c = G.ch;
  if (i < 0) return;
  if (!f.chDojoMet) { await say('A training terminal: “Risk & Budget”. Marit’s. Talk to her first.'); return; }
  const p = CH_DOJO[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the person who signs the cheque would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF('Govern');
  if (!c.dojo.every(Boolean) || f.chDojoDone) return;
  f.chDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2); track();
  await say('All three. Focus ' + G.focusMax + ' (game). End the day at your desk.', 'Marit Quellan');
}

/* ---------- The Compact Board's budget round (Day 67 14:00) ---------- */
async function chBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, c = G.ch, up = chLine('R6').opts.length - 1;
  await say('14:00. The members’ representatives, Edda, Marit, and Noor for anything legal. Two asks for one budget. Three questions first.', who);
  c.board = {first: []};
  await chStages(CH_BOARD_SPECS(), c.board.first);
  // The advice counts: both cases laid out alike (Round 1) and the upgrade's cost stated plainly (Round 2), at the first
  // try, with an allocation inside Monday's appetite and tolerances, and the Board takes the extension (chBoardDecide).
  const d = chBoardDecide(c.sent, c.board.first[0] && c.board.first[1]);
  c.decision = {override: d.override, cut: d.cut, restored: d.restored, persuaded: d.persuaded};
  c.final = d.final;
  const names = ids => ids.map(id => id + ' (' + chLine(id).name + ')').join(', ');
  let msg = '15:00. ';
  if (d.restored.length) msg += 'Your allocation leaves R5, the 911 center’s segment, at $0. The Board funds it, $120k, and the minute says so: I won’t ask Celia to sign that. ';
  if (d.override) msg += 'The Board funds the upgrade in full, $250k. Marit’s figures: a year of support now and the upgrade next year is $340k for the same platform.' + (d.cut.length ? ' To pay for it, ' + names(d.cut) + (d.cut.length === 1 ? ' waits' : ' wait') + ' a year.' : '') + (d.restored.length ? '' : ' The center’s segment stays funded: I won’t ask Celia to sign for that.');
  else if (d.persuaded && c.sent.R6 !== up) msg += 'The Board approves your allocation as sent. The extension carries the platform for a year, and the upgrade comes back at the start of next year’s budget cycle. Laid out side by side, it keeps every line inside what we signed on Monday.';
  else msg += 'The Board approves your allocation' + (d.cut.length ? ', less ' + names(d.cut) + ', to fit $480k' : ' as sent') + '.';
  await say(msg + ' (game)', who);
  // What the decision leaves above appetite: the Board's decision and its approval of the residual risk, in the minute (the
  // CISO's advice and objection noted when it overrode); each owner signs for the interim measures and the treatment plan.
  const above = chAboveAppetite(c.final);
  const dec = {decidedBy: 'the Compact Board (minute, Day 67), ' + (d.override ? 'against the CISO’s advice' : d.restored.length || d.cut.length ? 'correcting the CISO’s allocation' : 'on the CISO’s allocation'), approvedBy: 'the Compact Board'};
  for (const l of above) c.accept.push(chAcceptance(l, c.final, dec, 67));
  const ids = above.map(l => l.id), list = ids.length > 1 ? ids.slice(0, -1).join(', ') + ' and ' + ids[ids.length - 1] : ids[0];
  const head = d.override ? 'The Board overrode your allocation: the upgrade in full' + (d.cut.length ? ', paid for by deferring ' + d.cut.join(', ') : '') + '. ' : 'The Board approved your allocation' + (d.cut.length ? ', less ' + d.cut.join(', ') : d.persuaded && c.sent.R6 !== up ? ' as sent, the extension carrying the platform' : ' as sent') + '. ';
  const minute = above.length ? 'The minute records the Board’s decision to carry ' + list + ' above appetite until Day ' + CH_EXPIRY_DAY + (d.override ? ', with the CISO’s advice against it and the objection noted' : '') + ', and its acceptance of the residual risk, approved by the Board. Each owner signs for the interim measures and owns the treatment plan.'
    : 'The minute records the decision. No line is left above appetite.';
  await UI.openModal('The Board’s decision', '<p>' + head + (d.restored.length ? 'It funded R5, which your allocation left at $0. ' : '') + minute + ' (game)</p>' + chAllocTable(c.final) + chAllocSummary(c.final) +
    (above.length ? '<h3>15:20: the acceptances: the Board’s decision, signed by their owners</h3>' + chAcceptHtml(c.accept.filter(x => x.day === 67)) : '') +
    '<h3>Also before the Board</h3>' + chAcceptHtml(c.accept.filter(x => x.day === 66)),
    [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  for (const o of [...new Set(above.map(l => l.owner))]) {
    const mine = above.filter(l => l.owner === o).map(l => l.id), one = mine.length === 1;
    if (o === 'Edda Thornquist') await say('I sign ' + (one ? 'it as its owner' : 'them as their owner') + ', and I’ll run the interim checks. The Board chose the trade-off; the minute says so.', o);
    else if (o === 'Marit Quellan') await say('I sign ' + mine.join(', ') + ' as ' + (one ? 'its' : 'their') + ' owner, and I’ll run the interim checks. The Board chose it; the minute says so.', o);
    else await say('15:20: ' + o + ' signs ' + mine.join(', ') + ' as the owner, for the interim measures and the treatment plan. (game)');
  }
  f.chBoard = true; f.chBallast = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s budget round. This is the Ballast Badge (game).', who);
  await say('Its power, from the next district on: every register line arrives with its owner and its review date. And you carry a little more now: Focus +4.', who);
  await say('16:00: your desk. Close the week.');
}

/* ---------- The week's summary ---------- */
function chDrillRows() {
  return Object.keys(CH_DRILLS).map(k => { const d = G.ch.drills[k]; return '<tr><td>' + esc(CH_DRILLS[k].title) + '</td><td>' + (d ? d.score : '—') + '</td><td>' + (d ? (d.supported ? 'yes' : 'no') : '—') + '</td></tr>'; }).join('');
}
async function chSummary() {
  const f = G.f, c = G.ch;
  if (!f.chSummary) {
    f.chSummary = true; touchCSF('Govern');
    Series.markEdition('charter', {budget: true});
    await say('An appetite the Board signed, a register with an owner and a date on every line, and a budget the Board decided with its eyes open. Next, the suppliers.', 'Ivor Penhallow');
  }
  const ok = l => l.every(Boolean), s = c.final ? chAllocStats(c.final) : null, adv = c.sent ? chAllocStats(c.sent) : null;
  const body = '<p class="big">Budget: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: the remit ' + (c.remit && ok(c.remit.first) ? 'answered at the first try' : 'answered, with false starts') + '; the appetite statement ' + (c.appetite && ok(c.appetite.first) ? 'drafted at the first try' : 'drafted, with false starts') + ', approved at 12:00; the register’s owners and dates ' + (c.register && ok(c.register.first) ? 'set at the first try' : 'set, with false starts') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chDrillRows() + '</table>' +
    '<p>Your advice: the allocation you sent, ' + (adv ? adv.within + ' of 6 lines within appetite and its tolerances, ' + chMoney(adv.total) + '.' : 'none sent.') + ' Thursday: the Board ' + (c.decision && c.decision.override ? 'overrode your allocation, funding the upgrade in full' + (c.decision.cut.length ? ' by deferring ' + c.decision.cut.join(', ') : '') : 'approved your allocation' + (c.decision && c.decision.cut.length ? ', less ' + c.decision.cut.join(', ') : ' as sent')) + (c.decision && c.decision.restored && c.decision.restored.length ? ', and funded R5, which your allocation left at $0' : '') + '. Its rounds ' + (c.board && ok(c.board.first) ? 'at the first try' : 'with false starts the debriefs named') + '. ' + (s ? 'The Board’s decision: ' + s.within + ' of 6 lines within appetite; ' + chMoney(s.total) + ' allocated.' : '') + '</p>' +
    '<h3>Acceptances on the register</h3>' + chAcceptHtml(c.accept) +
    '<p>Lesson (game): the budget follows the register, each line priced against what it buys and what it leaves, measured against an appetite and tolerances the Board approved before anyone spent a dollar. Claims are checked against records. The Board decides; each acceptance is signed by its business owner; a risk the governing body decides to carry above its own appetite is also minuted as the governing body’s decision. The CISO advises and keeps the record.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: ' + qtCount() + ' notes in the suspicion file. Who, and why: not yet known.</p>') +
    '<p class="big">Next: Suppliers.</p>';
  while (true) {
    const i = await UI.openModal('End of Budget', body, [{label: 'Keep exploring the Compact offices', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
