// Highlight check: the option highlighted when an answer list opens must not give the answer away.
//  1. Plays the whole edition with the desktop bot (tests/bot.js) and records every list the game opens.
//  2. Fails on any graded list (meta.good on some free items and not on others) opened without {shuffle: true},
//     unless it is declared a navigation/confirmation menu with {nav: true}.
//  3. Fails if, over the run, the initially highlighted option is good more often than chance.
//  4. Replays every graded list over 200 seeds through the engine's own shuffle and cursor code and fails if
//     the first highlight is good more often than chance (per list and overall).
//  5. The verdict scale (False positive / Benign / Malicious) is fixed, so its highlight must start on Back.
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

(async () => {
  const t0 = Date.now();
  if (!process.env.HIGHLIGHT_REUSE) {
    try { execFileSync('node', [path.join(__dirname, 'bot.js'), 'desktop', OUT + '/highlight-bot'], { env: Object.assign({}, process.env, { UPTIME_HIGHLIGHT_LOG: LOG }), stdio: ['ignore', 'ignore', 'inherit'], maxBuffer: 1 << 26 }); }
    catch (e) { check('bot run finished', false, 'exit ' + e.status); }
  }
  const recs = fs.readFileSync(LOG, 'utf8').trim().split('\n').filter(Boolean).map(l => JSON.parse(l));
  check('recorded the lists of a full run', recs.length > 300, recs.length);
  const free = r => r.items.filter(i => !i.pin);
  const graded = r => { const f = free(r); return f.some(i => i.good) && f.some(i => !i.good); };
  const G = recs.filter(graded);
  const unshuffled = G.filter(r => !r.shuffle && !r.nav);
  check('every graded list is shuffled (or declared nav)', unshuffled.length === 0, [...new Set(unshuffled.map(r => r.kind + ': ' + r.title + ' [' + r.items.map(i => i.label).join(' | ').slice(0, 120) + ']'))]);
  const navGraded = [...new Set(G.filter(r => r.nav).map(r => r.title.slice(0, 50) + ' [' + r.items.map(i => i.label + (i.good ? '*' : '')).join(' | ').slice(0, 90) + ']'))];
  // Over the run: hits vs chance.
  let H = 0, E = 0, V = 0, n = 0;
  for (const r of G.filter(r => r.shuffle && !r.cursorOpt)) {
    const f = free(r).filter(i => !i.dis);
    const p = r.cursorPinned ? (r.cursorGood ? 1 : 0) : f.filter(i => i.good).length / Math.max(1, f.length);
    H += r.cursorGood ? 1 : 0; E += p; V += p * (1 - p); n++;
  }
  const lim = E + 3 * Math.sqrt(V) + 1;
  check('run: first highlight is good no more often than chance', H <= lim, { lists: n, goodHighlighted: H, expected: +E.toFixed(1), limit: +lim.toFixed(1) });
  // Verdict scale starts on Back.
  const verdicts = recs.filter(r => r.items.some(i => i.verdict));
  check('verdict scale opens on Back', verdicts.length > 0 && verdicts.every(r => r.items.find(i => i.label === r.cursorLabel && i.back)), verdicts.slice(0, 3).map(r => r.cursorLabel));
  // Many seeds through the engine's own shuffle + cursor code.
  const uniq = new Map(); for (const r of G.filter(r => r.shuffle && !r.cursorOpt)) uniq.set(r.items.map(i => i.label + (i.dis ? '#' : '')).join('|'), r);
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
    seedRate: +tot.toFixed(3), seedChance: +totC.toFixed(3), navMenusWithAHint: navGraded, seconds: Math.round((Date.now() - t0) / 1000) }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('HIGHLIGHT FAILED:', e.message); process.exit(2); });
