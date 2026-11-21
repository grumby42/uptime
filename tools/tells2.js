// A second view of the answer tells, per district (rebuilt in Charter slice 4; the scratchpad original was lost in a
// container reset): the right answer's length rank (1 = longest) against the mean rank by chance, the right answer's
// length against the mean wrong length, and the Yes/No openers (right and wrong). Usage: node tools/tells2.js
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '..'), dump = path.join(os.tmpdir(), 'uptime-tells2-dump-' + process.pid + '.json');
cp.execFileSync('node', [path.join(root, 'tests/tells.js'), '--dump=' + dump], {cwd: root, stdio: 'ignore'});
const D = JSON.parse(fs.readFileSync(dump, 'utf8')); fs.unlinkSync(dump);
const by = {};
for (const L of D.th.concat(D.cr, D.ch)) (by[L.d] = by[L.d] || []).push(L);
const order = ['frontdesk', 'mailroom', 'clerks', 'market', 'records', 'basement', 'server', 'water', 'council', 'cr-prologue', 'cr-library', 'cr-school', 'cr-clinic', 'cr-dispatch', 'cr-airport', 'cr-finale', 'ch-prologue', 'ch-budget', 'ch-suppliers', 'ch-policy', 'ch-report'];
console.log('district      single  mean rank (chance)  right len / wrong len  Yes/No openers right  wrong');
for (const d of order.filter(d => by[d])) {
  let n = 0, rk = 0, ch = 0, rl = 0, wl = 0, wn = 0, yr = 0, yw = 0, R = 0, Wn = 0;
  for (const L of by[d]) {
    for (const x of L.items) { const yn = /^(Yes|No)\b/.test(x.label); if (x.good) { R++; if (yn) yr++; } else { Wn++; if (yn) yw++; } }
    if (L.items.filter(x => x.good).length !== 1) continue;
    const sorted = L.items.map(x => x.label.length).sort((a, b) => b - a), g = L.items.find(x => x.good);
    n++; rk += sorted.indexOf(g.label.length) + 1; ch += (L.items.length + 1) / 2; rl += g.label.length;
    for (const x of L.items) if (!x.good) { wl += x.label.length; wn++; }
  }
  console.log(d.padEnd(13) + String(n).padStart(6) + '  ' + (rk / n).toFixed(2) + ' (' + (ch / n).toFixed(2) + ')' + '        ' + (rl / n).toFixed(0) + ' / ' + (wl / wn).toFixed(0) + '                ' + yr + '/' + R + '   ' + yw + '/' + Wn);
}
