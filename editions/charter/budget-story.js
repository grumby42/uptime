/* ============================================================
   UPTIME · editions/charter/budget-story.js
   Charter district 1: Budget (Days 65 to 67). The three drills (Tuesday), the
   allocation (Wednesday 09:00), the directive (Joanna asks you to sign her
   acceptance), the Risk & Budget terminals, the Compact Board's budget round
   (Thursday 14:00) with its decision and the acceptances it leaves, the Plumb
   Badge, and the week's summary ("Next: Suppliers").
   The Board decides the budget; each line's owner signs any acceptance for it;
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
  await say('10:15: Edda reads the records. “I wrote it from memory. I’ll correct my line before the papers go.” fin-ap goes to its owner, Oriel: line R4. board-display gets an owner, Edda, and an expiry. The six service accounts keep their exception, each with an owner and an expiry. (game)');
  G.f.chDrillA = true; track();
  await say('11:00: Edda has the incident log at her desk.');
}
async function chDrillB() {
  const who = 'Edda Thornquist';
  await say('11:00. This year’s night-cover line: the members’ night thresholds paging our on-call lead, and the rota’s overtime. Oriel wants to know if it worked before she prices it again. The log and the change record are here.', who);
  await chDrill('nightline');
  await say('Put the runbook in the paper beside the paging, then. Fair. It was both.', who);
  G.f.chDrillB = true; track();
  await say('14:00: Oriel, and the two quotes for R1.');
}
async function chDrillC() {
  const who = 'Oriel Fanshawe';
  await say('14:00. Two quotes for R1, Quote A at $70k and Quote B at $110k. Before I look at the price: which one buys what the register asks for?', who);
  await chDrill('quotes');
  await say('Quote B, then, at $110k, if the Board funds the line. Quote A stays on file. I’ll ask its supplier for Dispatch’s price, for the record.', who);
  G.f.chDrillC = true; unlock('act', 'chquote'); track();
  await say('End the day at your desk. Tomorrow at 09:00, the allocation.');
}

/* ---------- The allocation (Day 66, Wednesday 09:00) ---------- */
async function chAllocTask() {
  await say('09:00. Six lines, $480k, and the appetite the Board signed on Monday. Each line shows what it costs, the risk it leaves, and whose risk it is. (game)');
  const a = await chAllocate();
  G.ch.sent = Object.assign({}, a);
  G.f.chAlloc = true; unlock('act', 'challoc'); touchCSF('Govern'); track();
  const s = chAllocStats(a);
  await say('10:00: Oriel puts your allocation in the Board papers: ' + chMoney(s.total) + ', ' + s.within + ' of 6 lines within appetite. Beside it, Edda’s alternative: the upgrade in full, $250k. (game)');
  await say('11:30: Joanna Ferreday, the airport manager, is waiting by the register.');
}

/* ---------- The directive (game; Day 66 11:30): Joanna asks you to sign her acceptance ---------- */
async function chDirective() {
  const who = 'Joanna Ferreday', f = G.f;
  if (f.chDirective) { await say('Signed, with a date to look at it again. Thank you for not signing it for me.', who); return; }
  await say('The open risk from our weekend: the airport’s directory trusts the town’s, so the Compact’s admins can sign in. Nobody ever accepted it. I’ve decided to keep the trust until the Compact’s admins have another way in.', who);
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
  G.ch.accept.push({line: 'AP', name: 'The airport’s directory trusts the town’s', owner: 'Joanna Ferreday', residual: 'Medium', appetite: chAppetite('privacy'), signedBy: 'Joanna Ferreday', decidedBy: 'Joanna Ferreday, for the airport', day: 66,
    expiry: CH_EXPIRY_DAY, review: CH_REVIEW_DAY, interim: 'the trust stays; it closes when the Compact’s admins can sign in to the airport another way.'});
  await say('11:50: written up together. The trust, residual Medium against the Low privacy appetite; Joanna signs, as its owner; it expires on Day 428 and is reviewed on Day 155; what closes it is written in. On the register, and the Board sees it on Thursday. (game)');
  f.chDirective = true; unlock('act', 'chaccept'); touchCSF('Govern'); track();
  await say('13:00: Oriel has three terminals for you.');
}

/* ---------- The Risk & Budget terminals (Oriel) ---------- */
async function chDojoIntro() {
  G.f.chDojoMet = true;
  await say('While the papers print: three terminals, south-west. Residual risk, cost against benefit, and who signs. They’re mine; I use them on every new budget holder.', 'Oriel Fanshawe');
}
async function chDojoPuzzle(i) {
  const f = G.f, c = G.ch;
  if (i < 0) return;
  if (!f.chDojoMet) { await say('A training terminal: “Risk & Budget”. Oriel’s. Talk to her first.'); return; }
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
  await say('All three. Focus ' + G.focusMax + ' (game). End the day at your desk.', 'Oriel Fanshawe');
}

/* ---------- The Compact Board's budget round (Day 67 14:00) ---------- */
async function chBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, c = G.ch;
  await say('14:00. The members’ representatives, Edda, Oriel, and Noor for anything legal. Two asks for one budget. Three questions first.', who);
  c.board = {first: []};
  await chStages(CH_BOARD_SPECS(), c.board.first);
  const d = chBoardDecide(c.sent);
  c.decision = {override: d.override, cut: d.cut};
  c.final = d.final;
  if (d.override) {
    await say('15:00. The Board funds the upgrade in full, $250k. Oriel’s figures: a year of support now and the upgrade next year is $340k for the same platform. To pay for it, ' + d.cut.map(id => id + ' (' + chLine(id).name + ')').join(', ') + (d.cut.length === 1 ? ' waits' : ' wait') + ' a year. The center’s segment stays funded: I won’t ask Celia to sign for that. (game)', who);
  } else await say('15:00. The Board approves your allocation as sent. (game)', who);
  const above = chAboveAppetite(c.final);
  for (const l of above) c.accept.push(chAcceptance(l, c.final, d.override ? 'the Board, overriding the CISO’s allocation' : 'the Board', 67));
  await UI.openModal('The Board’s decision', '<p>' + (d.override ? 'The Board overrode your allocation: the upgrade in full, paid for by deferring ' + d.cut.join(', ') + '. ' : 'The Board approved your allocation. ') + 'The minute records the decision and every acceptance it leaves. (game)</p>' + chAllocTable(c.final) + chAllocSummary(c.final) +
    (above.length ? '<h3>15:20: the acceptances, signed by their owners</h3>' + chAcceptHtml(c.accept.filter(x => x.day === 67)) : '') +
    '<h3>Also before the Board</h3>' + chAcceptHtml(c.accept.filter(x => x.day === 66)),
    [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  if (above.length && above.every(l => l.owner === 'Edda Thornquist')) await say('I sign ' + (above.length === 1 ? 'it' : 'them') + ', as their owner. The upgrade was my request; what it leaves is mine too.', 'Edda Thornquist');
  else if (above.length) await say('15:20: ' + above.map(l => l.owner).filter((x, i, a) => a.indexOf(x) === i).join(', ') + ' sign, each as the owner of the lines left above appetite. (game)');
  f.chBoard = true; f.chPlumb = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chboard'); touchCSF('Govern'); track();
  await say('You cleared the Compact Board’s budget round. This is the Plumb Badge (game).', who);
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
  const ok = l => l.every(Boolean), s = c.final ? chAllocStats(c.final) : null;
  const body = '<p class="big">Budget: done.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: the remit ' + (c.remit && ok(c.remit.first) ? 'answered at the first try' : 'answered, with false starts') + '; the appetite statement ' + (c.appetite && ok(c.appetite.first) ? 'drafted at the first try' : 'drafted, with false starts') + ', approved at 12:00; the register’s owners and dates ' + (c.register && ok(c.register.first) ? 'set at the first try' : 'set, with false starts') + '.</p>' +
    '<h3>Drills (game)</h3><table class="sc"><tr><th>Drill</th><th>Score</th><th>Supported</th></tr>' + chDrillRows() + '</table>' +
    '<p>Thursday: the Board ' + (c.decision && c.decision.override ? 'overrode your allocation, funding the upgrade in full by deferring ' + c.decision.cut.join(', ') : 'approved your allocation as sent') + '. Its rounds ' + (c.board && ok(c.board.first) ? 'at the first try' : 'with false starts the debriefs named') + '. ' + (s ? s.within + ' of 6 lines within appetite; ' + chMoney(s.total) + ' allocated.' : '') + '</p>' +
    '<h3>Acceptances on the register</h3>' + chAcceptHtml(c.accept) +
    '<p>Lesson (game): the budget follows the register, each line priced against what it buys and what it leaves, measured against an appetite the Board approved before anyone spent a dollar. Claims are checked against records. The Board decides; each owner signs for the risk left above appetite; the CISO advises and keeps the record.</p>' +
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
