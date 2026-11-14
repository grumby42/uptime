/* ============================================================
   UPTIME · editions/charter/risk.js
   Charter's primitives (game models):
   - the risk-appetite statement builder: one statement per category, each an
     appetite level with measurable tolerances; the Board approves it, and every
     later decision is measured against it (CSF 2.0 GV.RM-02, cited in CREDITS.md);
   - budget allocation: a fixed sum across the register's lines; each line's
     option shows its cost, the risk left after it (the residual) and the
     appetite and tolerance it is measured against (a line within the level
     that breaks an approved tolerance is above appetite); a line above
     appetite needs an acceptance signed by its business owner (never by the
     CISO); the Board can override an allocation (its rule is chBoardDecide),
     and what its decision leaves above appetite is minuted as the Board's
     decision and approved by the Board, each owner signing for the interim
     measures and the treatment plan;
   - risk acceptances: owner, residual, appetite, tolerances broken, who
     decided, who approved, who signed and for what, expiry, review date,
     interim measures.
   Hooks for later slices (not built here): the board-report assembly (claims
   graded against records), the contract-clause negotiation within a budget, and
   the policy exception register with expiries. Each will read the same records:
   G.ch.register (owners and review dates), G.ch.accept (acceptances with an
   expiry and a review date) and G.ch.appetite (the approved statement).
   ============================================================ */
'use strict';

const CH_LEVELS = ['Low', 'Medium', 'High'];
// Appetite level -> the highest residual within appetite (game scale).
const CH_APPETITE_MAX = {Low: 'Low', Moderate: 'Medium', High: 'High'};
const chMoney = k => k ? '$' + k + 'k' : '$0';
const chHm = m => String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');

/* ---------- The appetite statement ---------- */
// The approved level for a category (the statement the Board approved; the good option of each category until then).
function chAppetite(cat) {
  const a = G && G.ch && G.ch.appetite && G.ch.appetite.levels;
  if (a && a[cat]) return a[cat];
  const c = CH_APPETITE.find(x => x.id === cat), g = c && c.opts.find(o => o.good);
  return g ? g.level : 'Moderate';
}
// The approved tolerance text for a category (the statement's; the good option's until it is approved), and its short form.
function chTol(cat) {
  const t = G && G.ch && G.ch.appetite && G.ch.appetite.tol;
  if (t && t[cat]) return t[cat];
  const c = CH_APPETITE.find(x => x.id === cat), g = c && c.opts.find(o => o.good);
  return g ? g.tol : '';
}
function chLevelWithin(cat, residual) { return CH_LEVELS.indexOf(residual) <= CH_LEVELS.indexOf(CH_APPETITE_MAX[chAppetite(cat)]); }
// Within appetite: the residual no higher than the level allows AND no approved tolerance broken. The tolerances bind
// (GV.RM-02's example: appetite turned into measurable tolerances), so an option that breaks one is above appetite
// whatever its residual. `breaks` lists the tolerances an option breaks, in the statement's words.
function chWithin(cat, residual, breaks) { return chLevelWithin(cat, residual) && !(breaks && breaks.length); }
function chOptWithin(l, o) { return chWithin(l.cat, o.res, o.breaks); }
function chBreaks(o) { return (o && o.breaks) || []; }
// Build the statement: one graded list per category, retried until the Board can approve it; first tries are recorded.
async function chAppetiteBuild(cats) {
  const out = {levels: {}, tol: {}, first: []};
  for (const c of cats) {
    const items = c.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal('Risk appetite · ' + c.name, '<p>' + esc(c.intro) + '</p><p><b>' + esc(c.ask) + '</b></p>' + chAppetiteHtml(out, cats), items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(c.opts[i].why, 'Ivor Penhallow');
    }
    const g = c.opts.find(o => o.good);
    out.levels[c.id] = g.level; out.tol[c.id] = g.tol; out.first.push(first);
  }
  return out;
}
function chAppetiteHtml(ap, cats) {
  const rows = cats.filter(c => ap && ap.levels && ap.levels[c.id]);
  if (!rows.length) return '';
  return '<h3>The statement so far</h3><table class="sc"><tr><th>Category</th><th>Appetite</th><th>Within</th></tr>' +
    rows.map(c => '<tr><td>' + esc(c.name) + '</td><td>' + esc(ap.levels[c.id]) + '</td><td>' + esc(CH_APPETITE_MAX[ap.levels[c.id]] === 'Low' ? 'Low only' : 'Low, Medium') + '</td></tr>').join('') + '</table>' +
    '<ul>' + rows.map(c => '<li>' + esc(c.name) + ': ' + esc(ap.tol[c.id]) + '</li>').join('') + '</ul>';
}

/* ---------- Budget allocation ---------- */
function chLine(id) { return CH_LINES.find(l => l.id === id); }
function chOpt(alloc, l) { return l.opts[alloc[l.id] || 0]; }
function chAllocStats(alloc) {
  let total = 0, top = 0, within = 0; const above = [];
  for (const l of CH_LINES) {
    const o = chOpt(alloc, l); total += o.cost; if (l.rank <= 5) top += o.cost;
    if (chOptWithin(l, o)) within++; else above.push(l);
  }
  return {total, top, topPct: total ? Math.round(top / total * 100) : null, within, withinPct: Math.round(within / CH_LINES.length * 100), above};
}
function chAllocTable(alloc) {
  return '<table class="sc"><tr><th>Line</th><th>Cost</th><th>Left</th><th>Appetite</th></tr>' + CH_LINES.map(l => {
    const o = chOpt(alloc, l), ok = chOptWithin(l, o);
    return '<tr><td>' + l.id + '</td><td>' + chMoney(o.cost) + '</td><td>' + o.res + '</td><td>' + (ok ? 'within' : chBreaks(o).length ? '<b>above</b> (a tolerance)' : '<b>above</b>') + '</td></tr>';
  }).join('') + '</table>';
}
function chAllocSummary(alloc) {
  const s = chAllocStats(alloc);
  return '<p>Allocated <b>' + chMoney(s.total) + '</b> of ' + chMoney(CH_BUDGET) + ' · within appetite <b>' + s.within + ' of ' + CH_LINES.length + '</b> · top five <b>' + (s.topPct === null ? '—' : s.topPct + '%') + '</b> (game)</p>' +
    (s.above.length ? '<p>Above appetite, so each needs an acceptance signed by its owner: ' + s.above.map(l => '<b>' + l.id + '</b> (' + esc(l.owner) + ')' + (chBreaks(chOpt(alloc, l)).length ? ', breaking a tolerance' : '')).join(', ') + '.</p>' : '<p>Every line within the appetite the Board approved on Monday, its tolerances kept.</p>');
}
function chOptionsHtml() {
  return '<p class="small">Every price, rating and figure on this page is game data (game).</p>' + CH_LINES.map(l => '<h3>' + l.id + ' ' + esc(l.name) + '</h3><p class="small">' + esc(l.catName) + ', appetite ' + esc(chAppetite(l.cat)) + ' · owner ' + esc(l.owner) + ' · rank ' + l.rank + '</p><p class="small">Tolerance (Monday): ' + esc(chTol(l.cat)) + '.</p><ul>' +
    l.opts.map(o => '<li>' + chMoney(o.cost) + ': ' + esc(o.what) + ' Left: ' + o.res + (chOptWithin(l, o) ? ', within appetite.' : chBreaks(o).length ? ', above appetite: it breaks the tolerance “' + esc(chBreaks(o).join('”, “')) + '”.' : ', above appetite.') + '</li>').join('') + '</ul>' + (l.note ? '<p class="small">' + esc(l.note) + '</p>' : '')).join('');
}
// The allocation editor: left/right (or A) changes a line's option; the page reopens in place. Not graded line by line:
// the scorecard measures the result. meta.bot marks the bot's next step (the recommended allocation); it is never shown.
async function chAllocate() {
  const a = G.ch.alloc || (G.ch.alloc = Object.fromEntries(CH_LINES.map(l => [l.id, 0])));
  let cur = 0;
  while (true) {
    const s = chAllocStats(a), done = CH_LINES.every(l => a[l.id] === l.rec);
    const items = CH_LINES.map(l => {
      const o = chOpt(a, l);
      return {label: l.id + ' ' + l.name + ': ' + chMoney(o.cost) + ', ' + o.res + (chOptWithin(l, o) ? '' : chBreaks(o).length ? ', breaks a tolerance' : ', above appetite'),
        note: o.what + ' Tolerance: ' + CH_TOL_SHORT[l.cat] + '.' + (chBreaks(o).length ? ' This option breaks it.' : '') + ' (A cycles)', meta: {k: l.id, lr: true, bot: a[l.id] !== l.rec}};
    });
    items.push({label: 'Each line’s options, in business terms', meta: {k: 'help'}});
    items.push({label: s.total > CH_BUDGET ? 'Over the budget by ' + chMoney(s.total - CH_BUDGET) + ': change a line' : 'Send it to Marit for the Board papers', disabled: s.total > CH_BUDGET, meta: {k: 'send', bot: done}});
    const body = '<p>' + chMoney(CH_BUDGET) + ' for next year’s programme lines (game). Each line: what it costs, the risk it leaves, and the appetite and tolerance the Board approved on Monday. Left/right (or A) changes a line’s option.</p>' + chAllocSummary(a);
    const r = await UI.openModal('Budget · next year’s lines', body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    if (r && typeof r === 'object' && r.lr) { const l = CH_LINES[r.i]; if (l) { a[l.id] = (a[l.id] + r.d + l.opts.length) % l.opts.length; cur = r.i; } continue; }
    if (r >= 0 && r < CH_LINES.length) { const l = CH_LINES[r]; a[l.id] = (a[l.id] + 1) % l.opts.length; cur = r; continue; }
    const k = items[r] && items[r].meta.k;
    if (k === 'help') { await UI.openModal('The lines in business terms', chOptionsHtml(), [{label: 'Back to the allocation', meta: {back: true}}], {closable: false, cls: 'drill'}); cur = r; continue; }
    if (k === 'send') {
      const j = await UI.openModal('Send the allocation?', chAllocTable(a) + chAllocSummary(a) + '<p>Marit puts it in the Board papers beside Edda’s alternative. The Board decides on Thursday.</p>',
        [{label: 'Send it', meta: {k: 'go', bot: true}}, {label: 'Back to the lines', meta: {k: 'back'}}], {closable: false, cursor: 1});
      if (j === 0) return a;
      cur = r;
    }
  }
}

/* ---------- The Board's decision and the acceptances ---------- */
// The Board's rule (game), on every path:
// 1. R5 is never left unfunded: an allocation with R5 at $0 is corrected in the minute (R5 funded), as the chair won't
//    ask Celia to sign that (`restored`).
// 2. Persuaded (the CISO's allocation within appetite on every line, tolerances kept, and Rounds 1 and 2 answered right
//    first time), the Board approves the allocation as sent: the extension carries R6 for a year.
// 3. Otherwise, if the upgrade is not funded in full, the Board overrides: the upgrade in full, R2 and R3 deferred.
// 4. Then, while the total is over the budget, R2, R3, R4 and R1 are trimmed to $0, in that order (R1 is never trimmed
//    to Quote A: it would leave R1 at Medium, still above appetite).
// Whatever the path, the Board decides; the CISO's allocation is its advice.
function chBoardDecide(alloc, persuaded) {
  const f = Object.assign({}, alloc), up = chLine('R6').opts.length - 1;
  const total = () => CH_LINES.reduce((n, l) => n + chOpt(f, l).cost, 0);
  const restored = [], cut = [];
  if (!f.R5) { f.R5 = chLine('R5').opts.length - 1; restored.push('R5'); }
  const won = !!persuaded && chAllocStats(alloc).within === CH_LINES.length;
  let override = false;
  if (f.R6 !== up && !won) {
    override = true; f.R6 = up;
    for (const id of ['R2', 'R3']) { if (f[id]) cut.push(id); f[id] = 0; }
  }
  for (const id of ['R2', 'R3', 'R4', 'R1']) if (total() > CH_BUDGET && f[id]) { f[id] = 0; cut.push(id); }
  return {final: f, override, cut, restored, persuaded: won};
}
function chAboveAppetite(alloc) { return CH_LINES.filter(l => !chOptWithin(l, chOpt(alloc, l))); }
// An acceptance for a line the Board's decision leaves above appetite. One decider per decision: the Board decided to
// carry the risk and approved accepting the residual (its minute, with the CISO's advice and objection noted); the
// business owner signs for the interim measures and owns the treatment plan; the CISO advised and records both.
function chAcceptance(l, alloc, dec, day) {
  const o = chOpt(alloc, l), d = typeof dec === 'string' ? {decidedBy: dec} : (dec || {});
  return {line: l.id, name: l.name, owner: l.owner, residual: o.res, appetite: chAppetite(l.cat), breaks: chBreaks(o).slice(),
    decider: d.decider || 'Board', decidedBy: d.decidedBy || 'the Compact Board (minute, Day ' + day + ')', approvedBy: d.approvedBy === undefined ? 'the Compact Board' : d.approvedBy,
    signedBy: l.owner, signedFor: 'the interim measures and the treatment plan', day: day,
    expiry: CH_EXPIRY_DAY, review: CH_REVIEW_DAY, interim: l.interim || ''};
}
function chAcceptHtml(list) {
  if (!list.length) return '<p>No line above appetite: nothing to accept.</p>';
  return '<table class="sc"><tr><th>Line</th><th>Left</th><th>Decided</th><th>Signed</th><th>Review</th></tr>' + list.map(x => '<tr><td>' + esc(x.line) + '</td><td>' + esc(x.residual) + '</td><td>' + esc(x.decider || x.decidedBy.split(' ')[0]) + '</td><td>' + esc(x.signedBy.split(' ')[0]) + '</td><td>Day ' + x.review + '</td></tr>').join('') + '</table>' +
    '<ul>' + list.map(x => '<li><b>' + esc(x.line) + ' ' + esc(x.name) + '</b>: residual ' + esc(x.residual) + ' against a ' + esc(x.appetite) + ' appetite' + (x.breaks && x.breaks.length ? ', and it breaks the tolerance “' + esc(x.breaks.join('”, “')) + '”' : '') + '. ' +
      'Decided by ' + esc(x.decidedBy) + (x.approvedBy ? '; carrying the residual risk approved by ' + esc(x.approvedBy) : '') + '. ' +
      'Signed by ' + esc(x.signedBy) + ', its owner' + (x.signedFor ? ', for ' + esc(x.signedFor) : '') + '. Expires Day ' + x.expiry + '; reviewed Day ' + x.review + '.' + (x.interim ? ' Meanwhile: ' + esc(x.interim) : '') + '</li>').join('') + '</ul>';
}
