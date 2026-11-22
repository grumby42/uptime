/* ============================================================
   UPTIME · editions/charter/disclosure.js
   Charter's disclosure primitives (game models), used by the finale:
   - the disclosure clock: the game's own notification rules for the Compact
     (CH_FIN_RULES, finale-data.js; the Compact is a public authority, not an SEC
     registrant, and no law is named). Each rule names its trigger in its own
     words, and the clock starts at the recorded time of that trigger, not at
     the time anyone prefers (chFinDue): hours, or working days (Saturday and
     Sunday skipped: chWdAdd). A rule may name two triggers, and then its clock
     starts at whichever was recorded first (fix pass S-1: N-1 and N-2 start at
     the notice's receipt or the log's first entry, so the person the rule
     times cannot start it late). A rule whose trigger has not happened has no
     clock;
   - the narrative clock (fix pass M-1): each step of the finale has its time,
     and the last step done is "now" (chFinNow). A packet reaches each
     recipient at its recorded time (chFinReached), and no character speaks
     of, or decides on, a packet before it has reached them (chFinHas);
   - the facts packets: what counsel (and, for the statement, the chair and
     communications) needs at each checkpoint, row by row, each row with one
     supported wording and weak ones (unsupported, overstated, misplaced), graded
     on the slice 4 scale: +20 a supported required row, 0 a supported optional
     one, -10 a weak row, -20 a required row left out. Only required rows earn,
     so no optional row cancels a penalty. What is not known, stated as not
     known, is a required row: it earns. Every wording cites as many records as
     the supported one, and the editor shows none. Each packet as sent is the
     CISO's, with its sent time against its rule's due time (on time or late);
   - the decision log: each decision of the incident with the one decider the
     rules name (whoever is on duty). The CISO's routing is advice, scored on
     the first pick; the decision is always made by its decider;
   - the finale's rule for tolerances (review_charter4 S-7, decided in the
     finale spec's build): the Board is the decider of record for an owner's
     acceptance that breaks one of its own tolerances, and until its next minute
     the chair decides it within five working days of the signing.
   The CISO recommends and supplies facts; the CISO never decides disclosure.
   State: G.ch.fin (chFin() creates it, so a save from slice 4 loads too).
   ============================================================ */
'use strict';

function chFin() {
  const c = G.ch;
  if (!c.fin) c.fin = {drills: {}, needs: {met: 0, total: 0}, log: null, contain: null, packets: {}, route: null, directive: null, dojo: [false, false, false], determination: null, openItem: null, statement: null, board: null, minute: null};
  if (G.targets && G.targets.chFinClaims === undefined) Object.assign(G.targets, {chFinClaims: 100, chFinRequired: 100, chFinOnTime: 100, chFinRouted: 100});
  return c.fin;
}

/* ---------- Time: Day and clock, working days ---------- */
const CH_WD = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const chWeekday = d => CH_WD[(d - 1) % 7];
const chIsWorkday = d => (d - 1) % 7 < 5;
const chMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
// A moment as minutes from Day 0 00:00, and back.
const chAt = (d, t) => d * 1440 + chMin(t);
const chAtText = m => 'Day ' + Math.floor(m / 1440) + ' ' + chHm(m % 1440);
// n working days after day d (d itself not counted; Saturday and Sunday skipped).
function chWdAdd(d, n) { let x = d, k = 0; while (k < n) { x++; if (chIsWorkday(x)) k++; } return x; }
function chDur(m) { const h = Math.floor(m / 60), r = m % 60; return h + ' hour' + (h === 1 ? '' : 's') + (r ? ' ' + r + ' minute' + (r === 1 ? '' : 's') : ''); }

/* ---------- The clock ---------- */
// The recorded events the rules can name as triggers (game times, finale-data.js: CH_FIN_EVENTS), less any not yet
// recorded in this run: a trigger that has not happened starts no clock.
function chFinEvents() {
  const fin = chFin(), out = {};
  for (const k in CH_FIN_EVENTS) { const e = CH_FIN_EVENTS[k]; if (!e.when || e.when(G.f, fin)) out[k] = e; }
  return out;
}
function chFinDue(rule, ev) {
  const E = ev || chFinEvents(), ts = [].concat(rule.trigger || []).map(k => E[k]).filter(Boolean);
  if (!ts.length) return null;
  const t = ts.reduce((a, b) => chAt(b.at[0], b.at[1]) < chAt(a.at[0], a.at[1]) ? b : a);
  const start = chAt(t.at[0], t.at[1]);
  if (rule.window.h) return {start, due: start + rule.window.h * 60, from: t};
  if (rule.window.wd) return {start, due: chAt(chWdAdd(t.at[0], rule.window.wd), t.at[1]), from: t};
  return {start, due: null, from: t};
}
// The clock as it stands at a moment: each rule, its trigger, its due time, and what was done when (a done time
// recorded by the run, e.g. the packet as sent).
function chFinClock(now) {
  const E = chFinEvents(), fin = chFin();
  return CH_FIN_RULES.map(r => {
    if (!r.window.h && !r.window.wd) return {rule: r, d: null, done: null, state: 'no clock of its own'};
    const d = chFinDue(r, E), done = r.done ? r.done(fin, G.f) : null;
    const state = !d ? 'not started: its trigger has not happened' : done !== null && done !== undefined ? (done <= d.due ? 'met' : 'late') : (now !== undefined && now > d.due ? 'overdue' : 'running');
    return {rule: r, d, done, state};
  });
}
function chFinClockHtml(now) {
  const dt = m => esc(Math.floor(m / 1440) + ' ' + chHm(m % 1440)), word = st => ({'no clock of its own': 'none', 'not started': 'waits'})[st.split(':')[0]] || st.split(':')[0];
  return '<table class="sc"><tr><th>Rule</th><th>Starts (Day)</th><th>Due (Day)</th><th>Now</th></tr>' + chFinClock(now).map(x =>
    '<tr><td>' + esc(x.rule.id) + '</td><td>' + (x.d ? dt(x.d.start) : '—') + '</td><td>' + (x.d && x.d.due !== null ? dt(x.d.due) : '—') + '</td><td>' + esc(word(x.state)) + '</td></tr>').join('') + '</table>' +
    '<ul>' + chFinClock(now).map(x => '<li><b>' + esc(x.rule.id + ' ' + x.rule.name) + '</b>: “' + esc(x.rule.text) + '” ' + (!x.rule.window.h && !x.rule.window.wd ? 'No clock of its own.' : 'Its clock starts at ' + esc(x.rule.startsAt) + (x.d ? ': ' + esc(chAtText(x.d.start)) + '.' : ', which has not happened yet.')) + ' Who: ' + esc(x.rule.decider) + '.</li>').join('') + '</ul>' +
    '<p class="small">The Compact’s own rules (game). The Compact is a public authority, not an SEC registrant, and no law is stated here: counsel decides what any law asks, Noor for the town and the shared services, each member’s own counsel for that member.</p>';
}

/* ---------- The narrative clock (fix pass M-1) ---------- */
// Each step of the finale with the time its scene ends (game; docs/design/charter-timeline.md, slice 5): the last step
// done is "now". Before the finale, null.
const CH_FIN_STEPS = [['chFinSummary', 95, '16:00'], ['chFinBoard', 95, '15:00'], ['chFinDay94', 95, '08:30'], ['chFinDojoMet', 94, '14:30'], ['chFinStatement', 94, '14:30'],
  ['chFinPacket3', 94, '10:00'], ['chFinClock', 94, '09:00'], ['chFinDay93', 94, '08:30'], ['chFinDrillC', 93, '16:30'], ['chFinDetermine', 93, '15:00'], ['chFinPacket2', 93, '14:10'],
  ['chFinDirective', 93, '12:10'], ['chFinAnswer2', 93, '09:40'], ['chFinDay92', 93, '08:30'], ['chFinRoute', 92, '14:00'], ['chFinMembers', 92, '11:40'], ['chFinPacket1', 92, '10:00'],
  ['chFinDrillB', 92, '09:30'], ['chFinDrillA', 92, '09:00'], ['chFinContain', 92, '08:05'], ['chFinLog', 92, '06:25'], ['chFinStart', 92, '06:15']];
function chFinNow() { const s = CH_FIN_STEPS.find(([k]) => G.f[k]); return s ? chAt(s[1], s[2]) : null; }
// When packet id reached 'noor' (counsel; for packet 3, the chair: its rule's recipient) or 'chair', as sent; null if not sent.
function chFinReached(id, who) {
  const rec = chFin().packets[id], s = rec && rec.sent; if (!s) return null;
  if (who !== 'chair') return s.at;
  if (s.chair !== undefined) return s.chair;
  const o = (CH_FIN_SEND[id] || [])[s.choice]; return o && o.chair ? chAt(o.chair[0], o.chair[1]) : s.at;
}
function chFinHas(id, who, now) { const r = chFinReached(id, who), t = now === undefined ? chFinNow() : now; return r !== null && t !== null && r <= t; }
function chFinSentKind(id) { const s = chFin().packets[id] && chFin().packets[id].sent; if (!s) return null; if (s.kind) return s.kind; const o = (CH_FIN_SEND[id] || [])[s.choice]; return o ? o.kind : null; }
// What the packets as sent got wrong in time, route or unknowns (fix pass M-2): the chair's praise and the edition's end
// read this, not a scripted end state.
function chFinSentIssues() {
  const fin = chFin(), out = [], whom = {P1: 'Noor', P2: 'Noor', P3: 'the chair'}, rule = {P1: 'N-1’s', P2: 'Noor’s checkpoint,', P3: 'the chair’s request,'};
  for (const P of CH_FIN_PACKETS) {
    const rec = fin.packets[P.id], s = rec && rec.sent;
    if (!s) { out.push(P.title.split(' · ')[0].toLowerCase() + ' was not sent'); continue; }
    const k = chFinSentKind(P.id), n = P.title.split(' · ')[0].toLowerCase();
    if (!s.onTime || k !== 'rec') out.push(n + ' reached ' + whom[P.id] + ' at ' + chAtText(s.at) + (k === 'via' ? ', not straight from you' : '') + (s.onTime ? '' : ', after ' + rule[P.id] + ' ' + chAtText(s.due)));
    for (const x of rec.grade.rows.filter(x => x.unknown && x.grade !== 'supported')) out.push(x.id + ' ' + (x.grade === 'omitted' ? 'was not in ' + n : 'did not say plainly what was not known'));
  }
  return out;
}

/* ---------- Facts packets ---------- */
function chFinPacketDef(id) { return CH_FIN_PACKETS.find(p => p.id === id); }
function chFinRowGood(r) { return r.variants.findIndex(v => v.good) + 1; }
function chFinCycle(r) { return [0].concat(shuffleOrder(r.variants.map(v => ({label: v.label})), {shuffle: true}).map(i => i + 1)); }
function chFinRec(r) { return r.req || r.rec === 'in' ? chFinRowGood(r) : 0; }
function chFinPicks(id) {
  const fin = chFin(), P = chFinPacketDef(id), rec = fin.packets[id] || (fin.packets[id] = {picks: null, sent: null, grade: null});
  if (!rec.picks) rec.picks = Object.fromEntries(P.rows.map(r => [r.id, 0]));
  return rec.picks;
}
function chFinRefs(P, picks) {
  const set = new Set();
  for (const r of P.rows) if (picks[r.id]) for (const x of r.variants[picks[r.id] - 1].refs) set.add(x);
  return Object.keys(CH_FIN_RECORDS).filter(k => set.has(k));
}
// The open item (packet 1 only): the suspicion file, while it holds notes and the Quiet Thread is not evicted. Not a
// claim, not scored, not a row, and no conclusion: one defender-side observation consistent with the recorded notes,
// for counsel to decide whether it is in scope for any notice.
function chFinOpenItem() {
  const q = Series.qt();
  if (q.evicted || !q.cluesFound.length) return '';
  const cr = q.cluesFound.filter(id => /^(lb|sd|cn|dp|ap)-/.test(id)).length;
  return 'Open item (not a claim): the suspicion file, ' + q.cluesFound.length + ' note' + (q.cluesFound.length === 1 ? '' : 's') + ', with Rae Okafor’s team and counsel.' +
    (cr ? ' One observation: CP-OPS-02’s sign-in log, 30 days to 09:00, shows no sign-in from FD-STAFF-11’s address, the address every Crossroads note comes from.' : '') +
    ' Who, and why: not known. No link to Wellhollow’s incident is drawn. For counsel: in scope for any notice?';
}
function chFinPacketHtml(id, picks) {
  const P = chFinPacketDef(id), on = P.rows.filter(r => picks[r.id]);
  let h = '<p class="small">' + esc(P.head) + ' (game)</p>';
  h += on.length ? '<ol>' + on.map(r => '<li>' + esc(r.variants[picks[r.id] - 1].label) + '</li>').join('') + '</ol>' : '<p>The packet is empty.</p>';
  const oi = P.openItem ? chFinOpenItem() : '';
  if (oi) h += '<p class="small">' + esc(oi) + '</p>';
  const refs = chFinRefs(P, picks).concat(oi && /One observation/.test(oi) ? ['SIL'] : []);
  h += '<h3>The records</h3>' + (refs.length ? '<ul class="small">' + refs.map(k => '<li>' + esc(k) + ' · ' + esc(CH_FIN_RECORDS[k].name) + ' · ' + esc('Day ' + CH_FIN_RECORDS[k].at[0] + ' ' + CH_FIN_RECORDS[k].at[1]) + ' · ' + esc(CH_FIN_RECORDS[k].cust) + '</li>').join('') + '</ul>' : '<p class="small">No record cited.</p>') +
    '<p class="small">' + esc(CH_FIN_TIMEBASE) + '</p>';
  return h;
}
// The packet editor: each row cycles its wordings in a seeded order (so the first one shown says nothing about its
// grade), or is left out. No records are shown per wording.
async function chFinEdit(id) {
  const P = chFinPacketDef(id), picks = chFinPicks(id);
  let cur = 0;
  while (true) {
    const done = P.rows.every(r => picks[r.id] === chFinRec(r));
    const items = P.rows.map(r => ({label: picks[r.id] ? r.variants[picks[r.id] - 1].label : 'Left out: ' + r.name,
      note: (r.req ? 'Noor’s checkpoint asks for it. ' : 'Optional. ') + '(A cycles)', meta: {k: r.id, lr: true, bot: picks[r.id] !== chFinRec(r)}}));
    items.push({label: 'Read the packet as it stands', meta: {k: 'read'}});
    items.push({label: 'Send it', meta: {k: 'send', bot: done}});
    const body = '<p>' + esc(P.intro) + ' Left/right (or A) changes a row’s wording, or leaves it out. Rows in it: <b>' + P.rows.filter(r => picks[r.id]).length + ' of ' + P.rows.length + '</b>. (game)</p>';
    const r = await UI.openModal(P.title, body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    const step = (i, d) => { const row = P.rows[i]; if (!row) return; const cy = chFinCycle(row), at = cy.indexOf(picks[row.id] || 0); picks[row.id] = cy[(at + (d > 0 ? 1 : cy.length - 1)) % cy.length]; cur = i; };
    if (r && typeof r === 'object' && r.lr) { step(r.i, r.d); continue; }
    if (r >= 0 && r < P.rows.length) { step(r, 1); continue; }
    const k = items[r] && items[r].meta.k;
    if (k === 'read') { await UI.openModal('The packet as it stands', chFinPacketHtml(id, picks), [{label: 'Back to the rows', meta: {back: true}}], {closable: false, cls: 'summary'}); cur = r; continue; }
    if (k === 'send') return Object.assign({}, picks);
  }
}
// Grading a packet as sent (the slice 4 scale; no page limit: a packet is not a page).
function chFinGrade(id, picks) {
  const P = chFinPacketDef(id), out = [];
  for (const r of P.rows) {
    const p = picks[r.id] || 0, v = p ? r.variants[p - 1] : null;
    out.push({id: r.id, packet: id, name: r.name, topic: r.topic, required: !!r.req, unknown: !!r.unknown, pick: p, in: !!p, grade: v ? v.grade : r.req ? 'omitted' : 'out', why: v ? v.why : '', line: v ? v.label : ''});
  }
  const inc = out.filter(x => x.in), sup = inc.filter(x => x.grade === 'supported'), weak = inc.filter(x => x.grade !== 'supported');
  const req = out.filter(x => x.required), omitted = req.filter(x => !x.in), supReq = sup.filter(x => x.required);
  const points = 20 * supReq.length - 10 * weak.length - 20 * omitted.length;
  const reqInc = inc.filter(x => x.required);
  return {rows: out, supported: sup.length, weak: weak.map(x => x.id), omitted: omitted.map(x => x.id), unknownsStated: req.filter(x => x.unknown && x.grade === 'supported').map(x => x.id),
    supReq: supReq.length, reqSent: reqInc.length,
    score: req.length ? Math.max(0, Math.min(100, Math.round(100 * points / (20 * req.length)))) : 0,
    claims: inc.length ? Math.round(100 * sup.length / inc.length) : 0, required: req.length ? Math.round(100 * (req.length - omitted.length) / req.length) : 0, n: inc.length, reqN: req.length, reqIn: req.length - omitted.length};
}
const CH_FIN_GRADE_WORD = {supported: 'supported', unsupported: 'unsupported', overstated: 'overstated', misplaced: 'misplaced', omitted: 'left out (required)', out: 'left out'};
function chFinDebriefHtml(g, sent) {
  return '<table class="sc"><tr><th>Row</th><th>Sent as</th></tr>' + g.rows.filter(x => x.in || x.required).map(x => '<tr><td>' + esc(x.id + ' · ' + x.name) + '</td><td>' + esc(CH_FIN_GRADE_WORD[x.grade]) + '</td></tr>').join('') + '</table>' +
    '<ul>' + g.rows.filter(x => x.in && x.grade !== 'supported').map(x => '<li><b>' + esc(x.id + ' · ' + x.name) + '</b>: ' + esc(x.grade) + ', “' + esc(x.line) + '”. ' + esc(x.why) + '</li>').join('') +
    g.rows.filter(x => x.grade === 'omitted').map(x => '<li><b>' + esc(x.id + ' · ' + x.name) + '</b>: left out. The checkpoint asks for ' + esc(x.topic) + '. Leaving it out costs more than a dull row would' + (x.unknown ? ', and what is not known is a fact counsel needs' : '') + '.</li>').join('') + '</ul>' +
    '<p>Rows sent: <b>' + g.n + '</b> · claims supported <b>' + g.claims + '%</b> · required rows present <b>' + g.required + '%</b> · unknowns stated as unknowns <b>' + g.unknownsStated.length + '</b>' + (sent ? ' · sent ' + esc(chAtText(sent.at)) + ', due ' + esc(chAtText(sent.due)) + ': <b>' + (sent.onTime ? 'on time' : 'late') + '</b>' + (sent.to ? ' · to ' + esc(sent.to) : '') : '') + ' · packet score <b>' + g.score + '</b> / 100 (game; only required rows earn)</p>';
}
function chFinStats() {
  const fin = chFin(), sent = CH_FIN_PACKETS.map(P => fin.packets[P.id]).filter(x => x && x.sent && x.grade);
  if (!sent.length) return {claims: null, required: null, onTime: null, routed: fin.route ? chFinRoutePct() : null, score: null};
  // Fix pass S-10: rows supported counts the required rows sent only, so a supported optional row cannot lift it.
  const reqRows = x => x.grade.rows.filter(y => y.required && y.in), inc = sent.reduce((n, x) => n + reqRows(x).length, 0), sup = sent.reduce((n, x) => n + reqRows(x).filter(y => y.grade === 'supported').length, 0);
  const req = sent.reduce((n, x) => n + x.grade.reqN, 0), reqIn = sent.reduce((n, x) => n + x.grade.reqIn, 0);
  return {claims: inc ? Math.round(100 * sup / inc) : 0, required: req ? Math.round(100 * reqIn / req) : 0,
    onTime: Math.round(100 * sent.filter(x => x.sent.onTime).length / sent.length), routed: fin.route ? chFinRoutePct() : null,
    score: Math.round(sent.reduce((n, x) => n + x.grade.score, 0) / sent.length)};
}

/* ---------- The decision log: one decider per decision ---------- */
function chFinRoutePct() { const r = chFin().route; return r && r.first.length ? Math.round(100 * r.first.filter(Boolean).length / r.first.length) : null; }
function chFinRouteHtml(now) {
  const t = now === undefined ? chFinNow() : now, dt = d => d.done && t !== null && chAt(d.done[0], d.done[1]) <= t ? 'Day ' + d.done[0] + ' ' + d.done[1] + (d.what ? ': ' + d.what : '') : '—';
  return '<table class="sc"><tr><th>Decision</th><th>Decider</th><th>Decided</th></tr>' + CH_FIN_DECISIONS.map(d => '<tr><td>' + esc(d.id + ' ' + d.short) + '</td><td>' + esc(d.who) + '</td><td>' + esc(dt(d)) + '</td></tr>').join('') + '</table>';
}

/* ---------- Tolerances bind (review_charter4 S-7, decided in the finale) ---------- */
// From the Day 95 minute on: an open acceptance whose line breaks one of the Board's tolerances is the Board's (its
// decider), or carries the Board's decision in a minute, or the chair's (or the vice-chair's) within five working days of
// its signing, and then only until this Board's next minute after that decision (fix pass S-9: the ratification).
const CH_FIN_MINUTES = [[67, '15:00'], [74, '15:00'], [81, '15:00'], [88, '15:00'], [95, '15:00']];
function chFinAuditNow() {
  const bad = [], c = G.ch;
  if (!G.f.chFinBoard) return bad;
  const st = chRiskStates();
  for (const a of (c.accept || []).filter(x => !x.closed && x.decider !== 'Board')) {
    const r = st.find(x => x.id === a.line);
    const breaks = r ? r.breaks : (a.breaks || []);
    if (!breaks.length) continue;
    const cd = a.chairDecided, chairOk = cd && cd.day <= chWdAdd(a.day, 5);
    const cdAt = cd ? chAt(cd.day, cd.at || '12:00') : null, held = G.f.chFinBoard ? CH_FIN_MINUTES : CH_FIN_MINUTES.slice(0, -1);
    const minuteSince = cd && held.some(([d, t]) => chAt(d, t) > cdAt && d <= G.day);
    if (!a.boardDecided && !chairOk) bad.push(a.line + ': breaks the ' + breaks.map(chTolName).join(', ') + ' tolerance on its owner’s acceptance alone, with no decision by the Board or the chair');
    else if (!a.boardDecided && minuteSince) bad.push(a.line + ': the chair’s decision of Day ' + cd.day + ' is not in this Board’s next minute');
  }
  return bad;
}
// The register as it stands and as the Board decided it (S-7's last point): today's residual (no line has delivered:
// each one's "as now" option, its tolerances read now) and the target (the Board's decided option).
function chFinRegisterHtml() {
  const c = G.ch; if (!c.final) return '';
  const rows = CH_LINES.map(l => { const now = l.opts[0], o = chOpt(c.final, l), heldNow = chBreaks(now).filter(t => !chHeldTol().includes(t));
    const today = chLevelWithin(l.cat, now.res) && !heldNow.length, target = chLevelWithin(l.cat, o.res) && !chBreaks(o).length;
    return '<tr><td>' + l.id + '</td><td>' + now.res + (today ? '' : ', above') + '</td><td>' + o.res + (target ? '' : ', above') + '</td></tr>'; }).join('');
  return '<table class="sc"><tr><th>Line</th><th>Today</th><th>Target</th></tr>' + rows + '</table>' +
    '<p class="small">Today: the residual as things stand, no line’s money having delivered yet, with each tolerance read as it is today. Target: the residual on the Board’s decided plan. Reported separately, each named. (game)</p>';
}
