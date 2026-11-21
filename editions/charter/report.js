/* ============================================================
   UPTIME · editions/charter/report.js
   Charter's board-report primitive (game model), used by District 4, The Board
   report:
   - the facts a report is built from, read from the player's own records
     (chRepFacts): the acceptances still above appetite (each owner's, and the
     Board's own where its decision left a line above appetite, read on today's
     tolerances: chLineNow), the must-haves the plan as sent left out, the
     exceptions that expired, who decides each exception at Day 155 (the rule's
     decider, chExcDeciderKey), what comes back at the next budget cycle, the
     tier-1 contracts signed and sought. Nothing fixed is shown as earned;
   - the rows (CH_REP_ROWS): one line each on a one-page summary, each with one
     supported wording and weak ones (unsupported, overstated, misplaced), or
     left out; every wording cites as many records as the supported one, and the
     editor does not show them (the annex does, for the page as a whole); required rows (every above-appetite item and who accepted it,
     every decision with its decider and the CISO's recommendation, the expired
     exceptions, the supplier tier-1 gaps) and optional ones;
   - the editor: sections, each row cycling its wordings in a seeded order; the
     page and its annex of records (each record with its time, none after the
     report's own time);
   - the grading (chRepGrade), on the same scale as Crossroads' report.js: a
     supported required line scores, a weak one does not (here it costs), and a
     required row left out costs more than a dull line would, so an omission is
     worse than a dull report; a page over ten lines costs too. A supported
     optional line earns nothing, so no optional line can cancel a penalty;
   - the metrics, on the report as sent: claims supported, required items
     present, decisions with a named decider and the CISO's recommendation;
   - the Board's questions, keyed to the report as sent (chRepBoardQs): first
     every required row left out, then every weak line sent; the Board's
     standing questions fill any round left;
   - rules and records agree (chRepAuditNow): the report's required rows are
     exactly what the risk states (chRiskStates), the exception register and the
     supplier acceptances say, and each fixed wording still matches its records.
   The CISO decides what the report says: the report as sent is the CISO's,
   recorded as the CISO's, and the scorecard reads it.
   State: G.ch.rep (chRep() creates it, so a save from slice 3 loads too).
   ============================================================ */
'use strict';

function chRep() {
  const c = G.ch;
  if (!c.rep) c.rep = {drills: {}, needs: {met: 0, total: 0}, records: null, directive: null, dojo: [false, false, false], picks: null, sent: null, grade: null, board: null, minute: null};
  if (G.targets && G.targets.chRepClaims === undefined) Object.assign(G.targets, {chRepClaims: 100, chRepRequired: 100, chRepDecide: 100});
  return c.rep;
}
const chRepAt = a => 'Day ' + a[0] + ' ' + a[1];
const chRepAnd = l => l.length > 1 ? l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1] : l[0] || '';
const chRepCap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

/* ---------- The facts, from the records ---------- */
// Business terms on the page (the account names are in the annex's records).
const CH_REP_SHORT = {AP: 'the airport’s directory trust', 'CP-XFER': 'the payroll supplier’s transfer account back in service'};
function chRepFacts() {
  const c = G.ch, F = {}, up = chLine('R6').opts.length - 1;
  const open = (c.accept || []).filter(a => !a.closed);
  const lineAbove = id => { const l = chLine(id); if (!l) return true; const st = chLineNow(l); return !!st && !st.within; };
  // The register's acceptances still above appetite today: the Board's (its decision left the line above) and the owners'.
  const board = open.filter(a => a.decider === 'Board' && lineAbove(a.line)), owner = open.filter(a => a.decider !== 'Board' && lineAbove(a.line));
  F.boardIds = board.map(a => a.line); F.ownerIds = owner.map(a => a.line);
  F.boardLines = chRepAnd(F.boardIds);
  F.boardSigners = chRepAnd([...new Set(board.map(a => a.signedBy.split(' ')[0]))]);
  F.ownerAcc = chRepCap(chRepAnd(owner.map(a => (CH_REP_SHORT[a.line] || (a.gap ? a.line + ' until its line delivers' : a.line)) + ' (' + a.signedBy.split(' ')[0] + ')')));
  // The must-haves left out of the plan as sent: each the CISO's recommendation, decided and signed by its owner.
  const mh = ((c.sup && c.sup.accept) || []).filter(a => !a.closed);
  F.mhIds = mh.map(a => 'MH ' + a.line); F.mhList = chRepAnd(mh.map(a => a.line)); F.mhOwner = mh.length > 1 ? 'each one’s owner' : 'its owner';
  // The register's lines today.
  const now = c.final ? CH_LINES.map(l => ({l: l, st: chLineNow(l), funded: chOpt(c.final, l) !== l.opts[0]})) : [];
  F.within = now.filter(x => x.st.within).length; F.asnow = now.filter(x => x.st.within && x.funded).length;
  // The exceptions that expired since the last quarterly Board (Day 64), and who decides EX-02 and EX-04 at Day 155.
  const exc = (c.pol && c.pol.exc) || [];
  F.expiredIds = exc.filter(e => !e.seed && typeof e.expiry === 'number' && e.expiry >= 64 && (e.expiry < G.day || chExcStatus(e) === 'expired')).map(e => e.id);
  const who = e => { const k = e ? chExcDeciderKey(e) : 'owner'; return k === 'chair' ? 'the chair' : k === 'board' ? 'this Board, in its minute,' : k === 'member' ? e.memberLead : e.owner; };
  const e2 = exc.find(e => e.id === 'EX-02'), e4 = exc.find(e => e.id === 'EX-04'), w2 = who(e2), w4 = who(e4);
  F.renewKeys = [e2 && chExcDeciderKey(e2), e4 && chExcDeciderKey(e4)];
  F.renewDecide = w2 === w4 ? w2 + ' decides each' : w2 + ' decides EX-02, and ' + w4.replace(/, in its minute,$/, ' EX-04 in its minute');
  // What comes back at the start of next year's budget cycle.
  F.cycleWhat = F.boardIds.length ? F.boardLines + ', deferred by this Board, come back for funding' : c.final && c.final.R6 !== up ? 'the upgrade, R6, comes back as the extension ends' : '';
  F.cycleRec = F.boardIds.length ? 'funding them first, being above appetite' : 'funding it then';
  // The Compact's tier-1 contracts: signed with every must-have (none yet) and sought in the plan as sent.
  const t1 = CH_SUP_CONTRACTS.filter(k => chTierRule(chSupLine(k.id)) === 1), plan = c.sup && c.sup.planSent;
  const ps = plan ? chPlanStats(plan) : null, miss = ps ? t1.flatMap(k => ps.per[k.id].miss.map(x => chSupLine(k.id).short + ' ' + x)) : null;
  F.t1 = t1.map(k => k.id);
  F.sought = !ps ? 'none sought yet' : miss.length ? 'all but ' + chRepAnd(miss) + ' sought' : 'every must-have sought in both';
  return F;
}
function chRepFill(t, F) { return String(t).replace(/\{(\w+)\}/g, (m, k) => F[k] !== undefined ? String(F[k]) : m); }
// The rows this report has (from the facts), each with its required flag.
function chRepRows(F) {
  const f = F || chRepFacts();
  return CH_REP_ROWS.filter(r => !r.when || r.when(f)).map(r => Object.assign({}, r, {required: typeof r.req === 'function' ? !!r.req(f) : !!r.req}));
}
function chRepRow(id) { return CH_REP_ROWS.find(r => r.id === id); }
function chRepGood(r) { return r.variants.findIndex(v => v.good) + 1; }
// A row's wordings in a seeded order (so the first wording shown says nothing about its grade); 0 is "left out".
function chRepCycle(r) { return [0].concat(shuffleOrder(r.variants.map(v => ({label: v.label})), {shuffle: true}).map(i => i + 1)); }
// The recommended pick (the bot's): the supported wording for a required row or a row recommended in, else left out.
function chRepRec(r) { return r.required || r.rec === 'in' ? chRepGood(r) : 0; }
function chRepLineText(r, pick, F) { return pick ? chRepFill(r.variants[pick - 1].label, F) : ''; }

/* ---------- The Day 67 minute and the acceptances, as recorded (drill 3's records) ---------- */
function chRepDrillFill(D) {
  const c = G.ch, F = chRepFacts(), d = JSON.parse(JSON.stringify(D));
  const m = chBudgetMinuteParts(c), acc = (c.accept || []).filter(a => a.line === 'R2' || a.line === 'R3');
  const fill = {minute67: m.head + m.minute,
    accR23: acc.length ? acc.map(a => a.line + ': decided by ' + a.decidedBy + (a.approvedBy ? ', the residual approved by ' + a.approvedBy : '') + ', signed by ' + a.signedBy + ', its owner, for ' + a.signedFor).join('. ') : 'None for R2 or R3',
    accList: (c.accept || []).map(a => (CH_REP_SHORT[a.line] || a.line) + ': ' + a.decidedBy.split(',')[0] + (a.closed ? ', closed Day ' + a.closedDay : '')).join('. ')};
  for (const s of d.sources) for (const q of s.qs) if (q.res) q.res = q.res.map(x => chRepFill(x, Object.assign({}, F, fill)));
  return d;
}

/* ---------- The page and its annex ---------- */
function chRepPicks() {
  const p = chRep(), F = chRepFacts();
  if (!p.picks) p.picks = {};
  for (const r of chRepRows(F)) if (p.picks[r.id] === undefined) p.picks[r.id] = 0;
  return p.picks;
}
function chRepRefs(picks, F) {
  const set = new Set();
  for (const r of chRepRows(F)) if (picks[r.id]) for (const x of r.variants[picks[r.id] - 1].refs) set.add(x);
  return Object.keys(CH_REP_RECORDS).filter(k => set.has(k));
}
// The open item: the suspicion file, while it holds notes and the Quiet Thread is not evicted. Not a claim, not scored,
// not a line on the page, and no conclusion. The investigation's detail stays out of the Board papers (which go to every
// member's representative): Noor, as counsel, decided on Day 86 at 10:00 that one observation from the Crossroads notes
// goes to the chair in confidence, and the papers say only that.
function chRepOpenCr() { const q = Series.qt(); return q.evicted ? 0 : q.cluesFound.filter(id => /^(lb|sd|cn|dp|ap)-/.test(id)).length; }
function chRepOpenItem() {
  const q = Series.qt();
  if (q.evicted || !q.cluesFound.length) return '';
  return 'Open item (not a claim): the suspicion file, ' + q.cluesFound.length + ' note' + (q.cluesFound.length === 1 ? '' : 's') + ', with Rae Okafor’s team and counsel.' +
    (chRepOpenCr() ? ' One observation from it is with the chair in confidence, at Noor’s direction.' : '') + ' Who, and why: not known. This report draws no conclusion.';
}
function chRepPageHtml(picks, F) {
  const f = F || chRepFacts(), rows = chRepRows(f), n = rows.filter(r => picks[r.id]).length;
  let h = '<p class="small">The CISO’s first report to the Compact Board, since Day 64: one page and an annex of records (game).</p>';
  let i = 0;
  for (const s of CH_REP_SECTIONS) {
    const L = rows.filter(r => r.sec === s.id && picks[r.id]);
    if (!L.length) continue;
    h += '<h3>' + esc(s.name) + '</h3><ol start="' + (i + 1) + '">' + L.map(r => '<li>' + esc(chRepLineText(r, picks[r.id], f)) + '</li>').join('') + '</ol>';
    i += L.length;
  }
  if (!n) h += '<p>The page is empty.</p>';
  const oi = chRepOpenItem();
  if (oi) h += '<p class="small">' + esc(oi) + '</p>';
  const refs = chRepRefs(picks, f);
  h += '<h3>Annex: the records</h3>' + (refs.length ? '<ul class="small">' + refs.map(k => '<li>' + esc(k) + ' · ' + esc(CH_REP_RECORDS[k].name) + ' · ' + esc(chRepAt(CH_REP_RECORDS[k].at)) + '</li>').join('') + '</ul>' : '<p class="small">No record cited.</p>');
  return h;
}

/* ---------- The editor (Wednesday 09:00): sections, then each section's rows ---------- */
async function chRepSection(sec) {
  const picks = chRepPicks();
  let cur = 0;
  while (true) {
    const F = chRepFacts(), rows = chRepRows(F).filter(r => r.sec === sec.id), lines = chRepRows(F).filter(r => picks[r.id]).length;
    const items = rows.map(r => ({label: picks[r.id] ? chRepLineText(r, picks[r.id], F) : 'Left out: ' + r.name,
      note: (r.required ? 'Ivor’s note asks for it. ' : 'Optional. ') + '(A cycles)',
      meta: {k: r.id, lr: true, bot: picks[r.id] !== chRepRec(r)}}));
    items.push({label: 'Back to the sections', meta: {k: 'back', bot: rows.every(r => picks[r.id] === chRepRec(r))}});
    const body = '<p><b>' + esc(sec.name) + '</b>. Left/right (or A) changes a line’s wording, or leaves it out. Lines on the page: <b>' + lines + ' of ' + CH_REP_PAGE + '</b>. (game)</p>';
    const r = await UI.openModal('The report · ' + sec.name, body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    const step = (i, d) => { const row = rows[i]; if (!row) return; const cy = chRepCycle(row), at = cy.indexOf(picks[row.id] || 0); picks[row.id] = cy[(at + (d > 0 ? 1 : cy.length - 1)) % cy.length]; cur = i; };
    if (r && typeof r === 'object' && r.lr) { step(r.i, r.d); continue; }
    if (r >= 0 && r < rows.length) { step(r, 1); continue; }
    return;
  }
}
async function chRepEdit() {
  const picks = chRepPicks();
  let cur = 0;
  while (true) {
    const F = chRepFacts(), rows = chRepRows(F), lines = rows.filter(r => picks[r.id]).length, done = rows.every(r => picks[r.id] === chRepRec(r));
    const items = CH_REP_SECTIONS.map(s => { const L = rows.filter(r => r.sec === s.id), on = L.filter(r => picks[r.id]).length;
      return {label: s.name + ': ' + on + ' of ' + L.length + ' line' + (L.length === 1 ? '' : 's') + ' on the page', note: 'A opens its lines.', meta: {k: s.id, bot: L.some(r => picks[r.id] !== chRepRec(r))}}; });
    items.push({label: 'Read the page as it stands', meta: {k: 'read'}});
    items.push({label: 'Send it to Marit for the papers', meta: {k: 'send', bot: done}});
    const body = '<p>The Board’s first report from you: one page of ' + CH_REP_PAGE + ' lines at most, and an annex of the records each line cites. Ivor’s note asks for every risk above appetite and who accepted it, as minuted; every decision the Board must take, with its decider and your recommendation; the exceptions due and expired; and the supplier tier-1 gaps. Business terms on the page. (game)</p>' +
      '<p>Lines on the page: <b>' + lines + ' of ' + CH_REP_PAGE + '</b></p>';
    const r = await UI.openModal('The report · the page', body, items, {closable: false, cursor: cur, inView: true, cls: 'drill'});
    if (r >= 0 && r < CH_REP_SECTIONS.length) { await chRepSection(CH_REP_SECTIONS[r]); cur = r; continue; }
    const k = items[r] && items[r].meta.k;
    if (k === 'read') { await UI.openModal('The page as it stands', chRepPageHtml(picks, F), [{label: 'Back to the sections', meta: {back: true}}], {closable: false, cls: 'summary'}); cur = r; continue; }
    if (k === 'send') {
      const reqOut = rows.filter(r => r.required && !picks[r.id]), over = Math.max(0, lines - CH_REP_PAGE);
      const j = await UI.openModal('Send the report?', chRepPageHtml(picks, F) +
        (reqOut.length ? '<p>Left out, though Ivor’s note asks for it: <b>' + reqOut.map(x => esc(x.name)).join(', ') + '</b>.</p>' : '') + (over ? '<p>Over the page by <b>' + over + '</b> line' + (over === 1 ? '' : 's') + '.</p>' : '') +
        '<p>It goes to Marit for the Board papers as you send it, and it is yours: the scorecard reads it as sent.</p>',
        [{label: 'Send it', meta: {k: 'go', bot: true}}, {label: 'Back to the sections', meta: {k: 'back'}}], {closable: false, cursor: 1});
      if (j === 0) return Object.assign({}, picks);
      cur = r;
    }
  }
}

/* ---------- Grading the report as sent ---------- */
// Scale (game; Crossroads' report.js scores a right wording and nothing for an overclaim): +20 a supported required line,
// 0 a supported optional line, -10 a weak line, -20 a required row left out, -10 each line over the page; out of 20 per
// required row, 0 to 100. Only required rows earn, so a dull report (the required rows, supported) scores 100 and any
// omission, weak line or line over the page scores below it, whatever optional lines pad the page (review B-1).
function chRepGrade(picks, F) {
  const f = F || chRepFacts(), rows = chRepRows(f), out = [];
  for (const r of rows) {
    const p = picks[r.id] || 0, v = p ? r.variants[p - 1] : null;
    out.push({id: r.id, name: r.name, required: r.required, decision: !!r.decision, pick: p, in: !!p, grade: v ? v.grade : r.required ? 'omitted' : 'out', why: v ? v.why : '', line: chRepLineText(r, p, f)});
  }
  const inc = out.filter(x => x.in), sup = inc.filter(x => x.grade === 'supported'), weak = inc.filter(x => x.grade !== 'supported');
  const req = out.filter(x => x.required), omitted = req.filter(x => !x.in), dec = out.filter(x => x.decision && x.required);
  const lines = inc.length, over = Math.max(0, lines - CH_REP_PAGE);
  const supReq = sup.filter(x => x.required);
  const points = 20 * supReq.length - 10 * weak.length - 20 * omitted.length - 10 * over;
  return {rows: out, lines, over, supported: sup.length, weak: weak.map(x => x.id), omitted: omitted.map(x => x.id),
    score: req.length ? Math.max(0, Math.min(100, Math.round(100 * points / (20 * req.length)))) : 0,
    claims: inc.length ? Math.round(100 * sup.length / inc.length) : 0, required: req.length ? Math.round(100 * (req.length - omitted.length) / req.length) : 0,
    decide: dec.length ? Math.round(100 * dec.filter(x => x.grade === 'supported').length / dec.length) : 0};
}
function chRepStats() { const p = chRep(); return p.grade ? {claims: p.grade.claims, required: p.grade.required, decide: p.grade.decide, score: p.grade.score} : {claims: null, required: null, decide: null, score: null}; }
const CH_REP_GRADE_WORD = {supported: 'supported', unsupported: 'unsupported', overstated: 'overstated', misplaced: 'misplaced', omitted: 'left out (required)', out: 'left out'};
// Each row by its code and its name (an executive reads the name; the code finds it on the page).
const chRepRowName = x => x.id + ' · ' + x.name;
function chRepDebriefHtml(g) {
  return '<table class="sc"><tr><th>Line</th><th>Sent as</th></tr>' + g.rows.filter(x => x.in || x.required).map(x => '<tr><td>' + esc(chRepRowName(x)) + '</td><td>' + esc(CH_REP_GRADE_WORD[x.grade]) + '</td></tr>').join('') + '</table>' +
    '<ul>' + g.rows.filter(x => x.in && x.grade !== 'supported').map(x => '<li><b>' + esc(chRepRowName(x)) + '</b>: ' + esc(x.grade) + ', “' + esc(x.line) + '”. ' + esc(x.why) + '</li>').join('') +
    g.rows.filter(x => x.grade === 'omitted').map(x => '<li><b>' + esc(chRepRowName(x)) + '</b>: left out. Ivor’s note asks for ' + esc(chRepRow(x.id).topic) + '. Leaving it out costs more than a dull line would.</li>').join('') + '</ul>' +
    '<p>Lines on the page: <b>' + g.lines + ' of ' + CH_REP_PAGE + '</b>' + (g.over ? ', over by ' + g.over : '') + ' · claims supported <b>' + g.claims + '%</b> · required items present <b>' + g.required + '%</b> · decisions sent in the wording the records support <b>' + g.decide + '%</b> · report score <b>' + g.score + '</b> / 100 (game; only required lines earn)</p>';
}

/* ---------- The Board's questions (Thursday), keyed to the report as sent ---------- */
const CH_REP_MEMBERS = ['The School District’s representative', 'The Clinic’s representative', 'The town’s representative'];
function chRepBoardQs() {
  // The report as sent: its picks and the facts it was built from (stored at 12:00 on Day 87), not a fresh read.
  const p = chRep(), F = (p.sent && p.sent.facts) || chRepFacts(), g = p.grade || chRepGrade(p.sent ? p.sent.picks : {}, F);
  const order = {omitted: 0, misplaced: 1, overstated: 2, unsupported: 3};
  const weak = g.rows.filter(x => order[x.grade] !== undefined).sort((a, b) => order[a.grade] - order[b.grade] || CH_REP_ROWS.findIndex(r => r.id === a.id) - CH_REP_ROWS.findIndex(r => r.id === b.id));
  const qs = weak.slice(0, 3).map((x, i) => { const r = chRepRow(x.id);
    return {row: x.id, grade: x.grade, title: 'A member’s question', who: CH_REP_MEMBERS[i],
      ask: x.grade === 'omitted' ? '“The page says nothing about ' + r.topic + '. What should it say?”' : '“Your page says: ' + x.line + '. Is that what the records show?”',
      resp: r.variants.map(v => ({label: chRepFill(v.label, F), good: !!v.good, why: v.why}))}; });
  for (const s of CH_REP_BOARD_SPECS()) if (qs.length < 3) qs.push(Object.assign({row: null}, s));
  return qs;
}

/* ---------- Rules and records agree: the report's required rows against the risk states and the registers ---------- */
function chRepAuditNow() {
  const c = G.ch, bad = [], F = chRepFacts(), rows = chRepRows(F), has = id => rows.some(r => r.id === id && r.required);
  const lvl = (cat, res) => CH_LEVELS.indexOf(res) <= CH_LEVELS.indexOf(CH_APPETITE_MAX[chAppetite(cat)]);
  const st = chRiskStates(), above = st.filter(r => !r.mh && !(lvl(r.cat, r.residual) && !r.breaks.length));
  const wantBoard = above.filter(r => r.decider === 'Board').map(r => r.id).sort(), wantOwner = above.filter(r => r.decider !== 'Board').map(r => r.id).sort(), wantMh = st.filter(r => r.mh).map(r => r.id).sort();
  if (wantBoard.join() !== F.boardIds.slice().sort().join()) bad.push('report: the Board’s lines above appetite are ' + (wantBoard.join(', ') || 'none') + ', the report names ' + (F.boardIds.join(', ') || 'none'));
  if (wantOwner.join() !== F.ownerIds.slice().sort().join()) bad.push('report: the owners’ acceptances above appetite are ' + (wantOwner.join(', ') || 'none') + ', the report names ' + (F.ownerIds.join(', ') || 'none'));
  if (wantMh.join() !== F.mhIds.slice().sort().join()) bad.push('report: the must-haves left out are ' + (wantMh.join(', ') || 'none') + ', the report names ' + (F.mhIds.join(', ') || 'none'));
  if (wantOwner.length && !has('A1')) bad.push('report: owners’ acceptances above appetite, but no required row for them');
  if ((wantBoard.length > 0) !== has('A2')) bad.push('report: the Board’s row ' + (wantBoard.length ? 'missing' : 'with nothing to report'));
  if ((wantMh.length > 0) !== has('E2')) bad.push('report: the must-haves row ' + (wantMh.length ? 'missing' : 'with nothing to report'));
  // The fixed wordings, against their records: D1 (two expired, both closed by Edda on Day 78), C2 (EX-02 and EX-04 open to
  // Day 155, each escalated or the Board's), B1 (six accounts on open exceptions), E1 (the tier-1 contracts).
  const exc = (c.pol && c.pol.exc) || [], ex = id => exc.find(e => e.id === id);
  if (F.expiredIds.slice().sort().join() !== 'EX-01,EX-03' || !['EX-01', 'EX-03'].every(id => ex(id) && ex(id).closed && ex(id).closedBy === 'Edda Thornquist' && ex(id).closedDay === 78)) bad.push('report: D1’s wording no longer matches the exception register');
  if (!['EX-02', 'EX-04'].every(id => ex(id) && ex(id).expiry === 155 && chExcStatus(ex(id)) !== 'closed') || !F.renewKeys.every(k => k === 'chair' || k === 'board')) bad.push('report: C2’s wording no longer matches the exception register or its deciders');
  const openMfa = exc.filter(e => (e.id === 'EX-02' || e.id === 'EX-04') && chExcStatus(e) !== 'closed');
  if (openMfa.length !== 2 || exc.some(e => e.std === 'STD-1' && !['EX-02', 'EX-04'].includes(e.id) && chExcStatus(e) !== 'closed')) bad.push('report: B1’s six accounts no longer match the open MFA exceptions');
  if (!F.t1.every(id => CH_SUP_CONTRACTS.find(k => k.id === id))) bad.push('report: E1’s tier-1 contracts no longer match the register');
  return bad;
}
