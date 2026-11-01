// Highlight check: the option highlighted when an answer list opens must not give the answer away.
//  1. Static scan of every UI.openModal / choose call site in the edition and engine sources: any list whose items
//     carry a good/correct flag must be shuffled ({shuffle: true}), open on a chosen neutral item ({cursor}), or be a
//     navigation/confirmation menu declared with {nav: '<id>'} where <id> is on the reviewed NAV_ALLOW list below.
//     This covers lists the bot never reaches (wrong-answer loops, redo branches, early/late restore paths).
//  2. Plays the whole edition with the desktop bot (tests/bot.js) and records every list the game opens; fails on
//     any graded list (meta.good on some free items and not on others) opened unshuffled unless its nav id is
//     allowlisted. A bare {nav: true} always fails.
//  3. Fails if, over the run, the initially highlighted option is good more often than chance.
//  4. Replays every graded list over 200 seeds through the engine's own shuffle and cursor code and fails if
//     the first highlight is good more often than chance (per list and overall). Repeated rounds that share labels
//     (rule reviews, triage advisories) are kept apart: the key is the title, labels and good flags.
//  5. The verdict scale (False positive / Benign / Malicious) is fixed, so its highlight must start on Back; every other
//     fixed-order graded list that opens on a chosen item ({cursor}) must not open on a good option either.
// Usage: node highlight.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const OUT = process.env.UPTIME_OUT || __dirname + '/out';
fs.mkdirSync(OUT, { recursive: true });
const LOG = OUT + '/highlight-log.jsonl';
const results = []; const check = (name, ok, info) => { results.push({ name, ok: !!ok, info: ok ? undefined : info }); };

// Reviewed navigation/confirmation menus. Each keeps a fixed order and may mark the bot's preferred item with
// meta.good; none of them is a judgement call the game grades. Adding an id here needs the same review.
const NAV_ALLOW = {
  'end-shift': 'Desk menu: End shift / (Quiet Thread console) / Not yet. Both choices are fine; good is the bot hint to end the day.',
  'district-end': 'End-of-district summary: Keep exploring / Title screen. Pure navigation.',
  'tune-tool': 'Use the Tuning Guide now or later. Same result either way, only timing.',
  'evolve-tool': 'Evolve Sieve now or later. Same result either way, only timing.',
  'integrate-tools': 'Integrate Sentry with Ledger now or later. Same result either way, only timing.',
  'patch-plan-confirm': 'After the graded triage (shuffled): deploy the plan you made, or redo it. Confirmation of your own answers.',
  'waf-review-confirm': 'After the graded WAF rule review (shuffled): switch to blocking with your plan, or redo it. Confirmation.',
  'starter-pick': 'Starter tool: all three are valid, by preference. good is only the bot\'s pick.'
};

// Static scan of the sources (acorn, from the global tool install if it is not local).
function staticScan() {
  let acorn = null;
  for (const m of ['acorn', '/opt/node-tools/node_modules/acorn']) { try { acorn = require(m); break; } catch (e) {} }
  if (!acorn) return { error: 'acorn not found (npm i acorn, or /opt/node-tools/node_modules/acorn)' };
  const root = path.resolve(__dirname, '..');
  const files = fs.readdirSync(root + '/editions/town-hall').filter(f => f.endsWith('.js')).map(f => 'editions/town-hall/' + f)
    .concat(fs.readdirSync(root + '/engine').filter(f => f.endsWith('.js')).map(f => 'engine/' + f));
  const sites = [], bad = [];
  const prop = (o, k) => o && o.type === 'ObjectExpression' && o.properties.find(p => p.key && (p.key.name === k || p.key.value === k));
  for (const f of files) {
    const src = fs.readFileSync(root + '/' + f, 'utf8');
    const ast = acorn.parse(src, { ecmaVersion: 2022, locations: true, sourceType: 'script', allowReturnOutsideFunction: true });
    const text = n => src.slice(n.start, n.end);
    (function walk(n, anc) {
      if (!n || typeof n.type !== 'string') return;
      if (n.type === 'CallExpression') {
        const c = n.callee, name = c.type === 'Identifier' ? c.name : c.type === 'MemberExpression' && c.object.name === 'UI' ? c.property.name : null;
        if ((name === 'choose' || name === 'openModal') && !(anc.length && anc[anc.length - 1].type === 'MethodDefinition')) {
          const ia = name === 'choose' ? 1 : 2, itemsN = n.arguments[ia], optN = n.arguments[ia + 1];
          if (itemsN) {
            // Graded = at least two options whose good/correct flags differ, or are computed at run time. A named list
            // is resolved to its declaration in an enclosing function, plus anything pushed onto it there.
            const fn = [...anc].reverse().find(a => /Function/.test(a.type)) || ast;
            const goodOf = e => {
              if (!e) return 'x';
              if (e.type === 'SpreadElement') return 'x';
              if (e.type !== 'ObjectExpression') return /\b(good|correct)\s*:/.test(text(e)) ? 'x' : 'f';
              const g = prop(e, 'good') || prop(e, 'correct') || (prop(e, 'meta') && (prop(prop(e, 'meta').value, 'good') || prop(prop(e, 'meta').value, 'correct')));
              if (!g) return 'f';
              return g.value.type === 'Literal' ? (g.value.value ? 't' : 'f') : 'x';
            };
            const flags = []; let dynamic = false;
            const fromArray = arr => arr.elements.forEach(e => flags.push(goodOf(e)));
            const fromExpr = e => {
              if (e.type === 'ArrayExpression') return fromArray(e);
              // .map(...) or anything else built at run time: graded if it sets good/correct from an expression.
              dynamic = true;
              const t = text(e);
              if (/\b(good|correct)\s*:\s*(?!\s)(?!true\b|false\b)/.test(t)) flags.push('x', 'x');
            };
            if (itemsN.type === 'Identifier') {
              (function find(m) {
                if (!m || typeof m.type !== 'string') return;
                if (m.type === 'VariableDeclarator' && m.id.name === itemsN.name && m.init) fromExpr(m.init);
                if (m.type === 'CallExpression' && m.callee.type === 'MemberExpression' && m.callee.object.name === itemsN.name && m.callee.property.name === 'push') m.arguments.forEach(x => x.type === 'ObjectExpression' ? flags.push(goodOf(x)) : fromExpr(x));
                for (const k in m) { if (k === 'loc') continue; const v = m[k]; if (Array.isArray(v)) v.forEach(find); else if (v && typeof v.type === 'string') find(v); }
              })(fn);
            } else fromExpr(itemsN);
            const graded = flags.includes('x') || (flags.length >= 2 && flags.includes('t') && flags.some(x => x !== 't'));
            const sh = prop(optN, 'shuffle'), nv = prop(optN, 'nav'), cu = prop(optN, 'cursor');
            const site = { at: f + ':' + n.loc.start.line, call: name, graded, shuffle: !!(sh && sh.value.value === true), nav: nv ? (nv.value.type === 'Literal' ? nv.value.value : text(nv.value)) : null, cursor: !!cu };
            sites.push(site);
            if (site.nav === true) bad.push(Object.assign({ why: 'bare {nav: true}: give it an id on NAV_ALLOW' }, site));
            else if (site.nav !== null && !NAV_ALLOW[site.nav]) bad.push(Object.assign({ why: 'nav id not on NAV_ALLOW' }, site));
            else if (graded && !site.shuffle && !site.cursor && site.nav === null) bad.push(Object.assign({ why: 'items carry good/correct but the list is not shuffled' }, site));
          }
        }
      }
      for (const k in n) { if (k === 'loc') continue; const v = n[k];
        if (Array.isArray(v)) v.forEach(x => x && typeof x.type === 'string' && walk(x, anc.concat(n)));
        else if (v && typeof v.type === 'string') walk(v, anc.concat(n)); }
    })(ast, []);
  }
  return { sites, bad };
}

(async () => {
  const t0 = Date.now();
  const scan = staticScan();
  if (scan.error) check('static scan of every openModal / choose call site', false, scan.error);
  else {
    check('static scan: ' + scan.sites.length + ' openModal / choose call sites; every list with good/correct flags is shuffled, opens on a chosen item, or is an allowlisted nav menu',
      scan.sites.length > 120 && scan.bad.length === 0, scan.bad);
    const usedNav = new Set(scan.sites.filter(x => typeof x.nav === 'string').map(x => x.nav));
    check('static scan: every NAV_ALLOW id is still used (no stale exemptions)', Object.keys(NAV_ALLOW).every(k => usedNav.has(k)), Object.keys(NAV_ALLOW).filter(k => !usedNav.has(k)));
  }
  if (!process.env.HIGHLIGHT_REUSE) {
    try { execFileSync('node', [path.join(__dirname, 'bot.js'), 'desktop', OUT + '/highlight-bot'], { env: Object.assign({}, process.env, { UPTIME_HIGHLIGHT_LOG: LOG }), stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 26 }); }
    catch (e) { check('bot run finished', false, 'exit ' + e.status); }
  }
  const recs = fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
  check('recorded the lists of a full run', recs.length > 300, recs.length);
  const free = r => r.items.filter(i => !i.pin);
  const graded = r => { const f = free(r); return f.some(i => i.good) && f.some(i => !i.good); };
  const G = recs.filter(graded);
  const unshuffled = G.filter(r => !r.shuffle && !r.cursorOpt && !(typeof r.nav === 'string' && NAV_ALLOW[r.nav]));
  check('run: every graded list is shuffled, opens on a chosen item, or is an allowlisted nav menu (bare nav: true fails)', unshuffled.length === 0,
    [...new Set(unshuffled.map(r => r.kind + ': ' + r.title + ' nav=' + r.nav + ' [' + r.items.map(i => i.label).join(' | ').slice(0, 120) + ']'))]);
  const navGraded = [...new Set(G.filter(r => r.nav).map(r => r.nav + ': ' + r.title.slice(0, 50) + ' [' + r.items.map(i => i.label + (i.good ? '*' : '')).join(' | ').slice(0, 90) + ']'))];
  // Over the run: hits vs chance.
  let H = 0, E = 0, V = 0, n = 0;
  for (const r of G.filter(r => r.shuffle && !r.cursorOpt)) {
    const f = free(r).filter(i => !i.dis);
    const p = r.cursorPinned ? (r.cursorGood ? 1 : 0) : f.filter(i => i.good).length / Math.max(1, f.length);
    H += r.cursorGood ? 1 : 0; E += p; V += p * (1 - p); n++;
  }
  const lim = E + 3 * Math.sqrt(V) + 1;
  check('run: first highlight is good no more often than chance', H <= lim, { lists: n, goodHighlighted: H, expected: +E.toFixed(1), limit: +lim.toFixed(1) });
  // Fixed-order lists that open on a chosen item (verdict scale, patch batches, WAF actions, Quiet Thread) never open on an answer.
  const fixed = G.filter(r => r.cursorOpt && !r.shuffle);
  check('run: fixed-order graded lists open on a neutral item (Back / Leave it), never on a good one', fixed.length > 0 && fixed.every(r => !r.cursorGood), [...new Set(fixed.filter(r => r.cursorGood).map(r => r.title + ' → ' + r.cursorLabel))]);
  // Verdict scale starts on Back.
  const verdicts = recs.filter(r => r.items.some(i => i.verdict));
  check('verdict scale opens on Back', verdicts.length > 0 && verdicts.every(r => r.items.find(i => i.label === r.cursorLabel && i.back)), verdicts.slice(0, 3).map(r => r.cursorLabel));
  // Many seeds through the engine's own shuffle + cursor code.
  // Keyed by title + labels + good flags, so repeated rounds with the same labels (and different answers) stay distinct.
  const uniq = new Map(); for (const r of G.filter(r => r.shuffle && !r.cursorOpt)) uniq.set(r.kind + '\u0001' + r.title + '\u0001' + r.items.map(i => i.label + (i.dis ? '#' : '') + (i.good ? '*' : '')).join('|'), r);
  const b = await chromium.launch(); const page = await (await b.newContext()).newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
  await page.goto(FILE); await page.waitForFunction(() => window.__UPTIME);
  const seeds = await page.evaluate(lists => {
    const out = []; const keep = G;
    for (const items0 of lists) {
      const items = items0.map(i => ({label: i.label, pin: i.pin, disabled: i.dis, meta: {good: i.good}}));
      let hits = 0, exp = 0; const N = 200;
      for (let s = 1; s <= N; s++) {
        G = {seed: s * 2654435761 >>> 0};
        const perm = shuffleOrder(items, {shuffle: true}), shown = perm.map(i => items[i]);
        const c = initialCursor(shown, perm, {shuffle: true});
        const it = shown[c];
        if (it.meta.good) hits++;
        const f = items.filter(i => !i.pin && !i.disabled);
        exp += it.pin ? (it.meta.good ? 1 : 0) : f.filter(i => i.meta.good).length / f.length;
      }
      out.push({label: items.map(i => i.label).join(' | ').slice(0, 70), rate: hits / N, chance: exp / N});
    }
    G = keep; return out;
  }, [...uniq.values()].map(r => r.items));
  await b.close();
  const bad = seeds.filter(x => x.rate > x.chance + 0.15);
  check('200 seeds: no graded list highlights the answer more often than chance (+0.15)', bad.length === 0, bad);
  const tot = seeds.reduce((a, x) => a + x.rate, 0) / Math.max(1, seeds.length), totC = seeds.reduce((a, x) => a + x.chance, 0) / Math.max(1, seeds.length);
  check('200 seeds overall: good-highlight rate within chance (+0.05)', tot <= totC + 0.05, { rate: +tot.toFixed(3), chance: +totC.toFixed(3) });
  check('no console errors or network requests', errs.length === 0, errs);
  const failed = results.filter(r => !r.ok);
  console.log(JSON.stringify({ suite: 'highlight', passed: results.length - failed.length, failed: failed.length, results, gradedLists: G.length, uniqueGraded: seeds.length,
    seedRate: +tot.toFixed(3), seedChance: +totC.toFixed(3), navAllowlist: NAV_ALLOW, navMenusSeenInRun: navGraded,
    staticSites: scan.sites ? { total: scan.sites.length, graded: scan.sites.filter(x => x.graded).length, shuffled: scan.sites.filter(x => x.graded && x.shuffle).length,
      cursor: scan.sites.filter(x => x.graded && !x.shuffle && x.cursor).length, nav: scan.sites.filter(x => x.nav).map(x => x.nav + ' @ ' + x.at) } : null,
    seconds: Math.round((Date.now() - t0) / 1000) }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('HIGHLIGHT FAILED:', e.message); process.exit(2); });
