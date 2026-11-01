/* ============================================================
   UPTIME · editions/town-hall/water-story.js
   Town Hall district 8, the Water Plant (operational technology): state,
   objectives, interactions, talk, the fieldwork (OT asset inventory, internet
   exposure and default passwords, the zones and conduits mini-game, offline
   PLC logic backups and a manual-operation drill, passive monitoring), the
   vendor remote-access directive, three investigation drills, the Network
   Traffic Analysis dojo, the Plant Board (Tide Badge, Lanternkeep -> Tidewatch),
   the boss incident (an internet-exposed controller, modelled on a real case),
   the Quiet Thread clue, scorecard metrics and the end-of-district summary.
   Safety first: the operators own the process and have the final say on
   anything that touches it. The Server Room story chains here (wtObjective via
   svObjective). The engine hooks the earlier districts wrap are wrapped again:
   each wrapper calls the previous version, then adds the Water Plant.
   Timeline: scratchpad water-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Water Plant: MITRE ATT&CK for ICS v20 (T1694.001, formerly T0812; T0883, T0843, T0836, T0829, T0886, T0888; Quiet Thread T0859). CISA alert of 28 November 2023 on Unitronics PLCs at a US water facility; joint advisory AA23-335A (FBI, CISA, NSA, EPA, INCD; December 2023); CISA, FBI, EPA and DOE Primary Mitigations to Reduce Cyber Threats to Operational Technology (May 2025); Foundations for OT Cybersecurity: Asset Inventory Guidance (CISA, EPA, NSA, FBI and partners, August 2025); EPA and CISA fact sheet on internet-exposed HMIs (December 2024); NIST SP 800-82 Rev. 3; Adapting Zero Trust Principles to Operational Technology (CISA, DOE, FBI and partners, April 2026); ANSI/ISA-62443-3-2-2020 (public preview: zones and conduits).';
  if (EDITION.badgeFlags && !EDITION.badgeFlags.includes('wtTide')) EDITION.badgeFlags.push('wtTide');
}

/* ---------- State ---------- */
function WT() {
  if (!G.wt) G.wt = {day0: G.day, exposed: WT_EXPOSED0, deflt: WT_DEFAULT0, inv: WT_ASSETS_BEFORE, backup: 0, vSince: null,
    zones: null, drills: {}, dojo: [false, false, false], directive: null, boss: null, led: 0};
  return G.wt;
}
function wtOn() { return !!(G && G.f && G.f.wtMet && G.wt); }
function inWater() { return WT_MAPS.includes(G.map); }
function wtInvPct() { return Math.round(WT().inv / WT_ASSETS * 100); }
function wtBackupPct() { return Math.round(WT().backup / WT_PLCS * 100); }
// Vendor sessions with an approved ticket: the last 30 days until on-demand access starts, then the sessions since.
function wtVendPct() {
  const c = WT();
  if (!c.vSince) return Math.round(WT_VEND_HIST.ok / WT_VEND_HIST.total * 100);
  return c.vSince.total ? Math.round(c.vSince.ok / c.vSince.total * 100) : null;
}

/* ---------- Engine hooks (wrapping the Server Room versions) ---------- */
const _wtPrevAlertWeight = alertWeight, _wtPrevAlertHost = alertHost, _wtPrevBriefList = briefList, _wtPrevDecorate = alertDecorate,
  _wtPrevMetricVals = editionMetricVals, _wtPrevScoreHtml = editionScoreHtml, _wtPrevPeekExtra = peekExtra;
alertWeight = function (t, w) {
  w = _wtPrevAlertWeight(t, w);
  if (THREATS[t].district === 'water' && !(G.f && G.f.wtMet)) return 0;
  if (G.f && G.f.wtMet && inWater() && WT_HOME.includes(t)) w *= 3;
  // Tide Badge: internet-exposed-device encounters halved map-wide.
  if (G.f && G.f.wtTide && (THREATS[t].tags || []).includes('exposed')) w *= 0.5;
  return w;
};
alertHost = function () { return (G.f && G.f.wtMet && inWater()) ? pick(WT_HOSTS) + ' · Water Plant' : _wtPrevAlertHost(); };
briefList = function () { const L = _wtPrevBriefList(); return (G.f && G.f.wtMet) ? L.concat(WT_BRIEFS) : L; };
// Tide Badge: a "shut it all down" response needs the operators' sign-off. It is still the wrong answer, but the
// operators refuse it, so nothing is shut down (no disruption cost).
alertDecorate = function (spec) {
  _wtPrevDecorate(spec);
  if (G.f && G.f.wtTide && WT_HOME.includes(spec.threat) && spec.resp)
    spec.resp = spec.resp.map(r => r.shutdown ? Object.assign({}, r, {disrupt: 0, signoff: true, why: 'The operators refused to sign off, so nothing was shut down (Tide Badge). ' + (r.why || '')}) : r);
};
editionMetricVals = function () {
  const v = _wtPrevMetricVals();
  if (!wtOn()) return v;
  const c = WT();
  return Object.assign(v, {wtExposed: c.exposed, wtDefault: c.deflt, wtInv: wtInvPct(), wtBackup: wtBackupPct(), wtVend: wtVendPct()});
};
EDITION_METRICS.push(
  {k: 'wtExposed', label: 'Internet-exposed OT devices', unit: '', higher: false, lower: true, when: wtOn},
  {k: 'wtDefault', label: 'Default credentials remaining (known)', unit: '', higher: false, lower: true, when: wtOn},
  {k: 'wtInv', label: 'OT assets inventoried', unit: '%', higher: true, when: wtOn},
  {k: 'wtBackup', label: 'PLC logic backups current', unit: '%', higher: true, when: wtOn},
  {k: 'wtVend', label: 'Vendor remote sessions approved', unit: '%', higher: true, when: wtOn}
);
editionScoreHtml = function () {
  let h = _wtPrevScoreHtml();
  if (!wtOn()) return h;
  const c = WT();
  if (G.f.wtDirective) h += '<p class="dir">Directive: the vendor box stays, on demand only: a ticket and a window, MFA, recorded, off afterwards, with an on-call emergency path; Gil signed the risk acceptance. (game)</p>';
  h += '<p>Water Plant: Tide Badge <b>' + (G.f.wtTide ? 'yes' : 'not yet') + '</b> · OT assets <b>' + c.inv + ' of ' + WT_ASSETS + '</b>' +
    (c.zones ? ' · zones and conduits <b>first pass: exposure ' + c.zones.exposure + ', operations broken ' + c.zones.broken + '</b>' : '') +
    (G.f.wtMon ? ' · passive monitoring <b>on</b>' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _wtPrevPeekExtra();
  e.wtSummary = !!(G.f && G.f.wtSummary);
  e.wt = G.wt ? {exposed: G.wt.exposed, deflt: G.wt.deflt, inv: G.wt.inv, invPct: wtInvPct(), backup: G.wt.backup, vend: wtVendPct(), vSince: G.wt.vSince,
    zones: G.wt.zones, drills: G.wt.drills, dojo: G.wt.dojo, directive: G.wt.directive, boss: G.wt.boss, led: G.wt.led} : null;
  return e;
};
function wtTile(d, ch, x, y) {
  if (ch === '[' && G.f.wtExpose) d.pal = 'wtHmiOk';
  if (ch === ']' && G.f.wtBackup) d.pal = 'wtPlcOk';
  if (ch === '}' && G.f.wtZones) d.pal = 'wtFwOk';
  if (ch === '<' && G.f.wtDirective) d.pal = 'wtVendOk';
  if (ch === '-' && G.f.wtMon) d.pal = 'wtNetOk';
  if (ch === '|' && G.f.wtTide && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  return d;
}

/* ---------- Objective ---------- */
function wtObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'water', x: x, y: y, district: 'water'});
  if (!f.wtMet) return at('Next: the Water Plant. The west-wall door in the Server Room’s lower room; your Crown Badge opens it.', 4, 3, 'water');
  if (!f.wtInv) return at('Fieldwork: nobody knows what is on the plant network. Joss, by the PLC cabinets.', 14, 3);
  if (!f.wtExpose) return at('Fieldwork: a booster panel on the internet, factory passwords. Mae, at the consoles.', 4, 1);
  if (!f.wtZones) return at('Fieldwork: office PCs can reach the PLCs. The IT/OT firewall rack.', 13, 7);
  if (!f.wtBackup) return at('Fieldwork: PLC logic backups from 2021. The PLC cabinets.', 11, 1);
  if (!f.wtMon) return at('Fieldwork: nobody watches plant traffic. The control network rack.', 19, 7);
  if (!f.wtNight1) return at('End your shift at your Water Plant desk.', 12, 13);
  if (!f.wtDrill1) return at('Mae has a set point that moved in the night.', 4, 3);
  if (!f.wtDrill2) return at('Joss has a controller whose logic changed overnight.', 14, 3);
  if (!f.wtDirective) return at('Gil Hartley, the plant manager, wants a word about the vendor box.', 7, 7);
  if (!f.wtNight2) return at('End your shift at your desk.', 12, 13);
  if (!f.wtDrill3) return at('An office address is talking to a filter PLC. Joss.', 14, 3);
  if (!f.wtDojoDone) {
    if (!f.wtDojoMet) return at('(Optional) Train at the Network Traffic Analysis dojo with Calla.', 10, 11);
    const i = WT().dojo.findIndex(x => !x);
    return at('(Optional) Traffic puzzle ' + (i + 1) + ' of 3.', [3, 5, 7][i], 11);
  }
  if (!f.wtBoard) return at('Take the Plant Board challenge (Hanne Sorvik, through the west door).', 8, 2, 'ptboard');
  if (!f.wtNight3) return at('End your shift at your desk.', 12, 13);
  if (!f.wtBoss) return at('Mae needs you: a booster station has gone dark.', 4, 3);
  if (!f.wtFile) return at('Rae wants a word about svc-print. By the vendor box.', 16, 8);
  if (typeof ccObjective === 'function') return ccObjective();
  return {text: 'Water Plant secured. Next: Council Chambers.', done: true, district: 'water'};
}

/* ---------- Triggers and interactions ---------- */
let wtEarlyWarned = false;
function wtTriggers() {
  if (G.map !== 'water') return false;
  if (!G.f.svFile) {
    if (wtEarlyWarned) return false;
    wtEarlyWarned = true;
    run(async () => { await say('Crown Badge, so the door opens. But the Server Room isn’t finished: Rae is waiting for you there. The plant runs itself until then.', 'Mae Arroyo'); });
    return true;
  }
  if (!G.f.wtMet) { run(wtArrive); return true; }
  return false;
}
function wtInteract(ch, tx, ty) {
  if (!inWater()) return false;
  if (ch === '[') { run(wtHmiTile); return true; }
  if (ch === ']') { run(wtCabinet); return true; }
  if (ch === '{') { run(async () => { await say('HIST-01, the control historian: every value the PLCs report, kept for trends and compliance records. ' + (G.f.wtZones ? 'A read-only copy, HIST-DMZ, now serves the office from the DMZ.' : 'The office reads it straight across the flat network.')); }); return true; }
  if (ch === '}') { run(wtFirewall); return true; }
  if (ch === '<') { run(async () => { await say(G.f.wtDirective ? 'RA-01, the vendor box: off. It switches on only for an approved window, with MFA, and records every session.' : 'RA-01, the vendor remote-access box: on, all day, every day, reachable from the internet since 2019.'); }); return true; }
  if (ch === '-') { run(wtNetRack); return true; }
  if (ch === '>') { run(async () => { await say('The chemical dosing skid, behind a yellow line. It belongs to the operators and the chemical vendor. You look; you never touch.'); }); return true; }
  if (ch === '`') { run(() => wtDojoPuzzle([3, 5, 7].indexOf(tx))); return true; }
  if (ch === '?') { run(async () => { await say('Plant Board racks: a practice rig of controllers and panels, wired to nothing that carries water.'); }); return true; }
  if (ch === 'Y') { run(wtDesk); return true; }
  return false;
}
async function wtTalk(npc) {
  if (!WT_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.wtMet && npc.map === 'water') { await say('Mae is the one to talk to first. The operators run this place.', who); return; }
  switch (npc.id) {
    case 'mae': await maeTalk(); break;
    case 'joss': await jossTalk(); break;
    case 'gil': await gilTalk(); break;
    case 'calla': await callaTalk(); break;
    case 'hanne': await wtBoardScript(); break;
    case 'raewt': await raeWaterTalk(); break;
  }
}
async function wtDesk() {
  const f = G.f;
  const ready = (f.wtMon && !f.wtNight1) || (f.wtDirective && !f.wtNight2) || (f.wtBoard && !f.wtNight3);
  if (!ready) { await say('Your desk at the Water Plant, by the window onto the filter beds. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your Water Plant desk. End your shift?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.wtMon && !f.wtNight1) {
    f.wtNight1 = true;
    await say('Day ' + G.day + ', 07:00. Overnight: a program download at 21:24, a set-point change at 02:10, and at 06:00 the compare job flagged a controller. Mae has the set point.');
  } else if (f.wtDirective && !f.wtNight2) {
    f.wtNight2 = true;
    await say('Day ' + G.day + ', 09:40. The sensor’s new-talker rule fired at 09:12: an office address is talking to a filter PLC. Joss has it.');
  } else if (f.wtBoard && !f.wtNight3) {
    f.wtNight3 = true;
    await say('Day ' + G.day + ', 02:35. Your phone: Tunde, the night operator. “BS-3 went dark at 01:47. Ike is running it by hand and the water is fine. There’s a message on its screen. Come in.”');
  }
}

/* ---------- Arrival ---------- */
async function wtArrive() {
  const who = 'Mae Arroyo', f = G.f;
  WT(); G.wt.day0 = G.day;
  await say('Day ' + G.day + '. The Water Plant: the control room, the PLC cabinets, the historian, the chemical dosing skid behind its yellow line, and a vendor box that has been switched on since 2019.');
  await say('You’re the security lead from the Server Room? Mae Arroyo, shift lead. Before anything else: we make drinking water. My operators own the process. Nothing that touches it happens without us.', who);
  await say('Here’s what I lose sleep over. A booster panel that answers from the internet. Passwords from the manuals. A flat network where any office PC can reach my controllers. No list of what’s out there. Nobody watching the traffic. And logic backups from 2021.', who);
  await say('You stay Tier 3 lead investigator. What changes here is who decides: you work across the IT/OT line, and the people who run the process have the final say on it.', who);
  G.targets.wtExposed = 0; G.targets.wtDefault = 0; G.targets.wtInv = 100; G.targets.wtBackup = 100; G.targets.wtVend = 100;
  f.wtMet = true; track();
  touchCSF('Identify');
  await say('New on your scorecard: exposed devices, default passwords, assets inventoried, backups current, and vendor sessions approved. Start (Enter) shows them.', who);
  await say('Start with Joss, our controls engineer, by the cabinets: what is actually on this network.', who);
}
async function maeTalk() {
  const f = G.f, who = 'Mae Arroyo';
  if (!f.wtInv) { await say('Joss first, by the PLC cabinets. Then come back to me about the booster panel.', who); return; }
  if (!f.wtExpose) { await wtExposure(); return; }
  if (!f.wtZones) { await say('The firewall rack in the corridor. Joss says the office can reach my PLCs. I’d like that to stop.', who); return; }
  if (!f.wtBackup) { await say('The cabinets: backups. And when you do them, I want a manual drill on the filters. My people should practise.', who); return; }
  if (!f.wtMon) { await say('The network rack in the corridor. Listening is fine. Poking my controllers is not.', who); return; }
  if (!f.wtNight1) { await say('Go home. Tunde has the night. He knows what he’s doing.', who); return; }
  if (!f.wtDrill1) { await wtDrill1(); return; }
  if (!f.wtDrill2) { await say('Joss has the other alert, the download. Talk to him.', who); return; }
  if (!f.wtDirective) { await say('Gil’s in the corridor, about the vendor box. Good luck.', who); return; }
  if (!f.wtDrill3) { await say('Joss has something from the office side this morning.', who); return; }
  if (!f.wtBoard) { await say('Hanne runs the Plant Board, through the west door. Calla’s dojo first, if you want it.', who); return; }
  if (!f.wtNight3) { await say('Go home. The plant’s in better shape than it’s ever been.', who); return; }
  if (!f.wtBoss) { await wtBossScript(); return; }
  if (!f.wtFile) { await say('Rae came in. She’s by the vendor box, asking about svc-print.', who); return; }
  await say('Safe water, operators in charge, and a vendor box that sleeps. Council Chambers is next for you.', who);
  await wtSummary();
}

/* ---------- Fieldwork 1: the OT asset inventory ---------- */
async function jossTalk() {
  const f = G.f, who = 'Joss Kettering';
  if (!f.wtInv) { await wtInventory(); return; }
  if (!f.wtExpose) { await say('Mae’s at the consoles. The booster panel is hers to worry about and mine to fix.', who); return; }
  if (!f.wtZones) { await say('The firewall rack in the corridor. Let’s draw the zones and decide what crosses them.', who); return; }
  if (!f.wtBackup) { await wtBackups(); return; }
  if (f.wtNight1 && f.wtDrill1 && !f.wtDrill2) { await wtDrill2(); return; }
  if (f.wtNight2 && !f.wtDrill3) { await wtDrill3(); return; }
  if (f.wtBoss) { await say('Every vendor device on the list now says how it connects, and we checked, not copied. BS-3 taught me that.', who); return; }
  await say('Seven controllers, two offline copies each, and a compare job every morning. I sleep a little better.', who);
}
async function wtCabinet() {
  const f = G.f;
  if (!f.wtMet) { await say('PLC cabinets, humming. Mae should show you around first.'); return; }
  if (!f.wtInv) { await say('The PLC cabinets and EWS-01, the engineering workstation. Joss is right here; he knows what’s in them.'); return; }
  if (!f.wtZones) { await say('The PLC cabinets. The backups come after the zones: no point copying logic anyone in the office can rewrite.'); return; }
  if (!f.wtBackup) { await wtBackups(); return; }
  await say('The PLC cabinets: seven controllers, each backed up offline twice and compared with its backup every morning at 06:00.');
}
async function wtInventory() {
  const who = 'Joss Kettering', c = WT();
  await say('Joss Kettering, controls engineer. Our asset list is a spreadsheet from 2019 with twelve rows. I can name more than that from memory, but not all of them.', who);
  while (true) {
    const i = await choose('How do you build the plant’s asset inventory?', [
      {label: 'Walk the plant with the operators, read EWS-01’s project files and the switch tables, and listen on a mirror port', meta: {good: true}},
      {label: 'Run a fast active scan of the plant network, so every device has to answer and none of them can be missed'},
      {label: 'Ask each vendor for its own device list and merge them, because the vendors installed most of this equipment'},
      {label: 'Start from the 2019 spreadsheet and add each device the first time it shows up in an alert'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Active scanning in a running plant can knock fragile controllers over. Joint guidance from April 2026 says not to try it without deep knowledge of the system; passive listening avoids the risk.');
    else if (i === 2) await say('Vendor lists are a start, not a check: they miss what was added later and describe equipment as it shipped. Walk it and listen to it.');
    else await say('Twelve rows of forty-one. Waiting for alerts means you meet devices when they are already in trouble.');
  }
  c.inv = WT_ASSETS; track();
  G.f.wtInv = true; unlock('act', 'otinv'); unlock('fact', 'wtinvguide'); touchCSF('Identify');
  await say('Forty-one OT assets: seven PLCs, two HMIs, EWS-01, the historian, the vendor box, switches, radios, drives and panels, each with an owner and how it connects. BS-3, the pump vendor’s skid, from its datasheet: “remote access: none”. (game)', who);
  await say('Now Mae, at the consoles. She has a booster panel she wants off the internet.', who);
}

/* ---------- Fieldwork 2: internet exposure and default passwords ---------- */
async function wtHmiTile() {
  const f = G.f;
  if (!f.wtMet) { await say('An operator console. Mae should show you around first.'); return; }
  if (!f.wtInv) { await say('HMI-01, the operators’ console. The inventory first.'); return; }
  if (!f.wtExpose) { await wtExposure(); return; }
  await say('HMI-01: every factory password on the plant’s own devices changed, one at a time, with an operator watching each.');
}
async function wtExposure() {
  const who = 'Mae Arroyo', c = WT();
  await say('An outside check of the town’s own internet addresses found PLC-PMP-02, booster station 2, answering at 203.0.113.47 through a cellular router, on its factory password. Nine devices still have passwords from the manuals. (game)', who);
  while (true) {
    const i = await choose('How do you deal with the exposure and the passwords?', [
      {label: 'Off the internet first, read out its log, then each password with an operator watching, since a lockout is real', meta: {good: true}},
      {label: 'Change all nine passwords in one batch from EWS-01, to shut the window as fast as possible'},
      {label: 'Keep PLC-PMP-02 online for the integrator, but on a non-default port and a new password, so scanners stop seeing it any more'},
      {label: 'Unplug the communications at every booster station until the review is finished and nobody can reach them'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('A batch change on running controllers, with nobody watching, is how you lock an operator out mid-shift. One device at a time, tested, with Mae’s people at the console.');
    else if (i === 2) await say('AA23-335A asks for PLCs off the public internet. CISA’s alert lists a non-default port only as an extra step: a smaller target, not a closed door.');
    else await say('Then the control room loses every booster station’s telemetry and has to drive round them. Remove the one exposure; leave the rest running.');
  }
  c.exposed = Math.max(0, c.exposed - 1); c.deflt = 0; track();
  G.f.wtExpose = true; unlock('act', 'otexpose'); unlock('fact', 'wtaa23'); unlock('fact', 'wthmi'); unlock('tech', 'T0883'); unlock('tech', 'T1694.001'); touchCSF('Protect');
  await say('PLC-PMP-02 reports over the plant’s private radio link now; its public service is closed. Its event list and the router’s log show no outside sign-in in what they keep, and Joss checks its logic against his project file at the backups. Nine passwords changed, nine devices tested. BS-3 is “vendor-managed”: the pump vendor says theirs was changed. (game)', who);
  await say('One device left on the internet all day: RA-01, the vendor box. That one is Gil’s decision. Next, the firewall rack in the corridor.', who);
}

/* ---------- Fieldwork 3: zones and conduits (mini-game) ---------- */
async function wtFirewall() {
  const f = G.f;
  if (!f.wtMet) { await say('A firewall rack. Mae should show you around first.'); return; }
  if (!f.wtExpose) { await say('FW-OT, the new IT/OT firewall, waiting for rules. The booster panel first.'); return; }
  if (!f.wtZones) { await wtZones(); return; }
  const z = WT().zones;
  await say('FW-OT: four zones, five conduits allowed, everything else denied. First pass: exposure ' + (z ? z.exposure : 0) + ', operations broken ' + (z ? z.broken : 0) + '. Plus R-114, finance’s exception until Friday.');
}
async function wtZones() {
  const who = 'Joss Kettering', c = WT();
  await say('FW-OT, new and empty. Today the office and the plant are one flat network. Put each asset in its zone, then decide which conduits cross the lines. Allow what the plant needs; deny the rest.', who);
  for (const a of WT_ZONE_ASSETS) {
    const items = WT_ZONES.map(z => ({label: z.label, meta: {good: z.k === a.zone, k: z.k}}));
    while (true) {
      const i = await UI.openModal('Zones · ' + a.id, '<div class="card"><b>' + esc(a.id) + '</b><br>' + esc(a.what) + '</div><p>Which zone does it belong in?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(a.zone === 'dmz' ? 'It sits between the office and the plant: the office reaches it, it reaches the plant, and nobody passes straight through.' : a.zone === 'field' ? 'Controllers and their I/O are the field zone: the deepest one, reached only from the control zone.' : a.zone === 'control' ? 'It is how the plant is run or recorded: the control zone, next to the controllers but not among them.' : 'It serves the office: enterprise zone.');
    }
  }
  const pass = async (list, first) => {
    const res = [];
    for (const cd of list) {
      const items = [{label: 'Allow this conduit', meta: {good: cd.need, k: 'allow'}}, {label: 'Deny this conduit', meta: {good: !cd.need, k: 'deny'}}];
      const i = await UI.openModal('Conduits · ' + cd.text, '<div class="card"><b>' + esc(cd.text) + '</b><br>Used for: ' + esc(cd.why) + '</div>', items, {shuffle: true, closable: false, cls: 'drill'});
      res.push({cd: cd, allow: items[i].meta.k === 'allow'});
    }
    return res;
  };
  let res = await pass(WT_CONDUITS, true);
  const tally = r => ({exposure: r.filter(x => x.allow && !x.cd.need).length, broken: r.filter(x => !x.allow && x.cd.need).length});
  c.zones = tally(res);
  while (true) {
    const wrong = res.filter(x => x.allow !== x.cd.need);
    const rows = res.map(x => '<tr><td>' + esc(x.cd.text) + '</td><td>' + (x.allow ? 'allowed' : 'denied') + '</td><td>' + esc(x.allow && !x.cd.need ? 'Exposure: ' + x.cd.exp : !x.allow && x.cd.need ? 'Broken: ' + x.cd.broke : 'fine') + '</td></tr>').join('');
    const t = tally(res);
    await UI.openModal('Zones and conduits · result', '<p>Exposure left: <b>' + t.exposure + '</b> · operations broken: <b>' + t.broken + '</b> (game)</p><table class="sc"><tr><th>Conduit</th><th>You</th><th>Effect</th></tr>' + rows + '</table>',
      [{label: wrong.length ? 'Fix the ones that are wrong' : 'Done', meta: {good: true}}], {closable: false, cls: 'drill'});
    if (!wrong.length) break;
    for (const w of wrong) await say(w.cd.need ? 'Deny that and ' + w.cd.broke.charAt(0).toLowerCase() + w.cd.broke.slice(1) + ' The plant needs it: allow it, narrowly.' : 'Allow that and ' + w.cd.exp.charAt(0).toLowerCase() + w.cd.exp.slice(1) + ' Nothing the plant does needs it: deny it.');
    const again = await pass(wrong.map(x => x.cd), false);
    res = res.map(x => again.find(y => y.cd === x.cd) || x);
  }
  // The exception: finance's reporting job can't move to the DMZ copy until Friday.
  await say('One catch. Finance’s reporting job on RPT-01 reads PLC-FLT-01 directly every morning, and they can’t point it at HIST-DMZ until Friday.', who);
  while (true) {
    const i = await choose('What do you do about finance’s job until Friday?', [
      {label: 'A temporary exception, RPT-01 to that one PLC only: finance owns it, and it expires on Friday', meta: {good: true}},
      {label: 'Keep the old office-to-PLC rule in place until Friday, as it has been for years'},
      {label: 'Allow RPT-01 to reach every PLC until Friday, in case the job needs more totals later'},
      {label: 'Give finance a sign-in on HMI-01, so they can read the totals off the operators’ console instead'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('The old rule lets every office PC reach every controller. An exception covers one host, one PLC, an owner and an end date.');
    else if (i === 2) await say('The job reads one controller. An exception covers what the job needs and nothing more: one host, one PLC, an owner and an end date.');
    else await say('That puts office accounts on the operators’ console, the one conduit you just denied.');
  }
  G.f.wtZones = true; unlock('act', 'zones'); unlock('fact', 'wtzones'); unlock('fact', 'wt80082'); touchCSF('Protect'); touchCSF('Identify');
  await say('R-114 approved: RPT-01 to PLC-FLT-01 only, owner finance reporting, expires Friday. The firewall team puts the rules in this afternoon. Four zones; the office reads from HIST-DMZ, vendors land on EWS-01. (game)', who);
  await say('Now the backups, at the cabinets. Mae wants a manual drill on the filters while we do them.', who);
}

/* ---------- Fieldwork 4: offline PLC logic backups and a manual drill ---------- */
async function wtBackups() {
  const who = 'Joss Kettering', c = WT();
  await say('Last backups: 2021, on a laptop we retired. Seven controllers, and if one of them died tonight I’d be rebuilding its logic from memory.', who);
  while (true) {
    const i = await choose('How do you back up the controllers?', [
      {label: 'Two offline copies of each PLC’s logic and configuration, one off site, each matched to Joss’s project files; then Mae’s manual drill', meta: {good: true}},
      {label: 'Save the backups on EWS-01’s own disk, where Joss can reach them fastest when a controller fails in the middle of the night'},
      {label: 'Back up only the five controllers the town programmed itself, and leave the two vendor skids to their vendors’ own copies'},
      {label: 'Take the backups, but skip the manual drill: the operators ran this plant by hand for years before it was automated, so they remember'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('EWS-01 is the machine an intruder wants most. A backup that lives on it goes down with it. Offline, and one copy off site.');
    else if (i === 2) await say('A vendor’s copy is the vendor’s, on their schedule. If a skid’s controller fails, you need its logic tonight, from your own safe.');
    else await say('CISA, the FBI, the EPA and the DOE all say it: practise and maintain the ability to run OT by hand. Skills fade; drills keep them.');
  }
  c.backup = WT_PLCS; track();
  G.f.wtBackup = true; unlock('act', 'plcbackup'); unlock('fact', 'wtprimary'); touchCSF('Recover'); touchCSF('Protect');
  await say('Seven controllers backed up twice, offline, one copy in the safe and one off site: logic, configuration and screens. Each running program matched my project files before it became the reference, PLC-PMP-02’s included. BS-3’s came from the pump vendor’s project file, compared over the telemetry link. PLC-HSP-01 is at revision 4.2. A compare job checks each one at 06:00. (game)', who);
  await say('Mae ran the filters by hand for half an hour with a second operator. Slow, steady, nobody panicked. Last thing: someone should be listening to this network.', who);
}

/* ---------- Fieldwork 5: passive monitoring ---------- */
async function wtNetRack() {
  const f = G.f;
  if (!f.wtMet) { await say('A network rack. Mae should show you around first.'); return; }
  if (!f.wtBackup) { await say('The control network rack: switches with spare mirror ports. The backups first.'); return; }
  if (!f.wtMon) { await wtMonitor(); return; }
  await say('A listen-only sensor on the control and field switches’ mirror ports. It has never sent a packet to a controller.');
}
async function wtMonitor() {
  const who = 'Joss Kettering';
  await say('Nobody has ever watched this network. The controllers talk the same way every second of every day, so anything new should stand out, if someone is listening.', who);
  while (true) {
    const i = await choose('How do you watch the plant’s traffic?', [
      {label: 'A listen-only sensor on mirror ports, since scanning risks the controllers, alerting on off-window downloads and new talkers', meta: {good: true}},
      {label: 'Put a monitoring agent on every PLC and HMI to report everything each device does to the SIEM'},
      {label: 'Scan every PLC actively once an hour, so a change to any controller is caught within the hour'},
      {label: 'Alert on every packet to or from a PLC across the whole plant'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('You can’t install software on a PLC, and putting it on an HMI without the vendor can void its support. Listen from the network instead.');
    else if (i === 2) await say('An hourly active scan of running controllers is the risk the passive sensor exists to avoid.');
    else await say('The PLCs exchange thousands of packets a minute. Learn the rhythm and alert on what breaks it.');
  }
  G.f.wtMon = true; unlock('act', 'passivemon'); unlock('fact', 'wtpassive'); touchCSF('Detect');
  const t = G.party.find(x => x.id === 'lantern' || EVOLVED_FROM[x.id] === 'lantern');
  if (t) { t.lvl++; await say('Lanternkeep has the plant’s traffic to read. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.'); }
  await say('Sensor on. From now these four rules can fire; before today, nothing watched. That’s the fieldwork. Your desk is in the south room. (game)', who);
}

/* ---------- Drills ---------- */
async function wtDrill(key) {
  const c = WT();
  const raw = JSON.stringify(WT_DRILLS[key]).replace(/\{D-3\}/g, String(G.day - 3)).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day));
  const D = JSON.parse(raw);
  const r = await doDrill(D);
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  c.led++; track();
  return r;
}
async function wtDrill1() {
  const who = 'Mae Arroyo';
  await say('At 02:10 the clearwell’s low-level set point dropped from 3.2 to 2.4 metres. Tunde was on. Before I ask him, tell me what the records say. You lead this one.', who);
  const r = await wtDrill('setpoint');
  G.f.wtDrill1 = true; touchCSF('Detect');
  await say(r.verdictOk ? 'Tunde, at HMI-02, for the tank inspection. He logged it two minutes later. Good: nothing to undo. I’ll still have a word with him at handover: records first, then the person.' : 'It was Tunde, at HMI-02, for the 08:00 tank inspection: his account, his console, his shift-log entry. Nothing to undo.', who);
  await say('Joss has the other one: a controller whose logic changed.', who);
}
async function wtDrill2() {
  const who = 'Joss Kettering';
  await say('PLC-HSP-01, the high-service pumps. The 06:00 compare says its logic isn’t what we backed up yesterday, and the sensor saw a download at 21:24. The pumps are running fine. Tampering, or a change I don’t know about?', who);
  const r = await wtDrill('checksum');
  G.f.wtDrill2 = true; touchCSF('Respond');
  await say(r.verdictOk ? 'The pump vendor, through the box, because Gil emailed them. No ticket, nothing in my archive, nobody told Mae. It runs; it goes through an emergency-change review this afternoon.' : 'It was the pump vendor, through RA-01, at Gil’s request: no ticket, no archived revision. Not an intruder, not an approved change either.', who);
  await say('And Gil wants to talk to you about that box. Now, apparently.', who);
}
async function wtDrill3() {
  const who = 'Joss Kettering';
  await say('The sensor’s new-talker rule, 09:12: an office address talking to PLC-FLT-01 on its industrial port, through FW-OT. Finance’s job reads that PLC at 07:00. Is this them, or someone else?', who);
  const r = await wtDrill('officeplc');
  G.f.wtDrill3 = true; unlock('tech', 'T0888'); touchCSF('Respond');
  const c = WT(); c.vSince = {total: 1, ok: 1}; track();
  await say(r.verdictOk ? 'OF-WS-22, an unsigned program from an email, through R-114, which was put in for the whole office subnet instead of RPT-01. Narrowed now; the PC is off the network on the IT side; the filters never noticed.' : 'It was OF-WS-22, l.marsh’s planning PC: an unsigned program from an email, through R-114, which had been put in for the whole office. Narrowed now, the PC off the network.', who);
  await say('Reads only, stopped at the boundary, and nobody turned the plant off. And the filter vendor’s 10:00 session is running under CHG-8240: approved, MFA, recorded; the box goes off at noon. Calla’s dojo is open; the Plant Board after.', who);
}

/* ---------- The directive (game): the vendor box left on "so they can fix things fast" ---------- */
async function gilTalk() {
  const who = 'Gil Hartley', c = WT(), f = G.f;
  if (f.wtDirective) { await say('On demand, with my name on the emergency path. If a pump fails at 3 a.m., Joss turns the box on. Fine.', who); return; }
  await say('Gil Hartley, plant manager. I hear you’re unhappy about the vendor box. Leave it on. Permanently. When a pump misbehaves at night they fix it from home in ten minutes.', who);
  await say('Last night they fixed the alternation timer I asked them about. That’s service. I don’t want a form between my pumps and the people who built them.', who);
  while (true) {
    const i = await choose('How do you answer Gil?', [
      {label: 'On demand: the vendor asks, Joss approves a ticket and window, MFA on, sessions recorded, off afterwards; Gil signs the 24/7 path', meta: {good: true, k: 'od'}},
      {label: 'Agree: keep RA-01 on permanently, since it has never caused an outage and the vendors need fast access at night'},
      {label: 'Unplug RA-01 for good, and make the vendors drive in for every fix, however long the drive takes in the middle of the night'},
      {label: 'Keep it on permanently but add MFA and record every session, so a stolen vendor password alone can’t get anyone in at night'}], {shuffle: true});
    if (i === 0) { c.directive = 'ondemand'; break; }
    if (i === 1) await say('Last night that box let a vendor change your pumps’ logic with no ticket and no operator told. The next session might not be the vendor.');
    else if (i === 2) await say('Then a failed pump at 3 a.m. waits for a two-hour drive. The plant needs the support; it doesn’t need the box listening all day.');
    else await say('MFA is part of it. But a box that is always on is always a target, and nobody approves what happens in the session.');
  }
  await say('Fine. On demand. And if it’s 3 a.m.?', who);
  await say('The on-call engineer can switch it on in fifteen minutes, any hour. You sign for that path: it’s your risk, in writing, not mine.');
  c.exposed = Math.max(0, c.exposed - 1); c.vSince = {total: 0, ok: 0}; track();
  G.f.wtDirective = true; unlock('act', 'vendorod'); touchCSF('Govern');
  await say('Signed. The box is off between approved windows from today. MFA added, sessions recorded. (game)', who);
  await say('While we change the box, let me list its accounts.', 'Joss Kettering');
  await wtQtVendorBox();
  await say('(Vendor access isn’t yes or no. It’s on demand, approved, recorded, and the business owning the emergency path.)');
}

/* ---------- Network Traffic Analysis dojo (NCL area; concepts only) ---------- */
async function callaTalk() {
  const who = 'Calla Brandt', f = G.f;
  if (!f.wtDrill3) { await say('The dojo opens once the plant’s own cases are done. Come back after Joss’s drills.', who); return; }
  if (!f.wtDojoMet) {
    f.wtDojoMet = true;
    await say('Calla Brandt. I coach the Network Traffic Analysis games for the National Cyber League team. (game)', who);
    await say('Three terminals: a flow record, a baseline, and a device that should never speak to the internet. No tools, no commands: reading traffic, which is the whole skill.', who);
    return;
  }
  if (f.wtDojoDone) { await say('Flows are metadata, OT is regular, and a denied request is still a finding.', who); return; }
  await say('Puzzles solved: ' + WT().dojo.filter(Boolean).length + ' of 3. Terminals to my left.', who);
}
async function wtDojoPuzzle(i) {
  const f = G.f, c = WT();
  if (i < 0) return;
  if (!f.wtDojoMet) { await say('A practice terminal. Talk to Calla first.'); return; }
  const p = WT_DOJO[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read the traffic again.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF('Detect');
  if (!c.dojo.every(Boolean) || f.wtDojoDone) return;
  f.wtDojoDone = true;
  const t = G.party.find(x => TOOLS[x.id].cls === 'network');
  if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Calla Brandt'); }
  else await say('All three. You read traffic for what changed now, not for how much.', 'Calla Brandt');
  await evolveCheck();
}

/* ---------- Evolution: Lanternkeep -> Tidewatch (at the Plant Board) ---------- */
async function wtEvolveCheck() {
  if (!G.f || !G.f.wtBoard) return;
  const t = G.party.find(p => p.id === 'lantern');
  if (!t) return;
  t.id = 'tidewatch'; t.lvl = Math.max(t.lvl, 8); touchCSF('Detect');
  await say('Lanternkeep is evolving! Lanternkeep learns to listen without speaking → Tidewatch. New ability: Passive listen.');
}

/* ---------- Plant Board ---------- */
async function wtBoardScript() {
  const who = 'Hanne Sorvik', f = G.f;
  if (f.wtBoard) { await say('The Tide Badge means nobody shuts the plant down on a hunch. The operators sign, or it doesn’t happen.', who); return; }
  if (!f.wtDrill3) { await say('The Plant Board is for people who have worked the plant’s own cases. Finish with Mae and Joss first.', who); return; }
  await say('Hanne Sorvik, plant security lead. In a plant, the worst mistake isn’t always missing the intruder. Sometimes it’s turning off the water to catch one.', who);
  await say('Three rounds on the practice rig: a factory password from the internet, a download nobody planned, and a set point from nowhere. Ready?', who);
  for (const s of WT_BOARD_SPECS()) await fightStory(s, 'Hanne: Again. Safety first, then the intruder.');
  f.wtBoard = true; f.wtTide = true;
  G.focusMax = Math.max(G.focusMax, 50); G.focus = G.focusMax;
  unlock('tech', 'T1694.001'); unlock('tech', 'T0843'); unlock('tech', 'T0836');
  await say('You cleared the Plant Board. This is the Tide Badge.', who);
  await say('Its power: on any plant alert, a “shut it all down” response needs the operators’ sign-off, so a wrong call can’t take the water off. And attacks through internet-exposed devices come half as often. The field cabling gets catalogued too. (game)', who);
  await say('Rank: Tier 3 lead investigator, now across the IT/OT boundary. New responsibility: you lead the investigation; the operators and engineers who own the process have the final say on anything that touches it.');
  touchCSF('Govern');
  await evolveCheck();
}

/* ---------- Boss: a booster station goes dark (the town's incident, modelled on a real case) ---------- */
function wtBossStages(picks) {
  const ev0 = picks.includes('asis') ? 20 : 0;
  const restored = picks.includes('restore') && picks.includes('offnet') && picks.includes('safe');
  return {
    s1: {kind: 'mal', threat: 'preset', tech: 'T0883', tags: ['exposed', 'ot'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('safe') ? 9 : 14, dwell0: 20,
      title: 'Stage 1: a booster station goes dark', host: 'BS-3 · booster station 3', enemy: {spr: 'hinge', pal: 'wtPreset'},
      clues: ['01:47: the control room lost BS-3’s telemetry. At 02:20 Ike, the on-call operator, found its touchscreen showing a message calling the town’s equipment a target, the controller stopped and the pumps off. He photographed it and touched nothing.', 'Zone 3’s tank is at 78%: hours of supply. On Tunde’s instruction Ike ran the pumps in hand at 02:31; zone 3’s pressure was normal by 02:40.', 'BS-3 came with the pump vendor’s cellular modem in 2022. The inventory, copied from the vendor’s datasheet, said “remote access: none”. FW-OT and the sensor saw nothing: that path never crosses the town’s network.'],
      truth: 'A plant device reached from the internet through a vendor modem nobody had listed (Internet Accessible Device). The water is safe in hand control; now take the door away without wiping what the controller holds.',
      resp: [{label: 'Keep BS-3 in hand on the operators’ call, the controller untouched, and unplug the modem’s cable: the modem stays on', good: true},
             {label: 'Shut the high-service pumps and every booster station until the investigation is done and nothing runs at all', good: false, disrupt: 1, shutdown: true, why: 'BS-3 is safe in hand and zone 3 is on its tank. Shutting the pumps drops pressure across town: an outage you caused.'},
             {label: 'Power-cycle the controller and put BS-3 back in automatic, so the station runs normally again before the morning shift starts', good: false, why: 'The restart can lose what the controller holds only while running, and nobody knows what logic it would return to. Hand control is working.'}],
      chain: [{at: 40, text: 'A second sign-in attempt reaches the modem.'}, {at: 75, text: 'The screen flickers: someone is still connected.'}]},
    s2: {kind: 'mal', threat: 'blindside', tech: 'T0829', tags: ['ot'], story: true, group: 'c', ev0: ev0,
      rate: picks.includes('asis') ? 9 : 13, dwell0: picks.includes('asis') ? 15 : 40,
      title: 'Stage 2: what did they touch?', host: 'PLC-BS3 · read-out with the vendor', enemy: {spr: 'shade', pal: 'wtBlind'},
      clues: ['09:00, with the pump vendor’s engineer and Joss: the controller’s program and the screen project read out and compared with the offline backup from the fieldwork; the read-outs, the photographs and the modem’s log hashed and kept. Logic and set points unchanged; the screen project replaced; the controller left stopped.', 'The controller’s event list: a sign-in at 01:38 from 203.0.113.88 with the factory password. The modem’s own log: 203.0.113.88 connected 01:37–01:47. The vendor had said the password was changed; it never was.', 'FW-OT and the sensor show nothing from that path into the plant. No other device came from the pump vendor; the chemical skid was checked by hand: no modem.'],
      truth: 'Loss of View: the control room lost BS-3, and only an operator at the station could run it. The read-out shows what changed (the screen, a stopped controller) and what didn’t (logic, set points, the rest of the plant).',
      resp: [{label: 'Compare the read-out with the offline backup and look for every vendor-connected device before reloading anything', good: true},
             {label: 'Factory-reset the panel, load the backup and compare the checksums, so BS-3 is back in automatic before the read-out is finished', good: false, why: 'Reloading first erases what the read-out is for: what they changed, and how they got in.'},
             {label: 'Run an active scan of every PLC in the plant to see whether the intruder reached any of them overnight', good: false, disrupt: 1, why: 'Active scans can knock fragile controllers over in a running plant, and no scan sees a modem path either: the walkdown and the hand check of every vendor skid answer it.'}],
      chain: [{at: 60, text: 'Another address tries the old modem number.'}]},
    s3: {kind: 'mal', threat: 'preset', tech: 'T1694.001', tags: ['exposed', 'ot'], story: true, group: 'c', ev0: ev0,
      rate: restored ? 8 : 14, dwell0: restored ? 8 : 40,
      title: 'Stage 3: back to automatic, safely', host: 'BS-3 · with the operators', enemy: {spr: 'hinge', pal: 'wtPreset'},
      clues: ['14:00: the vendor changes the factory password with Joss and removes the modem for good; pump-vendor support comes through RA-01, on demand, from now on.', 'The screen project is restored and the logic confirmed from the offline backup (the checksums match); Mae’s operators test BS-3 in hand, then switch it to automatic at 16:10 with her sign-off.', 'Leadership, CISA and the FBI have the report; WaterISAC has what other utilities need. The outside exposure check now covers vendor-supplied devices, a clause in every contract.'],
      truth: 'Recovery: new credentials, the exposure gone, known-good logic from the offline backup, and automatic only after the operators test it. A factory password on a device that answered from the internet was the way in (Default Credentials).',
      resp: [{label: 'Restore from the offline backup and match the checksums; automatic only once the operators have tested it', good: true},
             {label: 'Restore from the backup, compare the checksums, and let the vendor switch BS-3 to automatic once they match', good: false, why: 'Matching checksums prove the logic, not the station: the operators test it in hand and sign off before automatic, not the vendor.'},
             {label: 'Keep the modem for the vendor, with a new password and a non-default port', good: false, why: 'AA23-335A asks for PLCs off the public internet. A new port still answers from it.'}],
      chain: [{at: 60, text: 'A scanner finds the old modem address empty.'}]}
  };
}
async function wtBossScript() {
  const who = 'Mae Arroyo', c = WT();
  await surfaceMissed(true);
  c.boss = {day: G.day}; c.exposed = 1; c.deflt = 1; track();
  await say('Tunde called me in too. BS-3 went dark at 01:47. Ike is running it by hand and zone 3 has hours of water in the tank. Nobody is in danger. Now: what happened, and how do we get it back safely?', who);
  await say('This is our incident, not a retelling. But there is a real case like it: in late 2023 CISA reported internet-exposed controllers with default passwords at US water facilities, defaced; one water authority switched to manual. It’s in your Field Manual.', who);
  unlock('fact', 'wtcase'); unlock('fact', 'wtaa23');
  await say('Leadership is told now. CISA and the FBI get the report this morning, and WaterISAC what other utilities need. Telling people is never optional, so it isn’t one of your cards.', who);
  touchCSF('Respond'); G.rep += 5; toast('Leadership, CISA and the FBI told. Reputation up.');
  await say('Tabletop. Pick four response cards. Then three stages: safe, scoped, restored.', who);
  const items = WT_CARDS.map(x => ({label: x.name, meta: {good: !!x.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from CISA, FBI, EPA and partner guidance for plant owners. (Leadership, CISA, the FBI and WaterISAC are told automatically.)</p>' +
    shownOrder(WT_CARDS, items).map(x => '<div class="card"><b>' + esc(x.name) + '</b> <span class="tag">' + x.csf + '</span><br>' + esc(x.text) + '</div>').join('');
  const sel = await UI.openModal('Tabletop: a booster station goes dark', body, items, {shuffle: true, multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => WT_CARDS[i].id);
  G.f.wtCards = picks;
  for (const id of picks) { const x = WT_CARDS.find(y => y.id === id); touchCSF(x.csf); await say(x.name + ': ' + x.fx); }
  if (picks.includes('poweroff')) { G.rep -= 2; bumpUptime(-0.02); }
  if (picks.includes('reboot')) G.rep -= 2;
  if (picks.includes('newport')) G.rep -= 1;
  if (picks.includes('later')) G.rep -= 2;
  await say('Debrief: in a plant, safety comes first and the operators decide. Then leave the device as it is for the people who can read it out, shut the door it was reached through, and restore known-good logic from the offline copy, tested before automatic. Turning everything off is a failure too.', who);
  const S = wtBossStages(picks);
  await fightStory(S.s1, 'Mae: Again. The water is safe; take your time.');
  await fightStory(S.s2, 'Mae: Again. Read it out before you reload anything.');
  await fightStory(S.s3, 'Mae: Again. My operators sign off, or it stays in hand.');
  c.led++;
  c.boss = {day: c.boss.day, picks: picks, restored: picks.includes('restore') && picks.includes('offnet') && picks.includes('safe')};
  c.exposed = 0; c.deflt = 0; track();
  G.f.wtBoss = true;
  touchCSF('Recover'); unlock('tech', 'T0829'); unlock('act', 'otrespond');
  bumpUptime(0.01);
  await say('BS-3 is back in automatic since 16:10, on my sign-off. New password, no modem, the logic matching our offline copy. Zone 3 never went short.', who);
  await say('Rae came in this morning. She’s by the vendor box, and she wants to talk about something Joss found that isn’t tonight’s intruder: svc-print.', who);
}

/* ---------- The Quiet Thread: svc-print on the vendor box, added to the file ---------- */
async function raeWaterTalk() {
  const who = 'Rae Okafor', c = WT();
  if (G.f.wtFile) { await say('On the file, with the rest. The same account, the same 2019 admin, a new place. We watch. It continues.', who); return; }
  await say('Joss told me. svc-print has an account on RA-01, the box that reaches the engineering workstation, created in March 2019 by a.kerr-adm. No sign-ins in ninety days.', who);
  while (true) {
    const i = await UI.openModal('svc-print on the vendor box', '<p>RA-01’s local account list: fc-support, pv-ksato, j.kettering, and svc-print, created 14 March 2019 by a.kerr-adm (deleted in 2021), comment “temp - printer vendor”. The same admin account and month as the Server Room nesting. RA-01 keeps 90 days of sign-ins: none for svc-print. The box is off between approved windows now. (game)</p>', [
      {label: 'Leave svc-print’s account on RA-01 for the file: a new password Rae agrees to, and an alert on any sign-in', meta: {good: true, k: 'file'}},
      {label: 'Delete svc-print from RA-01 now: a printer account has no business on a box that reaches the engineering workstation', meta: {k: 'delete'}},
      {label: 'File it as leftover from the 2019 printer rollout: no sign-ins in ninety days, and the account that made it is long gone', meta: {k: 'cruft'}},
      {label: 'Wipe RA-01’s account list and rebuild it from the vendor contracts, so nothing unexplained survives on the box', meta: {k: 'wipe'}}], {shuffle: true, closable: false, cls: 'drill'});
    const k = [0, 1, 2, 3][i];
    if (k === 0) break;
    if (k === 1) await say('Deleting it tells whoever made it that we’ve seen it, and it destroys the account’s own record. A new password, an alert on any sign-in, and the box off between windows: that’s enough for now. It’s my call, with a plan.', who);
    else if (k === 2) await say('Maybe it is leftover. But it’s the same account and the same admin as the whole suspicion file. You don’t close that as leftover. You add it.', who);
    else await say('Rebuilding the box at night, with no plan, wipes the evidence with the clutter. Write it up; don’t improvise it.', who);
  }
  c.file = {clue: 'wt-vendorbox', day: G.day};
  G.f.wtFile = true; touchCSF('Govern');
  Series.markEdition(EDITION.id, {svcPrintVendorBox: true});
  await say('Added. Now we know svc-print had a key to the plant’s door too, cut in the same month as the nesting. We still don’t know who, or why, or whether it’s moving. The file goes with you to Council Chambers.', who);
  await say('(The Quiet Thread is still on file. It continues.)');
  await say('That’s the Water Plant. Next stop: Council Chambers.', 'Mae Arroyo');
  await wtSummary();
}

/* ---------- End of district ---------- */
async function wtSummary() {
  await surfaceMissed(true);
  G.f.wtSummary = true;
  const c = WT(), d = c.drills;
  const dl = ['setpoint', 'checksum', 'officeplc'].map(k => esc(WT_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const body = '<p class="big">Water Plant district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key, Seal, Shield, Lantern, Vault, Beacon' + (G.f.svCrown ? ', Crown' : '') + (G.f.wtTide ? ', Tide' : '') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '.</p>' +
    '<p>OT assets inventoried: <b>' + wtInvPct() + '%</b> · exposed devices: <b>' + c.exposed + '</b> · default passwords: <b>' + c.deflt + '</b> · backups current: <b>' + wtBackupPct() + '%</b>' + (c.zones ? ' · zones first pass: exposure <b>' + c.zones.exposure + '</b>, broken <b>' + c.zones.broken + '</b>' : '') + '.</p>' +
    (c.boss && c.boss.picks ? '<p>The booster station: ' + (c.boss.restored ? 'kept safe in hand, read out, closed off and restored from the offline copy, automatic only after the operators’ test' : 'recovered, with gaps the debrief named') + '. Cards: ' + esc(c.boss.picks.map(id => WT_CARDS.find(x => x.id === id).name).join(', ')) + '.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    wtQtSummaryHtml() +
    '<p class="big">Next: Council Chambers.</p>';
  Series.markEdition(EDITION.id, {done: true, waterPlant: true});
  const i = await UI.openModal('End of the Water Plant', body, [{label: 'Keep exploring the Water Plant', meta: {good: true}}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
