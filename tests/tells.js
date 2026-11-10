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
// Crossroads (editions/crossroads) is scanned as its own population (districts cr-prologue, cr-library, cr-school, cr-clinic, cr-dispatch and cr-airport), so the
// Town Hall tables above are unchanged by it. The same 70% rule applies to it, any warning inside 35-65% fails it
// (Crossroads starts clean), and it is held to the band on its own word groups (CROSSROADS_BAND: rota/rest/fatigue,
// retainer/firm, custody/hash, confirmed/likely/unknown, counsel words, hurry words; and, since the slice-1 review, the
// "… decides" words, the absolutes and the "so/because" clause, from n >= 3; since slice 2 (the School District), the
// vendor/contract, notify/notice and student/parent words too; since slice 3 (the Community Clinic), the patient/care,
// privacy-officer, downtime/paper and HHS/OCR words, and the slice-2 groups are held in the Clinic as well; since the
// slice-3 review, the "now/today" and "safe" words in the Clinic, and the lone-feature check below in every district; since slice 4
// (Fire & EMS Dispatch), the floor/supervisor, cards/paper, measured-time and chief words, held in Dispatch and across
// Crossroads, with the slice-2 groups and the now/safe words held in Dispatch too; since slice 5 (the Regional Airport), the
// tenant/lease, duty-manager and mail/header words, held in the Airport and across Crossroads, with the slice-2 groups, the
// now/safe words and the floor/measure words held in the Airport too; since the slice-5 review, every enforced word and group,
// and every lone-feature word, is matched on its inflections in Crossroads: see stemRe() and stem() below).
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
  // Slice 3 (the Community Clinic, 9 Nov 2026): patient/care, the privacy officer, downtime/paper, HHS/OCR words.
  ['G:patient', /\b(patients?|patients’|patient’s|care|clinicians?)\b/i],
  ['G:privacy', /\b(privacy officer|privacy officer’s|Weller|Weller’s)\b/i],
  ['G:downtime', /\b(downtime|paper|forms?|cart|cart’s)\b/i],
  ['G:hhs', /\b(HHS|HHS’s|OCR|HIPAA)\b/],
  // Slice-3 review (S1): "now/today/tonight/at once" and "safe" marked wrong answers in the Clinic.
  ['G:now', /\b(now|today|tonight|at once)\b/i],
  ['G:safe', /\bsafe(ly|r|st)?\b/i],
  // Slice 4 (Fire & EMS Dispatch, 9 Nov 2026): the floor and its supervisor, the cards, measured times, the chief.
  ['G:floor', /\b(floor|floor’s|supervisor|supervisor’s|Imogen|Imogen’s)\b/i],
  ['G:cards', /\b(cards?|paper|manual)\b/i],
  ['G:measure', /\b(measured|median|seconds|answer-to-dispatch|\d+ s)\b/i],
  ['G:chief', /\b(chief|chief’s|Sayre)\b/i],
  // Slice 5 (the Regional Airport, 9 Nov 2026): tenants and leases, the manager on duty, mail and headers.
  ['G:tenant', /\b(tenants?|tenants’|tenant’s|lease|leases|lease’s)\b/i],
  ['G:duty', /\b(duty manager|on duty|on shift|Callum|Callum’s|Joanna|Joanna’s)\b/i],
  ['G:mail', /\b(e?mails?|email’s|headers?|trace|domain)\b/i],
];

// ---- Stems and inflections (review of Crossroads slice 5, 9 Nov 2026, S11) ----
// The "agree" template slipped through because "agree", "agrees" and "agreed" were counted as three words. So for
// Crossroads every enforced word and group is matched on its inflections too: stemRe() rewrites a pattern so that each
// literal word of three letters or more that ends an alternative (before \b, "|", ")" or the end) also matches its -s,
// -es, -ed and -ing forms (agree|agrees|agreed|agreeing; lease|leases|leased|leasing; notify|notifies|notified;
// cut|cuts|cutting), and "Xs?" becomes X with the same endings. Character classes, escapes and quantifiers are left
// alone, and words that already carry their own endings ("check(ed|s|ing)?") are unchanged. Possessives were already
// matched (’ is not a word character). The lone-feature check reads each word through stem(), so "agree", "agrees",
// "agreed" and "agreeing" are one feature. Town Hall keeps its own tables byte-identical: its stem-matched figures are
// printed in --report only, after everything else.
const VOW = 'aeiou';
function inflect(w) {
  if (w.length < 3) return w;
  const lo = w.toLowerCase(), last = lo[lo.length - 1], prev = lo[lo.length - 2];
  if (lo.endsWith('ee')) return w + '(?:s|d|ing)?';
  if (last === 'e') return w.slice(0, -1) + '(?:' + w.slice(-1) + '(?:s|d)?|ing)';
  if (last === 'y' && !VOW.includes(prev)) return w.slice(0, -1) + '(?:' + w.slice(-1) + '|ies|ied|ying)';
  const dbl = !VOW.includes(last) && !'wxy'.includes(last) && VOW.includes(prev) && !VOW.includes(lo[lo.length - 3] || 'a') ? '|' + w.slice(-1) + '(?:ed|ing)' : '';
  return w + '(?:s|es|ed|ing' + dbl + ')?';
}
function stemRe(re) {
  const src = re.source, groups = []; let out = '', i = 0;
  const boundary = j => j >= src.length || src[j] === '|' || src[j] === ')' || (src[j] === '\\' && src[j + 1] === 'b');
  while (i < src.length) {
    const c = src[i];
    if (c === '\\') { out += src.slice(i, i + 2); i += 2; continue; }
    if (c === '[') { let j = i + 1; if (src[j] === '^') j++; if (src[j] === ']') j++; while (j < src.length && src[j] !== ']') { if (src[j] === '\\') j++; j++; } out += src.slice(i, j + 1); i = j + 1; continue; }
    if (c === '{') { const j = src.indexOf('}', i); out += src.slice(i, j + 1); i = j + 1; continue; }
    // A group opened straight after a letter holds a word's own endings ("check(ed|s|ing)"): left as written.
    if (c === '(') groups.push(i > 0 && /[A-Za-z]/.test(src[i - 1]) && src[i - 2] !== '\\');
    if (c === ')') groups.pop();
    if (/[A-Za-z]/.test(c)) {
      let j = i; while (j < src.length && /[A-Za-z]/.test(src[j])) j++;
      const w = src.slice(i, j);
      if (groups.includes(true)) { out += w; i = j; continue; }
      if (src[j] === '?' && w.length >= 4 && w.endsWith('s') && boundary(j + 1)) { out += inflect(w.slice(0, -1)); i = j + 1; continue; }
      out += boundary(j) && (i === 0 || src[i - 1] !== '\\') ? inflect(w) : w; i = j; continue;
    }
    out += c; i++;
  }
  return new RegExp(out, re.flags);
}
// A light stemmer for the lone-feature words: the possessive, then -ies/-ied, -ing, -ed, -s, a doubled final consonant
// and a final e, so each inflection of a word gives the same feature.
function stem(w) {
  let s = w.replace(/’s$/, '');
  if (s.length > 4 && /(ies|ied)$/.test(s)) s = s.slice(0, -3) + 'y';
  else if (s.length > 5 && s.endsWith('ing')) s = s.slice(0, -3);
  else if (s.length > 5 && s.endsWith('eed')) s = s.slice(0, -1);
  else if (s.length > 4 && s.endsWith('ed') && !s.endsWith('eed')) s = s.slice(0, -2);
  else if (s.length > 3 && s.endsWith('s') && !/(ss|us|is)$/.test(s)) s = s.slice(0, -1);
  if (s.length > 3 && /([^aeiouslz])\1$/.test(s)) s = s.slice(0, -1);
  if (s.length > 3 && s.endsWith('e')) s = s.slice(0, -1);
  return s;
}
const stemmed = L => L.map(([n, re]) => [n, stemRe(re)]);

const files = fs.readdirSync(root + '/editions/town-hall').filter(f => f.endsWith('.js')).map(f => 'editions/town-hall/' + f)
  .concat(fs.readdirSync(root + '/engine').filter(f => f.endsWith('.js')).map(f => 'engine/' + f));
const crFiles = fs.existsSync(root + '/editions/crossroads') ? fs.readdirSync(root + '/editions/crossroads').filter(f => f.endsWith('.js')).map(f => 'editions/crossroads/' + f) : [];
const DISTRICTS = ['frontdesk', 'mailroom', 'clerks', 'market', 'records', 'basement', 'server', 'water', 'council'];
const district = f => { const b = path.basename(f); if (f.startsWith('editions/crossroads/')) return /^library-/.test(b) ? 'cr-library' : /^school-/.test(b) ? 'cr-school' : /^clinic-/.test(b) ? 'cr-clinic' : /^dispatch-/.test(b) ? 'cr-dispatch' : /^airport-/.test(b) ? 'cr-airport' : 'cr-prologue'; if (/^(data|story|quiet)\.js$/.test(b) || f.startsWith('engine')) return 'frontdesk'; return b.split('-')[0]; };
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
  const ws = stemRe(w[1]);
  for (const x of opts.concat(crOpts)) if ((!dArg || x.d === dArg) && (!tArg || x.t === tArg) && (x.d.startsWith('cr-') ? ws : w[1]).test(x.label)) console.log((x.good ? 'GOOD ' : 'bad  ') + x.file.split('/').pop() + ':' + x.line + ' [' + x.t + ']', x.label);
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
const CR_DISTRICTS = ['cr-prologue', 'cr-library', 'cr-school', 'cr-clinic', 'cr-dispatch', 'cr-airport'];
const crScope = s => s === 'cr-all' ? crOpts : TYPES.includes(s) ? crOpts.filter(x => x.t === s) : crOpts.filter(x => x.d === s);
const crFails = [], crWarns = [];
const CR_WORDS = stemmed(WORDS), CR_GROUPS = stemmed(EXTRA.concat(CR_EXTRA));
for (const [name, re] of CR_WORDS) for (const s of CR_DISTRICTS.concat(['cr-all'], TYPES)) {
  const st = stat(crScope(s), re); if (st.n < MIN_N) continue;
  const where = (TYPES.includes(s) ? 'crossroads list type ' : '') + s;
  if (st.lean >= THRESH || st.lean <= 1 - THRESH) crFails.push(name + ' in ' + where + ': ' + fmt(st));
  else if (st.lean > WARN || st.lean < 1 - WARN) crWarns.push(name + ' in ' + where + ': ' + fmt(st));
}
const CROSSROADS_BAND = ['G:rota', 'G:retainer', 'G:custody', 'G:certainty', 'counsel', 'G:urgent', 'G:decide', 'G:absolute', 'G:because', 'G:vendor', 'G:notify', 'G:student', 'G:patient', 'G:privacy', 'G:downtime', 'G:hhs', 'G:now', 'G:safe', 'G:floor', 'G:cards', 'G:measure', 'G:chief', 'G:tenant', 'G:duty', 'G:mail'];
// Crossroads' band groups are checked from n >= 3 (review S15: G:rota had fewer than 5 hits, so its band was vacuous).
const CR_BAND_MIN_N = 3;
const crBand = [];
// The slice-2 groups (vendor, notify, student) were introduced for the School District: checked there and across Crossroads
// (cr-all), not inside the prologue or the Library, whose lists were written and reviewed before them.
// The slice-3 groups (patient, privacy officer, downtime, HHS) were introduced for the Clinic: checked there and across
// Crossroads. The slice-2 groups are held in the Clinic too.
// The slice-4 groups (floor, cards, measure, chief) were introduced for Dispatch: checked there and across Crossroads. The
// slice-2 groups and the now/safe words are held in Dispatch too.
// The slice-5 groups (tenant, duty, mail) were introduced for the Airport: checked there and across Crossroads. The slice-2
// groups, the now/safe words and the floor/measure words are held in the Airport too.
const CR_AP_ONLY = ['G:tenant', 'G:duty', 'G:mail'], CR_DP_AP = ['G:floor', 'G:measure'];
const CR_SD_ONLY = ['G:vendor', 'G:notify', 'G:student'], CR_CN_ONLY = ['G:patient', 'G:privacy', 'G:downtime', 'G:hhs'], CR_CN_DP = ['G:now', 'G:safe'], CR_DP_ONLY = ['G:floor', 'G:cards', 'G:measure', 'G:chief'];
const crBandScopes = n => CR_DISTRICTS.concat(['cr-all']).filter(s => CR_AP_ONLY.includes(n) ? (s === 'cr-airport' || s === 'cr-all') : CR_DP_AP.includes(n) ? (s === 'cr-dispatch' || s === 'cr-airport' || s === 'cr-all') : CR_DP_ONLY.includes(n) ? (s === 'cr-dispatch' || s === 'cr-all') : CR_CN_DP.includes(n) ? (s === 'cr-clinic' || s === 'cr-dispatch' || s === 'cr-airport' || s === 'cr-all') : CR_CN_ONLY.includes(n) ? (s === 'cr-clinic' || s === 'cr-all') : CR_SD_ONLY.includes(n) ? (s === 'cr-school' || s === 'cr-clinic' || s === 'cr-dispatch' || s === 'cr-airport' || s === 'cr-all') : true);
for (const n of CROSSROADS_BAND) for (const s of crBandScopes(n)) { const st = stat(crScope(s), CR_GROUPS.find(w => w[0] === n)[1]); crBand.push({n: n + '@' + s, st, ok: st.n < CR_BAND_MIN_N || (st.lean >= 1 - WARN && st.lean <= WARN)}); }
if (report && crOpts.length) {
  console.log('\nCrossroads (' + crGraded.length + ' graded lists, ' + crOpts.length + ' options)\n' + 'word'.padEnd(18) + CR_DISTRICTS.concat(['cr-all']).map(s => s.padEnd(19)).join(''));
  for (const [name, re] of CR_WORDS.concat(CR_GROUPS)) console.log(name.padEnd(18) + CR_DISTRICTS.concat(['cr-all']).map(s => fmt(stat(crScope(s), re)).padEnd(19)).join(''));
  if (crFails.length) console.log('Crossroads tells:\n  ' + crFails.join('\n  '));
  if (crWarns.length) console.log('Crossroads warnings:\n  ' + crWarns.join('\n  '));
}
// ---- Punctuation and names (review of Crossroads slice 2, 9 Nov 2026, B1 and S7) ----
// B1: right answers listed several actions joined by ";" and wrong ones argued one, so "pick the only option with a
// semicolon" beat 24 of 57 School District lists (and the Library had the same lean). Words can't see that, so each
// mark is counted like a word: the share of right options carrying it against the share of wrong ones. Tabletop cards
// are read without the " — " the scanner puts between a card's name and its text. Crossroads is held to the 35–65% band
// from n >= PUNCT_BAND_N and, below that, to chance (the right options carrying the mark may exceed the count chance gives
// by at most one); Town Hall is measured in --report only, after its other tables, which are unchanged.
// It also counts the "lone mark" strategy (pick, or rule out, the only option in a list that carries the mark) against
// chance, both ways.
// S7: options naming a character are held to the same rule in Crossroads (any named character, by district), and the
// School District's four deciders and doers (Kole, Priya, Dr Vale, Marsh) one by one and together; since slice 3, the
// Clinic's deciders and doers (Marisol, Weller, Renata Osei, Kowal; Kit) one by one and together.
const PUNCT = [
  ['P:semicolon', /;/],
  ['P:colon', /:/],
  ['P:dash', /[–—]|\s-\s/],
  ['P:parentheses', /[()]/],
];
const CR_NAMES = [
  ['N:named', /\b(Adaeze|Kole|Priya|Lindgren|Corinne|Vale|Owen|Marsh|Hal Brooks|Brooks|Ilse|Brandt|Nell|Sato|Wim|Haddad|Lorna|Pike|Lucia|Ferrand|Theo|Marchetti|Noor|Castellanos|Mina|Strand|Cyrus|Hallowell|Agnes|Pell|Dot Ferreira|Ferreira|Juno|Barros|Kemal|Osterhout|Merrin|Rae|Okafor|Paz|Delgado|Magda|Petrov|Ruth|Avila|Bea|Lindqvist|Odile|Brennan|Beatriz|Solano|Marisol|Quintero|Tomasz|Weller|Renata|Osei|Kit|Ambrose|Joy|Okonjo|Ines|Vidal|Bettina|Ruiz|Harriet|Kowal|Imogen|Hale|Tamsin|Reyes|Gideon|Sayre|Anselm|Oduya|Celia|Marrow|Lionel|Ashdown|Petra|Vasko|Felix|Orrin|Ezra|Moll|Hollis|Grange|Warren|Teague|Delphine|Okoro|Joanna|Ferreday|Callum|Breck|Odette|Varga|Ansel|Whitcombe|Dario|Fenn|Imre|Castell|Bronwen|Teller|Yusuf|Darrow|Lise|Moreau|Rhoswen|Adair|Yara|Quist)\b/],
  ['N:Kole', /\bKole\b/], ['N:Priya', /\bPriya\b/], ['N:Vale', /\bVale\b/], ['N:Marsh', /\bMarsh\b/],
  ['N:sd-deciders', /\b(Kole|Priya|Vale)\b/],
  ['N:Marisol', /\bMarisol\b/], ['N:Weller', /\bWeller\b/], ['N:Osei', /\b(Renata|Osei)\b/], ['N:Kit', /\bKit\b/],
  ['N:cn-deciders', /\b(Marisol|Weller|Renata|Osei|Kowal)\b/],
  ['N:Imogen', /\bImogen\b/], ['N:Celia', /\b(Celia|Marrow)\b/], ['N:Lionel', /\b(Lionel|Ashdown)\b/], ['N:Petra', /\b(Petra|Vasko)\b/], ['N:Felix', /\b(Felix|Orrin)\b/],
  ['N:dp-deciders', /\b(Imogen|Celia|Marrow|Lionel|Ashdown|Petra|Vasko|Sayre|Oduya|Okoro)\b/],
  ['N:Joanna', /\b(Joanna|Ferreday)\b/], ['N:Callum', /\b(Callum|Breck)\b/], ['N:Odette', /\b(Odette|Varga)\b/], ['N:Ansel', /\b(Ansel|Whitcombe)\b/], ['N:Dario', /\b(Dario|Fenn)\b/],
  ['N:ap-deciders', /\b(Joanna|Ferreday|Callum|Breck|Odette|Varga|Ansel|Whitcombe|Dario|Fenn|Imre|Castell|Bronwen|Teller|Adair)\b/],
];
const PUNCT_BAND_N = 6;
const markText = x => x.key === 'cards' ? x.label.replace(' — ', ' ') : x.label;
function pstat(set, re) {
  const G = set.filter(x => x.good), B = set.filter(x => !x.good);
  const g = G.filter(x => re.test(markText(x))).length, b = B.filter(x => re.test(markText(x))).length;
  const rg = G.length ? g / G.length : 0, rb = B.length ? b / B.length : 0;
  return {g, G: G.length, b, B: B.length, n: g + b, lean: rg + rb ? rb / (rg + rb) : 0.5, expG: (g + b) * G.length / Math.max(1, G.length + B.length)};
}
const pOk = st => st.n >= PUNCT_BAND_N ? (st.lean >= 1 - WARN && st.lean <= WARN) : st.n < 2 || st.g - st.expG <= 1;
const pFmt = st => st.n ? fmt(st) + (st.n < PUNCT_BAND_N ? ' (chance ' + st.expG.toFixed(1) + ')' : '') : '-';
// The lone-mark strategy over graded single-pick lists (cards are multi-pick, so left out): lists where exactly one option
// carries the mark, how often that option is right, and what chance gives (the share of right options in each such list).
function lone(Ls, re) {
  let n = 0, hit = 0, exp = 0, v = 0;
  for (const L of Ls) {
    if (L.key === 'cards') continue;
    const m = L.items.filter(x => re.test(x.label)); if (m.length !== 1) continue;
    const p = L.items.filter(x => x.good).length / L.items.length;
    n++; exp += p; v += p * (1 - p); if (m[0].good) hit++;
  }
  // Two-sided: a lone mark that is never right is a tell too (it rules an option out).
  return {n, hit, exp, v, ok: Math.abs(hit - exp) <= 2 * Math.sqrt(v) + 1};
}
const loneFmt = s => s.n ? s.hit + '/' + s.n + ' (chance ' + s.exp.toFixed(1) + ')' : '-';
const crListsIn = s => s === 'cr-all' ? crGraded : crGraded.filter(L => district(L.file) === s);
const punctRows = [];
for (const [name, re] of PUNCT) for (const s of CR_DISTRICTS.concat(['cr-all'])) {
  const st = pstat(crScope(s), re), ln = lone(crListsIn(s), re);
  punctRows.push({n: name + '@' + s, st, ln, ok: pOk(st) && ln.ok});
}
const nameRows = [];
const CN_NAMES = ['N:Marisol', 'N:Weller', 'N:Osei', 'N:Kit', 'N:cn-deciders'], DP_NAMES = ['N:Imogen', 'N:Celia', 'N:Lionel', 'N:Petra', 'N:Felix', 'N:dp-deciders'], AP_NAMES = ['N:Joanna', 'N:Callum', 'N:Odette', 'N:Ansel', 'N:Dario', 'N:ap-deciders'];
for (const [name, re] of CR_NAMES) for (const s of (name === 'N:named' ? CR_DISTRICTS.concat(['cr-all']) : CN_NAMES.includes(name) ? ['cr-clinic'] : DP_NAMES.includes(name) ? ['cr-dispatch'] : AP_NAMES.includes(name) ? ['cr-airport'] : ['cr-school'])) {
  const st = pstat(crScope(s), re);
  nameRows.push({n: name + '@' + s, st, ok: pOk(st)});
}
// ---- Lone features (review of Crossroads slice 3, 9 Nov 2026, B1) ----
// The slice-3 tells were marks no word list held: the only option naming a weekday, citing an evidence number ("C-03"),
// saying "script" or ending "her call" was right, and the only one saying "now" or "patients" was wrong. So every option
// is broken into features: each lower-cased word, and normalised patterns (a weekday name, a clock time, an ID like C-03,
// CL-FD-02 or R-01, any digit, quoted text, a "n’t" contraction). For each feature, take the graded single-pick lists in
// which exactly one option carries it, and count how often that option is the right one, against chance (the share of
// right options in each such list). A feature is flagged when it is right in 70% or more of n >= 4 such lists, or wrong
// in 90% or more of n >= 6. Because a few hundred features are tested at once, chance alone flags some: with the right
// answers shuffled at random inside each list, the bare thresholds flag about 10 features per district and 28 across
// Crossroads (median of 200 shuffles). So a flagged feature fails only when it is also beyond chance by
// LF_K standard deviations plus LF_C lists (a shuffled answer key then passes about nine times in ten). Enforced for
// Crossroads (each district and cr-all); printed for Town Hall in --report only, after its other tables. The top leans
// are printed either way, so a thin margin is visible before it becomes a failure.
const LF_N = 4, LF_RIGHT = 0.70, LF_WN = 6, LF_WRONG = 0.90, LF_K = 2.5, LF_C = 1;
function lfFeatures(t, st) {
  const s = new Set();
  if (/\b(Mon|Tues|Wednes|Thurs|Fri|Satur|Sun)day\b/.test(t)) s.add('<weekday>');
  if (/\b\d{1,2}:\d\d\b/.test(t)) s.add('<clock>');
  if (/\b[A-Z]{1,4}-\d+\b/.test(t)) s.add('<id>');
  if (/\d/.test(t)) s.add('<digit>');
  if (/[“”"]/.test(t)) s.add('<quote>');
  if (/n[’']t\b/.test(t)) s.add('<n’t>');
  for (const w of t.toLowerCase().replace(/'/g, '’').match(/[a-zà-ɏ]+(’[a-z]+)?/g) || []) s.add(st ? stem(w) : w);
  return s;
}
function loneFeatures(Ls, st) {
  const T = {};
  for (const L of Ls) {
    if (L.key === 'cards') continue;
    const F = L.items.map(x => lfFeatures(markText(x), st)), cnt = {};
    F.forEach(f => f.forEach(k => { cnt[k] = (cnt[k] || 0) + 1; }));
    const p = L.items.filter(x => x.good).length / L.items.length;
    F.forEach((f, i) => f.forEach(k => {
      if (cnt[k] !== 1) return;
      const r = T[k] || (T[k] = {k, n: 0, hit: 0, exp: 0, v: 0});
      r.n++; r.exp += p; r.v += p * (1 - p); if (L.items[i].good) r.hit++;
    }));
  }
  return Object.values(T).map(r => {
    const rate = r.hit / r.n, m = LF_K * Math.sqrt(r.v) + LF_C;
    const flagR = r.n >= LF_N && rate >= LF_RIGHT, flagW = r.n >= LF_WN && 1 - rate >= LF_WRONG;
    return Object.assign(r, {rate, flag: flagR || flagW, fail: (flagR && r.hit - r.exp > m) || (flagW && r.exp - r.hit > m), z: r.v ? (r.hit - r.exp) / Math.sqrt(r.v) : 0});
  });
}
const lfFmt = r => r.k + ' ' + (r.rate >= 0.5 ? 'right ' : 'wrong ') + (r.rate >= 0.5 ? r.hit : r.n - r.hit) + '/' + r.n + ' (chance ' + (r.rate >= 0.5 ? r.exp : r.n - r.exp).toFixed(1) + ')';
const lfTop = (rows, n) => rows.filter(r => r.n >= LF_N).sort((a, b) => Math.abs(b.z) - Math.abs(a.z)).slice(0, n);
const lfRows = CR_DISTRICTS.concat(['cr-all']).map(s => ({s, rows: loneFeatures(crListsIn(s), true)}));
const lfFails = lfRows.flatMap(x => x.rows.filter(r => r.fail).map(r => x.s + ' ' + lfFmt(r)));
if (report) {
  console.log('\nPunctuation (report only in Town Hall; cell = g/G b/B lean-to-wrong%; lone = lists where only one option has the mark: right/lists)\n' + 'mark'.padEnd(16) + scopes.map(s => s.padEnd(19)).join(''));
  for (const [name, re] of PUNCT) {
    console.log(name.padEnd(16) + scopes.map(s => fmt(pstat(inScope(s), re)).padEnd(19)).join(''));
    console.log('  lone'.padEnd(16) + scopes.map(s => loneFmt(lone(s === 'all' ? graded : graded.filter(L => district(L.file) === s), re)).padEnd(19)).join(''));
  }
  if (crOpts.length) {
    console.log('\nCrossroads punctuation and names (enforced)\n' + 'mark'.padEnd(16) + CR_DISTRICTS.concat(['cr-all']).map(s => s.padEnd(26)).join(''));
    for (const [name, re] of PUNCT) {
      console.log(name.padEnd(16) + CR_DISTRICTS.concat(['cr-all']).map(s => pFmt(pstat(crScope(s), re)).padEnd(26)).join(''));
      console.log('  lone'.padEnd(16) + CR_DISTRICTS.concat(['cr-all']).map(s => loneFmt(lone(crListsIn(s), re)).padEnd(26)).join(''));
    }
    for (const r of nameRows) console.log(r.n.padEnd(26) + pFmt(r.st) + (r.ok ? '' : '  OUT'));
  }
  console.log('\nLone features (report only in Town Hall): the 8 strongest leans per district, n>=' + LF_N + ' lists where only one option has the feature; * = flagged by the 70%/90% rule, ! = also beyond chance (fails in Crossroads)');
  for (const s of scopes) {
    const rows = loneFeatures(s === 'all' ? graded : graded.filter(L => district(L.file) === s));
    console.log(s.padEnd(12) + lfTop(rows, 8).map(r => (r.fail ? '!' : r.flag ? '*' : '') + lfFmt(r)).join(', '));
  }
  if (crOpts.length) {
    console.log('\nCrossroads lone features (enforced)');
    for (const x of lfRows) console.log(x.s.padEnd(12) + lfTop(x.rows, 8).map(r => (r.fail ? '!' : r.flag ? '*' : '') + lfFmt(r)).join(', '));
  }
}
if (report) {
  // Town Hall, stem-matched (S11): report only, after every other table, so the tables above stay byte-identical.
  console.log('\nTown Hall, stem-matched (report only; the same words and groups with their inflections, as Crossroads is held to them)\n' + 'word'.padEnd(18) + scopes.map(s => s.padEnd(19)).join(''));
  for (const [name, re] of stemmed(WORDS.concat(EXTRA))) console.log((enforced(name) ? name : '(' + name + ')').padEnd(18) + scopes.map(s => fmt(stat(inScope(s), re)).padEnd(19)).join(''));
  console.log('\nTown Hall lone features, stem-matched (report only)');
  for (const s of scopes) console.log(s.padEnd(12) + lfTop(loneFeatures(s === 'all' ? graded : graded.filter(L => district(L.file) === s), true), 8).map(r => (r.fail ? '!' : r.flag ? '*' : '') + lfFmt(r)).join(', '));
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
  ['Crossroads: source scan found graded lists in the prologue, the Library, the School District, the Clinic, Dispatch and the Airport (' + crGraded.length + ' lists, ' + crOpts.length + ' options)', CR_DISTRICTS.every(d => crGraded.some(L => district(L.file) === d))],
  ['Crossroads: no tracked word or group leans ' + THRESH * 100 + '% or more (n>=' + MIN_N + ') in its districts, its list types or overall', !crFails.length],
  ['Crossroads: no tracked word or group outside ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% (no warnings)', !crWarns.length],
  ['Crossroads stays within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% on its own groups, n>=' + CR_BAND_MIN_N + ' (' + crBand.filter(x => x.st.n >= CR_BAND_MIN_N).map(x => x.n + ' ' + fmt(x.st)).join(', ') + ')', crBand.every(x => x.ok)],
  ['Crossroads: no punctuation tell (; : dash parentheses) — within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% from n>=' + PUNCT_BAND_N + ', at chance below it, and the lone-mark pick no better than chance (' + punctRows.map(x => x.n + ' ' + pFmt(x.st) + ' lone ' + loneFmt(x.ln)).join(', ') + ')', punctRows.every(x => x.ok)],
  ['Crossroads: no name tell — options naming a character, Kole, Priya, Dr Vale and Marsh in the School District, Marisol, Weller, Renata Osei, Kowal and Kit in the Clinic, Imogen, Celia, Lionel, Petra and Felix in Dispatch, and Joanna, Callum, Odette, Ansel and Dario at the Airport, within ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '% from n>=' + PUNCT_BAND_N + ', at chance below it (' + nameRows.map(x => x.n + ' ' + pFmt(x.st)).join(', ') + ')', nameRows.every(x => x.ok)],
  ['Crossroads: no lone-feature tell — no word or pattern (weekday, clock time, ID, digit, quote, n’t) that only one option of a list carries is right in ' + LF_RIGHT * 100 + '% of n>=' + LF_N + ' lists or wrong in ' + LF_WRONG * 100 + '% of n>=' + LF_WN + ' beyond chance (' + LF_K + ' sd + ' + LF_C + '); strongest leans: ' + lfRows.map(x => x.s + ' ' + lfTop(x.rows, 3).map(lfFmt).join(', ')).join('; '), !lfFails.length]);
if (warns.length) console.log('WARN thin margin (outside ' + Math.round((1 - WARN) * 100) + '–' + WARN * 100 + '%, not a failure):\n  ' + warns.join('\n  '));
for (const [n, ok] of checks) console.log((ok ? 'PASS ' : 'FAIL ') + n);
if (fails.length) console.log('  ' + fails.join('\n  '));
if (crFails.length || crWarns.length) console.log('  Crossroads: ' + crFails.concat(crWarns).join('\n  Crossroads: '));
const crBad = crBand.filter(x => !x.ok); if (crBad.length) console.log('  Crossroads band: ' + crBad.map(x => x.n + ' ' + fmt(x.st)).join(', '));
if (lfFails.length) console.log('  Crossroads lone features: ' + lfFails.join(', '));
const pBad = punctRows.concat(nameRows).filter(x => !x.ok); if (pBad.length) console.log('  Crossroads punctuation/names: ' + pBad.map(x => x.n + ' ' + pFmt(x.st) + (x.ln ? ' lone ' + loneFmt(x.ln) : '')).join(', '));
process.exit(checks.every(c => c[1]) ? 0 : 1);
