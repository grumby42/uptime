/* ============================================================
   UPTIME · editions/town-hall/story.js
   Town Hall edition: state, objectives, map interactions, NPC talk and every
   story script (onboarding, the open port, Vex, insider risk, Dojo, Identity
   Board, the sprayed admin), the end-of-slice summary, and the edition hooks
   the shared engine calls (EDITION, newState, editionTile, introScript...).
   ============================================================ */
'use strict';

const EDITION = {
  id: 'town-hall',
  saveKey: 'uptime.slice1.save',
  title: 'Town Hall · Front Desk district',
  blurb: 'You’re the new intern in a small town’s security team. Investigate alerts, fix what’s broken, and keep the district running.',
  creditsName: 'vertical slice 1: Town Hall, Front Desk district',
  creditsFacts: 'Verizon 2025 Data Breach Investigations Report (initial access shares; ransomware at small and medium organisations) and 2026 executive summary (exploitation now first). Critical Start 2021 SOC professional survey (false positives). NIST SP 800-63B-4 (password length, no periodic changes, blocklists). Joint Cybersecurity Advisory AA24-038A (CISA, NSA, FBI and partners, February 2024).'
};

const FIX_ORDER = ['kiosk', 'wifi', 'logs'];
const PCS = [11, 14, 17];

/* ---------- State ---------- */
function newState(seed) {
  return {
    v: 1, seed: seed, map: 'desk', x: 15, y: 6, dir: 'right',
    day: 1, f: {}, party: [], active: 0, items: {guide: 0},
    focus: 30, focusMax: 30, rep: 50, uptime: 99.95,
    health: {a: 100, b: 100, c: 100, d: 100},
    rank: 'Intern', badge: false,
    m: {closed: 0, judged: 0, correctShown: 0, evOk: 0, ttaSum: 0, ttaN: 0, esc: 0, escOk: 0, missed: 0, surfaced: 0, overreact: 0, autoClosed: 0, events: 0, today: 0},
    track: {},
    targets: {closed: 12, acc: 90, evid: 80, tta: 20, esc: 75, uptime: 99.9, mfa: 100, patch: 100},
    mfaSet: ['rae', 'tomas', 'you'],
    fm: {}, csf: {}, brief: {}, pcs: {}, dojo: [false, false, false],
    fpWeight: 50, queue: 3, steps: 0, auto: false, playMs: 0
  };
}

/* ---------- Edition hooks used by the engine ---------- */
function fixesCount() { return FIX_ORDER.filter(k => G.f[k]).length; }
// Map tiles that change as the district is fixed.
function editionTile(d, ch, x, y) {
  if (d.shrink && fixesCount() >= d.shrink) { d = Object.assign({ch: '.'}, TILES['.']); }
  if (d.port && G.f.portDone) { d.spr = 'F'; d.pal = 'F'; }
  if (ch === 'p' && (G.pcs[x] || G.f.logs)) d.pal = 'pcOn';
  if (ch === 'k' && G.f.kiosk) d.pal = 'kioskOk';
  if (ch === 'n' && G.f.wifi) d.pal = 'closetOk';
  if (typeof mrTile === 'function') d = mrTile(d, ch, x, y);
  if (typeof crTile === 'function') d = crTile(d, ch, x, y);
  return d;
}
async function introScript() {
  await say('Day 1, 08:00. Town Hall, Front Desk building. Your first day as the security intern.');
  await say('Controls: move with the arrows or D-pad. A (Z) talks and confirms. B (X) goes back. Start (Enter) opens the menu. Select (Shift) opens the alert queue.');
  await say('Rae, your manager, is waiting just to your right.');
}

/* ---------- Objective (also used by the test bot) ---------- */
function objective() {
  const f = G.f;
  if (!f.starter) return {text: 'Talk to Rae, your SOC lead.', map: 'desk', x: 16, y: 6};
  if (!f.kiosk) return {text: 'Onboarding: change the visitor kiosk’s default password.', map: 'desk', x: 3, y: 4};
  if (!f.wifi) return {text: 'Onboarding: fix the guest Wi-Fi at the network closet.', map: 'desk', x: 1, y: 1};
  if (!f.logs) { const n = PCS.filter(x => G.pcs[x]).length; const pc = PCS.find(x => !G.pcs[x]); return {text: 'Onboarding: turn on logging at the staff PCs (' + n + '/3).', map: 'desk', x: pc, y: 2}; }
  if (!f.halHint) return {text: 'Stretch your legs: Hal from facilities is outside.', map: 'hub', x: 17, y: 7};
  if (!f.portDone) return {text: 'Report back to Rae.', map: 'desk', x: 16, y: 6};
  if (G.day < 2) return {text: 'End your shift at your desk.', map: 'desk', x: 16, y: 7};
  if (!f.vexDone) return {text: 'Head south through the cabling toward the Identity Board.', map: 'hub', x: 14, y: 12, step: true};
  if (!f.insider || f.insider === 'seen') return {text: '(Optional) Owen, by the records office, seems upset.', map: 'hub', x: 8, y: 10};
  if (f.insider === 'toReport') return {text: 'Report what you saw to Grace, the HR partner.', map: 'hub', x: 12, y: 9};
  if (!f.dojoDone) {
    if (!f.dojoMet) return {text: '(Optional) Train at the Password Cracking Dojo.', map: 'dojo', x: 9, y: 5};
    const i = G.dojo.findIndex(d => !d); return {text: '(Optional) Dojo puzzle ' + (i + 1) + ' of 3.', map: 'dojo', x: [5, 9, 13][i], y: 2};
  }
  if (!f.boardDone) return {text: 'Take the Identity Board challenge (Marisol Diaz).', map: 'board', x: 9, y: 2};
  if (!f.bossDone) return {text: 'Rae needs you: an incident is starting.', map: 'desk', x: 16, y: 6};
  if (typeof mrObjective === 'function') { const o = mrObjective(); if (o) return o; }
  return {text: 'Slice complete. Next: the Mail Room.', done: true};
}

function triggers() {
  if (typeof mrTriggers === 'function' && mrTriggers()) return true;
  if (typeof crTriggers === 'function' && crTriggers()) return true;
  if (G.map === 'hub' && G.y >= 11) {
    if (!G.f.portDone || G.day < 2) {
      run(async () => {
        await say(!G.f.portDone ? 'Rae (radio): Not yet. Finish onboarding with me first.' : 'Rae (radio): It’s late. End your shift at your desk; the Board will still be there tomorrow.');
        G.y = 10; G.dir = 'up';
      });
      return true;
    }
    if (!G.f.vexDone) { run(vexScript); return true; }
  }
  return false;
}

/* ---------- Interaction ---------- */
function interact() {
  const [dx, dy] = DIRS[G.dir];
  const tx = G.x + dx, ty = G.y + dy;
  const npc = npcHere(G.map, tx, ty);
  if (npc) { run(() => talk(npc)); return; }
  const ch = tileChar(G.map, tx, ty);
  const door = doorAt(G.map, tx, ty);
  if (door && door.locked) { run(async () => { await say(door.locked); }); return; }
  if (typeof mrInteract === 'function' && mrInteract(ch, tx, ty)) return;
  if (typeof crInteract === 'function' && crInteract(ch, tx, ty)) return;
  if (ch === 'k') run(kioskTask);
  else if (ch === 'n') run(wifiTask);
  else if (ch === 'p') run(() => pcTask(tx));
  else if (ch === 'Y') run(deskEnd);
  else if (ch === 'q') run(() => dojoPuzzle([5, 9, 13].indexOf(tx)));
  else if (ch === 'S') run(async () => { await say('TOWN HALL. North: the firewall. South: the Identity Board and the Dojo, through the cabling. Stairs: IT Basement.'); });
  else if (ch === 'X') run(async () => { await say('IT Basement. The door is locked: “Coming in the next slice.”'); });
  else if (ch === 'O') run(async () => { await say(G.f.portDone ? 'The port is closed. The contractor now connects through the VPN, with MFA.' : 'A gap in the firewall: a remote-desktop port left open to the internet.'); });
  else if (ch === 'K') run(async () => { await say('Server racks hum. Status lights blink green.'); });
}

/* ---------- Story: NPC talk ---------- */
async function mfaMeet(npc) {
  if (G.badge && npc.acct && !G.mfaSet.includes(npc.id)) {
    G.mfaSet.push(npc.id); track();
    await say('Key Badge: MFA is now enforced on ' + npc.name.split(' ')[0] + '’s account. (MFA coverage ' + metricVals().mfa + '%)');
  }
}
async function talk(npc) {
  const who = npc.name;
  const f = G.f;
  switch (npc.id) {
    case 'rae': await raeTalk(); break;
    case 'dee':
      if (!f.kiosk) await say('Morning! The visitor kiosk still uses the password from the manual: admin, admin. Everyone knows it.', who);
      else if (!f.wifi) await say('The new kiosk passphrase is long, and it lives in the password vault, not on a sticky note. Progress!', who);
      else await say('Yesterday someone called pretending to be IT and asked for my sign-in code. I hung up and called the help desk back on the number on my badge.', who);
      break;
    case 'tomas':
      if (!f.wifi) await say('The guest Wi-Fi and the staff PCs share one flat network. A visitor’s laptop could talk straight to Lin’s PC. The closet’s right behind me.', who);
      else if (!f.logs) await say('Next: logging. The staff PCs barely audit anything, and their logs never leave the PC. Switch on the audit policy and I’ll forward the logs to a collector.', who);
      else await say('Logs are flowing. Without them every investigation is guesswork.', who);
      break;
    case 'lin':
      if (!f.logs) await say('My PC’s security logs never leave my PC? Then how would anyone know if something happened on it?', who);
      else await say('The HVAC contractor had his laptop plugged in at the Annex all last week. He said he’d “finish from home”.', who);
      break;
    case 'hal':
      if (!f.halHint && f.starter) {
        await say('You’re the new analyst? Quick question. The HVAC contractor asked me to open a remote-desktop port on the Annex so he can adjust the thermostats from home.', who);
        await say('I had IT open it last week. That’s fine, right? It’s only him using it. I think.', who);
        f.halHint = true; unlock('tech', 'T1133');
        await say('(An internet-facing remote-desktop port with a password only. Worth telling Rae.)');
      } else if (!f.portDone) await say('The contractor says remote access saves him a two-hour drive.', who);
      else { await say('The contractor uses the VPN with MFA now. He grumbled for a minute, then said it was easy.', who); await qtHal(who); }
      break;
    case 'sam':
      if (!f.wifi) await say('I’m here for a meeting. The guest Wi-Fi password was on a sticky note on the counter. Handy!', who);
      else await say('Guest Wi-Fi only reaches the internet now. Fine by me: I only need email.', who);
      break;
    case 'owen': await owenTalk(); break;
    case 'grace': await graceTalk(); break;
    case 'vex': await vexScript(); break;
    case 'marisol': await boardScript(); break;
    case 'imani': await dojoIntro(); break;
    default: if (typeof mrTalk === 'function') await mrTalk(npc); if (typeof crTalk === 'function') await crTalk(npc);
  }
  await mfaMeet(npc);
}

async function raeTalk() {
  const f = G.f, who = 'Rae Okafor';
  if (!f.starter) {
    await say('Day 1. Welcome to the Town Hall security team. I’m Rae Okafor, SOC lead. You’re our intern.', who);
    await say('Our job: keep the district running and notice when someone is trying to break in. Every alert is a question. Some are attacks; most aren’t.', who);
    await say('First you need a tool. I have budget for one starter. Pick the one that fits how you think.', who);
    const ids = ['sentry', 'lantern', 'ledger'];
    const i = await choose('Choose your starter tool:', ids.map(id => ({label: TOOLS[id].name + ' (' + CLASSES[TOOLS[id].cls].label + ' · ' + TOOLS[id].sub + ')', note: TOOLS[id].blurb, meta: {good: id === 'sentry'}})), {who: who});
    const id = ids[i];
    addTool(id, 3); f.starter = id;
    await say(TOOLS[id].name + ' is installed on your console. Tools aren’t thrown at problems: you run them, and their abilities cost Focus.', who);
    await say('If an alert looks real and bigger than you, choose “Ask Rae” in the alert. Bring evidence: what you saw and why it matters. I judge escalations on that, not on how many you send.', who);
    await say('Press Select (Shift) any time to open the alert queue. Walking through the tangled cabling outside can also trip alerts: that space isn’t monitored yet.', who);
    await say('Onboarding tasks: change the kiosk’s default password, put guest Wi-Fi on its own network at the closet, and turn on logging at the staff PCs. Each fix shows up on the map.', who);
    unlock('fact', 'fp');
    await briefing();
    return;
  }
  if (!(f.kiosk && f.wifi && f.logs)) {
    const left = [!f.kiosk && 'the kiosk password', !f.wifi && 'the guest Wi-Fi', !f.logs && 'logging on the staff PCs'].filter(Boolean);
    await say('Still to do: ' + left.join(', ') + '. Press Start (Enter) for your scorecard and objective.', who);
    return;
  }
  if (!f.halHint) { await say('Baseline done. Nice. Go stretch your legs; Hal from facilities was asking for someone from security.', who); return; }
  if (!f.portDone) { await portScript(); return; }
  if (G.day < 2) { await say('Good first day. End your shift at your desk when you’re ready.', who); return; }
  if (!f.vexDone) { await say('The Identity Board is south, past the cabling. Fair warning: the town hired a red teamer called Vex to test us.', who); return; }
  if (!f.boardDone) { await say('Marisol runs the Identity Board. Clear her challenge and you’re a Tier 1 analyst.', who); return; }
  if (!f.bossDone) { await bossScript(); return; }
  await say('You held the Front Desk. The Mail Room is next.', who);
  await summary();
}

/* ---------- Onboarding tasks ---------- */
async function fixDone(key, msg) {
  G.f[key] = true; track();
  await say(msg);
  toast('Map updated: lights on, cabling tidied');
  if (G.f.kiosk && G.f.wifi && G.f.logs && !G.f.onboarded) {
    G.f.onboarded = true;
    await say('Onboarding baseline complete. Hardening ' + metricVals().patch + '%. Check the scorecard with Start.');
  }
}
async function kioskTask() {
  if (!G.f.starter) { await say('The visitor kiosk. Rae should brief you first.'); return; }
  if (G.f.kiosk) { await say('Kiosk: signed in with the new passphrase. Default login disabled.'); return; }
  await say('The visitor kiosk admin login is still admin / admin: the manufacturer default, printed in the public manual.');
  while (true) {
    const i = await choose('Change it to…', [
      {label: 'A long random passphrase, stored in the team password vault', meta: {good: true}},
      {label: '“Kiosk2026!”: it has a capital, a digit and a symbol'},
      {label: 'Leave it: visitors never see the admin screen'}]);
    if (i === 0) break;
    if (i === 1) await say('Short and predictable: a year and a symbol are the first things spraying tools try. Length matters more than symbols.');
    else await say('Default passwords are public. Anyone who reads the manual has the keys.');
  }
  unlock('tech', 'T1078.001'); unlock('act', 'passphrase'); touchCSF('Protect');
  await fixDone('kiosk', 'Done. Default credentials gone (ATT&CK T1078.001, Default Accounts, is now one less way in). The Front Desk windows light up.');
}
async function wifiTask() {
  if (!G.f.starter) { await say('The network closet. Rae should brief you first.'); return; }
  if (G.f.wifi) { await say('Guest Wi-Fi: its own network, internet only. Staff network untouched.'); await qtCloset(); return; }
  await say('The network closet. Guest Wi-Fi and the staff PCs share one flat network.');
  while (true) {
    const i = await choose('Fix it by…', [
      {label: 'Hiding the guest network’s name'},
      {label: 'Putting guest Wi-Fi on its own segment that can only reach the internet', meta: {good: true}},
      {label: 'Changing the guest password every day'}]);
    if (i === 1) break;
    if (i === 0) await say('A hidden network name is still visible to anyone listening. It doesn’t separate anything.');
    else await say('A new password doesn’t stop a guest who is already on from reaching staff PCs.');
  }
  unlock('act', 'segment'); touchCSF('Protect'); touchCSF('Identify');
  await fixDone('wifi', 'Guest Wi-Fi now lives on its own segment. The guest lounge lights up and the cabling shrinks.');
}
async function pcTask(x) {
  if (!G.f.starter) { await say('A staff PC. Rae should brief you first.'); return; }
  if (G.pcs[x] || G.f.logs) { await say('Security logging is on and forwarding.'); if (G.f.logs) await qtPc(x); return; }
  await say('This PC’s security auditing is barely configured, and nothing is forwarded anywhere. You switch on the audit policy and point it at the collector.');
  G.pcs[x] = true;
  const n = PCS.filter(p => G.pcs[p]).length;
  if (n < 3) { await say('Logging enabled (' + n + '/3).'); return; }
  unlock('act', 'logging'); touchCSF('Protect'); touchCSF('Detect');
  await fixDone('logs', 'All three staff PCs are logging. The records office lights up.');
  if (!hasTool('ledger')) {
    addTool('ledger', 3);
    await say('Tomas: I set up an open-source log collector for those logs. Download done; it’s on your console now. Meet Ledger.', 'Tomas Reyes');
  } else {
    const t = G.party.find(p => p.id === 'ledger'); t.lvl++;
    await say('Ledger has real logs to read now. Ledger reached Lv ' + t.lvl + '.');
  }
}
async function deskEnd() {
  if (!G.f.starter) { await say('Your desk. Talk to Rae first.'); return; }
  if (!G.f.portDone && G.day === 1) { await say('Your desk. Too early to go home: onboarding comes first.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}];
  if (qtDeskReady()) opts.push({label: 'Ledger console: overnight sign-ins', meta: {k: 'console'}});
  opts.push({label: 'Not yet', meta: {k: 'no'}});
  const i = await choose('Your desk. End your shift?', opts);
  if (opts[i].meta.k === 'end') await endShift('desk');
  else if (opts[i].meta.k === 'console') await qtDeskConsole();
}

/* ---------- Port attack (first real attack) ---------- */
const PORT_SPEC = () => ({
  kind: 'mal', threat: 'jamb', tech: 'T1133', tags: ['remote'], story: true, group: 'd', rate: 13,
  title: 'Remote desktop sign-in from overseas', host: 'ANNEX-PC-03 · Annex',
  enemy: {spr: 'jamb', pal: 'jamb'},
  clues: ['A remote-desktop session to ANNEX-PC-03 came straight in from the internet at 01:47.', 'It used the HVAC contractor’s account. The port was opened for him last week.', 'The contractor says he hasn’t connected since Tuesday, and the address is on another continent.'],
  truth: 'An attacker used the open remote-desktop port and the contractor’s password: External Remote Services.',
  resp: [{label: 'End the session, close the port, reset the contractor’s account, check ANNEX-PC-03 and what was copied', good: true},
         {label: 'Leave it: it’s probably the contractor', good: false},
         {label: 'Unplug the whole district from the internet', good: false, disrupt: 2}],
  chain: [{at: 35, text: 'The session starts browsing the Annex file share.'}, {at: 70, text: 'Large files are being copied out over the session.'}]
});
async function portScript() {
  const who = 'Rae Okafor';
  await say('Hal told you about the Annex port? Good timing. The board just lit up: a remote-desktop sign-in on the Annex PC, from overseas.', who);
  await say('This is real. Investigate, then close it with a verdict and a response. I’m right here.', who);
  await fightStory(PORT_SPEC(), 'Try again. Contain first, then scope: what did that session touch?');
  G.f.portDone = true; G.mfaSet.push('contractor'); track();
  bumpUptime(0.01);
  await say('The port is shut and the contractor has a VPN with MFA. Look at the firewall on the map: no more gap. The Annex lights up.', who);
  await say('Leadership approved a budget request: one more tool. Pick what the team is missing.', who);
  const rest = ['sentry', 'lantern', 'ledger'].filter(id => !hasTool(id));
  if (rest.length) {
    const i = await choose('Budget request: add a tool', rest.map(id => ({label: TOOLS[id].name + ' (' + CLASSES[TOOLS[id].cls].label + ')', note: TOOLS[id].blurb, meta: {good: true}})), {who: who});
    addTool(rest[i], 3);
    await say(TOOLS[rest[i]].name + ' joins your console. Switch tools mid-investigation with “Switch tool”.', who);
  }
  await say('That’s Day 1. End your shift at your desk when you’re ready.', who);
}

/* ---------- Rival ---------- */
const VEX_SPEC = () => ({
  kind: 'mal', threat: 'lure', tech: 'T1078', tags: ['identity'], story: true, group: 'a', rate: 12,
  title: 'Lin signed in from two places at once', host: 'lin.zhao · Front Desk',
  enemy: {spr: 'actor', pal: 'actor'},
  clues: ['Lin’s account signed in from the office and, two minutes later, from a hosting provider.', 'Yesterday Lin got an email linking to a sign-in page one letter off from ours.', 'The second session is reading the shared finance folder.'],
  truth: 'Vex phished Lin’s password and signed in with it.',
  resp: [{label: 'Reset Lin’s password, revoke her sessions, block the look-alike domain', good: true},
         {label: 'Isolate Lin’s PC', good: false, disrupt: 2, why: 'Nothing points to her PC: the second session comes from a hosting provider, using her account. Cutting off her PC doesn’t touch it.'},
         {label: 'Close it: Lin travels a lot', good: false}],
  chain: [{at: 30, text: 'The second session lists the shared drives.'}, {at: 65, text: 'It opens finance spreadsheets one by one.'}]
});
async function vexScript() {
  G.f.vexMet = true;
  const who = 'Vex';
  await say('Hold up, intern. Name’s Vex. The town pays me to break in before someone else does.', who);
  await say('I’ve already got a foothold in your district. Find it. Fast.', who);
  await fightStory(VEX_SPEC(), 'Vex: Too slow. Again: same trick, fresh logs.');
  await say('Not bad. Since you earned it, here’s what I did, step by step:', who);
  for (const [id, line] of VEX_EXPLAIN) { unlock('tech', id); await say(line, who); }
  await say('Real attackers chain small, boring steps. Notice any one and act on it, and the chain breaks. See you at the Board.', who);
  G.f.vexDone = true;
  G.targets.tta = 15; G.f.directive = true; touchCSF('Govern');
  await say('Rae (radio): Directive from leadership: the time-to-acknowledge target drops from 20 s to 15 s. Speed matters, but closing alerts fast and wrong always comes back to bite.');
  await say('Rae (radio): Remember the hidden part of the scorecard: an alert you close as harmless that was really an attack still counts. Incident review finds it later and corrects your accuracy. When a measure becomes a target, people game it; don’t.');
}

/* ---------- Insider risk ---------- */
async function owenTalk() {
  const who = 'Owen Pike', f = G.f;
  if (f.insider === 'defused') { await say('HR asked me to help design the new archive process. Turns out someone noticed fifteen years counts for something.', who); return; }
  if (f.insider === 'reported' ) { await say('Grace from HR asked to grab coffee tomorrow about the reorg. Didn’t expect that.', who); f.insider = 'defused'; return; }
  if (f.insider === 'toReport') { await say('Still here. Still annoyed.', who); return; }
  await say('Fifteen years on this archive, and the reorg hands my team to someone who started last spring.', who);
  await say('Maybe they’ll find out how it feels when nobody knows where the files are.', who);
  f.insider = 'seen';
  const opts = [
    {label: 'Search Owen’s email and files to see what he’s planning'},
    {label: 'Tell the team to keep an eye on Owen'},
    {label: 'Ignore it: he’s just venting'},
    {label: 'Report what you heard, factually, to the insider-risk process (HR)', meta: {good: true}}];
  while (true) {
    const i = await choose('(Resentment after a reorg can be an early warning sign. What do you do?)', opts);
    if (i === 3) break;
    if (i === 0) await say('Don’t snoop. Looking through someone’s mail without authorisation breaks policy, maybe the law, and ruins any real investigation. That’s for the formal process.');
    else if (i === 1) await say('That turns one remark into gossip and can wreck a person’s reputation. One sign proves nothing.');
    else await say('Most venting is just venting. But you don’t have to judge it: a short factual report lets the people trained for this decide, quietly.');
  }
  f.insider = 'toReport'; unlock('act', 'insider');
  await say('(One sign proves nothing. Your job is to pass on what you observed, not to investigate. Grace, the HR partner, is by the plaza.)');
}
async function graceTalk() {
  const who = 'Grace Kim', f = G.f;
  if (f.insider === 'toReport') {
    await say('Thanks for coming to me. You did the right thing: you told me what you heard, not what you think he’ll do.', who);
    await say('HR, legal and security look at concerns like this together. Most turn out to be someone having a bad month. I’ll check in with Owen, supportively.', who);
    await say('One sign proves nothing, and you didn\u2019t treat it like proof. Keep this between us: it\u2019s need-to-know. That\u2019s how this is supposed to work.', who);
    f.insider = 'defused'; touchCSF('Govern');
    return;
  }
  if (f.insider === 'reported' || f.insider === 'defused') { await say('Owen’s doing better. The reorg left him feeling invisible; now he’s helping shape the new team.', who); return; }
  await say('I’m the HR partner for this district. If something at work worries you, about a person or a process, my door is open.', who);
}

/* ---------- Dojo ---------- */
async function dojoIntro() {
  const who = 'Imani Brooks';
  if (!G.f.vexDone) { await say('The Dojo opens once you’re past the onboarding rush.', who); return; }
  if (!G.f.dojoMet) {
    G.f.dojoMet = true;
    await say('Welcome to the Password Cracking Dojo. I coach the team for National Cyber League-style games.', who);
    await say('Three terminals, three puzzles: length, hashing, salting. Solve them all and I’ll give you a Tuning Guide.', who);
    return;
  }
  if (G.f.dojoDone) { await say('Remember: long beats clever, hashes are one-way, salt is per user.', who); return; }
  await say('Puzzles solved: ' + G.dojo.filter(Boolean).length + ' of 3. The terminals are along the back wall.', who);
}
async function dojoPuzzle(i) {
  if (!G.f.dojoMet) { await say('A practice terminal. Talk to Coach Imani first.'); return; }
  if (G.dojo[i]) { await say('Solved. ' + DOJO[i].explain); return; }
  const p = DOJO[i];
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})));
    if (k === p.good) break;
    await say('Not quite. Think it through and try again.');
  }
  await say('Correct. ' + p.explain);
  G.dojo[i] = true;
  if (i === 0) unlock('fact', 'nist');
  touchCSF('Protect');
  if (G.dojo.every(Boolean)) {
    G.f.dojoDone = true; G.items.guide = 1;
    await say('Imani: All three. Here: a Tuning Guide. Use it on a tool that has reached Lv 5 to tune it.', 'Imani Brooks');
    await evolveCheck();
  }
}
async function evolveCheck() {
  if (typeof mrEvolveCheck === 'function') await mrEvolveCheck();
  if (typeof crEvolveCheck === 'function') await crEvolveCheck();
  if (!G.items.guide) return;
  const t = G.party.find(p => p.lvl >= 5 && !p.tuned);
  if (!t) return;
  const i = await choose(TOOLS[t.id].name + ' (Lv ' + t.lvl + ') is ready to be Tuned. Use the Tuning Guide?', [{label: 'Tune it', meta: {good: true}}, {label: 'Later'}]);
  if (i !== 0) return;
  G.items.guide = 0; t.tuned = true;
  await say(TOOLS[t.id].name + ' was Tuned! Fewer noisy detections, sharper abilities (power ×1.25).');
}

/* ---------- Identity Board ---------- */
const BOARD_SPECS = () => [
  {kind: 'mal', threat: 'sprayer', tech: 'T1110.003', tags: ['identity'], story: true, rate: 12, group: 'a',
   title: 'Round 1: failed sign-ins across 60 accounts', host: 'Board practice tenant', enemy: {spr: 'sprayer', pal: 'sprayer'},
   clues: ['60 accounts, one or two attempts each, in ten minutes: below the lockout threshold.', 'All from a small set of hosting-provider addresses.', 'One practice account with an old password signed in.'],
   truth: 'Password spraying against the practice accounts.',
   resp: [{label: 'Reset the account that fell, revoke its sessions, enforce MFA, block the sources', good: true}, {label: 'Lock all 60 accounts for a week', good: false, disrupt: 1}, {label: 'Close: failures are normal', good: false}],
   chain: [{at: 40, text: 'Another wave of attempts with a different common password.'}, {at: 75, text: 'A second account accepts the password.'}]},
  {kind: 'mal', threat: 'sprayer', tech: 'T1621', tags: ['identity'], story: true, rate: 12, group: 'a',
   title: 'Round 2: 23 MFA prompts at 2 a.m.', host: 'lin.zhao · phone', enemy: {spr: 'buzzer', pal: 'buzzer'},
   clues: ['Lin’s phone received 23 sign-in approval prompts between 02:00 and 02:20.', 'Each prompt followed a correct password: the attacker already has it.', 'The sign-ins come from a city Lin has never been to.'],
   truth: 'MFA fatigue: flooding Lin with prompts, hoping she taps Approve.',
   resp: [{label: 'Tell Lin to deny, reset her password, switch to number-matching prompts', good: true}, {label: 'Tell Lin to approve one so they stop', good: false}, {label: 'Turn MFA off for Lin until it calms down', good: false}],
   chain: [{at: 40, text: 'The prompts speed up: one every 20 seconds.'}, {at: 75, text: 'A text arrives “from IT”: “Just approve it so we can fix the bug”.'}]},
  {kind: 'mal', threat: 'caller', tech: 'T1684.001', tags: ['voice', 'identity'], story: true, rate: 11, group: 'a',
   title: 'Round 3: “the CFO” calls the help desk', host: 'help desk line', enemy: {spr: 'caller', pal: 'impostor'},
   clues: ['A caller says he is the CFO, travelling, lost his phone, and needs his MFA reset right now.', 'He is angry and in a hurry, and asks the agent to skip the usual checks.', 'The real CFO answers his desk phone from the directory: he is in the building.'],
   truth: 'Help-desk impersonation: a fake executive pushing for an MFA reset.',
   resp: [{label: 'Refuse the reset, verify by calling back the directory number, report the call', good: true}, {label: 'Reset his MFA: he’s the CFO', good: false}, {label: 'Email him a temporary password', good: false}],
   chain: [{at: 40, text: 'The caller threatens to complain to the agent’s boss.'}, {at: 75, text: 'A second agent receives the same call.'}]}
];
async function boardScript() {
  const who = 'Marisol Diaz';
  if (G.f.boardDone) { await say('Every account you meet gets MFA now. That badge is a responsibility, not a trophy.', who); return; }
  if (!G.f.vexDone) { await say('Come back after you’ve dealt with Vex.', who); return; }
  await say('I’m Marisol Diaz, identity lead. Plenty of break-ins don’t smash anything: they sign in.', who);
  await say('Three rounds: a password spray, an MFA fatigue push, and a help-desk impersonation call. Ready?', who);
  const specs = BOARD_SPECS();
  for (let r = 0; r < 3; r++) await fightStory(specs[r], 'Marisol: Again. Read the evidence before you react.');
  unlock('act', 'numbermatch'); unlock('act', 'callback'); unlock('fact', 'dbir_ia');
  G.f.boardDone = true; G.badge = true; G.rank = 'Tier 1 analyst'; G.focusMax = 34; G.focus = G.focusMax;
  if (!G.mfaSet.includes('marisol')) G.mfaSet.push('marisol');
  addTool('keyling', 5); track();
  await say('You cleared the Identity Board. This is the Key Badge.', who);
  await say('Its power: you enforce MFA on every account you meet. Sprays still come, but a guessed password alone no longer gets in, so Sprayer alerts on the map drop by half (game). Keyling joins your console.', who);
  await say('Rank up: Intern → Tier 1 analyst. New responsibility: you escalate straight to Tier 2 / incident response, without going through Rae. Bring evidence.');
  touchCSF('Protect');
  if (hasTool('ledger')) {
    const i = await choose('Rae: With Tier 1 comes automation. Ledger can auto-close alerts matching known false-positive patterns while you walk. Risk: about 1 in 50 auto-closed alerts might be real (game), and nobody looks at those. Turn it on?',
      [{label: 'Turn automation on', meta: {good: true}}, {label: 'Not now (toggle later in the Start menu)'}]);
    G.f.autoUnlocked = true; G.auto = i === 0;
  }
  await evolveCheck();
}

/* ---------- Boss: The sprayed admin ---------- */
async function bossScript() {
  const who = 'Rae Okafor';
  await surfaceMissed(true);
  await say('Incident: “The sprayed admin”. fd-admin, the Front Desk admin account, had no MFA. It was sprayed overnight and someone is using it.', who);
  await say('Tabletop first. Pick three response cards. Then we work it in three stages.', who);
  const body = '<p>Pick <b>three</b> cards. Each is written from public ATT&amp;CK / D3FEND-style actions.</p>' +
    CARDS.map(c => '<div class="card"><b>' + esc(c.name) + '</b> <span class="tag">' + c.csf + '</span><br>' + esc(c.text) + '</div>').join('');
  const items = CARDS.map(c => ({label: c.name, meta: {good: ['reset', 'revoke', 'devices'].includes(c.id)}})).concat([{label: 'Play these three cards', done: true, meta: {done: true}}]);
  const sel = await UI.openModal('Tabletop: the sprayed admin', body, items, {multi: 3, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => CARDS[i].id);
  G.f.cards = picks;
  for (const id of picks) {
    const c = CARDS.find(x => x.id === id);
    touchCSF(c.csf);
    await say(c.name + ': ' + c.fx);
  }
  if (picks.includes('isolate')) bumpUptime(-0.02);
  if (picks.includes('notify')) G.rep += 5;
  await say('Debrief: there is no single right trio. Reset the password, revoke sessions and remove rogue MFA devices in the same step, or the attacker walks back in. Enforcing MFA keeps it from happening again, but it doesn’t evict a device the attacker already enrolled. Logs scope it; telling leadership is part of the response. Isolating a host does little when the attacker is using an account, not a PC.', who);
  await say('One more question for later: why was fd-admin on an MFA “exception” list at all? Who approved it, and who reviews that list? That’s a Govern question, and it’s how this started.', who);
  touchCSF('Govern');
  const stages = bossStages(picks);
  for (const s of stages) await fightStory(s, 'Rae: Regroup. Same stage, we go again.');
  touchCSF('Respond'); touchCSF('Recover'); unlock('fact', 'dbir_rw');
  if (!G.mfaSet.includes('fdadmin')) G.mfaSet.push('fdadmin');
  bumpUptime(0.01);
  await say('Recover: fd-admin is back in service with a new passphrase and MFA, the rogue device is gone, its sessions are revoked, and the services it touched are checked.', who);
  await say('That’s the Front Desk district secured. Next stop: the Mail Room.', who);
  G.f.bossDone = true;
  await summary();
}
// The three boss stages, shaped by the tabletop picks. Enforcing MFA does not touch Stage 3: the attacker's
// device is already an enrolled factor. Only reviewing and removing enrolled devices does (ATT&CK T1098.005).
function bossStages(picks) {
  const ev0 = picks.includes('logs') ? 20 : 0;
  return [
    {kind: 'mal', threat: 'sprayer', tech: 'T1110.003', tags: ['identity'], story: true, rate: 12, group: 'a', ev0: ev0,
     title: 'Stage 1: fd-admin in the spray', host: 'fd-admin', enemy: {spr: 'sprayer', pal: 'bossSpray'},
     clues: ['fd-admin was one of 60 accounts tried with the same seasonal password in ten minutes.', 'fd-admin was on an MFA “exception” list, for convenience.', 'fd-admin’s attempt succeeded.'],
     truth: 'Password spraying found an admin account without MFA.',
     resp: [{label: 'Confirm the compromise and start containment on fd-admin', good: true}, {label: 'Close: failed sign-ins are normal', good: false}],
     chain: [{at: 50, text: 'fd-admin’s sign-in is followed by a second, from a new location.'}]},
    {kind: 'mal', threat: 'jamb', tech: 'T1078', tags: ['identity'], story: true, group: 'a', ev0: ev0,
     rate: picks.includes('revoke') ? 9 : 14, dwell0: picks.includes('reset') ? 15 : 40,
     title: 'Stage 2: fd-admin signs in from abroad', host: 'fd-admin · admin console', enemy: {spr: 'actor', pal: 'impostor'},
     clues: ['New sign-in for fd-admin from a hosting provider abroad.', 'The session opened the admin console and listed every user.', 'Nobody on the team was working at that hour.'],
     truth: 'The attacker is using the admin’s valid credentials.',
     resp: [{label: 'Reset fd-admin and revoke all its sessions', good: true}, {label: 'Isolate the admin’s workstation', good: false, disrupt: 2, why: 'Nothing points to that PC: the sign-ins come from a hosting provider abroad.'}, {label: 'Wait and watch a little longer', good: false}],
     chain: [{at: 60, text: 'The session starts exporting the user list.'}]},
    {kind: 'mal', threat: 'sprayer', tech: 'T1098.005', tags: ['identity'], story: true, group: 'a', ev0: ev0,
     rate: picks.includes('devices') ? 8 : 14, dwell0: picks.includes('devices') ? 10 : 45,
     title: 'Stage 3: a new MFA device appears', host: 'fd-admin · MFA settings', enemy: {spr: 'buzzer', pal: 'bossSpray'},
     clues: ['A phone nobody recognises was enrolled as fd-admin’s second factor.', 'The enrolment happened inside the attacker’s session.', 'Unless it’s removed, the attacker keeps a way back in, even after a password reset.'],
     truth: 'Device registration: the attacker enrolled their own MFA device to keep access.',
     resp: [{label: 'Remove the rogue device, revoke sessions, re-enrol MFA in person, review other admin accounts', good: true}, {label: 'Leave it: MFA is on now, so we’re safe', good: false, why: 'The rogue phone is an MFA device. MFA being on lets it in; only removing it closes that door.'}, {label: 'Enforce MFA on fd-admin again', good: false, why: 'It is already enforced, and the attacker’s phone satisfies it. Remove the device.'}],
     chain: [{at: 60, text: 'The rogue device approves a new sign-in.'}]}
  ];
}

/* ---------- Missed attacks surface ---------- */
async function surfaceMissed(force) {
  const hidden = G.m.missed - G.m.surfaced;
  if (hidden <= 0 || (!force && hidden < 2)) return;
  G.m.correctShown = Math.max(0, G.m.correctShown - hidden);
  G.m.surfaced = G.m.missed;
  bumpUptime(-0.05); G.rep -= 3 * hidden;
  await say('Incident review: ' + hidden + ' alert' + (hidden > 1 ? 's' : '') + ' closed as not malicious were real attacks. Your accuracy has been corrected.', 'Rae Okafor');
  await say('Fast closes look great on a scorecard until they don’t. Gaming a metric hides risk; it doesn’t remove it.', 'Rae Okafor');
  if (!force) {
    const spec = genAlert('mal'); spec.dwell0 = 45; spec.title = 'Follow-up: ' + spec.title;
    await say('One of them is still active. Investigate it now.');
    await doBattle(spec);
  }
}

/* ---------- End of slice ---------- */
async function summary() {
  await surfaceMissed(true);
  G.f.summaryShown = true;
  const v = metricVals();
  const body = '<p class="big">Front Desk district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badge <b>' + (G.badge ? 'Key Badge' : 'none') + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Insider-risk concern: <b>' + ({defused: 'reported; HR followed up supportively', reported: 'reported', toReport: 'seen, not yet reported', seen: 'seen, not handled'}[G.f.insider] || 'not encountered') + '</b>. Tool tuned: <b>' + (G.party.some(t => t.tuned) ? 'yes' : 'no') + '</b>. Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    qtSummaryHtml() +
    '<p class="big">Next: the Mail Room.</p>';
  Series.markEdition(EDITION.id, {done: true});
  const i = await UI.openModal('End of slice 1', body, [{label: 'Keep exploring the district', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
