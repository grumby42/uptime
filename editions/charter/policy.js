/* ============================================================
   UPTIME · editions/charter/policy.js
   Charter's policy primitives (game models), used by District 3, Policy:
   - the exception register: each exception's clause, the exact accounts or
     systems in scope, the business reason, the compensating controls, its
     owner (the business owner, never the CISO), its class by the CISO's check
     (chExcClass: standard, or escalated under 6.2a), its approver by POL-1's
     own rule (chExcApprover: the owner for a standard one; the Board's chair,
     or a member's own leadership, for an escalated one; the Compact Board in
     its minute where the exception exists because of a Board decision, 6.3),
     its tolerance line (chExcTolerance, 6.7: read on the register line's
     current state), its start, expiry and review dates, and its status (open,
     expired, renewed, closed: chExcStatus);
   - the checks the rule makes (chExcCheck): a named business owner, an expiry
     no more than 12 months after the start, a review date no later than the
     expiry and the next quarterly Board after the start (chNextBoard);
   - who decides (chExcDecide): only the approver the rule names; the owner
     alone cannot approve an escalated one;
   - expiry handling: an expired exception is not open; it closes (chExcClose)
     or renews through the same route with fresh evidence (chExcRenew, counted:
     a second renewal is escalated and opens the standard's review); the CISO
     never renews or closes one;
   - the intake (Monday): the register written up from the records, one row per
     entry, the as-sent register being the CISO's advice the scorecard reads;
   - the policy library: each document's review date, as sent;
   - the policy metrics, on the CISO's advice.
   The town's fd-admin exception (EX-00) is the register's seed, quoted from
   Town Hall and read only. Each must-have a sent plan left out (Suppliers) is
   imported as an exception too, as recorded there.
   State: G.ch.pol (chPol() creates it, so a save from slice 2 loads too).
   ============================================================ */
'use strict';

function chPol() {
  const c = G.ch;
  if (!c.pol) c.pol = {exc: null, intake: null, intakeSent: null, drills: {}, needs: {met: 0, total: 0}, consult: null, replies: null,
    directive: null, lib: null, libSent: null, dojo: [false, false, false], board: null, minute: null};
  if (G.targets && G.targets.chPolExc === undefined) Object.assign(G.targets, {chPolExc: 100, chPolExp: 100, chPolRev: 100});
  return c.pol;
}
const chIsPerson = o => !!o && typeof o === 'string' && !/^(you|yours|the CISO|IT|Finance|Dispatch|not stated)/i.test(o);
// The quarterly Board after `day` (Day 155, then every 91 days): a review date may fall no later than this.
function chNextBoard(day) { let b = CH_POL_NEXT_BOARD; while (b <= day) b += CH_POL_BOARD_EVERY; return b; }
function chExcDayText(d, at) { return typeof d === 'number' ? 'Day ' + d + (CH_DAY[d] ? ' (' + CH_DAY[d] + ')' : '') + (at ? ' ' + at : '') : d === 'when' ? 'when something changes' : d === null || d === undefined ? 'none' : String(d); }

/* ---------- The register ---------- */
// The register's entries: the static ones (CH_POL_EXC_INIT), then each must-have left out of a sent plan (Suppliers),
// imported as an exception with what Suppliers recorded: the CISO's recommendation, decided and signed by the owner.
function chExcInit() {
  const p = chPol();
  if (!p.exc) { p.exc = JSON.parse(JSON.stringify(CH_POL_EXC_INIT)); chExcImport(); }
  return p.exc;
}
function chExcImport() {
  const p = chPol(), sup = G.ch.sup, list = (sup && sup.accept) || [];
  list.forEach((a, i) => {
    const id = 'EX-' + (11 + i);
    if (p.exc.some(e => e.id === id)) return;
    p.exc.push({id: id, imported: true, short: a.line, std: 'STD-3', scope: a.name, clause: 'STD-3: the must-haves for its tier (' + a.clause + ')',
      reason: 'left out of the plan on the CISO’s recommendation (Day ' + a.day + ')', controls: a.interim, owner: a.owner, start: a.day,
      expiry: a.expiry, review: a.review, recommendedBy: a.recommendedBy || 'the CISO (your plan)', note: 'Imported from Suppliers: ' + a.decidedBy + '.',
      // Decided in Suppliers (Day 73) under the appetite statement's rule, before POL-1; 6.2a applies at its review. It comes
      // from the CISO's own recommendation (6.4): the papers say so, and Edda's team checks its control.
      preRule: true, ownRec: true, tol: 'as recorded in Suppliers'});
  });
}
function chExc(id) { return chExcInit().find(e => e.id === id); }
// 6.3: an exception that exists because of a Board decision (a line the Board chose not to fund) is approved by the
// Board in its minute; the owner signs for running the control. EX-04 (fin-ap) on the path where the Board trimmed R4.
function chExcBoardChose(e) { return !!(e && e.boardLine && G.ch.final && G.ch.final[e.boardLine] === 0); }
// 6.7: the tolerance line. An exception inside a register line (boardLine) is read against that line's current state
// (chLineNow: the decided option's residual, the tolerances in force now); the others carry their recorded line.
function chExcTolerance(e) {
  if (e.seed) return {above: false, breaks: [], text: CH_POL_NOT_STATED};
  if (!e.boardLine) return {above: false, breaks: [], text: e.tol || 'as recorded'};
  const l = chLine(e.boardLine), st = chLineNow(l);
  if (!st) return {above: false, breaks: [], text: 'the Board has not decided ' + l.id + ' yet'};
  if (!st.within) {
    const a = (G.ch.accept || []).find(x => x.line === l.id && !x.closed);
    return {above: true, breaks: st.breaks, acc: a || null, text: '6.7: ' + (st.breaks.length ? st.breaks.map(t => 'breaks the ' + chTolName(t) + ' tolerance').join(', ') + ' (' + l.id + ', as now)' : l.id + ' above appetite') + ': ' +
      (a ? 'on the risk register as ' + l.id + '’s acceptance (' + a.decider + ', Day ' + a.day + ')' : 'no acceptance on the risk register') + '; escalated (6.2a)'};
  }
  return {above: false, breaks: [], text: l.catName.toLowerCase() + ': ' + (chHeldTol().length ? 'call-back in force from Day 79 (Marit)' : 'tolerances kept') + ': within'};
}
// The CISO's check (6.4, 6.2a): standard, or escalated with its reasons.
function chExcClass(e) {
  if (e.seed) return {cls: 'the town’s', why: []};
  const why = [];
  if (e.cisoAgainst) why.push('the CISO recommends against');
  if (e.partial) why.push('its control covers only part of the gap');
  const t = chExcTolerance(e); if (t.above) why.push(t.breaks.length ? 'a tolerance breaks' : 'a risk above appetite');
  if (e.critical) why.push(e.critical);
  if ((e.renewals || 0) >= 2) why.push('a second renewal');
  return {cls: why.length ? 'escalated' : 'standard', why: why};
}
const CH_POL_CHAIR = 'Ivor Penhallow, the Board’s chair (6.2a)';
// Who the rule says decides: 'board' (6.3), 'chair' or 'member' (escalated, 6.2a), or 'owner' (standard). Entries
// imported from Suppliers were decided there, before POL-1, by their owner on the CISO's recommendation.
function chExcDeciderKey(e, cls) {
  if (chExcBoardChose(e)) return 'board';
  if (e.preRule) return 'owner';
  return (cls || chExcClass(e).cls) === 'escalated' ? (e.member ? 'member' : 'chair') : 'owner';
}
function chExcApprover(e) {
  if (e.seed) return e.approver;
  const k = chExcDeciderKey(e);
  return k === 'board' ? 'the Compact Board (6.3: ' + e.boardLine + ' carried in its Day 67 minute; the exception to its Day 81 minute)' : k === 'chair' ? CH_POL_CHAIR : k === 'member' ? e.memberLead : e.owner;
}
function chWhoKey(e, by) { return chExcBoardChose(e) && /Compact Board/.test(by) ? 'board' : /^Ivor Penhallow/.test(by) ? 'chair' : e.memberLead && by === e.memberLead ? 'member' : by === e.owner ? 'owner' : 'other'; }
// A decision on an exception: only the approver the rule names. The owner alone cannot approve an escalated one.
function chExcDecide(e, by, day, note) {
  const need = chExcDeciderKey(e), got = chWhoKey(e, by);
  if (need !== got) return {ok: false, why: need === 'owner' ? 'its owner decides it' : need === 'board' ? 'the Board decides it, in its minute (6.3)' : 'escalated (6.2a): ' + chExcApprover(e) + ' decides it, not its owner alone'};
  Object.assign(e, {decidedBy: by, decidedDay: day, decidedNote: note || ''});
  return {ok: true};
}
// Status, at a day (and, given, a clock time: an expiry at 17:00 is expired from 17:00 on its day).
function chExcStatus(e, day, at) {
  const d = day === undefined ? G.day : day;
  if (e.seed) return e.status;
  if (e.closed) return 'closed';
  if (typeof e.expiry !== 'number') return 'open';
  if (d > e.expiry || (d === e.expiry && e.expiryAt && at && at >= e.expiryAt)) return 'expired';
  return e.renewed ? 'renewed' : 'open';
}
// What POL-1's rule asks of a write-up {owner, expiry, review} for an entry starting on `start` (and, given, whose
// service it is: the owner must be that business owner): a list of problems.
function chExcCheck(w, start, bizOwner) {
  const out = [];
  if (!chIsPerson(w.owner)) out.push('no business owner');
  else if (bizOwner && w.owner !== bizOwner) out.push('not the business owner (' + bizOwner + ')');
  if (typeof w.expiry !== 'number') out.push('no expiry date');
  else if (w.expiry - start > CH_POL_MAX_DAYS) out.push('expiry more than 12 months after its start');
  if (typeof w.review !== 'number') out.push('no review date');
  else if (w.review > chNextBoard(start) || (typeof w.expiry === 'number' && w.review > w.expiry)) out.push('review after the next quarterly Board or its expiry');
  return out;
}
// Close an exception: its owner's decision (or the Board's, where 6.3 applies). The CISO never closes one.
function chExcClose(e, by, day, note) {
  if (by !== e.owner && !(chExcBoardChose(e) && /Board/.test(by))) return {ok: false, why: 'only its owner closes it'};
  Object.assign(e, {closed: true, closedBy: by, closedDay: day, closedNote: note || ''});
  return {ok: true};
}
// Renew an expired (or expiring) exception through the same route, with fresh evidence: by the approver the rule names
// (the owner for a standard one, the chair or the member's leadership for an escalated one, the Board under 6.3), with the
// review's record and the control's records, to an expiry no more than 12 months from the renewal and a review date the
// rule allows. Renewals are counted: a second one is escalated (6.2a) and opens the standard's review (6.8). The CISO
// never renews one.
function chExcRenew(e, r) {
  const by = r.by || '', w = {owner: e.owner, expiry: r.to, review: r.review}, n = (e.renewals || 0) + 1;
  const base = chExcDeciderKey(e), need = base === 'owner' && n >= 2 ? (e.member ? 'member' : 'chair') : base, got = chWhoKey(e, by);
  if (got !== need) return {ok: false, why: need === 'owner' ? 'only its owner renews it (or the Board, under 6.3)' : need === 'board' ? 'the Board renews it, in its minute (6.3)' : (n >= 2 ? 'a second renewal is escalated (6.2a): ' : 'escalated (6.2a): ') + (need === 'chair' ? 'the Board’s chair' : 'the member’s own leadership') + ' renews it, not its owner alone'};
  if (!r.evidence || !r.evidence.length) return {ok: false, why: 'no fresh evidence'};
  const probs = chExcCheck(w, r.day);
  if (probs.length) return {ok: false, why: probs.join(', ')};
  Object.assign(e, {renewed: true, renewals: n, renewedBy: by, renewedDay: r.day, start: r.day, expiry: r.to, review: r.review, evidence: r.evidence.slice()});
  if (n >= 2) e.stdReview = true;
  return {ok: true, stdReview: n >= 2};
}
function chExcStatusText(e) {
  const s = chExcStatus(e);
  if (e.seed) return 'closed, the town’s';
  return s === 'closed' ? 'closed' + (e.closedDay ? ' Day ' + e.closedDay + (e.closedAt ? ' ' + e.closedAt : '') : '') : s;
}
function chExcRegisterHtml(list) {
  const L = list || chExcInit();
  return '<table class="sc"><tr><th>ID</th><th>Owner</th><th>Expires</th><th>Status</th></tr>' + L.map(e =>
    '<tr><td>' + esc(e.id) + '</td><td>' + esc(e.seed ? '—' : /^Director /.test(e.owner) ? e.owner.split(' ').pop() : e.owner.split(' ')[0]) + '</td><td>' + esc(e.seed ? 'none' : typeof e.expiry === 'number' ? 'Day ' + e.expiry : '—') + '</td><td>' + esc(chExcStatusText(e)) + '</td></tr>').join('') + '</table>' +
    '<ul>' + L.map(e => '<li>' + chExcItemHtml(e) + '</li>').join('') + '</ul>';
}
function chExcItemHtml(e) {
  if (e.seed) return '<b>' + esc(e.id) + ' ' + esc(e.scope) + '</b> (' + esc(e.src) + '). Clause: ' + esc(e.clause) + ' Reason: ' + esc(e.reason) + '. Start: ' + esc(e.startText) + '. Owner: ' + esc(e.owner) + '. Approver: ' + esc(e.approver) + '. Expiry: ' + esc(e.expiryText) + '; review: ' + esc(e.reviewText) + '. Compensating controls: ' + esc(e.controls) + '. Status: closed. ' + esc(e.note);
  const c = chExcClass(e), t = chExcTolerance(e), open = chExcStatus(e) !== 'closed';
  const cls = e.preRule ? 'decided before POL-1 (the appetite statement’s rule); 6.2a applies at its review' : c.cls + (c.why.length ? ' (' + c.why.join('; ') + ')' : '');
  const dec = e.decidedBy ? ', decided by ' + e.decidedBy + ' on Day ' + e.decidedDay + (e.approvedIn ? ' (' + e.approvedIn + ')' : '') : open && !e.preRule && chExcDeciderKey(e, c.cls) === 'chair' ? '; to be decided on the papers within five working days' : '';
  return '<b>' + esc(e.id) + ' ' + esc(e.scope) + '</b>. Clause: ' + esc(e.clause) + '. Reason: ' + esc(e.reason) + '. Controls: ' + esc(e.controls) + '. Owner: ' + esc(e.owner) + ', who signs for running its control; class (the CISO’s check): ' + esc(cls) + '; approver (the rule): ' + esc(chExcApprover(e)) + esc(dec) +
    (e.recommendedBy ? '; recommended by ' + esc(e.recommendedBy) : '') + '. Start Day ' + e.start + '; expiry ' + esc(chExcDayText(e.expiry, e.expiryAt)) + '; review ' + esc(chExcDayText(e.review)) + '. Tolerances: ' + esc(t.text) + '. Status: ' + esc(chExcStatusText(e)) + '.' +
    (e.ownRec ? ' From the CISO’s own recommendation: the Board’s papers say so, and Edda’s team checks its control (6.4).' : '') + (e.stdReview ? ' A second renewal: the standard’s review is opened (6.8).' : '') + (e.closedNote ? ' ' + esc(e.closedNote) : e.note ? ' ' + esc(e.note) : '');
}
function chPolRuleHtml() { return '<p class="small">POL-1 section 6, the exception rule (game; the draft’s, in force once the Board approves POL-1 on Thursday):</p><ul class="small">' + CH_POL_RULE.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul>'; }

/* ---------- The intake (Monday 10:30): write the register up from the records ---------- */
// One row per entry to write up; left/right (or A) cycles its write-ups (CH_POL_INTAKE); the page reopens in place. Not
// graded row by row: the scorecard reads the register as sent. meta.bot marks the bot's next step; it is never shown.
function chIntakeRight(id) { return CH_POL_INTAKE[id].findIndex(w => w.good) + 1; }
async function chExcIntakeEdit() {
  const p = chPol(), ids = Object.keys(CH_POL_INTAKE), t = p.intake || (p.intake = Object.fromEntries(ids.map(id => [id, 0])));
  let cur = 0;
  while (true) {
    const done = ids.every(id => t[id]), right = ids.every(id => t[id] === chIntakeRight(id));
    const items = ids.map(id => { const e = chExc(id), w = t[id] ? CH_POL_INTAKE[id][t[id] - 1] : null;
      return {label: id + ' ' + e.short + ': ' + (w ? w.label : 'not written up yet'),
        note: e.scope + '. ' + e.clause + '. Reason: ' + e.reason + '. Controls: ' + e.controls + '. Recorded: ' + e.note + ' Expiry as recorded: ' + chExcDayText(e.expiry, e.expiryAt) + '. Tolerances: ' + chExcTolerance(e).text + '. (A cycles)',
        meta: {k: id, lr: true, bot: t[id] !== chIntakeRight(id)}}; });
    items.push({label: 'The exception rule', meta: {k: 'help'}});
    items.push({label: done ? 'Put it on the register' : 'Write up every row first', disabled: !done, meta: {k: 'send', bot: right}});
    const ro = chExcInit().filter(e => !CH_POL_INTAKE[e.id]);
    const body = '<p>Monday, Day 78. Write each entry up from its records: its owner, its expiry and its review date, or, for one that has expired, where it goes. Left/right (or A) changes a row. (game)</p>' +
      '<p class="small">Already on the register, read only: ' + ro.map(e => esc(e.id) + ' ' + esc(e.short) + ' (' + esc(chExcStatusText(e)) + ')').join(', ') + '.</p>';
    const r = await UI.openModal('The exception register · intake', body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    if (r && typeof r === 'object' && r.lr) { const id = ids[r.i]; if (id) { const n = CH_POL_INTAKE[id].length, v = t[id] || 0; t[id] = r.d > 0 ? v % n + 1 : (v <= 1 ? n : v - 1); cur = r.i; } continue; }
    if (r >= 0 && r < ids.length) { const id = ids[r]; t[id] = (t[id] || 0) % CH_POL_INTAKE[id].length + 1; cur = r; continue; }
    const k = items[r] && items[r].meta.k;
    if (k === 'help') { await UI.openModal('The exception rule', chPolRuleHtml(), [{label: 'Back to the register', meta: {back: true}}], {closable: false, cls: 'drill'}); cur = r; continue; }
    if (k === 'send') return Object.assign({}, t);
  }
}
// Apply a write-up to the register (the sent one is the advice; the right one is the register as corrected).
function chExcApplyWriteup(id, idx) {
  const e = chExc(id), w = CH_POL_INTAKE[id][idx - 1];
  if (!w) return;
  if (w.disp) { e.disp = w.disp; return; }
  e.owner = w.owner; e.expiry = w.expiry; e.review = w.review;
}
function chIntakeDebrief(sent) {
  const ids = Object.keys(CH_POL_INTAKE), wrong = ids.filter(id => sent[id] !== chIntakeRight(id));
  return '<table class="sc"><tr><th>Entry</th><th>Account</th><th>Yours</th></tr>' + ids.map(id => '<tr><td>' + esc(id) + '</td><td>' + esc(chExc(id).short) + '</td><td>' + (sent[id] === chIntakeRight(id) ? 'as the draft rule asks' : 'differs') + '</td></tr>').join('') + '</table>' +
    (wrong.length ? '<ul>' + wrong.map(id => '<li><b>' + esc(id) + '</b>: you wrote “' + esc(CH_POL_INTAKE[id][sent[id] - 1].label) + '”. ' + esc(CH_POL_INTAKE[id][sent[id] - 1].why) + ' The draft rule’s: “' + esc(CH_POL_INTAKE[id][chIntakeRight(id) - 1].label) + '”.</li>').join('') + '</ul>' : '<p>Every row written up as the draft rule asks (in force once the Board approves it on Thursday).</p>');
}

/* ---------- The policy library (Wednesday 14:00): a review date for each document ---------- */
function chLibValid(v) { return typeof v === 'number' && v <= CH_POL_REVIEW_MAX; }
// A document's text as it stands: STD-4 is v2 from Wednesday's replies (agreed with the members' owners, Day 80).
function chDocWhat(d) { return d.v2 && G.f && G.f.chPolReplies ? d.v2 : d.what; }
function chLibText(v) { return v === null || v === undefined ? 'no review date' : 'review ' + CH_POL_REVIEW_TEXT[v]; }
async function chPolLibEdit() {
  const p = chPol(), t = p.lib || (p.lib = Object.fromEntries(CH_POL_DOCS.map(d => [d.id, 0])));
  let cur = 0;
  while (true) {
    const right = CH_POL_DOCS.every(d => CH_POL_REVIEWS[t[d.id]] === d.bot);
    const items = CH_POL_DOCS.map(d => ({label: d.id + ' ' + d.name + ': ' + chLibText(CH_POL_REVIEWS[t[d.id]]), note: chDocWhat(d) + ' Owner: ' + d.owner + '. (A cycles)', meta: {k: d.id, lr: true, bot: CH_POL_REVIEWS[t[d.id]] !== d.bot}}));
    items.push({label: 'Send it to the Board papers', meta: {k: 'send', bot: right}});
    const body = '<p>Six documents: the policy and the five standards under it. POL-1 section 8: every document reviewed at least every 12 months, and after any incident that tests it. Left/right (or A) changes a review date. (game)</p>';
    const r = await UI.openModal('The policy library · review dates', body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    const n = CH_POL_REVIEWS.length;
    if (r && typeof r === 'object' && r.lr) { const d = CH_POL_DOCS[r.i]; if (d) { t[d.id] = (t[d.id] + (r.d > 0 ? 1 : n - 1)) % n; cur = r.i; } continue; }
    if (r >= 0 && r < CH_POL_DOCS.length) { const d = CH_POL_DOCS[r]; t[d.id] = (t[d.id] + 1) % n; cur = r; continue; }
    if (items[r] && items[r].meta.k === 'send') return Object.fromEntries(CH_POL_DOCS.map(d => [d.id, CH_POL_REVIEWS[t[d.id]]]));
  }
}

/* ---------- The policy metrics (on the CISO's advice) ---------- */
// exc: the entries you wrote up (EX-02 and EX-04, from the intake as sent), each with its business owner, an expiry
// within 12 months of its start and a review date the rule allows. reg (not scored): every open entry complete, EX-05
// as its owner decided it and any EX-1x as recorded in Suppliers. exp: of the exceptions that expired this week (EX-01, EX-03), the share your advice sent to their owner to
// close or renew through the route (drill 1's verdict, the intake row). rev: documents sent with a review date within 12
// months.
function chPolStats() {
  const p = chPol(), sent = p.intakeSent;
  let exc = null, exp = null, rev = null, reg = null;
  if (sent) {
    const rows = [];
    for (const id of ['EX-02', 'EX-04']) { const e = chExc(id), w = CH_POL_INTAKE[id][sent[id] - 1]; rows.push(chExcCheck(w, e.start, e.owner).length === 0); }
    exc = Math.round(rows.filter(Boolean).length / rows.length * 100);
    const others = chExcInit().filter(x => x.imported || x.id === 'EX-05');
    reg = {n: others.filter(e => chExcCheck(e, e.start).length === 0).length, of: others.length};
    const d1 = p.drills.polvalid, res = [d1 ? !!d1.verdictOk : false, CH_POL_INTAKE['EX-03'][sent['EX-03'] - 1].disp === 'owner'];
    exp = Math.round(res.filter(Boolean).length / res.length * 100);
  }
  if (p.libSent) rev = Math.round(CH_POL_DOCS.filter(d => chLibValid(p.libSent[d.id])).length / CH_POL_DOCS.length * 100);
  return {exc, exp, rev, reg};
}
