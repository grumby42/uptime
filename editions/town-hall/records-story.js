/* ============================================================
   UPTIME · editions/town-hall/records-story.js
   Town Hall district 5, Records Hall (backup and recovery): state, objectives,
   interactions, talk, the fieldwork (a timed restore test, a business impact
   analysis with recovery objectives agreed with an owner, 3-2-1 with an
   offline copy and escrowed keys, separate backup credentials), the finance
   directive, three investigation drills, the Cryptography Dojo, the Records
   Board (Vault Badge, Cairn), the ransomware incident with its restore-order
   mini-game, scorecard metrics and the end-of-district summary.
   The Front Desk story calls in through small guarded hooks (rhObjective via
   mkObjective, rhTriggers, rhInteract, rhTalk, rhTile, rhEvolveCheck). The
   engine hooks the earlier districts define (alertWeight, briefList,
   alertDecorate, onAbility, onAlertClosed, editionMetricVals, editionScoreHtml,
   peekExtra) are wrapped here: each wrapper calls the previous version first,
   then adds Records Hall.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Records Hall: MITRE ATT&CK v20 (T1486, T1490, T1485, T1567.002, T1560.001, T1078, T1484.001, T1136.002; Quiet Thread T1555). NIST SP 800-34 Rev. 1 and the NIST CSRC glossary (RTO, RPO, MTD, business impact analysis). NIST CSWP 29 (CSF 2.0: PR.DS-11, RC.RP-03, RC.RP-05). CISA and MS-ISAC #StopRansomware Guide (September 2023). CISA Eviction Strategies Tool, countermeasure CM0050 (KRBTGT reset twice). DHS NCCIC and FBI alert AA18-337A (SamSam). NCSC (UK): Offline backups in an online world (2019) and Principles for ransomware-resistant on-premises backups (2024). IETF RFC 4648; NIST FIPS 180-4, FIPS 197 and SP 800-57 Part 1 Rev. 5. US Department of Justice SamSam indictment (November 2018); US Treasury designation sm556 (November 2018); OFAC Updated Advisory on Potential Sanctions Risks for Facilitating Ransomware Payments (September 2021). FBI Memphis Field Office ransomware advice. Testimony of Atlanta Mayor Keisha Lance Bottoms to the House Homeland Security Committee’s cybersecurity subcommittee (June 2019).';
}

/* ---------- State ---------- */
function RH() {
  if (!G.rh) G.rh = {day0: G.day, tests: [], crit: [], obj: false, dbTwice: false, offline: 0, keyEscrow: false, drills: {}, ttc: [],
    dojo: [false, false, false], directive: null, d3Day: null, boss: null, bossT0: null, restore: null, pay: null};
  return G.rh;
}
function rhOn() { return !!(G && G.f && G.f.rhMet && G.rh); }
function inRecords() { return RH_MAPS.includes(G.map); }
function rhTestRate() { const t = RH().tests; return t.length ? Math.round(t.filter(x => x.ok).length / t.length * 100) : null; }
// Before the incident: critical systems whose latest passing restore test fits inside the agreed RTO. Untested counts as unknown.
function rhRtoPct() {
  const c = RH();
  if (c.restore) return Math.round(c.restore.rtoMet / RH_SYS_ORDER.length * 100);
  if (!c.obj) return null;
  const ok = RH_SYS_ORDER.filter(s => { const t = c.tests.filter(x => x.sys === s && x.ok).pop(); return t && t.hours <= RH_OBJ[s].rto; }).length;
  return Math.round(ok / RH_SYS_ORDER.length * 100);
}
// Before the incident: critical systems backed up at least as often as their RPO needs. After it: data actually lost vs RPO.
function rhRpoPct() {
  const c = RH();
  if (c.restore) return Math.round(c.restore.rpoMet / RH_SYS_ORDER.length * 100);
  if (!c.obj) return null;
  const ok = RH_SYS_ORDER.filter(s => (s === 'db' ? (c.dbTwice ? 12 : 24) : 24) <= RH_OBJ[s].rpo).length;
  return Math.round(ok / RH_SYS_ORDER.length * 100);
}
function rhDays() { const c = RH(); return {R: c.day0, E: Math.max(1, c.day0 - 2), B: c.boss ? c.boss.day : G.day}; }
function rhFill(s, d) { d = d || rhDays(); return String(s).replace(/\{B\}/g, String(d.B)).replace(/\{R\}/g, String(d.R)).replace(/\{E\}/g, String(d.E)); }

/* ---------- Engine hooks (wrapping the Market Square versions) ---------- */
const _rhPrevAlertWeight = alertWeight, _rhPrevBriefList = briefList, _rhPrevDecorate = alertDecorate,
  _rhPrevOnAbility = onAbility, _rhPrevOnAlertClosed = onAlertClosed, _rhPrevMetricVals = editionMetricVals, _rhPrevScoreHtml = editionScoreHtml, _rhPrevPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _rhPrevAlertWeight(t, w);
  if (THREATS[t].district === 'records' && !(G.f && G.f.rhMet)) return 0;
  if (G.f.rhMet && inRecords() && RH_HOME.includes(t)) w *= 3;
  // Vault Badge: the backups can't be deleted from the map, so threats that destroy data or the ways back come half as often. (game)
  if (G.f.rhVault && RH_VAULT_TECHS.includes(THREATS[t].tech)) w *= 0.5;
  return w;
};
briefList = function () { const L = _rhPrevBriefList(); return G.f.rhMet ? L.concat(RH_BRIEFS) : L; };
// Records Hall threats in Records Hall name a Records Hall server.
alertDecorate = function (spec) {
  _rhPrevDecorate(spec);
  if (G.f && G.f.rhMet && inRecords() && RH_HOME.includes(spec.threat)) spec.host = pick(RH_HOSTS) + ' · Records Hall';
};
onAbility = function (k, b) {
  _rhPrevOnAbility(k, b);
  if (!rhOn() || !RH_HOME.includes(b.spec.threat) || b.spec.kind !== 'mal' || b.rhTtcDone || ABIL[k].type !== 'con') return;
  b.rhTtcDone = true;
  const c = RH();
  c.ttc.push(Math.round((performance.now() - b.t0) / 100) / 10);
  if (c.ttc.length > 20) c.ttc.shift();
};
onAlertClosed = async function (s, verdict, correct, r) {
  await _rhPrevOnAlertClosed(s, verdict, correct, r);
  if (!rhOn() || s.story) return;
  if (correct && s.kind === 'mal' && r.good) {
    if (s.threat === 'sluice') unlock('act', 'exfilscope');
    if (s.threat === 'gloam') unlock('act', 'renamecheck');
    if (s.threat === 'shredwick' || s.threat === 'lapse') unlock('act', 'backupcreds');
  }
  track();
};
editionMetricVals = function () {
  const v = _rhPrevMetricVals();
  if (!rhOn()) return v;
  const c = RH();
  return Object.assign(v, {
    rhTest: rhTestRate(), rhRto: rhRtoPct(), rhRpo: rhRpoPct(), rhOffline: c.offline,
    rhTtc: c.ttc.length ? +(c.ttc.reduce((a, b) => a + b, 0) / c.ttc.length).toFixed(1) : null
  });
};
EDITION_METRICS.push(
  {k: 'rhTest', label: 'Restore test success rate', unit: '%', higher: true, when: rhOn},
  {k: 'rhRto', label: 'Critical systems with a measured recovery time within RTO', unit: '%', higher: true, when: rhOn},
  {k: 'rhRpo', label: 'Critical systems recoverable within RPO', unit: '%', higher: true, when: rhOn},
  {k: 'rhOffline', label: 'Critical systems with an offline copy', unit: '%', higher: true, when: rhOn},
  {k: 'rhTtc', label: 'Mean time to contain, Records Hall (game seconds)', unit: ' s', higher: false, lower: true, when: rhOn}
);
editionScoreHtml = function () {
  let h = _rhPrevScoreHtml();
  if (!rhOn()) return h;
  const c = RH(), t = c.tests;
  if (G.f.rhDirective) h += '<p class="dir">Directive: backup storage costs down 40% this year, by tiering retention with the service owners. (game)</p>';
  h += '<p>Records Hall: Vault Badge <b>' + (G.f.rhVault ? 'yes' : 'not yet') + '</b> · restore tests passed <b>' + t.filter(x => x.ok).length + ' of ' + t.length + '</b>' +
    ' · backup console <b>' + (G.f.rhCreds ? 'separate accounts with MFA' : 'domain admin') + '</b> · offline copy <b>' + (G.f.rhOffline ? 'weekly encrypted tapes, key in escrow' : 'none') + '</b>' +
    (c.restore ? ' · recovery: reinfections <b>' + c.restore.reinfect + '</b>, out-of-order restores <b>' + c.restore.depFail + '</b>' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _rhPrevPeekExtra();
  e.rhSummary = !!G.f.rhSummary;
  e.rh = G.rh ? {tests: G.rh.tests.length, testRate: rhTestRate(), crit: G.rh.crit, obj: G.rh.obj, offline: G.rh.offline, keyEscrow: G.rh.keyEscrow, directive: G.rh.directive,
    drills: G.rh.drills, ttc: G.rh.ttc.length, dojo: G.rh.dojo, boss: G.rh.boss, restore: G.rh.restore, pay: G.rh.pay} : null;
  return e;
};
function rhTile(d, ch, x, y) {
  if (ch === 'P' && G.f.rhVault) { d.spr = 'L'; d.pal = 'recordsBld'; }
  if (ch === '0' && G.f.rhVault && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  if (ch === 'm' && G.f.rhCreds) d.pal = 'vaultOk';
  return d;
}

/* ---------- Objective ---------- */
function rhObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'records', x: x, y: y, district: 'records'});
  if (!f.rhMet) return at('Next: Records Hall. Its door is south of the plaza, among the cabling between the Identity Board and the Dojo; your Lantern Badge opens it.', 14, 6);
  if (!f.rhTest) return at('Fieldwork: nobody has ever restored a backup. Run a timed restore test at the restore lab.', 5, 11);
  if (!f.rhBia) return at('Fieldwork: no recovery objectives agreed. Deshawn, the permits manager, is by the restore lab.', 5, 13);
  if (!f.rhOffline) return at('Fieldwork: copies an attacker can’t reach. The backup appliance is in the vault.', 21, 1);
  if (!f.rhCreds) return at('Fieldwork: the backup console still takes domain admin. Back to the appliance.', 22, 1);
  if (!f.rhNight1) return at('End your shift at your Records Hall desk.', 8, 14);
  if (!f.rhDrill1) return at('Odile has a question about the Planning share.', 14, 6);
  if (!f.rhDirective) return at('Leona Ferraro from finance wants a word.', 18, 7);
  if (!f.rhDrill2) return at('Nico’s morning report looks odd. He’s in the vault.', 24, 2);
  if (!f.rhNight2) return at('End your shift at your desk.', 8, 14);
  if (!f.rhDrill3) return at('A laptop in Planning was hit overnight. See Odile.', 14, 6);
  if (!f.rhDojoDone) {
    if (!f.rhDojoMet) return at('(Optional) Train at the Cryptography Dojo with Tobias.', 27, 12);
    const i = RH().dojo.findIndex(x => !x);
    return at('(Optional) Cryptography puzzle ' + (i + 1) + ' of 3.', [22, 24, 26][i], 11);
  }
  if (!f.rhBoard) return at('Take the Records Board challenge (Margit Halloran, through the east door).', 9, 2, 'rboard');
  if (!f.rhNight3) return at('End your shift at your desk.', 8, 14);
  if (!f.rhBoss) return at('Odile needs you: the stacks have gone dark.', 14, 6);
  return {text: 'Records Hall recovered. Next: IT Basement.', done: true, district: 'records'};
}

/* ---------- Triggers and interactions ---------- */
let rhEarlyWarned = false;
function rhTriggers() {
  if (G.map !== 'records') return false;
  if (!G.f.mkBoss) {
    if (rhEarlyWarned) return false;
    rhEarlyWarned = true;
    run(async () => { await say('Lantern Badge? Then you know your way around. But Paz says Market Square isn’t finished: the payment page first. The archive will keep.', 'Odile Brennan'); });
    return true;
  }
  if (!G.f.rhMet) { run(rhArrive); return true; }
  return false;
}
function rhInteract(ch, tx, ty) {
  if (!inRecords()) return false;
  if (ch === 'L') { run(async () => { await say(G.f.rhBoss ? 'The stacks: rebuilt from golden images, their files restored and checked by each department.' : 'The stacks: the department file servers. Planning, Finance, Permits, every department’s documents.'); }); return true; }
  if (ch === 'm') { run(rhVaultTile); return true; }
  if (ch === 'y') { run(async () => { await say(G.f.rhOffline ? 'The tape shelf. Weekly copies of every critical system, encrypted, labelled, waiting for Monday’s courier. Their key is in escrow, not here.' : 'An empty tape shelf, and a tape drive nobody has switched on in two years.'); }); return true; }
  if (ch === '4') { run(async () => { await say(G.f.rhOffline ? 'The courier’s door. The tapes leave for the offsite store every Monday (game). Out of the building, off the network.' : 'The courier’s door, for the offsite store. Nothing has gone through it in two years.'); }); return true; }
  if (ch === '5') { run(rhRestoreLab); return true; }
  if (ch === '6') { run(async () => { await say('The archivist’s desk: a card index, a magnifier, and the retention schedule, annotated in three colours of ink.'); }); return true; }
  if (ch === '7') { run(() => rhDojoPuzzle([22, 24, 26].indexOf(tx))); return true; }
  if (ch === '8') { run(async () => { await say('Records Board racks: every backup, every restore point, every deletion request, and who asked.'); }); return true; }
  if (ch === 'Y') { run(rhDesk); return true; }
  return false;
}
async function rhTalk(npc) {
  if (!RH_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.rhMet && npc.map === 'records') { await say('Odile is the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'odile': await odileTalk(); break;
    case 'nico': await nicoTalk(); break;
    case 'hester': await hesterTalk(); break;
    case 'deshawn': await deshawnTalk(); break;
    case 'leona': await leonaTalk(); break;
    case 'tobias': await tobiasTalk(); break;
    case 'margit': await rhBoardScript(); break;
  }
}
async function rhDesk() {
  const f = G.f;
  const ready = (f.rhCreds && !f.rhNight1) || (f.rhDrill2 && !f.rhNight2) || (f.rhBoard && !f.rhNight3) || f.rhBoss;
  if (!ready) { await say('Your desk in the corner of the restore lab. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your Records Hall desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.rhCreds && !f.rhNight1) {
    f.rhNight1 = true;
    await say('Day ' + G.day + ', 07:35. The file-share rule fired overnight on FS-02: thousands of renamed files in the Planning share. Odile wants you.');
  } else if (f.rhDrill2 && !f.rhNight2) {
    f.rhNight2 = true;
    await say('Day ' + G.day + ', 07:52. The endpoint protection on PLAN-LT-04, a planner’s laptop, stopped an encryptor at 02:21. There’s a ransom note on the desktop. Odile is on her way in.');
  } else if (f.rhBoard && !f.rhNight3) {
    f.rhNight3 = true;
    await say('Day ' + G.day + ', 06:55. Your phone: Odile. “The stacks are dark. Everything is dark. Come in.”');
  }
}

/* ---------- Arrival ---------- */
async function rhArrive() {
  const who = 'Odile Brennan', f = G.f;
  RH(); G.rh.day0 = G.day;
  await say('Day ' + G.day + '. Records Hall: the stacks of file servers, a vault with a backup appliance and an empty tape shelf, a restore lab nobody uses, and two centuries of town records.');
  await say('You’re the Tier 2 from Market Square? Odile Brennan, records and infrastructure. Everything the town has ever written down lives in this building, one way or another.', who);
  await say('Three problems. Every night the backups say Success, and nobody has ever restored one. The backups open with the same domain admin password as everything else. And nobody has agreed with the people who own these services how long they can be down, or how much they can lose.', who);
  await say('You stay Tier 2, and you get a new responsibility: you own the recovery decisions here. What comes back, in what order, from which copy.', who);
  G.targets.rhTest = 100; G.targets.rhRto = 100; G.targets.rhRpo = 100; G.targets.rhOffline = 100; G.targets.rhTtc = 30;
  f.rhMet = true; track();
  touchCSF('Recover');
  await say('New on your scorecard: restore test success, recovery times against the agreed objectives, data loss against them, offline copies, and mean time to contain. Start (Enter) shows them.', who);
  await say('First, find out whether the backups work at all. Nico is setting up the restore lab, south-west.', who);
}
async function odileTalk() {
  const f = G.f, who = 'Odile Brennan';
  if (!f.rhTest) { await say('The restore lab, south-west. Find out whether a backup actually restores, and how long it takes.', who); return; }
  if (!f.rhBia) { await say('Deshawn owns permits. Ask him what “down” means to him, in hours.', who); return; }
  if (!f.rhOffline || !f.rhCreds) { await say('The vault, north-east. Nico has the keys.', who); return; }
  if (!f.rhNight1) { await say('Go home. The backups run at one, as they always have. This time we know they restore.', who); return; }
  if (!f.rhDrill1) { await rhDrill1(); return; }
  if (!f.rhDirective) { await say('Leona from finance is looking for you. Budget season.', who); return; }
  if (!f.rhDrill2) { await say('Nico has his morning report, in the vault.', who); return; }
  if (!f.rhNight2) { await say('Go home. Tomorrow will come soon enough.', who); return; }
  if (!f.rhDrill3) { await rhDrill3(); return; }
  if (!f.rhBoard) { await say('Margit runs the Records Board, through the east door. Tobias’s Dojo first, if you want it.', who); return; }
  if (!f.rhNight3) { await say('The hunt has checked 9 of our 31 servers for the tools from PLAN-LT-04 (game). The directory review is booked behind it, for tomorrow. Go home.', who); return; }
  if (!f.rhBoss) { await rhBossScript(); return; }
  await say('Every system back, from copies we proved clean, in the order we planned. The IT Basement is next.', who);
  await rhSummary();
}

/* ---------- Fieldwork: the timed restore test ---------- */
async function rhRestoreLab() {
  const f = G.f;
  if (!f.rhMet) { await say('A restore lab: three benches on their own network. Odile should show you around first.'); return; }
  if (!f.rhTest) { await rhRestoreTest(); return; }
  const t = RH().tests;
  await say('The restore lab, on its own isolated network. Restore tests so far: ' + t.filter(x => x.ok).length + ' of ' + t.length + ' passed.' + (f.rhBoss ? ' The next test is booked for next month, on the directory.' : ''));
}
async function rhRestoreTest() {
  const who = 'Nico Varga', c = RH();
  await say('Every backup here has said Success for three years. Not one has ever been restored. I’d like to know before I need to.', who);
  while (true) {
    const i = await choose('How do you test the backups?', [
      {label: 'Restore real systems into the isolated lab, time each one end to end, and have its owner check the data', meta: {good: true}},
      {label: 'Read the job reports: green means it works'},
      {label: 'Restore over the live permits server tonight, to make it real'},
      {label: 'Restore one small file from each job'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Green means the job finished. It doesn’t say you can restore from it, or how long it takes.');
    else if (i === 2) await say('If it fails, you’ve caused the outage you were testing for. That’s what the isolated lab is for.');
    else await say('A file proves the file. A service also needs its settings, its disks, its database, and the clock running.');
  }
  RH_TESTS.forEach(t => c.tests.push(Object.assign({}, t)));
  const rows = RH_TESTS.map(t => '<tr><td>' + esc(t.name) + '</td><td>' + t.hours + ' h</td><td>' + (t.ok ? 'pass' : '<b>fail</b>') + '</td></tr><tr><td colspan="3" class="small">' + esc(t.note) + '</td></tr>').join('');
  await UI.openModal('Restore tests', '<p class="big">' + RH_TESTS.filter(t => t.ok).length + ' of ' + RH_TESTS.length + ' passed</p><table class="sc"><tr><th>System</th><th>Time</th><th>Result</th></tr>' + rows + '</table>' +
    '<p>Every one of those jobs said Success. A restore test finds what a job report can’t. (Times are game hours.)</p>', [{label: 'Fix it and test again', meta: {good: true}}], {closable: false, cls: 'drill'});
  c.tests.push(Object.assign({}, RH_RETEST));
  G.f.rhTest = true; unlock('act', 'restoretest'); touchCSF('Protect'); track();
  await say('Second disk added to the APP-01 job, restored again: it starts. Restore test success rate: ' + rhTestRate() + '%. The failure goes on the scorecard too: that one would have hurt.', who);
  await say('And 5.5 hours for the permits database: is that fine? Nobody can say. Nobody ever agreed how long it may be down. Deshawn owns permits; he’s just come in.', who);
}

/* ---------- Fieldwork: business impact analysis, RTO and RPO ---------- */
async function deshawnTalk() {
  const who = 'Deshawn Pruitt', f = G.f;
  if (!f.rhBia) { await rhBia(); return; }
  if (f.rhBoss) { await say('Permits came back inside sixteen hours, and I checked the records myself. Two days of paper forms, re-entered. I can live with that.', who); return; }
  await say('Twice-a-day backups for the permits database now. Twelve hours of paper is the most my clerks can re-enter.', who);
}
async function rhBia() {
  const who = 'Deshawn Pruitt', c = RH();
  await say('Permits, deeds, licences: if the database is down, inspections stop and nobody can build anything. Ask me what you need.', who);
  // 1. The critical list: owners say what stops; the dependencies count too.
  const items = RH_SERVICES.map(s => ({label: s.name, meta: {good: s.crit}})).concat([{label: 'This is the critical list', done: true, meta: {done: true}}]);
  const body = '<p>A business impact analysis, lite: what stops when each service stops, and how soon it hurts. Pick the <b>five</b> that go on the critical list.</p>' +
    shownOrder(RH_SERVICES, items).map(s => '<div class="card"><b>' + esc(s.name) + '</b><br><span class="small">' + esc(s.owner) + '</span></div>').join('');
  const sel = await UI.openModal('Business impact analysis', body, items, {shuffle: true, multi: 5, closable: false, cls: 'drill'});
  const picked = sel.map(i => RH_SERVICES[i].id), right = picked.filter(id => RH_SERVICES.find(s => s.id === id).crit).length;
  if (right < 5) await say('Close. The directory and DNS: no resident ever sees them, and nothing on the list restores without them. A critical list includes the systems the critical services depend on.', 'Odile Brennan');
  c.crit = RH_SERVICES.filter(s => s.crit).map(s => s.id);
  // 2. Recovery objectives for the permits database, agreed with its owner.
  while (true) {
    const i = await choose('The permits database: how long may it be down, and how much may it lose?', [
      {label: 'Ask Deshawn when the harm starts (a day without inspections), set the RTO under that at 16 hours, and an RPO of 12 hours: back it up twice a day', meta: {good: true}},
      {label: 'Zero downtime and zero data loss, for everything'},
      {label: 'IT decides: 72 hours is what we can do'},
      {label: 'Whatever the nightly job gives us: up to a day of lost work'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Possible, for a price nobody here would pay, and not needed: Deshawn can run on paper for a day. Objectives come from what the business can bear.');
    else if (i === 2) await say('Then IT has decided how long inspections stop, without asking. And 72 hours is far past the day Deshawn can bear.');
    else await say('That lets the backup schedule decide the business’s risk. Deshawn’s clerks can re-enter half a day from paper, not a whole day: the schedule should follow that.');
  }
  c.obj = true; c.dbTwice = true;
  const rows = RH_SYS_ORDER.map(s => '<tr><td>' + esc(RH_SYS_NAME[s]) + '</td><td>' + RH_OBJ[s].mtd + ' h</td><td>' + RH_OBJ[s].rto + ' h</td><td>' + RH_OBJ[s].rpo + ' h</td></tr>').join('');
  await UI.openModal('Recovery objectives', '<p>Agreed with each owner (game hours). The RTO sits inside the owner’s limit; the RPO sets how often each system is backed up.</p>' +
    '<table class="sc"><tr><th>System</th><th>Owner’s limit (MTD)</th><th>RTO</th><th>RPO</th></tr>' + rows + '</table>' +
    '<p>NIST SP 800-34 Rev. 1: the recovery time objective is how long a system can be in recovery before it harms the mission; the recovery point objective is the point in time to which data must be recovered; and because the RTO must not let the maximum tolerable downtime be exceeded, it is normally shorter.</p>' +
    '<p>(SP 800-34 sets an MTD for a mission or business process; a system’s limit here is the tightest MTD of the processes that need it.)</p><p>Measured against these, your restore tests cover three of the five within their RTOs. The directory and DNS have never been tested.</p>', [{label: 'Agreed', meta: {good: true}}], {closable: false, cls: 'drill'});
  G.f.rhBia = true; unlock('act', 'rtorpo'); unlock('act', 'bia'); unlock('fact', 'sp80034'); touchCSF('Identify'); touchCSF('Govern'); track();
  await say('Sixteen hours. I can tell my inspectors that. Nobody’s ever asked me before.', who);
}

/* ---------- Fieldwork: copies the attacker can't reach, and separate credentials ---------- */
async function rhVaultTile() {
  const f = G.f;
  if (!f.rhMet) { await say('A backup appliance. Odile should show you around first.'); return; }
  if (!f.rhBia) { await say('The backup appliance. Restore tests and recovery objectives first: you can’t decide what to protect, or how, until you know what matters.'); return; }
  if (!f.rhOffline) { await rhOfflineCopy(); return; }
  if (!f.rhCreds) { await rhCredsStep(); return; }
  if (rhQtReady()) { await rhQtVault(); return; }
  await say('The backup console: separate admin accounts, MFA on every change or deletion, retention locked. Last night’s jobs: all green, and all the usual sizes.');
}
async function nicoTalk() {
  const f = G.f, who = 'Nico Varga';
  if (!f.rhTest) { await say('The restore lab first. I’ll meet you there.', who); return; }
  if (!f.rhOffline || !f.rhCreds) { await say('The appliance is beside me. Let’s fix what an attacker would go for first.', who); return; }
  if (f.rhDirective && !f.rhDrill2) { await rhDrill2(); return; }
  if (f.rhDrill2 && !f.rhBoss) { await say('Every job now alerts if it reads far more or far less than usual. And the storage team’s checklist has a line for me.', who); return; }
  if (f.rhBoss) { await say('Two attacker accounts tried the console that night, and the lock refused every delete. I’ve never been so glad to be refused.', who); return; }
  await say('Backups at one, alerts on anything odd. The rest is restore tests.', who);
}
async function rhOfflineCopy() {
  const who = 'Nico Varga', c = RH();
  await say('One appliance, one copy, in this room, reachable from the network with a domain admin password. That’s our whole backup.', who);
  while (true) {
    const i = await choose('How many copies, and where?', [
      {label: 'Three copies on two kinds of storage, one offsite, and one the network can’t reach: production, the appliance with a retention lock, and weekly encrypted tapes for the offsite store', meta: {good: true}},
      {label: 'A second copy on the same appliance'},
      {label: 'Copy everything to cloud storage mapped as a drive on the file server'},
      {label: 'One copy is enough: the appliance has redundant disks'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Same box, same room, same password. One fire or one stolen password takes both.');
    else if (i === 2) await say('Anything the file server can write to, ransomware on the file server can encrypt. A backup the network can always reach is not the one that saves you.');
    else await say('Redundant disks survive a dead disk. They copy a deletion or an encryption faithfully.');
  }
  await say('3-2-1 is the old rule of thumb: three copies, two kinds of storage, one offsite. It never said “offline”, so we add that: one copy ransomware can’t reach.', who);
  c.offline = 80; track();
  while (true) {
    const i = await choose('The tapes will be encrypted. Where does the key live?', [
      {label: 'In the key vault, with an escrowed copy sealed in the offsite store, and a test restore using only the escrowed key', meta: {good: true}},
      {label: 'In the backup server’s settings, where the software can find it'},
      {label: 'Nowhere: don’t encrypt the tapes, they’re offsite anyway'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('If ransomware takes the backup server, it takes the only key with it, and every tape becomes noise.');
    else await say('Tapes travel, and tapes get lost. CISA’s #StopRansomware Guide asks for offline, encrypted backups of critical data.');
  }
  c.keyEscrow = true;
  while (true) {
    const i = await choose('Coverage check: 4 of the 5 critical systems are on the weekly tapes. The directory’s job writes to the appliance only.', [
      {label: 'Add the directory’s backup to the weekly tapes', meta: {good: true}},
      {label: 'Leave it: the directory is small and easy to rebuild'}], {shuffle: true});
    if (i === 0) break;
    await say('Every account, group and policy the town has is in it, and nothing else signs anyone in without it. Rebuilding it from memory takes weeks.');
  }
  c.offline = 100;
  G.f.rhOffline = true; unlock('act', 'offline321'); unlock('act', 'keyescrow'); unlock('fact', 'rule321'); unlock('fact', 'srguide'); touchCSF('Protect'); track();
  await say('First tapes are writing. They leave on Monday’s courier, and the key’s escrow envelope goes with them, in a separate bag. (game)', who);
}
async function rhCredsStep() {
  const who = 'Nico Varga';
  await say('Last one, and the worst. The backup console signs in with domain accounts. Any domain admin can delete every backup we have, including one an attacker has stolen.', who);
  while (true) {
    const i = await choose('How should the backup system be run?', [
      {label: 'Separate backup admin accounts that exist only on the backup system, MFA on any change or deletion, alerts on mass deletes and retention changes, and no domain accounts at all', meta: {good: true}},
      {label: 'Change the domain admin password'},
      {label: 'Move the console to an unusual port'},
      {label: 'Give backup rights to fewer domain admins'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('A new password is stolen the same way as the old one. The point is that a domain password shouldn’t open the backups at all.');
    else if (i === 2) await say('Attackers scan every port. Hiding the door isn’t a lock.');
    else await say('Fewer, but still domain accounts. Steal one and you have the backups.');
  }
  G.f.rhCreds = true; unlock('act', 'backupcreds'); unlock('fact', 'ncscbk'); touchCSF('Protect'); track();
  await say('Done. Two backup admin accounts, both on hardware keys. The old domain group is gone from the console. And I’ve rotated every password the backup server uses to reach the servers it copies: the old ones lived in the console for anyone with a domain account to read.', who);
  await say('That’s the fieldwork. Long day: your desk is in the corner of the restore lab.', 'Odile Brennan');
}

/* ---------- Hester (the archivist) ---------- */
async function hesterTalk() {
  const who = 'Hester Quayle', f = G.f;
  if (!f.rhDrill1) { await say('The new document system arrives a department at a time. Nico keeps the schedule; I keep the retention schedule. Between us, nothing gets thrown away by accident.', who); return; }
  if (!f.rhBoss) { await say('Phase 3 is Finance, next week. The change ticket goes to your queue this time, so nobody panics at a few thousand renamed files.', who); return; }
  await say('Two centuries of minutes, and the only copies that survived that night were the ones nobody could delete. I’ve put that in the minutes.', who);
}

/* ---------- The directive (game): cut backup storage costs by 40% ---------- */
async function leonaTalk() {
  const who = 'Leona Ferraro', c = RH(), f = G.f;
  if (f.rhDirective) { await say('Forty percent, and the tapes stay. I can defend that to the council.', who); return; }
  await say('Finance. Backup storage is the fastest-growing line in the IT budget, and the council wants it down by forty percent this year. (game)', who);
  while (true) {
    const i = await choose('How do you cut backup storage costs by 40%?', [
      {label: 'Tier it with the owners: nightly copies kept 14 days, weeklies 8 weeks, monthlies a year (weeklies and monthlies on the offline tapes), stop backing up scratch space and duplicates, and keep enough history to reach back before an intruder arrived', meta: {good: true, k: 'tier'}},
      {label: 'Keep only 7 days of backups', meta: {k: 'week'}},
      {label: 'Drop the offline tapes: the appliance has copies', meta: {k: 'tapes'}},
      {label: 'Back up weekly instead of nightly', meta: {k: 'weekly'}}], {shuffle: true});
    if (i === 0) { c.directive = 'tier'; break; }
    if (i === 1) await say('If an intruder has been in for longer than a week, every copy you keep contains them, and there is no clean copy to go back to.');
    else if (i === 2) await say('The offline copy is the one ransomware can’t reach. It’s the last thing to cut, not the first.');
    else await say('The permits database’s RPO is twelve hours. Weekly backups could lose a week of permits.');
  }
  G.f.rhDirective = true; unlock('act', 'retention'); touchCSF('Govern'); track();
  await say('Fewer copies of what nobody needs, and the same protection for what we do. Forty percent. Fine.', who);
  await say('(Retention, cost and RPO pull against each other. Keep history longer than an intruder is likely to hide, keep the offline copy, match the schedule to each owner’s RPO, and cut what nobody needs.)');
}

/* ---------- Drills ---------- */
async function rhDrill(key) {
  const c = RH(), up = Math.max(1, c.day0 - 8);
  const raw = JSON.stringify(RH_DRILLS[key]).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day)).replace(/\{U\}/g, String(up));
  const D = JSON.parse(raw);
  const r = await doDrill(D);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  return r;
}
async function rhDrill1() {
  const who = 'Odile Brennan';
  await say('Twelve thousand renamed files in the Planning share overnight. Do I wake up the whole town, or is this something we did?', who);
  const r = await rhDrill('rename');
  G.f.rhDrill1 = true; touchCSF('Detect');
  await say(r.verdictOk ? 'The migration. Good: I didn’t wake anyone. Hester’s next phase goes to your queue before it runs.' : 'Nico checked: the migration tool, its own account, its own server, under the ticket, and every shadow copy still there. Hester’s next phase goes to your queue first.', who);
  await say('Leona from finance has been asking for you. Budget season.', who);
}
async function rhDrill2() {
  const who = 'Nico Varga';
  await say('Last night’s FS-01 job: Success, 41 GB. It’s normally over two terabytes. Have we lost data, or has someone been at the job?', who);
  const r = await rhDrill('shrink');
  G.f.rhDrill2 = true; unlock('fact', 'csfbk'); touchCSF('Detect');
  await say(r.verdictOk ? 'A coverage gap, not an attack. F: is in the job, a full backup is running, and every job now alerts when its size jumps or drops.' : 'Odile walked me through it: the shares moved to F:, the job only ever read E:. F: is in the job now, and every job alerts on its size.', who);
}
async function rhDrill3() {
  const who = 'Odile Brennan', c = RH();
  await say('PLAN-LT-04. The encryption was stopped at 312 files. The note says they have 200 GB of ours, and a forum is already talking. Before I call anyone: did they take anything?', who);
  c.d3Day = G.day;
  const r = await rhDrill('stolen');
  G.f.rhDrill3 = true; touchCSF('Respond');
  await say(r.verdictOk ? 'Three point eight gigabytes of planning applications, not two hundred of everything. Legal has the list; the FBI and CISA have the report; hd-admin is disabled, SCAN-01 is isolated, and the hunt for the rest of their tools has started.'
    : 'Nico traced it: 3.8 GB of planning applications, packed and uploaded from PLAN-LT-04 before the encryptor ran. Legal has the list; the FBI and CISA have the report; hd-admin is disabled, SCAN-01 is isolated, and the hunt has started.', who);
}

/* ---------- Cryptography Dojo ---------- */
async function tobiasTalk() {
  const who = 'Tobias Lund', f = G.f;
  if (!f.rhDojoMet) {
    f.rhDojoMet = true;
    await say('Cryptography Dojo. National Cyber League-style puzzles, about the maths that protects backups, and the maths that holds them hostage.', who);
    await say('Three terminals: encoding, hashing and encryption; why ransomware uses two kinds of cipher; and what happens to an encrypted backup when you lose its key. Solve all three and your identity tool levels up.', who);
    return;
  }
  if (f.rhDojoDone) { await say('Encoding hides nothing. Hashes don’t reverse. Keys are part of the backup.', who); return; }
  await say('Puzzles solved: ' + RH().dojo.filter(Boolean).length + ' of 3. Terminals to my left.', who);
}
async function rhDojoPuzzle(i) {
  if (!G.f.rhDojoMet) { await say('A cryptography practice terminal. Talk to Tobias first.'); return; }
  const p = RH_DOJO[i], c = RH();
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await UI.openModal('Cryptography · ' + p.title, '<pre class="art">' + esc(p.art) + '</pre><p><b>' + esc(p.q) + '</b></p>', p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true, closable: false, cls: 'drill'});
    if (k === p.good) break;
    await say('Not quite. Who can turn it back, and with what?');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; unlock('fact', i === 2 ? 'keymgmt' : 'cryptostd'); if (i === 2) unlock('act', 'keyescrow'); touchCSF('Protect');
  if (c.dojo.every(Boolean)) {
    G.f.rhDojoDone = true;
    const t = G.party.find(p2 => TOOLS[p2.id].cls === 'identity');
    if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Tobias Lund'); }
    else await say('All three. You can read a ransom note’s maths now. That’s rarer than it should be.', 'Tobias Lund');
    await evolveCheck();
  }
}

/* ---------- Evolution: Cairn -> Bulwark once you have restored from a clean point ---------- */
async function rhEvolveCheck() {
  if (!G.f || !G.f.rhBoss || !G.rh) return;
  const t = G.party.find(p => p.id === 'cairn');
  if (!t) return;
  t.id = 'bulwark'; t.lvl = Math.max(t.lvl, 6); touchCSF('Recover');
  await say('Cairn is evolving! Cairn learns to line the evidence up against the restore points → Bulwark. New ability: Find the clean point.');
}

/* ---------- Records Board ---------- */
async function rhBoardScript() {
  const who = 'Margit Halloran', f = G.f;
  if (f.rhBoard) { await say('The Vault Badge means the way back holds, whatever they take. Test it anyway. Every month.', who); return; }
  if (!f.rhDrill3) { await say('The Records Board is for people who have worked a few real recovery cases. Finish with Odile’s team first.', who); return; }
  await say('Margit Halloran, recovery lead. Attackers who want a ransom go for your way back first. Here you meet them.', who);
  await say('Three rounds: the ways back disappear, gigabytes leave for the cloud at two in the morning, and the backup share is wiped. Ready?', who);
  for (const s of RH_BOARD_SPECS()) await fightStory(s, 'Margit: Again. Protect the way back before you chase anything else.');
  f.rhBoard = true; f.rhVault = true;
  G.focusMax = Math.max(G.focusMax, 42); G.focus = G.focusMax;
  unlock('tech', 'T1490'); unlock('tech', 'T1567.002'); unlock('tech', 'T1485');
  track();
  await say('You cleared the Records Board. This is the Vault Badge.', who);
  await say('Its power: the backups can’t be deleted by attackers on the map, so threats that destroy data or the ways back (Inhibit System Recovery, Data Destruction) come half as often, and the unindexed corners of the stacks shrink as they’re catalogued. (game)', who);
  addTool('cairn', 5);
  await say('One more thing: Cairn, a backup and recovery tool you can take into an investigation. It knows every copy you have, and which ones no one can delete. (Cairn Lv 5)', who);
  await say('Your rank stays Tier 2 incident responder. What changes is what you answer for: when it all goes dark, the recovery is yours.', who);
  touchCSF('Recover');
  await evolveCheck();
}

/* ---------- Boss: the stacks go dark (retold in outline from the City of Atlanta, March 2018) ---------- */
function rhBossStages(picks, d) {
  const ev0 = picks.includes('preserve') ? 20 : 0;
  const d3 = RH().d3Day || (d.B - 1);
  return {
    s1: {kind: 'mal', threat: 'gloam', tech: 'T1486', tags: ['files'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('isolate') ? 9 : 14, dwell0: 20,
      title: 'Stage 1: the stacks go dark', host: 'FS-01, FS-02 and every server the policy reached', enemy: {spr: 'gloam', pal: 'gloam'},
      clues: ['At ' + RH_ENCRYPT + ' a scheduled task started the same program on every server except the directory and FS-03, an old server outside the group the policy targets. Files are renamed and turned to noise, and a ransom note sits in every share.', 'At 02:38 every volume shadow copy on the file servers was deleted, by svc-scanbak, a domain admin account nobody on the team created.', 'The task came from a new group policy, “Printer Mapping Update”, created by svc-scanbak at ' + RH_GPO + ' last night.'],
      truth: 'Data Encrypted for Impact, pushed to every server at once through group policy, after the shadow copies were deleted (Inhibit System Recovery). Pushing the task through a group policy is Group Policy Modification, ATT&CK T1484.001.',
      resp: [{label: 'Isolate the servers at the switch and keep them powered for memory capture, disable svc-scanbak, unlink the policy, keep the backup network sealed, preserve evidence', good: true},
             {label: 'Restore the file shares from last night now', good: false, why: 'Last night’s copies were taken after the policy went out at ' + RH_GPO + ': whole-server restores bring the scheduled task back. Contain first.'},
             {label: 'Pull the power on everything', good: false, disrupt: 1, why: 'Isolate at the switch first; power down only what you can’t disconnect. Memory evidence goes when the power does.'}],
      chain: [{at: 40, text: 'Another share fills with ransom notes.'}, {at: 75, text: 'The encryptor reaches the scanned-image archive.'}]},
    s2: {kind: 'mal', threat: 'lapse', tech: 'T1490', tags: ['backup', 'host'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('verify') ? 8 : 13, dwell0: picks.includes('reconnect') ? 40 : 15,
      title: 'Stage 2: they come for the backups', host: 'BKP-01 · backup appliance and console', enemy: {spr: 'lapse', pal: 'lapse'},
      clues: ['At 02:44 svc-scanbak tried to sign in to the backup console. Refused: it isn’t a backup account. Before the fieldwork, any account in the old domain group could.', 'At 02:46 it tried to delete the appliance’s copies over the network. The retention lock refused every request, and every refusal raised an alert.', picks.includes('reconnect') ? 'The tapes were loaded into the library this morning to speed things up: the one copy they couldn’t reach is on the network now.' : 'The weekly tapes are in the offsite store, offline. Their key is in escrow.'],
      truth: 'Inhibit System Recovery: going after the backups before the ransom demand. The separate credentials and the retention lock held.',
      resp: [{label: 'Keep the backup network sealed, check the locked and offline copies are intact and unchanged before any restore, and keep the tapes offline until identity is ours again', good: true},
             {label: 'Bring the tapes in now to check them', good: false, why: 'Not while svc-scanbak still works. The offline copy is the one thing they can’t reach: keep it that way until identity is yours again.'},
             {label: 'Clear the alerts: they’re only refusals', good: false, why: 'The refusals are the attacker telling you what they want. Keep every one.'}],
      chain: [{at: 60, text: 'svc-scanbak tries a second way into the appliance.'}]},
    s3: {kind: 'mal', threat: 'lapse', tech: 'T1078', tags: ['identity'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('identity') ? 8 : 14, dwell0: picks.includes('identity') ? 10 : 40,
      title: 'Stage 3: they still sign in', host: 'DIR-01 · directory', enemy: {spr: 'actor', pal: 'impostor'},
      clues: ['At 07:20 adm-bk2, an admin account nobody on the team knows, signs in to the directory from FS-03, an old file server outside the policy’s group, so never encrypted or isolated, and one the hunt hadn’t reached: it had checked 9 of 31 servers when the encryption began.', 'adm-bk2 and svc-scanbak were both created on DIR-01 on Day ' + d.E + ', at 02:33 and 02:31, by hd-admin, from SCAN-01. The directory review from the PLAN-LT-04 case was booked behind the server hunt: one query (every account created, or added to an admin group, since hd-admin was first misused) would have found both on Day ' + d3 + '.', 'SCAN-01’s endpoint history: a remote-management tool installed under hd-admin on Day ' + d.E + ' at 02:12. The earliest sign of the attacker anywhere.'],
      truth: 'Valid Accounts: a second admin account the attacker made days before anyone noticed them. Disabling the one you saw wasn’t enough: the directory itself is compromised, so identity is rebuilt before anything that trusts it. Making those accounts is Create Account: Domain Account, ATT&CK T1136.002.',
      resp: [{label: 'Disable adm-bk2 and every account created since Day ' + d.E + ', reset every privileged and service password from a clean admin workstation, isolate FS-03, and plan the directory’s restore from before Day ' + d.E + ' 02:12', good: true},
             {label: 'Disable adm-bk2 and close', good: false, why: 'That is the second account you have found, not the last one you can prove. Find everything created since Day ' + d.E + ', and plan to restore the directory from before it.'},
             {label: 'Reset hd-admin’s password again', good: false, why: 'hd-admin was disabled and reset on Day ' + d3 + '. The attacker made their own accounts: find and remove what they created.'},
             {label: 'Restore the directory from last night', good: false, why: 'Last night’s directory holds svc-scanbak and the policy. Go back to before the earliest compromise.'}],
      chain: [{at: 60, text: 'adm-bk2 lists every admin group.'}]}
  };
}
// The restore-order mini-game. Pure helpers first (tested directly), then the UI.
function rhLossHours(o, d) { return o.atH !== undefined ? o.atH : Math.round(((d.B - d[o.atD]) * 24 + 1.67) * 10) / 10; }
function rhNextGood(done) { return RH_SYS_ORDER.find(s => !done[s] && RH_RESTORE[s].deps.every(x => done[x])); }
// One restore step: returns what happened and the hours it used (game rules, see GAME_NOTES).
function rhRestoreStep(st, sys, optK, d) {
  const S = RH_RESTORE[sys], o = S.opts.find(x => x.k === optK);
  const missing = S.deps.filter(x => !st.done[x]);
  if (missing.length) { st.clock += RH_DEP_WASTE; st.depFail++; return {kind: 'dep', missing: missing}; }
  if (o.tainted) { st.clock += o.hrs + RH_REINFECT_WASTE; st.reinfect++; return {kind: 'reinfect', why: o.why}; }
  st.clock += o.hrs;
  const loss = rhLossHours(o, d), ob = RH_OBJ[sys];
  st.done[sys] = {end: st.clock, opt: optK, loss: loss, rtoOk: st.clock <= ob.rto, rpoOk: loss <= ob.rpo};
  return {kind: 'ok', end: st.clock, loss: loss};
}
function rhRestoreSummary(st) {
  const sys = RH_SYS_ORDER.map(s => st.done[s]).filter(Boolean);
  return {clock: st.clock, reinfect: st.reinfect, depFail: st.depFail, rtoMet: sys.filter(x => x.rtoOk).length, rpoMet: sys.filter(x => x.rpoOk).length,
    order: st.order.slice(), done: st.done, overrun: !!st.overrun};
}
function rhEvidenceHtml(d) {
  return '<div class="card small"><b>What the evidence says</b><br>' + [
    'Day ' + d.E + ' 02:12: a remote-management tool installed on SCAN-01 under hd-admin. The earliest known compromise.',
    'Day ' + d.E + ' 02:31 and 02:33: svc-scanbak and adm-bk2, two new domain admins, created on DIR-01 from SCAN-01.',
    'Day ' + (d.B - 1) + ' ' + RH_GPO + ': svc-scanbak creates a group policy that adds a scheduled task to every server except the directory and FS-03.',
    'Day ' + d.B + ' ' + RH_ENCRYPT + ': the task starts the encryptor on those servers. Nightly backups ran at 01:00.',
    'Golden images of every server build, checked last quarter, kept offline (game).'].map(esc).join('<br>') + '</div>';
}
async function rhRestoreGame(d) {
  const st = {done: {}, clock: 0, reinfect: 0, depFail: 0, order: [], overrun: false};
  let last = '';
  for (let guard = 0; guard < 60; guard++) {
    const left = RH_SYS_ORDER.filter(s => !st.done[s]);
    if (!left.length) break;
    if (st.clock >= RH_RESTORE_BUDGET) {
      // Out of crew time: the vendor's emergency team finishes the rest, cleanly, late. (game)
      st.overrun = true;
      for (const s of RH_SYS_ORDER.filter(x => !st.done[x])) { const g = RH_RESTORE[s].opts.find(o => o.good); st.clock += g.hrs; st.done[s] = {end: st.clock, opt: g.k, loss: rhLossHours(g, d), rtoOk: false, rpoOk: rhLossHours(g, d) <= RH_OBJ[s].rpo}; }
      await say('Your crew is out of hours. The vendor’s emergency team finishes the rest overnight, from clean copies, and well past every RTO. (game)');
      break;
    }
    const next = rhNextGood(st.done);
    const prog = '<table class="sc"><tr><th>System</th><th>Needs</th><th>RTO</th><th>Status</th></tr>' + RH_SYS_ORDER.map(s => '<tr><td>' + esc(RH_SYS_NAME[s]) + '</td><td>' + esc(RH_RESTORE[s].deps.map(x => x.toUpperCase()).join(', ') || '—') + '</td><td>' + RH_OBJ[s].rto + ' h</td><td>' + (st.done[s] ? 'back at ' + st.done[s].end + ' h' : '—') + '</td></tr>').join('') + '</table>';
    const body = (last ? '<p><b>' + esc(last) + '</b></p>' : '<p>One restore crew, ' + RH_RESTORE_BUDGET + ' hours of crew time (game). Pick what to restore next, then which copy to restore it from. The clock starts when recovery starts.</p>') +
      '<p>Hour <b>' + st.clock + '</b> of ' + RH_RESTORE_BUDGET + ' · reinfections ' + st.reinfect + ' · out-of-order starts ' + st.depFail + '</p>' + prog + rhEvidenceHtml(d);
    const items = left.slice().sort((a, b) => RH_SYS_NAME[a].localeCompare(RH_SYS_NAME[b])).map(s => ({label: RH_SYS_NAME[s], note: 'RTO ' + RH_OBJ[s].rto + ' h', meta: {good: s === next, sys: s}}));
    const i = await UI.openModal('Restore order · hour ' + st.clock, body, items, {closable: false, cls: 'drill'});
    const sys = items[i].meta.sys;
    const S = RH_RESTORE[sys];
    const optItems = S.opts.map(o => ({label: rhFill(o.label, d), note: o.hrs + ' h', meta: {good: !!o.good, k: o.k}}));
    const j = await UI.openModal('Restore point · ' + RH_SYS_NAME[sys], '<p>Which copy of <b>' + esc(RH_SYS_NAME[sys]) + '</b> do you restore? Its RPO is ' + RH_OBJ[sys].rpo + ' hours of lost data.</p>' + rhEvidenceHtml(d), optItems, {shuffle: true, closable: false, cls: 'drill'});
    const k = optItems[j].meta.k;
    st.order.push(sys + ':' + k);
    const r = rhRestoreStep(st, sys, k, d);
    if (r.kind === 'dep') last = RH_SYS_NAME[sys] + ' started, then stopped: it can’t work without ' + r.missing.map(x => RH_SYS_NAME[x]).join(' and ') + '. An hour lost.';
    else if (r.kind === 'reinfect') last = RH_SYS_NAME[sys] + ' came back, and then went dark again. ' + rhFill(r.why, d) + ' Its restore time is lost.';
    else last = RH_SYS_NAME[sys] + ' is back at hour ' + r.end + ', with ' + r.loss + ' hours of data lost.';
  }
  const sum = rhRestoreSummary(st);
  const rows = RH_SYS_ORDER.map(s => { const x = st.done[s], ob = RH_OBJ[s], o = RH_RESTORE[s].opts.find(y => y.k === x.opt);
    return '<tr><td>' + esc(RH_SYS_NAME[s]) + '</td><td>' + x.end + ' h / ' + ob.rto + ' h ' + (x.rtoOk ? '✓' : '✗') + '</td><td>' + x.loss + ' h / ' + ob.rpo + ' h ' + (x.rpoOk ? '✓' : '✗') + '</td></tr>' +
      '<tr><td colspan="3" class="small">' + esc(rhFill(o.why, d)) + '</td></tr>'; }).join('');
  await UI.openModal('Recovery', '<p class="big">' + sum.rtoMet + ' of 5 within RTO · ' + sum.rpoMet + ' of 5 within RPO</p>' +
    '<p>Reinfections <b>' + sum.reinfect + '</b> · out-of-order starts <b>' + sum.depFail + '</b> · crew hours <b>' + sum.clock + '</b> (game)</p>' +
    '<table class="sc"><tr><th>System</th><th>Back at / RTO</th><th>Data lost / RPO</th></tr>' + rows + '</table>' +
    '<p>Find the earliest known compromise first. The directory comes back from before it, and misses its RPO on purpose: the account changes since then are re-entered from the tickets. Everything else is rebuilt from golden images, patched, with only its data restored, newest first, in dependency order. That data was copied after the attacker arrived, so it is scanned for their tools before anyone uses it. Last night’s whole-server copies were the fastest, and they carried the attacker’s scheduled task.</p>',
    [{label: 'Declare recovery complete', meta: {good: true}}], {closable: false, cls: 'drill'});
  return sum;
}
async function rhPayDecision() {
  const c = RH(), who = 'Odile Brennan';
  await say('The note wants 9 bitcoin for the key (game), and threatens to publish the planning files. Leadership will decide, with legal, and they want your recommendation.', who);
  const opts = [
    {label: 'Recommend not paying, subject to the check now under way: the appliance’s copies are retention-locked and the weekly tapes are offsite with their key in escrow; we verify both before promising any RTO (the directory has never been test-restored). The FBI and CISA are already involved, and legal checks OFAC’s advisory before anyone talks payment', meta: {good: true, k: 'no'}},
    {label: 'Pay now: it’s faster than restoring', meta: {k: 'pay'}},
    {label: 'Pay only to keep the planning files from being published', meta: {k: 'publish'}},
    {label: 'Negotiate quietly, without telling the FBI', meta: {k: 'quiet'}}];
  while (true) {
    const i = await choose('Your recommendation on the ransom.', opts, {shuffle: true});
    const k = opts[i].meta.k;
    if (!c.pay) c.pay = k;
    if (k === 'no') break;
    if (k === 'pay') await say('The FBI doesn’t support paying: it doesn’t guarantee you get anything back, and it encourages more attacks. OFAC can penalise a payment to a sanctioned party on strict liability, whatever you knew. And we have tested, clean copies.');
    else if (k === 'publish') await say('There is no way to check that a criminal deleted anything. The 3.8 GB is already being handled as a possible breach: legal decides who must be told, and we tell them from our own evidence. Paying buys a promise from the people who stole it.');
    else await say('OFAC treats prompt reporting to law enforcement and full cooperation as significant mitigating factors. Hiding it gives those up, and the FBI may know things about this crew that you don’t.');
  }
  unlock('fact', 'ofac'); unlock('fact', 'fbipay'); unlock('act', 'nopayplan'); touchCSF('Govern');
  await say('Leadership agrees: no payment. Atlanta refused too, in 2018, when the attackers asked for $51,000 in Bitcoin, and its mayor later told Congress that some files were destroyed for good. Refusing has a cost; tested, clean copies are what keep it small. The US government strongly discourages paying either way.', who);
}
async function rhBossScript() {
  const who = 'Odile Brennan', c = RH();
  await surfaceMissed(true);
  c.boss = {day: G.day};
  const d = rhDays();
  await say('Incident. At ' + RH_ENCRYPT + ' last night ransomware ran on almost every server we have: the file servers, the records database, the permits portal, DNS. Only the directory was left alone; the attacker still needed it. Ransom notes in every share.', who);
  await say('This is the City of Atlanta, March 2018, in outline. On 22 March ransomware took down city systems. The mayor later told Congress that fire, police, ambulances and water kept running, but the municipal court cancelled hearings, the 311 line went offline, and some files were destroyed for good. In November that year the Justice Department charged two Iranian men over SamSam, the ransomware behind it, which the indictment tied to more than 200 victims.', who);
  unlock('fact', 'atl2018'); unlock('fact', 'samsam');
  await say('I’ve told leadership, legal and our cyber insurer, whose policy asks for early notice (game). The town has reported it to the FBI field office and CISA, as the #StopRansomware Guide advises. Residents get a notice on the radio and at the front desk: what’s down, and how to get services on paper meanwhile. Telling people is never optional, so it isn’t one of your cards.', who);
  touchCSF('Respond'); G.rep += 5; toast('Leadership, the FBI and CISA told. Reputation up.');
  await say('Tabletop. Pick four response cards. Then we work it in three stages, and you own the recovery.', who);
  const items = RH_CARDS.map(x => ({label: x.name, meta: {good: !!x.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions, the #StopRansomware Guide and the NIST CSF. (Leadership, the FBI and CISA have been told.)</p>' +
    shownOrder(RH_CARDS, items).map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const sel = await UI.openModal('Tabletop: the stacks go dark', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => RH_CARDS[i].id);
  G.f.rhCards = picks;
  for (const id of picks) { const x = RH_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('poweroff')) { G.rep -= 2; bumpUptime(-0.01); }
  if (picks.includes('wipe')) { G.rep -= 3; bumpUptime(-0.02); }
  if (picks.includes('latest')) { G.rep -= 3; bumpUptime(-0.03); await say('Nico restored three servers from last night’s copies before anyone stopped him. Within the hour the scheduled task ran on them again, and they went dark a second time.'); }
  if (picks.includes('reconnect')) { G.rep -= 2; }
  await say('Debrief: isolate at the switch and keep machines powered, preserve before you clean, verify every copy before you trust it, and take identity back before you restore anything that trusts it. Restoring fast from last night would have brought the attacker’s policy back with it: last night’s copies were made after it went out.', who);
  c.bossT0 = G.playMs;
  const S = rhBossStages(picks, d);
  await fightStory(S.s1, 'Odile: Regroup. Same stage, again.');
  c.ttc.push(Math.round((G.playMs - c.bossT0) / 100) / 10); if (c.ttc.length > 20) c.ttc.shift();
  touchCSF('Respond');
  await rhPayDecision();
  await fightStory(S.s2, 'Odile: Regroup. Same stage, again.');
  await fightStory(S.s3, 'Odile: Regroup. Same stage, again.');
  await say('Identity is ours again: svc-scanbak, adm-bk2 and one more account made since Day ' + d.E + ' are disabled, every privileged and service password is new, FS-03 is isolated. Now the recovery: you decide what comes back, in what order, from which copy.', who);
  unlock('act', 'cleanpoint'); unlock('act', 'goldimage'); unlock('act', 'restoreorder');
  const sum = await rhRestoreGame(d);
  c.restore = sum;
  c.boss = {day: d.B, picks: picks, rtoMet: sum.rtoMet, rpoMet: sum.rpoMet, reinfect: sum.reinfect, depFail: sum.depFail, clock: sum.clock, pay: c.pay};
  G.f.rhBoss = true;
  touchCSF('Recover');
  bumpUptime(sum.reinfect ? 0 : 0.01); G.rep += sum.reinfect ? 0 : 3; track();
  await say('Recover: each owner checked their system before it went back into use (Deshawn read twenty permits against the paper files). The copies were verified before we restored from them; the restored systems were verified after. Recovery is declared complete, and residents hear it from the same places they heard the bad news.', who);
  await say('The cost goes on the record too. Atlanta’s mayor put theirs at about $7.2 million by the time she testified, more than a year later. Ours is smaller because the way back held. (game)', who);
  await evolveCheck();
  await say('That’s Records Hall. Next stop: the IT Basement.', who);
  await rhSummary();
}

/* ---------- End of district ---------- */
async function rhSummary() {
  await surfaceMissed(true);
  G.f.rhSummary = true;
  const c = RH(), d = c.drills;
  const dl = ['rename', 'shrink', 'stolen'].map(k => esc(RH_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const r = c.restore;
  const body = '<p class="big">Records Hall district: recovered.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key Badge, Seal Badge, Shield Badge, Lantern Badge' + (G.f.rhVault ? ', Vault Badge' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '. Restore tests passed: <b>' + c.tests.filter(x => x.ok).length + ' of ' + c.tests.length + '</b>.</p>' +
    (r ? '<p>Ransomware recovery: <b>' + r.rtoMet + ' of 5</b> systems within RTO, <b>' + r.rpoMet + ' of 5</b> within RPO (the directory restored from before the compromise, by design), reinfections <b>' + r.reinfect + '</b>, out-of-order starts <b>' + r.depFail + '</b> (game). Ransom: <b>' + ({no: 'not paid; recommended from tested backups', pay: 'not paid (you first said pay)', publish: 'not paid (you first said pay to stop publication)', quiet: 'not paid (you first said negotiate quietly)'}[c.pay] || '—') + '</b>.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    rhQtSummaryHtml() +
    '<p class="big">Next: IT Basement.</p>';
  Series.markEdition(EDITION.id, {done: true, mailRoom: true, clerksRow: true, marketSquare: true, recordsHall: true});
  const i = await UI.openModal('End of Records Hall', body, [{label: 'Keep exploring Records Hall', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
