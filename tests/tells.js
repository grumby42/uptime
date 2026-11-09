// Word tells: no tracked word or phrase may predict whether an option is right or wrong.
// A player who learns "options that say close are wrong" (or "options that say verify are right") can beat a list
// without reading it. This test scans every graded list in the sources (static, no browser):
//   - option arrays whose items carry good / meta.good flags (alert responses, verdicts, drill verdicts, reasons and
//     alternatives, boss stages, story choices),
//   - Dojo puzzles ({opts, good: index}), the tiering mini-game ({fix, bad[]}), the assessment owner question
//     ({owner[], ownerGood}) and the tabletop cards ({name, csf, text, good?}).
// Non-graded menus (End shift, Keep exploring, Yes/No ...) are left out, as in work/lentell.js.
// Each list also gets a list type (drill verdicts, drill reasons, alert verdicts/responses, board rounds, boss stages,
// story choices, other), because a tell can hide in one list type while the district totals look balanced.
// For each district and overall, and for each tracked word, it counts the options containing the word among the
// correct options (g of G) and among the wrong ones (b of B). Because there are about twice as many wrong options as
// right ones, raw counts are compared as rates: lean = (b/B) / (g/G + b/B), 0.5 = no tell, 1 = only ever wrong,
// 0 = only ever right. A word that appears in at least MIN_N options of a district (or of the whole game) and leans
// 70% or more either way fails the test, and so does one that does so inside one list type (all districts together).
// Anything outside 35–65% at n >= MIN_N is printed as a warning (not a failure), so the next edit sees a thin margin. Words are matched on the text the player sees, in any sense ("close the
// case" and "close the port" are both "close"), because that is what a player can learn to spot.
// Besides single words it tracks synonym groups (a tell that moves from "preserve" to "keep the logs" is still a tell)
// and the opening of a label (a dismissal verdict at the start: "Ignore", "Let it go", "Skip it", "Benign:" ...).
// Usage: node tests/tells.js            (test; exit 1 on failure; warnings printed)
//        node tests/tells.js --report   (full tables by district and by list type, every word; no failure)
//        node tests/tells.js --hits=close [--d=basement] [--t=drill-verdicts]   (list the options carrying a word)
//        UPTIME_ROOT=/path/to/tree node tests/tells.js     (scan another checkout)
// Crossroads (editions/crossroads) is scanned as its own population (districts cr-prologue, cr-library and cr-school), so the
// Town Hall tables above are unchanged by it. The same 70% rule applies to it, any warning inside 35-65% fails it
// (Crossroads starts clean), and it is held to the band on its own word groups (CROSSROADS_BAND: rota/rest/fatigue,
// retainer/firm, custody/hash, confirmed/likely/unknown, counsel words, hurry words; and, since the slice-1 review, the
// "… decides" words, the absolutes and the "so/because" clause, from n >= 3; since slice 2 (the School District), the
// vendor/contract, notify/notice and student/parent words too).
const fs = require('fs');
const path = require('path');
let acorn = null;
for (const m of ['acorn', '/opt/node-tools/node_modules/acorn']) { try { acorn = require(m); break; } catch (e) {} }
if (!acorn) { console.error('acorn not found (npm i acorn, or /opt/node-tools/node_modules/acorn)'); process.exit(2); }
const root = process.env.UPTIME_ROOT || path.resolve(__dirname, '..');
const THRESH = 0.70, WARN = 0.65, MIN_N = 5;

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
  // Older strong tells, enforced since the second word-tell pass.
  ['tonight', /\btonight\b/i],
  ['isolate', /\bisolat(e|ed|es|ing)\b/i],
  ['revoke', /\brevok(e|ed|es|ing)\b/i],
  ['reset', /\breset(s|ting)?\b/i],
  ['already', /\balready\b/i],
  ['just', /\bjust\b/i],
  // Synonym groups.
  ['G:preserve', /(\bpreserv(e|ed|es|ing)\b|\bsecur(e|ed|es|ing)\b|(?<!(golden|clean|known-good|good|signed|same) )\bimag(e|ed|es|ing)\b|\bevidence\b|\b(keep|keeps|kept|keeping|save|saves|saved|saving|copy|copies|copied|copying|hold|holds|retain|retains)\b[^.;:]{0,40}\blogs?\b)/i],
  ['G:find', /\b(find|finds|finding|search(ed|es|ing)?|trac(e|ed|es|ing)|hunt(ed|s|ing)?)\b/i],
  ['G:dismiss-open', /^(Ignore|Leave|Let (it|them|the)\b|Keep (it|them)(:| as it)|Skip it|No change|No need|Not ours|Accept the|Benign|Expected activity|Harmless|Noise|Dismiss|Close(:| it\b)|File it as|False positive|Legitimate|Genuine|Not an attack|Not malicious)/i],
  // Phrases that end the response (enforced since the second pass: a phrase that is never right is a tell too).
  ['G:end-early', /\b(stop there|and stop:|stand down|move on|carry on|call it (done|contained|handled|closed)|treat it as handled|mark(ed)? (it |the alert |the case )?resolved)\b|(^|[,;:.]\s*|\b(so|then|and)\s+)clos(e|ed|es|ing)\b(?!\s+(the (port|ports|rule|account|accounts|session|sessions|gap|door|hole|share)\b|ports?\b|a\b|an\b|its\b|card\b|that\b|this\b|off\b|down\b|in\b|to\b|enough\b))/i],
];
// Extra words measured in --report only (not enforced): candidates for future tracking.
const EXTRA = [
  // OT words (Water Plant review, 1 Nov 2026): reported, not enforced game-wide yet, because G:urgent already leans
  // 72-73% to wrong in Records Hall and the Server Room (backlog: rebalance there, then enforce). The Water Plant itself
  // is held to the warning band on these four groups (WATER_BAND below).
  ['G:shutdown', /\b(shut|shuts|shutting|power(ed|s|ing)? (it |them |the [^ ]+ )?(off|down)|power-cycl\w*|unplug\w*|disconnect\w*|turn(ed)? off)\b/i],
  ['operator', /\boperators?\b/i],
  ['compare', /\bcompar(e|ed|es|ing)\b/i],
  ['G:urgent', /\b(now|at once|straight away|immediately|this (afternoon|evening))\b/i],
  ['delete', /\bdelet(e|ed|es|ing)\b/i], ['block', /\bblock(ed|s|ing)?\b/i], ['restart/rerun', /\b(restart|rerun|re-run)/i],
  ['only', /\bonly\b/i], ['every', /\bevery(thing|one)?\b/i], ['now', /\bnow\b/i],
  // Leadership words (Council Chambers, 1 Nov 2026): reported game-wide, and held to the 35-65% band inside Council
  // Chambers (COUNCIL_BAND below), where right answers could otherwise be the ones that sound like good governance.
  ['brief', /\bbrief(s|ed|ing|ings)?\b/i], ['council', /\bcouncil(s|lor|lors)?\b/i], ['stakeholder', /\bstakeholders?\b/i],
  ['transparent', /\b(transparen(t|cy)|open with|open about|being open)\b/i], ['accountable', /\baccountab(le|ility)\b/i],
  ['risk', /\brisks?\b/i], ['owner', /\bown(s|ed|er|ers|ership|ing)?\b/i], ['budget', /\bbudget(s|ed)?\b|\$\d/i],
  ['counsel', /\b(Noor|counsel|legal|attorney|lawyers?)\b/i],
  // The broad investigate family (every enforced investigative word above, plus their synonyms). Reported, not
  // enforced: right answers to an open question naturally include an investigative step; each word in it is enforced.
  // Synonym families for the containment and credential words enforced above, so a move to synonyms stays visible.
  ['G:contain', /\b(isolat(e|ed|es|ing)|contain(ed|s|ing)?|quarantin(e|ed|es|ing)|cut (it|them|the [^ ]+|[A-Z][^ ]*) off|off the network|take [^,;:]{1,30} offline)\b/i],
  ['G:credential', /\b(reset(s|ting)?|revok(e|ed|es|ing)|end (its|their|her|his|all its) sessions|sign(ed)? (it|them|her|him|[a-z.-]+) out|chang(e|ed|ing) (the|her|his|its) password|rotat(e|ed|es|ing))\b/i],
  ['G:investigate', /\b(check(ed|s|ing)?|verif(y|ied|ies|ying)|confirm(ed|s|ing)?|scop(e|ed|es|ing)|hunt(ed|s|ing)?|find|finds|search(ed|es|ing)?|trac(e|ed|es|ing)|review(ed|s|ing)?|audit(ed|s|ing)?|work out|go through|make sure|investigat(e|ed|es|ing))\b/i],
  // Crossroads word groups (7 Nov 2026): reported game-wide, held to the 35-65% band inside Crossroads (CROSSROADS_BAND).
  ['G:rota', /\b(rota|rest(ed|ing)?|fatigue[ds]?|tired|in a row|nights? running|on call)\b/i],
  ['G:retainer', /\b(retainer|firm|firm’s|Tallowmere)\b/i],
  ['G:custody', /\b(custody|hash(es|ed|ing)?|SHA-256|seal(ed|s)?)\b/i],
  ['G:certainty', /\b(confirmed|likely|unknown|certain(ty)?|sure)\b/i],
];

// Crossroads-only groups (review of slice 1, 7 Nov 2026, B5): "… decides" was a right-answer word, the absolutes and the
// causal "so/because" clause wrong-answer words. Kept out of EXTRA so the Town Hall tables (and --report) are unchanged;
// measured and enforced inside Crossroads only.
const CR_EXTRA = [
  ['G:decide', /\bdecid(e|es|ed|ing)\b|\bher call\b|\bhis call\b/i],
  ['G:absolute', /\b(every|everything|all|never|always|nothing|whatever|at all)\b/i],
  ['G:because', /\b(because|so|since)\b/i],
  // Slice 2 (the School District, 9 Nov 2026): third-party, notification and student-data words.
  ['G:vendor', /\b(vendors?|vendor’s|contracts?|contract’s|Lumenlark|Lumenlark’s|clause|suppliers?|terms)\b/i],
  ['G:notify', /\b(notif(y|ies|ied|ying|ication|ications)|notices?|tell(s|ing)? families|told)\b/i],
  ['G:student', /\b(students?|students’|student’s|parents?|famil(y|ies)|children|children’s|pupils?)\b/i],
];

const files = fs.readdirSync(root + '/editions/town-hall').filter(f => f.endsWith('.js')).map(f => 'editions/town-hall/' + f)
  .concat(fs.readdirSync(root + '/engine').filter(f => f.endsWith('.js')).map(f => 'engine/' + f));
const crFiles = fs.existsSync(root + '/editions/crossroads') ? fs.readdirSync(root + '/editions/crossroads').filter(f => f.endsWith('.js')).map(f => 'editions/crossroads/' + f) : [];
const DISTRICTS = ['frontdesk', 'mailroom', 'clerks', 'market', 'records', 'basement', 'server', 'water', 'council'];
const district = f => { const b = path.basename(f); if (f.startsWith('editions/crossroads/')) return /^library-/.test(b) ? 'cr-library' : /^school-/.test(b) ? 'cr-school' : 'cr-prologue'; if (/^(data|story|quiet)\.js$/.test(b) || f.startsWith('engine')) return 'frontdesk'; return b.split('-')[0]; };
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
let lists = [];
// List type, from where the list sits: the top-level constant or function around it and the property holding it.
function listType(top, key, kind) {
  if (kind !== 'list') return 'other';
  if (key === 'verdicts') return 'drill-verdicts';
  if (key === 'reasons' || key === 'alts') return 'drill-reasons';
  if (/BOARD_SPECS/.test(top)) return 'board-rounds';
  if (key === 'resp' && /^(s\d|stages|.*[bB]ossStages\(\))$/.test(top)) return 'boss-stages';
  if (key === 'resp') return 'alert-verdicts';
  if (key === '' || key.startsWith('(')) return 'story-choices';
  return 'other';
}
const TYPES = ['drill-verdicts', 'drill-reasons', 'alert-verdicts', 'board-rounds', 'boss-stages', 'story-choices', 'other'];
function scanFiles(files) {
for (const f of files) {
  const src = fs.readFileSync(root + '/' + f, 'utf8');
  const ast = acorn.parse(src, {ecmaVersion: 2022, locations: true, sourceType: 'script', allowReturnOutsideFunction: true});
  let top = '', key = '';
  const push = (n, kind, items) => lists.push({file: f, line: n.loc.start.line, key: kind, type: listType(top, key, kind), items});
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
    const saveTop = top, saveKey = key;
    if (n.type === 'VariableDeclarator' && n.id.name) top = n.id.name;
    if (n.type === 'FunctionDeclaration' && n.id) top = n.id.name + '()';
    for (const k in n) { if (k === 'loc') continue; const v = n[k];
      const kk = key;
      if (n.type === 'Property' && k === 'value') key = n.key.name || n.key.value;
      if (n.type === 'CallExpression' && k === 'arguments') key = '(' + (n.callee.name || (n.callee.property && n.callee.property.name)) + ')';
      if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v.type === 'string') walk(v);
      key = kk; }
    top = saveTop; key = saveKey;
  })(ast);
}
}
scanFiles(files);
const thLists = lists; lists = [];
scanFiles(crFiles);
const crLists = lists; lists = thLists;
const SKIP = /^(End shift|Not yet|Keep exploring|Title screen|Fix it|Done|Yes|No)\b/;
const graded = lists.filter(L => !L.items.filter(x => x.good).every(x => SKIP.test(x.label)));
const opts = graded.flatMap(L => L.items.map(x => Object.assign({file: L.file, d: district(L.file), key: L.key, t: L.type}, x)));
const crGraded = crLists.filter(L => !L.items.filter(x => x.good).every(x => SKIP.test(x.label)));
const crOpts = crGraded.flatMap(L => L.items.map(x => Object.assign({file: L.file, d: district(L.file), key: L.key, t: L.type}, x)));

function stat(set, re) {
  const G = set.filter(x => x.good), B = set.filter(x => !x.good);
  const g = G.filter(x => re.test(x.label)).length, b = B.filter(x => re.test(x.label)).length;
  const rg = G.length ? g / G.length : 0, rb = B.length ? b / B.length : 0;
  return {g, G: G.length, b, B: B.length, n: g + b, lean: rg + rb ? rb / (rg + rb) : 0.5};
}
const scopes = DISTRICTS.concat(['all']);
const inScope = s => s === 'all' ? opts : TYPES.includes(s) ? opts.filter(x => x.t === s) : opts.filter(x => x.d === s);
const args = process.argv.slice(2);
const argOf = k => (args.find(a => a.startsWith('--' + k + '=')) || '').slice(k.length + 3);
const hitsArg = argOf('hits'), dArg = argOf('d'), tArg = argOf('t');
if (hitsArg) {
  const w = WORDS.concat(EXTRA, CR_EXTRA).find(x => x[0] === hitsArg); if (!w) { console.error('unknown word ' + hitsArg); process.exit(2); }
  for (const x of opts.concat(crOpts)) if ((!dArg || x.d === dArg) && (!tArg || x.t === tArg) && w[1].test(x.label)) console.log((x.good ? 'GOOD ' : 'bad  ') + x.file.split('/').pop() + ':' + x.line + ' [' + x.t + ']', x.label);
  process.exit(0);
}
const fmt = s => (s.n ? (s.g + '/' + s.G + ' ' + s.b + '/' + s.B + ' ' + (s.lean * 100).toFixed(0) + '%') : '-');
const fails = [], warns = [];
const report = args.includes('--report');
const words = report ? WORDS.concat(EXTRA) : WORDS;
const enforced = name => WORDS.some(w => w[0] === name);
function table(title, cols) {
  if (report) console.log('\n' + title + '\n' + 'word'.padEnd(18) + cols.map(s => s.padEnd(19)).join(''));
  for (const [name, re] of words) {
    const cells = [];
    for (const s of cols) {
      const st = stat(inScope(s), re), big = st.n >= MIN_N;
      const tell = big && (st.lean >= THRESH || st.lean <= 1 - THRESH), warn = big && !tell && (st.lean > WARN || st.lean < 1 - WARN);
      const where = (TYPES.includes(s) ? 'list type ' : '') + s;
      if (tell && enforced(name)) fails.push(name + ' in ' + where + ': ' + fmt(st) + (st.lean >= THRESH ? ' (predicts wrong)' : ' (predicts right)'));
      if (warn && enforced(name)) warns.push(name + ' in ' + where + ': ' + fmt(st));
      cells.push(((tell ? '*' : warn ? '~' : ' ') + fmt(st)).padEnd(19));
    }
    if (report) console.log((enforced(name) ? name : '(' + name + ')').padEnd(18) + cells.join(''));
  }
}
if (report) console.log('cell = in-correct g/G  in-wrong b/B  lean-to-wrong%  (* = tell: n>=' + MIN_N + ' and lean >=' + THRESH * 100 + '% or <=' + Math.round((1 - THRESH) * 100) + '%; ~ = warning: outside ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '%)');
table('By district', scopes);
table('By list type (all districts)', TYPES);
const nG = opts.filter(x => x.good).length;
console.log('Scanned ' + graded.length + ' graded lists, ' + opts.length + ' options (' + nG + ' correct, ' + (opts.length - nG) + ' wrong), ' + WORDS.length + ' tracked words and groups.');
if (report) {
  console.log('Lists by type: ' + TYPES.map(t => t + ' ' + graded.filter(L => L.type === t).length).join(', '));
  if (fails.length) console.log('Tells:\n  ' + fails.join('\n  '));
  if (warns.length) console.log('Warnings:\n  ' + warns.join('\n  '));
}
// The OT groups above are report-only game-wide, but the Water Plant (where they were found) must stay inside the
// 35–65% band on each of them at n >= MIN_N.
const WATER_BAND = ['G:shutdown', 'operator', 'compare', 'G:urgent'];
const waterBand = WATER_BAND.map(n => { const st = stat(inScope('water'), EXTRA.find(w => w[0] === n)[1]); return {n, st, ok: st.n < MIN_N || (st.lean >= 1 - WARN && st.lean <= WARN)}; });
// Council Chambers is held to the same band on the leadership words, the counsel words (Noor, counsel, legal, attorney,
// lawyer: report-only game-wide) and the hurry words (G:urgent).
const COUNCIL_BAND = ['brief', 'council', 'stakeholder', 'transparent', 'accountable', 'risk', 'owner', 'budget', 'counsel', 'G:urgent'];
const councilBand = COUNCIL_BAND.map(n => { const st = stat(inScope('council'), EXTRA.find(w => w[0] === n)[1]); return {n, st, ok: st.n < MIN_N || (st.lean >= 1 - WARN && st.lean <= WARN)}; });
// ---- Crossroads: its own population, scopes and band ----
const CR_DISTRICTS = ['cr-prologue', 'cr-library', 'cr-school'];
const crScope = s => s === 'cr-all' ? crOpts : TYPES.includes(s) ? crOpts.filter(x => x.t === s) : crOpts.filter(x => x.d === s);
const crFails = [], crWarns = [];
for (const [name, re] of WORDS) for (const s of CR_DISTRICTS.concat(['cr-all'], TYPES)) {
  const st = stat(crScope(s), re); if (st.n < MIN_N) continue;
  const where = (TYPES.includes(s) ? 'crossroads list type ' : '') + s;
  if (st.lean >= THRESH || st.lean <= 1 - THRESH) crFails.push(name + ' in ' + where + ': ' + fmt(st));
  else if (st.lean > WARN || st.lean < 1 - WARN) crWarns.push(name + ' in ' + where + ': ' + fmt(st));
}
const CROSSROADS_BAND = ['G:rota', 'G:retainer', 'G:custody', 'G:certainty', 'counsel', 'G:urgent', 'G:decide', 'G:absolute', 'G:because', 'G:vendor', 'G:notify', 'G:student'];
// Crossroads' band groups are checked from n >= 3 (review S15: G:rota had fewer than 5 hits, so its band was vacuous).
const CR_BAND_MIN_N = 3;
const crBand = [];
// The slice-2 groups (vendor, notify, student) were introduced for the School District: checked there and across Crossroads
// (cr-all), not inside the prologue or the Library, whose lists were written and reviewed before them.
const CR_SD_ONLY = ['G:vendor', 'G:notify', 'G:student'];
for (const n of CROSSROADS_BAND) for (const s of CR_DISTRICTS.concat(['cr-all']).filter(s => !CR_SD_ONLY.includes(n) || s === 'cr-school' || s === 'cr-all')) { const st = stat(crScope(s), EXTRA.concat(CR_EXTRA).find(w => w[0] === n)[1]); crBand.push({n: n + '@' + s, st, ok: st.n < CR_BAND_MIN_N || (st.lean >= 1 - WARN && st.lean <= WARN)}); }
if (report && crOpts.length) {
  console.log('\nCrossroads (' + crGraded.length + ' graded lists, ' + crOpts.length + ' options)\n' + 'word'.padEnd(18) + CR_DISTRICTS.concat(['cr-all']).map(s => s.padEnd(19)).join(''));
  for (const [name, re] of WORDS.concat(EXTRA, CR_EXTRA)) console.log(name.padEnd(18) + CR_DISTRICTS.concat(['cr-all']).map(s => fmt(stat(crScope(s), re)).padEnd(19)).join(''));
  if (crFails.length) console.log('Crossroads tells:\n  ' + crFails.join('\n  '));
  if (crWarns.length) console.log('Crossroads warnings:\n  ' + crWarns.join('\n  '));
}
if (report) process.exit(0);  // --report prints both populations' tables and never fails
const checks = [
  ['source scan found graded lists in every district', DISTRICTS.every(d => graded.some(L => district(L.file) === d))],
  ['source scan found graded lists of every list type', TYPES.every(t => graded.some(L => L.type === t))],
  ['Water Plant stays within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% on the OT groups (' + waterBand.map(x => x.n + ' ' + fmt(x.st)).join(', ') + ')', waterBand.every(x => x.ok)],
  ['Council Chambers stays within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% on the leadership words (' + councilBand.map(x => x.n + ' ' + fmt(x.st)).join(', ') + ')', councilBand.every(x => x.ok)],
  ['no tracked word or group leans ' + THRESH * 100 + '% or more to right or wrong (n>=' + MIN_N + ') in any district, any list type, or overall', !fails.length],
];
if (crFiles.length) checks.push(
  ['Crossroads: source scan found graded lists in the prologue, the Library and the School District (' + crGraded.length + ' lists, ' + crOpts.length + ' options)', CR_DISTRICTS.every(d => crGraded.some(L => district(L.file) === d))],
  ['Crossroads: no tracked word or group leans ' + THRESH * 100 + '% or more (n>=' + MIN_N + ') in its districts, its list types or overall', !crFails.length],
  ['Crossroads: no tracked word or group outside ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% (no warnings)', !crWarns.length],
  ['Crossroads stays within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% on its own groups, n>=' + CR_BAND_MIN_N + ' (' + crBand.filter(x => x.st.n >= CR_BAND_MIN_N).map(x => x.n + ' ' + fmt(x.st)).join(', ') + ')', crBand.every(x => x.ok)]);
if (warns.length) console.log('WARN thin margin (outside ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '%, not a failure):\n  ' + warns.join('\n  '));
for (const [n, ok] of checks) console.log((ok ? 'PASS ' : 'FAIL ') + n);
if (fails.length) console.log('  ' + fails.join('\n  '));
if (crFails.length || crWarns.length) console.log('  Crossroads: ' + crFails.concat(crWarns).join('\n  Crossroads: '));
const crBad = crBand.filter(x => !x.ok); if (crBad.length) console.log('  Crossroads band: ' + crBad.map(x => x.n + ' ' + fmt(x.st)).join(', '));
process.exit(checks.every(c => c[1]) ? 0 : 1);
