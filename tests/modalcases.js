// Graded modal cases generated from an edition's own data (used by tests/modalfit.js; maintenance slice 1).
// Node side: names() reads the edition's sources for its drill sets, its reports and its clue-stage functions.
// Page side: gen(names) is passed to page.evaluate and returns every case as {id, title, body, items, o}, built the way
// the game builds it (engine/drill.js, editions/crossroads/report.js, the stage loops in the *-story.js files):
//   - every drill: the query hub, each source's question list, the verdict, the reasoning and the alternatives, with the
//     findings so far empty, longest first and shortest first;
//   - every report (Crossroads): each finding, at its place in the order the seed gives and as the first finding, so every
//     order a seed can produce is covered (a finding's modal depends only on its own text and its number);
//   - every clue stage (the boss and incident stages shown as a modal): clues in the written order, longest first and
//     shortest first.
'use strict';
const fs = require('fs');
const path = require('path');

function names(editionDir) {
  const out = { drills: [], reports: [], stages: [] };
  for (const f of fs.readdirSync(editionDir).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(editionDir, f), 'utf8');
    let m; const re = /^(?:const|let|var) ([A-Z][A-Z0-9_]*_DRILLS)\b/gm; while ((m = re.exec(src))) out.drills.push(m[1]);
    const rr = /^(?:const|let|var) ([A-Z][A-Z0-9_]*_REPORT[A-Z0-9_]*)\s*=/gm; while ((m = rr.exec(src))) out.reports.push(m[1]);
    // Clue stages shown as a modal: the stage functions that take no arguments (the Town Hall boss battles take picks and
    // are battles, not modals; Council Chambers' incident and every Crossroads boss are modals).
    const rs = /^function ([a-zA-Z]*BossStages)\(\)/gm; while ((m = rs.exec(src))) out.stages.push(m[1]);
  }
  for (const k of Object.keys(out)) out[k] = [...new Set(out[k])].sort();
  return out;
}

// Runs in the page. N = {drills: [...], reports: [...], stages: [...]}. Globals are looked up by name through a
// table the caller builds (window.__mfT), because top-level consts are not window properties.
function gen(N) {
  const T = window.__mfT, cases = [], errors = [];
  const byLen = (arr, f, dir) => arr.slice().sort((a, b) => dir * (f(b).length - f(a).length));
  for (const n of N.drills) {
    const set = T[n]; if (!set) { errors.push('no drill set ' + n); continue; }
    for (const [id, D] of Object.entries(set)) {
      if (!D || !D.sources || !D.verdicts) continue;
      const all = [];
      for (const s of D.sources) for (const q of s.qs) all.push({ head: s.name + ': ' + q.q, html: q.kind === 'broad' ? drillWall(q) : drillPre(q.res) });
      const orders = { none: [], long: byLen(all, f => f.html, 1), short: byLen(all, f => f.html, -1) };
      for (const [ok, findings] of Object.entries(orders)) {
        const st = { findings };
        const items = D.sources.map(s => ({ label: 'Query: ' + s.name, note: s.qs.length + ' question' + (s.qs.length === 1 ? '' : 's'), meta: { src: s.id, good: s.qs.some(q => q.key) } }));
        if (D.ai) items.push({ label: 'Ask Tally (AI assistant)', note: 'no budget · 1 Focus', meta: { ai: true } });
        items.push({ label: 'I have enough: decide', meta: { decide: true, good: false } });
        const hubBody = '<p>Budget left: <b>' + (D.budget || 2) + '</b> · Focus <b>' + G.focus + '/' + G.focusMax + '</b></p>' +
          '<details><summary>Artefact</summary>' + D.artefact + '</details><p><b>Question:</b> ' + esc(D.question) + '</p><h3>Findings</h3>' + drillFindings(st);
        cases.push({ id: n + '.' + id + '.hub.' + ok, title: 'Drill · ' + D.title, body: hubBody, items, o: { shuffle: true, closable: false, cls: 'drill' } });
        const ctx = '<h3>Findings</h3>' + drillFindings(st);
        cases.push({ id: n + '.' + id + '.verdict.' + ok, title: 'Verdict', body: '<p><b>' + esc(D.question) + '</b></p>' + ctx, items: D.verdicts.map(x => ({ label: x.label, meta: { good: !!x.good } })), o: { shuffle: true, closable: false, cls: 'drill' } });
        cases.push({ id: n + '.' + id + '.reasoning.' + ok, title: 'Reasoning', body: '<p>Which reasoning supports your verdict best? Reason only from what your queries showed: reasoning about evidence you never looked at earns no credit.</p>' + ctx, items: D.reasons.map(x => ({ label: x.label, meta: { good: !!x.good } })), o: { shuffle: true, closable: false, cls: 'drill' } });
      }
      for (const s of D.sources) {
        const qi = s.qs.map(q => ({ label: q.q, note: q.kind === 'broad' ? 'broad · 3 Focus' : '1 Focus', meta: { good: !!q.key } })).concat([{ label: 'Back', meta: { back: true } }]);
        cases.push({ id: n + '.' + id + '.query.' + s.id, title: 'Query: ' + s.name, body: '<p>Which question do you put to the <b>' + esc(s.name) + '</b>?</p>', items: qi, o: { shuffle: true, closable: false, cls: 'drill' } });
      }
      const pickN = D.altPick || 2;
      cases.push({ id: n + '.' + id + '.alts', title: 'Alternative explanations', body: '<p>Bonus: pick the <b>' + pickN + '</b> alternative explanations a careful analyst should name and rule out before closing this.</p>',
        items: D.alts.map(x => ({ label: x.label, meta: { good: !!x.good } })).concat([{ label: 'Done: these are my ' + pickN, done: true, meta: { done: true } }]), o: { shuffle: true, multi: pickN, closable: false, cls: 'drill' } });
    }
  }
  for (const n of N.reports) {
    const R = T[n]; if (!R || !R.claims) { errors.push('no report ' + n); continue; }
    const order = shuffleOrder(R.claims.map(c => ({ label: c.text })), { shuffle: true });
    R.claims.forEach((c, ci) => {
      const items = [
        { label: 'Confirmed', note: 'the evidence shows it', meta: { good: c.truth === 'confirmed', lv: 'confirmed' } },
        { label: 'Likely', note: 'the evidence points to it, doesn’t show it', meta: { good: c.truth === 'likely', lv: 'likely' } },
        { label: 'Unknown', note: 'the evidence can’t say', meta: { good: c.truth === 'unknown', lv: 'unknown' } },
        { label: 'Read the evidence', meta: { back: true } }];
      const body = '<div class="card"><b>' + esc(c.text) + '</b></div><p class="small">For: ' + esc(R.audience) + '</p>';
      for (const pos of [...new Set([order.indexOf(ci), 0])])
        cases.push({ id: n + '.claim' + ci + '.at' + (pos + 1), title: 'Finding ' + (pos + 1) + ' of ' + R.claims.length, body, items, o: { cursor: 3, closable: false, cls: 'drill' } });
    });
  }
  for (const n of N.stages) {
    let S = null;
    try { S = T[n](); } catch (e) { errors.push(n + ': ' + e.message); continue; }
    for (const [k, st] of Object.entries(S || {})) {
      if (!st || !st.clues || !st.resp) continue;
      const items = st.resp.map(r => ({ label: r.label, meta: { good: !!r.good } }));
      const orders = { written: st.clues, long: byLen(st.clues, x => x, 1), short: byLen(st.clues, x => x, -1) };
      for (const [ok, clues] of Object.entries(orders))
        cases.push({ id: n + '.' + k + '.' + ok, title: st.title, body: '<ul>' + clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, o: { shuffle: true, closable: false, cls: 'drill' } });
    }
  }
  return { cases, errors };
}

module.exports = { names, gen };
