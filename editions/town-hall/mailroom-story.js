/* ============================================================
   UPTIME · editions/town-hall/mailroom-story.js
   Town Hall district 2, the Mail Room: state, objectives, interactions, talk,
   the inbox room, the text stream, the phone booth, three investigation drills
   (with Tally, the AI assistant), the OSINT dojo, the Mail Board, the payment
   fraud incident, scorecard metrics, and the end-of-district summary.
   The Front Desk story calls in through small hooks (mrObjective, mrTriggers,
   mrInteract, mrTalk, mrTile, mrEvolveCheck); the engine through alertWeight,
   alertHost, briefList, onAbility, onAlertClosed, editionMetricVals,
   editionScoreHtml and peekExtra.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Mail Room: FBI IC3 2025 Internet Crime Report (business email compromise complaints and losses; Financial Fraud Kill Chain). IETF RFC 9989 (DMARC, May 2026), RFC 7208 (SPF), RFC 6376 (DKIM), RFC 8601 (Authentication-Results), RFC 5321 (SMTP trace fields). CISA fact sheet on number matching (October 2022). FTC text-scam data (April 2025). Chromium page-transition types (browser history).';
  EDITION.creditsInspiration = 'The investigation drills are inspired by Chris Sanders’s Investigation Path posts. Every case in this game is original; none of his material is reproduced.';
}

/* ---------- State ---------- */
function MR() {
  if (!G.mr) G.mr = {day0: G.day, inbox: [], osint: [false, false, false], drills: {}, rep: {seen: 30, reported: 3}, tq: [], bec: 0, rulebook: false, gauntlet: null};
  return G.mr;
}
function mrOn() { return !!(G && G.f && G.f.mrMet && G.mr); }
function inMail() { return MR_MAPS.includes(G.map); }
function mrDay(s) { return String(s).replace(/\{D\}/g, String(G.day)); }
function mrReported(n) { const r = MR().rep; r.reported = Math.min(r.seen, r.reported + n); track(); }

/* ---------- Engine hooks ---------- */
function alertWeight(t, w) {
  const th = THREATS[t];
  if (th.district === 'mail' && !(G.f && G.f.mrMet)) return 0;
  if (G.f.mrMet && inMail() && MR_HOME.includes(t)) w *= 3;
  if (G.f.mrSeal && t === 'lure') w *= 0.5;
  return w;
}
function alertHost() { return inMail() ? pick(MR_HOSTS) + ' · Mail Room' : null; }
function briefList() { return G.f.mrMet ? BRIEFS.concat(MR_BRIEFS) : BRIEFS; }
function onAbility(k, b) {
  if (!mrOn() || b.tqDone || !['quarantine', 'purge'].includes(k) || !(b.spec.tags || []).includes('mail')) return;
  b.tqDone = true;
  MR().tq.push(Math.round((performance.now() - b.t0) / 100) / 10);
  if (MR().tq.length > 20) MR().tq.shift();
}
async function onAlertClosed(s, verdict, correct, r) {
  if (!mrOn() || s.story) return;
  if (MR_PHISH.includes(s.threat) && s.kind === 'mal') {
    const rep = MR().rep; rep.seen++;
    if (hasTool('reportbird') || rnd() < 0.3) rep.reported++;
  }
  if (s.threat === 'payee' && s.kind === 'mal' && correct && r.good) { MR().bec++; toast('BEC payment stopped'); }
  track();
}
function editionMetricVals() {
  if (!mrOn()) return {};
  const m = MR(), tq = m.tq.length ? +(m.tq.reduce((a, b) => a + b, 0) / m.tq.length).toFixed(1) : null;
  return {report: Math.round(m.rep.reported / m.rep.seen * 100), tq: tq, bec: m.bec};
}
// Added to the engine's METRICS table when game.js loads (it is declared after the edition files).
const EDITION_METRICS = [
  {k: 'report', label: 'Phishing report rate', unit: '%', higher: true, tier1: true, when: mrOn},
  {k: 'tq', label: 'Time to quarantine', unit: ' s', higher: false, lower: true, tier1: true, when: mrOn},
  {k: 'bec', label: 'BEC payments stopped', unit: '', higher: true, tier1: true, when: mrOn}
];
function editionScoreHtml() {
  if (!mrOn()) return '';
  return (G.f.mrDirective ? '<p class="dir">Directive: phishing report rate target 70% by quarter end. (game)</p>' : '') +
    '<p>Mail Room: Seal Badge <b>' + (G.f.mrSeal ? 'yes' : 'not yet') + '</b> · simulated phishing test: ' + MR().rep.reported + ' of ' + MR().rep.seen + ' staff reported (game)</p>';
}
function peekExtra() {
  return {mrSummary: !!G.f.mrSummary, mr: G.mr ? {drills: G.mr.drills, rep: G.mr.rep, bec: G.mr.bec, tq: G.mr.tq.length} : null};
}
function mrTile(d, ch, x, y) {
  if (ch === 'M' && G.f.mrSeal) { d.spr = 'L'; d.pal = 'mailBld'; }
  if (ch === 'u' && G.f.mrSeal && (x + y) % 2 === 0) d = Object.assign({ch: ','}, TILES[',']);
  return d;
}

/* ---------- Objective ---------- */
function mrObjective() {
  const f = G.f;
  if (!f.mrMet) return {text: 'Next: the Mail Room. Its door is east of the records office, through the cabling.', map: 'mail', x: 14, y: 9, district: 'mail'};
  if (!f.mrInbox) return {text: 'Clear the inbox room: sort six messages at the staff desks.', map: 'mail', x: 15, y: 2, district: 'mail'};
  if (!f.mrDrill1) return {text: 'Priya thinks she clicked something bad. Talk to her.', map: 'mail', x: 13, y: 4, district: 'mail'};
  if (!f.mrReport) return {text: 'Report back to Bea.', map: 'mail', x: 14, y: 9, district: 'mail'};
  if (!f.mrSms) return {text: 'Kofi at the help desk window has a stream of texts for you.', map: 'mail', x: 3, y: 8, district: 'mail'};
  if (!f.mrVish) return {text: 'Take two practice calls in the phone booth.', map: 'mail', x: 8, y: 8, district: 'mail'};
  if (!f.mrDrill2) return {text: 'Jonah in accounts payable has an invoice question.', map: 'mail', x: 18, y: 4, district: 'mail'};
  if (!f.mrNight) return {text: 'End your shift at your Mail Room desk.', map: 'mail', x: 23, y: 9, district: 'mail'};
  if (!f.mrDrill3) return {text: 'Overnight alert on Kofi’s account. See him at the help desk window.', map: 'mail', x: 3, y: 8, district: 'mail'};
  if (!f.mrOsintDone) {
    if (!f.mrOsintMet) return {text: '(Optional) Train at the OSINT Dojo with Wren.', map: 'mail', x: 25, y: 4, district: 'mail'};
    const i = MR().osint.findIndex(x => !x);
    return {text: '(Optional) OSINT puzzle ' + (i + 1) + ' of 3.', map: 'mail', x: [23, 25, 27][i], y: 2, district: 'mail'};
  }
  if (!f.mrBoard) return {text: 'Take the Mail Board challenge (Ines Calloway, through the east door).', map: 'mboard', x: 9, y: 2, district: 'mail'};
  if (!f.mrBoss) return {text: 'Bea needs you: a payment problem is starting.', map: 'mail', x: 14, y: 9, district: 'mail'};
  return {text: 'Mail Room secured. Next: Clerks’ Row.', done: true, district: 'mail'};
}

/* ---------- Triggers and interactions ---------- */
let mrEarlyWarned = false;
function mrTriggers() {
  if (G.map !== 'mail') return false;
  if (!G.f.bossDone) {
    if (mrEarlyWarned) return false;
    mrEarlyWarned = true;
    run(async () => { await say('You’re the Tier 1 from the Front Desk? Rae’s on the radio: she needs you there first. Come back when the Front Desk is secure.', 'Bea Lindqvist'); });
    return true;
  }
  if (!G.f.mrMet) { run(mrArrive); return true; }
  return false;
}
function mrInteract(ch, tx, ty) {
  if (!inMail()) return false;
  if (ch === 'i') { run(mrInboxRoom); return true; }
  if (ch === 'H') { run(mrHelpDesk); return true; }
  if (ch === 'B') { run(mrBooth); return true; }
  if (ch === 'o') { run(() => mrOsintPuzzle([23, 25, 27].indexOf(tx))); return true; }
  if (ch === 'r') { run(mrOldBox); return true; }
  if (ch === 'Y') { run(mrDesk); return true; }
  if (ch === 'g') { run(async () => { await say(G.f.mrSeal ? 'The mail gateway racks. With the Seal Badge, what you quarantine here leaves every inbox at once.' : 'The mail gateway racks. Every message from outside passes through here before it reaches a desk.'); }); return true; }
  return false;
}
async function mrTalk(npc) {
  const who = npc.name, f = G.f;
  if (!f.mrMet && npc.map === 'mail') { await say('Bea’s the one to talk to first.', who); return; }
  switch (npc.id) {
    case 'bea': await beaTalk(); break;
    case 'priya':
      if (f.mrInbox && !f.mrDrill1) { await mrDrill1(); break; }
      await say(f.mrDrill1 ? 'New password, new authenticator, and I hover over links now. Every time.' : 'Permits all morning. The inbox never stops.', who); break;
    case 'jonah':
      if (f.mrVish && !f.mrDrill2) { await mrDrill2(); break; }
      await say(f.mrDrill2 ? 'New rule in Accounts: no bank change without a call to the number we already had. Nobody argues with it now.' : 'Accounts payable. If it has a number with a dollar sign, it crosses my desk.', who); break;
    case 'kofi': await mrHelpDesk(); break;
    case 'wren': await wrenTalk(); break;
    case 'ines': await mrBoardScript(); break;
  }
}
async function mrDesk() {
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  if (!G.f.mrDrill2) { await say('Your desk in the Mail Room. Too early to go home.'); return; }
  const i = await choose('Your Mail Room desk. End your shift?', opts);
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (!G.f.mrNight) {
    G.f.mrNight = true;
    await say('Day ' + G.day + ', 07:50. Your phone shows an overnight alert: “kofi.mensah: many MFA prompts, one approved at 02:14.”');
  }
}

/* ---------- Arrival ---------- */
async function mrArrive() {
  const who = 'Bea Lindqvist', f = G.f;
  MR(); G.mr.day0 = G.day;
  await say('Day ' + G.day + '. The Mail Room: gateway racks humming, piles of unsorted mail, a help desk window, a phone booth nobody uses.');
  await say('You must be the Tier 1 from the Front Desk. I’m Bea Lindqvist, Mail Room lead. I run the mail gateway and everything that comes through it.', who);
  await say('Here’s my problem. Phishing gets through. And nobody reports it. Last quarter we sent a simulated phish to 30 staff: 3 reported it. (game)', who);
  await say('You stay Tier 1 here, but you also own the report queue. Rae lent you to me until the Mail Board says you’re ready.', who);
  addTool('drillbit', 4);
  await say('Budget came through for one thing: an awareness-training tool. Meet Drillbit. It runs short drills, so people learn the cues by doing.', who);
  G.targets.report = 60; G.targets.tq = 30; G.targets.bec = 2;
  f.mrArrived = true; f.mrMet = true; track();
  touchCSF('Govern');
  await say('New on your scorecard: phishing report rate (target 60%), time to quarantine (≤ 30 s) and BEC payments stopped. Start (Enter) shows them.', who);
  await say('First, the inbox room by the staff desks. Six messages. Sort them right and the door opens. Your report rate starts there.', who);
}
async function beaTalk() {
  const f = G.f, who = 'Bea Lindqvist';
  if (!f.mrInbox) { await say('The inbox room is at the staff desks, north-centre. Six messages: trust or report.', who); return; }
  if (!f.mrDrill1) { await say('Priya came by looking pale. Something about a ShareBox link. Go see her.', who); return; }
  if (!f.mrReport) { await mrReportButton(); return; }
  if (!f.mrSms) { await say('Kofi has a pile of texts staff forwarded him. Help desk window, west side.', who); return; }
  if (!f.mrVish) { await say('The phone booth is our practice line. Two calls are waiting.', who); return; }
  if (!f.mrDrill2) { await say('Jonah in accounts payable wants a second pair of eyes on an invoice.', who); return; }
  if (!f.mrNight) { await say('Long day. End your shift at your desk here; the gateway keeps watch overnight.', who); return; }
  if (!f.mrDrill3) { await say('Did you see the overnight alert on Kofi’s account? He’s at the help desk window.', who); return; }
  if (!f.mrBoard) { await say('Ines runs the Mail Board, through the east door. Wren’s OSINT Dojo is worth a visit first.', who); return; }
  if (!f.mrBoss) { await mrBossScript(); return; }
  await say('The Mail Room is in good shape. Clerks’ Row is next.', who);
  await mrSummary();
}

/* ---------- Inbox room ---------- */
function mrMailHtml(m, rev) {
  let h = '<div class="mail"><div><b>' + esc(m.display) + '</b> ' + (rev.sender ? '&lt;' + esc(m.addr) + '&gt;' : '<span class="small">(the app shows the name, not the address)</span>') + '</div>';
  if (rev.sender && m.replyTo) h += '<div class="mh">Reply-To: ' + esc(m.replyTo) + '</div>';
  h += '<div class="mh">Subject: ' + esc(m.subject) + '</div><p>' + esc(m.body) + '</p>';
  if (m.linkText) h += '<p>Link: <u>' + esc(m.linkText) + '</u>' + (rev.link ? ' · hover shows <b>' + esc(m.linkHref) + '</b>' : '') + '</p>';
  if (m.attachment) h += '<p>Attachment: <b>' + esc(m.attachment) + '</b></p>';
  if (rev.auth) h += '<div class="mh">Authentication-Results (our gateway): ' + esc(m.auth) + '</div>';
  const L = {sender: 'Sender', link: m.linkText ? 'Link' : 'Link / attachment', tone: 'Tone', auth: 'Authentication'};
  for (const k of ['sender', 'link', 'tone', 'auth']) if (rev[k]) h += '<span class="cue">' + L[k] + ': ' + esc(m.cues[k]) + '</span>';
  return h + '</div>';
}
async function mrInboxRoom() {
  if (!G.f.mrMet) { await say('Staff desks. Bea should show you around first.'); return; }
  const m = MR();
  if (G.f.mrInbox) { await say('The inbox room is clear. Door code ' + MR_DOORCODE + '. Staff use the same cues now: name vs address, link text vs target, pressure, and what authentication does and doesn’t prove.'); return; }
  await say('The inbox room (a training room, game): the door locks until all six messages are sorted. Inspect what you like, then Trust or Report. Each right call gives one digit of the code.');
  for (let n = 0; n < MR_INBOX.length; n++) {
    if (m.inbox[n]) continue;
    const msg = MR_INBOX[n], rev = {};
    while (true) {
      const code = MR_DOORCODE.split('').map((c, j) => m.inbox[j] ? c : '_').join(' ');
      const items = [
        {label: 'Inspect the sender', disabled: !!rev.sender, meta: {k: 'sender'}},
        {label: msg.linkText ? 'Hover over the link' : 'Check the link or attachment', disabled: !!rev.link, meta: {k: 'link'}},
        {label: 'Read the tone', disabled: !!rev.tone, meta: {k: 'tone'}},
        {label: 'Check authentication results', disabled: !!rev.auth, meta: {k: 'auth'}},
        {label: 'A · Trust it', meta: {k: 'trust', good: msg.good === 'trust'}},
        {label: 'B · Report it', meta: {k: 'report', good: msg.good === 'report'}}];
      const i = await UI.openModal('Inbox room · message ' + (n + 1) + ' of 6 · code ' + code, mrMailHtml(msg, rev), items, {closable: false, cls: 'drill'});
      const k = items[i].meta.k;
      if (k !== 'trust' && k !== 'report') { rev[k] = true; continue; }
      const ok = k === msg.good;
      const all = {sender: 1, link: 1, tone: 1, auth: 1};
      const why = mrMailHtml(msg, all);
      if (!ok) {
        await UI.openModal('Not this one', '<p>' + (k === 'trust' ? 'This one should be reported.' : 'This one is fine; reporting it costs the security team time.') + ' Here are all the cues:</p>' + why, [{label: 'Try again', meta: {good: true}}], {closable: false, cls: 'drill'});
        continue;
      }
      m.inbox[n] = true;
      await UI.openModal('Correct · digit ' + MR_DOORCODE[n], '<p>' + (k === 'report' ? 'Reported.' : 'Trusted.') + ' The cues:</p>' + why, [{label: 'Next message', meta: {good: true}}], {closable: false, cls: 'drill'});
      break;
    }
  }
  G.f.mrInbox = true;
  ['T1566.002', 'T1566.001', 'T1684.001'].forEach(t => unlock('tech', t));
  unlock('fact', 'dmarc'); unlock('fact', 'headers'); unlock('act', 'spotcue');
  touchCSF('Protect');
  mrReported(3);
  await say('Door code ' + MR_DOORCODE + '. The inbox room opens. Bea runs the same six messages with staff this week: three more people report the next simulated phish. (game)');
  await say('Report rate now ' + metricVals().report + '%. Remember: a DMARC pass says which domain sent a message, not that the message is honest.');
}

/* ---------- Drill 1: the shared-file link ---------- */
async function mrDrill(key) {
  const D = Object.assign({}, MR_DRILLS[key]);
  D.artefact = mrDay(D.artefact);
  const r = await doDrill(D);
  MR().drills[key] = {score: r.score, verdictOk: r.verdictOk, ai: r.ai, aiWrong: r.aiWrong};
  return r;
}
async function mrDrill1() {
  const who = 'Priya Natarajan';
  await say('I got a ShareBox link, “Permit_Fees.pdf”. I clicked Open and it asked me to sign in again, so I did. Then it bounced me to our normal sign-in page. Was that… bad?', who);
  await say('New on your console: Tally, an AI assistant. It’s fast and it can be wrong. Treat it like a sharp new colleague: ask specific questions, check the answers.');
  const r = await mrDrill('link');
  G.f.mrDrill1 = true;
  if (r.verdictOk) await say('Thank you. I’ll sit with Kofi and re-enrol my authenticator in person.', who);
  else await say('Bea looked at your notes: the account was used. She’s cleaning it up with Kofi. Read the debrief again in the Field Manual later.', 'Bea Lindqvist');
}
async function mrReportButton() {
  const who = 'Bea Lindqvist';
  await say('Priya told me she almost didn’t say anything, because reporting meant writing an email to IT and explaining herself.', who);
  await say('So: from today, every mail app in town has a Report button. One tap sends the message, with its headers, straight to your queue.', who);
  const t = G.party.find(p => p.id === 'drillbit');
  if (t) {
    t.id = 'reportbird'; t.lvl = Math.max(t.lvl, 5);
    await say('Drillbit is evolving! Awareness training grew a flag: Drillbit → Reportbird. One-click reporting. (Reportbird Lv ' + t.lvl + ')');
  } else addTool('reportbird', 5);
  unlock('act', 'reportbtn'); touchCSF('Detect');
  G.f.mrReport = true; mrReported(5);
  await say('Report rate now ' + metricVals().report + '% and on your scorecard. Easy reporting is half the battle; knowing what to report is the other half.', who);
}

/* ---------- Text stream (smishing) at the help desk window ---------- */
async function mrHelpDesk() {
  const who = 'Kofi Mensah', f = G.f;
  if (!f.mrMet) { await say('Help desk window. Bea first, please.', who); return; }
  if (f.mrReport && !f.mrSms) { await mrTexts(); return; }
  if (f.mrNight && !f.mrDrill3) { await mrDrill3(); return; }
  if (!f.mrReport) { await say('Help desk. If you’re here about passwords, the answer is “longer”.', who); return; }
  if (f.mrDrill3) { await say('Number matching is on for everyone now. You have to type the number from the screen; a sleepy tap does nothing.', who); return; }
  await say('Help desk. Quiet for once.', who);
}
async function mrTexts() {
  const who = 'Kofi Mensah';
  await say('Staff keep forwarding me texts from their work phones. Help me sort them: report, or nothing to do?', who);
  for (const m of MR_SMS) {
    while (true) {
      const items = [
        {label: 'Tap the link or reply', meta: {k: 'tap'}},
        {label: 'Report it (and don’t reply)', meta: {k: 'report', good: m.good === 'report'}},
        {label: 'Nothing to do: it’s legitimate', meta: {k: 'none', good: m.good === 'none'}}];
      const i = await UI.openModal('Text stream', '<div class="sms"><span class="from">' + esc(m.from) + '</span>' + esc(m.text) + '</div>', items, {closable: false, cls: 'drill'});
      const k = items[i].meta.k;
      if (k === m.good) { await UI.openModal(k === 'report' ? 'Reported' : 'Fine', '<p>' + esc(m.why) + '</p>', [{label: 'Next text', meta: {good: true}}], {closable: false}); break; }
      await UI.openModal('Not quite', '<p>' + (k === 'tap' ? 'Never tap links in, or reply to, unexpected texts. ' : '') + esc(m.why) + '</p>', [{label: 'Try again', meta: {good: true}}], {closable: false});
    }
  }
  G.f.mrSms = true; mrReported(2);
  unlock('tech', 'T1660'); unlock('fact', 'ftc_text'); touchCSF('Detect');
  await say('On a personal phone in the US you can also forward spam texts to 7726, which spells SPAM. Work phones: use the report option, it reaches me.', who);
}

/* ---------- Phone booth (vishing) ---------- */
async function mrBooth() {
  if (!G.f.mrMet) { await say('A phone booth. Bea should show you around first.'); return; }
  if (!G.f.mrSms) { await say('The practice line. It’s quiet for now.'); return; }
  if (G.f.mrVish) { await say('The practice line. Rule of thumb: hang up, and call back on a number you already had.'); return; }
  await say('The practice line rings. You pick up. (Two calls. You play the staff member who answers.)');
  for (const c of MR_CALLS) {
    while (true) {
      const items = c.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
      const i = await UI.openModal('Phone booth · ' + c.caller, '<p class="sms">' + esc(c.open) + '</p>', items, {closable: false, cls: 'drill'});
      if (c.opts[i].good) { await UI.openModal('Call-back', '<p>' + esc(c.result) + '</p><p class="small">A call-back proves something only when you dial a number you already had: the directory, the vendor file, the back of your card.</p>', [{label: 'Next', meta: {good: true}}], {closable: false}); break; }
      await UI.openModal('Not that', '<p>' + esc(c.opts[i].why) + '</p>', [{label: 'Try again', meta: {good: true}}], {closable: false});
    }
  }
  G.f.mrVish = true; mrReported(2);
  unlock('tech', 'T1566.004'); unlock('tech', 'T1684.001'); unlock('act', 'callback'); unlock('act', 'outofband'); touchCSF('Protect');
  await say('Both callers were practice. The real ones sound exactly the same.');
}

/* ---------- Drill 2: BEC ---------- */
async function mrDrill2() {
  const who = 'Jonah Abara';
  await say('Harrow & Finch say their bank changed. It’s really from Mara: same address, same thread, and the mail system says it’s authenticated. Payment run is at four. Can you look?', who);
  const r = await mrDrill('bec');
  G.f.mrDrill2 = true;
  if (r.verdictOk) { MR().bec++; toast('BEC payment stopped'); await say('Held. Old details kept. I called Sam on the number in our file, like you said. Their IT is on it.', who); }
  else await say('Bea stepped in and held the payment. She wants every bank change verified by phone from now on.', who);
  unlock('act', 'paymenthold'); track();
  if (!G.f.mrDirective) {
    G.f.mrDirective = true; G.targets.report = 70; touchCSF('Govern');
    await say('Rae (radio): Directive from leadership: phishing report rate target goes to 70% by quarter end. (game) Reports you can act on beat a pretty number; don’t ask people to report everything.');
  }
}

/* ---------- Drill 3: MFA push fatigue ---------- */
async function mrDrill3() {
  const who = 'Kofi Mensah';
  await say('Last night my phone wouldn’t stop. I asked Tally this morning and it said all the prompts were denied. So we’re fine… right?', who);
  const r = await mrDrill('push');
  G.f.mrDrill3 = true;
  unlock('fact', 'cisa_nm'); unlock('act', 'numbermatch');
  if (!r.ai || r.ai !== 'everything') await say('Kofi pasted the whole night’s log into Tally this morning. It only read the first 60 lines and never said so: the approval was line 187. (game) Ask it specific questions, and check.', 'Bea Lindqvist');
  await say(r.verdictOk ? 'I approved it to make the buzzing stop. Never again. Number matching goes on for everyone today.' : 'Bea says the 02:14 approval was the attacker’s sign-in. I approved it to make the buzzing stop. Number matching goes on for everyone today.', who);
}

/* ---------- OSINT dojo ---------- */
async function wrenTalk() {
  const who = 'Wren Takahashi', f = G.f;
  if (!f.mrOsintMet) {
    f.mrOsintMet = true;
    await say('Welcome to the OSINT Dojo. National Cyber League-style puzzles, defensive edition.', who);
    await say('Ground rules: we look only at our own town’s public footprint, with the town’s permission. We don’t dig into anyone’s private life and we don’t publish what we find. The goal is to shrink what attackers can learn, not to embarrass anyone.', who);
    await say('Three terminals: a job posting, an address format, a holiday post. Solve all three and I’ll give you a Filter Rulebook.', who);
    return;
  }
  if (f.mrOsintDone) { await say('Every public detail is a gift to someone’s pretext. Publish what helps residents, not what helps attackers.', who); return; }
  await say('Puzzles solved: ' + MR().osint.filter(Boolean).length + ' of 3. Terminals along the back wall.', who);
}
async function mrOsintPuzzle(i) {
  if (!G.f.mrOsintMet) { await say('An OSINT practice terminal. Talk to Wren first.'); return; }
  const p = MR_OSINT[i], m = MR();
  if (m.osint[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await UI.openModal('OSINT · ' + p.title, '<div class="mail">' + esc(p.art) + '</div><p><b>' + esc(p.q) + '</b></p>', p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {closable: false, cls: 'drill'});
    if (k === p.good) break;
    await say('Not quite. Think like the attacker, then like the defender.');
  }
  await say('Correct. ' + p.explain);
  m.osint[i] = true; unlock('tech', p.tech); unlock('act', 'exposure'); touchCSF('Identify');
  if (m.osint.every(Boolean)) {
    G.f.mrOsintDone = true; m.rulebook = true;
    await say('All three. Here: a Filter Rulebook. Give it to a mail-gateway tool that has reached Lv 5 and it will grow.', 'Wren Takahashi');
    await mrEvolveCheck();
  }
}
async function mrEvolveCheck() {
  if (!G.mr || !G.mr.rulebook) return;
  const t = G.party.find(p => p.id === 'sieve' && p.lvl >= 5);
  if (!t) return;
  const i = await choose('Sieve (Lv ' + t.lvl + ') can use the Filter Rulebook. Evolve it?', [{label: 'Evolve Sieve', meta: {good: true}}, {label: 'Later'}]);
  if (i !== 0) return;
  G.mr.rulebook = false; t.id = 'sifter';
  await say('Sieve is evolving! Sieve → Sifter. New ability: Search and purge, every copy from every inbox.');
}

/* ---------- Mail Board ---------- */
const MR_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'payee', tech: 'T1684.001', tags: ['mail'], story: true, rate: 12, group: 'a',
   title: 'Round 2: “the mayor” needs a wire today', host: 'jonah.abara · accounts payable', enemy: {spr: 'invoice', pal: 'invoice'},
   clues: ['The email is signed by the mayor but comes from mayor.office@townhall-gov.example, not townhall.example.', 'It asks Jonah to wire $92,000 for a “confidential land deal” today and to tell nobody.', 'The mayor’s office, called on the directory number, knows nothing about it.'],
   truth: 'Business email compromise by impersonation: a look-alike domain posing as an executive.',
   resp: [{label: 'Don’t pay; block the look-alike domain; warn Accounts; report it', good: true}, {label: 'Pay: it’s the mayor', good: false}, {label: 'Reply and ask the mayor to confirm', good: false, why: 'The reply goes to the look-alike domain, so the attacker confirms it.'}],
   chain: [{at: 40, text: 'A follow-up arrives: “Why isn’t this done yet?”'}, {at: 75, text: 'Jonah opens the payments system.'}]},
  {kind: 'mal', threat: 'caller', tech: 'T1566.004', tags: ['voice'], story: true, rate: 11, group: 'a',
   title: 'Round 3: a live call to the help desk', host: 'help desk line', enemy: {spr: 'caller', pal: 'impostor'},
   clues: ['The caller says he’s the HVAC contractor, locked out of email, and asks Kofi to reset his MFA and install a “remote support tool”.', 'He knows his manager’s name and the job site from public posts.', 'The real contractor, called on the number in the contract file, is on a roof and didn’t call.'],
   truth: 'Voice phishing aimed at the help desk: a pretext to reset MFA and get remote tools installed.',
   resp: [{label: 'Refuse, verify by calling the number on file, log and report the call', good: true}, {label: 'Reset his MFA: he knows the manager’s name', good: false}, {label: 'Install the remote support tool for him', good: false}],
   chain: [{at: 40, text: 'The caller gets angry and says the heating will fail tonight.'}, {at: 75, text: 'He asks for the agent’s manager by name.'}]}
];
async function mrGauntlet() {
  const t0 = performance.now();
  let mistakes = 0;
  for (let n = 0; n < MR_GAUNTLET.length; n++) {
    const g = MR_GAUNTLET[n];
    while (true) {
      const items = [{label: 'A · Trust', meta: {k: 'trust', good: g.good === 'trust'}}, {label: 'B · Report', meta: {k: 'report', good: g.good === 'report'}}];
      const i = await UI.openModal('Round 1 · triage gauntlet ' + (n + 1) + '/5', '<div class="mail">' + esc(g.line) + '</div>', items, {closable: false, cls: 'drill'});
      if (items[i].meta.k === g.good) break;
      mistakes++;
      await UI.openModal('Miss', '<p>' + esc(g.why) + '</p>', [{label: 'Again', meta: {good: true}}], {closable: false});
    }
  }
  const s = Math.round((performance.now() - t0) / 1000);
  MR().gauntlet = {s: s, mistakes: mistakes};
  await say('Ines: Five messages, ' + s + ' s, ' + mistakes + ' miss' + (mistakes === 1 ? '' : 'es') + '. (game) Speed is nice; the right call is the point.');
}
async function mrBoardScript() {
  const who = 'Ines Calloway', f = G.f;
  if (f.mrBoard) { await say('The Seal Badge means what you quarantine leaves every inbox. Use it gently: a wrong quarantine is a missed permit.', who); return; }
  if (!f.mrDrill3) { await say('The Mail Board is for analysts who’ve worked a few real cases. Finish with Bea’s team first.', who); return; }
  await say('I’m Ines Calloway, messaging security lead. Email is the town’s front door and its filing cabinet.', who);
  await say('Three rounds: a triage gauntlet, a BEC attempt, and a live vishing call. Ready?', who);
  await mrGauntlet();
  const specs = MR_BOARD_SPECS();
  for (const s of specs) await fightStory(s, 'Ines: Again. Verify before you act.');
  f.mrBoard = true; f.mrSeal = true;
  MR().bec++; mrReported(2);
  addTool('sieve', 5); G.focusMax = Math.max(G.focusMax, 36); G.focus = G.focusMax; track();
  await say('You cleared the Mail Board. This is the Seal Badge.', who);
  await say('Its power: messages you quarantine are pulled from every inbox on the map, and link-phishing (Lure) alerts drop by half. Watch the unsorted mail piles shrink. (game)', who);
  await say('And Sieve joins your console: a mail-gateway tool. It reads headers, sandboxes attachments, blocks and quarantines.', who);
  touchCSF('Protect');
  await evolveCheck();
}

/* ---------- Boss: payment fraud ---------- */
async function mrBossScript() {
  const who = 'Bea Lindqvist';
  await surfaceMissed(true);
  await say('Incident: payment fraud. Harrow & Finch’s real mailbox is sending us invoices with new bank details, inside real threads. And Accounts thinks one payment already went out last week.', who);
  await say('Tabletop first. Pick four response cards. Then we work it in three stages.', who);
  const body = '<p>Pick <b>four</b> cards. Each is our own, written from public ATT&amp;CK / D3FEND-style actions and FBI IC3 guidance.</p>' +
    MR_CARDS.map(c => '<div class="card"><b>' + esc(c.name) + '</b> <span class="tag">' + c.csf + '</span><br>' + esc(c.text) + '</div>').join('');
  const items = MR_CARDS.map(c => ({label: c.name, meta: {good: !!c.good}})).concat([{label: 'Play these four cards', done: true, meta: {done: true}}]);
  const sel = await UI.openModal('Tabletop: the hijacked supplier', body, items, {multi: 4, closable: false, cls: 'tabletop'});
  const picks = sel.map(i => MR_CARDS[i].id);
  G.f.mrCards = picks;
  for (const id of picks) { const c = MR_CARDS.find(x => x.id === id); touchCSF(c.csf); await say(c.name + ': ' + c.fx); }
  if (picks.includes('ic3')) G.rep += 5;
  unlock('fact', 'ic3_bec'); unlock('fact', 'ic3_ffkc');
  await say('Debrief: there’s no single right four. Calling back on a known number, holding the money and calling the bank fast matter most: FBI IC3 advises contacting your bank immediately to request a recall, and filing at ic3.gov whatever the amount. In 2025 its Financial Fraud Kill Chain froze $679 million of $1.16 billion attempted. Replying to the hijacked mailbox or deleting evidence helps the attacker.', who);
  const ev0 = picks.includes('preserve') ? 20 : 0, bad = picks.includes('delete');
  const stages = [
    {kind: 'mal', threat: 'payee', tech: 'T1586.002', tags: ['mail'], story: true, group: 'a', rate: 12, ev0: ev0 + (picks.includes('callback') ? 20 : 0), dwell0: picks.includes('callback') ? 10 : 30,
     title: 'Stage 1: the hijacked thread', host: 'Inv 2291 thread · accounts payable', enemy: {spr: 'invoice', pal: 'bossSpray'},
     clues: ['Since Monday, Harrow & Finch’s real mailbox has sent three “updated invoice” emails inside real threads.', 'Each one names a different new bank account.', picks.includes('callback') ? 'Harrow & Finch, called on the vendor-file number: “We sent none of these.”' : 'Harrow & Finch, called on the vendor-file number at last: “We sent none of these.”'],
     truth: 'The supplier’s mailbox is compromised and is being used against us (Compromise Accounts: Email Accounts).',
     resp: [{label: 'Treat that mailbox as hostile: hold all its payment requests and tell the supplier by phone', good: true}, {label: 'Pay the newest invoice: it passed authentication', good: false}, {label: 'Reply asking which account is right', good: false, why: 'The attacker reads and answers that mailbox.'}],
     chain: [{at: 50, text: 'A fourth invoice arrives, marked “final notice”.'}]},
    {kind: 'mal', threat: 'payee', tech: 'T1657', tags: ['mail'], story: true, group: 'a', ev0: ev0,
     rate: picks.includes('bank') ? 9 : 14, dwell0: picks.includes('hold') ? 15 : 40,
     title: 'Stage 2: last week’s transfer', host: 'payments system · our bank', enemy: {spr: 'invoice', pal: 'impostor'},
     clues: ['One transfer of $31,200 went to a new account last Thursday.', 'The receiving account was opened three weeks ago.', 'Our bank says a recall has the best chance in the first hours, before the money moves on.'],
     truth: 'Financial theft: money already sent to an attacker-controlled account.',
     resp: [{label: 'Ask our bank to recall it now, file at ic3.gov, keep every record', good: true}, {label: 'Wait for the supplier to sort it out', good: false}, {label: 'Pay the supplier again from a different account', good: false}],
     chain: [{at: 60, text: 'The receiving bank reports part of the money moved to another account.'}]},
    {kind: 'mal', threat: 'lure', tech: 'T1566.002', tags: ['mail'], story: true, group: 'a', ev0: bad ? 0 : ev0,
     rate: picks.includes('search') ? 8 : 14, dwell0: picks.includes('search') ? 10 : (bad ? 55 : 45),
     title: 'Stage 3: the spread', host: 'six staff mailboxes', enemy: {spr: 'lure', pal: 'bossSpray'},
     clues: ['This morning the same mailbox sent six staff a “shared invoice” link.', 'The link opens a look-alike of our sign-in page.', 'One person entered a password before the page was blocked.'],
     truth: 'Spearphishing links from a trusted supplier mailbox, to harvest more accounts.',
     resp: [{label: 'Search and purge every copy, block the link, reset the one account that entered a password', good: true}, {label: 'Block harrowfinch.example forever and stop paying them', good: false, disrupt: 1, why: 'They’re a victim too, and the town still needs its roads paved. Block the attacker, not the supplier.'}, {label: 'Wait for more reports', good: false}],
     chain: [{at: 60, text: 'A harvested password is tried on our sign-in page.'}]}
  ];
  for (const s of stages) await fightStory(s, 'Bea: Regroup. Same stage, again.');
  MR().bec++; touchCSF('Respond'); touchCSF('Recover'); unlock('act', 'paymenthold');
  bumpUptime(0.01); track();
  await say('Recover: payments to Harrow & Finch resume after a call-back on the known number, their IT has reset the mailbox, and our bank is working the recall. Every staff member who got the link is clean.', who);
  await say('That’s the Mail Room. Next stop: Clerks’ Row.', who);
  G.f.mrBoss = true;
  await mrSummary();
}

/* ---------- End of district ---------- */
async function mrSummary() {
  await surfaceMissed(true);
  G.f.mrSummary = true;
  const m = MR(), d = m.drills;
  const dl = ['link', 'bec', 'push'].map(k => esc(MR_DRILLS[k].title) + ' <b>' + (d[k] ? d[k].score : '—') + '</b>').join(' · ');
  const ai = Object.values(d).some(x => x.aiWrong) ? 'you trusted Tally with everything once, and it was wrong' : Object.values(d).some(x => x.ai) ? 'you asked Tally specific questions' : 'you worked without Tally';
  const body = '<p class="big">Mail Room district: secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Badges <b>Key Badge, Seal Badge</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b></p>' +
    scorecardHtml() +
    '<p>Investigation drills (game scores): ' + dl + '. AI assistant: ' + ai + '.</p>' +
    '<p>Phishing report rate went from 10% to <b>' + metricVals().report + '%</b>. BEC payments stopped: <b>' + m.bec + '</b>. Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    mrQtSummaryHtml() +
    '<p class="big">Next: Clerks’ Row.</p>';
  Series.markEdition(EDITION.id, {done: true, mailRoom: true});
  const i = await UI.openModal('End of the Mail Room', body, [{label: 'Keep exploring the Mail Room', meta: {good: true}}, {label: 'Title screen'}], {closable: false, cls: 'summary'});
  storeSet(encodeSave(G));
  if (i === 1) { started = false; titleScreen(); }
}
