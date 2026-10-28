// Front Desk checks after the expert review: the escalation evidence gate (intern "Ask Rae", precision metric),
// the boss tabletop MFA fix (enforcing MFA does not defeat an enrolled rogue device; reviewing devices does),
// alert weighting (entry-route weights only for malicious alerts; scanning reconnaissance), the scoping question
// after a malicious close, and the ATT&CK licence on the Credits screen. Real key presses drive every choice.
// Usage: node frontdesk.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
const KEY = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', a: 'z', b: 'x', start: 'Enter', select: 'Shift' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = {};
let failed = false;
function check(name, ok, info) { results[name] = ok ? 'ok' : 'FAIL ' + (info !== undefined ? JSON.stringify(info).slice(0, 400) : ''); if (!ok) failed = true; }

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  const errors = [], requests = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) requests.push(r.url()); });
  await page.goto(FILE);
  await page.waitForFunction(() => window.__UPTIME && window.__UPTIME.peek().ui);
  await page.evaluate(() => { __UPTIME.seed(7); __UPTIME.turbo(true); });
  const peek = () => page.evaluate(() => __UPTIME.peek());
  const press = b => page.keyboard.press(KEY[b]);
  async function waitUI() { for (let i = 0; i < 300; i++) { const p = await peek(); if (p.ui) return p; await sleep(15); } throw new Error('no ui'); }
  async function pickLabel(re) {
    const p = await waitUI(); const u = p.ui;
    const idx = u.options ? u.options.findIndex(o => re.test(o.label) && !o.disabled) : -1;
    if (idx < 0) throw new Error('no option ' + re + ' in ' + JSON.stringify(u.options ? u.options.map(o => o.label) : u));
    let guard = 0;
    while ((await peek()).ui.cursor !== idx && guard++ < 30) await press(u.type === 'modal' ? 'down' : (u.cols > 1 ? 'right' : 'down'));
    await press('a'); await sleep(20);
  }
  // Advance 'say' boxes until a choice/modal shows, or nothing is busy.
  async function untilChoice() {
    for (let i = 0; i < 400; i++) { await sleep(15); const p = await peek(); if (p.ui && p.ui.type !== 'say') return p; if (p.ui) { await press('a'); continue; } if (!p.busy) return p; }
    throw new Error('untilChoice timed out');
  }
  async function settle() {
    for (let i = 0; i < 400; i++) {
      await sleep(15); const p = await peek();
      if (!p.ui) { if (!p.busy) return; continue; }
      if (p.ui.type === 'say') { await press('a'); continue; }
      const g = p.ui.options.findIndex(o => o.meta && o.meta.good && !o.disabled);
      await pickLabel(g >= 0 ? new RegExp('^' + p.ui.options[g].label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$') : /./);
    }
    throw new Error('settle timed out');
  }
  // Start an alert of a given threat and kind, with a set starting evidence.
  async function battle(threat, kind, ev0) {
    await page.evaluate(([t, k, e]) => {
      const G = __UPTIME.state(); G.focus = G.focusMax;
      let spec; do { spec = genAlert(k); } while (spec.threat !== t);
      spec.ev0 = e; spec.dwell0 = 0; spec.rate = 1;
      run(() => doBattle(spec));
    }, [threat, kind, ev0]);
    return untilChoice();
  }

  await pickLabel(/New game/); await settle();
  await page.evaluate(() => {
    const G = __UPTIME.state();
    Object.assign(G.f, { starter: 'sentry' }); G.party = [{ id: 'sentry', lvl: 3, xp: 0, tuned: false }];
    G.map = 'hub'; G.x = 9; G.y = 3; G.dir = 'down';
  });

  // ---- Escalation: an intern can ask Rae; the evidence gate decides whether it counts ----
  let p = await battle('sprayer', 'mal', 0);
  const labels = p.ui.options.map(o => o.label);
  check('intern sees "Ask Rae (escalate)" in an alert', labels.includes('Ask Rae (escalate)'), labels);
  await pickLabel(/^Ask Rae/);
  const say1 = (await waitUI()).ui.text || '';
  await settle();
  p = await peek();
  check('escalating a real attack with no evidence is not a good escalation', p.m.esc === 1 && p.m.escOk === 0 && p.metrics.esc === 0 && /almost no evidence/.test(say1), { m: p.m, say1 });

  p = await battle('sprayer', 'mal', 60);
  await pickLabel(/^Ask Rae/);
  const say2 = (await waitUI()).ui.text || '';
  await settle();
  p = await peek();
  check('escalating a real attack with evidence >= 40 counts; precision 50%', p.m.esc === 2 && p.m.escOk === 1 && p.metrics.esc === 50 && /Escalated with evidence/.test(say2), { m: p.m, metrics: p.metrics, say2 });

  const rep0 = (await page.evaluate(() => __UPTIME.state().rep));
  p = await battle('pry', 'benign', 60);
  await pickLabel(/^Ask Rae/); await settle();
  p = await peek();
  const rep1 = await page.evaluate(() => __UPTIME.state().rep);
  check('escalating a benign alert costs reputation; precision 33%', p.metrics.esc === 33 && rep1 === rep0 - 2, { metrics: p.metrics, rep0, rep1 });

  await page.evaluate(() => { __UPTIME.state().rank = 'Tier 1 analyst'; });
  p = await battle('lure', 'mal', 0);
  check('Tier 1 sees "Escalate to Tier 2"', p.ui.options.some(o => o.label === 'Escalate to Tier 2'), p.ui.options.map(o => o.label));
  // ---- Close it as malicious with the right response: the scoping question follows ----
  await pickLabel(/^Close alert/); await pickLabel(/^Malicious/);
  p = await waitUI();
  check('Lure response revokes sessions', p.ui.options.some(o => /revoke their sessions/.test(o.label)), p.ui.options.map(o => o.label));
  await pickLabel(/revoke their sessions/);
  p = await untilChoice();
  check('scoping question after a malicious close', p.ui && /What do you check next/.test(p.ui.text || ''), p.ui);
  await pickLabel(/^Access it added/); await settle();
  check('scoping unlocks the Field Manual entry', await page.evaluate(() => !!__UPTIME.state().fm['act:scope']));
  const ev = await page.evaluate(() => { const m = __UPTIME.state().m; return { evOk: m.evOk, judged: m.judged }; });
  check('verdicts-with-evidence metric tracked', (await peek()).metrics.evid === Math.round(ev.evOk / ev.judged * 100), { ev, metrics: (await peek()).metrics });

  // ---- Alert weighting: entry-route weights only for malicious alerts; scanning is reconnaissance ----
  const mix = await page.evaluate(() => {
    const share = (k, n) => { let c = 0; for (let i = 0; i < n; i++) if (genAlert(k).threat === 'prober') c++; return c / n; };
    const proberMal = ALERTS.prober.mal.resp.find(r => r.good).label;
    return { mal: share('mal', 6000), fp: share('fp', 6000), benign: share('benign', 6000), proberMal,
      malClues: ALERTS.prober.mal.clues.join(' '), benignTruth: ALERTS.prober.benign.truth };
  });
  check('Prober is 15% of malicious alerts (was 42%)', Math.abs(mix.mal - 0.15) < 0.03, mix);
  check('false-positive and benign alerts pick a rule evenly (~20% each of 5 rules)', Math.abs(mix.fp - 0.2) < 0.03 && Math.abs(mix.benign - 0.2) < 0.03, mix);
  check('malicious scan = login attempts after the scan; right response is not "block the IP"', /Login attempts/.test(mix.malClues) && !/^Block/.test(mix.proberMal) && /routine internet-wide scanning/.test(mix.benignTruth), mix);

  // ---- Boss tabletop: Enforce MFA does not defeat the rogue device; reviewing devices does ----
  const boss = await page.evaluate(() => {
    const s3 = picks => { const s = bossStages(picks)[2]; return { rate: s.rate, dwell0: s.dwell0, tech: s.tech }; };
    return { none: s3(['reset', 'revoke', 'logs']), mfa: s3(['reset', 'revoke', 'mfa']), devices: s3(['reset', 'revoke', 'devices']),
      mfaCard: CARDS.find(c => c.id === 'mfa').fx, notify: CARDS.find(c => c.id === 'notify').csf, logs: CARDS.find(c => c.id === 'logs').csf };
  });
  check('Enforce MFA card leaves Stage 3 (rogue MFA device) unchanged', boss.mfa.rate === boss.none.rate && boss.mfa.dwell0 === boss.none.dwell0 && /does nothing/.test(boss.mfaCard), boss);
  check('Review MFA devices card makes Stage 3 easier', boss.devices.rate < boss.none.rate && boss.devices.dwell0 < boss.none.dwell0 && boss.devices.tech === 'T1098.005', boss);
  check('CSF: Notify leadership and Review sign-in logs are Respond', boss.notify === 'Respond' && boss.logs === 'Respond', boss);

  // ---- Credits: MITRE notice, licence, trademark, non-affiliation ----
  const credits = await page.evaluate(() => creditsHtml());
  check('Credits: © 2026 notice, licence, current trademark wording, non-affiliation', credits.includes('© 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.') &&
    credits.includes('hereby grants you a non-exclusive, royalty-free license to use ATT&amp;CK®') && credits.includes('MITRE ATT&amp;CK® and ATT&amp;CK® are registered trademarks of The MITRE Corporation.') &&
    /not affiliated with, sponsored by or endorsed by Nintendo, The Pokémon Company/.test(credits) && /v20\.0/.test(credits));
  const sc = await page.evaluate(() => scorecardHtml());
  check('Scorecard: Hardening row, escalation precision, no "Patch state"', /Hardening \(baseline fixes\)/.test(sc) && /Escalation precision/.test(sc) && !/Patch state/.test(sc));

  results.errors = errors; results.requests = requests;
  if (errors.length || requests.length) failed = true;
  console.log(JSON.stringify(results, null, 1));
  await browser.close();
  process.exit(failed ? 1 : 0);
})().catch(e => { console.error('FRONTDESK TEST FAILED:', e.stack || e.message); console.log(JSON.stringify(results, null, 1)); process.exit(2); });
