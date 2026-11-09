/* ============================================================
   UPTIME · editions/crossroads/report.js
   The report-writing primitive (principal DFIR consultant; designed in
   slice 1). A report spec R:
     {title, audience, intro(html), claims: [{id, text, evidence: [lines], truth: 'confirmed'|'likely'|'unknown', why}]}
   For each claim the player chooses the wording: Confirmed (the evidence shows
   it), Likely (it points to it, doesn't show it) or Unknown (it can't say).
   The scale is fixed and opens on "Read the evidence", never on an answer. The findings are written in a
   shuffled order (seeded like answer lists, so it holds on reload), so their position says nothing about their
   wording; the filed report lists them in the order the spec gives.
   Scoring (game): the right wording 20; an underclaim 8 (honest but weak);
   an overclaim 0, graded like a wrong verdict: the reviewer corrects it before
   the report goes, and it counts as a claim corrected. The filed report always
   carries the right wording.
   ============================================================ */
'use strict';

const REPORT_LEVELS = ['confirmed', 'likely', 'unknown'];
const REPORT_WORD = {confirmed: 'Confirmed', likely: 'Likely', unknown: 'Unknown'};
function reportEvidenceHtml(c) { return '<ul>' + c.evidence.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>'; }
async function doReport(R) {
  const out = new Array(R.claims.length);
  await UI.openModal('Report · ' + R.title, R.intro + '<p class="small">For each finding choose the wording the evidence supports. Confirmed: it shows it. Likely: it points to it but doesn’t show it. Unknown: it can’t say. Overclaiming is graded like a wrong verdict. (Scoring is a game model.)</p>',
    [{label: 'Start writing', meta: {good: true}}], {closable: false, cls: 'drill'});
  const order = shuffleOrder(R.claims.map(c => ({label: c.text})), {shuffle: true});   // order[shown position] = claim index
  for (let n = 0; n < R.claims.length; n++) {
    const c = R.claims[order[n]];
    let pick = null;
    while (pick === null) {
      const items = [
        {label: 'Confirmed', note: 'the evidence shows it', meta: {good: c.truth === 'confirmed', lv: 'confirmed'}},
        {label: 'Likely', note: 'the evidence points to it, doesn’t show it', meta: {good: c.truth === 'likely', lv: 'likely'}},
        {label: 'Unknown', note: 'the evidence can’t say', meta: {good: c.truth === 'unknown', lv: 'unknown'}},
        {label: 'Read the evidence', meta: {back: true}}];
      const i = await UI.openModal('Finding ' + (n + 1) + ' of ' + R.claims.length, '<div class="card"><b>' + esc(c.text) + '</b></div><p class="small">For: ' + esc(R.audience) + '</p>', items, {cursor: 3, closable: false, cls: 'drill'});
      if (items[i].meta.back) { await UI.openModal('Evidence for finding ' + (n + 1), reportEvidenceHtml(c), [{label: 'Back to the finding', meta: {good: true}}], {closable: false, cls: 'drill'}); continue; }
      pick = items[i].meta.lv;
    }
    const d = REPORT_LEVELS.indexOf(pick) - REPORT_LEVELS.indexOf(c.truth);  // < 0: stronger than the evidence
    const res = d === 0 ? 'right' : d < 0 ? 'over' : 'under';
    out[order[n]] = {id: c.id, pick: pick, truth: c.truth, res: res};
    sfx(res === 'right' ? 'correct' : res === 'over' ? 'wrong' : 'select');
    await say(res === 'right' ? REPORT_WORD[c.truth] + '. ' + c.why : res === 'over' ? 'Lucia, reviewing: “' + REPORT_WORD[pick] + ' claims more than the evidence holds. It goes out as ' + REPORT_WORD[c.truth].toLowerCase() + '.” ' + c.why : 'Lucia, reviewing: “The evidence carries more than that: ' + REPORT_WORD[c.truth].toLowerCase() + '.” ' + c.why);
  }
  const right = out.filter(x => x.res === 'right').length, over = out.filter(x => x.res === 'over').length, under = out.filter(x => x.res === 'under').length;
  const score = Math.round((right * 20 + under * 8) / (R.claims.length * 20) * 100);
  const filed = '<ol>' + R.claims.map((c, i) => '<li><b>' + REPORT_WORD[c.truth] + ':</b> ' + esc(c.text) + (out[i].res === 'over' ? ' <small>(corrected in review)</small>' : out[i].res === 'under' ? ' <small>(strengthened in review)</small>' : '') + '</li>').join('') + '</ol>';
  await UI.openModal('Report filed · ' + R.title, '<p class="big">Score ' + score + ' / 100 <span class="small">(game)</span></p><p>Right wording <b>' + right + '</b> · overclaimed <b>' + over + '</b> (corrected before it went) · underclaimed <b>' + under + '</b></p><h3>As filed, for ' + esc(R.audience) + '</h3>' + filed,
    [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'drill'});
  unlock('act', 'crwording');
  return {score, right, over, under, picks: out};
}
