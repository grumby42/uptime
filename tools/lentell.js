// Length tell, per district (rebuilt in Charter slice 4; the scratchpad original was lost in a container reset).
// For every graded list (tests/tells.js --dump): is the right answer the longest option? the shortest? Against chance
// (a list with g right answers of n options: g/n). Single-answer lists only for "shortest". Usage: node tools/lentell.js
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), dump = path.join(os.tmpdir(), 'uptime-tells-dump-' + process.pid + '.json');
cp.execFileSync('node', [path.join(root, 'tests/tells.js'), '--dump=' + dump], {cwd: root, stdio: 'ignore'});
const D = JSON.parse(fs.readFileSync(dump, 'utf8')); fs.unlinkSync(dump);
const by = {};
for (const L of D.th.concat(D.cr, D.ch)) (by[L.d] = by[L.d] || []).push(L);
const order = ['frontdesk', 'mailroom', 'clerks', 'market', 'records', 'basement', 'server', 'water', 'council', 'cr-prologue', 'cr-library', 'cr-school', 'cr-clinic', 'cr-dispatch', 'cr-airport', 'cr-finale', 'ch-prologue', 'ch-budget', 'ch-suppliers', 'ch-policy', 'ch-report', 'ch-finale'];
for (const d of order.filter(d => by[d])) {
  let n = 0, lg = 0, el = 0, sn = 0, sh = 0, es = 0;
  for (const L of by[d]) {
    const len = L.items.map(x => x.label.length), mx = Math.max(...len), mn = Math.min(...len), g = L.items.filter(x => x.good).length;
    n++; if (L.items.some((x, i) => x.good && len[i] === mx)) lg++; el += g / L.items.length;
    if (g === 1) { sn++; if (L.items.some((x, i) => x.good && len[i] === mn)) sh++; es += 1 / L.items.length; }
  }
  console.log(d.padEnd(12) + ' lists ' + String(n).padStart(3) + '  longest-is-correct ' + String(lg).padStart(3) + '  expected by chance ' + el.toFixed(1) + '  | single-answer lists ' + sn + '  shortest-is-correct ' + sh + '  expected ' + es.toFixed(1));
}
