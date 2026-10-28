/* ============================================================
   UPTIME · editions/town-hall/clerks-story.js
   Town Hall district 3, Clerks' Row (endpoints): state, objectives, interactions,
   talk, the fieldwork fixes (local admin, Patch Tuesday triage, attack surface
   reduction, script block logging), the help-desk exception, three investigation
   drills, the Forensics Dojo, the Endpoint Board (Shield Badge, promotion to
   Tier 2), the worm incident with map containment, scorecard metrics and the
   end-of-district summary.
   The Front Desk story calls in through small guarded hooks (crObjective,
   crTriggers, crInteract, crTalk, crTile, crEvolveCheck). The engine hooks the
   Mail Room already defines (alertWeight, alertHost, briefList, onAbility,
   onAlertClosed, editionMetricVals, editionScoreHtml, peekExtra) are wrapped
   here: each wrapper calls the Mail Room version first, then adds Clerks' Row.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Clerks’ Row: CISA Known Exploited Vulnerabilities catalog and BOD 22-01. Microsoft Learn on the monthly update cycle, Office internet-macro blocking, attack surface reduction rules, PowerShell script block logging, Task Scheduler event 106 and Audit Other Object Access Events, Defender Antivirus events and tamper protection, Sysmon. Microsoft Incident Response, Guidance for Incident Responders (execution artefacts). ASD Essential Eight. CISA eviction strategies (CM0147). UK National Audit Office, Investigation: WannaCry cyber attack and the NHS (2017). Microsoft Security Bulletin MS17-010 and MSRC WannaCrypt guidance. CISA alert TA17-132A.';
}

/* ---------- State ---------- */
function CR() {
  if (!G.cr) G.cr = {day0: G.day, patched: {}, triage: null, triageScore: null, deployed: {}, admins: 18, tempAdmin: false,
    drills: {}, ttc: [], iso: {}, needed: 0, over: 0, work: 0, infected: [], dojo: [false, false, false], bossT0: null};
  return G.cr;
}
function crOn() { return !!(G && G.f && G.f.crMet && G.cr); }
function inClerks() { return CR_MAPS.includes(G.map); }
const CR_PRIO = CR_ADVISORIES.filter(a => a.prio).map(a => a.id);
function crHasPatch(h, id) { return !!(G.cr && G.cr.patched[h] && G.cr.patched[h][id]); }
function crLit(h) { return CR_PRIO.every(id => crHasPatch(h, id)); }
function crIsolated(h) { return !!(G.cr && G.cr.iso[h]); }
function crInfectedLive(h) { return !!(G.f.crContain && !G.f.crBoss && G.cr.infected.includes(h)); }
// Apply one bucket of the triage plan. The conference laptop is offline; the deferred laptop has the update
// installed but not restarted, so none of it is in effect there yet (game).
function crDeploy(bucket) {
  const c = CR(); if (!c.triage || c.deployed[bucket]) return 0;
  c.deployed[bucket] = true;
  const ids = CR_ADVISORIES.filter(a => a.applies && c.triage[a.id] === bucket).map(a => a.id);
  for (const h of CR_HOSTS_ALL) {
    if (h === CR_OFFLINE || h === CR_DEFERRED) continue;
    c.patched[h] = c.patched[h] || {};
    ids.forEach(id => { c.patched[h][id] = true; });
  }
  track();
  return ids.length;
}
function crPatchAll() {
  const c = CR();
  for (const h of CR_HOSTS_ALL) { c.patched[h] = c.patched[h] || {}; CR_ADVISORIES.filter(a => a.applies).forEach(a => { c.patched[h][a.id] = true; }); }
  track();
}
function crCompliance(kev) {
  const ads = CR_ADVISORIES.filter(a => a.applies && a.kev === kev);
  let have = 0;
  for (const h of CR_HOSTS_ALL) ads.forEach(a => { if (crHasPatch(h, a.id)) have++; });
  return Math.round(have / (ads.length * CR_HOSTS_ALL.length) * 100);
}

/* ---------- Engine hooks (wrapping the Mail Room versions) ---------- */
const _mrAlertWeight = alertWeight, _mrAlertHost = alertHost, _mrBriefList = briefList, _mrOnAbility = onAbility,
  _mrOnAlertClosed = onAlertClosed, _mrMetricVals = editionMetricVals, _mrScoreHtml = editionScoreHtml, _mrPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _mrAlertWeight(t, w);
  if (THREATS[t].district === 'clerks' && !(G.f && G.f.crMet)) return 0;
  if (G.f.crMet && inClerks() && CR_HOME.includes(t)) w *= 3;
  if (G.f.crShield && t === 'quill') w *= 0.5;
  return w;
};
alertHost = function () { return inClerks() ? pick(CR_HOSTS_ALL) + ' · Clerks’ Row' : _mrAlertHost(); };
briefList = function () { const L = _mrBriefList(); return G.f.crMet ? L.concat(CR_BRIEFS) : L; };
onAbility = function (k, b) {
  _mrOnAbility(k, b);
  if (!crOn()) return;
  const c = CR();
  if (k === 'isolate') {
    if (b.spec.kind === 'mal') { c.needed++; c.work += 1; } else { c.over++; c.work += 2; }
  }
  if ((k === 'isolate' || k === 'kill') && b.spec.kind === 'mal' && !b.ttcDone) {
    b.ttcDone = true;
    c.ttc.push(Math.round((performance.now() - b.t0) / 100) / 10);
    if (c.ttc.length > 20) c.ttc.shift();
  }
};
onAlertClosed = async function (s, verdict, correct, r) {
  await _mrOnAlertClosed(s, verdict, correct, r);
  if (!crOn() || s.story) return;
  if (s.threat === 'siphon' && s.kind === 'mal' && correct && r.good) unlock('act', 'asr');
  track();
};
editionMetricVals = function () {
  const v = _mrMetricVals();
  if (!crOn()) return v;
  const c = CR();
  return Object.assign(v, {
    crKev: crCompliance(true), crOther: crCompliance(false),
    crTtc: c.ttc.length ? +(c.ttc.reduce((a, b) => a + b, 0) / c.ttc.length).toFixed(1) : null,
    crIso: c.needed + c.over ? Math.round(c.needed / (c.needed + c.over) * 100) : null,
    crOver: c.over, crAdmins: c.admins
  });
};
EDITION_METRICS.push(
  {k: 'crKev', label: 'Patch compliance: known exploited (KEV)', unit: '%', higher: true, when: crOn},
  {k: 'crOther', label: 'Patch compliance: other applicable updates', unit: '%', higher: true, when: crOn},
  {k: 'crTtc', label: 'Mean time to contain (game seconds)', unit: ' s', higher: false, lower: true, when: crOn},
  {k: 'crIso', label: 'Isolations that were needed', unit: '%', higher: true, when: crOn},
  {k: 'crOver', label: 'Clean hosts isolated (over-isolation)', unit: '', higher: false, lower: true, when: crOn},
  {k: 'crAdmins', label: 'Staff with local admin rights', unit: '', higher: false, lower: true, when: crOn}
);
editionScoreHtml = function () {
  let h = _mrScoreHtml();
  if (!crOn()) return h;
  const c = CR();
  h += '<p>Clerks’ Row: Shield Badge <b>' + (G.f.crShield ? 'yes' : 'not yet') + '</b> · patch triage <b>' + (c.triageScore === null ? '—' : c.triageScore + '%') + '</b> · laptops lit (priority patches in effect) <b>' + CR_HOSTS_ALL.filter(crLit).length + '/18</b> · staff work lost to isolation <b>' + c.work + ' h</b> (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _mrPeekExtra();
  e.crSummary = !!G.f.crSummary;
  e.cr = G.cr ? {drills: G.cr.drills, triageScore: G.cr.triageScore, admins: G.cr.admins, needed: G.cr.needed, over: G.cr.over, work: G.cr.work,
    infected: G.cr.infected, isolated: Object.keys(G.cr.iso), ttc: G.cr.ttc.length, lit: CR_HOSTS_ALL.filter(crLit).length} : null;
  return e;
};
function crTile(d, ch, x, y) {
  if (ch === 'R' && G.f.crShield) { d.spr = 'L'; d.pal = 'clerkBld'; }
  if (ch === 'x' && G.f.crShield && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  if (ch === 'l' && G.cr) {
    const h = crHostAt(x, y);
    d.pal = crIsolated(h) ? 'pcIso' : crInfectedLive(h) ? 'pcHot' : crLit(h) ? 'pcOn' : 'pcOff';
  }
  return d;
}

/* ---------- Objective ---------- */
function crObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'clerks', x: x, y: y, district: 'clerks'});
  if (!f.crMet) return at('Next: Clerks’ Row. Its door is east of the Mail Room; your Seal Badge opens it.', 14, 9);
  if (!f.crAdmin) return at('Fieldwork: everyone is a local admin. See Arlo in the deployment office.', 4, 3);
  if (!f.crTriage) return at('Patch Tuesday: triage this month’s advisories at the deployment console.', 2, 1);
  if (!f.crAsr) return at('Fieldwork: attack surface reduction and app control. Arlo again.', 4, 3);
  if (!f.crPslogGpo) return at('Fieldwork: PowerShell script block logging. Arlo sets the policy.', 4, 3);
  if (!f.crPslog) return at('Check that script block logging works on CR-LT-04, Sunita’s laptop.', 17, 1);
  if (!f.crDrill1) return at('Sunita’s laptop downloaded a flagged file. Talk to her.', 22, 2);
  if (!f.crException) return at('Gus needs admin rights for a driver. Handle the request.', 10, 9);
  if (!f.crDrill2) return at('Mateo’s laptop has a task nobody made. Talk to Mateo.', 22, 4);
  if (!f.crNight) return at('End your shift at your Clerks’ Row desk.', 25, 9);
  if (!f.crDrill3) return at('Morning alert: protection is off on CR-LT-09. See Arlo.', 4, 3);
  if (!f.crDojoDone) {
    if (!f.crDojoMet) return at('(Optional) Train at the Forensics Dojo with Yara.', 26, 4);
    const i = CR().dojo.findIndex(x => !x);
    return at('(Optional) Forensics puzzle ' + (i + 1) + ' of 3.', [24, 26, 28][i], 1);
  }
  if (!f.crBoard) return at('Take the Endpoint Board challenge (Teo Brandt, through the east door).', 9, 2, 'eboard');
  if (!f.crContain && !f.crBoss) return at('Ruth needs you: something is spreading.', 14, 9);
  if (f.crContain && !f.crContained && CR().infected.some(h => !crIsolated(h))) {
    const left = CR().infected.filter(h => !crIsolated(h));
    const p = crHostXY(left[0]);
    return at('Lead containment: isolate the infected laptops (' + left.length + ' left). They show red.', p.x, p.y);
  }
  if (!f.crBoss) return at('Containment holds. Report to Ruth.', 14, 9);
  return {text: 'Clerks’ Row secured. Next: Market Square.', done: true, district: 'clerks'};
}

/* ---------- Triggers and interactions ---------- */
let crEarlyWarned = false;
function crTriggers() {
  if (G.map !== 'clerks') return false;
  if (!G.f.mrBoss) {
    if (crEarlyWarned) return false;
    crEarlyWarned = true;
    run(async () => { await say('Seal Badge? Good. But Bea’s still on the radio: finish the Mail Room first. We’ll be here.', 'Ruth Avila'); });
    return true;
  }
  if (!G.f.crMet) { run(crArrive); return true; }
  return false;
}
function crInteract(ch, tx, ty) {
  if (!inClerks()) return false;
  if (ch === 'l') { run(() => crLaptop(tx, ty)); return true; }
  if (ch === 'T') { run(crConsole); return true; }
  if (ch === 'f') { run(() => crDojoPuzzle([24, 26, 28].indexOf(tx))); return true; }
  if (ch === 'Y') { run(crDesk); return true; }
  if (ch === 'V') { run(async () => { await say('Endpoint telemetry racks. Every laptop reports here: process starts, script blocks, Defender events.'); }); return true; }
  return false;
}
async function crTalk(npc) {
  if (!CR_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.crMet && npc.map === 'clerks') { await say('Ruth’s the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'ruth': await ruthTalk(); break;
    case 'arlo': await arloTalk(); break;
    case 'sunita':
      if (f.crPslog && !f.crDrill1) { await crDrill1(); break; }
      await say(f.crDrill1 ? 'I check the full file name now. “.pdf.exe” is not a PDF.' : 'Records requests all morning. My laptop is slow, but whose isn’t?', who); break;
    case 'mateo':
      if (f.crException && !f.crDrill2) { await crDrill2(); break; }
      await say(f.crDrill2 ? 'A “statement” that was a script. I report attachments I wasn’t expecting now, even from people I know.' : 'Licensing. Dog licences, food trucks, a very persistent busker.', who); break;
    case 'gus':
      if (f.crDrill1 && !f.crException) { await crException(); break; }
      await say(f.crException ? 'The plotter works and I never needed to be an admin. Who knew.' : 'Planning maps need the big plotter. The big plotter needs a driver. Everything needs a driver.', who); break;
    case 'yara': await yaraTalk(); break;
    case 'teo': await crBoardScript(); break;
  }
}
async function crDesk() {
  if (!G.f.crDrill2) { await say('Your desk in Clerks’ Row. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your Clerks’ Row desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  const c = CR();
  if (c.tempAdmin) { c.tempAdmin = false; c.admins = Math.max(0, c.admins - 1); track(); await say('Overnight: Gus’s one-hour admin rights expired as logged. Staff with local admin: ' + c.admins + '.'); }
  if (c.triage && !c.deployed.next) { const n = crDeploy('next'); if (n) await say('Overnight: the deployment office pushed next week’s batch (' + n + ' update' + (n === 1 ? '' : 's') + ').'); }
  if (!G.f.crNight) {
    G.f.crNight = true;
    await say('Day ' + G.day + ', 07:55. Overnight alert: “CR-LT-09: real-time protection disabled at 14:02 yesterday, still off.” Arlo has the bench log.');
  }
}

/* ---------- Arrival ---------- */
async function crArrive() {
  const who = 'Ruth Avila', f = G.f;
  CR(); G.cr.day0 = G.day;
  await say('Day ' + G.day + '. Clerks’ Row: three rows of laptops, a deployment office, a Forensics Dojo, and a door marked Endpoint Board.');
  await say('You’re the Tier 1 from the Mail Room? Ruth Avila. I run Clerks’ Row: licences, records, permits, planning. Eighteen laptops.', who);
  await say('Two problems. We are months behind on patches: see how every laptop is dark? And every clerk is a local administrator, because it was easier.', who);
  await say('Anything a clerk opens runs with full control of the laptop, and nothing is patched against the flaws it uses. Fix both, then we talk about alerts.', who);
  if (!hasTool('sentry')) {
    addTool('watchling', 4);
    await say('You don’t have an endpoint tool yet. Here: Watchling, a basic EDR agent on every laptop. It sees process starts. It grows.', who);
  }
  G.targets.crKev = 100; G.targets.crOther = 90; G.targets.crTtc = 30; G.targets.crIso = 90; G.targets.crOver = 0; G.targets.crAdmins = 0;
  f.crMet = true; track();
  touchCSF('Identify');
  await say('New on your scorecard: patch compliance (known-exploited first), mean time to contain, how many isolations were needed, and how many staff are local admins. Start (Enter) shows them.', who);
  await say('Arlo runs the deployment office, west room. Start there.', who);
}
async function ruthTalk() {
  const f = G.f, who = 'Ruth Avila';
  if (!f.crAdmin) { await say('Arlo, deployment office, west room. Local admin first.', who); return; }
  if (!f.crTriage) { await say('Patch Tuesday was this week. The deployment console is in Arlo’s office.', who); return; }
  if (!f.crPslog) { await say('Arlo has more fieldwork for you: attack surface rules and PowerShell logging.', who); return; }
  if (!f.crDrill1) { await say('Sunita’s laptop matched a bad hash this morning. Leadership wants to know whether to reimage it.', who); return; }
  if (!f.crException) { await say('Gus has been asking for admin rights back. Handle it the new way.', who); return; }
  if (!f.crDrill2) { await say('Mateo says his laptop grew a task while he was at lunch.', who); return; }
  if (!f.crNight) { await say('Go home. The laptops will still be here.', who); return; }
  if (!f.crDrill3) { await say('Arlo has the CR-LT-09 bench log.', who); return; }
  if (!f.crBoard) { await say('Teo runs the Endpoint Board, through the east door. Yara’s Forensics Dojo is worth a visit first.', who); return; }
  if (!f.crContain && !f.crBoss) { await crBossScript(); return; }
  if (f.crContain && !f.crContained) { await say('Keep going: the red laptops. Isolate those, and only those.', who); return; }
  if (!f.crBoss) { await crBossFinish(); return; }
  await say('Clerks’ Row is patched, and nobody here is an administrator any more. Market Square is next.', who);
  await crSummary();
}

/* ---------- Fieldwork ---------- */
async function arloTalk() {
  const f = G.f, who = 'Arlo Petrakis';
  if (!f.crAdmin) { await crAdminTask(); return; }
  if (!f.crTriage) { await say('The deployment console is behind me. Twelve days behind already, so: what goes first?', who); return; }
  if (!f.crAsr) { await crAsrTask(); return; }
  if (!f.crPslogGpo) { await crPslogGpo(); return; }
  if (!f.crPslog) { await say('The policy is out. Check it on Sunita’s laptop, CR-LT-04: top row.', who); return; }
  if (f.crNight && !f.crDrill3) { await crDrill3(); return; }
  if (f.crDrill3) { await say('Tamper protection is on for the plotter group now. Next vendor who says “turn off antivirus” gets a phone call.', who); return; }
  await say('Deployment office. If it installs, updates or breaks, it crosses this bench.', who);
}
async function crAdminTask() {
  const who = 'Arlo Petrakis';
  await say('All eighteen clerks are in the local Administrators group. It started with one plotter driver years ago.', who);
  while (true) {
    const i = await choose('How do you fix it?', [
      {label: 'Remove staff from local admin; IT uses separate admin accounts; exceptions go through a help-desk request that is checked, time-limited and logged', meta: {good: true}},
      {label: 'Remove everyone’s admin rights, no exceptions, ever'},
      {label: 'Keep admin rights, but buy better antivirus'},
      {label: 'One shared admin password for IT across every laptop'}]);
    if (i === 0) break;
    if (i === 1) await say('Real needs will come up. With no way to ask, people go around you. Have a process.');
    else if (i === 2) await say('Anything a clerk opens runs with the clerk’s rights. With admin rights, it can change anything on the laptop, including the antivirus settings.');
    else await say('One leaked password would open every laptop. Separate, managed admin accounts.');
  }
  const c = CR(); c.admins = 0; G.f.crAdmin = true; track();
  unlock('act', 'leastpriv'); unlock('fact', 'e8'); touchCSF('Protect'); touchCSF('Govern');
  await say('Done by policy overnight. Staff with local admin: 18 → 0. Requests for admin rights are now checked when they’re made, which is what Australia’s Essential Eight asks for too.', who);
  await say('Next: the patch backlog. The console is behind me.', who);
}
async function crConsole() {
  if (!G.f.crAdmin) { await say('The deployment console. Arlo should walk you through it first.'); return; }
  if (G.f.crTriage) {
    await say('Deployment console. Plan: ' + CR_ADVISORIES.map(a => a.id + ' ' + CR_BUCKETS[CR().triage[a.id]].toLowerCase()).join(', ') + '. Laptops lit: ' + CR_HOSTS_ALL.filter(crLit).length + ' of 18.');
    return;
  }
  await crTriage();
}
function crAdvCard(a) {
  return '<div class="card"><b>' + esc(a.id) + ' (game)</b> · ' + esc(a.title) + '<br>CVSS base <b>' + a.cvss.toFixed(1) + '</b> · ' +
    (a.kev ? '<b>on CISA’s KEV list</b>' : 'not on the KEV list') + ' · ' + (a.applies ? 'installed on our laptops' : '<b>not on our laptops</b>') +
    '<br><span class="small">' + esc(a.note) + '</span></div>';
}
async function crTriage() {
  const c = CR();
  await say('Patch Tuesday: Microsoft’s monthly security update is out, along with this month’s fixes from the other vendors we use. Eight advisories land on the console, and the deployment office can push one batch today. (Advisories and IDs are invented: game.)');
  const plan = {};
  for (let n = 0; n < CR_ADVISORIES.length; n++) {
    const a = CR_ADVISORIES[n];
    const items = ['week', 'next', 'later'].map(b => ({label: CR_BUCKETS[b], meta: {b: b, good: a.good === b}}));
    const i = await UI.openModal('Patch Tuesday triage · ' + (n + 1) + ' of ' + CR_ADVISORIES.length,
      '<p>Put each advisory in a batch. This week’s batch goes out today.</p>' + crAdvCard(a), items, {closable: false, cls: 'drill'});
    plan[a.id] = items[i].meta.b;
  }
  // Score (game): known-exploited advisories count double.
  let got = 0, tot = 0;
  const rows = CR_ADVISORIES.map(a => {
    const w = a.kev ? 2 : 1, ok = plan[a.id] === a.good;
    tot += w; if (ok) got += w;
    return '<tr><td>' + esc(a.id) + (a.kev ? ' <span class="tag">KEV</span>' : '') + '</td><td>' + a.cvss.toFixed(1) + '</td><td>' + CR_BUCKETS[plan[a.id]] + '</td><td>' + (ok ? '✓' : CR_BUCKETS[a.good]) + '</td></tr>' +
      '<tr><td colspan="4" class="small">' + esc(a.why) + '</td></tr>';
  }).join('');
  const score = Math.round(got / tot * 100);
  const body = '<p class="big">Triage score ' + score + '% <span class="small">(game: known-exploited items count double)</span></p>' +
    '<table class="sc"><tr><th>Advisory</th><th>CVSS</th><th>Your batch</th><th>Better</th></tr>' + rows + '</table>' +
    '<p>Known exploited first: CISA keeps the KEV list for exactly this. A CVSS base score rates how bad a flaw could be; as CISA puts it, it “does not account for if the vulnerability is actually being used to attack systems.” Exposure and public exploit code matter too.</p>';
  const j = await UI.openModal('Patch plan review', body, [{label: 'Deploy this week’s batch', meta: {good: true}}, {label: 'Redo the triage'}], {closable: false, cls: 'drill'});
  if (j === 1) return crTriage();
  c.triage = plan; c.triageScore = score; G.f.crTriage = true;
  const n = crDeploy('week');
  unlock('act', 'patchprio'); unlock('fact', 'kev'); unlock('fact', 'patchtue'); touchCSF('Protect'); touchCSF('Identify');
  await say('Deployed: ' + n + ' update' + (n === 1 ? '' : 's') + ' to the laptops that are online. Laptops lit: ' + CR_HOSTS_ALL.filter(crLit).length + ' of 18.');
  await say('Two stay dark. ' + CR_OFFLINE + ' is at a conference with its owner, offline. ' + CR_DEFERRED + ' installed everything but its user has postponed the restart five times, so none of it is in effect yet. (game)');
  await say('Patch compliance on your scorecard counts updates in effect, not updates sent. Known exploited: ' + metricVals().crKev + '%.');
}
async function crAsrTask() {
  const who = 'Arlo Petrakis';
  await say('Patches close known holes. Next: stop the behaviour attackers rely on, whatever the file. Defender has attack surface reduction rules, like “Block all Office applications from creating child processes”, and we can allow-list the apps that may run.', who);
  while (true) {
    const i = await choose('How do you roll it out?', [
      {label: 'Rules and an app allow-list in audit mode first, review a week of hits, then block', meta: {good: true}},
      {label: 'Block mode on everything, today'},
      {label: 'Skip it: antivirus already covers this'}]);
    if (i === 0) break;
    if (i === 1) await say('Some line-of-business tools will break, and people will ask for blanket exceptions. Audit first, then block.');
    else await say('Antivirus looks for known-bad files. These rules stop risky behaviour, like Word starting a script host, whatever the file is.');
  }
  G.f.crAsr = true; unlock('act', 'asr'); unlock('fact', 'asr_rules'); unlock('fact', 'macros'); touchCSF('Protect');
  await say('Audit mode is on. One more thing from the audit: a vendor set up a Trusted Location folder years ago. Office skips its internet-macro block there. I’ve removed it.', who);
}
async function crPslogGpo() {
  const who = 'Arlo Petrakis';
  await say('Last piece: PowerShell. Attackers love it because it ships with Windows and can hide a script in an encoded command.', who);
  await say('I’ve pushed the Group Policy “Turn on PowerShell Script Block Logging”. It records every script block as it actually runs, decoded. Check it on Sunita’s laptop, CR-LT-04, top row.', who);
  G.f.crPslogGpo = true; touchCSF('Protect');
}
async function crPslogVerify() {
  await say('CR-LT-04. You run a harmless test command in PowerShell. Where should the script block show up?');
  while (true) {
    const i = await choose('Check it in…', [
      {label: 'The System log'},
      {label: 'Event 4104 in Microsoft-Windows-PowerShell/Operational', meta: {good: true}},
      {label: 'The Security log'}]);
    if (i === 1) break;
    if (i === 0) await say('Services and drivers report there. Script blocks don’t.');
    else await say('The Security log holds audit events such as sign-ins. Script blocks go to PowerShell’s own Operational log.');
  }
  G.f.crPslog = true; unlock('act', 'pslog'); unlock('fact', 'pslog4104'); touchCSF('Detect');
  await say('There it is: event 4104, with your test command in full. (PowerShell 7, where installed, writes to PowerShellCore/Operational instead.) Ledger now collects 4104 from every laptop.');
  if (hasTool('ledger')) { const t = G.party.find(p => p.id === 'ledger'); t.lvl++; await say('Ledger has script blocks to read. Ledger reached Lv ' + t.lvl + '.'); }
}

/* ---------- Laptops: status, isolation (Shield Badge), the Quiet Thread laptop ---------- */
async function crLaptop(x, y) {
  const h = crHostAt(x, y), c = CR(), f = G.f;
  if (!f.crMet) { await say('A clerk’s laptop. Ruth should show you around first.'); return; }
  if (h === 'CR-LT-04' && f.crPslogGpo && !f.crPslog) { await crPslogVerify(); return; }
  const state = crIsolated(h) ? 'isolated' : crInfectedLive(h) ? 'INFECTED: scanning port 445' : crLit(h) ? 'priority patches in effect' : (h === CR_OFFLINE && !f.crBoss ? 'offline (at a conference)' : h === CR_DEFERRED && !f.crBoss ? 'restart pending' : 'missing priority patches');
  if (!f.crShield) {
    await say(h + ': ' + state + '.');
    if (h === CR_QT_HOST) await crQtLaptop();
    return;
  }
  const opts = [];
  if (!crIsolated(h)) opts.push({label: 'Isolate (Shield Badge)', note: 'stops spread, and this person’s work', meta: {k: 'iso', good: crInfectedLive(h)}});
  else opts.push({label: 'Release isolation', meta: {k: 'rel'}});
  if (h === CR_QT_HOST && !crIsolated(h)) opts.push({label: 'Look closer', meta: {k: 'qt'}});
  opts.push({label: 'Leave it', meta: {k: 'leave', good: !crInfectedLive(h)}});
  const i = await choose(h + ': ' + state + '.', opts);
  const k = opts[i].meta.k;
  if (k === 'iso') await crIsolate(h);
  else if (k === 'rel') {
    if (crInfectedLive(h)) { await say('Not while it’s infected.'); return; }
    delete c.iso[h]; track(); await say(h + ' is back on the network.');
  } else if (k === 'qt') await crQtLaptop();
}
async function crIsolate(h) {
  const c = CR(), needed = crInfectedLive(h);
  c.iso[h] = needed ? 'needed' : 'over';
  if (needed) { c.needed++; c.work += 1; }
  else { c.over++; c.work += 2; G.rep -= 2; bumpUptime(-0.01); }
  unlock('act', 'isolatemap');
  const done = G.f.crContain && !G.f.crContained && c.infected.every(crIsolated);
  if (done) {
    G.f.crContained = true;
    if (c.bossT0 !== null) { c.ttc.push(Math.round((G.playMs - c.bossT0) / 100) / 10); if (c.ttc.length > 20) c.ttc.shift(); }
    toast('Containment holds');
  }
  track();
  await say(needed ? h + ' isolated. The worm on it can’t reach anything now; its user loses about an hour (game).'
    : h + ' isolated. It was clean: its user loses two hours of work for nothing, and the town notices. (game)');
  if (done) await say('Every infected laptop is isolated. Containment holds. Report to Ruth.');
}

/* ---------- Drills ---------- */
async function crDrill(key) {
  const D = Object.assign({}, CR_DRILLS[key]);
  D.artefact = mrDay(D.artefact);
  const r = await doDrill(D);
  CR().drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, ai: r.ai, aiWrong: r.aiWrong};
  return r;
}
async function crDrill1() {
  const who = 'Sunita Rao';
  await say('They said my laptop downloaded something bad yesterday and they might wipe it. I have three days of records requests on there. Did it… do anything?', who);
  const r = await crDrill('hash');
  G.f.crDrill1 = true; unlock('fact', 'exec_art'); unlock('fact', 'sysmon');
  if (r.verdictOk) await say('So it never ran. Thank you for checking instead of wiping. I’ll look at the whole file name next time.', who);
  else await say('Ruth reviewed it: nothing ran. The file is gone, the hash is blocked everywhere, and Sunita keeps her laptop.', 'Ruth Avila');
}
async function crException() {
  const who = 'Gus Halloran';
  await say('The plotter vendor sent a new driver. It needs admin rights to install, and since this week I don’t have them. The planning committee wants maps tomorrow.', who);
  const c = CR();
  while (true) {
    const i = await choose('Gus’s request.', [
      {label: 'Log a help-desk request: IT checks it, installs the signed driver for him, and records it', meta: {good: true}},
      {label: 'Give Gus admin rights for one hour, logged, through the help desk'},
      {label: 'Make Gus a permanent admin: he’s trustworthy'},
      {label: 'Tell Gus no, and to find a plotter that doesn’t need a driver'}]);
    if (i === 0) { await say('Arlo installs the signed driver from the bench. Gus never needs admin rights at all. Logged in the ticket.'); break; }
    if (i === 1) { c.admins++; c.tempAdmin = true; track(); await say('Checked, time-limited and logged: that works. It expires at the end of the shift. Even better next time: IT installs it, and nobody needs admin rights.'); break; }
    if (i === 2) await say('Trust isn’t the question. Anything Gus opens would run as an admin too.');
    else await say('A “no” with no path sends people around the process. Give them a way to ask.');
  }
  G.f.crException = true; touchCSF('Govern');
}
async function crDrill2() {
  const who = 'Mateo Ferreira';
  await say('There’s a new scheduled task on my laptop, “Acrobat Update Helper”. I was at lunch. I didn’t make it. Did I?', who);
  const r = await crDrill('task');
  G.f.crDrill2 = true; unlock('fact', 'schtask_ev');
  if (r.verdictOk) await say('A script I opened at ten. It said “statement”. I’ll report the next one I wasn’t expecting.', who);
  else await say('Ruth reviewed it: the task came from a script Mateo opened that morning. CR-LT-10 is isolated and being cleaned.', 'Ruth Avila');
}
async function crDrill3() {
  const who = 'Arlo Petrakis';
  await say('CR-LT-09 is on my bench. Protection is off and the alert is shouting “tamper”. Before you call it: look at what we’ve got.', who);
  const r = await crDrill('rtp');
  G.f.crDrill3 = true; unlock('fact', 'defender_ev'); touchCSF('Respond');
  await say(r.verdictOk ? 'Yes… that was me, from the vendor’s guide. I forgot to turn it back on. Thanks for not making it a witch hunt. Tamper protection goes on for that group today.'
    : 'Ruth showed me the ticket and my own command. That was me, from the vendor’s guide. Tamper protection goes on for that group today.', who);
}

/* ---------- Forensics Dojo ---------- */
async function yaraTalk() {
  const who = 'Yara Haddad', f = G.f;
  if (!f.crDojoMet) {
    f.crDojoMet = true;
    await say('Welcome to the Forensics Dojo. National Cyber League-style puzzles, endpoint edition.', who);
    await say('One rule: an artefact says exactly what it records, and nothing more. Three terminals: Prefetch, Amcache and Shimcache, and a timeline. Solve all three and I’ll give you a field kit.', who);
    return;
  }
  if (f.crDojoDone) { await say('Present is not executed. Absent is not innocent. Check what the artefact actually records.', who); return; }
  await say('Puzzles solved: ' + CR().dojo.filter(Boolean).length + ' of 3. Terminals along the back wall.', who);
}
async function crDojoPuzzle(i) {
  if (!G.f.crDojoMet) { await say('A forensics practice terminal. Talk to Yara first.'); return; }
  const p = CR_DOJO[i], c = CR();
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await UI.openModal('Forensics · ' + p.title, '<pre class="art">' + esc(p.art) + '</pre><p><b>' + esc(p.q) + '</b></p>', p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {closable: false, cls: 'drill'});
    if (k === p.good) break;
    await say('Not quite. What does that artefact actually record?');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; unlock('fact', 'exec_art'); touchCSF('Detect');
  if (c.dojo.every(Boolean)) {
    G.f.crDojoDone = true;
    const t = G.party.find(p2 => TOOLS[p2.id].cls === 'endpoint');
    if (t) { t.lvl++; await say('All three. Here: a forensics field kit. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Yara Haddad'); }
    else await say('All three. Here: a forensics field kit.', 'Yara Haddad');
    await evolveCheck();
  }
}

/* ---------- Evolution: Watchling -> Sentry (Board), Sentry -> Overwatch (needs Ledger) ---------- */
async function crEvolveCheck() {
  if (!G.f || !G.f.crShield || !G.cr) return;
  const t = G.party.find(p => p.id === 'sentry' && p.lvl >= 5);
  if (!t || G.f.crOverwatchAsked === G.day) return;
  if (!hasTool('ledger') || !G.f.crPslog) return;
  G.f.crOverwatchAsked = G.day;
  const i = await choose('Sentry (Lv ' + t.lvl + ') can send its telemetry into Ledger. Integrate them?', [{label: 'Integrate Sentry with Ledger', meta: {good: true}}, {label: 'Later'}]);
  if (i !== 0) return;
  t.id = 'overwatch'; touchCSF('Detect');
  await say('Sentry is evolving! Sentry + Ledger → Overwatch. Every laptop’s telemetry in one place. New abilities: Fleet search and Collect triage.');
}

/* ---------- Endpoint Board ---------- */
async function crBoardScript() {
  const who = 'Teo Brandt', f = G.f;
  if (f.crBoard) { await say('The Shield Badge lets you cut any laptop off the network. Every isolation stops someone’s work. Make them count.', who); return; }
  if (!f.crDrill3) { await say('The Endpoint Board is for analysts who have worked a few real cases. Finish with Ruth’s team first.', who); return; }
  await say('Teo Brandt, endpoint security lead. Every attack ends up on a laptop sooner or later. Here you meet it there.', who);
  await say('Three rounds, one intruder: a macro document, a credential dump, and the lights going out. Ready?', who);
  const specs = CR_BOARD_SPECS();
  for (const s of specs) await fightStory(s, 'Teo: Again. Contain what the evidence points at, nothing more.');
  f.crBoard = true; f.crShield = true;
  G.rank = 'Tier 2 incident responder'; G.focusMax = Math.max(G.focusMax, 38); G.focus = G.focusMax;
  unlock('tech', 'T1218.005'); unlock('tech', 'T1003.001'); unlock('tech', 'T1685'); unlock('act', 'tamperprot');
  track();
  await say('You cleared the Endpoint Board. This is the Shield Badge.', who);
  await say('Its power: you can isolate any laptop on the map, straight from where you stand. It stops spread, and it stops that person’s work: over-isolation goes on your scorecard. Macro alerts (Quill) drop by half now the Office rules are blocking. (game)', who);
  const w = G.party.find(p => p.id === 'watchling');
  if (w) { w.id = 'sentry'; w.lvl = Math.max(w.lvl, 5); await say('Watchling is evolving! Watchling → Sentry. It can isolate hosts now. (Sentry Lv ' + w.lvl + ')'); }
  await say('Rank up: Tier 1 → Tier 2 incident responder. New responsibility: you lead containment. You decide what gets cut off, and you answer for it.');
  touchCSF('Respond');
  await evolveCheck();
}

/* ---------- Boss: the worm ---------- */
function crInfectedSet() {
  const c = CR();
  const base = [CR_OFFLINE, CR_DEFERRED].concat(crHasPatch('CR-LT-02', 'ADV-26-101') ? [] : CR_SPREAD);
  return base.filter(h => !crIsolated(h));
}
async function crBossScript() {
  const who = 'Ruth Avila', c = CR();
  await surfaceMissed(true);
  await say('Incident. ' + CR_OFFLINE + ' came back from the conference this morning and joined the network. Ten minutes later, laptops started scanning each other on port 445.', who);
  await say('It’s a worm, using the file-sharing flaw from ADV-26-101 (game). This is how WannaCry ran through the NHS in 2017: one unpatched network service, laptop to laptop.', who);
  unlock('fact', 'wannacry'); unlock('fact', 'ms17010');
  await say('Tabletop first. Pick four response cards. Then we work it in three stages, and you lead containment.', who);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions and CISA’s WannaCry guidance.</p>' +
    CR_CARDS.map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const items = CR_CARDS.map(x => ({label: x.name, meta: {good: ['segment', 'smb', 'pz', 'patch'].includes(x.id)}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const sel = await UI.openModal('Tabletop: the worm', body, items, {multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => CR_CARDS[i].id);
  G.f.crCards = picks;
  for (const id of picks) { const x = CR_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('unplug')) { bumpUptime(-0.03); G.rep -= 3; }
  if (picks.includes('ransom')) G.rep -= 5;
  if (picks.includes('notify')) G.rep += 5;
  if (picks.includes('backup')) G.rep += 2;
  await say('Debrief: no single right four. Cut the paths the worm uses (the segment, SMB at the boundaries), find where it started, and patch what it exploits. Paying buys nothing certain; shutting the whole town down stops the worm and everything else. And don’t block every domain it contacts: WannaCry had a kill switch, and CISA told admins not to block it.', who);
  const ev0 = picks.includes('pz') ? 20 : 0;
  const s1 = {kind: 'mal', threat: 'shade', tech: 'T1210', tags: ['host'], story: true, group: 'a', ev0: ev0,
    rate: picks.includes('segment') ? 9 : 14, dwell0: 20,
    title: 'Stage 1: patient zero', host: CR_OFFLINE + ' · Clerks’ Row', enemy: {spr: 'worm', pal: 'worm'},
    clues: [CR_OFFLINE + ' rejoined the network at 08:55 after two weeks away. It missed this month’s patches.', 'From 09:02 it tries TCP 445 on every address in the laptop segment.', 'Every laptop it reaches that lacks ADV-26-101 (game) starts doing the same within a minute.'],
    truth: 'A worm exploiting a network-service flaw to spread host to host (Exploitation of Remote Services).',
    resp: [{label: 'Isolate ' + CR_OFFLINE + ', block SMB between laptop segments, then isolate every infected laptop and nothing else', good: true},
           {label: 'Reimage ' + CR_OFFLINE + ' and close', good: false, why: 'Other laptops are already scanning. Patient zero is the start, not the scope.'},
           {label: 'Shut down every laptop in town', good: false, disrupt: 2, why: 'It stops the worm and every clerk. Isolate what is infected.'}],
    chain: [{at: 40, text: 'A second laptop starts scanning port 445.'}, {at: 75, text: 'A third joins it.'}]};
  await fightStory(s1, 'Ruth: Regroup. Same stage, again.');
  c.infected = crInfectedSet(); c.bossT0 = G.playMs;
  G.f.crContain = true; G.f.crContained = c.infected.length === 0; track();
  touchCSF('Respond');
  await say('You lead containment. Sentry sees ' + c.infected.length + ' laptop' + (c.infected.length === 1 ? '' : 's') + ' scanning port 445: they show red on the map. Isolate them with the Shield Badge.', who);
  await say('Only those. Isolate a clean laptop and a clerk loses their afternoon for nothing.' + (c.infected.length > 2 ? ' (More are infected than there needed to be: ADV-26-101 wasn’t in this week’s batch.)' : ''), who);
}
async function crBossFinish() {
  const who = 'Ruth Avila', c = CR(), picks = G.f.crCards || [];
  await say('Containment holds: ' + c.infected.length + ' infected, ' + c.infected.length + ' isolated' + (c.over ? ', ' + c.over + ' clean laptop' + (c.over === 1 ? '' : 's') + ' isolated along the way' : ', no clean laptop cut off') + '. Now we finish it.', who);
  const stages = [
    {kind: 'mal', threat: 'shade', tech: 'T1490', tags: ['host'], story: true, group: 'a',
     rate: picks.includes('smb') ? 9 : 14, dwell0: 25,
     title: 'Stage 2: restore points vanish', host: 'infected laptops (isolated)', enemy: {spr: 'shade', pal: 'shade'},
     clues: ['On the infected laptops, vssadmin deletes every shadow copy.', 'The worm installed itself as a new service on each one.', 'Sunday’s offline backups are intact: nothing on the network could reach them.'],
     truth: 'Inhibit System Recovery: the worm removes restore points before it encrypts.',
     resp: [{label: 'Keep them isolated, plan rebuilds from the offline backups, patch every clean laptop now', good: true},
            {label: 'Restore from the shadow copies', good: false, why: 'They have just been deleted.'},
            {label: 'Pay for a decryption key now', good: false, why: 'Nothing is encrypted yet, and paying guarantees nothing.'}],
     chain: [{at: 60, text: 'A laptop starts renaming files.'}]},
    {kind: 'mal', threat: 'shade', tech: 'T1486', tags: ['host'], story: true, group: 'a',
     rate: picks.includes('patch') ? 8 : 14, dwell0: picks.includes('blockall') ? 55 : (picks.includes('patch') ? 10 : 35),
     title: 'Stage 3: the kill switch', host: CR_OFFLINE + ' · isolated', enemy: {spr: 'worm', pal: 'worm'},
     clues: ['On ' + CR_OFFLINE + ' the worm begins encrypting files.', 'Reverse engineering shows it first looks up an unregistered domain, and stops if the lookup answers. A researcher has registered it. (game, modelled on WannaCry)', picks.includes('blockall') ? 'Your new DNS block list includes that domain: the worm can’t see the switch.' : 'The town’s DNS filter would block that domain as newly seen.'],
     truth: 'Data Encrypted for Impact, with a built-in stop switch.',
     resp: [{label: 'Let the kill-switch lookup through, rebuild ' + CR_OFFLINE + ' from offline backup, finish patching', good: true},
            {label: 'Block the domain: it’s malware infrastructure', good: false, why: 'During WannaCry, CISA asked admins not to block the kill-switch domain: registering it had slowed the spread. Blocking it here switches the worm back on.'},
            {label: 'Decrypt with a tool from a forum', good: false, why: 'Unverified tools can destroy files, or bring more malware.'}],
     chain: [{at: 60, text: 'Encryption reaches the shared documents folder.'}]}
  ];
  for (const s of stages) await fightStory(s, 'Ruth: Regroup. Same stage, again.');
  crPatchAll();
  c.iso = {}; G.f.crBoss = true; G.f.crContain = false;
  touchCSF('Recover'); unlock('act', 'smbblock'); unlock('act', 'restore');
  bumpUptime(0.01); track();
  await say('Recover: infected laptops rebuilt from offline backups, ADV-26-101 in effect on all eighteen (' + CR_OFFLINE + ' and ' + CR_DEFERRED + ' included), SMB blocked between segments, isolations released.', who);
  await say('That’s Clerks’ Row. Next stop: Market Square.', who);
  await crSummary();
}

/* ---------- End of district ---------- */
async function crSummary() {
  await surfaceMissed(true);
  G.f.crSummary = true;
  const c = CR(), d = c.drills;
  const dl = ['hash', 'task', 'rtp'].map(k => esc(CR_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const body = '<p class="big">Clerks’ Row district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key Badge, Seal Badge' + (G.f.crShield ? ', Shield Badge' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '. Patch triage: <b>' + (c.triageScore === null ? '—' : c.triageScore + '%') + '</b>.</p>' +
    '<p>Staff with local admin rights went from 18 to <b>' + c.admins + '</b>. Worm: <b>' + c.infected.length + '</b> laptops infected, isolations needed <b>' + c.needed + '</b>, clean laptops isolated <b>' + c.over + '</b>, staff work lost <b>' + c.work + ' h</b> (game). Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    crQtSummaryHtml() +
    '<p class="big">Next: Market Square.</p>';
  Series.markEdition(EDITION.id, {done: true, mailRoom: true, clerksRow: true});
  const i = await UI.openModal('End of Clerks’ Row', body, [{label: 'Keep exploring Clerks’ Row', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
