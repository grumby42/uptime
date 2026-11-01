// Word tells: no tracked word or phrase may predict whether an option is right or wrong.
// A player who learns "options that say close are wrong" (or "options that say verify are right") can beat a list
// without reading it. This test scans every graded list in the sources (static, no browser):
//   - option arrays whose items carry good / meta.good flags (alert responses, verdicts, drill verdicts, reasons and
//     alternatives, boss stages, story choices),
//   - Dojo puzzles ({opts, good: index}), the tiering mini-game ({fix, bad[]}), the assessment owner question
//     ({owner[], ownerGood}) and the tabletop cards ({name, csf, text, good?}).
// Non-graded menus (End shift, Keep exploring, Yes/No ...) are left out, as in work/lentell.js.
// For each district and overall, and for each tracked word, it counts the options containing the word among the
// correct options (g of G) and among the wrong ones (b of B). Because there are about twice as many wrong options as
// right ones, raw counts are compared as rates: lean = (b/B) / (g/G + b/B), 0.5 = no tell, 1 = only ever wrong,
// 0 = only ever right. A word that appears in at least MIN_N options of a district (or of the whole game) and leans
// 70% or more either way fails the test. Words are matched on the text the player sees, in any sense ("close the
// case" and "close the port" are both "close"), because that is what a player can learn to spot.
// Usage: node tests/tells.js            (test; exit 1 on failure)
//        node tests/tells.js --report   (full table, every word, every district; no failure)
//        node tests/tells.js --hits=close [--d=basement]   (list the options carrying a word)
//        UPTIME_ROOT=/path/to/tree node tests/tells.js     (scan another checkout)
const fs = require('fs');
const path = require('path');
let acorn = null;
for (const m of ['acorn', '/opt/node-tools/node_modules/acorn']) { try { acorn = require(m); break; } catch (e) {} }
if (!acorn) { console.error('acorn not found (npm i acorn, or /opt/node-tools/node_modules/acorn)'); process.exit(2); }
const root = process.env.UPTIME_ROOT || path.resolve(__dirname, '..');
const THRESH = 0.70, MIN_N = 5;

// Tracked words. "close" is the surface word a player sees, in any sense (close a ticket, close a port).
// The first group is the "this option is wrong" family; the second the "this option is right" family.
const WORDS = [
  ['close', /\bclos(e|ed|es|ing)\b/i],
  ['dismiss', /\bdismiss(ed|es|ing)?\b/i],
  ['ignore', /\bignor(e|ed|es|ing)\b/i],
  ['benign/harmless', /\b(benign|harmless)\b/i],
  ['false positive', /\bfalse[- ]positive/i],
  ['suppress/mute', /\b(suppress(ed|es|ing)?|mut(e|ed|es|ing))\b/i],
  ['wait', /\bwait(ed|s|ing)?\b/i],
  ['leave', /\bleav(e|es|ing)\b/i],
  ['no action/nothing', /\b(no (further )?action|nothing (to do|more to do))\b/i],
  ['check', /\bcheck(ed|s|ing)?\b/i],
  ['verify', /\bverif(y|ied|ies|ying)\b/i],
  ['confirm', /\bconfirm(ed|s|ing)?\b/i],
  ['evidence', /\bevidence\b/i],
  ['scope', /\bscop(e|ed|es|ing)\b/i],
  ['preserve', /\bpreserv(e|ed|es|ing)\b/i],
  ['hunt', /\bhunt(ed|s|ing)?\b/i],
  ['review', /\breview(ed|s|ing)?\b/i],
];
// Extra words measured in --report only (not enforced): candidates for future tracking.
const EXTRA = [
  ['delete', /\bdelet(e|ed|es|ing)\b/i], ['block', /\bblock(ed|s|ing)?\b/i], ['restart/rerun', /\b(restart|rerun|re-run)/i],
  ['reset', /\breset(s|ting)?\b/i], ['isolate', /\bisolat(e|ed|es|ing)\b/i], ['revoke', /\brevok(e|ed|es|ing)\b/i],
  ['already', /\balready\b/i], ['only', /\bonly\b/i], ['every', /\bevery(thing|one)?\b/i], ['just', /\bjust\b/i],
  // Phrases that end the response early (the distractors' replacements for "and close"). Wrong by content: stopping
  // before containment is the mistake the game teaches. Reported so their spread stays visible.
  ['end-early', /\b(stop there|and stop:|stand down|move on|call it (done|contained|handled)|treat it as handled|mark (it|the alert) resolved|carry on)\b/i],
];

const files = fs.readdirSync(root + '/editions/town-hall').filter(f => f.endsWith('.js')).map(f => 'editions/town-hall/' + f)
  .concat(fs.readdirSync(root + '/engine').filter(f => f.endsWith('.js')).map(f => 'engine/' + f));
const DISTRICTS = ['frontdesk', 'mailroom', 'clerks', 'market', 'records', 'basement', 'server'];
const district = f => { const b = path.basename(f); if (/^(data|story|quiet)\.js$/.test(b) || f.startsWith('engine')) return 'frontdesk'; return b.split('-')[0]; };
function strOf(n) {
  if (!n) return null;
  if (n.type === 'Literal' && typeof n.value === 'string') return n.value;
  if (n.type === 'TemplateLiteral') return n.quasis.map(q => q.value.cooked).join(' ');
  if (n.type === 'BinaryExpression' && n.operator === '+') { const a = strOf(n.left), b = strOf(n.right); return (a === null ? ' ' : a) + (b === null ? ' ' : b); }
  if (n.type === 'ConditionalExpression') { const a = strOf(n.consequent), b = strOf(n.alternate); return a !== null ? a : b; }
  return null;
}
const prop = (o, k) => o.properties && o.properties.find(p => p.key && (p.key.name === k || p.key.value === k));
function goodOf(o) {
  const g = prop(o, 'good') || prop(o, 'correct');
  if (g) return g.value.type === 'Literal' ? g.value.value === true : undefined;
  const m = prop(o, 'meta');
  if (m && m.value.type === 'ObjectExpression') { const mg = prop(m.value, 'good'); if (mg) return mg.value.type === 'Literal' ? mg.value.value === true : undefined; }
  return false;
}
const lists = [];
for (const f of files) {
  const src = fs.readFileSync(root + '/' + f, 'utf8');
  const ast = acorn.parse(src, {ecmaVersion: 2022, locations: true, sourceType: 'script', allowReturnOutsideFunction: true});
  const push = (n, key, items) => lists.push({file: f, line: n.loc.start.line, key, items});
  (function walk(n) {
    if (!n || typeof n.type !== 'string') return;
    if (n.type === 'ArrayExpression' && n.elements.length >= 2 && n.elements.every(e => e && e.type === 'ObjectExpression' && prop(e, 'label'))) {
      const items = n.elements.map(e => ({label: strOf(prop(e, 'label').value), good: goodOf(e), done: !!prop(e, 'done'), line: e.loc.start.line})).filter(x => !x.done);
      if (items.length >= 2 && items.every(x => x.label !== null && x.good !== undefined) && items.some(x => x.good) && items.some(x => !x.good)) push(n, 'list', items);
    }
    if (n.type === 'ObjectExpression' && prop(n, 'opts') && prop(n, 'good') && prop(n, 'opts').value.type === 'ArrayExpression' && prop(n, 'good').value.type === 'Literal') {
      const g = prop(n, 'good').value.value, el = prop(n, 'opts').value.elements;
      if (typeof g === 'number' && el.every(e => strOf(e) !== null)) push(n, 'dojo', el.map((e, i) => ({label: strOf(e), good: i === g, line: e.loc.start.line})));
    }
    if (n.type === 'ObjectExpression' && prop(n, 'fix') && prop(n, 'bad') && prop(n, 'bad').value.type === 'ArrayExpression') {
      const fx = prop(n, 'fix').value, bad = prop(n, 'bad').value.elements;
      if (strOf(fx) !== null && bad.length && bad.every(b => strOf(b) !== null)) push(n, 'tier', [{label: strOf(fx), good: true, line: fx.loc.start.line}].concat(bad.map(b => ({label: strOf(b), good: false, line: b.loc.start.line}))));
    }
    if (n.type === 'ObjectExpression' && prop(n, 'owner') && prop(n, 'ownerGood') && prop(n, 'owner').value.type === 'ArrayExpression' && prop(n, 'ownerGood').value.type === 'Literal') {
      const g = prop(n, 'ownerGood').value.value, el = prop(n, 'owner').value.elements;
      if (typeof g === 'number' && el.every(e => strOf(e) !== null)) push(n, 'owner', el.map((e, i) => ({label: strOf(e), good: i === g, line: e.loc.start.line})));
    }
    if (n.type === 'ArrayExpression' && n.elements.length >= 4 && n.elements.every(e => e && e.type === 'ObjectExpression' && prop(e, 'text') && prop(e, 'csf') && !prop(e, 'label'))) {
      // Tabletop cards: the player sees the name and the text.
      const items = n.elements.map(e => ({label: strOf(prop(e, 'name').value) + ' — ' + strOf(prop(e, 'text').value), good: goodOf(e), line: e.loc.start.line}));
      if (items.every(x => x.good !== undefined) && items.some(x => x.good) && items.some(x => !x.good)) push(n, 'cards', items);
    }
    for (const k in n) { if (k === 'loc') continue; const v = n[k];
      if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === 'string') walk(v); }
  })(ast);
}
const SKIP = /^(End shift|Not yet|Keep exploring|Title screen|Fix it|Done|Yes|No)\b/;
const graded = lists.filter(L => !L.items.filter(x => x.good).every(x => SKIP.test(x.label)));
const opts = graded.flatMap(L => L.items.map(x => Object.assign({file: L.file, d: district(L.file), key: L.key}, x)));

function stat(set, re) {
  const G = set.filter(x => x.good), B = set.filter(x => !x.good);
  const g = G.filter(x => re.test(x.label)).length, b = B.filter(x => re.test(x.label)).length;
  const rg = G.length ? g / G.length : 0, rb = B.length ? b / B.length : 0;
  return {g, G: G.length, b, B: B.length, n: g + b, lean: rg + rb ? rb / (rg + rb) : 0.5};
}
const scopes = DISTRICTS.concat(['all']);
const inScope = s => s === 'all' ? opts : opts.filter(x => x.d === s);
const args = process.argv.slice(2);
const hitsArg = (args.find(a => a.startsWith('--hits=')) || '').slice(7), dArg = (args.find(a => a.startsWith('--d=')) || '').slice(4);
if (hitsArg) {
  const w = WORDS.concat(EXTRA).find(x => x[0] === hitsArg); if (!w) { console.error('unknown word ' + hitsArg); process.exit(2); }
  for (const x of opts) if ((!dArg || x.d === dArg) && w[1].test(x.label)) console.log((x.good ? 'GOOD ' : 'bad  ') + x.file.split('/').pop() + ':' + x.line, x.label);
  process.exit(0);
}
const fmt = s => (s.n ? (s.g + '/' + s.G + ' ' + s.b + '/' + s.B + ' ' + (s.lean * 100).toFixed(0) + '%') : '-');
const fails = [];
const report = args.includes('--report');
const words = report ? WORDS.concat(EXTRA) : WORDS;
if (report) console.log('cell = in-correct g/G  in-wrong b/B  lean-to-wrong%  (* = tell: n>=' + MIN_N + ' and lean >=' + THRESH * 100 + '% or <=' + Math.round((1 - THRESH) * 100) + '%)');
if (report) console.log('word'.padEnd(18) + scopes.map(s => s.padEnd(18)).join(''));
for (const [name, re] of words) {
  const cells = [];
  for (const s of scopes) {
    const st = stat(inScope(s), re), tell = st.n >= MIN_N && (st.lean >= THRESH || st.lean <= 1 - THRESH);
    if (tell && WORDS.some(w => w[0] === name)) fails.push(name + ' in ' + s + ': ' + fmt(st) + (st.lean >= THRESH ? ' (predicts wrong)' : ' (predicts right)'));
    cells.push(((tell ? '*' : ' ') + fmt(st)).padEnd(18));
  }
  if (report) console.log((EXTRA.some(w => w[0] === name) ? '(' + name + ')' : name).padEnd(18) + cells.join(''));
}
const nG = opts.filter(x => x.good).length;
console.log('Scanned ' + graded.length + ' graded lists, ' + opts.length + ' options (' + nG + ' correct, ' + (opts.length - nG) + ' wrong), ' + WORDS.length + ' tracked words.');
if (report) { if (fails.length) console.log('Tells:\n  ' + fails.join('\n  ')); process.exit(0); }
const checks = [
  ['source scan found graded lists in every district', DISTRICTS.every(d => graded.some(L => district(L.file) === d))],
  ['no tracked word leans ' + THRESH * 100 + '% or more to right or wrong (n>=' + MIN_N + ') in any district or overall', !fails.length],
];
for (const [n, ok] of checks) console.log((ok ? 'PASS ' : 'FAIL ') + n);
if (fails.length) console.log('  ' + fails.join('\n  '));
process.exit(checks.every(c => c[1]) ? 0 : 1);
