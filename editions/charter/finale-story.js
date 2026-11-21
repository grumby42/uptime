/* ============================================================
   UPTIME · editions/charter/finale-story.js
   Charter's finale: a material incident and the disclosure clock (Days 92 to
   95). Monday: Wellhollow's notice (06:10), the incident log's first entry
   (06:25), the CISO's questions to Wellhollow, containment (Edda's decision,
   07:40), drill 1 (what Wellhollow holds of ours), drill 2 (has anything
   reached our systems), facts packet 1 to Noor and the chair (N-1, due 10:25),
   the members' call (N-2), the decision log. Tuesday: Wellhollow's second
   answer and our own job log, the directive (Marit asks to hold packet 2),
   facts packet 2 at Noor's checkpoint, Noor's determination (15:00, the start
   of N-3 for the town), drill 3 (when N-3's clock starts). Wednesday: the
   clock and the comparison card, facts packet 3 for the statement, the chair's
   decision on the statement (on Noor's and Ada's advice), the Disclosure
   terminals. Thursday: the Compact Board's debrief, three questions keyed to
   the packets as sent, the minute (with the S-7 decision), the Heaving Line
   Badge, and the edition's end.
   One decider per decision, whoever is on duty; the CISO recommends and
   supplies the facts, and never decides disclosure. Tolerances bind: chAudit
   at the minute and the district's end, with the finale's rule (disclosure.js,
   chFinAuditNow). The Quiet Thread advances, not resolved: one open item in
   packet 1, with no conclusion, for counsel to decide whether it is in scope.
   Timeline: docs/design/charter-timeline.md (slice 5).
   ============================================================ */
'use strict';

/* ---------- The week opens (your desk, after the Board report): the notice and the log ---------- */
async function chFinStart() {
  const fin = chFin();
  await UI.openModal('Day 92, Monday, 06:15', '<p>Your phone, before dawn. The on-call lead (game):</p><p>“Wellhollow’s notice reached our security contact at 06:10. I’ve read it to you word for word. Nothing on our dashboards.”</p>' +
    '<pre class="art">Wellhollow · notice to customers (as received 06:10, game data)\n“an incident on our off-site backup service, detected at 22:47\n on Day 91; unauthorised access to a storage system holding\n copies for several customers, the Compact among them, is under\n investigation; whether customer copies were read or copied is\n not yet known”</pre>' +
    '<p class="small">CSF 2.0 (NIST CSWP 29) RS.CO-03: “Information is shared with designated internal and external stakeholders”. One of NIST’s examples for it, in the CSF 2.0 Implementation Examples: “Regularly update senior leadership on the status of major incidents”.</p>',
    [{label: 'The incident log', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chFinStart = true; G.day = 92; G.focus = G.focusMax; touchCSF('Respond'); unlock('fact', 'chcsfrs'); track();
  const items = CH_FIN_LOGOPEN.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('The incident log: when does it start?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_FIN_LOGOPEN[i].why);
  }
  fin.log = {first: first, at: CH_FIN_EVENTS.log.at.slice()};
  G.f.chFinLog = true; unlock('act', 'chfinlog'); track();
  await say('06:25: the incident log’s first entry, the notice as its first record. N-1 and N-2 run from here: facts to Noor and the chair by 10:25, the members told by Tuesday 06:25. (game)');
  await say('06:40: your questions to Wellhollow’s security contact, in writing: which store, whose copies, the time window, and what is known of copies read. Each one in the log with its time. (game)');
  await say('07:20: Edda is already at her desk.');
}

/* ---------- Containment (07:20, Edda's desk) ---------- */
async function chFinContain() {
  const who = 'Edda Thornquist', fin = chFin();
  await say('07:20. I read it on the way in. Our copies go to Wellhollow every night at 01:00, cp-backup on CP-OPS-02. Last night’s ran 01:00 to 01:42. What do you recommend?', who);
  const items = CH_FIN_CONTAIN.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Your recommendation to Edda', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_FIN_CONTAIN[i].why);
  }
  fin.contain = {first: first, by: 'Edda Thornquist', at: [92, '07:40'], exported: [92, '08:05']};
  await say('Paused at 07:40, my decision, on your recommendation. The job log stays where it is, and so do our local copies. I’ll export the log now.', who);
  G.f.chFinContain = true; unlock('act', 'chfincontain'); touchCSF('Respond'); track();
  await say('08:05: the job log exported. 08:30: Edda has the data-flow record and the copy job.');
}

/* ---------- Drills ---------- */
async function chFinDrill(key) {
  const fin = chFin(), r = await doDrill(CH_FIN_DRILLS[key]);
  fin.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys};
  fin.needs.total++; if (r.verdictOk && r.supported) fin.needs.met++;
  track();
  return r;
}
async function chFinDrillA() {
  await say('08:30. The notice says “copies for several customers, the Compact among them”. What does Wellhollow actually hold of ours? The data-flow record and the copy job are here.', 'Edda Thornquist');
  await chFinDrill('finhold');
  G.f.chFinDrillA = true; touchCSF('Respond'); track();
  await say('09:00: Beatriz, at the identity desk: has anything from Wellhollow reached our systems?');
}
async function chFinDrillB() {
  await say('09:00. Wellhollow has no account on our side, by the register. The account lists and the edge log are exported, to 08:30.', 'Beatriz Solano');
  await chFinDrill('finedge');
  G.f.chFinDrillB = true; touchCSF('Respond'); track();
  await say('09:30: your desk. Facts packet 1, for Noor and the chair, is due at 10:25.');
}

/* ---------- The facts packets (your desk) ---------- */
async function chFinPacket(id) {
  const fin = chFin(), P = chFinPacketDef(id);
  const picks = await chFinEdit(id);
  const opts = CH_FIN_SEND[id], items = opts.map(o => ({label: o.label, meta: {good: !!o.good, bot: !!o.good}}));
  const k = await UI.openModal('Send ' + P.title.split(' · ')[0].toLowerCase() + '?', chFinPacketHtml(id, picks) + '<p>Due: <b>' + esc(chAtText(chAt(P.due[0], P.due[1]))) + '</b> (' + esc(P.dueRule) + '). It goes as you send it, and it is yours: the scorecard reads it as sent.</p>',
    items, {shuffle: true, closable: false, cls: 'drill'});
  const o = opts[k], at = chAt(o.at[0], o.at[1]), due = chAt(P.due[0], P.due[1]);
  const rec = fin.packets[id];
  rec.sent = {picks: Object.assign({}, picks), at: at, due: due, onTime: at <= due, to: o.to, choice: k, good: !!o.good};
  rec.grade = chFinGrade(id, rec.sent.picks); track();
  if (!o.good) await say(o.why);
  await UI.openModal(P.title.split(' · ')[0] + ', as sent', '<p>' + esc(chAtText(at)) + ': to ' + esc(o.to) + '. (game)</p>' + chFinDebriefHtml(rec.grade, rec.sent),
    [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'summary'});
  unlock('act', 'chfinpacket'); touchCSF('Respond'); track();
}
async function chFinPacket1() {
  await say('09:30. What is known, what is not, since when, and from which record: one row each. Noor and the chair get it under N-1. (game)');
  await chFinPacket('P1');
  G.f.chFinPacket1 = true; track();
  await say('11:00: Noor, by the window: the members’ call.');
}
async function chFinPacket2() {
  await say('13:30. Noor’s checkpoint is 14:00: what has changed since Monday, and what is still not known. (game)');
  await chFinPacket('P2');
  const s = chFin().packets.P2.sent;
  G.f.chFinPacket2 = true; track();
  await say(s.at <= chAt(93, '14:10') ? '14:10: Noor sends the packet to each member’s counsel, for each to decide for its own member. (game)' : 'Noor has it at ' + chHm(s.at % 1440) + ', and sends it on to each member’s counsel then. (game)');
  await say('15:00: Noor, by the window.');
}
async function chFinPacket3() {
  await say('09:30. The chair decides the Compact’s statement at 12:00, on Noor’s and Ada’s advice, and asked for the facts by 11:00. Plain words, and no personal details. (game)');
  await chFinPacket('P3');
  G.f.chFinPacket3 = true; track();
  await say('12:00: the Compact Board room. Ivor, Noor and Ada are waiting.');
}

/* ---------- The members' call (11:00, Noor): N-2, the next checkpoint, and the open item ---------- */
async function chFinMembers() {
  const who = 'Noor Castellanos', fin = chFin(), s = fin.packets.P1 && fin.packets.P1.sent, had = s && s.at <= chAt(92, '11:00');
  await say(had ? '11:00. I have your packet. The chair is on the call with the members’ representatives and their counsel now.' : '11:00. I don’t have your packet yet. The chair is on the call with the members’ representatives and their counsel now.', who);
  await say('11:00: each member’s representative and its own counsel told that its data may be involved. N-2, done. Each member’s counsel decides for its own member. (game)');
  await say('My next checkpoint: Tuesday 14:00. Bring me what has changed, and what is still not known.', who);
  const oi = chFinOpenItem();
  if (oi) {
    const at = had ? [92, '11:00'] : [Math.floor(s.at / 1440), chHm(s.at % 1440)];
    await say((had ? 'And the open item in your packet: ' : 'And the open item, when your packet reaches me: ') + 'not in scope for any notice on these facts. It stays with Rae Okafor’s team and me, and out of the Board papers. My decision, as counsel.', who);
    fin.openItem = {by: 'Noor Castellanos', day: at[0], at: at[1], inScope: false};
  }
  G.f.chFinMembers = true; touchCSF('Respond'); track();
  await say('14:00: your desk: the decision log.');
}

/* ---------- The decision log (14:00, your desk): one decider per decision ---------- */
async function chFinRoute() {
  const fin = chFin();
  await UI.openModal('The decision log', '<p>Monday, 14:00. Six decisions this week. For each, who decides? One decider each, whoever is on duty. You recommend and supply the facts. (game)</p>' +
    '<p class="small">CSF 2.0 (NIST CSWP 29) GV.RR-02: “Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced”. One of NIST’s examples for it, in the CSF 2.0 Implementation Examples: “Document who is responsible and accountable for cybersecurity risk management activities and how those teams and individuals are to be consulted and informed”.</p>',
    [{label: 'The first decision', meta: {good: true}}], {closable: false, cls: 'summary'});
  const rec = {first: [], picks: []};
  for (const d of CH_FIN_ROUTE) {
    const D = CH_FIN_DECISIONS.find(x => x.id === d.decision), items = d.choices.map(o => ({label: o.label, meta: {good: !!o.good}}));
    let first = true, pick = null;
    while (true) {
      const i = await choose(D.id + ': ' + D.short + '. Who decides?', items, {shuffle: true});
      if (pick === null) pick = i;
      if (items[i].meta.good) break;
      first = false;
      await say(d.choices[i].why);
    }
    rec.first.push(first); rec.picks.push(d.choices[pick].label);
  }
  fin.route = rec;
  await UI.openModal('The decision log, as recorded', chFinRouteHtml() + '<p>Your first picks: <b>' + rec.first.filter(Boolean).length + ' of ' + rec.first.length + '</b> to the decider the rules name. (game)</p>',
    [{label: 'Pin it to the incident page', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chFinRoute = true; unlock('act', 'chfinroute'); touchCSF('Govern'); track();
  await say('End the day at your desk.');
}

/* ---------- Tuesday 09:00 (Edda's desk): Wellhollow's second answer and our own job log ---------- */
async function chFinAnswer2() {
  const who = 'Edda Thornquist';
  await say('09:00. Wellhollow’s second answer: files on one of its stores were copied out between 21:58 and 22:40 on Day 91. Whose files, they don’t know yet.', who);
  await say('09:40. And our own job log names the store for every night: every copy from Day 58 to Day 92, 35 nights, went to that one. The copies stay paused, my decision.', who);
  G.f.chFinAnswer2 = true; touchCSF('Respond'); track();
  await say('11:30: Marit, at her desk.');
}

/* ---------- The directive (game; Tuesday 11:30): Marit asks to hold packet 2 ---------- */
async function chFinDirective() {
  const who = 'Marit Quellan', fin = chFin();
  await say('11:30. Payroll’s copies are on that store too. Hold Noor’s packet until Wellhollow says whose files went. If it isn’t ours, we’ll have alarmed every member for nothing.', who);
  const items = CH_FIN_DIRECTIVE.map(o => ({label: o.label, meta: {good: !!o.good}}));
  let first = true;
  while (true) {
    const i = await choose('Marit’s request: what do you tell her?', items, {shuffle: true});
    if (items[i].meta.good) break;
    first = false;
    await say(CH_FIN_DIRECTIVE[i].why);
  }
  fin.directive = {first: first};
  await say('Fair. Counsel decides on what we know and what we don’t. My worry goes to Noor too, then.', who);
  G.f.chFinDirective = true; unlock('act', 'chfindirective'); touchCSF('Govern'); track();
  await say('12:10: from Edda’s team, a test restore of the Clinic’s share from our own local copies: good. 13:30: your desk, facts packet 2. (game)');
}

/* ---------- Tuesday 15:00 (Noor): the determination, then drill 3 ---------- */
async function chFinDetermine() {
  const who = 'Noor Castellanos', fin = chFin();
  await say('15:00. On the facts in your packets: personal records held for the town may have been acquired by someone not authorised. That is my determination, as counsel for the town and the shared services. Each member’s counsel decides for its own.', who);
  fin.determination = {by: 'Noor Castellanos', for: 'the town and the shared services', at: CH_FIN_EVENTS.determination.at.slice()};
  G.f.chFinDetermine = true; touchCSF('Respond'); track();
  await say('15:30. N-3 for the town starts from that. When does its clock start, and when is it due?', who);
  await chFinDrill('finclock');
  G.f.chFinDrillC = true; unlock('act', 'chfinclock'); track();
  await say('End the day at your desk.');
}

/* ---------- Wednesday 09:00 (your desk): the clock and the comparison card ---------- */
async function chFinClockView() {
  await UI.openModal('The disclosure clock', '<p>Wednesday, 09:00. The Compact’s rules, each with its trigger and its due time, as the records time them. (game)</p>' + chFinClockHtml(chAt(94, '09:00')) + CH_FIN_SEC_HTML +
    '<p class="small">CSF 2.0 (NIST CSWP 29) RS.CO-02: “Internal and external stakeholders are notified of incidents”. One of NIST’s examples for it, in the CSF 2.0 Implementation Examples: “Notify law enforcement agencies and regulatory bodies of incidents based on criteria in the incident response plan and management approval”.</p>',
    [{label: 'Packet 3', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chFinClock = true; unlock('fact', 'chfinsec'); unlock('act', 'chfinrules'); touchCSF('Respond'); track();
  await chFinPacket3();
}

/* ---------- Wednesday 12:00 (the Board room): the chair decides the statement ---------- */
function chFinStatementText() {
  const P = chFinPacketDef('P3');
  return P.rows.filter(r => r.req).map(r => r.variants.find(v => v.good).label).join('. ') + '.';
}
async function chFinStatement() {
  const who = 'Ivor Penhallow', fin = chFin(), s = fin.packets.P3 && fin.packets.P3.sent, g = fin.packets.P3 && fin.packets.P3.grade;
  await say('12:00. Noor on what we may say, Ada on how we say it. ' + (s && s.at <= chAt(94, '12:00') ? 'Your facts are in front of me.' : 'Your facts are not in front of me, so I have Noor’s and Edda’s.'), who);
  await say('Plain words, what we know and what we don’t, and nobody’s details. If a reporter calls you, you send them to me.', 'Ada Pemberton');
  const fixed = g ? g.rows.filter(x => x.required && x.grade !== 'supported').map(x => x.id) : [];
  fin.statement = {by: 'Ivor Penhallow', day: 94, at: '12:00', out: '14:00', advice: ['Noor Castellanos', 'Ada Pemberton'], text: chFinStatementText(), corrected: fixed};
  await UI.openModal('The Compact’s statement', '<p>12:00: the chair decides, on Noor’s and Ada’s advice. 14:00: it goes out. (game)</p><blockquote>' + esc(fin.statement.text) + '</blockquote>' +
    (fixed.length ? '<p>From your packet, the chair took the record’s wording for ' + esc(fixed.join(', ')) + '.</p>' : '<p>Each line from your packet, as the records support it.</p>'),
    [{label: 'Back to the floor', meta: {good: true}}], {closable: false, cls: 'summary'});
  G.f.chFinStatement = true; unlock('act', 'chfinstatement'); touchCSF('Respond'); track();
  await say('My decision. 14:30: Noor has three terminals for you, south-west.', who);
}

/* ---------- The Disclosure terminals (Noor's) ---------- */
async function chFinDojoIntro() {
  G.f.chFinDojoMet = true;
  await say('Three terminals, south-west: what the court record says in the Uber case, how the SolarWinds case ended, and how a US public company is timed. Real cases, read from their own records. Comparisons, not our rules.', 'Noor Castellanos');
  unlock('fact', 'chcases');
}
async function chFinDojoPuzzle(i) {
  const f = G.f, fin = chFin();
  if (i < 0) return;
  if (!f.chFinDojoMet) { await say('A training terminal: “Disclosure”. Noor’s. Talk to her first.'); return; }
  const q = CH_FIN_DOJO[i];
  if (fin.dojo[i]) { await say('Solved. ' + q.explain); return; }
  while (true) {
    const k = await choose(q.q, q.opts.map((o, j) => ({label: o, meta: {good: j === q.good}})), {shuffle: true});
    if (k === q.good) break;
    await say('Not quite. Read it as the record reads.');
  }
  await say('Correct. ' + q.explain);
  fin.dojo[i] = true; touchCSF('Govern');
  if (!fin.dojo.every(Boolean) || f.chFinDojoDone) return;
  f.chFinDojoDone = true; G.focusMax += 2; G.focus = Math.min(G.focusMax, G.focus + 2); track();
  await say('All three. Focus ' + G.focusMax + ' (game). End the day at your desk.', 'Noor Castellanos');
}

/* ---------- Thursday 14:00 (the Board): three questions keyed to the packets as sent ---------- */
const CH_FIN_MEMBERS = ['The Clinic’s representative', 'The School District’s representative', 'The town’s representative'];
function chFinBoardQs() {
  const fin = chFin(), order = {omitted: 0, misplaced: 1, overstated: 2, unsupported: 3};
  const rows = CH_FIN_PACKETS.flatMap(P => (fin.packets[P.id] && fin.packets[P.id].grade ? fin.packets[P.id].grade.rows : []).map(x => Object.assign({P: P}, x)));
  const weak = rows.filter(x => order[x.grade] !== undefined).sort((a, b) => order[a.grade] - order[b.grade] || CH_FIN_PACKETS.indexOf(a.P) - CH_FIN_PACKETS.indexOf(b.P) || a.P.rows.findIndex(r => r.id === a.id) - b.P.rows.findIndex(r => r.id === b.id));
  const qs = weak.slice(0, 3).map((x, i) => { const r = x.P.rows.find(y => y.id === x.id);
    return {row: x.id, packet: x.P.id, grade: x.grade, title: 'A member’s question', who: CH_FIN_MEMBERS[i],
      ask: x.grade === 'omitted' ? '“Your ' + x.P.title.split(' · ')[0].toLowerCase() + ' said nothing about ' + r.topic + '. What should it have said?”' : '“Your ' + x.P.title.split(' · ')[0].toLowerCase() + ' said: ' + x.line + '. Is that what the records show?”',
      resp: r.variants.map(v => ({label: v.label, good: !!v.good, why: v.why}))}; });
  for (const s of CH_FIN_BOARD_SPECS()) if (qs.length < 3) qs.push(Object.assign({row: null}, s));
  return qs;
}
// The Board's decision of record on each owner's acceptance that breaks one of its tolerances (S-7), applied in the minute.
function chFinTolDecide() {
  const st = chRiskStates(), out = [];
  for (const a of (G.ch.accept || []).filter(x => !x.closed && x.decider !== 'Board' && !x.boardDecided)) {
    const r = st.find(x => x.id === a.line); if (!r || !r.breaks.length) continue;
    a.boardDecided = {day: 95, at: '15:00', by: 'the Compact Board (minute, Day 95)', decision: 'carried to its Day 155 review, its interim measures kept'};
    out.push(a);
  }
  return out;
}
function chFinMinute(asked) {
  const fin = chFin(), dec = chFinTolDecide(), F = CH_FIN_PACKETS.map(P => [P, fin.packets[P.id]]).filter(([, x]) => x && x.sent);
  const fixed = asked.filter(q => q.row).map(q => { const P = chFinPacketDef(q.packet), r = P.rows.find(y => y.id === q.row); return r.id + ', “' + r.variants.find(v => v.good).label + '”'; });
  const rest = F.flatMap(([P, x]) => x.grade.rows.filter(y => (y.in && y.grade !== 'supported') || y.grade === 'omitted').map(y => y.id)).filter(id => !asked.some(q => q.row === id));
  const n3 = chFinDue(CH_FIN_RULES.find(r => r.id === 'N-3'));
  const sh = a => (CH_REP_SHORT[a.line] || a.line) + ' (' + a.signedBy.split(' ')[0] + ', Day ' + a.day + ')';
  return '15:00. The minute records the incident as the packets put it: ' + F.map(([P, x]) => P.id + ' sent ' + chAtText(x.sent.at) + ', ' + (x.sent.onTime ? 'on time' : 'late') + ' against ' + chAtText(x.sent.due)).join('; ') + '.' +
    ' The decisions, each with its decider: the copies paused (Edda, Day 92 07:40); any notice for the town (Noor, her determination Day 93 15:00, N-3 due ' + (n3 ? chAtText(n3.due) : 'when determined') + '); each member’s notice (its own counsel); the statement (the chair, Day 94 12:00, on Noor’s and Ada’s advice).' +
    (fixed.length ? ' Corrected in this minute, at the members’ questions: ' + fixed.join('; ') + '.' : ' No correction asked.') +
    (rest.length ? ' The chair asks for ' + rest.join(', ') + ' to be read again against the records.' : '') +
    (dec.length ? ' Decided in this minute, this Board the decider of record: ' + dec.map(sh).join(', ') + ', breaking this Board’s ' + [...new Set(dec.flatMap(a => chRiskStates().find(r => r.id === a.line).breaks.map(chTolName)))].join(', ') + ' tolerance on its owner’s acceptance: carried to its Day 155 review, its interim measures kept.' : '') +
    ' From today, an owner’s acceptance that breaks one of this Board’s tolerances goes to the chair within five working days of its signing, and into this Board’s next minute.' +
    (chFinOpenItem() ? ' The suspicion file noted as an open item, with counsel, with no conclusion.' : '') + ' (game)';
}
async function chFinBoardRound() {
  const who = 'Ivor Penhallow', f = G.f, fin = chFin();
  await say('14:00. The members’ representatives, Edda, Marit, Noor and Ada. This Board has your three packets as you sent them. Three questions.', who);
  const qs = chFinBoardQs();
  fin.board = {first: [], asked: qs.map(q => q.row || q.title)};
  await chStages(qs, fin.board.first);
  fin.minute = chFinMinute(qs);
  await say(fin.minute, who);
  chAudit('Finale: the Board’s minute (Day 95)');
  f.chFinBoard = true; f.chHeavingLine = true;
  G.focusMax += 4; G.focus = G.focusMax; unlock('act', 'chfinboard'); touchCSF('Govern'); track();
  await say('You brought this Board the facts on time, and counsel first. This is the Heaving Line Badge (game): the light line thrown first, so the heavy one can follow.', who);
  await say('Its power: in the next edition, every facts packet arrives with its rule’s due time beside it. And Focus +4.', who);
  await say('16:00: your desk. The edition’s end.');
}

/* ---------- The edition's end (Thursday 16:00, your desk) ---------- */
function chFinEditionRows() {
  const c = G.ch, sup = c.sup, pol = c.pol, rep = c.rep, fin = c.fin, fs = chFinStats();
  const n = x => x ? x.met + ' of ' + x.total : '—';
  return '<table class="sc"><tr><th>District</th><th>Drills (needs met)</th></tr>' +
    '<tr><td>Budget</td><td>' + n(c.needs) + '</td></tr>' +
    '<tr><td>Suppliers</td><td>' + n(sup && sup.needs) + '</td></tr>' +
    '<tr><td>Policy</td><td>' + n(pol && pol.needs) + '</td></tr>' +
    '<tr><td>Board report</td><td>' + n(rep && rep.needs) + '</td></tr>' +
    '<tr><td>Finale</td><td>' + n(fin && fin.needs) + '</td></tr></table>' +
    '<p>Badges: ' + [['chBallast', 'Ballast'], ['chHawser', 'Hawser'], ['chSheetBend', 'Sheet Bend'], ['chRollingHitch', 'Rolling Hitch'], ['chHeavingLine', 'Heaving Line']].map(([k, b]) => b + ' ' + (G.f[k] ? 'yes' : '—')).join(' · ') + '.</p>' +
    '<p>Your advice as sent: report score <b>' + (rep && rep.grade ? rep.grade.score : '—') + '</b> / 100; facts packets, average score <b>' + (fs.score === null ? '—' : fs.score) + '</b> / 100, on time <b>' + (fs.onTime === null ? '—' : fs.onTime + '%') + '</b>; decisions routed at the first pick <b>' + (fs.routed === null ? '—' : fs.routed + '%') + '</b>. (game)</p>';
}
async function chFinEnd() {
  const f = G.f, fin = chFin();
  if (!f.chFinSummary) {
    f.chFinSummary = true; touchCSF('Govern'); chAudit('Finale: the district’s end (Day 95)');
    Series.markEdition('charter', {finale: true, editionComplete: true, heavingLine: !!f.chHeavingLine});
    await say('The facts reached counsel first, and on time, with what was not known said plainly. That is the job. Thank you.', 'Ivor Penhallow');
  }
  const body = '<p class="big">Charter: the edition’s end.</p>' +
    '<p>' + esc(G.name) + ' · <b>' + esc(G.rank) + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Day <b>' + G.day + '</b> (' + (CH_DAY[G.day] || '') + ')</p>' +
    '<p>Monday: the log opened at 06:25, the copies paused at 07:40 (Edda’s decision), packet 1 ' + (fin.packets.P1 && fin.packets.P1.sent ? (fin.packets.P1.sent.onTime ? 'on time' : 'late') : 'not sent') + ', the members told at 11:00, the decision log. Tuesday: Wellhollow’s second answer, Marit’s request ' + (fin.directive && fin.directive.first ? 'answered at the first try' : 'answered, after a false start') + ', packet 2 ' + (fin.packets.P2 && fin.packets.P2.sent ? (fin.packets.P2.sent.onTime ? 'on time' : 'late') : 'not sent') + ', Noor’s determination at 15:00. Wednesday: the clock, packet 3 ' + (fin.packets.P3 && fin.packets.P3.sent ? (fin.packets.P3.sent.onTime ? 'on time' : 'late') : 'not sent') + ', the chair’s statement. Thursday: the Board’s questions ' + (fin.board && fin.board.first.every(Boolean) ? 'answered at the first try' : 'answered, with false starts the debriefs named') + '.</p>' +
    '<h3>The clock, at Thursday 16:00</h3>' + chFinClockHtml(chAt(95, '16:00')) +
    (fin.minute ? '<p class="small">' + esc(fin.minute) + '</p>' : '') +
    '<h3>The edition, district by district</h3>' + chFinEditionRows() +
    '<h3>The register: today and on the Board’s plan</h3>' + chFinRegisterHtml() +
    '<p>Lesson (game): in an incident the CISO establishes the facts on time, contains without destroying evidence, keeps the record of who knew what and when, and puts the facts in front of the deciders. What is not known goes in, stated as not known. Each clock starts where its rule says. Counsel decides any notice, the chair the statement, each owner its service, and the CISO decides none of them.</p>' +
    '<h3>Your scorecard</h3>' + scorecardHtml() +
    (Series.qt().evicted ? '' : '<p class="small">The Quiet Thread is still open: ' + qtCount() + ' notes in the suspicion file, with counsel and Rae Okafor’s team. Who, and why: not yet known.</p>') +
    '<p class="big">Next edition: coming later (the vCISO edition).</p>';
  while (true) {
    const i = await UI.openModal('The end of Charter', body, [{label: 'Keep exploring the Compact offices', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
