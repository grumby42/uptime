/* ============================================================
   UPTIME · editions/crossroads/rota.js
   The rota / budget primitive (IR manager; designed in slice 1, used by the
   prologue's on-call week and the Library's after-hours cover).
   A rota spec R:
     {title, intro(html), nights, hours, maxRun, maxWeek, budget, callCost, tiredCost,
      people: [{id, name, skills, note, off: [night numbers], max}], calls: {night: 'what happens'}}
   doRota(R, preset) asks for one person per night (shuffled; any pick is allowed, and the game
   marks which picks keep the rules), then scores the week: rota gaps (hours nobody covers),
   tired nights (a person's third night or later in a row), nights over each person's limits,
   and overtime against the budget. Every rule and number is a game model (game).
   ============================================================ */
'use strict';

// Length of the run of nights person p is on, ending at night i (0-based), in assignment a.
function rotaRunAt(a, i) { if (!a[i]) return 0; let n = 0; for (let k = i; k >= 0 && a[k] === a[i]; k--) n++; return n; }
function rotaCount(a, id) { return a.filter(x => x === id).length; }
function rotaStats(R, a) {
  const tired = [], over = [], per = {};
  let gaps = 0, overtime = 0;
  for (let i = 0; i < R.nights; i++) {
    const id = a[i];
    if (!id) { gaps += R.hours; continue; }
    per[id] = (per[id] || 0) + 1;
    const run = rotaRunAt(a, i);
    if (run >= 3) tired.push(i + 1);
    if (run > R.maxRun || per[id] > maxFor(R, id)) over.push(i + 1);
    if (R.calls[i + 1]) overtime += run >= 3 ? R.tiredCost : R.callCost;
  }
  return {gaps, tired, over, per, overtime, variance: Math.round((overtime - R.budget) / R.budget * 100), maxRun: Math.max(0, ...a.map((_, i) => rotaRunAt(a, i)))};
}
function maxFor(R, id) { const p = R.people.find(x => x.id === id); return p && p.max !== undefined ? p.max : R.maxWeek; }
function rotaName(R, id) { const p = R.people.find(x => x.id === id); return p ? p.name : 'nobody'; }
// Would putting person p on night i keep the rules (available, rest, weekly limit)?
function rotaFits(R, a, i, p) {
  if ((p.off || []).includes(i + 1)) return false;
  const b = a.slice(); b[i] = p.id;
  return rotaRunAt(b, i) <= R.maxRun && (i + 1 >= R.nights || !b[i + 1] || rotaRunAt(b, i + 1) <= R.maxRun) && rotaCount(b, p.id) <= maxFor(R, p.id);
}
function rotaTable(R, a) {
  let h = '<table class="sc rota"><tr><th>Night</th><th>On call</th><th>In a row</th><th>Call</th></tr>';
  for (let i = 0; i < R.nights; i++) {
    const run = rotaRunAt(a, i);
    h += '<tr><td>' + (i + 1) + '</td><td>' + esc(a[i] ? rotaName(R, a[i]).split(' ')[0] : (a[i] === null ? 'uncovered' : '…')) + '</td><td>' + (a[i] ? run + (run >= 3 ? ' tired' : '') : '—') + '</td><td>' + (R.calls[i + 1] ? 'yes' : '') + '</td></tr>';
  }
  return h + '</table>';
}
async function doRota(R, preset) {
  const a = new Array(R.nights).fill(undefined);
  (preset || []).forEach((id, i) => { if (id) a[i] = id; });
  for (let i = 0; i < R.nights; i++) {
    if (a[i]) continue;
    const items = R.people.map(p => {
      const n = rotaCount(a, p.id), off = (p.off || []).includes(i + 1);
      return {label: p.name, note: off ? 'not available this night' + (p.note ? ' · ' + p.note : '') : n + ' of ' + maxFor(R, p.id) + ' nights so far' + (a[i - 1] === p.id ? ' · on call the night before' : '') + (p.note ? ' · ' + p.note : ''),
        disabled: off, meta: {good: rotaFits(R, a, i, p), id: p.id}};
    });
    items.push({label: 'Leave this night uncovered', note: 'alerts wait for 08:00', meta: {good: false, id: null}});
    const body = R.intro + rotaTable(R, a) + '<p class="small">Rules (game): one lead a night, ' + R.hours + ' hours on call; nobody more than ' + R.maxRun + ' nights in a row or ' + R.maxWeek + ' in the week.</p>';
    const k = await UI.openModal(R.title + ' · night ' + (i + 1), body, items, {shuffle: true, closable: false, cls: 'drill'});
    a[i] = items[k].meta.id;
  }
  return {assign: a.map(x => x || null), stats: rotaStats(R, a.map(x => x || null))};
}
// The forecast of a rota's week: what each call costs and where fatigue shows (game).
function rotaForecast(R, a) {
  const L = [];
  for (let i = 0; i < R.nights; i++) {
    const run = rotaRunAt(a, i), who = a[i] ? rotaName(R, a[i]).split(' ')[0] : null;
    if (!who) { L.push('Night ' + (i + 1) + ': nobody on call. Anything that fires waits ' + R.hours + ' hours for the morning.'); continue; }
    if (run >= 3) L.push('Night ' + (i + 1) + ': ' + who + ', night ' + run + ' in a row: a slower, thinner first look, with fewer facts in it' + (R.calls[i + 1] ? ', a ' + R.tiredCost + '-hour call-out, and a call to you: Focus −10 the next morning' : '') + '.');
    else if (R.calls[i + 1]) L.push('Night ' + (i + 1) + ': ' + who + ' takes ' + R.calls[i + 1] + ' (' + R.callCost + ' overtime hours).');
  }
  return L;
}
