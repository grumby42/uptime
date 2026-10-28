/* ============================================================
   UPTIME · editions/town-hall/market-story.js
   Town Hall district 4, Market Square (the DMZ): state, objectives,
   interactions, talk, the fieldwork (internet-facing asset inventory, the WAF
   in detection mode, the CMS patch, retiring the forgotten test site, payment
   page scripts with CSP, SRI and a tamper check), the WAF rule review, the
   councillor's directive, three investigation drills, the Web Application
   Security Dojo, the Web Board (Lantern Badge, Shroud), the payment-page
   skimming incident with its exposure window, scorecard metrics and the
   end-of-district summary.
   The Front Desk story calls in through small guarded hooks (mkObjective via
   crObjective, mkTriggers, mkInteract, mkTalk, mkTile, mkEvolveCheck). The
   engine hooks the earlier districts define (alertWeight, alertHost,
   briefList, alertDecorate, onAbility, onAlertClosed, editionMetricVals,
   editionScoreHtml, peekExtra) are wrapped here: each wrapper calls the
   previous version first, then adds Market Square.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Market Square: MITRE ATT&CK v20 (T1190, T1110.004, T1505.003, T1059.007, T1595.002, T1499.002, T1498, T1539, T1550.004, T1110.001, T1078.001). OWASP Top 10:2025; OWASP cheat sheets on query parameterization, input validation, insecure direct object references, credential stuffing and subdomain takeover; OWASP CRS documentation. PCI DSS v4.0.1 requirements 6.4.3 and 11.6.1, PCI SSC FAQs 1291, 1438 and 1588, and PCI SSC blog posts (April 2020 on breach response and PCI Forensic Investigators; January and March 2025). W3C Subresource Integrity and Content Security Policy (Level 2 and Level 3). IETF RFC 6962 (Certificate Transparency; obsoleted by RFC 9162) and RFC 6585 (HTTP 429). Apache HTTP Server log files and mod_log_config documentation. Van Acker, Hausknecht and Sabelfeld, Data Exfiltration in the Face of CSP (ASIA CCS 2016). Secondary sources, labelled as such in CREDITS.md: Sansec research on a WebRTC skimmer (March 2026), NCSL summary of US state breach-notification laws, PortSwigger Web Security Academy on blind SQL injection, TechTarget report of BA’s own attack dates (July 2019). ModSecurity recommended configuration. NSA and ASD web shell guidance (April 2020). CISA, FBI and MS-ISAC guide to DDoS attacks. UK ICO: British Airways notice of intent (July 2019) and penalty (October 2020); personal data breaches guide.';
}

/* ---------- State ---------- */
function MK() {
  if (!G.mk) G.mk = {day0: G.day, found: [], sources: [], wafPlan: null, wafScore: null, wafStats: null, wafReviews: 0, scripts: null, scope: null, check: null,
    cmsDay: null, drills: {}, ttc: [], dojo: [false, false, false], directive: null, boss: null, bossT0: null};
  return G.mk;
}
function mkOn() { return !!(G && G.f && G.f.mkMet && G.mk); }
function inMarket() { return MK_MAPS.includes(G.map); }
function mkInvPct() { return Math.round(MK().found.length / MK_ASSETS.length * 100); }
function mkHas(id) { return MK().found.includes(id); }
// Requests a day the chosen WAF rules would block (game): attacks are counted once per kind of attack (rules overlap),
// residents' requests and failed payments add up.
function mkWafStats(plan) {
  const cats = {}; let res = 0, payFail = 0;
  for (const r of MK_WAF) {
    if (plan[r.id] !== 'block') continue;
    cats[r.cat] = Math.max(cats[r.cat] || 0, r.atk);
    res += r.res; payFail += r.payFail || 0;
  }
  const atk = Object.values(cats).reduce((a, b) => a + b, 0);
  return {atk: atk, res: res, payFail: payFail, fp: atk + res ? Math.round(res / (atk + res) * 1000) / 10 : 0};
}
function mkWafOk(r, choice) { return choice === r.good || (r.good === 'off' && choice === 'log'); }
// Exposure window (game hours): until the skimmer is noticed (the tamper check, or the processor's fraud call
// after three days), plus the time to take card entry off the page, plus a second stretch if our own page
// came back before it was proved clean (unless an enforced CSP stopped the re-injected copy sending anything).
function mkWindowCalc(check, picks, restoreEarly) {
  const detect = (MK_CHECKS[check] || MK_CHECKS.week).hours;
  const contain = picks.includes('hosted') ? 0.5 : 2;
  const again = restoreEarly && !picks.includes('csp') ? detect : 0;
  const w = Math.round((detect + contain + again) * 100) / 100;
  return {detect: detect, contain: contain, again: again, window: w, affected: Math.round(w * MK_PAY_RATE)};
}
function mkFmtH(h) { return h < 1 ? Math.round(h * 60) + ' minutes' : (Math.round(h * 10) / 10) + ' hours'; }

/* ---------- Engine hooks (wrapping the Clerks' Row versions) ---------- */
const _mkPrevAlertWeight = alertWeight, _mkPrevAlertHost = alertHost, _mkPrevBriefList = briefList, _mkPrevDecorate = alertDecorate,
  _mkPrevOnAbility = onAbility, _mkPrevOnAlertClosed = onAlertClosed, _mkPrevMetricVals = editionMetricVals, _mkPrevScoreHtml = editionScoreHtml, _mkPrevPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _mkPrevAlertWeight(t, w);
  if (THREATS[t].district === 'market' && !(G.f && G.f.mkMet)) return 0;
  if (G.f.mkMet && inMarket() && MK_HOME.includes(t)) w *= 3;
  if (G.f.mkLantern && t === 'slipquote') w *= 0.5;
  return w;
};
alertHost = function () { return inMarket() ? pick(MK_HOSTS) + ' · Market Square' : _mkPrevAlertHost(); };
briefList = function () { const L = _mkPrevBriefList(); return G.f.mkMet ? L.concat(MK_BRIEFS) : L; };
// Lantern Badge: attacks against public services are seen sooner, so their alerts start with some evidence. (game)
alertDecorate = function (spec) {
  _mkPrevDecorate(spec);
  if (G.f && G.f.mkLantern && MK_HOME.includes(spec.threat)) spec.ev0 = Math.max(spec.ev0 || 0, 10);
};
onAbility = function (k, b) {
  _mkPrevOnAbility(k, b);
  if (!mkOn() || !MK_HOME.includes(b.spec.threat) || b.spec.kind !== 'mal' || b.mkTtcDone || ABIL[k].type !== 'con') return;
  b.mkTtcDone = true;
  const c = MK();
  c.ttc.push(Math.round((performance.now() - b.t0) / 100) / 10);
  if (c.ttc.length > 20) c.ttc.shift();
};
onAlertClosed = async function (s, verdict, correct, r) {
  await _mkPrevOnAlertClosed(s, verdict, correct, r);
  if (!mkOn() || s.story) return;
  if (correct && s.kind === 'mal' && r.good) {
    if (s.threat === 'stuffer') unlock('fact', 'credstuff');
    if (s.threat === 'shellback') unlock('fact', 'webshell');
    if (s.threat === 'stampede') unlock('fact', 'ddos');
  }
  track();
};
editionMetricVals = function () {
  const v = _mkPrevMetricVals();
  if (!mkOn()) return v;
  const c = MK();
  return Object.assign(v, {
    mkInv: mkInvPct(),
    mkWafFp: c.wafStats ? c.wafStats.fp : null,
    mkTtc: c.ttc.length ? +(c.ttc.reduce((a, b) => a + b, 0) / c.ttc.length).toFixed(1) : null,
    mkWindow: c.boss ? c.boss.window : null
  });
};
EDITION_METRICS.push(
  {k: 'mkInv', label: 'Internet-facing assets inventoried', unit: '%', higher: true, when: mkOn},
  {k: 'mkWafFp', label: 'WAF false-positive rate (residents among blocked requests)', unit: '%', higher: false, lower: true, when: mkOn},
  {k: 'mkTtc', label: 'Mean time to contain, Market Square (game seconds)', unit: ' s', higher: false, lower: true, when: mkOn},
  {k: 'mkWindow', label: 'Exposure window on the payment page (game hours)', unit: ' h', higher: false, lower: true, when: mkOn}
);
editionScoreHtml = function () {
  let h = _mkPrevScoreHtml();
  if (!mkOn()) return h;
  const c = MK();
  if (G.f.mkDirective) h += '<p class="dir">Directive: online payments back within one hour of any incident. (game)</p>';
  h += '<p>Market Square: Lantern Badge <b>' + (G.f.mkLantern ? 'yes' : 'not yet') + '</b> · WAF <b>' + (G.f.mkWafBlock ? 'blocking' : G.f.mkWafDetect ? 'detection mode' : 'untuned') + '</b>' +
    (c.wafStats ? ' (residents’ bill payments failing: <b>' + c.wafStats.payFail + '</b> a day)' : '') +
    ' · card entry <b>' + (G.f.mkBoss ? 'processor’s hosted page' : 'our own page') + '</b>' + (c.boss ? ' · cards exposed <b>' + c.boss.affected + '</b>' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _mkPrevPeekExtra();
  e.mkSummary = !!G.f.mkSummary;
  e.mk = G.mk ? {found: G.mk.found.slice(), inv: mkInvPct(), wafScore: G.mk.wafScore, wafStats: G.mk.wafStats, wafReviews: G.mk.wafReviews, scope: G.mk.scope, check: G.mk.check,
    scripts: G.mk.scripts, drills: G.mk.drills, ttc: G.mk.ttc.length, directive: G.mk.directive, boss: G.mk.boss, dojo: G.mk.dojo} : null;
  return e;
};
function mkTile(d, ch, x, y) {
  if (ch === 'Q' && G.f.mkLantern) { d.spr = 'L'; d.pal = 'marketBld'; }
  if (ch === 'z' && G.f.mkLantern && (x + y) % 2 === 0) d = Object.assign({ch: '.'}, TILES['.']);
  if (ch === 't' && G.f.mkTest) d = Object.assign({ch: '.'}, TILES['.']);
  if (ch === 'A' && G.f.mkWafBlock) d.pal = 'wafOn';
  return d;
}

/* ---------- Objective ---------- */
function mkObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'market', x: x, y: y, district: 'market'});
  if (!f.mkMet) return at('Next: Market Square. Its door is by the firewall, north-east of the plaza; your Shield Badge opens it.', 17, 7);
  if (!f.mkInv) return at(MK().sources.length ? 'Inventory gaps: query another source at the DMZ rack.' : 'Fieldwork: build the internet-facing asset inventory at the DMZ rack.', 7, 5);
  if (!f.mkWafDetect) return at('Fieldwork: the WAF has never been tuned. Start at the WAF box by the gate.', 14, 1);
  if (!f.mkCms) return at('Fieldwork: the CMS is behind on patches. Rafe is in the web team’s office.', 4, 10);
  if (!f.mkTest) return at('Fieldwork: retire the forgotten test site the inventory found (its old console is by the road).', 18, 8);
  if (!f.mkCsp) return at('Fieldwork: scripts on the payment page. Oona runs the payments portal.', 21, 4);
  if (!f.mkNight1) return at('End your shift at your Market Square desk, in the web team’s office.', 8, 11);
  if (!f.mkDrill1) return at('Paz has a question about last night’s injection attempts.', 17, 7);
  if (!f.mkWafBlock) return at('WAF review: read what the rules matched, then switch to blocking.', 14, 1);
  if (!f.mkDirective) return at('Councillor Whitlock wants a word, by the market stalls.', 20, 14);
  if (!f.mkDrill2) return at('The payment page’s tamper check fired. See Oona.', 21, 4);
  if (!f.mkNight2) return at('End your shift at your Market Square desk.', 8, 11);
  if (!f.mkDrill3) return at('The CMS admin report shows an admin nobody made. See Rafe.', 4, 10);
  if (!f.mkDojoDone) {
    if (!f.mkDojoMet) return at('(Optional) Train at the Web Application Security Dojo with Kit.', 26, 10);
    const i = MK().dojo.findIndex(x => !x);
    return at('(Optional) Web security puzzle ' + (i + 1) + ' of 3.', [20, 22, 24][i], 10);
  }
  if (!f.mkBoard) return at('Take the Web Board challenge (Sol Achebe, through the east gate).', 9, 2, 'wboard');
  if (!f.mkBoss) return at('Paz needs you: something is wrong with the payment page.', 17, 7);
  return {text: 'Market Square secured. Next: Records Hall.', done: true, district: 'market'};
}

/* ---------- Triggers and interactions ---------- */
let mkEarlyWarned = false;
function mkTriggers() {
  if (G.map !== 'market') return false;
  if (!G.f.crBoss) {
    if (mkEarlyWarned) return false;
    mkEarlyWarned = true;
    run(async () => { await say('Shield Badge? Good. But Ruth’s on the radio: Clerks’ Row first. The internet will still be here.', 'Paz Delgado'); });
    return true;
  }
  if (!G.f.mkMet) { run(mkArrive); return true; }
  return false;
}
function mkInteract(ch, tx, ty) {
  if (!inMarket()) return false;
  if (ch === 'W') { run(async () => { await say('The internet. Everything in Market Square faces it, and everything from it comes through the WAF gate.'); }); return true; }
  if (ch === 'A') { run(mkWafBox); return true; }
  if (ch === 'v') { run(mkRack); return true; }
  if (ch === 'N') { run(mkWebServer); return true; }
  if (ch === 'Z') { run(mkPortal); return true; }
  if (ch === 't') { run(mkTestConsole); return true; }
  if (ch === 'j') { run(() => mkDojoPuzzle([20, 22, 24].indexOf(tx))); return true; }
  if (ch === 'e') { run(async () => { await say('A web team desk: two monitors, a stress ball shaped like a cloud, and a sticky note that says “staging ≠ production”.'); }); return true; }
  if (ch === 's') { run(async () => { await say('Market stalls. Half the traders here take card payments through the town’s portal for their pitch fees.'); }); return true; }
  if (ch === 'U') { run(async () => { await say('Web Board racks: every request to every town site, every WAF decision, every page change.'); }); return true; }
  if (ch === 'Y') { run(mkDesk); return true; }
  return false;
}
async function mkTalk(npc) {
  if (!MK_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.mkMet && npc.map === 'market') { await say('Paz is the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'paz': await pazTalk(); break;
    case 'rafe': await rafeTalk(); break;
    case 'oona': await oonaTalk(); break;
    case 'kit': await kitTalk(); break;
    case 'bram': await bramTalk(); break;
    case 'sol': await mkBoardScript(); break;
  }
}
async function mkDesk() {
  const f = G.f;
  const ready = (f.mkCsp && !f.mkNight1) || (f.mkDrill2 && !f.mkNight2) || f.mkDrill3;
  if (!ready) { await say('Your desk in the web team’s office. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your Market Square desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.mkCsp && !f.mkNight1) {
    f.mkNight1 = true;
    await say('Day ' + G.day + ', 07:40. The WAF’s overnight summary: 1,412 requests matched its SQL injection rules between 02:00 and 03:00. Detection mode, so all of them went through. Paz wants to talk.');
  } else if (f.mkDrill2 && !f.mkNight2) {
    f.mkNight2 = true;
    await say('Day ' + G.day + ', 07:45. The CMS’s weekly admin report lands: one new administrator, webmaint2, created at 02:51. Rafe says it wasn’t him.');
  }
}

/* ---------- Arrival ---------- */
async function mkArrive() {
  const who = 'Paz Delgado', f = G.f;
  MK(); G.mk.day0 = G.day;
  await say('Day ' + G.day + '. Market Square: stalls, a road running down from the WAF gate, and beyond it, the internet. This is the only district that faces it directly.');
  await say('You’re the Tier 2 from Clerks’ Row? Paz Delgado, digital services. The town website, the payments portal and the resident portal all live here.', who);
  await say('Four problems. Nobody knows everything we expose to the internet. The WAF was installed and never tuned. The CMS has flaws. And the payment page loads scripts from people we have never met.', who);
  await say('You lead containment here: when something on a public site goes wrong, you decide what comes down, and you answer for the residents who can’t pay a bill while it’s down.', who);
  G.targets.mkInv = 100; G.targets.mkWafFp = 1; G.targets.mkTtc = 30; G.targets.mkWindow = 1;
  f.mkMet = true; track();
  touchCSF('Identify');
  await say('New on your scorecard: internet-facing assets inventoried, the WAF’s false-positive rate, mean time to contain, and the payment page’s exposure window if it’s ever skimmed. Start (Enter) shows them.', who);
  await say('First, the inventory. The DMZ rack by the website server has every source we have.', who);
}
async function pazTalk() {
  const f = G.f, who = 'Paz Delgado';
  if (!f.mkInv) { await say('The DMZ rack, west of the road. What do we expose? Nobody has ever written it all down.', who); return; }
  if (!f.mkWafDetect) { await say('The WAF box at the gate. It’s been passing everything since the day it arrived.', who); return; }
  if (!f.mkCms) { await say('Rafe, in the web team’s office, has the CMS advisory.', who); return; }
  if (!f.mkTest) { await say('That test site from the inventory: retire it properly. Its old console is by the road.', who); return; }
  if (!f.mkCsp) { await say('Oona runs payments. Ask her what loads on the payment page.', who); return; }
  if (!f.mkNight1) { await say('Go home. The WAF is watching, even if it isn’t stopping anything yet.', who); return; }
  if (!f.mkDrill1) { await mkDrill1(); return; }
  if (!f.mkWafBlock) { await say('The WAF review is waiting at the gate.', who); return; }
  if (!f.mkDirective) { await say('Councillor Whitlock is by the stalls. He has opinions about uptime.', who); return; }
  if (!f.mkDrill2) { await say('Oona’s tamper check fired. Go.', who); return; }
  if (!f.mkNight2) { await say('Go home. Tomorrow will come soon enough.', who); return; }
  if (!f.mkDrill3) { await say('Rafe has the CMS admin report.', who); return; }
  if (!f.mkBoard) { await say('Sol runs the Web Board, through the east gate. Kit’s Dojo is worth a visit first.', who); return; }
  if (!f.mkBoss) { await mkBossScript(); return; }
  await say('Card entry is on the processor’s page for good, and the WAF knows our residents by now. Records Hall is next.', who);
  await mkSummary();
}

/* ---------- Fieldwork: inventory, WAF, CMS, test site ---------- */
async function mkRack() {
  const f = G.f;
  if (!f.mkMet) { await say('A rack of DMZ gear. Paz should show you around first.'); return; }
  if (!f.mkInv) { await mkInventory(); return; }
  await mkQtRack();
}
async function mkInventory() {
  const c = MK(), first = !c.sources.length;
  const left = MK_SOURCES.filter(s => !c.sources.includes(s.id));
  const n = first ? 2 : 1;
  const body = '<p>' + (first ? 'Build the inventory of everything the internet can reach. You have time for <b>two</b> sources today.' : 'The inventory has gaps. Pick <b>one</b> more source.') + '</p>' +
    left.map(s => '<div class="card"><b>' + esc(s.name) + '</b><br><span class="small">' + esc(s.note) + '</span></div>').join('');
  const items = left.map(s => ({label: s.name, meta: {good: !!s.good || !first}})).concat([{label: 'Query these', done: true, meta: {done: true}}]);
  const sel = await UI.openModal('Internet-facing asset inventory', body, items, {multi: Math.min(n, left.length), closable: false, cls: 'drill'});
  const picked = sel.map(i => left[i]);
  let h = '';
  for (const s of picked) {
    c.sources.push(s.id);
    s.finds.forEach(a => { if (!c.found.includes(a)) c.found.push(a); });
    h += '<p><b>' + esc(s.name) + '</b>: ' + s.finds.length + ' found</p>';
  }
  track();
  h += '<h3>Inventory (' + c.found.length + ' of ' + MK_ASSETS.length + ' known so far)</h3><ul>' + MK_ASSETS.filter(a => c.found.includes(a.id)).map(a => '<li>' + esc(a.name) + '</li>').join('') + '</ul>';
  const missing = MK_ASSETS.length - c.found.length;
  h += missing ? '<p>Something is missing: the town has ' + MK_ASSETS.length + ' internet-facing assets (game). Each kind of source sees a different part.</p>'
    : '<p>All ' + MK_ASSETS.length + ' found. Names (DNS, certificate logs) found what is hosted elsewhere; scanning our own addresses and reading the firewall found what has no name.</p>';
  await UI.openModal('Inventory results', h, [{label: 'Continue', meta: {good: true}}], {closable: false, cls: 'drill'});
  unlock('act', 'extinv'); unlock('fact', 'ct_log'); touchCSF('Identify');
  if (missing) { await say('No single source lists everything. A spreadsheet knows what someone remembered; DNS and certificate logs know names; a scan of our own addresses knows what answers. Try another.', 'Paz Delgado'); return; }
  G.f.mkInv = true; track();
  await say('Seven. Including two nobody remembered: an old test copy of the website at an outside host, and the WAF’s own admin page answering on a public address.', 'Paz Delgado');
  await say('I’ve closed the WAF admin page to everything but the office, after reading its sign-in log: only our own admins, from the office. Found exposed means check who used it, then close it. The test site is yours to retire. The WAF box is next.', 'Paz Delgado');
}
async function mkWafBox() {
  const f = G.f;
  if (!f.mkMet) { await say('A grey box between the gate and the internet. Paz should show you around first.'); return; }
  if (!f.mkInv) { await say('The WAF box. Inventory first: you can’t protect what you don’t know you have.'); return; }
  if (!f.mkWafDetect) { await mkWafDetect(); return; }
  if (f.mkDrill1 && !f.mkWafBlock) { await mkWafReview(); return; }
  if (f.mkWafBlock) {
    const i = await choose('The WAF is blocking. Residents’ requests blocked today: ' + MK().wafStats.res + '.', [{label: 'Leave it', meta: {good: true}}, {label: 'Review the rules again'}]);
    if (i === 1) await mkWafReview();
    return;
  }
  await say('The WAF is in detection mode: logging what it would block, blocking nothing. Read its log after a night of real traffic.');
}
async function mkWafDetect() {
  await say('The WAF box. It has a managed rule set (a standard collection of attack patterns), and nobody has ever switched it on. Everything passes.');
  while (true) {
    const i = await choose('How do you bring it in?', [
      {label: 'Detection mode first: switch on the managed rules to log what they would block, read a day of real traffic, write exclusions for real residents, then block', meta: {good: true}},
      {label: 'Blocking mode now, at the highest paranoia level'},
      {label: 'Leave it as it is: having a WAF is enough'},
      {label: 'Switch it off: the website will be patched'}]);
    if (i === 0) break;
    if (i === 1) await say('The strictest level catches the most, and blocks the most real residents too. Paying a bill shouldn’t trip an alarm. Detect, tune, then block.');
    else if (i === 2) await say('A WAF with no rules switched on is a box with lights. It blocks nothing and logs nothing useful.');
    else await say('Patching fixes known flaws. The WAF buys time for the next one, and its logs show you who is trying. You want both.');
  }
  G.f.mkWafDetect = true; unlock('act', 'wafmode'); unlock('fact', 'waf_detect'); touchCSF('Protect'); touchCSF('Detect'); track();
  await say('Detection mode on. ModSecurity’s own recommended configuration starts the same way: “Use detection only to start with, because that minimises the chances of post-installation disruption.” Read its log tomorrow.');
}
async function rafeTalk() {
  const f = G.f, who = 'Rafe Lindgren';
  if (!f.mkWafDetect) { await say('The WAF? It came in a box. Paz will want the inventory and the WAF first.', who); return; }
  if (!f.mkCms) { await mkCmsPatch(); return; }
  if (f.mkNight2 && !f.mkDrill3) { await mkDrill3(); return; }
  if (f.mkDrill3) { await say('Sessions time out now. I sign out properly, too. Lesson learned.', who); return; }
  await say('Web team. If it’s on a town website, it went through this office. Usually.', who);
}
async function mkCmsPatch() {
  const who = 'Rafe Lindgren';
  await say('The CMS vendor put out a fix this week: ADV-26-201 (game), a file upload flaw that lets anyone upload any file. It’s on CISA’s Known Exploited list. Our site is three versions behind.', who);
  while (true) {
    const i = await choose('When does it go on?', [
      {label: 'Today: take a backup, apply it on staging and check the site, then production', meta: {good: true}},
      {label: 'At the quarterly maintenance window, next month'},
      {label: 'Never: a WAF rule can block the upload instead'},
      {label: 'Turn off uploads forever'}]);
    if (i === 0) break;
    if (i === 1) await say('It’s internet-facing and being exploited now. A month is a long time to leave the door open.');
    else if (i === 2) await say('A WAF rule can cover the gap for a day or two (a virtual patch). It’s a filter in front of the flaw, not a fix in it.');
    else await say('The comms team uploads the agendas and the news photos. Patch the flaw; keep the feature.');
  }
  const c = MK(); c.cmsDay = G.day;
  G.f.mkCms = true; unlock('act', 'patchweb'); unlock('fact', 'kev'); touchCSF('Protect'); track();
  await say('Backup taken, staging checked, production patched by lunch. The upload flaw is closed.', who);
  await say('Patched from today. A patch stops new uploads through the flaw; it tells us nothing about old ones. I’ll go through the uploads folder once the WAF work is done.', who);
}
async function mkTestConsole() {
  const f = G.f;
  if (!f.mkInv || !mkHas('test')) { await say('A dusty console under a sheet. A sticky note: “test site login, don’t touch”.'); return; }
  if (f.mkTest) return;
  if (!f.mkCms) { await say('The old test site’s console, still signed in to its hosting account. Paz wants the WAF and the CMS done first.'); return; }
  await say('The old test site’s console. test.townhall.example: a copy of the website from three years ago, at an outside hosting company, still answering. The DNS name points at the host with a CNAME. (game)');
  while (true) {
    const i = await choose('How do you retire it?', [
      {label: 'Check its logs and keep a copy, put up a maintenance page, remove the DNS record, wait out the DNS cache time, then cancel the hosting', meta: {good: true}},
      {label: 'Cancel the hosting account now: it’s only a test'},
      {label: 'Leave it: nobody links to it'},
      {label: 'Remove the DNS record and keep the site running, just in case'}]);
    if (i === 0) break;
    if (i === 1) await say('Two problems. You lose its logs before anyone has read them, and the town’s name still points at a hosting account nobody owns. Someone else could claim it and serve anything from test.townhall.example: a subdomain takeover.');
    else if (i === 2) await say('The inventory found it, and so will every scanner on the internet. It runs a three-year-old CMS.');
    else await say('Still on the internet, still unpatched, and now nobody is even watching its name.');
  }
  G.f.mkTest = true; unlock('act', 'decom'); unlock('fact', 'takeover'); touchCSF('Protect'); track();
  await say('Logs copied. Two failed sign-ins on its admin page last week, both with the CMS’s default password, from a scanner’s address; nothing else. Its database holds made-up test data only (checked, not assumed), and none of its passwords or keys work on the live site. Maintenance page up, DNS record removed, hosting cancelled after the cache time.');
  await say('The console goes in the recycling. One less thing facing the internet.');
}
async function mkWebServer() {
  const f = G.f;
  if (!f.mkMet) { await say('The town website server. Paz should show you around first.'); return; }
  await say('WEB-01, the town website (CMS). ' + (f.mkCms ? 'Patched on Day ' + MK().cmsDay + '.' : 'Three versions behind.') + (f.mkDrill3 ? ' Sessions now expire after 30 minutes idle and 8 hours in all (game).' : ''));
}

/* ---------- Fieldwork: the payment page (scope, scripts, CSP and SRI, the tamper check) ---------- */
async function oonaTalk() {
  const f = G.f, who = 'Oona Quist';
  if (!f.mkTest) { await say('Payments. Water bills, parking fines, market pitch fees. Paz will send you over when it’s my turn.', who); return; }
  if (!f.mkCsp) { await mkPaymentPage(); return; }
  if (f.mkDirective && !f.mkDrill2) { await mkDrill2(); return; }
  if (f.mkDrill2 && !f.mkBoss) { await say('Every script on that page now has a reason written next to it. And I read vendor notices.', who); return; }
  if (f.mkBoss) { await say('Northgate’s page takes the cards now. Nothing we serve runs while a resident types a card number. I sleep better.', who); return; }
  await say('The tamper check runs on the payment page now. I hope it stays quiet.', who);
}
async function mkPortal() {
  const f = G.f;
  if (!f.mkMet) { await say('The payments portal. Paz should show you around first.'); return; }
  const c = MK();
  const scripts = c.scripts ? MK_SCRIPTS.filter(s => c.scripts[s.id] === 'keep').map(s => s.name).join(', ') : 'four scripts (nobody has listed them)';
  await say('pay.townhall.example. Card entry: ' + (f.mkBoss ? 'the processor’s hosted page' : 'our own page') + '. Scripts on the page: ' + scripts + '.' + (c.check ? ' Tamper check: ' + MK_CHECKS[c.check].label.split(',')[0].toLowerCase() + '.' : ''));
}
async function mkPaymentPage() {
  const who = 'Oona Quist', c = MK();
  await say('Our payment page is our own: our server sends the page, our script draws the card form, and the card details go from the resident’s browser to Northgate, our processor (game). Four scripts run on it.', who);
  // Scope: where should card entry live?
  while (true) {
    const i = await choose('Before the scripts: where should residents type their card details?', [
      {label: 'On Northgate’s own hosted payment page (we redirect residents there): our code never touches card entry', meta: {good: true, k: 'redirect'}},
      {label: 'In Northgate’s form inside an iframe on our page', meta: {k: 'iframe'}},
      {label: 'On our own page, as now: the WAF protects it'}]);
    if (i === 0) { c.scope = 'redirect'; break; }
    if (i === 1) { c.scope = 'iframe'; await say('Much better than today: the processor produces the form. But the page around the iframe is still ours, and it still has to be protected from scripts. A redirect takes our page out of card entry altogether.', who); break; }
    await say('The WAF sees requests to our server. It never sees what a script does inside a resident’s browser, and a page we produce is a page we must protect, script by script.');
  }
  unlock('act', 'hostedpay'); unlock('fact', 'saqa');
  await say('Agreed. It needs a contract change with Northgate, so it lands next quarter (game). Until then the page is ours, and so are its scripts.', who);
  // The scripts (PCI DSS 6.4.3: authorised, integrity assured, inventory with written justification).
  const plan = {};
  for (let n = 0; n < MK_SCRIPTS.length; n++) {
    const s = MK_SCRIPTS[n];
    const items = ['keep', 'remove'].map(k => ({label: k === 'keep' ? 'Keep, with a written reason' : 'Remove from the payment page', meta: {k: k, good: s.good === k}}));
    const j = await UI.openModal('Payment page scripts · ' + (n + 1) + ' of ' + MK_SCRIPTS.length,
      '<p>Every script on the payment page can read what residents type. Keep it only if the page needs it.</p><div class="card"><b>' + esc(s.name) + '</b><br>' + esc(s.what) + '</div>', items, {closable: false, cls: 'drill'});
    plan[s.id] = items[j].meta.k;
  }
  const right = MK_SCRIPTS.filter(s => plan[s.id] === s.good).length;
  const rows = MK_SCRIPTS.map(s => '<tr><td>' + esc(s.name) + '</td><td>' + (plan[s.id] === 'keep' ? 'keep' : 'remove') + '</td><td>' + (plan[s.id] === s.good ? '✓' : s.good) + '</td></tr><tr><td colspan="3" class="small">' + esc(s.why) + '</td></tr>').join('');
  await UI.openModal('Script inventory', '<p class="big">' + right + ' of ' + MK_SCRIPTS.length + ' right</p><table class="sc"><tr><th>Script</th><th>You</th><th>Better</th></tr>' + rows + '</table>' +
    '<p>PCI DSS requirement 6.4.3: every payment page script is authorised, its integrity is assured, and it is on an inventory with a written reason it is needed.</p>', [{label: 'Apply', meta: {good: true}}], {closable: false, cls: 'drill'});
  MK_SCRIPTS.forEach(s => { if (s.good === 'remove') plan[s.id] = 'remove'; });
  c.scripts = plan;
  await say('Analytics and chat are off the payment page' + (right < MK_SCRIPTS.length ? ' (Rafe took out the ones you kept that the page doesn’t need)' : '') + '. Two scripts left: ours, and Northgate’s.', who);
  unlock('act', 'scriptinv'); unlock('fact', 'pci643');
  // Controls: CSP report-only, SRI where files never change.
  while (true) {
    const i = await choose('How do you keep those two honest in the browser?', [
      {label: 'A Content Security Policy in report-only mode first (scripts only from us and Northgate, data sent only to Northgate), Subresource Integrity on files that never change, then enforce after a clean week', meta: {good: true}},
      {label: 'Subresource Integrity hashes on every script, Northgate’s included'},
      {label: 'Enforce a strict policy today, untested'},
      {label: 'Nothing: the WAF covers the payment page'}]);
    if (i === 0) break;
    if (i === 1) await say('Northgate updates tokenize.js in place when they release. The browser would refuse the new file the moment it changed, and every payment would fail. Pin what never changes; track vendor changes through their notices and the tamper check.');
    else if (i === 2) await say('If you’ve missed one thing the page needs, payments break for everyone. Report-only shows you what would break, without breaking it.');
    else await say('The WAF reads requests coming to our server. What a script does in a resident’s browser, and where it sends data, the WAF never sees.');
  }
  unlock('act', 'csp'); unlock('act', 'sri'); unlock('fact', 'sri_csp');
  await say('Policy in report-only mode, reporting to Rafe’s inbox. Enforcement is booked for next week, after a clean run (game).', who);
  // The tamper check (PCI DSS 11.6.1).
  const keys = Object.keys(MK_CHECKS);
  const k = await choose('Last piece: a check that compares the page, as browsers receive it, with the approved copy. How often?', keys.map(x => ({label: MK_CHECKS[x].label, meta: {good: !!MK_CHECKS[x].good, k: x}})));
  c.check = keys[k];
  if (c.check === 'q15') await say('Every fifteen minutes. The standard asks for at least weekly, or what your own risk analysis says. For the page that takes residents’ cards, our analysis says often.', who);
  else if (c.check === 'week') await say('Weekly meets the minimum. It also means a skimmer added on Tuesday could run until next Monday. (Noted: game.)', who);
  else await say('Monthly is below the minimum: PCI DSS 11.6.1 asks for at least weekly, or the frequency your targeted risk analysis sets. Rafe sets it to weekly for now. (game)', who);
  if (c.check === 'month') c.check = 'week';
  G.f.mkCsp = true; unlock('act', 'tamper'); unlock('fact', 'pci1161'); touchCSF('Protect'); touchCSF('Detect'); track();
  await say('That’s the payment page. Long day: your desk is in the web team’s office.', who);
}

/* ---------- WAF rule review (mini-game): false positives are residents who can't pay ---------- */
async function mkWafReview() {
  const c = MK();
  await say('A day of detection-mode logs. Nine candidate rules, each with what it matched. Block, log only, or switch it off. (Counts are game data.)');
  const plan = {};
  for (let n = 0; n < MK_WAF.length; n++) {
    const r = MK_WAF[n];
    const items = ['block', 'log', 'off'].map(k => ({label: MK_WAF_ACTS[k], meta: {k: k, good: k === r.good}}));
    const i = await UI.openModal('WAF rule review · ' + (n + 1) + ' of ' + MK_WAF.length,
      '<div class="card"><b>' + esc(r.rule) + '</b></div><p class="small">What it matched in detection mode (a sample):</p>' + drillPre(r.seen), items, {closable: false, cls: 'drill'});
    plan[r.id] = items[i].meta.k;
  }
  // Score (game): rules that would block residents count double.
  let got = 0, tot = 0;
  const rows = MK_WAF.map(r => {
    const w = r.res ? 2 : 1, ok = mkWafOk(r, plan[r.id]);
    tot += w; if (ok) got += w;
    return '<tr><td>' + esc(r.rule) + (r.res ? ' <span class="tag">blocks residents</span>' : '') + '</td><td>' + MK_WAF_ACTS[plan[r.id]] + '</td><td>' + (ok ? '✓' : MK_WAF_ACTS[r.good]) + '</td></tr>' +
      '<tr><td colspan="3" class="small">' + esc(r.why) + '</td></tr>';
  }).join('');
  const st = mkWafStats(plan), score = Math.round(got / tot * 100);
  const body = '<p class="big">Rule review ' + score + '% <span class="small">(game: rules that block residents count double)</span></p>' +
    '<p>With these rules blocking, a day looks like: attack requests blocked <b>' + st.atk.toLocaleString('en-US') + '</b> · residents’ requests blocked <b>' + st.res.toLocaleString('en-US') + '</b> · false-positive rate <b>' + st.fp + '%</b> · bill payments failing <b>' + st.payFail + '</b> (game).</p>' +
    '<table class="sc"><tr><th>Rule</th><th>You</th><th>Better</th></tr>' + rows + '</table>' +
    '<p>A false positive is a real resident blocked: a bill not paid, a call to Oona, a fine for being late. Tune with exclusions for real users, keep rules that only ever match attacks, and let parameterised queries and MFA do the work a WAF can’t.</p>';
  const j = await UI.openModal('WAF review', body, [{label: 'Switch the WAF to blocking with these rules', meta: {good: true}}, {label: 'Redo the review'}], {closable: false, cls: 'drill'});
  if (j === 1) return mkWafReview();
  c.wafPlan = plan; c.wafScore = score; c.wafStats = st; c.wafReviews++;
  const first = !G.f.mkWafBlock;
  G.f.mkWafBlock = true; unlock('act', 'wafmode'); touchCSF('Protect'); track();
  if (st.payFail) {
    G.rep -= 2 + Math.floor(st.payFail / 200); bumpUptime(-0.02); track();
    await say('Within the hour the payments line is ringing. ' + st.payFail + ' residents a day can’t pay their bills, and the WAF is why. Reputation and uptime drop. (game)', 'Oona Quist');
    await say('You can review the rules again at the WAF box. Every blocked resident is on your scorecard as a false positive.', 'Paz Delgado');
  } else if (st.res) {
    await say('Blocking. ' + st.res + ' residents’ requests a day still hit a rule. Keep an eye on that number.', 'Paz Delgado');
  } else {
    await say('Blocking, and no resident blocked. That is what detecting before blocking buys you.', 'Paz Delgado');
  }
  if (first) await say('Councillor Whitlock has been asking for you. He’s by the market stalls.', 'Paz Delgado');
}

/* ---------- The directive (game): payments back within an hour ---------- */
async function bramTalk() {
  const f = G.f, who = 'Councillor Bram Whitlock', c = MK();
  if (f.mkDirective) { await say(c.directive === 'plan' ? 'Within the hour, on a page we know is clean. I can sell that to the council.' : 'One hour. That’s all I ask.', who); return; }
  await say('You’re the security person. Good. Half my ward pays their bills online, and the market traders pay pitch fees the same way.', who);
  await say('So here is my directive: whatever happens, online payments are back up within one hour. One hour. (game)', who);
  while (true) {
    const i = await choose('Your answer to the councillor.', [
      {label: 'Agree a plan: within the hour, payments move to the processor’s hosted page; our own page comes back only once it is proved clean', meta: {good: true, k: 'plan'}},
      {label: 'Promise our own page back within the hour, whatever happened', meta: {k: 'promise'}},
      {label: 'Refuse: payments stay off until every investigation is finished', meta: {k: 'refuse'}}]);
    if (i === 0) { c.directive = 'plan'; break; }
    if (i === 1) await say('If the page was skimmed, bringing it back in an hour may bring the skimmer back with it, and every resident who pays in that hour is exposed. Fast and clean pull against each other; find a way to have both.');
    else await say('Residents still need to pay, and “off until we’re finished” can mean a week. Find a clean fallback instead of a long outage.');
  }
  G.f.mkDirective = true; touchCSF('Govern'); track();
  await say('A fallback that is clean by design. Fine. One hour, on the processor’s page. I’ll hold you to it.', who);
  await say('(Recovery time and a clean recovery pull against each other. A clean fallback, agreed in advance, lets you meet a recovery target without bringing the attacker back.)');
}

/* ---------- Drills ---------- */
async function mkDrill(key) {
  const c = MK(), up = Math.max(1, c.day0 - 6), pd = c.cmsDay || c.day0;
  const raw = JSON.stringify(MK_DRILLS[key]).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day)).replace(/\{U\}/g, String(up)).replace(/\{P\}/g, String(pd));
  const D = JSON.parse(raw);
  const r = await doDrill(D);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  return r;
}
async function mkDrill1() {
  const who = 'Paz Delgado';
  await say('1,412 SQL injection matches last night, all let through. The council will ask me one thing: did they get anything? I’d like to answer from evidence.', who);
  const r = await mkDrill('sqli');
  G.f.mkDrill1 = true; unlock('fact', 'clf'); unlock('fact', 'owaspcs'); touchCSF('Respond');
  if (r.verdictOk) await say('One request in 1,412, and it was the one that mattered. Rafe is fixing search today; legal has the list of what left. And the WAF review can’t wait.', who);
  else await say('Rafe found it: one 200 response of 96,880 bytes at 02:44, 1,204 resident records. Legal has the list. The WAF review can’t wait.', who);
}
async function mkDrill2() {
  const who = 'Oona Quist';
  await say('The tamper check on the payment page just fired: a new script address. Is somebody skimming our residents?', who);
  const r = await mkDrill('script');
  G.f.mkDrill2 = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Northgate’s own change. Their notice is now in our change process, and the inventory has the new address.' : 'Paz checked: Northgate’s notice, our ticket, one line changed. A vendor change. The inventory has the new address.', who);
}
async function mkDrill3() {
  const who = 'Rafe Lindgren';
  await say('webmaint2. The log says I made it at 02:51. I was asleep, I promise. I did leave the CMS open when I went home…', who);
  const r = await mkDrill('admin');
  G.f.mkDrill3 = true; unlock('fact', 'webshell'); touchCSF('Respond');
  await say(r.verdictOk ? 'A web shell from before the patch, and my open session. Every session revoked, the shell preserved and removed, timeouts on. I sign out now.'
    : 'Paz walked me through it: a web shell from before the patch used my open session. Every session revoked, the shell preserved and removed, timeouts on.', who);
}

/* ---------- Web Application Security Dojo ---------- */
async function kitTalk() {
  const who = 'Kit Moreau', f = G.f;
  if (!f.mkDojoMet) {
    f.mkDojoMet = true;
    await say('Web Application Security Dojo. National Cyber League-style puzzles, web edition.', who);
    await say('One rule here: the server decides what’s true, never the browser. Three terminals: injection, access control, and why validation isn’t enough. Solve all three and your network tool levels up.', who);
    return;
  }
  if (f.mkDojoDone) { await say('Code is code, data is data. Check ownership every time. Validate, and still parameterise.', who); return; }
  await say('Puzzles solved: ' + MK().dojo.filter(Boolean).length + ' of 3. Terminals to my left.', who);
}
async function mkDojoPuzzle(i) {
  if (!G.f.mkDojoMet) { await say('A web security practice terminal. Talk to Kit first.'); return; }
  const p = MK_DOJO[i], c = MK();
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await UI.openModal('Web security · ' + p.title, '<pre class="art">' + esc(p.art) + '</pre><p><b>' + esc(p.q) + '</b></p>', p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {closable: false, cls: 'drill'});
    if (k === p.good) break;
    await say('Not quite. What does the server check for itself, and what does it just trust from the request?');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; unlock('fact', 'owasp10'); if (i === 1) unlock('act', 'objauthz'); unlock('act', 'paramq'); touchCSF('Protect');
  if (c.dojo.every(Boolean)) {
    G.f.mkDojoDone = true;
    const t = G.party.find(p2 => TOOLS[p2.id].cls === 'network');
    if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Kit Moreau'); }
    else await say('All three. You think like a web developer’s worst reviewer now. That’s a compliment.', 'Kit Moreau');
    await evolveCheck();
  }
}

/* ---------- Evolution: Shroud -> Mirrorcoat once the payment page is watched the way browsers see it ---------- */
async function mkEvolveCheck() {
  if (!G.f || !G.f.mkBoss || !G.mk) return;
  const t = G.party.find(p => p.id === 'shroud');
  if (!t) return;
  t.id = 'mirrorcoat'; t.lvl = Math.max(t.lvl, 6); touchCSF('Detect');
  await say('Shroud is evolving! Shroud learns the payment page as residents’ browsers receive it → Mirrorcoat. New ability: Page integrity check.');
}

/* ---------- Web Board ---------- */
async function mkBoardScript() {
  const who = 'Sol Achebe', f = G.f;
  if (f.mkBoard) { await say('The Lantern Badge lets you see attacks on public services sooner. They’re public: so is every mistake. Be quick and be careful.', who); return; }
  if (!f.mkDrill3) { await say('The Web Board is for people who have worked a few real web cases. Finish with Paz’s team first.', who); return; }
  await say('Sol Achebe, web security lead. Everything we publish, someone on the internet reads with bad intentions. Here you meet them.', who);
  await say('Three rounds: an injection that slips past the WAF, a script in the uploads, and a thousand residents signing in at once. Ready?', who);
  for (const s of MK_BOARD_SPECS()) await fightStory(s, 'Sol: Again. Read what the server answered, not what the attacker sent.');
  f.mkBoard = true; f.mkLantern = true;
  G.focusMax = Math.max(G.focusMax, 40); G.focus = G.focusMax;
  unlock('tech', 'T1190'); unlock('tech', 'T1505.003'); unlock('tech', 'T1110.004'); unlock('fact', 'credstuff'); unlock('fact', 'webshell');
  track();
  await say('You cleared the Web Board. This is the Lantern Badge.', who);
  await say('Its power: you see attacks on public services sooner. Market Square alerts start with some evidence, the unmonitored web paths shrink as the WAF covers them, and injection alerts (Slipquote) drop by half now the WAF blocks. (game)', who);
  addTool('shroud', 5);
  await say('One more thing: Shroud, a web application firewall you can take into an investigation. It reads every request before the website does. (Shroud Lv 5)', who);
  touchCSF('Protect');
  await evolveCheck();
}

/* ---------- Boss: the skimmed checkout (retold in outline from British Airways, 2018) ---------- */
function mkBossStages(picks, restoreEarly) {
  const ev0 = picks.includes('preserve') ? 20 : 0, csp = picks.includes('csp');
  return {
    s1: {kind: 'mal', threat: 'skimlet', tech: 'T1059.007', tags: ['web'], story: true, group: 'a', ev0: ev0,
      rate: picks.includes('hosted') ? 9 : 14, dwell0: 20,
      title: 'Stage 1: extra lines in pay.js', host: 'PAY-01 · pay.townhall.example/checkout', enemy: {spr: 'skimlet', pal: 'skimlet'},
      clues: ['pay.js, our own payment script, grew by 412 bytes at ' + MK_INJECT + ' last night. No change ticket.', 'The new lines read the card fields as residents type and send them to metrics-cdn.example, a domain registered four days ago.', 'The CSP, still in report-only mode, reported every send. Report-only reports; it doesn’t stop.'],
      truth: 'A skimmer: malicious JavaScript added to our own payment script (Command and Scripting Interpreter: JavaScript).',
      resp: [{label: 'Take card entry off our page now (hosted checkout or offline), keep a copy of the changed pay.js and the logs, then remove the lines', good: true},
             {label: 'Delete the new lines and carry on', good: false, why: 'Without a copy and the logs, you can’t prove when it started or who was affected, and you still don’t know how it got in.'},
             {label: 'Keep the page up while you investigate', good: false, why: 'Every resident who pays meanwhile is skimmed. Contain card entry first.'},
             {label: 'Shut down every town website', good: false, disrupt: 2, why: 'The news site and the permits pages aren’t skimming anyone. Contain the payment page.'}],
      chain: [{at: 40, text: 'Another resident pays a water bill on the page.'}, {at: 75, text: 'metrics-cdn.example receives another batch.'}]},
    s2: {kind: 'mal', threat: 'stuffer', tech: 'T1110.004', tags: ['web', 'identity'], story: true, group: 'a', ev0: ev0,
      rate: picks.includes('mfa3p') ? 8 : 14, dwell0: picks.includes('mfa3p') ? 10 : 35,
      title: 'Stage 2: the way in', host: 'deploy pipeline · web agency account', enemy: {spr: 'stuffer', pal: 'stuffer'},
      clues: ['The change to pay.js came through the deploy pipeline, from the web agency’s account, signed in from 203.0.113.88.', 'That account had no MFA. Its password matches one leaked in another site’s breach.', 'A week ago: one sign-in from 203.0.113.88 with that leaked password, right first time. No failures, so nothing alerted.'],
      truth: 'Credential stuffing against a third party’s account that could change the website, with no MFA on it.',
      resp: [{label: 'Disable the agency account, revoke its sessions and deploy tokens, require MFA on every account that can change the site, review everything it changed', good: true},
             {label: 'Reset its password and close', good: false, why: 'Its sessions and deploy tokens work without the password. Revoke those too.'},
             {label: 'Ban the agency from working for the town', good: false, why: 'They were a victim too. Fix how their access works: MFA, their own named accounts, tokens with owners and expiry dates.'}],
      chain: [{at: 60, text: 'The agency account lists the pipeline’s other sites.'}]},
    s3: {kind: 'mal', threat: 'skimlet', tech: 'T1059.007', tags: ['web'], story: true, group: 'a', ev0: ev0,
      rate: csp ? 8 : 13, dwell0: restoreEarly && !csp ? 45 : 15,
      title: 'Stage 3: it comes back', host: 'PAY-01 · pay.js', enemy: {spr: 'skimlet', pal: 'skimlet'},
      clues: [restoreEarly ? 'Our own page went back up at 10:30, as the councillor asked. At 10:41, pay.js changes again.' : 'Our own page is still off. On its staging copy, pay.js changes again at 10:41.', 'The agency account was disabled at 10:30 and its own tokens revoked, but a deploy key saved in the pipeline’s settings, under no person’s account, was missed.', csp ? 'The CSP is enforcing now: browsers refuse the skimmer’s sends to metrics-cdn.example, and the tamper check confirms the policy header itself hasn’t been loosened.' : 'The CSP is still in report-only mode: it reports each send and lets it through.'],
      truth: 'The skimmer re-injected with a pipeline deploy key nobody had listed: it outlived the account clean-up.',
      resp: [{label: 'List and revoke every credential that can deploy, including keys saved in the pipeline, redeploy pay.js from the signed release, keep card entry on the hosted page until two clean tamper checks', good: true},
             {label: 'Reset the agency’s password again', good: false, why: 'The key belongs to the pipeline, not to the agency account: no password reset touches it. Find it and revoke it.'},
             {label: 'Switch the tamper check off: it keeps alerting', good: false, why: 'It is the only reason you know.'}],
      chain: [{at: 60, text: 'pay.js changes a third time.'}]}
  };
}
async function mkBossScript() {
  const who = 'Paz Delgado', c = MK();
  await surfaceMissed(true);
  const chk = c.check || 'week';
  if (chk === 'q15') await say('Incident. The payment page’s tamper check fired at 01:27 last night: pay.js, our own script, changed at ' + MK_INJECT + '. Rafe was paged and confirmed nobody on the team deployed anything.', who);
  else await say('Incident. Northgate Payments just called: cards used on our payment page over the last three days are turning up in fraud. The tamper check runs weekly; its next run was Monday. And the CSP reported every send to metrics-cdn.example from ' + MK_INJECT + ' onward. The reports went to Rafe’s inbox, and nothing alerted on them.', who);
  await say('This is the 2018 British Airways breach, in outline. The ICO said that user traffic to BA’s website was diverted to a fraudulent site, where customers’ details were harvested. BA didn’t spot it; a third party told them more than two months after the attack began.', who);
  unlock('fact', 'ba2018'); unlock('fact', 'ico72');
  await say('Oona has already told Northgate, as our merchant agreement requires (game), and I’ve told leadership what we know, what we’re doing and when they’ll hear next. Telling people is never optional, so it isn’t one of your cards.', who);
  touchCSF('Respond'); G.rep += 5; toast('Processor and leadership told. Reputation up.');
  await say('Tabletop. Pick four response cards. Then we work it in three stages, and you lead containment.', who);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions, PCI DSS and the ICO’s British Airways findings. (The processor and leadership have been told.)</p>' +
    MK_CARDS.map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const items = MK_CARDS.map(x => ({label: x.name, meta: {good: !!x.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const sel = await UI.openModal('Tabletop: the skimmed checkout', body, items, {multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => MK_CARDS[i].id);
  G.f.mkCards = picks;
  for (const id of picks) { const x = MK_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('shutall')) { bumpUptime(-0.03); G.rep -= 3; }
  if (picks.includes('quiet')) G.rep -= 5;
  await say('Debrief: contain card entry first (the processor’s hosted page is clean by design), preserve before you clean, and close the way in: the ICO listed MFA on employee and third-party accounts among the measures British Airways could have used. A WAF rule can’t touch a skimmer: it runs in residents’ browsers. And nothing about this is quiet: people whose cards were taken have to be told.', who);
  c.bossT0 = G.playMs;
  let restoreEarly = picks.includes('restore');
  const S = mkBossStages(picks, restoreEarly);
  await fightStory(S.s1, 'Paz: Regroup. Same stage, again.');
  c.ttc.push(Math.round((G.playMs - c.bossT0) / 100) / 10); if (c.ttc.length > 20) c.ttc.shift();
  touchCSF('Respond');
  // The exposure window: when did it start, and who is affected?
  const startOpts = [
    {label: MK_INJECT + ' last night: the deploy log’s change to pay.js, which matches the first browser report of the new lines', meta: {good: true, k: 'inject'}},
    {label: 'When the alert, or the call, reached us', meta: {k: 'alert'}},
    {label: 'When the CMS was last patched', meta: {k: 'cms'}},
    {label: 'The start of the month, to be safe', meta: {k: 'month'}}];
  const si = await UI.openModal('Exposure window: the start', '<p>Card entry is contained. Before residents are told who is affected: when did the exposure start?</p>' +
    '<pre class="art">' + esc(['Deploy log      pay.js changed ' + MK_INJECT + ' by the web agency’s account (no ticket)', 'CSP reports     first send to metrics-cdn.example at ' + MK_INJECT + ':40', chk === 'q15' ? 'Tamper check    flagged at 01:27' : 'Processor call  three days later, fraud on cards used here']) + '</pre>', startOpts.map(o => ({label: o.label, meta: o.meta})), {closable: false, cls: 'drill'});
  const startOk = startOpts[si].meta.k === 'inject';
  if (!startOk) await say(startOpts[si].meta.k === 'alert' ? 'That would leave out everyone skimmed before we noticed. The window starts at the first malicious change the evidence shows.' : startOpts[si].meta.k === 'month' ? 'That tells thousands of residents who weren’t affected to cancel their cards. Use the evidence: the deploy log and the first report agree on ' + MK_INJECT + '.' : 'The patch has nothing to do with this change. The deploy log does: ' + MK_INJECT + '.', who);
  const whoOpts = [
    {label: 'Everyone who typed a card into our page inside the window: completed payments, and declined or abandoned attempts too', meta: {good: true, k: 'paid'}},
    {label: 'Everyone who visited the payment page', meta: {k: 'visited'}},
    {label: 'Every resident with a portal account', meta: {k: 'all'}},
    {label: 'Nobody: the CSP reported it', meta: {k: 'none'}}];
  const wi = await choose('Who was affected?', whoOpts);
  const whoOk = whoOpts[wi].meta.k === 'paid';
  if (!whoOk) await say(whoOpts[wi].meta.k === 'none' ? 'Report-only reports and lets everything through. Every card typed in the window went to the attacker.' : 'The skimmer read card fields as people typed. Visitors who never typed a card had nothing taken; everyone who typed one did, whether or not the payment went through. Northgate’s records show declined attempts as well as completed ones; people who gave up before pressing Pay never reached Northgate, so a public notice covers them.', who);
  unlock('act', 'exposurewin');
  // The councillor's hour.
  await say('It’s been an hour, and I’m getting calls. Payments?', 'Councillor Bram Whitlock');
  const dOpts = [
    {label: 'Payments are back on Northgate’s hosted page; our own page stays off until it is proved clean', meta: {good: true, k: 'hosted'}},
    {label: 'Bring our own page back now: the hour is up', meta: {k: 'ours'}},
    {label: 'All online payments stay off for a week', meta: {k: 'off'}}];
  const di = await choose('The councillor’s directive: payments back within one hour.', dOpts);
  const dk = dOpts[di].meta.k;
  if (dk === 'ours') { restoreEarly = true; G.rep -= 2; await say('Our own page is back at 10:30. Nobody has proved it clean yet.'); }
  else if (dk === 'off') { bumpUptime(-0.02); G.rep -= 3; await say('Residents can’t pay online for a week. The payments office queue goes round the square.'); }
  else await say(restoreEarly ? 'Northgate’s page is taking payments too. But our own page already came back at 10:30, as the restore card decided.' : 'Within the hour, on a page that is clean by design. Whitlock nods. Directive met, and nobody skimmed for it.', 'Paz Delgado');
  c.directiveBoss = dk;
  const S2 = mkBossStages(picks, restoreEarly);
  await fightStory(S2.s2, 'Paz: Regroup. Same stage, again.');
  await fightStory(S2.s3, 'Paz: Regroup. Same stage, again.');
  const w = mkWindowCalc(chk, picks, restoreEarly);
  c.boss = {window: w.window, affected: w.affected, detect: w.detect, contain: w.contain, again: w.again, startOk: startOk, whoOk: whoOk, restoreEarly: restoreEarly, check: chk, picks: picks};
  G.f.mkBoss = true; G.f.mkScopeDone = true;
  touchCSF('Recover'); unlock('act', 'mfa3p'); unlock('act', 'revokeweb'); unlock('act', 'hostedpay');
  bumpUptime(0.01); track();
  await say('Exposure window: ' + MK_INJECT + ' to containment, ' + mkFmtH(w.window) + (w.again ? ' (including the second stretch after our own page came back early)' : '') + '. About ' + w.affected + ' card payments were made inside it, and Northgate is pulling the declined attempts too (game); anyone who typed a card and gave up before pressing Pay never reached Northgate, so a public notice on the site covers them. Everyone we can identify is being told directly, with what to do: call their bank, watch their statements.', who);
  await say('Legal is handling notification. Every US state has a breach-notification law, and they differ: who they cover (some include government bodies like ours), what data counts, how fast people must be told, and whether the state attorney general must hear too. Card numbers with the code needed to use them are commonly covered. Our merchant agreement adds its own duties, and the card brands may require an independent PCI Forensic Investigator, which is one more reason we preserved the evidence before cleaning. (For comparison, the UK’s ICO expects a notifiable breach within 72 hours; it fined British Airways £20m for theirs.)', who);
  await say('Recover: card entry now runs on Northgate’s hosted page for good (the contract change, brought forward). Nothing we serve runs where residents type card numbers, and our PCI self-assessment should shrink to SAQ A (Northgate’s bank confirms which). The tamper check stays on our page that sends residents there: whoever can change that page can change where it sends them. The agency has named accounts with MFA, and every deploy token and key, including the pipeline’s own, is on a list with an owner and an expiry date. The CSP enforces.', who);
  await evolveCheck();
  await say('That’s Market Square. Next stop: Records Hall.', who);
  await mkSummary();
}

/* ---------- End of district ---------- */
async function mkSummary() {
  await surfaceMissed(true);
  G.f.mkSummary = true;
  const c = MK(), d = c.drills;
  const dl = ['sqli', 'script', 'admin'].map(k => esc(MK_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const b = c.boss;
  const body = '<p class="big">Market Square district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key Badge, Seal Badge, Shield Badge' + (G.f.mkLantern ? ', Lantern Badge' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '. WAF rule review: <b>' + (c.wafScore === null ? '—' : c.wafScore + '%') + '</b>' + (c.wafStats ? ', residents blocked a day <b>' + c.wafStats.res + '</b>' : '') + '. Inventory: <b>' + c.found.length + ' of ' + MK_ASSETS.length + '</b>.</p>' +
    (b ? '<p>Skimming incident: exposure window <b>' + mkFmtH(b.window) + '</b>, card payments exposed <b>' + b.affected + '</b> (game). Start of the window from evidence: <b>' + (b.startOk ? 'yes' : 'corrected') + '</b>. Who was told: <b>' + (b.whoOk ? 'everyone who typed a card in the window' : 'corrected') + '</b>. The councillor’s hour: <b>' + ({hosted: 'met on the hosted page', ours: 'met by bringing back an unproven page', off: 'missed: payments off for a week'}[c.directiveBoss] || '—') + '</b>.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    mkQtSummaryHtml() +
    '<p class="big">Next: Records Hall.</p>';
  Series.markEdition(EDITION.id, {done: true, mailRoom: true, clerksRow: true, marketSquare: true});
  const i = await UI.openModal('End of Market Square', body, [{label: 'Keep exploring Market Square', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
