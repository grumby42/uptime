/* ============================================================
   UPTIME · editions/town-hall/basement-story.js
   Town Hall district 6, the IT Basement (logging, detection engineering, the
   network boundary): state, objectives, interactions, talk, the fieldwork (log
   source coverage, one clock for every log, retention, the firewall rule
   review with deny by default, rule tuning), the licence directive, three
   investigation drills, the Log Analysis and Scanning Dojos, the Basement Board
   (Beacon Badge, Tier 3, Ledger -> Annalist), the boss incident, the Quiet
   Thread suspicion file, scorecard metrics and the end-of-district summary.
   The Front Desk story calls in through small guarded hooks (bmObjective via
   rhObjective, bmTriggers, bmInteract, bmTalk, bmTile, bmEvolveCheck). The
   engine hooks the earlier districts define (alertWeight, alertHost, briefList,
   alertDecorate, editionMetricVals, editionScoreHtml, peekExtra) are wrapped
   here: each wrapper calls the previous version first, then adds the basement.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' IT Basement: MITRE ATT&CK v20 (T1685.005, T1685.006, T1686.002, T1046, T1071.004, T1572, T1571, T1110.001, T1078, T1552; Volt Typhoon G1017; Quiet Thread T1090). ASD’s ACSC with CISA, FBI, NSA and partners, Best practices for event logging and threat detection (August 2024). NIST SP 800-92 (2006) and SP 800-41 Rev. 1 (2009). IETF RFC 5905 (NTPv4) and RFC 8633 (NTP best current practices). OMB M-26-14 (May 2026), which rescinded M-21-31 (US federal agencies only). NIST CSWP 29 (CSF 2.0: PR.PS-04, DE.CM-01, DE.AE-03). Microsoft Learn: Security event 1102 and Eventlog event 1100; Sysinternals Sysmon (event ID 22). Nmap Reference Guide (port states, SYN and connect scans). Apache HTTP Server log files documentation.';
}

/* ---------- State ---------- */
function BM() {
  if (!G.bm) G.bm = {day0: G.day, src: Object.fromEntries(BM_SOURCES.map(s => [s.id, s.on])), skew: 420, ret: 7, rules: null, prec: 14,
    tune: null, drills: {}, dojoL: [false, false, false], dojoS: [false, false, false], directive: null, gap: null, boss: null, file: null, mttd: []};
  return G.bm;
}
function bmOn() { return !!(G && G.f && G.f.bmMet && G.bm); }
function inBasement() { return BM_MAPS.includes(G.map); }
function bmCovPct() { const c = BM(); const tot = BM_SOURCES.reduce((a, s) => a + s.w, 0); return Math.round(BM_SOURCES.filter(s => c.src[s.id]).reduce((a, s) => a + s.w, 0) / tot * 100); }
function bmFwOwnPct() { const r = BM().rules; return r ? r.owned : Math.round(BM_RULES.filter(x => x.owner).length / BM_RULES.length * 100); }
// Mean time to detect (game hours): a model of how long an intrusion goes unseen, from the state of logging (see GAME_NOTES).
function bmMttd() {
  const c = BM();
  return Math.round(4 + 150 * (1 - bmCovPct() / 100) + (c.skew > 60 ? 24 : 0) + (c.prec < 50 ? 12 : 0) + (c.ret < 30 ? 24 : 0));
}
// Full logging in the district the player is in: every source that district needs is collected. (game)
function bmFullHere() {
  const d = BM_MAP_DISTRICT[G.map]; if (!d || !G.bm) return false;
  return BM_DISTRICT_SOURCES[d].every(s => G.bm.src[s]);
}
function bmDays() { const c = BM(); return {R: c.day0, B: c.boss ? c.boss.day : G.day}; }

/* ---------- Engine hooks (wrapping the Records Hall versions) ---------- */
const _bmPrevAlertWeight = alertWeight, _bmPrevAlertHost = alertHost, _bmPrevBriefList = briefList, _bmPrevDecorate = alertDecorate,
  _bmPrevMetricVals = editionMetricVals, _bmPrevScoreHtml = editionScoreHtml, _bmPrevPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _bmPrevAlertWeight(t, w);
  if (THREATS[t].district === 'basement' && !(G.f && G.f.bmMet)) return 0;
  if (G.f.bmMet && inBasement() && BM_HOME.includes(t)) w *= 3;
  return w;
};
alertHost = function () { return (G.f && G.f.bmMet && inBasement()) ? pick(BM_HOSTS) + ' · IT Basement' : _bmPrevAlertHost(); };
briefList = function () { const L = _bmPrevBriefList(); return G.f.bmMet ? L.concat(BM_BRIEFS) : L; };
// Beacon Badge: where every log source a district needs is collected, an intruder is seen sooner, so dwell grows slower. (game)
alertDecorate = function (spec) {
  _bmPrevDecorate(spec);
  if (G.f && G.f.bmBeacon && spec.kind === 'mal' && bmFullHere()) spec.rate = Math.max(5, (spec.rate || 8) - 3);
};
editionMetricVals = function () {
  const v = _bmPrevMetricVals();
  if (!bmOn()) return v;
  const c = BM();
  return Object.assign(v, {bmCov: bmCovPct(), bmSkew: c.skew, bmPrec: c.prec, bmFwOwn: bmFwOwnPct(), bmMttd: bmMttd()});
};
EDITION_METRICS.push(
  {k: 'bmCov', label: 'Log source coverage', unit: '%', higher: true, when: bmOn},
  {k: 'bmSkew', label: 'Largest clock skew from the reference time (seconds)', unit: ' s', higher: false, lower: true, when: bmOn},
  {k: 'bmPrec', label: 'Detection precision (the tuned scan rule)', unit: '%', higher: true, when: bmOn},
  {k: 'bmFwOwn', label: 'Firewall rules with a named owner', unit: '%', higher: true, when: bmOn},
  {k: 'bmMttd', label: 'Mean time to detect, modelled (game hours)', unit: ' h', higher: false, lower: true, when: bmOn}
);
editionScoreHtml = function () {
  let h = _bmPrevScoreHtml();
  if (!bmOn()) return h;
  const c = BM();
  if (G.f.bmDirective) h += '<p class="dir">Directive: SIEM licence cost down 30% this year, without dropping a source detections use. (game)</p>';
  h += '<p>IT Basement: Beacon Badge <b>' + (G.f.bmBeacon ? 'yes' : 'not yet') + '</b> · clocks <b>' + (G.f.bmTime ? 'one NTP source, UTC' : 'unsynchronised') + '</b>' +
    ' · retention <b>' + (c.ret >= 90 ? '90 days searchable, 18 months archived' : c.ret + ' days') + '</b> · firewall default <b>' + (G.f.bmFw ? 'deny, logged' : 'allow') + '</b>' +
    (c.tune ? ' · scan rule alerts a week <b>' + c.tune.left + '</b> (was 14)' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _bmPrevPeekExtra();
  e.bmSummary = !!G.f.bmSummary;
  e.bm = G.bm ? {cov: bmCovPct(), src: G.bm.src, skew: G.bm.skew, ret: G.bm.ret, rules: G.bm.rules, prec: G.bm.prec, tune: G.bm.tune, drills: G.bm.drills,
    dojoL: G.bm.dojoL, dojoS: G.bm.dojoS, directive: G.bm.directive, gap: G.bm.gap, boss: G.bm.boss, file: G.bm.file, mttd: bmMttd()} : null;
  return e;
};
function bmTile(d, ch, x, y) {
  if (ch === 'X' && G.f.rhVault) d.solid = false;                       // the stairs on the plaza open with the Vault Badge
  if (ch === '~' && G.f.bmBeacon && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  if (ch === '@' && G.f.bmTime) d.pal = 'ntpOk';
  if (ch === '#' && G.f.bmCover) d.pal = 'collectorOk';
  if (ch === '%' && G.f.bmFw) d.pal = 'edgefwOk';
  return d;
}

/* ---------- Objective ---------- */
function bmObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'basement', x: x, y: y, district: 'basement'});
  if (!f.bmMet) return at('Next: the IT Basement. The stairs are on the plaza, west of the records office; your Vault Badge opens them.', 14, 7);
  if (!f.bmCover) return at('Fieldwork: logs come from a fraction of systems. Start at the log collector in the server racks.', 3, 1);
  if (!f.bmTime) return at('Fieldwork: the clocks disagree. The clock on the SIEM room wall.', 17, 0);
  if (!f.bmRet) return at('Fieldwork: logs are kept for 7 days. The SIEM console.', 13, 1);
  if (!f.bmFw) return at('Fieldwork: years of firewall rules nobody owns. The rule binder in the firewall room.', 25, 1);
  if (!f.bmTune) return at('Fieldwork: the scan detection fires all day. Lena, in the SIEM room.', 11, 2);
  if (!f.bmNight1) return at('End your shift at your basement desk.', 13, 13);
  if (!f.bmDrill1) return at('Magda has a hole in the logs.', 14, 7);
  if (!f.bmDirective) return at('Audra Finch, the CIO, wants a word about the SIEM bill.', 18, 7);
  if (!f.bmDrill2) return at('Devraj has two timelines that disagree. Firewall room.', 23, 2);
  if (!f.bmNight2) return at('End your shift at your desk.', 13, 13);
  if (!f.bmDrill3) return at('Lena’s new DNS rule fired overnight. SIEM room.', 11, 2);
  if (!f.bmLogDone) {
    if (!f.bmLogMet) return at('(Optional) Train at the Log Analysis Dojo with Quinn.', 9, 11);
    const i = BM().dojoL.findIndex(x => !x);
    return at('(Optional) Log analysis puzzle ' + (i + 1) + ' of 3.', [3, 5, 7][i], 11);
  }
  if (!f.bmScanDone) {
    if (!f.bmScanMet) return at('(Optional) Train at the Scanning Dojo with Soren.', 21, 11);
    const i = BM().dojoS.findIndex(x => !x);
    return at('(Optional) Scanning puzzle ' + (i + 1) + ' of 3.', [23, 25, 27][i], 11);
  }
  if (!f.bmBoard) return at('Take the Basement Board challenge (Hollis Grant, through the east door).', 9, 2, 'bboard');
  if (!f.bmNight3) return at('End your shift at your desk.', 13, 13);
  if (!f.bmBoss) return at('Magda needs you: a server’s log has been wiped.', 14, 7);
  if (!f.bmFile) return at('Rae wants your Unexplained notes as one timeline. Talk to her.', 16, 7);
  return {text: 'IT Basement secured. Next: the Server Room.', done: true, district: 'basement'};
}

/* ---------- Triggers and interactions ---------- */
let bmEarlyWarned = false;
function bmTriggers() {
  if (G.map !== 'basement') return false;
  if (!G.f.rhBoss) {
    if (bmEarlyWarned) return false;
    bmEarlyWarned = true;
    run(async () => { await say('Vault Badge? Then Odile trusts you. But Records Hall isn’t recovered yet. The logs will keep: that’s their job.', 'Magda Petrov'); });
    return true;
  }
  if (!G.f.bmMet) { run(bmArrive); return true; }
  return false;
}
function bmInteract(ch, tx, ty) {
  if (ch === 'X' && G.map === 'hub' && G.f.rhVault) { run(async () => { await say('Stairs down to the IT Basement. Something hums down there.'); }); return true; }
  if (!inBasement()) return false;
  if (ch === '#') { run(bmCollector); return true; }
  if (ch === '@') { run(bmClock); return true; }
  if (ch === '$') { run(bmConsole); return true; }
  if (ch === '&') { run(bmBinder); return true; }
  if (ch === '%') { run(async () => { await say(G.f.bmFw ? 'The edge firewall. It also sits between the town’s inside networks. Default: deny everything not expressly permitted, both ways, and log it.' : 'The edge firewall, between the town and the internet, and between the town’s inside networks. Default rule at the bottom: allow.'); }); return true; }
  if (ch === '*') { run(() => bmLogPuzzle([3, 5, 7].indexOf(tx))); return true; }
  if (ch === '+') { run(() => bmScanPuzzle([23, 25, 27].indexOf(tx))); return true; }
  if (ch === '^') { run(async () => { await say('Basement Board racks: every detection the town runs, its last month of hits, and who answers for it.'); }); return true; }
  if (ch === 'K') { run(async () => { await say('Server racks. Fans, blinking lights, and a cable tray nobody has opened since it was installed.'); }); return true; }
  if (ch === 'Y') { run(bmDesk); return true; }
  return false;
}
async function bmTalk(npc) {
  if (!BM_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.bmMet && npc.map === 'basement') { await say('Magda is the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'magda': await magdaTalk(); break;
    case 'devraj': await devrajTalk(); break;
    case 'lena': await lenaTalk(); break;
    case 'audra': await audraTalk(); break;
    case 'quinn': await quinnTalk(); break;
    case 'soren': await sorenTalk(); break;
    case 'hollis': await bmBoardScript(); break;
    case 'raeb': await raeBasementTalk(); break;
  }
}
async function bmDesk() {
  const f = G.f;
  const ready = (f.bmTune && !f.bmNight1) || (f.bmDrill2 && !f.bmNight2) || (f.bmBoard && !f.bmNight3) || f.bmBoss;
  if (!ready) { await say('Your desk in the basement, under a pipe that ticks. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your basement desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.bmTune && !f.bmNight1) {
    f.bmNight1 = true;
    await say('Day ' + G.day + ', 07:30. Lena’s new “source went quiet” rule fired overnight: FS-02 sent nothing between 01:20 and 02:00. Magda wants you.');
  } else if (f.bmDrill2 && !f.bmNight2) {
    f.bmNight2 = true;
    await say('Day ' + G.day + ', 07:20. Lena’s new DNS detection fired overnight: thousands of long names, one domain. She’s at her console.');
  } else if (f.bmBoard && !f.bmNight3) {
    f.bmNight3 = true;
    await say('Day ' + G.day + ', 06:50. Your phone: Magda. “MGMT-01’s Security log starts at 02:41 with a 1102. Come down.”');
  }
}

/* ---------- Arrival ---------- */
async function bmArrive() {
  const who = 'Magda Petrov', f = G.f;
  BM(); G.bm.day0 = G.day;
  await say('Day ' + G.day + '. The IT Basement: server racks, a firewall room, a SIEM console that never stops scrolling, and a clock on the wall that nobody trusts.');
  await say('You’re the Tier 2 who got Records Hall back? Magda Petrov, IT operations. Everything the town does on a computer passes through this room, or should leave a record here.', who);
  await say('Four problems. We collect logs from a fraction of our systems. The clocks disagree by minutes. We keep logs for seven days. And the firewall has years of rules nobody owns, including one that allows anything to anything.', who);
  await say('And the SIEM fires hundreds of alerts a day, most of them the same three servers doing their jobs. Lena tunes what she can.', who);
  await say('You stay Tier 2 for now. Clear the Basement Board and you’re Tier 3: senior analyst. That means detection engineering: you write the rules other people triage.', who);
  G.targets.bmCov = 90; G.targets.bmSkew = 1; G.targets.bmPrec = 75; G.targets.bmFwOwn = 100; G.targets.bmMttd = 24;
  f.bmMet = true; track();
  touchCSF('Detect');
  await say('New on your scorecard: log source coverage, clock skew, detection precision, firewall rules with an owner, and a modelled mean time to detect. Start (Enter) shows them.', who);
  await say('Start at the log collector, in the racks to the north-west. Find out what it can and can’t answer.', who);
}
async function magdaTalk() {
  const f = G.f, who = 'Magda Petrov';
  if (!f.bmCover) { await say('The collector first, in the racks. What questions can we answer from what we collect?', who); return; }
  if (!f.bmTime || !f.bmRet) { await say('The clock on the SIEM room wall, then the SIEM console: how long we keep things.', who); return; }
  if (!f.bmFw) { await say('Devraj has the rule binder in the firewall room. Bring coffee.', who); return; }
  if (!f.bmTune) { await say('Lena wants help with the scan rule. Hundreds of alerts, and she’s not allowed to switch it off.', who); return; }
  if (!f.bmNight1) { await say('Go home. Tonight the logs go somewhere, and the clocks agree.', who); return; }
  if (!f.bmDrill1) { await bmDrill1(); return; }
  if (!f.bmDirective) { await say('Audra is looking for you. It’s about the SIEM licence. Of course it is.', who); return; }
  if (!f.bmDrill3) { await say('Devraj and Lena both have something for you.', who); return; }
  if (!f.bmBoard) { await say('Hollis runs the Basement Board, through the east door. The Dojos first, if you want them.', who); return; }
  if (!f.bmNight3) { await say('Devraj’s change to narrow R4, the VPN rule, is booked for Friday’s window. Go home.', who); return; }
  if (!f.bmBoss) { await bmBossScript(); return; }
  if (!f.bmFile) { await say('Rae came down. She wants to talk to you, by the corridor.', who); return; }
  await say('Logs that arrive, clocks that agree, rules with owners. The Server Room is next.', who);
  await bmSummary();
}

/* ---------- Fieldwork 1: log source coverage ---------- */
async function bmCollector() {
  const f = G.f, c = BM();
  if (!f.bmMet) { await say('A log collector. Magda should show you around first.'); return; }
  if (f.bmCover) { await say('The log collector: ' + bmCovPct() + '% of the town’s systems send to it now, as events are written. Disk: plenty, and an alert when it isn’t.'); return; }
  const who = 'Lena Mortimer';
  await say('The collector takes logs from identity, the staff laptops’ endpoint tool, the web servers and the backup console. That’s it. ' + bmCovPct() + '% of what we run.', who);
  await say('Every investigation starts with a question. Match each question to the one source that answers it.', who);
  for (const Q of BM_QUESTIONS) {
    const opts = ['vpn', 'laptops', 'dns', 'firewall', 'idp'].map(id => ({label: BM_SOURCES.find(s => s.id === id).name, meta: {good: id === Q.good, id: id}}));
    while (true) {
      const i = await choose(Q.q, opts, {shuffle: true});
      if (opts[i].meta.good) break;
      await say('That source can’t answer it. Which one saw it happen?');
    }
    const s = BM_SOURCES.find(x => x.id === Q.good);
    await say(Q.why + (c.src[s.id] ? ' (We collect it.)' : ' (We don’t collect it.)'));
  }
  const off = BM_SOURCES.filter(s => !c.src[s.id]);
  const goods = ['vpn', 'firewall', 'dns', 'servers'];
  const pool = off.map(s => ({label: s.name, note: s.ask, meta: {good: goods.includes(s.id), id: s.id}}));
  pool.push({label: 'Printer page counts', note: 'How many pages did the second floor print?', meta: {good: false, id: 'printers'}});
  pool.push({label: 'Intranet debug logs', note: 'Why was the lunch menu page slow?', meta: {good: false, id: 'debug'}});
  const items = pool.concat([{label: 'Onboard these four', done: true, meta: {done: true}}]);
  while (true) {
    const sel = await UI.openModal('Log sources: what to collect next',
      '<p>The licence and the collector’s disk cover <b>four</b> more sources this quarter (game). Pick the four that answer the most important questions. The joint guide on event logging led by Australia’s ASD (with CISA, the FBI and the NSA, 2024) lists edge devices such as firewalls, identity and domain management servers, and DNS among its priority log sources.</p>',
      items, {shuffle: true, multi: 4, closable: false, cls: 'drill'});
    const ids = sel.map(i => items[i].meta.id);
    const bad = ids.filter(id => !goods.includes(id));
    if (!bad.length) break;
    await say(bad.includes('printers') || bad.includes('debug') ? 'Page counts and debug logs answer questions nobody asks in an investigation. The edge, identity, DNS and what runs on servers come first.' : 'Close. The VPN, the firewall, DNS and server process creation answer the questions every case so far has asked.');
  }
  goods.forEach(id => { c.src[id] = true; });
  G.f.bmCover = true; unlock('act', 'coverage'); unlock('fact', 'asdlog'); unlock('fact', 'csflog'); touchCSF('Protect'); touchCSF('Identify'); track();
  await say('Onboarding: VPN-01 (with the 14 days of log it still held), the edge firewall (traffic and its configuration audit), DNS-01’s query log and process creation on every server. Forwarded as events are written, not once a day. Coverage ' + bmCovPct() + '%.', who);
  await say('Still not collected: the web proxy and the building-management controllers. Next quarter. Now, the clocks: if they disagree, joining these sources gives you nonsense.', who);
}

/* ---------- Fieldwork 2: one clock for every log ---------- */
async function bmClock() {
  const f = G.f, c = BM();
  if (!f.bmMet) { await say('A clock on the wall. It says 10:42. Your phone says 10:39.'); return; }
  if (!f.bmCover) { await say('A clock on the wall, three minutes fast. Magda wants the log collector looked at first.'); return; }
  if (f.bmTime) { await say('The wall clock now reads NTP-01. Every device that reports in is within a second of it' + (f.bmDrill2 ? ', MGMT-01 included.' : '.')); return; }
  const rows = BM_CLOCKS.map(k => '<tr><td>' + esc(k.host) + '</td><td>' + (k.off > 0 ? '+' : '') + k.off + ' s</td><td>' + esc(k.src) + '</td></tr>').join('');
  await UI.openModal('Clocks against a reference', '<p>Each device’s offset from a reference time server, right now (game):</p><table class="sc"><tr><th>Device</th><th>Offset</th><th>Time source</th></tr>' + rows + '</table>' +
    '<p>FS-02 is seven minutes slow. A timeline that joins FS-02 and the firewall puts events in the wrong order. NIST SP 800-92 makes the same point: if a host’s clock is inaccurate, the timestamps in its logs are too.</p>', [{label: 'Fix it', meta: {good: true}}], {closable: false, cls: 'drill'});
  while (true) {
    const i = await choose('How do you make the clocks agree?', [
      {label: 'Two internal NTP servers, each fed by four or more independent traceable sources; every device syncs to both; logs in UTC with ISO 8601 timestamps; alert on drift, lost sync, or the two disagreeing', meta: {good: true}},
      {label: 'Set every clock by hand from a trusted reference on the first of each month, checked by a second person, so nothing depends on a network time service an attacker could spoof'},
      {label: 'Leave each device in local time, as staff read it, and let the SIEM convert every source to one zone when it parses it'},
      {label: 'Point every device straight at a public internet time server, so each one syncs to a traceable source and there is nothing internal to maintain'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Clocks drift between settings, and a month is a long time to be minutes out.');
    else if (i === 2) await say('Then every analyst converts time zones, and daylight-saving changes, at three in the morning. The ASD-led guide calls UTC the preferred standard and recommends ISO 8601.');
    else await say('Then every device needs a way out to the internet, through the firewall, and the ones in closed segments drift. Two internal servers, synced outward, serve everyone.');
  }
  c.skew = 0.4;
  G.f.bmTime = true; unlock('act', 'timesync'); unlock('fact', 'sp80092'); unlock('fact', 'rfc5905'); touchCSF('Protect'); track();
  await say('NTP-01 and NTP-02 are up (NTP version 4, RFC 5905), each checking four outside sources, so one bad source is outvoted; RFC 8633 says at least four. A device with only our two can’t tell which is wrong if they disagree, so we alert when they do. Every device that reports in now sits within half a second of them. Largest skew: 0.4 s. (game)', 'Devraj Sood');
  await say('“Every device that reports in.” Remember that. Next: how long we keep any of this. The SIEM console.', 'Lena Mortimer');
}

/* ---------- Fieldwork 3: retention ---------- */
async function bmConsole() {
  const f = G.f, c = BM();
  if (!f.bmMet) { await say('A SIEM console. Magda should show you around first.'); return; }
  if (!f.bmTime) { await say('The SIEM console. Collector and clocks first: what you keep is only useful if it arrives, in the right order.'); return; }
  if (!f.bmRet) { await bmRetention(); return; }
  if (f.bmBoss && !f.bmFile) { await say('Rae wants the timeline from you in person. She’s in the corridor.'); return; }
  await say('The SIEM: ' + bmCovPct() + '% coverage, everything in UTC, ' + (c.ret >= 90 ? '90 days searchable and 18 months in the archive' : c.ret + ' days kept') + '. The scan rule raised ' + (c.tune ? c.tune.left : 14) + ' alerts last week.');
}
async function bmRetention() {
  const c = BM();
  await say('Seven days. Anything older rolls off. It was the licence default, and nobody changed it.', 'Lena Mortimer');
  while (true) {
    const i = await choose('How long should the town keep its logs?', [
      {label: 'From a risk assessment with the owners and legal: 90 days searchable, 18 months in a cheap archive we can still search (game numbers), longer if a records law says so, reviewed yearly', meta: {good: true}},
      {label: '7 days is plenty: alerts fire within minutes, and anything worth keeping is exported into the case file when an alert fires'},
      {label: 'Everything searchable in the SIEM, forever, so no investigation ever hits a wall, nobody has to decide what to drop, and nothing an intruder did is ever out of reach'},
      {label: 'Copy the US federal tiers in OMB memo M-21-31: a published government standard is easier to defend to the council than numbers of our own, and auditors already know how to check it line by line'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Alerts fire on what you thought to detect. Intrusions are often found weeks or months later, and then you need the logs from when they arrived. The ASD-led guide notes some incidents take up to 18 months to discover.');
    else if (i === 2) await say('Searchable storage is the expensive kind. Keep what investigations use searchable, and the rest archived where it costs little and can still be searched when you need it.');
    else await say('M-21-31 was rescinded on 22 May 2026 by OMB memo M-26-14, and both apply to US federal agencies, not towns. M-26-14 asks agencies for logs searchable for 6 months and retrievable for a year: a useful comparison, not a rule for us. Decide from our own risks.');
  }
  c.ret = 90;
  G.f.bmRet = true; unlock('act', 'retention'); unlock('fact', 'm2614'); touchCSF('Govern'); track();
  await say('Ninety days searchable, eighteen months archived. Finance will grumble about the archive; it’s cheap. Next: the firewall. Devraj is guarding the rule binder.', 'Lena Mortimer');
}

/* ---------- Fieldwork 4: the firewall rule review ---------- */
async function bmBinder() {
  const f = G.f;
  if (!f.bmMet) { await say('A rule binder. Magda should show you around first.'); return; }
  if (!f.bmRet) { await say('The firewall rule binder, thick as a phone book. Logs, clocks and retention first: you’ll want the firewall’s traffic log in the SIEM next to its hit counters to review it.'); return; }
  if (!f.bmFw) { await bmFwReview(); return; }
  await say('The rule binder: ' + bmFwOwnPct() + '% of rules with a named owner, a reason and an expiry for anything temporary. The last line: deny everything else, both ways, and log it.');
}
async function devrajTalk() {
  const f = G.f, who = 'Devraj Sood';
  if (!f.bmFw) { await say(f.bmRet ? 'The binder’s on the shelf. Eight rules, and I can explain five of them.' : 'Lena’s doing logs first. Then the binder, and I’ll explain what I can.', who); return; }
  if (f.bmDirective && !f.bmDrill2) { await bmDrill2(); return; }
  if (f.bmBoss) { await say('R4 is four services wide now, not “any”. It took an intruder to get the change window moved. Never again.', who); return; }
  await say('Every change through a ticket, every rule with an owner. R4, the VPN rule, gets narrowed in Friday’s window.', who);
}
async function bmFwReview() {
  const who = 'Devraj Sood', c = BM();
  await say('Eight rules, at the top of a list nobody reads. The firewall keeps its own hit counter for each rule, and ninety days of its traffic log on the box; since this morning that log reaches the SIEM too. Owner, reason, hits: let’s go through them.', who);
  for (const r of BM_RULES) {
    const body = '<div class="card"><b>' + esc(r.id) + ': ' + esc(r.text) + '</b><br>Owner: ' + esc(r.owner || 'nobody') + '<br>Reason on file: ' + esc(r.why) + '<br>Hits, last 90 days: ' + esc(r.hits) + '</div>';
    const keys = ['keep', 'narrow', 'remove', 'replace'];
    const items = keys.map(k => ({label: BM_RULE_ACTS[k].label, meta: {good: k === r.good, k: k}}));
    while (true) {
      const i = await UI.openModal('Rule review · ' + r.id, body, items, {shuffle: true, closable: false, cls: 'drill'});
      const k = items[i].meta.k;
      if (k === r.good) break;
      if (k === 'remove' && r.good === 'replace') await say('412 hits in 90 days: something uses it. Delete it blind and you break that, and you never learn what it was.');
      else if (k === 'remove') await say('It has an owner and real traffic. Removing it breaks something people need.');
      else if (k === 'keep' && !r.owner) await say('Nobody can say why it exists. A rule without an owner is a door nobody watches.');
      else if (k === 'keep') await say('An owner, yes. But “any service” is far more than anyone needs.');
      else if (k === 'narrow' && !r.owner) await say('Narrow it for whom? Nobody owns it.');
      else await say('Look at the owner, the reason and the hits again.');
    }
    await say(BM_RULE_ACTS[r.good].why);
    if (r.id === 'R3') await bmQtAnyAny();
    if (r.id === 'R4') await say('Change CHG-6031 raised: VPN users get the four services they actually use. Booked for Friday’s maintenance window; Magda signed off on carrying the risk until then. (game)', who);
  }
  while (true) {
    const i = await choose('The last rule, at the bottom of the list, is “allow everything else”. What replaces it?', [
      {label: 'Deny everything not expressly permitted, inbound and outbound, and log the denials', meta: {good: true}},
      {label: 'Block everything inbound, allow everything outbound: staff need the internet, and the proxy already inspects their web traffic on the way out'},
      {label: 'Leave it: the rules above already allow only what each owner asked for, so the last line never matches anything that matters'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Outbound is how stolen data and command channels leave. NIST SP 800-41 says firewalls should block all inbound and outbound traffic that hasn’t been expressly permitted. R2 already permits staff browsing.');
    else await say('Then anything the rules above don’t mention is allowed. That’s how R3 lived for seven years.');
  }
  c.rules = {owned: 100, removed: ['R6', 'R7', 'R3'], narrowed: ['R4'], defaultDeny: true};
  G.f.bmFw = true; unlock('act', 'fwreview'); unlock('act', 'defaultdeny'); unlock('fact', 'sp80041'); touchCSF('Protect'); track();
  await say('R3 is replaced by two narrow rules with owners (printers to the print server; the badge reader to the directory). R6 and R7 are gone. Default deny, logged. Every rule left has an owner. (game)', who);
  await say('The closet router’s 03:09 connections are dropped and logged now. I told Rae before R3 went: blocking something nobody understands can warn whoever is behind it. Her call was to close it anyway, because an any-to-any rule is worse, and to watch the denials. Tomas has had that router on his replacement list for a year.', who);
  await say('One more: Lena’s scan rule. She’s in the SIEM room, and she has a week of alerts for you.', 'Magda Petrov');
}

/* ---------- Fieldwork 5: rule tuning (the mini-game) ---------- */
function bmTuneEval(applied) {
  const fires = BM_WEEK.filter(a => !BM_TUNES.some(t => applied.includes(t.k) && t.hides(a)));
  const fpLeft = fires.filter(a => a.truth === 'fp').length, realLeft = fires.filter(a => a.truth === 'real').length;
  const fpTotal = BM_WEEK.filter(a => a.truth === 'fp').length, realTotal = BM_WEEK.filter(a => a.truth === 'real').length;
  const triagedReal = fires.filter(a => /^malicious/.test(a.triage)).length;
  return {fires: fires, left: fires.length, fpRemoved: fpTotal - fpLeft, fpTotal: fpTotal, realKept: realLeft, realTotal: realTotal,
    prec: fires.length ? Math.round(realLeft / fires.length * 100) : null, recall: Math.round(realLeft / realTotal * 100),
    precAsTriaged: fires.length ? Math.round(triagedReal / fires.length * 100) : null, hidesReal: realLeft < realTotal};
}
async function lenaTalk() {
  const f = G.f, who = 'Lena Mortimer';
  if (!f.bmCover) { await say('The collector, in the racks. I’ll meet you there.', who); return; }
  if (!f.bmFw) { await say('Clocks, retention, then Devraj’s binder. Then I have a week of alerts for you.', who); return; }
  if (!f.bmTune) { await bmTuning(); return; }
  if (f.bmDrill2 && f.bmNight2 && !f.bmDrill3) { await bmDrill3(); return; }
  if (f.bmBoard) { await say('You write rules now too. Remember: every exclusion gets a reason, an owner and an expiry. And replay the rule against the attacks you already know about.', who); return; }
  await say('Precision I can measure from the queue. Recall I can only measure against attacks we already know about. So we replay them.', who);
}
async function bmTuning() {
  const who = 'Lena Mortimer', c = BM();
  await say('The scan rule: “' + BM_TUNE_RULE + '.” Fourteen alerts last week. I’m not allowed to switch it off, and I shouldn’t be.', who);
  await say('Here’s the week, with what the on-call analyst decided for each. Tune it: make it quieter without making it blind. (game)', who);
  const applied = [];
  while (true) {
    const ev = bmTuneEval(applied);
    const rows = BM_WEEK.map(a => { const on = ev.fires.includes(a); return '<tr><td>' + esc(a.when) + '</td><td>' + esc(a.host) + '</td><td>' + a.n + '</td><td>' + esc(a.triage) + '</td><td>' + (on ? 'fires' : '<i>suppressed</i>') + '</td></tr>'; }).join('');
    const body = '<p><b>Rule:</b> ' + esc(BM_TUNE_RULE) + '</p><table class="sc"><tr><th>When</th><th>Host</th><th>Hosts touched</th><th>Triage last week</th><th>Now</th></tr>' + rows + '</table>' +
      '<p>Alerts a week: <b>' + ev.left + '</b> (was 14) · false positives removed (as triaged): <b>' + BM_WEEK.filter(a => /^false positive/.test(a.triage) && !ev.fires.includes(a)).length + ' of 12</b> · precision as triaged: <b>' + (ev.precAsTriaged === null ? '—' : ev.precAsTriaged + '%') + '</b></p>' +
      '<p class="small">Precision: of the alerts a rule raises, the share that are real. Recall: of the real attacks, the share it raises. (Changes: ' + (applied.length ? applied.length + ' applied' : 'none yet') + '.)</p>';
    const allGood = ['vs', 'bk', 'pm'].every(k => applied.includes(k)) && !applied.some(k => !BM_TUNES.find(t => t.k === k).good);
    const items = BM_TUNES.map(t => ({label: t.label, note: applied.includes(t.k) ? 'applied: choose to undo' : 'not applied', meta: {k: t.k, good: t.good ? !applied.includes(t.k) : applied.includes(t.k)}}));
    items.push({label: 'Ship this tuning', done: true, meta: {done: true, good: allGood}});
    const i = await UI.openModal('Rule tuning · the scan rule', body, items, {shuffle: true, closable: false, cls: 'drill'});
    const m = items[i].meta;
    if (m.done) {
      if (!applied.length) { await say('Fourteen alerts a week, twelve of them the same three servers. Tune something first.'); continue; }
      break;
    }
    if (m.k === 'off') { await say('Never switch a detection off to quiet it. Suppress what you know is harmless, narrowly, with a reason and an expiry, and keep the rule looking at everything else.', who); continue; }
    const j = applied.indexOf(m.k);
    if (j >= 0) applied.splice(j, 1); else applied.push(m.k);
  }
  while (true) {
    const i = await choose('How do you record the exclusions?', [
      {label: 'Each one in the rule’s change history, with the reason, an owner and an expiry date, reviewed when it expires', meta: {good: true}},
      {label: 'No need: each exclusion names its host and window in the rule itself, which is documentation enough for anyone who reads the rule'},
      {label: 'In my own case notes, with the reason for each, so I can answer for every exclusion when anyone asks about it later'}], {shuffle: true});
    if (i === 0) break;
    await say('In a year nobody will remember why VS-01 is excluded, or whether it still should be. An exclusion without a reason and an expiry becomes a blind spot nobody owns.');
  }
  const ev = bmTuneEval(applied);
  let reopened = false;
  if (ev.fires.some(a => a.id === 'mg')) {
    while (true) {
      const i = await choose('One alert you kept, MGMT-01 at Sat 02:10, was closed last week as “IT admin activity”, with no ticket. What now?', [
        {label: 'Reopen it: no ticket, no “benign”. Ask IT who ran it and why', meta: {good: true, k: 'reopen'}},
        {label: 'Leave it closed: the on-call analyst triaged it at the time, with more context than we have a week later', meta: {k: 'leave'}}], {shuffle: true});
      if (i === 0) { reopened = true; break; }
      await say('A triage label is someone’s guess on a busy night. “Admin activity” with no ticket and no named admin hasn’t been checked.');
    }
    await say('Reopened. IT doesn’t know who ran it either; MGMT-01 goes on the review list, behind the patch backlog. (game)', who);
  }
  c.tune = {applied: applied.slice(), left: ev.left, fpRemoved: ev.fpRemoved, realKept: ev.realKept, hidden: ev.hidesReal, reopened: reopened};
  c.prec = ev.prec === null ? 0 : ev.prec;
  // An over-broad exclusion silently hides a real attack: nobody can see it now; incident review finds it later.
  if (ev.hidesReal) G.m.missed++;
  G.f.bmTune = true; unlock('act', 'tuning'); unlock('act', 'precision'); touchCSF('Detect'); track();
  const score = Math.round(ev.fpRemoved / ev.fpTotal * 50 + (ev.hidesReal ? 0 : 50));
  await UI.openModal('Tuning shipped', '<p class="big">' + ev.left + ' alerts a week (was 14)</p>' +
    '<p>False positives removed: <b>' + ev.fpRemoved + ' of ' + ev.fpTotal + '</b>. Precision of what still fires, as last week’s triage labelled it: <b>' + (ev.precAsTriaged === null ? '—' : ev.precAsTriaged + '%') + '</b>.</p>' +
    '<p>What you can’t see from here is recall: whether a real attack is hiding under an exclusion. A missed attack raises no alert to count. Lena replays the rule against attacks the town already knows about; anything else, incident review finds later.</p>' +
    '<p class="small">Tuning score ' + (ev.hidesReal ? '(not shown until incident review)' : score + ' / 100') + ' (game). Suppress narrowly (one host, one port, one window), with a reason, an owner and an expiry; never by switching the rule off.</p>', [{label: 'Done', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say('That’s the fieldwork. Your desk is by the stairs. Tonight, logs arrive from twice as many systems, and the clocks agree.', 'Magda Petrov');
}

/* ---------- The directive (game): cut the SIEM licence by dropping "noisy" sources ---------- */
async function audraTalk() {
  const who = 'Audra Finch', c = BM(), f = G.f;
  if (f.bmDirective) { await say('Thirty percent, and DNS stays. I can take that to the council.', who); return; }
  await say('Audra Finch, CIO. The SIEM is priced by how much we send it, and you’ve just doubled that. The council wants the licence down thirty percent this year. (game)', who);
  await say('DNS is forty percent of the volume. Drop it. Nobody reads DNS logs.', who);
  while (true) {
    const i = await choose('How do you cut the SIEM licence by 30%?', [
      {label: 'Keep DNS: raw log to the archive, to the SIEM what detections use; drop debug logs; total up repeated backup flows', meta: {good: true, k: 'tier'}},
      {label: 'Drop DNS: it’s 40% of the volume and nobody has searched it once since we onboarded it; the endpoint tool already sees which program made each connection, and the firewall already sees where every one of them went', meta: {k: 'dns'}},
      {label: 'Drop the firewall’s traffic log and keep only its configuration audit: endpoint and DNS logs show the same connections from the inside', meta: {k: 'fw'}},
      {label: 'Keep a random 10% of every source: it cuts the bill by far more than 30%, and every source still shows its trends and baselines', meta: {k: 'sample'}}], {shuffle: true});
    if (i === 0) { c.directive = 'tier'; break; }
    if (i === 1) await say('DNS is how you see a command channel, a phishing domain or a tunnel, often first. The ASD-led guide puts DNS on its priority list. Without it, “which hosts asked for this domain?” has no answer.');
    else if (i === 2) await say('Edge devices such as firewalls are on the same list. The traffic log is how you know what crossed the boundary: endpoint logs miss every device without an agent, and DNS logs miss every connection made straight to an address.');
    else await say('Sampling keeps the shape and loses the one event that matters. A 1102, or the only lookup of a bad domain, is one line.');
  }
  G.f.bmDirective = true; touchCSF('Govern'); track();
  await say('Archive tier for the raw logs, the SIEM for what we search. Thirty percent. Fine.', who);
  await say('(Cost and visibility pull against each other. Cut volume nobody queries, tier what you must keep, and never drop the sources that answer “who, where, when”.)');
}

/* ---------- Drills ---------- */
async function bmDrill(key) {
  const c = BM();
  const raw = JSON.stringify(BM_DRILLS[key]).replace(/\{D-12\}/g, String(Math.max(1, G.day - 12))).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day));
  const D = JSON.parse(raw);
  const r = await doDrill(D);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  return r;
}
async function bmDrill1() {
  const who = 'Magda Petrov';
  await say('FS-02 went quiet in the SIEM for forty minutes last night. If someone cleared its logs, I want to know now. If not, I want to know why it went quiet.', who);
  const r = await bmDrill('gap');
  G.f.bmDrill1 = true; unlock('fact', 'ev1102'); touchCSF('Detect');
  await say(r.verdictOk ? 'The collector, not FS-02. Lena’s added an alert on its disk and queue, and we pulled the forty minutes back from the servers.' : 'Lena checked: FS-02’s own log has the forty minutes and no 1102, and the collector dropped every source when its disk filled. Disk alert added.', who);
  await say('Audra’s been asking for you. The SIEM bill came in.', who);
}
async function bmDrill2() {
  const who = 'Devraj Sood', c = BM();
  await say('My change review. The firewall says I changed R5 at 14:03. MGMT-01 says I signed in at 14:10. I know what I did. Prove it.', who);
  c.skew = 630; track();   // MGMT-01, measured during the drill: the NTP fix never reached it
  const r = await bmDrill('clocks');
  c.skew = 0.4;
  G.f.bmDrill2 = true; unlock('act', 'clockcheck'); touchCSF('Detect'); track();
  await say(r.verdictOk ? 'Ten and a half minutes fast. The NTP fix never reached MGMT-01: the management network can’t get to NTP-01. It can now, and it alerts if it drifts.' : 'Lena lined it up on one connection: MGMT-01 was ten and a half minutes fast. The NTP fix never reached it. Fixed now.', who);
  await say('“Every device that reports in.” Measure the fix, don’t assume it.', 'Lena Mortimer');
}
async function bmDrill3() {
  const who = 'Lena Mortimer';
  await say('My new DNS rule fired. Nine thousand long names, one domain, one night. Tunnel, or some vendor being weird?', who);
  const r = await bmDrill('dns');
  G.f.bmDrill3 = true; unlock('fact', 'sysmon22'); unlock('act', 'dnscheck'); touchCSF('Respond');
  BM().mttd.push(6);
  await say(r.verdictOk ? 'PL-WS-07 is isolated, the domain is sinkholed, and the DNS logs say nobody else has asked for it since we started keeping them. Audra wanted to drop those logs yesterday.' : 'The program on PL-WS-07, not the security agent: Devraj traced it. Isolated, sinkholed, and the DNS logs say nobody else has asked for it since we started keeping them.', who);
}

/* ---------- Dojos ---------- */
async function quinnTalk() {
  const who = 'Quinn Adair', f = G.f;
  if (!f.bmLogMet) {
    f.bmLogMet = true;
    await say('Log Analysis Dojo. National Cyber League-style puzzles: reading what a log line actually says, and nothing more.', who);
    await say('Three terminals: one web log line, field by field; one timeline from three clocks; and guessing versus spraying. Solve all three and your log tool levels up.', who);
    return;
  }
  if (f.bmLogDone) { await say('Fields, offsets, patterns. And never trust a user agent.', who); return; }
  await say('Puzzles solved: ' + BM().dojoL.filter(Boolean).length + ' of 3. Terminals to my left.', who);
}
async function sorenTalk() {
  const who = 'Soren Vale', f = G.f;
  if (!f.bmScanMet) {
    f.bmScanMet = true;
    await say('Scanning Dojo. National Cyber League-style: what a scan shows, what it doesn’t, and when you’re allowed to run one.', who);
    await say('Three terminals: SYN versus connect scans; open, closed and filtered; and scope. Solve all three and your network tool levels up.', who);
    return;
  }
  if (f.bmScanDone) { await say('Half-open, three states, and written permission. Always written.', who); return; }
  await say('Puzzles solved: ' + BM().dojoS.filter(Boolean).length + ' of 3. Terminals to my right.', who);
}
async function bmDojoPuzzle(set, i, metFlag, title) {
  const P = set === 'L' ? BM_LOG_DOJO : BM_SCAN_DOJO, c = BM(), solved = set === 'L' ? c.dojoL : c.dojoS;
  if (!G.f[metFlag]) { await say('A practice terminal. Talk to the coach first.'); return false; }
  const p = P[i];
  if (solved[i]) { await say('Solved. ' + p.explain); return false; }
  while (true) {
    const k = await UI.openModal(title + ' · ' + p.title, '<pre class="art">' + esc(p.art) + '</pre><p><b>' + esc(p.q) + '</b></p>', p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true, closable: false, cls: 'drill'});
    if (k === p.good) break;
    await say('Not quite. Read it again, one field at a time.');
  }
  await say('Correct. ' + p.explain);
  solved[i] = true;
  return solved.every(Boolean);
}
async function bmLogPuzzle(i) {
  const done = await bmDojoPuzzle('L', i, 'bmLogMet', 'Log analysis');
  if (BM().dojoL[i]) { unlock('fact', i === 0 ? 'csflog' : 'asdlog'); if (i === 2) unlock('tech', 'T1110.001'); touchCSF('Detect'); }
  if (!done || G.f.bmLogDone) return;
  G.f.bmLogDone = true;
  const t = G.party.find(p => TOOLS[p.id].cls === 'logging');
  if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Quinn Adair'); }
  await evolveCheck();
}
async function bmScanPuzzle(i) {
  const done = await bmDojoPuzzle('S', i, 'bmScanMet', 'Scanning');
  if (BM().dojoS[i]) { unlock('fact', 'nmap'); if (i === 2) unlock('act', 'scanscope'); touchCSF('Identify'); }
  if (!done || G.f.bmScanDone) return;
  G.f.bmScanDone = true; unlock('tech', 'T1046');
  const t = G.party.find(p => TOOLS[p.id].cls === 'network');
  if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Soren Vale'); }
  else await say('All three. You know what a scan can and can’t tell you. Most people never ask.', 'Soren Vale');
  await evolveCheck();
}

/* ---------- Evolution: Ledger -> Annalist (at the Basement Board) ---------- */
async function bmEvolveCheck() {
  if (!G.f || !G.f.bmBoard) return;
  const t = G.party.find(p => p.id === 'ledger');
  if (!t) return;
  t.id = 'annalist'; t.lvl = Math.max(t.lvl, 7); touchCSF('Detect');
  await say('Ledger is evolving! Ledger learns to keep every record in one clock’s order, and to write the rules that read them → Annalist. New ability: Replay the rule.');
}

/* ---------- Basement Board ---------- */
async function bmBoardScript() {
  const who = 'Hollis Grant', f = G.f, c = BM();
  if (f.bmBoard) { await say('The Beacon Badge means the lights stay on where you can see. Keep looking where you can’t.', who); return; }
  if (!f.bmDrill3) { await say('The Basement Board is for analysts who have worked a few real cases down here. Finish with Magda’s team first.', who); return; }
  await say('Hollis Grant, detection lead. Intruders want two things from this room: to vanish from your logs, and to change your doors. Here you meet them.', who);
  await say('Three rounds: a log that shrinks, a rule nobody asked for, and whispers in the DNS. Ready?', who);
  for (const s of BM_BOARD_SPECS()) await fightStory(s, 'Hollis: Again. What do the records you still have say?');
  f.bmBoard = true; f.bmBeacon = true;
  G.rank = 'Tier 3 senior analyst'; G.focusMax = Math.max(G.focusMax, 46); G.focus = G.focusMax;
  unlock('tech', 'T1685.006'); unlock('tech', 'T1686.002'); unlock('tech', 'T1071.004');
  await say('You cleared the Basement Board. This is the Beacon Badge.', who);
  const opts = [
    {label: 'The building-management controllers: the Front Desk district’s last gap', meta: {good: true, id: 'bms'}},
    {label: 'The web proxy: Clerks’ Row’s last gap', meta: {good: true, id: 'proxy'}}];
  const i = await choose('Its power: close one log-source gap, town-wide, today. Which?', opts, {shuffle: true});
  c.gap = opts[i].meta.id; c.src[c.gap] = true; track();
  await say('Collected from today. Where a district’s every source is collected, an intruder is seen sooner: dwell grows slower there. And the cable trays nobody logged get catalogued, so fewer alerts trip there. (game)', who);
  await say('Rank up: Tier 2 → Tier 3 senior analyst. New responsibility: detection engineering. You write the rules other people triage, and you answer for their precision, and for what they miss.');
  touchCSF('Detect');
  await evolveCheck();
}

/* ---------- Boss: a log that starts at 02:41 (game-original) ---------- */
function bmBossStages(picks, t) {
  const ev0 = picks.includes('preserve') ? 20 : 0;
  const hidden = !!(t && t.hidden), reopened = !!(t && t.reopened);
  return {
    s1: {kind: 'mal', threat: 'scrub', tech: 'T1685.005', tags: ['logs', 'host'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('timeline') ? 9 : 14, dwell0: 20,
      title: 'Stage 1: a log that starts at 02:41', host: 'MGMT-01 · management server', enemy: {spr: 'scrub', pal: 'scrub'},
      clues: ['MGMT-01’s Security log starts at 02:41 with event 1102: cleared by svc-vpnldap.', 'The collector holds MGMT-01’s events up to 02:40:52. Forwarded as they were written, they survived the clearing: svc-vpnldap signed in at 02:20 over remote desktop from 10.20.200.14, an address in the VPN pool.', 'svc-vpnldap is the account VPN-01 uses to look users up in the directory: it has no reason to sign in anywhere. The directory’s sign-in log shows its first ever sign-in last Saturday at 02:04, to MGMT-01, and more on the nights since, always after 02:00. Nobody had a rule for it. Its password lives in the appliance’s settings.'],
      truth: 'Clear Windows Event Logs (T1685.005), to hide the session. The forwarded copies and the synchronised clocks put it back in order. Signing in with the appliance’s service account is Valid Accounts (T1078).',
      resp: [{label: 'Preserve the collector’s copies and MGMT-01’s disk and memory; isolate MGMT-01, powered; disable svc-vpnldap, revoke its sessions, and tell leadership the VPN is down', good: true},
             {label: 'Restore MGMT-01’s Security log from last night’s backup so the record is whole again, then close: the forwarded copies already show the 02:20 session', good: false, why: 'Last night’s backup predates tonight’s session, so it can’t show it, and the intruder still has the account. (A copy read in the lab is still useful: MGMT-01 has been theirs since last Saturday.)'},
             {label: 'Reimage MGMT-01 now from the golden image and put it back in service: the collector already holds every event it forwarded, so nothing on its disk is still needed for the case', good: false, disrupt: 1, why: 'Preserve first: the disk and memory are the evidence of what they did.'}],
      chain: [{at: 40, text: 'svc-vpnldap opens a second remote-desktop session.'}, {at: 75, text: 'Another server’s Security log is cleared.'}]},
    s2: {kind: 'mal', threat: 'hinge', tech: 'T1686.002', tags: ['edge'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('rule') ? 8 : 13, dwell0: picks.includes('rule') ? 10 : 40,
      title: 'Stage 2: a way out, and a way in', host: 'FW-EDGE · edge firewall', enemy: {spr: 'hinge', pal: 'hinge'},
      clues: ['VPN-01’s own log, which the appliance keeps for 14 days before it rolls over; the fieldwork copied what it held when forwarding began: at 01:52 on the Saturday before you came down, a crash in its web interface, then an admin session nobody started. (game)', 'Last night at 02:55 a rule appeared at the top of the edge firewall: VPN-01 → any outside address, TCP 443. Made with fw-svc-vpn, the firewall account the VPN integration uses, from VPN-01’s own address. No ticket.', 'Through it, 600 MB left between 03:01 and 03:20, relayed by VPN-01: the inside flows show a session from the VPN pool to MGMT-01, allowed by R4, carrying 600 MB out of MGMT-01, and the edge log shows VPN-01 sending the same 600 MB to 203.0.113.50. R4, “VPN pool → internal network, ANY”, whose narrowing was booked for Friday, was the way in.'],
      truth: 'Modifying a network device firewall (T1686.002): the intruder opened its own way out. The way in was a rule far broader than anyone needed.',
      resp: [{label: 'Delete the new rule, narrow R4 today by emergency change, isolate and image VPN-01, then rebuild it per the vendor’s advisory; rotate what it stored, reset its users since Saturday, block 203.0.113.50', good: true},
             {label: 'Delete the new rule, block 203.0.113.50 at the edge and close: default deny already stops anything else going out, and R4’s narrowing is booked for Friday', good: false, why: 'VPN-01 is still the intruder’s, and R4 still lets the VPN pool reach everything.'},
             {label: 'Set every firewall rule to deny until morning, VPN included, so nothing moves in or out while we work out what VPN-01 did, then restore the rules one at a time from the reviewed binder, with owners signing each one back on', good: false, disrupt: 2, why: 'That stops the town, not the intruder, who is already inside.'}],
      chain: [{at: 60, text: 'A second outbound rule appears.'}]},
    s3: {kind: 'mal', threat: 'sweep', tech: 'T1046', tags: ['recon'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('hunt') ? 8 : 14, dwell0: Math.max(0, (picks.includes('hunt') ? 10 : 35) + (hidden ? 15 : 0) - (reopened ? 5 : 0)),
      title: 'Stage 3: the same behaviour, elsewhere', host: 'APP-02 · application server', enemy: {spr: 'sweep', pal: 'sweep'},
      clues: [hidden ? 'The scan detection stayed silent tonight: MGMT-01 is inside an exclusion you shipped when you tuned the rule. The rule saw everything; your exclusion hid it.' : 'The tuned scan detection fired at 03:24: MGMT-01 touched 52 hosts on TCP 445 and 3389 in five minutes. It sat in the queue until morning: nobody is on call for the SIEM after midnight. (game)',
        'Last week’s alert from MGMT-01 at Sat 02:10, closed as “IT admin activity” with no ticket, was this intruder’s first look around.' + (reopened ? ' Your reopened ticket had MGMT-01 on tomorrow’s review list.' : ' Nobody had reopened it.'),
        'The hunt (event 1102 and svc-vpnldap sign-ins, on every server) finds one more: svc-vpnldap signed in to APP-02 at 03:29, and APP-02’s Security log was cleared at 03:31.'],
      truth: 'Network Service Discovery (T1046): mapping what the stolen account could reach. Hunting for the same behaviour found the second server.',
      resp: [{label: 'Isolate APP-02 too, preserve its disk, scope what svc-vpnldap touched on both servers, and keep hunting until no server shows the pattern', good: true},
             {label: 'Close: svc-vpnldap is disabled and MGMT-01 isolated, so whatever the scan of 52 hosts found, the intruder can no longer use it', good: false, why: 'It found APP-02.'},
             {label: 'Exclude MGMT-01 from the scan rule: it’s a management server', good: false, why: 'That is how its first scan went unseen.'}],
      chain: [{at: 60, text: 'svc-vpnldap tries a third server.'}]}
  };
}
async function bmBossScript() {
  const who = 'Magda Petrov', c = BM();
  await surfaceMissed(true);
  c.boss = {day: G.day};
  await say('MGMT-01, the management server. Its Security log starts at 02:41 this morning with event 1102. Someone cleared it, and they didn’t want us to know who.', who);
  await say('This one is ours, not a retelling: a game-original case. Its outline follows what ATT&CK records for living-off-the-land intruders such as Volt Typhoon: an exploited internet-facing appliance, valid accounts, selectively cleared logs, scanning with commercial tools and utilities already present, and credentials taken from where an appliance stored them.', who);
  unlock('fact', 'g1017'); unlock('fact', 'ev1102');
  await say('Leadership is told, and the town has reported it to CISA. Telling people is never optional, so it isn’t one of your cards.', who);
  touchCSF('Respond'); G.rep += 5; toast('Leadership told; reported to CISA. Reputation up.');
  await say('Tabletop. Pick four response cards. Then we work it in three stages.', who);
  const items = BM_CARDS.map(x => ({label: x.name, meta: {good: !!x.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions, NIST SP 800-92 and SP 800-41 and the NIST CSF. (Leadership and CISA have been told.)</p>' +
    shownOrder(BM_CARDS, items).map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const sel = await UI.openModal('Tabletop: a log that starts at 02:41', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => BM_CARDS[i].id);
  G.f.bmCards = picks;
  for (const id of picks) { const x = BM_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('wipe')) { G.rep -= 3; bumpUptime(-0.02); }
  if (picks.includes('restorelog')) G.rep -= 1;
  if (picks.includes('blockip')) G.rep -= 2;
  if (picks.includes('wait')) G.rep -= 2;
  await say('Debrief: preserve what remains before anything is cleaned, put every source in one clock’s order, shut the path they used, and look for the same behaviour everywhere. A cleared log is not the end of the record: the collector kept what it was sent.', who);
  const S = bmBossStages(picks, c.tune);
  await fightStory(S.s1, 'Magda: Regroup. Same stage, again.');
  await fightStory(S.s2, 'Magda: Regroup. Same stage, again.');
  await fightStory(S.s3, 'Magda: Regroup. Same stage, again.');
  c.mttd.push(c.tune && c.tune.hidden ? 120 : 30);
  c.boss = {day: c.boss.day, picks: picks, hidden: !!(c.tune && c.tune.hidden), reopened: !!(c.tune && c.tune.reopened)};
  G.f.bmBoss = true;
  touchCSF('Recover'); unlock('tech', 'T1685.005'); unlock('tech', 'T1046'); unlock('act', 'gapcheck');
  bumpUptime(0.01); track();
  await say('Contained: MGMT-01 and APP-02 isolated and imaged, svc-vpnldap and fw-svc-vpn disabled and rotated, VPN-01 rebuilt on the vendor’s fixed version, R4 four services wide, the outbound rule gone. Then the hunt kept going, server by server, for the same behaviour.', who);
  if (c.tune && c.tune.hidden) await say('And the scan rule: your exclusion hid MGMT-01’s first scan, a week before tonight. Exclusions are narrowed to one host, one port, one window, now, with an expiry. Incident review counts it as a missed attack.', 'Lena Mortimer');
  await say('Rae came down from the Front Desk. She’s in the corridor, and she wants to talk about something the hunt turned up that isn’t this intruder.', who);
}

/* ---------- The Quiet Thread: the suspicion file ---------- */
async function raeBasementTalk() {
  const who = 'Rae Okafor', c = BM();
  if (c.file) { await say('It’s on file, and it stays open. Whatever it is, it’s patient. So are we.', who); return; }
  await say('The hunt found two servers of tonight’s intruder, and nothing else of theirs. But it kept tripping over your Unexplained notes. Different account, different nights, always just after three.', who);
  await say('Now the clocks agree and the logs are kept, put them on one timeline for me. Not a conclusion: a suspicion file.', who);
  const line = bmQtTimeline();
  const rows = line.map(x => '<tr><td>' + esc(x.t) + '</td><td>' + esc(x.district) + '</td><td>' + esc(x.where) + '</td><td>' + esc(x.who) + '</td><td>' + esc(x.tech + ' ' + (QT_TECH[x.tech] ? QT_TECH[x.tech].name : '')) + '</td></tr>').join('');
  const svc = line.filter(x => /svc-print/.test(x.who)).length, router = line.filter(x => /router/.test(x.where + ' ' + x.who)).length;
  const body = '<p>Your Unexplained notes, in order of time of night (' + line.length + ' of them, from different nights; local time as each device recorded it). This is a pattern, not a sequence: it shows when, not what came first.</p>' +
    '<table class="sc"><tr><th>Time</th><th>District</th><th>Where</th><th>Who</th><th>ATT&amp;CK</th></tr>' + rows + '</table>' +
    '<p>Every one falls between 03:00 and 03:40. ' + (svc ? svc + ' name svc-print, the printer’s service account. ' : '') + (router ? router + ' point at the router in the Front Desk closet. ' : '') + 'No alert fired for any of them.</p>' +
    '<p class="small">Caveat: before this week’s NTP fix the clocks behind these notes were not synchronised, so the order inside one night is uncertain by minutes, and each note needs its date before anyone reads a sequence into them. The time-of-night pattern holds either way. (game)</p>';
  while (true) {
    const i = await UI.openModal('Suspicion file', body, [
      {label: 'Hand it to Rae as a suspicion file: what was seen, where and when (with the clock caveat), what it might mean, and what would confirm or rule it out. No conclusions; nothing done to svc-print or the router without her', meta: {good: true, k: 'file'}},
      {label: 'Disable svc-print and pull the router tonight, and close it: this many notes are enough to act on, every night it stays is another night of access, and the printers can use a local account until a new router arrives', meta: {k: 'act'}},
      {label: 'File it as noise: each note has an innocent explanation (print jobs, router reboots, an old mailbox), and no alert has fired for any of them', meta: {k: 'noise'}},
      {label: 'Post the timeline in the all-staff chat, so every team that owns one of these systems watches for it tonight and reports anything after 03:00', meta: {k: 'post'}}], {shuffle: true, closable: false, cls: 'drill'});
    const k = [0, 1, 2, 3][i];
    if (k === 0) break;
    if (k === 1) await say('Acting alone on something you can’t yet scope can warn whoever is behind it before anyone knows how far it reaches, and it breaks the printers on the way. That decision is Rae’s, with a plan.', who);
    else if (k === 2) await say('Each one alone, maybe. Note after note, the same service account, the same router, the same forty minutes after three: that pattern is the finding. Write it down.', who);
    else await say('If someone is inside, they may read the chat too. A suspicion goes to the person who owns the decision, need to know.', who);
  }
  c.file = {clues: line.map(x => x.id), day: G.day};
  G.f.bmFile = true; unlock('act', 'suspicion'); touchCSF('Govern');
  Series.markEdition(EDITION.id, {suspicionFile: line.map(x => x.id)});
  await say('Thank you. This isn’t solved, and it isn’t yours alone any more. It goes in a file that follows you to the next building.', who);
  await say('(The Quiet Thread is on file. It continues in the next edition.)');
  await say('That’s the IT Basement. Next stop: the Server Room.', 'Magda Petrov');
  await bmSummary();
}

/* ---------- End of district ---------- */
async function bmSummary() {
  await surfaceMissed(true);
  G.f.bmSummary = true;
  const c = BM(), d = c.drills;
  const dl = ['gap', 'clocks', 'dns'].map(k => esc(BM_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const t = c.tune;
  const body = '<p class="big">IT Basement district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key Badge, Seal Badge, Shield Badge, Lantern Badge, Vault Badge' + (G.f.bmBeacon ? ', Beacon Badge' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '.</p>' +
    (t ? '<p>Scan rule tuning: <b>' + t.left + '</b> alerts a week (was 14), ' + t.fpRemoved + ' of 12 false positives removed' + (t.hidden ? ', <b>one real attack hidden by an exclusion</b> (found in incident review)' : ', every real attack still raised') + (t.reopened ? '; the unticketed “admin activity” reopened' : '') + '.</p>' : '') +
    (c.boss ? '<p>The 02:41 intruder: contained on MGMT-01 and APP-02; VPN-01 rebuilt; R4 narrowed. Cards: ' + esc(c.boss.picks.map(id => BM_CARDS.find(x => x.id === id).name).join(', ')) + '.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    bmQtSummaryHtml() +
    '<p class="big">Next: the Server Room.</p>';
  Series.markEdition(EDITION.id, {done: true, mailRoom: true, clerksRow: true, marketSquare: true, recordsHall: true, itBasement: true});
  const i = await UI.openModal('End of the IT Basement', body, [{label: 'Keep exploring the IT Basement', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
