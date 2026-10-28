/* ============================================================
   UPTIME · engine/drill.js
   Investigation drill: a new encounter type. One artefact, one question and a
   small query budget (usually 2). The player picks queries as (evidence source,
   question) pairs. Focused questions return a short, exact snippet for 1 Focus;
   broad ones return a wall of rows for 3 Focus; trap questions spend the budget
   and mislead. Then a verdict, the reasoning behind it, and alternative
   explanations the player ruled out (bonus). An optional AI helper answers
   specific questions well and quietly truncates "everything".
   Inspired by Chris Sanders's Investigation Path posts (see CREDITS.md); every
   case is original. Drill data lives with each edition.

   Drill spec D:
   {id, title, intro(html), artefact(html), question, budget,
    sources: [{id, name, qs: [{q, kind: 'focus'|'broad'|'trap', key, res: [lines], wall: [row templates]}]}],
    ai: {everything: {text, wrong, reveal}, specific: {q, text}},
    verdicts: [{label, good, why}], reasons: [{label, good, why}],
    alts: [{label, good, why}], altPick, path(html), response: [lines], techs: [ids], acts: [keys]}
   ============================================================ */
'use strict';

const DRILL_COST = {focus: 1, broad: 3, trap: 1};

function drillPre(lines, cls) {
  return '<pre class="art' + (cls ? ' ' + cls : '') + '">' + lines.map(esc).join('\n') + '</pre>';
}
// A wall of rows for a broad query: noisy template rows, with the one row that matters buried deep.
function drillWall(q) {
  const rows = [], tpl = q.wall || ['…'];
  const n = q.rows || 1240;
  for (let i = 0; i < 18; i++) {
    let r = tpl[i % tpl.length];
    const mm = String((7 + i * 3) % 60).padStart(2, '0'), ss = String((13 + i * 17) % 60).padStart(2, '0');
    r = r.replace(/\{t\}/g, mm + ':' + ss).replace(/\{n\}/g, String(100 + (i * 37) % 900)).replace(/\{i\}/g, String(i + 1));
    rows.push(r);
  }
  if (q.buried) rows.splice(15, 0, q.buried);
  rows.push('… ' + (n - rows.length).toLocaleString('en-US') + ' more rows');
  return '<p class="small">' + n.toLocaleString('en-US') + ' rows returned. You skim the first screen.</p>' + drillPre(rows, 'wall');
}
function drillFindings(st) {
  if (!st.findings.length) return '<p class="small">No queries yet.</p>';
  return st.findings.map(f => '<div class="find"><b>' + esc(f.head) + '</b>' + f.html + '</div>').join('');
}
function drillKeysLeft(D, st) {
  let n = 0;
  D.sources.forEach(s => s.qs.forEach(q => { if (q.key && !st.used.includes(q)) n++; }));
  return n;
}

async function doDrill(D) {
  const st = {budget: D.budget || 2, used: [], findings: [], broad: 0, trap: 0, keys: 0, aiMode: null};
  UI.showPanel(false);
  touchCSF('Detect');
  const rules = '<p class="small">Query budget <b>' + st.budget + '</b>. A query is one evidence source plus one question. Focused questions return a short exact answer (1 Focus). Broad questions return a wall of rows (3 Focus). Then give a verdict and your reasoning, and name alternative explanations you ruled out. (Scoring is a game model.)</p>';
  await UI.openModal('Investigation drill · ' + D.title,
    D.intro + '<h3>Artefact</h3>' + D.artefact + '<p><b>Question:</b> ' + esc(D.question) + '</p>' + rules,
    [{label: 'Start investigating', meta: {good: true}}], {closable: false, cls: 'drill'});

  // ---- Queries ----
  while (true) {
    const keysLeft = drillKeysLeft(D, st);
    const items = D.sources.map(s => {
      const open = s.qs.filter(q => !st.used.includes(q));
      return {label: 'Query: ' + s.name, note: open.length + ' question' + (open.length === 1 ? '' : 's'),
        disabled: st.budget <= 0 || !open.length || G.focus < 1,
        meta: {src: s.id, good: st.budget > 0 && s.qs.some(q => q.key && !st.used.includes(q))}};
    });
    if (D.ai) items.push({label: 'Ask Tally (AI assistant)', note: 'no budget · 1 Focus', disabled: G.focus < 1, meta: {ai: true}});
    items.push({label: st.budget > 0 ? 'I have enough: decide' : 'Budget spent: decide', meta: {decide: true, good: st.budget <= 0 || keysLeft === 0}});
    const body = '<p>Budget left: <b>' + st.budget + '</b> · Focus <b>' + G.focus + '/' + G.focusMax + '</b></p>' +
      '<details><summary>Artefact</summary>' + D.artefact + '</details><p><b>Question:</b> ' + esc(D.question) + '</p><h3>Findings</h3>' + drillFindings(st);
    const i = await UI.openModal('Drill · ' + D.title, body, items, {closable: false, cls: 'drill'});
    const m = items[i].meta;
    if (m.decide) break;
    if (m.ai) { await drillAI(D, st); continue; }
    const src = D.sources.find(s => s.id === m.src);
    const qs = src.qs.filter(q => !st.used.includes(q));
    const qi = qs.map(q => ({label: q.q, note: q.kind === 'broad' ? 'broad · 3 Focus' : '1 Focus', disabled: G.focus < DRILL_COST[q.kind], meta: {good: !!q.key}}));
    qi.push({label: 'Back', meta: {back: true}});
    const k = await UI.openModal('Query: ' + src.name, '<p>Which question do you put to the <b>' + esc(src.name) + '</b>?</p>', qi, {closable: false, cls: 'drill'});
    if (qi[k].meta.back) continue;
    const q = qs[k];
    st.used.push(q); st.budget--;
    G.focus = Math.max(0, G.focus - DRILL_COST[q.kind]);
    let html;
    if (q.kind === 'broad') { st.broad++; html = drillWall(q); }
    else { if (q.kind === 'trap') st.trap++; if (q.key) st.keys++; html = drillPre(q.res); }
    if (q.note) html += '<p class="small">' + esc(q.note) + '</p>';
    st.findings.push({head: src.name + ': ' + q.q, html: html});
    await UI.openModal('Result', html, [{label: 'Back to the investigation', meta: {good: true}}], {closable: false, cls: 'drill'});
  }

  // ---- Verdict, reasoning, alternatives ----
  const ctx = '<h3>Findings</h3>' + drillFindings(st);
  const v = await UI.openModal('Verdict', '<p><b>' + esc(D.question) + '</b></p>' + ctx,
    D.verdicts.map(x => ({label: x.label, meta: {good: !!x.good}})), {closable: false, cls: 'drill'});
  const r = await UI.openModal('Reasoning', '<p>Which reasoning supports your verdict best?</p>' + ctx,
    D.reasons.map(x => ({label: x.label, meta: {good: !!x.good}})), {closable: false, cls: 'drill'});
  const pickN = D.altPick || 2;
  const altItems = D.alts.map(x => ({label: x.label, meta: {good: !!x.good}})).concat([{label: 'Done: these are my ' + pickN, done: true, meta: {done: true}}]);
  const alts = await UI.openModal('Alternative explanations',
    '<p>Bonus: pick the <b>' + pickN + '</b> alternative explanations a careful analyst should name and rule out before closing this.</p>',
    altItems, {multi: pickN, closable: false, cls: 'drill'});

  // ---- Score (game) and debrief ----
  const verdictOk = !!D.verdicts[v].good, reasonOk = !!D.reasons[r].good;
  const altOk = alts.filter(a => D.alts[a] && D.alts[a].good).length;
  const keyTotal = D.sources.reduce((n, s) => n + s.qs.filter(q => q.key).length, 0);
  const keyScore = Math.round(20 * Math.min(st.keys, Math.min(keyTotal, D.budget || 2)) / Math.min(keyTotal, D.budget || 2));
  let score = (verdictOk ? 40 : 0) + (reasonOk ? 20 : 0) + keyScore + altOk * 10 - st.broad * 5 - st.trap * 5;
  score = clamp(score, 0, 100);
  const aiWrong = st.aiMode === 'everything' && D.ai && D.ai.everything.wrong;
  let h = '<p class="big">Score ' + score + ' / 100 <span class="small">(game)</span></p>';
  h += '<p><b>Verdict:</b> ' + esc(D.verdicts[v].label) + ' — ' + (verdictOk ? 'correct. ' : 'not supported. ') + esc(D.verdicts[v].why || '') + '</p>';
  if (!verdictOk) h += '<p><b>Better verdict:</b> ' + esc(D.verdicts.find(x => x.good).label) + '</p>';
  h += '<p><b>Reasoning:</b> ' + (reasonOk ? 'sound. ' : 'weak. ') + esc(D.reasons[r].why || '') + '</p>';
  h += '<p><b>Alternatives:</b> ' + altOk + ' of ' + pickN + ' worth ruling out.</p><ul>' +
    D.alts.filter(x => x.good).map(x => '<li>' + esc(x.label) + ': ' + esc(x.why) + '</li>').join('') + '</ul>';
  h += '<p><b>Queries:</b> ' + st.keys + ' focused on the decisive evidence' + (st.broad ? ', ' + st.broad + ' broad (a wall of rows costs time and Focus)' : '') + (st.trap ? ', ' + st.trap + ' that could only mislead' : '') + '.</p>';
  h += '<h3>The focused path</h3>' + D.path;
  if (st.aiMode) h += '<h3>About Tally</h3><p>' + esc(st.aiMode === 'everything' ? D.ai.everything.reveal : 'You asked a specific question and checked it against the evidence. That is how an assistant helps.') + '</p>';
  h += '<h3>Response</h3><ul>' + D.response.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  h += '<p class="small">ATT&amp;CK: ' + D.techs.map(t => esc(t + ' ' + TECH[t].name)).join(' · ') + '</p>';
  D.techs.forEach(t => unlock('tech', t));
  (D.acts || []).forEach(a => unlock('act', a));
  unlock('act', 'drill');
  await UI.openModal('Debrief · ' + D.title, h, [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'drill'});
  await gainXP(Math.round(score / 4));
  return {score: score, verdictOk: verdictOk, reasonOk: reasonOk, alts: altOk, keys: st.keys, broad: st.broad, trap: st.trap, ai: st.aiMode, aiWrong: aiWrong};
}

async function drillAI(D, st) {
  const items = [
    {label: 'Give Tally everything (paste all the logs) and ask for a verdict', meta: {mode: 'everything'}},
    {label: 'Ask Tally: “' + D.ai.specific.q + '”', meta: {mode: 'specific'}},
    {label: 'Back', meta: {back: true}}];
  const i = await UI.openModal('Tally · AI assistant', '<p>Tally runs on your console. It answers in seconds. It can be wrong.</p>', items, {closable: false, cls: 'drill'});
  const m = items[i].meta;
  if (m.back) return;
  G.focus = Math.max(0, G.focus - 1);
  if (!st.aiMode || m.mode === 'everything') st.aiMode = m.mode;
  const a = m.mode === 'everything' ? D.ai.everything.text : D.ai.specific.text;
  const html = drillPre(['Tally: ' + a], 'ai');
  st.findings.push({head: 'Tally (AI): ' + (m.mode === 'everything' ? 'everything' : D.ai.specific.q), html: html});
  await UI.openModal('Tally says', html, [{label: 'Back to the investigation', meta: {good: true}}], {closable: false, cls: 'drill'});
}
