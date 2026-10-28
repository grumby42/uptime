/* ============================================================
   UPTIME · editions/town-hall/server-story.js
   Town Hall district 7, the Server Room (identity infrastructure / Active
   Directory): state, objectives, interactions, talk, the fieldwork (privileged
   accounts and PAWs, the service-account registry, LAPS and Protected Users,
   the directory audit policy, the tiering mini-game), the least-privilege
   directive, three investigation drills, the Assessment Findings area, the
   Server Board (Crown Badge, Tier 3 lead investigator, Keyling -> Tessera), the
   boss domain-compromise incident, the Quiet Thread clue, Tier 3 scorecard
   metrics and the end-of-district summary.
   Everything the player reads is the defender's view: records, alerts,
   ownership and remediation. The Basement story chains here (svObjective via
   bmObjective). The engine hooks the earlier districts wrap are wrapped again:
   each wrapper calls the previous version, then adds the Server Room.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Server Room: MITRE ATT&CK v20 (T1558.003, T1098.007, T1021.002, T1550.002, T1550.003, T1003.006, T1558.001; Quiet Thread T1078.002). Microsoft Learn: AD DS tier model and the enterprise access model; Group Managed Service Accounts; Windows LAPS; Protected Users Security Group; Defender for Identity unconstrained-delegation assessment; Microsoft Entra Connect accounts and permissions; event 4769 (encryption type 0x17 RC4, 0x11/0x12 AES), 4768, 4624 logon types, 4728/4729, 4732/4733, 4756/4757, 5136, 4662, 4697. CISA Eviction Strategies CM0050 (reset krbtgt twice) and AR21-134A; joint advisory AA20-245A; ASD-led Detecting and Mitigating Active Directory Compromises (September 2024).';
}

/* ---------- State ---------- */
function SV() {
  if (!G.sv) G.sv = {day0: G.day, priv: SV_PRIV0, owned: SV_SVC_OWNED_BEFORE, cross: SV_TIER_BEFORE, led: 0,
    svc: null, tier: null, drills: {}, finds: [false, false, false], directive: null, boss: null, scope: []};
  return G.sv;
}
function svOn() { return !!(G && G.f && G.f.svMet && G.sv); }
function inServer() { return SV_MAPS.includes(G.map); }
function svOwnPct() { const c = SV(); return Math.round(c.owned / SV_SVC_TOTAL * 100); }
// Mean time to scope (game hours): fewer hours the more Basement logging was collected; worse while Tier 0 holds everyday accounts.
function svMtts() {
  const c = SV();
  const srcFull = (G.bm && G.bm.src) ? Object.values(BM_DISTRICT_SOURCES.basement).filter ? BM_DISTRICT_SOURCES.basement.filter(s => G.bm.src[s]).length : 0 : 0;
  return Math.round(6 - Math.min(2, srcFull) + (c.priv > SV_PRIV0_AFTER ? 4 : 0));
}

/* ---------- Engine hooks (wrapping the Basement versions) ---------- */
const _svPrevAlertWeight = alertWeight, _svPrevAlertHost = alertHost, _svPrevBriefList = briefList, _svPrevDecorate = alertDecorate,
  _svPrevMetricVals = editionMetricVals, _svPrevScoreHtml = editionScoreHtml, _svPrevPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _svPrevAlertWeight(t, w);
  if (THREATS[t].district === 'server' && !(G.f && G.f.svMet)) return 0;
  if (G.f && G.f.svMet && inServer() && SV_HOME.includes(t)) w *= 3;
  // Crown Badge: lateral-movement encounters halved map-wide.
  if (G.f && G.f.svCrown && (THREATS[t].tags || []).includes('lateral')) w *= 0.5;
  return w;
};
alertHost = function () { return (G.f && G.f.svMet && inServer()) ? pick(SV_HOSTS) + ' · Server Room' : _svPrevAlertHost(); };
briefList = function () { const L = _svPrevBriefList(); return (G.f && G.f.svMet) ? L.concat(SV_BRIEFS) : L; };
alertDecorate = function (spec) { _svPrevDecorate(spec); };
editionMetricVals = function () {
  const v = _svPrevMetricVals();
  if (!svOn()) return v;
  const c = SV();
  return Object.assign(v, {svPriv: c.priv, svOwn: svOwnPct(), svCross: c.cross, svMtts: svMtts(), svLed: c.led});
};
EDITION_METRICS.push(
  {k: 'svPriv', label: 'Privileged (Tier 0) accounts', unit: '', higher: false, lower: true, when: svOn},
  {k: 'svOwn', label: 'Service accounts with a named owner', unit: '%', higher: true, when: svOn},
  {k: 'svCross', label: 'Tier-crossing sign-ins a day', unit: '', higher: false, lower: true, when: svOn},
  {k: 'svMtts', label: 'Mean time to scope an incident, modelled (game hours)', unit: ' h', higher: false, lower: true, when: svOn},
  {k: 'svLed', label: 'Investigations led end to end', unit: '', higher: true, when: svOn}
);
editionScoreHtml = function () {
  let h = _svPrevScoreHtml();
  if (!svOn()) return h;
  const c = SV();
  if (G.f.svDirective) h += '<p class="dir">Directive: svc-permits keeps running, but out of Domain Admins, on the vendor’s documented rights only, with Hugo’s signed risk acceptance. (game)</p>';
  h += '<p>Server Room: Crown Badge <b>' + (G.f.svCrown ? 'yes' : 'not yet') + '</b> · Tier 0 accounts <b>' + c.priv + '</b> (was ' + SV_PRIV0 + ')' +
    ' · service accounts owned <b>' + svOwnPct() + '%</b> · tiering <b>' + (G.f.svTier ? 'crossings closed' : 'control flows downward') + '</b>' +
    (G.f.svAudit ? ' · directory audit <b>on</b>' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _svPrevPeekExtra();
  e.svSummary = !!(G.f && G.f.svSummary);
  e.sv = G.sv ? {priv: G.sv.priv, owned: G.sv.owned, own: svOwnPct(), cross: G.sv.cross, led: G.sv.led, svc: G.sv.svc, tier: G.sv.tier,
    drills: G.sv.drills, finds: G.sv.finds, directive: G.sv.directive, boss: G.sv.boss, mtts: svMtts()} : null;
  return e;
};
function svTile(d, ch, x, y) {
  if (ch === '9' && G.f.svPaw) d.pal = 'svPawOk';
  if (ch === '!' && G.f.svAudit) d.pal = 'svCageOk';
  if (ch === ';' && G.f.svCrown && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  return d;
}

/* ---------- Objective ---------- */
function svObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'server', x: x, y: y, district: 'server'});
  if (!f.svMet) return at('Next: the Server Room. The door is the west wall of the IT Basement; your Beacon Badge opens it.', 14, 7, 'server');
  if (!f.svPriv) return at('Fieldwork: everyday accounts are domain admins. Beatriz, in the identity office.', 14, 7);
  if (!f.svSvc) return at('Fieldwork: service accounts with old passwords and no owners. Tamsin, at the registry.', 23, 2);
  if (!f.svPaw) return at('Fieldwork: admins read email on the machines they administer from. An admin workstation in the room to the north.', 11, 1);
  if (!f.svAudit) return at('Fieldwork: no auditing on directory changes or Kerberos. The domain controllers’ cage.', 2, 1);
  if (!f.svTier) return at('Fieldwork: control flows downward. The tiering whiteboard in the identity office.', 16, 7);
  if (!f.svNight1) return at('End your shift at your Server Room desk.', 12, 13);
  if (!f.svDrill1) return at('Beatriz has a burst of service-ticket requests.', 14, 7);
  if (!f.svDirective) return at('Hugo Pereira wants a word about svc-permits.', 18, 7);
  if (!f.svDrill2) return at('A privileged group was changed and changed back. Beatriz.', 14, 7);
  if (!f.svNight2) return at('End your shift at your desk.', 12, 13);
  if (!f.svDrill3) return at('A replication request came from a server. Tamsin.', 23, 2);
  if (!f.svFindDone) {
    if (!f.svFindMet) return at('(Optional) Review the assessment findings with Sana.', 10, 11);
    const i = SV().finds.findIndex(x => !x);
    return at('(Optional) Assessment finding ' + (i + 1) + ' of 3.', [3, 5, 7][i], 11);
  }
  if (!f.svBoard) return at('Take the Server Board challenge (Mara Ellison, through the east door).', 8, 2, 'svboard');
  if (!f.svNight3) return at('End your shift at your desk.', 12, 13);
  if (!f.svBoss) return at('Beatriz needs you: a replication request that only a domain controller should make.', 14, 7);
  if (!f.svFile) return at('Rae wants a word about svc-print. By the identity office.', 16, 7);
  return {text: 'Server Room secured. Next: the Water Plant.', done: true, district: 'server'};
}

/* ---------- Triggers and interactions ---------- */
let svEarlyWarned = false;
function svTriggers() {
  if (G.map !== 'server') return false;
  if (!G.f.bmBoss) {
    if (svEarlyWarned) return false;
    svEarlyWarned = true;
    run(async () => { await say('Beacon Badge, so the door opens. But the Basement isn’t finished: the suspicion file goes to Rae first. The directory will keep.', 'Beatriz Solano'); });
    return true;
  }
  if (!G.f.svMet) { run(svArrive); return true; }
  return false;
}
function svInteract(ch, tx, ty) {
  if (!inServer()) return false;
  if (ch === '!') { run(svCage); return true; }
  if (ch === '9') { run(svPawTile); return true; }
  if (ch === '(') { run(svRegistry); return true; }
  if (ch === ')') { run(svWhiteboard); return true; }
  if (ch === '/') { run(() => svFinding([3, 5, 7].indexOf(tx))); return true; }
  if (ch === ':') { run(async () => { await say('Server Board racks: every account the town trusts, what it may touch, and who answers for it.'); }); return true; }
  if (ch === 'Y') { run(svDesk); return true; }
  return false;
}
async function svTalk(npc) {
  if (!SV_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.svMet && npc.map === 'server') { await say('Beatriz is the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'beatriz': await beatrizTalk(); break;
    case 'tamsin': await tamsinTalk(); break;
    case 'ravim': await ravimTalk(); break;
    case 'hugo': await hugoTalk(); break;
    case 'sana': await sanaTalk(); break;
    case 'marael': await svBoardScript(); break;
    case 'raesv': await raeServerTalk(); break;
  }
}
async function svDesk() {
  const f = G.f;
  const ready = (f.svTier && !f.svNight1) || (f.svDrill2 && !f.svNight2) || (f.svBoard && !f.svNight3);
  if (!ready) { await say('Your desk in the Server Room, under the cage’s cold air. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your Server Room desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.svTier && !f.svNight1) {
    f.svNight1 = true;
    await say('Day ' + G.day + ', 07:30. The RC4-ticket rule fired overnight: one workstation asked for service tickets for every service account. Beatriz wants you.');
  } else if (f.svDrill2 && !f.svNight2) {
    f.svNight2 = true;
    await say('Day ' + G.day + ', 09:00. The replication rule fired: a server that isn’t a domain controller asked to replicate directory data. Tamsin’s at the registry.');
  } else if (f.svBoard && !f.svNight3) {
    f.svNight3 = true;
    await say('Day ' + G.day + ', 03:05. Your phone: Beatriz. “A replication request from APP-03. It’s not a DC. Come down.”');
  }
}

/* ---------- Arrival ---------- */
async function svArrive() {
  const who = 'Beatriz Solano', f = G.f;
  SV(); G.sv.day0 = G.day;
  await say('Day ' + G.day + '. The Server Room: the domain controllers in a locked cage, the admin workstations, a registry of service accounts nobody has read in years, and the whiteboard where we draw who controls what.');
  await say('You’re the Tier 3 who ran the Basement? Beatriz Solano, identity team. If the directory falls, everything falls: it decides who every other system trusts.', who);
  await say('Four problems. Everyday accounts are domain admins. Service accounts have old passwords and broad rights, and half have no owner. Admins read email on the same machines they administer servers from. And nothing audits the directory or Kerberos.', who);
  await say('You stay Tier 3. Clear the Server Board and the change is in what you answer for: you lead investigations end to end, incident commander for the technical scope.', who);
  G.targets.svPriv = SV_PRIV0_AFTER; G.targets.svOwn = 100; G.targets.svCross = 0; G.targets.svMtts = 4; G.targets.svLed = 3;
  f.svMet = true; track();
  touchCSF('Identify');
  await say('New on your scorecard: privileged accounts, service accounts with an owner, tier-crossing sign-ins, mean time to scope, and investigations led. Start (Enter) shows them.', who);
  await say('Start with me, at the whiteboard: who holds domain-admin rights, and why.', who);
}
async function beatrizTalk() {
  const f = G.f, who = 'Beatriz Solano';
  if (!f.svPriv) { await beatrizPriv(); return; }
  if (!f.svSvc) { await say('Tamsin has the service-account registry, in the north-east. Twenty-three accounts, nine owners.', who); return; }
  if (!f.svPaw) { await say('The admin-workstation room, north. Separate admin accounts, and machines that never touch email.', who); return; }
  if (!f.svAudit) { await say('The cage, north-west. Turn on the auditing so we can see a change when it happens.', who); return; }
  if (!f.svTier) { await svTiering(); return; }
  if (!f.svNight1) { await say('Go home. Tonight the service accounts have owners and the admins have their own workstations.', who); return; }
  if (!f.svDrill1) { await svDrill1(); return; }
  if (!f.svDirective) { await say('Hugo from Permits is looking for you. It’s about svc-permits. It’s always svc-permits.', who); return; }
  if (!f.svDrill2) { await svDrill2(); return; }
  if (!f.svDrill3) { await say('Tamsin has the replication alert from this morning.', who); return; }
  if (!f.svBoard) { await say('Mara runs the Server Board, through the east door. The assessment findings first, if you want them.', who); return; }
  if (!f.svNight3) { await say('Go home. The directory is in better shape than it has ever been. Keep watching it.', who); return; }
  if (!f.svBoss) { await svBossScript(); return; }
  if (!f.svFile) { await say('Rae came down. She’s by the office, and she wants to talk about svc-print.', who); return; }
  await say('Separate accounts, owned services, one way in for admins. The Water Plant is next.', who);
  await svSummary();
}

/* ---------- Fieldwork 1: privileged accounts (Tier 0) ---------- */
async function beatrizPriv() {
  const who = 'Beatriz Solano', c = SV();
  await say('Seventeen accounts in Domain Admins and the other Tier 0 groups. Nine of them are people’s everyday accounts: the ones they also read email with.', who);
  while (true) {
    const i = await choose('How do you bring Tier 0 down to what it needs?', [
      {label: 'Give each admin a separate Tier 0 account and remove the everyday ones; the break-glass account stays; svc-permits waits on the directive', meta: {good: true}},
      {label: 'Make everyone in Tier 0 use a longer password and turn on MFA, but leave the memberships, so nobody loses the access they rely on day to day'},
      {label: 'Remove everyone except two senior admins today, so the group is as small as possible, and let the rest ask for access back when something breaks'},
      {label: 'Leave the memberships as they are and just watch Tier 0 closely, with these trusted staff and the tiering work left for a later phase'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('MFA helps, but an everyday account that is also a domain admin still exposes Tier 0 every time it opens an attachment. Split the roles.');
    else if (i === 2) await say('Cutting blind to two breaks the jobs the other seven do and teaches people to work around you. Give each a separate admin account instead.');
    else await say('Watching a domain admin read email doesn’t stop the credential leaking. Separate the admin role onto its own account.');
  }
  c.priv = SV_PRIV0_AFTER; track();
  G.f.svPriv = true; unlock('act', 'adminsplit'); touchCSF('Protect'); touchCSF('Identify');
  await say('Nine everyday accounts out of Tier 0; separate admin accounts created. Five members left: three human admins, the break-glass account, and svc-permits, pending Hugo’s directive. (game)', who);
  await say('Now the service accounts. Tamsin, at the registry in the north-east.', who);
}

/* ---------- Fieldwork 2: the service-account registry ---------- */
async function svRegistry() {
  const f = G.f, c = SV();
  if (!f.svMet) { await say('A ledger of service accounts. Beatriz should show you around first.'); return; }
  if (!f.svPriv) { await say('The service-account registry. Beatriz wants the Tier 0 groups looked at first.'); return; }
  if (f.svSvc) { await say('The registry: ' + svOwnPct() + '% of service accounts have a named owner now, each with a plan to manage its password.'); return; }
  await svRegistryBuild();
}
async function tamsinTalk() {
  const f = G.f, who = 'Tamsin Fry';
  if (!f.svPriv) { await say('Beatriz first, at the whiteboard. Then the registry: I’ll meet you here.', who); return; }
  if (!f.svSvc) { await svRegistryBuild(); return; }
  if (f.svDrill2 && f.svNight2 && !f.svDrill3) { await svDrill3(); return; }
  if (f.svBoss) { await say('Every service account has an owner and a plan now. The one I can’t fix is svc-print: it answers to facilities, but its rights answer to nobody.', who); return; }
  await say('Twenty-one accounts kept, each with an owner. Nine on gMSAs, the rest on long vault passwords, rotated. Two retired. One flagged for Rae.', who);
}
async function svRegistryBuild() {
  const who = 'Tamsin Fry', c = SV();
  await say('Twenty-three accounts behave like service accounts. Nine have an owner: thirty-nine percent. The rest, nobody can say who runs them or when their password last changed.', who);
  await say('First, an owner for every one. Then a plan for each password. Let me show you the three ways.', who);
  for (const p of SV_SVC_PLAN) {
    const keys = SV_SVC_PLAN.map(x => x.k);
    const items = keys.map(k => ({label: SV_SVC_PLAN.find(x => x.k === k).label, meta: {good: k === p.k, k: k}}));
    const body = '<div class="card"><b>When does this plan fit?</b><br>' + esc(p.why) + '</div>';
    while (true) {
      const i = await UI.openModal('Service-account plan', body, items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.k === p.k) break;
      await say('Read what that plan is for again: ' + SV_SVC_PLAN.find(x => x.k === items[i].meta.k).why);
    }
    await say(p.why);
  }
  // The svc-permits exception and the Quiet Thread clue.
  await say('Two accounts I can’t close cleanly. svc-permits is a domain admin for a vendor app; Hugo won’t let us rotate its 2019 password until the vendor confirms. That’s your directive later.', who);
  await svQtNesting();
  c.owned = SV_SVC_TOTAL - 2; track();   // all 21 kept get owners; 2 retired
  G.f.svSvc = true; unlock('act', 'svcreg'); unlock('fact', 'svgmsa'); touchCSF('Identify'); touchCSF('Protect');
  await say('Owners for all twenty-one kept accounts; two retired. Nine moved to gMSAs, twelve on long vault passwords, rotated, svc-permits excepted. ' + svOwnPct() + '% owned. (game)', who);
  await say('Now the admins’ workstations. The room to the north.', who);
}

/* ---------- Fieldwork 3: PAWs, LAPS and Protected Users ---------- */
async function svPawTile() {
  const f = G.f;
  if (!f.svMet) { await say('An admin workstation. Beatriz should show you around first.'); return; }
  if (!f.svSvc) { await say('The admin-workstation room. The registry first.'); return; }
  if (!f.svPaw) { await svPaws(); return; }
  await say('A privileged access workstation: hardened, no email, no web. The three admin accounts sign in only from here, and LAPS rotates the local password on every machine.');
}
async function ravimTalk() {
  const f = G.f, who = 'Ravi Menon';
  if (!f.svPaw) { if (f.svSvc) { await svPaws(); return; } await say('Beatriz and Tamsin first. Then come talk about how we admins actually work.', who); return; }
  if (f.svBoss) { await say('My old laptop was where it started. Separate accounts and a PAW now; it would never reach the directory from my mail machine today.', who); return; }
  await say('a-rmenon signs in from the PAW only now. Took moving to a second machine, but I sleep better.', who);
}
async function svPaws() {
  const who = 'Ravi Menon', c = SV();
  await say('Here’s how we work: my everyday laptop does email and web, and I administer servers from it with my admin account. All three of us do.', who);
  while (true) {
    const i = await choose('How do you separate administration from everyday work?', [
      {label: 'A separate admin account for each of us, used only from a hardened PAW with no email or web; LAPS for local passwords; human admins in Protected Users after a test', meta: {good: true}},
      {label: 'Keep one account each but lock the laptops down hard: full-disk encryption, a strict firewall, and no local admin for anyone but us'},
      {label: 'Keep one account each and put everyone, including the service and computer accounts, into Protected Users, which blocks the weak authentication that attackers rely on to move around'},
      {label: 'Give the admins a second laptop for email, so the everyday work moves off the admin machine and the admin account stays as it is'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('A locked-down laptop that still reads email is still where a credential leaks. The admin account needs its own machine, not a tougher shared one.');
    else if (i === 2) await say('Protected Users is right for the human admins, but never for service or computer accounts: their secrets live on the host anyway, so it only breaks them. And one account doing both jobs is the problem.');
    else await say('Two laptops for one account still lets the admin credential land on the email machine. Separate the account, then give it a PAW.');
  }
  c.cross = Math.max(0, c.cross - 20); track();
  G.f.svPaw = true; unlock('act', 'laps'); unlock('act', 'protusers'); unlock('fact', 'svlaps'); unlock('fact', 'svprot'); touchCSF('Protect');
  await say('Three Tier 0 PAWs, one each. Admin accounts sign in only from them; each password reset as it moves. LAPS rotates local passwords. The three human admins go in Protected Users after a test; never the service or computer accounts. (game)', who);
  await say('Now the cage: turn on the auditing, so a change to the directory leaves a record.', who);
}

/* ---------- Fieldwork 4: the directory audit policy ---------- */
async function svCage() {
  const f = G.f, c = SV();
  if (!f.svMet) { await say('The domain controllers, behind glass and a card reader. Beatriz should show you around first.'); return; }
  if (!f.svPaw) { await say('The DC cage. The accounts and workstations first; then turn on the auditing here.'); return; }
  if (f.svAudit) { await say('The cage: auditing on for Kerberos, logons, group changes, directory changes and service installs. Rules alert on privileged-group changes, non-DC replication, and RC4 tickets.'); return; }
  await svAudit();
}
async function svAudit() {
  const who = 'Beatriz Solano';
  const rows = SV_AUDIT.map(a => '<tr><td>' + esc(a.id) + '</td><td>' + esc(a.name) + '</td></tr>').join('');
  await UI.openModal('Directory and Kerberos audit policy', '<p>The events to turn on, so a change to the directory leaves a record (game). Before now, there were none of the 5136/4662 object events, so what changed a domain object last month cannot be recovered.</p>' +
    '<table class="sc"><tr><th>Event</th><th>What it records</th></tr>' + rows + '</table>' +
    '<p class="small">5136 and 4662 need a SACL on the object; 4769 shows the ticket encryption type (0x17 RC4, 0x11/0x12 AES).</p>', [{label: 'Turn it on', meta: {good: true}}], {closable: false, cls: 'drill'});
  while (true) {
    const i = await choose('Which rules do you write on top of the audit?', [
      {label: 'Alert on privileged-group changes (add and remove), on replication requests from any non-DC, and on RC4 (0x17) service tickets', meta: {good: true}},
      {label: 'Alert on every 4624 logon, so no sign-in anywhere goes unseen and the picture is always complete'},
      {label: 'Alert only on failed sign-ins, since a successful one with a real password is normal and a failure is the real sign of an attack'},
      {label: 'Alert on every 5136 directory change and review each edit to each object by hand the next morning'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Every logon is millions of events a day and almost all of them are normal. Alert on the few changes that matter, and keep the rest to search.');
    else if (i === 2) await say('The worst identity attacks succeed with a real password: nothing fails. Failures matter, but the privileged-group change and the non-DC replication are the alerts that catch a quiet compromise.');
    else await say('Every object change is far too much to read by hand. Keep 5136 to search; alert on the privileged-group and replication changes specifically.');
  }
  G.f.svAudit = true; unlock('act', 'diraudit'); unlock('fact', 'ev4769'); unlock('fact', 'ev4662'); touchCSF('Detect');
  await say('Auditing on: Kerberos, logons, group changes, directory changes with a SACL, and service installs. From here, these events exist; before today they didn’t. (game)', who);
  await say('Last piece before the night shift: the whiteboard. Let’s draw who controls what, and where control flows the wrong way.', who);
}

/* ---------- Fieldwork 5: the tiering mini-game ---------- */
async function svWhiteboard() {
  const f = G.f;
  if (!f.svMet) { await say('A whiteboard covered in boxes and arrows. Beatriz should show you around first.'); return; }
  if (!f.svAudit) { await say('The tiering whiteboard. The audit policy first: you’ll want to see a crossing when it happens.'); return; }
  if (!f.svTier) { await svTiering(); return; }
  await say('The whiteboard: five crossings closed. Control flows up the tiers now, never down. Tier-crossing sign-ins a day: ' + SV().cross + ', from ' + SV_TIER_BEFORE + '.');
}
async function svTiering() {
  const who = 'Beatriz Solano', c = SV();
  await say('The whiteboard. Tier 0 is the directory and what rules it; Tier 1 the servers; Tier 2 the workstations and the people who support them. Five places control runs the wrong way. Fix each.', who);
  for (const cr of SV_TIER_CROSS) {
    const opts = [{label: cr.fix, meta: {good: true}}].concat(cr.bad.map(b => ({label: b, meta: {good: false}})));
    const body = '<div class="card"><b>Crossing</b><br>' + esc(cr.text) + '</div>';
    while (true) {
      const i = await UI.openModal('Tiering · ' + cr.id, body, opts, {shuffle: true, closable: false, cls: 'drill'});
      if (opts[i].meta.good) break;
      await say('That leaves control flowing downward. ' + cr.why);
    }
    await say(cr.why);
  }
  c.cross = 0; track();
  G.f.svTier = true; unlock('act', 'tiering'); unlock('fact', 'svtier'); touchCSF('Protect'); touchCSF('Identify');
  await say('Five crossings closed: PAWs for admins, the help desk off Server Admins, the backup account split along the tier line, the sync server treated as Tier 0, the DC monitoring on its own collector. Tier-crossing sign-ins a day: ' + SV_TIER_BEFORE + ' → 0. (game)', who);
  await say('That’s the fieldwork. Your desk is by the terminals. Tonight the directory keeps a record, and the admins have one way in.', who);
}

/* ---------- The directive (game): svc-permits stays a domain admin "because it broke last time" ---------- */
async function hugoTalk() {
  const who = 'Hugo Pereira', c = SV(), f = G.f;
  if (f.svDirective) { await say('Out of Domain Admins, on the vendor’s rights, with my signature on the risk. If it breaks, that’s on me, in writing. Fair.', who); return; }
  await say('Hugo Pereira, head of Permits. Leave svc-permits alone. It’s a domain admin, yes, and its password is from 2019. Last time someone touched it, permits went down for a day. Don’t.', who);
  await say('The permits system is how residents pay. I can’t have it down. So it stays exactly as it is.', who);
  while (true) {
    const i = await choose('How do you answer Hugo?', [
      {label: 'Test the vendor’s documented rights in staging with a rollback, move svc-permits out of Domain Admins to those rights, and have Hugo sign a risk acceptance', meta: {good: true, k: 'test'}},
      {label: 'Agree: leave svc-permits a domain admin with its 2019 password, since permits must stay up and the vendor hasn’t confirmed anything else works'},
      {label: 'Overrule Hugo: pull svc-permits out of Domain Admins today, because a domain-admin service account is a risk the town can’t carry whatever Permits wants'},
      {label: 'Leave the rights, but rotate the 2019 password tonight in a short window to fix at least the oldest problem even if the access stays'}], {shuffle: true});
    if (i === 0) { c.directive = 'test'; break; }
    if (i === 1) await say('A domain-admin account with a six-year-old password is the single worst thing in this room. Keeping it because it once broke isn’t a decision, it’s a deferral. Test the smaller rights.');
    else if (i === 2) await say('Pulling it blind is how it broke last time. You’re the analyst; the risk is Hugo’s to own. Give him a tested smaller set and a rollback, and let him accept what’s left.');
    else await say('Rotating the password in an agreed window is right, and you’ll do it. But leaving domain-admin rights on a vendor app is the bigger risk. Test the smaller set too.');
  }
  // Rotate first in an agreed window, then reduce rights after a test, with a signed risk acceptance.
  await say('Agreed: rotate the 2019 password at noon in a twenty-minute window Hugo picks, then test the vendor’s documented rights in staging this afternoon, with a rollback.', who);
  c.priv = Math.max(SV_PRIV0_AFTER - 1, c.priv - 1); track();
  G.f.svDirective = true; unlock('act', 'leastpriv'); touchCSF('Govern');
  await say('Rotated at noon, no outage. This afternoon it drops to the vendor’s rights in staging; if the test holds, in production, out of Domain Admins. I sign the risk for anything the test can’t cover until the vendor supports a gMSA.', who);
  await say('(Least privilege isn’t the analyst overruling the business. It’s a tested smaller set, a rollback, and the business owning what’s left.)');
}

/* ---------- Drills ---------- */
async function svDrill(key) {
  const c = SV();
  const raw = JSON.stringify(SV_DRILLS[key]).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day));
  const D = JSON.parse(raw);
  const r = await doDrill(D);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  c.led++; track();
  return r;
}
async function svDrill1() {
  const who = 'Beatriz Solano';
  await say('One workstation asked for service tickets for every service account with a name, all RC4, overnight. Kerberoasting, or the monitoring server doing its rounds? You lead this one.', who);
  const r = await svDrill('roast');
  G.f.svDrill1 = true; unlock('fact', 'ev4769'); touchCSF('Respond');
  await say(r.verdictOk ? 'Kerberoasting from PK-WS-11. Isolated, d.okonjo reset, the twelve service accounts rotating, svc-permits first.' : 'Tamsin confirmed it: PK-WS-11 used RC4 from a clerk’s account for services it never touches; MON-01 was the monitor, on AES. Rotating the roasted accounts.', who);
  await say('Hugo’s been looking for you, about svc-permits. Now’s the time: it’s first on the rotation list.', who);
}
async function svDrill2() {
  const who = 'Beatriz Solano';
  await say('A clerk was added to Server Admins and removed ten minutes later, by a help-desk account. The group looks clean now. Find out what happened in those ten minutes.', who);
  const r = await svDrill('tenmin');
  G.f.svDrill2 = true; unlock('act', 'grpaudit'); touchCSF('Respond');
  await say(r.verdictOk ? 'hd-lwong’s credential, from the front-counter PC, while Lisa was at lunch: added p.nash, read the payroll share, removed it. HD-WS-02 isolated, both accounts reset, HR and legal told.' : 'Tamsin lined it up: the change came from hd-lwong on HD-WS-02, and p.nash read 2,300 payroll files in the window. Isolated and reset.', who);
  await say('Tamsin has this morning’s replication alert when you’re ready.', who);
}
async function svDrill3() {
  const who = 'Tamsin Fry';
  await say('A server that isn’t a domain controller asked DC-01 to replicate directory data, and two gigabytes came back. Attack, or the new identity sync on its first run?', who);
  const r = await svDrill('replica');
  G.f.svDrill3 = true; unlock('fact', 'svsync'); unlock('act', 'replaudit'); touchCSF('Detect');
  await say(r.verdictOk ? 'Legitimate: the Entra Connect connector, from SYNC-02, our own Tier 0 sync server, on its first full run. We kept the rule and documented the account.' : 'The documented sync connector, not an attacker: SYNC-02 is ours, in Tier 0, and the MSOL_ account holds replication rights for password-hash sync. Rule kept; now it alerts on any OTHER account that replicates.', who);
  await say('The documented list still doesn’t include every account that could replicate, mind. That’s a lesson for later.', who);
}

/* ---------- Assessment Findings (NCL Enumeration & Exploitation, defender framing) ---------- */
async function sanaTalk() {
  const who = 'Sana Okoro', f = G.f;
  if (!f.svFindMet) {
    f.svFindMet = true;
    await say('Assessment Findings. These came from an authorised assessment, the National Cyber League’s Enumeration & Exploitation work: what an assessor found that an attacker could use.', who);
    await say('Three findings on the terminals. No methods, no tools: just the finding, and your job, which is the fix and who owns it. Read all three and your identity tool levels up.', who);
    return;
  }
  if (f.svFindDone) { await say('Least privilege, delegation you can trust, shares that answer to the right people. The assessor finds the door; you decide who holds the key.', who); return; }
  await say('Findings reviewed: ' + SV().finds.filter(Boolean).length + ' of 3. Terminals to my right.', who);
}
async function svFinding(i) {
  const f = G.f, c = SV();
  if (i < 0) return;
  if (!f.svFindMet) { await say('A review terminal. Talk to Sana first.'); return; }
  const p = SV_FINDINGS[i];
  if (c.finds[i]) { await say('Reviewed. ' + p.explain); return; }
  const opts = p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}}));
  while (true) {
    const k = await UI.openModal('Assessment finding ' + (i + 1) + ' · ' + p.title, '<div class="card"><b>Finding</b><br>' + esc(p.finding) + '</div><p><b>' + esc(p.q) + '</b></p>', opts, {shuffle: true, closable: false, cls: 'drill'});
    if (opts[k].meta.good) break;
    await say('That isn’t the remediation. Read the finding again: what rights does the thing actually need?');
  }
  const oopts = p.owner.map((o, j) => ({label: o, meta: {good: j === p.ownerGood}}));
  while (true) {
    const k = await UI.openModal('Finding ' + (i + 1) + ' · who owns the fix?', '<p>Who owns this remediation and the risk behind it?</p>', oopts, {shuffle: true, closable: false, cls: 'drill'});
    if (oopts[k].meta.good) break;
    await say('Not quite. The owner is whoever the system and its risk belong to, working with the identity team.');
  }
  await say('Correct. ' + p.explain);
  c.finds[i] = true;
  if (i === 0) unlock('act', 'leastpriv');
  if (i === 1) unlock('fact', 'svdeleg');
  if (i === 2) unlock('act', 'assessfinding');
  touchCSF('Identify');
  if (!c.finds.every(Boolean) || f.svFindDone) return;
  f.svFindDone = true;
  const t = G.party.find(x => TOOLS[x.id].cls === 'identity');
  if (t) { t.lvl++; await say('All three findings reviewed. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Sana Okoro'); }
  else await say('All three reviewed. You read a finding for the fix now, not the fright.', 'Sana Okoro');
  await evolveCheck();
}

/* ---------- Evolution: Keyling -> Tessera (at the Server Board) ---------- */
async function svEvolveCheck() {
  if (!G.f || !G.f.svBoard) return;
  const t = G.party.find(p => p.id === 'keyling');
  if (!t) return;
  t.id = 'tessera'; t.lvl = Math.max(t.lvl, 7); touchCSF('Identify');
  await say('Keyling is evolving! Keyling learns every account’s rights and who answers for them → Tessera. New ability: Trace the rights.');
}

/* ---------- Server Board ---------- */
async function svBoardScript() {
  const who = 'Mara Ellison', f = G.f;
  if (f.svBoard) { await say('The Crown Badge means a privileged-group change needs two people now, town-wide. Keep it that way.', who); return; }
  if (!f.svDrill3) { await say('The Server Board is for analysts who have worked the directory’s own cases. Finish with Beatriz’s team first.', who); return; }
  await say('Mara Ellison, identity lead. The worst intruders don’t break the directory. They become a part of it. Here you meet them.', who);
  await say('Three rounds: tickets in the night, ten minutes in a group, and a request only a domain controller should make. Ready?', who);
  for (const s of SV_BOARD_SPECS()) await fightStory(s, 'Mara: Again. The directory keeps a record now. Read it.');
  f.svBoard = true; f.svCrown = true;
  G.rank = 'Tier 3 lead investigator'; G.focusMax = Math.max(G.focusMax, 48); G.focus = G.focusMax;
  unlock('tech', 'T1558.003'); unlock('tech', 'T1098.007'); unlock('tech', 'T1003.006');
  await say('You cleared the Server Board. This is the Crown Badge.', who);
  await say('Its power: a privileged-group change now needs a second approver everywhere on the map, and attackers moving over admin shares or by hash (lateral movement) come half as often. The cabling nobody owned gets catalogued, so fewer alerts trip there. (game)', who);
  await say('Rank up: Tier 3 senior analyst → Tier 3 lead investigator. New responsibility: you lead investigations end to end, incident commander for the technical scope.');
  touchCSF('Identify');
  await evolveCheck();
}

/* ---------- Boss: a request only a domain controller should make (game-original) ---------- */
function svBossStages(picks) {
  const ev0 = picks.includes('scope') ? 20 : 0;
  const evicted = picks.includes('allatonce') && picks.includes('krbtgt') && picks.includes('cleanpaw');
  return {
    s1: {kind: 'mal', threat: 'mirror', tech: 'T1003.006', tags: ['identity'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('scope') ? 9 : 14, dwell0: 20,
      title: 'Stage 1: a request only a DC should make', host: 'DC-01 · domain controller', enemy: {spr: 'scrub', pal: 'mirror'},
      clues: ['At 03:02 DC-01 logged a replication request (event 4662 with the replication rights) from APP-03, an application server, not a domain controller.', 'The account that asked is k.hale, a Parks account whose owner has been on leave since July. It holds “Replicating Directory Changes (All)” on the domain object: a right no group grants it, an entry added directly to the ACL.', 'The right was granted on Day S-6 at 03:12, by a-rmenon from Ravi’s old laptop, while directory-change auditing (5136) was still off, so nothing recorded what was changed. a-rmenon’s password was reset when it moved to its PAW, so that copy is dead, but the ACL entry it left survived.'],
      truth: 'A DCSync-style replication from a host that is not a domain controller, by an account quietly given replication rights weeks ago. The directory’s password data is out: this is a domain compromise.',
      resp: [{label: 'Treat every credential as exposed, preserve DC-01 and APP-03, disable k.hale, remove its ACL entry, tell leadership out of band', good: true},
             {label: 'Block APP-03 from the domain controllers and close the case, since with the one host blocked no more password data can be replicated out of the domain tonight', good: false, why: 'The replication already happened: every hash is out. A block can’t recall them. Scope the domain.'},
             {label: 'Reset k.hale and remove its ACL entry, then reopen the directory now the rogue account and its rights are gone', good: false, disrupt: 1, why: 'k.hale is one way in. The hashes they already pulled, krbtgt included, are the compromise. Scope before you reset anything else.'}],
      chain: [{at: 40, text: 'k.hale’s session reaches a second domain controller.'}, {at: 75, text: 'A privileged account’s hash is used on a server.'}]},
    s2: {kind: 'mal', threat: 'relay', tech: 'T1550.002', tags: ['lateral'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('scope') ? 9 : 13, dwell0: picks.includes('scope') ? 15 : 40,
      title: 'Stage 2: scoping the blast radius', host: 'FS-04 and DB-01 · servers', enemy: {spr: 'smuggle', pal: 'relay'},
      clues: ['From APP-03, NTLM network sign-ins (4624 type 3) as svc-sql to FS-04 and DB-01 at 03:10–03:25: svc-sql’s hash came out with the replication at 03:02.', 'APP-03 itself: at 02:44 a new service was installed (4697), a kernel driver on Microsoft’s vulnerable-driver blocklist, which the servers ran in audit mode only (game), so it was logged, not blocked; the EDR agent stopped reporting at 02:46. The driver came in on IT-WS-03, Ravi’s old laptop, side-loaded through a signed updater on Day S-12.', 'The hunt finds nothing linking the earlier drills (PK-WS-11, HD-WS-02) to k.hale or IT-WS-03: those were separate cases.'],
      truth: 'Pass-the-hash with a hash taken in the replication: the intruder moving to the file and database servers. Scoping finds the origin (IT-WS-03) and the silenced agent (the vulnerable driver), and marks every host and account to reset.',
      resp: [{label: 'Scope every affected account and host, isolate them, and build the full reset list first', good: true},
             {label: 'Reset svc-sql now and close FS-04 and DB-01, since those are the servers it reached and stopping it there should contain the move for now', good: false, why: 'Reset svc-sql alone and you tip the intruder off while they still hold other hashes. Scope first, reset together.'},
             {label: 'Reimage APP-03 immediately from a clean image and put it straight back into service', good: false, disrupt: 1, why: 'Preserve APP-03 first: it holds the evidence of the driver and the origin. Reimage in the eviction, from a known-good image.'}],
      chain: [{at: 60, text: 'svc-sql’s hash is tried on a third server.'}]},
    s3: {kind: 'mal', threat: 'harvest', tech: 'T1558.001', tags: ['identity'], story: true, group: 'c', ev0: ev0,
      rate: evicted ? 8 : 14, dwell0: evicted ? 8 : 40,
      title: 'Stage 3: evict, all at once', host: 'the domain', enemy: {spr: 'burrow', pal: 'harvest'},
      clues: ['Because the krbtgt hash came out in the replication, the intruder can forge ticket-granting tickets: forged tickets would survive an ordinary password reset. The krbtgt must be reset twice, the first allowed to replicate before the second.', 'The eviction runs from the Tier 0 PAWs, in one window at 22:00: every privileged account and all 21 service accounts reset, k.hale disabled and its ACL entry removed, APP-03 and IT-WS-03 rebuilt from clean images, and the driver blocklist moved from audit to enforce on the servers.', 'Day S+4, 03:40: from IT-WS-07, a laptop the scoping missed (the same side-loaded updater), an NTLM sign-in as svc-sql with the old hash fails: the password changed. The watch rule catches it; IT-WS-07 is isolated and the scope extended. That is the return the monitoring is for.'],
      truth: 'Eviction: scope, then reset every credential and the krbtgt twice in one coordinated window from clean workstations, so no surviving ticket or hash rides back in. A forged-ticket risk is why the krbtgt is reset twice (Golden Ticket).',
      resp: [{label: 'Evict in one window from the PAWs: reset every account and the krbtgt twice, remove k.hale’s ACL entry, rebuild the two hosts, watch for the return', good: true},
             {label: 'Reset the accounts you have confirmed so far and reset the krbtgt once, then restore service and keep resetting the rest over the week as you confirm them', good: false, why: 'Piecemeal resets tip the intruder off and leave a credential to return on, and one krbtgt reset leaves forged tickets working. Reset together, krbtgt twice.'},
             {label: 'Reset every account and the krbtgt twice, but do it from the usual admin laptops to move faster, since speed matters and the eviction really has to land tonight', good: false, disrupt: 1, why: 'A reset typed on a machine that may be compromised hands the new credential straight back. Do it from clean PAWs.'}],
      chain: [{at: 60, text: 'A forged ticket is tried before the second krbtgt reset lands.'}]}
  };
}
async function svBossScript() {
  const who = 'Beatriz Solano', c = SV();
  await surfaceMissed(true);
  c.boss = {day: G.day};
  await say('DC-01 logged a replication request from APP-03 at 03:02. APP-03 is an application server, not a domain controller. Something is pretending to be one of us.', who);
  await say('This one is ours, not a retelling: a game-original domain compromise. Its outline follows documented identity-attack behaviour, a DCSync-style replication, pass-the-hash, forged tickets, and the published eviction guidance. No real victim’s case.', who);
  unlock('fact', 'svevict'); unlock('fact', 'svkrbtgt'); unlock('fact', 'svadguide');
  await say('Leadership is told, and we’re holding all of this out of band, off the network the intruder may be reading. Telling people is never optional, so it isn’t one of your cards.', who);
  touchCSF('Respond'); G.rep += 5; toast('Leadership told, out of band. Reputation up.');
  await say('Tabletop. Pick four response cards. Then we work it in three stages: scope, reset, evict.', who);
  const items = SV_CARDS.map(x => ({label: x.name, meta: {good: !!x.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions, CISA eviction guidance and the ASD-led AD-compromise guide. (Leadership has been told, out of band.)</p>' +
    shownOrder(SV_CARDS, items).map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const sel = await UI.openModal('Tabletop: a domain compromise', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => SV_CARDS[i].id);
  G.f.svCards = picks; c.scope = picks;
  for (const id of picks) { const x = SV_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('piecemeal')) G.rep -= 2;
  if (picks.includes('krbonce')) G.rep -= 2;
  if (picks.includes('watchonly')) { G.rep -= 2; bumpUptime(-0.01); }
  if (picks.includes('blockone')) G.rep -= 1;
  await say('Debrief: scope the whole blast radius before you touch anything, then reset every credential and the krbtgt twice in one window, from clean PAWs, so nothing half-reset lets them ride back in. A directory compromise is an all-at-once eviction, not a cleanup.', who);
  const S = svBossStages(picks);
  await fightStory(S.s1, 'Beatriz: Regroup. Same stage, again.');
  await fightStory(S.s2, 'Beatriz: Regroup. Same stage, again.');
  await fightStory(S.s3, 'Beatriz: Regroup. Same stage, again.');
  c.led++;
  c.boss = {day: c.boss.day, picks: picks, evicted: picks.includes('allatonce') && picks.includes('krbtgt') && picks.includes('cleanpaw')};
  G.f.svBoss = true;
  touchCSF('Recover'); unlock('tech', 'T1550.002'); unlock('tech', 'T1558.001'); unlock('act', 'evictall'); unlock('tech', 'T1021.002');
  bumpUptime(0.01); track();
  await say('Evicted: k.hale disabled and its ACL entry removed, every privileged and service account reset and the krbtgt reset twice in one window from the PAWs, APP-03 and IT-WS-03 rebuilt, the driver blocklist enforced on the servers.', who);
  await say('Day S+4, the watch rule caught the return: a failed sign-in as svc-sql with the old hash, from a laptop the scoping had missed. Isolated, scope extended. That is what the monitoring is for.', who);
  await say('Rae came down. She wants to talk about something the registry turned up that isn’t tonight’s intruder: svc-print.', who);
}

/* ---------- The Quiet Thread: svc-print's nesting, added to the file ---------- */
async function raeServerTalk() {
  const who = 'Rae Okafor', c = SV();
  if (G.f.svFile) { await say('On the file, with the rest. The same account, the same patience. We watch, and we don’t touch it without a plan. It continues.', who); return; }
  await say('The registry found how svc-print held rights everywhere: a group nested in a group, local admin across the town, added in 2019 by an account that’s been gone since 2021.', who);
  while (true) {
    const i = await UI.openModal('svc-print on the suspicion file', '<p>Tamsin traced svc-print’s rights: PRN-Mgmt, nested in SRV-Ops-Legacy, in the local Administrators group of every member server and the 2019 laptops. Added in 2019 by a.kerr-adm, an account deleted in 2021. The group-change event is long gone; the only record is the change ticket. It is the account from the Basement suspicion file. (game)</p>', [
      {label: 'Add it to the suspicion file and keep Rae’s rule: nothing changes on svc-print without her. Note what the nesting grants; don’t touch it yet', meta: {good: true, k: 'file'}},
      {label: 'Strip svc-print out of SRV-Ops-Legacy tonight and reset it: it has local admin everywhere it shouldn’t, and every night it keeps that is a night of exposure', meta: {k: 'strip'}},
      {label: 'File it as legacy cruft: a 2019 printer rollout left it over-privileged, there’s no sign it’s been used, and the account that made it is long gone', meta: {k: 'cruft'}},
      {label: 'Rebuild SRV-Ops-Legacy’s membership from scratch across every server, so the nesting is cleaned up everywhere at once tonight', meta: {k: 'rebuild'}}], {shuffle: true, closable: false, cls: 'drill'});
    const k = [0, 1, 2, 3][i];
    if (k === 0) break;
    if (k === 1) await say('It ties to tonight’s compromise and to months of quiet clues. Pulling it before we know how it’s used can warn whoever is behind it, and it breaks the printers and the 2019 laptops on the way. That’s a planned change, Rae’s call.', who);
    else if (k === 2) await say('Maybe it is cruft. But it’s the same account, the same rights-it-should-never-have, that the whole suspicion file is built on. You don’t close that as cruft. You add it to the file.', who);
    else await say('Rebuilding every server’s group membership overnight is a town-wide change with no plan and no scope. Write it up; don’t improvise it at three in the morning.', who);
  }
  c.file = {clue: 'sv-nesting', day: G.day};
  G.f.svFile = true; unlock('act', 'assessfinding'); touchCSF('Govern');
  Series.markEdition(EDITION.id, {svcPrintNesting: true});
  await say('Added. Now we know how it reached everywhere; we still don’t know who, or why, or whether it’s still moving. It goes in the file that follows you to the Water Plant.', who);
  await say('(The Quiet Thread is still on file. It continues in the next edition.)');
  await say('That’s the Server Room. Next stop: the Water Plant.', 'Beatriz Solano');
  await svSummary();
}

/* ---------- End of district ---------- */
async function svSummary() {
  await surfaceMissed(true);
  G.f.svSummary = true;
  const c = SV(), d = c.drills;
  const dl = ['roast', 'tenmin', 'replica'].map(k => esc(SV_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const body = '<p class="big">Server Room district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key, Seal, Shield, Lantern, Vault, Beacon' + (G.f.svCrown ? ', Crown' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '.</p>' +
    '<p>Tier 0 accounts: <b>' + c.priv + '</b> (was ' + SV_PRIV0 + ') · service accounts owned: <b>' + svOwnPct() + '%</b> · tier-crossing sign-ins a day: <b>' + c.cross + '</b> (was ' + SV_TIER_BEFORE + ') · investigations led: <b>' + c.led + '</b>.</p>' +
    (c.boss ? '<p>The domain compromise: ' + (c.boss.evicted ? 'evicted in one window, krbtgt reset twice, the return caught' : 'contained, with gaps the debrief named') + '. Cards: ' + esc(c.boss.picks.map(id => SV_CARDS.find(x => x.id === id).name).join(', ')) + '.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    svQtSummaryHtml() +
    '<p class="big">Next: the Water Plant.</p>';
  Series.markEdition(EDITION.id, {done: true, serverRoom: true});
  const i = await UI.openModal('End of the Server Room', body, [{label: 'Keep exploring the Server Room', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
