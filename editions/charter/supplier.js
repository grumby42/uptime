/* ============================================================
   UPTIME · editions/charter/supplier.js
   Charter's supplier primitives (game models), used by District 2, Suppliers:
   - the tiering rule and the tiering editor: each supplier tiered by
     criticality (what stops for residents) and by data and access (what it
     holds, and any way into our systems), never by spend (CSF 2.0 GV.SC-04,
     cited in CREDITS.md); the CISO's tiers are the advice the scorecard reads;
   - the supplier register: tier, spend, owner, review date, the contract's
     holder and the clauses in it;
   - the clause plan: a fixed procurement envelope across the Compact's own
     contracts, a price uplift and a supplier's goodwill per clause, the
     must-haves set by the tier (GV.SC-05); insurance and indemnity are
     counsel's and procurement's call, shown and never chosen by the CISO;
   - a must-have left out of a contract: an acceptance signed by the service's
     business owner, who decides it (one decider), with an expiry, a review
     date and an interim measure; the Board sees it;
   - the supplier incident's timeline against Contract A (the tier-1 model
     terms): the Compact's own times only.
   Procurement (Ilka) and counsel (Noor) own the Compact's contracts; each
   member's owner decides that member's contracts.
   State: G.ch.sup (chSup() creates it, so a save from slice 1 loads too).
   ============================================================ */
'use strict';

function chSup() {
  const c = G.ch;
  if (!c.sup) c.sup = {tiers: null, sent: null, drills: {}, needs: {met: 0, total: 0}, incident: {first: []}, plan: null, planSent: null,
    accept: [], directive: null, dojo: [false, false, false], board: null};
  if (G.targets && G.targets.chSupTier === undefined) Object.assign(G.targets, {chSupCrit: 100, chSupTier: 100, chSupNotify: 100});
  return c.sup;
}
function chSupLine(id) { return CH_SUPPLIERS.find(s => s.id === id); }
function chContract(id) { return CH_SUP_CONTRACTS.find(k => k.id === id); }
function chClause(id) { return CH_CLAUSES.find(c => c.id === id); }

/* ---------- The tiering rule ---------- */
function chTierRule(s) { return s.crit === 'High' || s.data === 'High' ? 1 : s.crit === 'Medium' || s.data === 'Medium' ? 2 : 3; }
// The clauses a supplier's tier makes must-haves (C6 only where it has a way into our systems).
function chMust(s, tier) { const t = tier || chTierRule(s); return CH_CLAUSES.filter(c => c.must.includes(t) && (!c.wayIn || s.wayIn)).map(c => c.id); }
// Clauses in a supplier's contract now: the Compact's contracts (CH_SUP_CONTRACTS) or a member's own (CH_SUP_MEMBER_HAS).
function chHas(id) { const k = chContract(id); return k ? k.has.slice() : (CH_SUP_MEMBER_HAS[id] || []).slice(); }
function chTierWhy(s) {
  return 'If it stops: ' + s.crit + ' (' + CH_SUP_RULE.crit[s.crit] + '). Data and access: ' + s.data + ' (' + CH_SUP_RULE.data[s.data] + ').';
}
function chRuleHtml() {
  return '<p class="small">The tiering rule (game, written on Friday, Day 68). Criticality, what stops for residents if the supplier stops: High, ' + esc(CH_SUP_RULE.crit.High) + '; Medium, ' + esc(CH_SUP_RULE.crit.Medium) + '; Low, ' + esc(CH_SUP_RULE.crit.Low) + '. ' +
    'Data and access: High, ' + esc(CH_SUP_RULE.data.High) + '; Medium, ' + esc(CH_SUP_RULE.data.Medium) + '; Low, ' + esc(CH_SUP_RULE.data.Low) + '. ' + esc(CH_SUP_RULE.text) + '</p>';
}
// The tiering editor: left/right (or A) cycles a supplier's tier; the page reopens in place. Not graded line by line:
// the scorecard reads the tiers as sent. meta.bot marks the bot's next step (the rule's tiers); it is never shown.
async function chTierEdit() {
  const sup = chSup(), t = sup.tiers || (sup.tiers = Object.fromEntries(CH_SUPPLIERS.map(s => [s.id, 0])));
  let cur = 0;
  while (true) {
    const done = CH_SUPPLIERS.every(s => t[s.id]), right = CH_SUPPLIERS.every(s => t[s.id] === chTierRule(s));
    const items = CH_SUPPLIERS.map(s => ({label: s.name + ': ' + (t[s.id] ? 'Tier ' + t[s.id] : 'not tiered'),
      note: chMoney(s.spend) + ' a year. If it stops: ' + s.stops + ' Holds: ' + s.holds + ' (A cycles)', meta: {k: s.id, lr: true, bot: t[s.id] !== chTierRule(s)}}));
    items.push({label: 'The tiering rule', meta: {k: 'help'}});
    items.push({label: done ? 'Put the tiers on the register' : 'Tier every supplier first', disabled: !done, meta: {k: 'send', bot: right}});
    const body = '<p>Eight suppliers, inherited in order of spend. Tier each one by what stops for residents and by what it holds or can reach, not by what it costs. Left/right (or A) changes a tier. (game)</p>' +
      '<p>Tiered <b>' + CH_SUPPLIERS.filter(s => t[s.id]).length + ' of ' + CH_SUPPLIERS.length + '</b>. Owners and review dates came with every line (the Ballast Badge).</p>';
    const r = await UI.openModal('The supplier register · tiers', body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    if (r && typeof r === 'object' && r.lr) { const s = CH_SUPPLIERS[r.i]; if (s) { const v = t[s.id] || 0; t[s.id] = r.d > 0 ? v % 3 + 1 : (v <= 1 ? 3 : v - 1); cur = r.i; } continue; }
    if (r >= 0 && r < CH_SUPPLIERS.length) { const s = CH_SUPPLIERS[r]; t[s.id] = (t[s.id] || 0) % 3 + 1; cur = r; continue; }
    const k = items[r] && items[r].meta.k;
    if (k === 'help') { await UI.openModal('The tiering rule', chRuleHtml() + '<p class="small">CSF 2.0 GV.SC-04: “Suppliers are known and prioritized by criticality”.</p>', [{label: 'Back to the register', meta: {back: true}}], {closable: false, cls: 'drill'}); cur = r; continue; }
    if (k === 'send') return Object.assign({}, t);
  }
}
function chTierStats(sent) {
  if (!sent) return null;
  const ok = CH_SUPPLIERS.filter(s => sent[s.id] === chTierRule(s) && s.owner && CH_SUP_REVIEW);
  return {right: ok.length, pct: Math.round(ok.length / CH_SUPPLIERS.length * 100), wrong: CH_SUPPLIERS.filter(s => sent[s.id] !== chTierRule(s))};
}
function chTierDebrief(sent) {
  const st = chTierStats(sent);
  return '<table class="sc"><tr><th>Supplier</th><th>Spend</th><th>Yours</th><th>Rule</th></tr>' + CH_SUPPLIERS.map(s =>
    '<tr><td>' + esc(s.short) + '</td><td>' + chMoney(s.spend) + '</td><td>' + (sent[s.id] ? 'Tier ' + sent[s.id] : '—') + '</td><td>Tier ' + chTierRule(s) + '</td></tr>').join('') + '</table>' +
    (st.wrong.length ? '<ul>' + st.wrong.map(s => '<li><b>' + esc(s.short) + '</b>: Tier ' + chTierRule(s) + '. ' + esc(chTierWhy(s)) + '</li>').join('') + '</ul>' : '<p>Every line tiered by the rule.</p>') +
    '<p class="small">The biggest invoice, Inkmere at $210k, is Tier 2. Stillmark, at $22k, is Tier 1. (game)</p>';
}

/* ---------- The supplier register ---------- */
function chSupRegisterHtml() {
  const sup = chSup(), tiers = sup.sent ? Object.fromEntries(CH_SUPPLIERS.map(s => [s.id, chTierRule(s)])) : null, plan = sup.planSent;
  return '<table class="sc"><tr><th>Supplier</th><th>Tier</th><th>Owner</th><th>Review</th></tr>' + CH_SUPPLIERS.map(s =>
    '<tr><td>' + esc(s.short) + '</td><td>' + (tiers ? tiers[s.id] : '—') + '</td><td>' + esc(s.owner.replace(/^Director /, '').split(' ')[0]) + '</td><td>Day ' + CH_SUP_REVIEW + '</td></tr>').join('') + '</table>' +
    '<ul>' + CH_SUPPLIERS.map(s => {
      const must = chMust(s), has = new Set(chHas(s.id).concat(plan && plan[s.id] ? plan[s.id] : [])), miss = must.filter(c => !has.has(c));
      return '<li><b>' + esc(s.name) + '</b> (' + chMoney(s.spend) + ' a year; contract: ' + esc(s.holder) + '): ' + esc(s.serves) + (tiers ? ' Must-haves for its tier: ' + (miss.length ? 'missing ' + miss.join(', ') : 'all in') + (plan && plan[s.id] && plan[s.id].length ? ' (with your plan)' : '') + '.' : '') + '</li>';
    }).join('') + '</ul>' + (tiers ? '' : '<p class="small">Inherited: listed by spend, no tiers yet.</p>');
}

/* ---------- The clause plan: the Compact's four contracts, one envelope ---------- */
function chPlanInit() { const sup = chSup(); if (!sup.plan) sup.plan = Object.fromEntries(CH_SUP_CONTRACTS.map(k => [k.id, []])); return sup.plan; }
// What the plan costs and leaves: the envelope used, each supplier's goodwill used, and the must-haves still missing.
function chPlanStats(plan) {
  let cost = 0, mustTotal = 0, mustIn = 0; const per = {};
  for (const k of CH_SUP_CONTRACTS) {
    const s = chSupLine(k.id), want = plan[k.id] || [], must = chMust(s);
    let c = 0, g = 0; for (const id of want) { const o = k.offer[id]; if (o) { c += o[0]; g += o[1]; } }
    const have = new Set(k.has.concat(want)), miss = must.filter(id => !have.has(id));
    cost += c; mustTotal += must.length; mustIn += must.length - miss.length;
    per[k.id] = {cost: c, goodwill: g, overGoodwill: g > k.goodwill, miss: miss, must: must};
  }
  return {cost, over: cost > CH_SUP_ENVELOPE, per, mustTotal, mustIn, ok: cost <= CH_SUP_ENVELOPE && Object.values(per).every(p => !p.overGoodwill)};
}
function chPlanRec(id) { const k = chContract(id), s = chSupLine(id); return chMust(s).filter(c => !k.has.includes(c)); }
function chPlanLine(k, plan, st) {
  const s = chSupLine(k.id), p = st.per[k.id];
  return s.name + ' (Tier ' + chTierRule(s) + '): ' + (p.must.length - p.miss.length) + ' of ' + p.must.length + ' must-haves, ' + chMoney(p.cost) + ', goodwill ' + p.goodwill + ' of ' + k.goodwill + (p.overGoodwill ? ': too much to ask' : '');
}
async function chPlanContract(k) {
  const plan = chPlanInit(), s = chSupLine(k.id), want = plan[k.id];
  let cur = 0;
  while (true) {
    const st = chPlanStats(plan), p = st.per[k.id], rec = chPlanRec(k.id);
    const ids = Object.keys(k.offer);
    const items = ids.map(id => { const c = chClause(id), o = k.offer[id], on = want.includes(id);
      return {label: id + ' ' + c.name + ': ' + (on ? 'sought' : 'not sought') + ', ' + chMoney(o[0]) + ', goodwill ' + o[1] + (p.must.includes(id) ? ' · must-have' : ''),
        note: c.text + ' Without it: ' + c.without + ' (A cycles)', meta: {k: id, lr: true, bot: on !== rec.includes(id)}}; });
    items.push({label: 'Back to the contracts', meta: {k: 'back', bot: ids.every(id => want.includes(id) === rec.includes(id))}});
    const body = '<p><b>' + esc(s.name) + '</b>, Tier ' + chTierRule(s) + ' (owner ' + esc(s.owner) + '). ' + esc(k.what) + '. (game)</p>' +
      '<p class="small">In the contract now: ' + (k.has.length ? k.has.map(id => id + ' ' + esc(chClause(id).name)).join(', ') : 'none of the catalogue') + '. ' +
      CH_CLAUSE_COUNSEL.join(' and ') + ': counsel’s and procurement’s call (Noor and Ilka), not yours.</p>' +
      '<p>Goodwill <b>' + p.goodwill + ' of ' + k.goodwill + '</b>' + (p.overGoodwill ? ' (more than it will give)' : '') + ' · envelope <b>' + chMoney(st.cost) + ' of ' + chMoney(CH_SUP_ENVELOPE) + '</b> · must-haves missing: <b>' + (p.miss.length ? p.miss.join(', ') : 'none') + '</b></p>';
    const r = await UI.openModal('Clauses · ' + s.short, body, items, {closable: false, cursor: cur, inView: true, lr: true, cls: 'drill'});
    const flip = i => { const id = ids[i]; if (!id) return; const j = want.indexOf(id); if (j >= 0) want.splice(j, 1); else want.push(id); cur = i; };
    if (r && typeof r === 'object' && r.lr) { flip(r.i); continue; }
    if (r >= 0 && r < ids.length) { flip(r); continue; }
    return;
  }
}
// The plan page: one row per contract (A opens its clauses); send when the envelope and every supplier's goodwill allow.
async function chPlanEdit() {
  const plan = chPlanInit();
  let cur = 0;
  while (true) {
    const st = chPlanStats(plan), recDone = CH_SUP_CONTRACTS.every(k => { const rec = chPlanRec(k.id); return plan[k.id].length === rec.length && rec.every(id => plan[k.id].includes(id)); });
    const items = CH_SUP_CONTRACTS.map(k => { const rec = chPlanRec(k.id), same = plan[k.id].length === rec.length && rec.every(id => plan[k.id].includes(id));
      return {label: chPlanLine(k, plan, st), note: k.what + '. A opens its clauses.', meta: {k: k.id, bot: !same}}; });
    items.push({label: st.ok ? 'Send it to Ilka and Noor' : st.over ? 'Over the envelope by ' + chMoney(st.cost - CH_SUP_ENVELOPE) + ': change a contract' : 'Too much asked of one supplier: change it', disabled: !st.ok, meta: {k: 'send', bot: recDone}});
    const body = '<p>The Compact’s four contracts that change this year, and ' + chMoney(CH_SUP_ENVELOPE) + ' a year of price uplift across them (game). Each clause costs uplift and some of the supplier’s goodwill. The tier sets the must-haves. Ilka and Noor hold the contracts; each service’s owner signs for any must-have left out.</p>' +
      '<p>Envelope <b>' + chMoney(st.cost) + ' of ' + chMoney(CH_SUP_ENVELOPE) + '</b> · must-haves in or sought <b>' + st.mustIn + ' of ' + st.mustTotal + '</b> (game)</p>';
    const r = await UI.openModal('Clause plan · the Compact’s contracts', body, items, {closable: false, cursor: cur, inView: true, cls: 'drill'});
    if (r >= 0 && r < CH_SUP_CONTRACTS.length) { await chPlanContract(CH_SUP_CONTRACTS[r]); cur = r; continue; }
    if (items[r] && items[r].meta.k === 'send') {
      const left = CH_SUP_CONTRACTS.flatMap(k => st.per[k.id].miss.map(id => chSupLine(k.id).short + ' ' + id));
      const j = await UI.openModal('Send the plan?', '<p>' + chMoney(st.cost) + ' of ' + chMoney(CH_SUP_ENVELOPE) + '. ' + (left.length ? 'Must-haves left out, each needing its owner’s signed acceptance: <b>' + left.join(', ') + '</b>.' : 'Every must-have in or sought.') + '</p><p>Ilka and Noor take it to the suppliers.</p>',
        [{label: 'Send it', meta: {k: 'go', bot: true}}, {label: 'Back to the contracts', meta: {k: 'back'}}], {closable: false, cursor: 1});
      if (j === 0) return JSON.parse(JSON.stringify(plan));
      cur = r;
    }
  }
}
// The scorecard's supplier metrics, on the CISO's advice: the tiers as sent, and the plan as sent for the Compact's own
// tier-1 contracts (a member's contracts are its owner's decisions, shown on their own line).
function chSupStats() {
  const sup = chSup(), tier = chTierStats(sup.sent), plan = sup.planSent;
  const t1 = CH_SUP_CONTRACTS.filter(k => chTierRule(chSupLine(k.id)) === 1);
  const inPlan = id => new Set(chHas(id).concat(plan ? plan[id] || [] : []));
  const crit = plan ? Math.round(t1.filter(k => chMust(chSupLine(k.id)).every(c => inPlan(k.id).has(c))).length / t1.length * 100) : null;
  const notify = plan ? Math.round(t1.filter(k => inPlan(k.id).has('C1')).length / t1.length * 100) : null;
  const members = CH_SUPPLIERS.filter(s => !s.compact), memFull = members.filter(s => chMust(s).every(c => chHas(s.id).includes(c))).length;
  return {tier: tier ? tier.pct : null, crit, notify, members: members.length, memFull};
}

/* ---------- A must-have left out: the owner decides it and signs ---------- */
function chClauseAccept(id, clause, day) {
  const s = chSupLine(id), c = chClause(clause);
  return {line: s.short + ' ' + clause, name: s.name + ': ' + c.name, supplier: id, clause: clause, owner: s.owner, decider: s.owner.replace(/^Director /, '').split(' ')[0],
    decidedBy: s.owner + ', its owner', signedBy: s.owner, signedFor: 'leaving the clause out until the next renewal, and the interim measure', day: day,
    expiry: CH_EXPIRY_DAY, review: CH_SUP_REVIEW, interim: CH_CLAUSE_INTERIM[clause] || ''};
}
function chClauseAcceptHtml(list) {
  if (!list.length) return '<p>No must-have left out: nothing to accept.</p>';
  return '<table class="sc"><tr><th>Clause</th><th>Decided</th><th>Signed</th><th>Review</th></tr>' + list.map(x => '<tr><td>' + esc(x.line) + '</td><td>' + esc(x.decider) + '</td><td>' + esc(x.decider) + '</td><td>Day ' + x.review + '</td></tr>').join('') + '</table>' +
    '<ul>' + list.map(x => '<li><b>' + esc(x.name) + '</b>: a must-have for its tier, left out. Decided and signed by ' + esc(x.signedBy) + ', its owner, for ' + esc(x.signedFor) + '. Expires Day ' + x.expiry + '; reviewed Day ' + x.review + '. Meanwhile: ' + esc(x.interim) + ' The Board sees it.</li>').join('') + '</ul>';
}

/* ---------- The supplier incident: the Compact's own timeline against Contract A (game) ---------- */
function chSupTimelineHtml() {
  const rows = CH_SUP_TIMELINE.map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>').join('');
  return '<p>The Compact’s own records, Monday 21:14 to Thursday 12:00, beside what Contract A’s two clauses (C1 and C3) would have changed. (game)</p>' +
    '<table class="sc"><tr><th>What</th><th>As it was</th><th>Contract A</th></tr>' + rows + '</table>' +
    '<ul>' + CH_SUP_LOST.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
}
