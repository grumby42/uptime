// Length harness for the finale's scored lists (fix pass): every ch-finale list from tests/tells.js --dump, with each
// option's length, the right one marked, its rank, and the district totals (longest/shortest right vs chance).
// Usage: node docs/design/ch5/fix/finlen.js [--all]
'use strict';
const fs = require('fs'), path = require('path'), cp = require('child_process'), os = require('os');
const root = path.resolve(__dirname, '../../../..'), dump = path.join(os.tmpdir(), 'finlen-' + process.pid + '.json');
cp.execFileSync('node', [path.join(root, 'tests/tells.js'), '--dump=' + dump], {cwd: root, stdio: 'ignore'});
const D = JSON.parse(fs.readFileSync(dump, 'utf8')); fs.unlinkSync(dump);
const Ls = D.ch.filter(L => L.d === 'ch-finale');
let lg = 0, el = 0, sh = 0, es = 0, sn = 0;
for (const L of Ls) {
  const len = L.items.map(x => x.label.length), mx = Math.max(...len), mn = Math.min(...len), g = L.items.filter(x => x.good).length;
  const isL = L.items.some((x, i) => x.good && len[i] === mx), isS = g === 1 && L.items.some((x, i) => x.good && len[i] === mn);
  if (isL) lg++; el += g / L.items.length; if (g === 1) { sn++; es += 1 / L.items.length; if (isS) sh++; }
  if (process.argv.includes('--all') || isL || isS) console.log((isL ? 'LONG ' : isS ? 'SHORT' : '     ') + ' ' + (L.top || '') + ' ' + L.items.map(x => (x.good ? '*' : '') + x.label.length).join('/') + '  ' + (L.items.find(x => x.good) || {label: ''}).label.slice(0, 70));
}
console.log('lists ' + Ls.length + ' longest-right ' + lg + ' (chance ' + el.toFixed(1) + ') shortest-right ' + sh + ' of ' + sn + ' (chance ' + es.toFixed(1) + ')');
