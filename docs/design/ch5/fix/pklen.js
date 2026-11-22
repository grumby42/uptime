// Packet rows: each wording's length, the supported one marked, and its rank (1 = longest). Usage: node pklen.js
const vm = require('vm'), fs = require('fs'), ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/../../../../editions/charter/finale-data.js', 'utf8') + ';this.P=CH_FIN_PACKETS;this.D=CH_FIN_DOJO;this.B=CH_FIN_BOARD_SPECS();this.S=CH_FIN_SENT_QS;', ctx);
let top2 = 0, low = 0, lg = 0, sh = 0, exp2 = 0, expL = 0;
for (const r of ctx.P.flatMap(P => P.rows)) {
  const len = r.variants.map(v => v.label.length), g = r.variants.findIndex(v => v.good), rank = len.filter(x => x > len[g]).length + 1;
  exp2 += 2 / len.length; expL += 1 / len.length; if (rank <= 2) top2++; if (rank >= 3 || len[g] === Math.min(...len)) low++; if (rank === 1) lg++; if (len[g] === Math.min(...len)) sh++;
  console.log(r.id.padEnd(4) + ' rank ' + rank + '/' + len.length + '  ' + len.map((x, i) => (i === g ? '*' : '') + x).join(' '));
}
console.log('packets: top2 ' + top2 + ' (chance ' + exp2.toFixed(1) + '), low ' + low + ', longest ' + lg + ', shortest ' + sh + ' (chance ' + expL.toFixed(1) + ' each)');
const lists = ctx.D.map(q => ({n: 'dojo ' + q.q.slice(0, 20), o: q.opts.map((t, i) => ({t, g: i === q.good}))})).concat(ctx.B.map(b => ({n: b.title, o: b.resp.map(r => ({t: r.label, g: !!r.good}))})),
  Object.entries(ctx.S).flatMap(([k, v]) => Object.values(v).map(b => ({n: b.title, o: b.resp.map(r => ({t: r.label, g: !!r.good}))}))));
let L = 0, S = 0, eL = 0;
for (const x of lists) { const len = x.o.map(o => o.t.length), g = x.o.findIndex(o => o.g), rank = len.filter(y => y > len[g]).length + 1; eL += 1 / len.length; if (rank === 1) L++; if (len[g] === Math.min(...len)) S++; console.log(x.n.padEnd(26) + ' rank ' + rank + '/' + len.length + '  ' + len.map((y, i) => (i === g ? '*' : '') + y).join(' ')); }
console.log('dojo+board: longest ' + L + ', shortest ' + S + ' of ' + lists.length + ' (chance ' + eL.toFixed(1) + ' each)');
