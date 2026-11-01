/* ============================================================
   UPTIME · editions/town-hall/council-story.js
   Town Hall district 9, the finale: Council Chambers (governance, leadership,
   incident command). State, objectives, interactions, talk, the fieldwork (the
   one-page incident response plan, the risk register, the delegation mini-game,
   outside contacts, the plain-words council briefing), the road-budget
   directive, three investigation drills, the Governance dojo, the Council Board
   (Charter Badge), the town-wide incident played as incident command, the
   Quiet Thread hand-off, scorecard metrics and the edition ending.
   You are promoted to the town's first security team lead: you assign, coach
   and brief; the district leads do the hands-on work. Legal counsel decides
   notification. The Water Plant story chains here (ccObjective via
   wtObjective). Engine hooks are wrapped again: each wrapper calls the
   previous version, then adds Council Chambers.
   Timeline: scratchpad council-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

if (typeof EDITION !== 'undefined') {
  EDITION.creditsFacts += ' Council Chambers: NIST CSF 2.0 (CSWP 29) Govern categories and the CSF 2.0 Implementation Examples (risk register, risk responses); NIST SP 800-61 Rev. 3 (April 2025) incident response roles; NICE Framework work roles (PD-WRL-003 Incident Response, OG-WRL-007, OG-WRL-006; components v2.2.0); CISA Tabletop Exercise Packages (CTEP); CIRCIA (2022) and the status of CISA’s rule on 1 November 2026 (proposed April 2024, final rule not yet published).';
  if (EDITION.badgeFlags && !EDITION.badgeFlags.includes('ccCharter')) EDITION.badgeFlags.push('ccCharter');
}
const CC_RANK = 'Security team lead';

/* ---------- State ---------- */
function CC() {
  if (!G.cc) G.cc = {day0: G.day, assign: CC_ASSIGN0, load: CC_LOAD0, dec: Object.assign({}, CC_DEC0), brief: {on: 0, total: 0},
    act: Object.assign({}, CC_ACT0), plan: false, risks: {}, deleg: null, drills: {}, dojo: [false, false, false], directive: null,
    board: null, boss: null, file: null, led: 0};
  return G.cc;
}
function ccOn() { return !!(G && G.f && G.f.ccMet && G.cc); }
function inCouncil() { return CC_MAPS.includes(G.map); }
const ccPct = (a, b) => b ? Math.round(a / b * 100) : null;

/* ---------- Engine hooks (wrapping the Water Plant versions) ---------- */
const _ccPrevDecorate = alertDecorate, _ccPrevMetricVals = editionMetricVals, _ccPrevScoreHtml = editionScoreHtml, _ccPrevPeekExtra = peekExtra;
// Charter Badge: a queued alert arrives with its district lead's first look (game).
alertDecorate = function (spec) {
  _ccPrevDecorate(spec);
  if (G.f && G.f.ccCharter && !spec.story) spec.ev0 = Math.max(spec.ev0 || 0, 15);
};
editionMetricVals = function () {
  const v = _ccPrevMetricVals();
  if (!ccOn()) return v;
  const c = CC();
  return Object.assign(v, {ccAssign: c.assign, ccLoad: c.load, ccOwner: ccPct(c.dec.owned, c.dec.total), ccBrief: ccPct(c.brief.on, c.brief.total), ccActions: ccPct(c.act.closed, c.act.total)});
};
EDITION_METRICS.push(
  {k: 'ccAssign', label: 'Mean time to assign (game minutes)', unit: ' min', higher: false, lower: true, when: ccOn},
  {k: 'ccLoad', label: 'Busiest person’s load (share of capacity)', unit: '%', higher: false, lower: true, when: ccOn},
  {k: 'ccOwner', label: 'Decisions with a named owner', unit: '%', higher: true, when: ccOn},
  {k: 'ccBrief', label: 'Council briefings on time', unit: '%', higher: true, when: ccOn},
  {k: 'ccActions', label: 'Post-incident actions closed', unit: '%', higher: true, when: ccOn}
);
editionScoreHtml = function () {
  let h = _ccPrevScoreHtml();
  if (!ccOn()) return h;
  const c = CC();
  if (G.f.ccDirective) h += '<p class="dir">Directive: the council keeps one night post and defers the other to the next budget; Councillor Rasmussen signed the risk acceptance, reviewed in six months. (game)</p>';
  h += '<p>Council Chambers: Charter Badge <b>' + (G.f.ccCharter ? 'yes' : 'not yet') + '</b> · decisions owned <b>' + c.dec.owned + ' of ' + c.dec.total + '</b> · post-incident actions closed <b>' + c.act.closed + ' of ' + c.act.total + '</b>' +
    (c.deleg ? ' · delegation: <b>' + c.deleg.over + '</b> over capacity, <b>' + c.deleg.caught + ' of 1</b> unsupported close caught' : '') + ' (game)</p>';
  return h;
};
peekExtra = function () {
  const e = _ccPrevPeekExtra();
  e.ccSummary = !!(G.f && G.f.ccSummary);
  e.cc = G.cc ? JSON.parse(JSON.stringify(G.cc)) : null;
  return e;
};
function ccTile(d, ch, x, y) {
  if (ch === '¥' && G.f.ccPlan) d.pal = 'ccWarOk';
  if (ch === '§' && G.f.ccRisk) d.pal = 'ccClerkOk';
  if (ch === 'µ' && G.f.ccDeleg) d.pal = 'ccTeamOk';
  return d;
}

/* ---------- Objective ---------- */
function ccObjective() {
  const f = G.f, at = (text, x, y, map) => ({text: text, map: map || 'council', x: x, y: y, district: 'council'});
  if (!f.ccMet) return Object.assign(at('Next: Council Chambers. The south door of the Water Plant’s desk room; your Tide Badge opens it.', 14, 2), {step: true});
  if (!f.ccPlan) return at('Fieldwork: no incident plan the council has seen. The war room table.', 12, 7);
  if (!f.ccRisk) return at('Fieldwork: nobody owns cyber risk at council level. Elsie, by the clerk’s desk.', 19, 2);
  if (!f.ccDeleg) return at('Fieldwork: every district lead reports to you. The team board.', 23, 7);
  if (!f.ccContacts) return at('Fieldwork: who calls whom outside the town. Noor, in the legal office.', 5, 8);
  if (!f.ccBriefed) return at('Fieldwork: the council’s 18:00 session. The Mayor, in the chamber.', 5, 2);
  if (!f.ccNight1) return at('End your shift at your desk.', 13, 13);
  if (!f.ccDrill1) return at('Rae has a close for you to review. The team room.', 25, 8);
  if (!f.ccDirective) return at('Councillor Rasmussen wants a word about the budget. The chamber.', 2, 3);
  if (!f.ccNight2) return at('End your shift at your desk.', 13, 13);
  if (!f.ccDrill2) return at('A news story says the town was hacked. Ada, in the press room.', 25, 2);
  if (!f.ccDrill3) return at('The insurer’s question 7 is due on Friday. Elsie, by the clerk’s desk.', 19, 2);
  if (!f.ccDojoDone) {
    if (!f.ccDojoMet) return at('(Optional) Train at the Governance dojo with Wendell.', 10, 11);
    const i = CC().dojo.findIndex(x => !x);
    return at('(Optional) Governance puzzle ' + (i + 1) + ' of 3.', [3, 5, 7][i], 11);
  }
  if (!f.ccBoard) return at('Take the Council Board challenge (the Mayor, through the legal office’s west door).', 8, 2, 'ccboard');
  if (!f.ccNight3) return at('End your shift at your desk.', 13, 13);
  if (!f.ccBoss) return at('The on-call lead is calling about three districts at once. The war room.', 12, 7);
  if (!f.ccFile) return at('Rae wants to hand over the suspicion file. The team room.', 25, 8);
  return {text: 'Town Hall secured. Next edition: coming later.', done: true, district: 'council'};
}

/* ---------- Triggers and interactions ---------- */
let ccEarlyWarned = false;
function ccTriggers() {
  if (G.map !== 'council') return false;
  if (!G.f.wtFile) {
    if (ccEarlyWarned) return false;
    ccEarlyWarned = true;
    run(async () => { await say('The Tide Badge opens the door, but the Water Plant isn’t finished: Rae is waiting there about svc-print. The council can wait an hour.', 'Elsie Corrigan'); });
    return true;
  }
  if (!G.f.ccMet) { run(ccArrive); return true; }
  return false;
}
function ccInteract(ch, tx, ty) {
  if (!inCouncil()) return false;
  if (ch === '¥') { run(ccWarTable); return true; }
  if (ch === '§') { run(ccClerkDesk); return true; }
  if (ch === 'µ') { run(ccTeamBoard); return true; }
  if (ch === '¶') { run(async () => { await say(G.f.ccDrill2 ? 'The press room: Ada’s statement from the morning of the news story is pinned up, with its 16:00 update beneath it.' : 'The press room: two desks, a phone that rings when something goes wrong, and a list of reporters’ numbers.'); }); return true; }
  if (ch === '£') { run(async () => { await say('Noor’s desk: the town’s contracts, the insurance policy, and a shelf of state statutes she reads so the rest of us don’t guess.'); }); return true; }
  if (ch === '_') { run(async () => { await say('The council’s seats on the dais. Five chairs, five votes, and the decisions they own.'); }); return true; }
  if (ch === '¤') { run(() => ccDojoPuzzle([3, 5, 7].indexOf(tx))); return true; }
  if (ch === '±') { run(async () => { await say('The committee room’s racks: the decision log, the risk register and the minutes, in binders.'); }); return true; }
  if (ch === 'Y') { run(ccDesk); return true; }
  return false;
}
async function ccTalk(npc) {
  if (!CC_NPC_IDS.includes(npc.id)) return;
  const who = npc.name, f = G.f;
  if (!f.ccMet && npc.map === 'council') { await say('Rae is expecting you first. Welcome to Council Chambers.', who); return; }
  switch (npc.id) {
    case 'merrin': await merrinTalk(); break;
    case 'bramcc': await bramCcTalk(); break;
    case 'fen': await fenTalk(); break;
    case 'noor': await noorTalk(); break;
    case 'ada': await adaTalk(); break;
    case 'elsie': await elsieTalk(); break;
    case 'wendell': await wendellTalk(); break;
    case 'raecc': await raeCcTalk(); break;
    case 'merrinb': await ccBoardScript(); break;
  }
}
async function ccDesk() {
  const f = G.f, c = CC();
  const ready = (f.ccBriefed && !f.ccNight1) || (f.ccDirective && !f.ccNight2) || (f.ccBoard && !f.ccNight3);
  if (!ready) { await say('Your desk in Council Chambers: a phone, the team board on a screen, and a window onto the square. Too early to go home.'); return; }
  const opts = [{label: 'End shift', meta: {good: true, k: 'end'}}, {label: 'Not yet', meta: {k: 'no'}}];
  const i = await choose('Your desk. End your shift?', opts, {nav: 'end-shift'});
  if (opts[i].meta.k !== 'end') return;
  await endShift('desk');
  if (f.ccBriefed && !f.ccNight1) {
    f.ccNight1 = true; c.act.closed += 4; track();
    await say('Day ' + G.day + ', 08:30. Overnight the leads closed four open post-incident actions (game). Rae has something for you: a close from yesterday afternoon.');
  } else if (f.ccDirective && !f.ccNight2) {
    f.ccNight2 = true; c.act.closed += 3; track();
    await say('Day ' + G.day + ', 08:00. Three more actions closed overnight. And a county news site posted at 07:10: “Town Hall hacked again”. Ada is in the press room.');
  } else if (f.ccBoard && !f.ccNight3) {
    f.ccNight3 = true;
    await say('Day ' + G.day + ', 00:50. Your phone: the on-call lead. “One account, one laptop, three districts. Mail, endpoints and the portal. You should come in.”');
  }
}

/* ---------- Arrival ---------- */
async function ccArrive() {
  const f = G.f, c = CC();
  c.day0 = G.day;
  await say('Day ' + G.day + '. Council Chambers: the council’s dais, the clerk’s records desk, a press room, the town attorney’s office, a war room nobody has used, and a team board with nine names on it.');
  await say('You made it. Yesterday the council approved one security team for the whole town: a lead in every district, and one team lead. I asked them to make it you. (game)', 'Rae Okafor');
  await say('I stay on the team as a lead, but the suspicion file takes most of my time now. You won’t run every investigation yourself any more. You assign them, you coach the people who run them, and you brief the council.', 'Rae Okafor');
  G.rank = CC_RANK; G.focusMax = Math.max(G.focusMax, 50); G.focus = G.focusMax;
  await say('Rank: Tier 3 lead investigator → Security team lead. New responsibility: you assign, coach and brief; the district leads do the hands-on work. (Field Manual: Facts, your new role in the NICE Framework.)');
  unlock('fact', 'ccnice');
  await say('Mayor Merrin. Welcome. I’ll be plain: the council has never seen an incident plan. Nobody on the council owns this risk. Our insurer sent a renewal questionnaire due Friday, and nobody can answer half of it.', 'Mayor Dalia Merrin');
  await say('And every one of your nine district leads reports straight to you. That isn’t a team; that’s a queue with your name on it.', 'Mayor Dalia Merrin');
  G.targets.ccAssign = 10; G.targets.ccLoad = 100; G.targets.ccOwner = 100; G.targets.ccBrief = 100; G.targets.ccActions = 100;
  f.ccMet = true; track();
  touchCSF('Govern');
  await say('New on your scorecard: time to assign, the busiest person’s load, decisions with an owner, briefings on time and post-incident actions closed. Start (Enter) shows them.', 'Rae Okafor');
  await say('Start in the war room. A plan the council can read comes first.', 'Rae Okafor');
}
async function merrinTalk() {
  const f = G.f, who = 'Mayor Dalia Merrin';
  if (!f.ccPlan) { await say('The war room first. I want to know who does what when it goes wrong, on one page.', who); return; }
  if (!f.ccRisk) { await say('Elsie keeps the decision log. Ask her how many of our decisions have a name next to them.', who); return; }
  if (!f.ccDeleg) { await say('Your team board. Nine leads; only one of you.', who); return; }
  if (!f.ccContacts) { await say('Noor first, then the 18:00 session. She’ll want to see the plan’s contact page.', who); return; }
  if (!f.ccBriefed) { await ccBriefing(); return; }
  if (!f.ccNight1) { await say('Go home. The plan is adopted, and we know who to call.', who); return; }
  if (!f.ccBoard) { await say('When you’re ready, the committee room, through Noor’s office. The council wants to see how you handle us.', who); return; }
  if (!f.ccBoss) { await say('A quiet night, I hope.', who); return; }
  await say('Owners, dates and plain words. Thank you. The town is in better hands than it was.', who);
}
async function bramCcTalk() {
  const f = G.f, who = 'Councillor Bram Whitlock';
  if (!f.ccRisk) { await say('Bram Whitlock. Payments came back within the hour last time, on the processor’s page. I kept my word; you kept yours.', who); return; }
  if (!f.ccBoss) { await say('A risk committee. Me. Every month, the register, the exceptions list and the open actions. I asked for it.', who); return; }
  await say('The suspicion file is in my committee’s safe. Closed session, need to know. I’ve read it twice.', who);
}

/* ---------- Fieldwork 1: the one-page incident response plan ---------- */
async function ccWarTable() {
  const f = G.f;
  if (!f.ccMet) { await say('A long table and a wall clock. Rae should show you around first.'); return; }
  if (!f.ccPlan) { await ccPlanTask(); return; }
  if (f.ccNight3 && !f.ccBoss) { await ccBossScript(); return; }
  await say(f.ccBoss ? 'The war room: the plan on the wall, the timeline from the night of the portal export beside it.' : 'The war room: the one-page plan on the wall, names and deputies, adopted by the council.');
}
async function ccPlanTask() {
  const c = CC();
  await say('The war room: nine district runbooks in nine binders. None of them says who talks to the press, who decides what residents are told, or who can approve shutting a service down.');
  while (true) {
    const i = await choose('How do you write the town’s incident response plan?', [
      {label: 'One page: a commander, a technical lead, legal, communications, an executive decider, a deputy each', meta: {good: true}},
      {label: 'A full binder covering every scenario in detail, so nobody has to decide anything on the night itself'},
      {label: 'The nine district runbooks bound together: each lead knows their own systems best'},
      {label: 'Your mobile number at the top of every page: in an incident, everyone calls the team lead first'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Nobody reads a binder at two in the morning, and no binder foresees the incident you get. Name who decides; the runbooks hold the detail.');
    else if (i === 2) await say('The runbooks say how to fix systems. They don’t say who talks to the press, who advises on the law, or who decides on a shutdown.');
    else await say('Then you are the single point of failure, and the plan stops when your phone does. Roles, each with a deputy.');
  }
  while (true) {
    const i = await choose('In the plan, who decides whether residents must be told about an incident?', [
      {label: 'Noor, the town attorney: she decides what the law requires; Ada writes it, the Mayor signs', meta: {good: true}},
      {label: 'You, as incident commander: you know the facts of the incident better than anyone else in the room'},
      {label: 'Ada, the communications officer: telling the public is what her job is for'},
      {label: 'The Mayor, on the first morning, so the town is seen to be open with residents'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('You know the facts; that’s why you give them to Noor. Whether the law requires telling anyone, and whom, is a legal judgement.');
    else if (i === 2) await say('Ada writes what is said and says it well. Whether anything must be said, and to whom, is Noor’s call.');
    else await say('The Mayor signs, but deciding on the first morning, before counsel has the facts, risks saying the wrong thing to the wrong people.');
  }
  c.plan = true; c.dec.owned += 2; track();
  G.f.ccPlan = true; unlock('act', 'ccplan'); unlock('fact', 'cc80061'); unlock('fact', 'ccctep'); touchCSF('Govern'); touchCSF('Respond');
  await say('One page. Incident commander: you. Technical lead: the district lead whose systems are hit. Legal: Noor. Communications: Ada. Executive decision-maker: the Mayor. A deputy for each, and a tabletop twice a year from CISA’s exercise packages. (Role names and schedule: game.)');
  await say('Next, the decision log. Elsie keeps it at the clerk’s desk.', 'Rae Okafor');
}

/* ---------- Fieldwork 2: the risk register ---------- */
async function ccClerkDesk() {
  const f = G.f;
  if (!f.ccMet) { await say('The clerk’s records desk. Rae should show you around first.'); return; }
  if (!f.ccPlan) { await say('The decision log and a blank risk register. The plan first.'); return; }
  if (!f.ccRisk) { await ccRiskTask(); return; }
  await say('The risk register: four risks, four owners from the business, a decision and a review date for each. Bram’s committee reads it every month.');
}
async function elsieTalk() {
  const f = G.f, who = 'Elsie Corrigan';
  if (!f.ccPlan) { await say('Elsie Corrigan, town clerk. When you have a plan, come and see the decision log. It isn’t pretty.', who); return; }
  if (!f.ccRisk) { await ccRiskTask(); return; }
  if (f.ccNight2 && f.ccDrill2 && !f.ccDrill3) { await ccDrill3(); return; }
  if (!f.ccDrill2 || !f.ccDrill3) { await say('The insurer’s questionnaire is on my desk. Question 7 has a yes box and a no box, and someone has to sign it.', who); return; }
  const c = CC();
  await say(c.dec.total + ' decisions, ' + c.dec.owned + ' with a name beside them. I’ve kept this log for nineteen years; it has never looked like this.', who);
}
async function ccRiskTask() {
  const c = CC(), who = 'Elsie Corrigan';
  await say('The council’s decision log: twelve decisions about security in two years. Three have a name next to them. The rest say “IT” or nothing. And nobody keeps a risk register. (game)', who);
  for (const r of CC_RISKS) {
    const items = r.owners.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Risk register · owner', '<div class="card"><b>' + esc(r.text) + '</b><br>Likelihood ' + r.lik + ' of 5 · impact ' + r.imp + ' of 5 (game)</div><p>Who owns this risk?</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(r.why);
    }
    c.risks[r.id] = true;
    await say(r.text + ': ' + r.decision + '; review in ' + r.review + '. (game)');
  }
  while (true) {
    const i = await choose('Who owns cyber risk for the town at council level?', [
      {label: 'A councillor: Bram, chairing a risk committee that reads the register monthly', meta: {good: true}},
      {label: 'You: the security team lead knows the risks best, so they should be yours to own'},
      {label: 'Audra Finch, the CIO: in the end, cyber risk is a matter for the IT department'},
      {label: 'The insurer: it pays out when things go wrong, so in practice the risk is theirs now'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('You advise and run the controls. Owning the town’s risk means deciding what the town accepts, and that is the council’s job.');
    else if (i === 2) await say('Audra runs IT delivery; security is one input among her costs and uptime. The council decides what risk the town accepts.');
    else await say('Insurance moves part of a loss. The risk, and the decision to accept it, stay with the town.');
  }
  c.dec.owned += 4; track();
  G.f.ccRisk = true; unlock('act', 'ccrisk'); unlock('fact', 'cccsf'); unlock('fact', 'ccregister'); touchCSF('Govern'); touchCSF('Identify');
  await say('The Mayor asked me before I could ask anyone. A risk committee, monthly, the register and every open post-incident action, each with an owner and a date. I’ll chair it. (game)', 'Councillor Bram Whitlock');
  await say('Now the team board. Nine people report to you; that has to change before anything else breaks.', 'Rae Okafor');
}

/* ---------- Fieldwork 3: delegation (mini-game) ---------- */
async function ccTeamBoard() {
  const f = G.f;
  if (!f.ccMet) { await say('A team board. Rae should show you around first.'); return; }
  if (!f.ccRisk) { await say('The team board: nine names, every arrow pointing at you. The register first.'); return; }
  if (!f.ccDeleg) { await ccDelegate(); return; }
  const d = CC().deleg;
  await say('The team board: each lead’s cases and room to spare. Last round: ' + (d ? d.mean + ' min to assign, ' + d.over + ' over capacity, ' + d.caught + ' of 1 unsupported close caught' : 'done') + '. (game)');
}
function ccLeadTable(leads) {
  return '<table class="sc"><tr><th>Lead</th><th>Good at</th><th>Cases</th></tr>' +
    leads.map(l => '<tr><td>' + esc(l.name) + '</td><td>' + esc(l.skills.join(', ')) + '</td><td>' + l.load + '/' + l.cap + (l.busy ? ' <small>(' + esc(l.busy) + ')</small>' : '') + '</td></tr>').join('') + '</table>';
}
async function ccDelegate() {
  const c = CC(), who = 'Rae Okafor';
  await say('Eight alerts in the queue, one of each kind the districts taught you. Give each to a lead with the skill and the room. Then read what comes back: a close is only as good as the evidence it names.', who);
  const leads = CC_LEADS.map(l => Object.assign({}, l));
  const res = [];
  let mins = 0, over = 0;
  for (const a of CC_QUEUE) {
    const rule = ALERTS[a.threat].rule;
    while (true) {
      const items = leads.map(l => ({label: l.name, note: l.skills.join(', ') + ' · cases ' + l.load + '/' + l.cap + (l.busy ? ' · ' + l.busy : ''), meta: {good: l.skills.includes(a.skill) && l.load < l.cap, id: l.id}}));
      if (!items.some(x => x.meta.good)) items.forEach((x, j) => { if (leads[j].skills.includes(a.skill)) x.meta.good = true; });
      const i = await UI.openModal('Delegate · ' + a.district, '<div class="card"><b>' + esc(rule) + '</b><br>' + esc(a.district) + ' · needs: ' + esc(a.skill) + '</div><p class="small">Each lead: what they are good at, and cases held of the three they can hold. (game)</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      const l = leads.find(x => x.id === items[i].meta.id);
      if (!l.skills.includes(a.skill)) { mins += CC_T_SKILL; await say(l.name.split(' ')[0] + ': That’s not my area. I’d only hand it back to you. (+' + CC_T_SKILL + ' game minutes)'); continue; }
      if (l.load >= l.cap) { over++; mins += CC_T_FULL; await say(l.name.split(' ')[0] + ' takes it on top of everything else. It waits in a full queue. (+' + CC_T_FULL + ' game minutes)'); }
      else mins += CC_T_OK;
      l.load++;
      res.push({a: a, lead: l});
      break;
    }
  }
  await say('All eight assigned. They come back through the afternoon. Read each close before it goes on the board.', who);
  let caught = 0, wrongBack = 0, missed = 0;
  for (const r of res) {
    const first = r.lead.name.split(' ')[0];
    const items = [{label: 'Accept ' + first + '’s close of the ' + r.a.district + ' alert', meta: {good: !r.a.bad, k: 'ok'}},
      {label: 'Send the ' + r.a.district + ' alert back to ' + first + ' for its evidence', meta: {good: !!r.a.bad, k: 'back'}}];
    const i = await UI.openModal('Returned · ' + r.a.district, '<div class="card"><b>' + esc(ALERTS[r.a.threat].rule) + '</b><br>' + esc(r.lead.name) + ': ' + esc(r.a.ret) + '</div>', items, {shuffle: true, closable: false, cls: 'drill'});
    const back = items[i].meta.k === 'back';
    if (r.a.bad && back) { caught++; await say(first + ' calls the supplier back on the number in the contract. The bank change was real, made by the supplier: benign after all, and now the close says why. (game)'); }
    else if (r.a.bad) { missed++; await say('That close named no evidence: “our usual supplier” is exactly what a hijacked supplier mailbox looks like. Rae sends it back herself; the call-back clears it. Next time, read the evidence line first.'); }
    else if (back) { wrongBack++; await say(first + ' sends it straight back with the same evidence line. It was fine: the close named its decisive source.'); }
  }
  const busiest = Math.max(...leads.map(l => Math.round(l.load / l.cap * 100)));
  c.deleg = {mean: Math.round(mins / CC_QUEUE.length), over: over, caught: caught, missed: missed, wrongBack: wrongBack, busiest: busiest};
  c.assign = c.deleg.mean; c.load = busiest; track();
  G.f.ccDeleg = true; unlock('act', 'ccdelegate'); touchCSF('Govern'); touchCSF('Respond');
  await UI.openModal('Delegation · result', '<p>Mean time to assign: <b>' + c.deleg.mean + '</b> game minutes (was ' + CC_ASSIGN0 + ') · leads over capacity: <b>' + over + '</b> · unsupported close caught: <b>' + caught + ' of 1</b>' + (wrongBack ? ' · sound closes sent back: <b>' + wrongBack + '</b>' : '') + ' (game)</p>' + ccLeadTable(leads),
    [{label: 'Back to the board', meta: {good: true}}], {closable: false, cls: 'drill'});
  await say('Eight cases, eight leads’ hands, and you read every close. That’s the job now. Noor wants you before the session: the plan’s contact page.', who);
}

/* ---------- Fieldwork 4: outside contacts (legal counsel decides notification) ---------- */
async function noorTalk() {
  const f = G.f, who = 'Noor Castellanos';
  if (!f.ccDeleg) { await say('Noor Castellanos, town attorney. When the plan has names in it, bring me its contact page.', who); return; }
  if (!f.ccContacts) { await ccContacts(); return; }
  if (f.ccBoss) { await say('I have the rows and the fields. I’ll decide who must be told, and when, and Ada will write it. That’s my job; the facts were yours.', who); return; }
  await say('Bring me facts, not conclusions. Who must be told is a legal question, and I answer it fresh for every incident.', who);
}
async function ccContacts() {
  const who = 'Noor Castellanos';
  await say('The plan’s contact page. Who outside the town hears about an incident, and who decides?', who);
  while (true) {
    const i = await choose('What does the contact page say?', [
      {label: 'Our reports to the FBI and CISA, the insurer’s notice; for anyone else: Noor decides', meta: {good: true}},
      {label: 'Every resident, the press and the state hear the same morning, so nobody can say the town hid anything'},
      {label: 'Only the insurer: their panel deals with the police and any regulator on the town’s behalf'},
      {label: 'Nobody outside hears until we know exactly what happened, so we never have to correct ourselves'}], {shuffle: true});
    if (i === 0) break;
    if (i === 1) await say('Telling everyone at once, before anyone knows what happened or what the law asks, is how towns announce the wrong numbers.');
    else if (i === 2) await say('The insurer’s panel can help, but our own duties stay ours. Law enforcement and CISA hear from us; I decide the rest.');
    else await say('Some duties run on a clock from when we became aware. Waiting for certainty can mean missing them. Facts to me early.');
  }
  G.f.ccContacts = true; unlock('fact', 'cccircia'); touchCSF('Respond'); touchCSF('Govern');
  await say('One more on that page: CIRCIA, the 2022 federal law. Once CISA’s final rule takes effect, covered critical-infrastructure entities report covered incidents to CISA within 72 hours and ransom payments within 24.', who);
  await say('As of today the final rule hasn’t been published, so nobody is required to report under it yet; CISA asks for voluntary reports. Whether the town or the water plant would be covered is my question, not yours. It’s in your Field Manual.', who);
  await say('The 18:00 session. The Mayor wants the booster station explained in words the council uses.', 'Rae Okafor');
}

/* ---------- Fieldwork 5: the plain-words council briefing (the booster station) ---------- */
async function ccBriefing() {
  const c = CC(), who = 'Mayor Dalia Merrin';
  await say('18:00, the council in session. When the booster station at the water plant went dark in the night, half of us read about it in an email full of codes. Tell us, in plain words.', who);
  let late = false;
  for (const p of CC_BRIEF) {
    const items = p.opts.map(o => ({label: o.label, meta: {good: !!o.good}}));
    while (true) {
      const i = await UI.openModal('Briefing · ' + p.part, '<p>Five parts, in plain words: what happened, impact on residents, what we are doing, what we need from you, when we next update you.</p><p><b>' + esc(p.part) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      late = true;
      await say(p.part === 'What happened' || p.part === 'What we are doing' ? 'Plain words, and only what we know. Codes and guesses lose the room.' : p.part === 'Impact on residents' ? 'Say what residents lived through, from the record: not a scare, not a table of levels.' : p.part === 'What we need from you' ? 'Ask for something specific they can decide. A council that is asked for nothing owns nothing.' : 'A time, and a promise to call sooner if things change. “Later” isn’t a time.');
    }
  }
  c.brief.total++; c.brief.on++; c.dec.owned += 1; track();
  G.f.ccBriefed = true; unlock('act', 'ccbrief'); touchCSF('Govern');
  await say('Thank you. That’s the first time I’ve understood one of these. The plan is adopted. We’ll expect the note on Friday.', who);
  if (late) await say('(Plain words take practice. The council still heard it on time.)');
  await say('A long first day. End your shift at your desk.', 'Rae Okafor');
}

/* ---------- Drills ---------- */
async function ccDrill(key) {
  const c = CC();
  const raw = JSON.stringify(CC_DRILLS[key]).replace(/\{D-1\}/g, String(G.day - 1)).replace(/\{D\}/g, String(G.day));
  const r = await doDrill(JSON.parse(raw));
  c.drills[key] = {score: r.score, verdictOk: r.verdictOk, supported: r.supported, keys: r.keys, ai: r.ai, aiWrong: r.aiWrong};
  c.led++; track();
  return r;
}
async function raeCcTalk() {
  const f = G.f, who = 'Rae Okafor';
  if (!f.ccNight1) { await say(f.ccDeleg ? 'Good afternoon’s work. Noor next, then the session.' : 'The team board is behind me. Nine names; one of you.', who); return; }
  if (!f.ccDrill1) { await ccDrill1(); return; }
  if (f.ccBoss && !f.ccFile) { await ccQtHandOff(); await ccEnding(); return; }
  if (f.ccFile) { await say('The file’s in good hands now, and so is the town. Go home on time for once.', who); await ccEnding(); return; }
  await say('The file takes my mornings. The team takes yours. That’s how it should be.', who);
}
async function ccDrill1() {
  const who = 'Rae Okafor';
  await say('Every close gets a second look this week. This one’s Paz’s, from yesterday afternoon: a WAF alert on the portal, closed as background scanning. You review the work, not the person. You lead this one.', who);
  const r = await ccDrill('review');
  G.f.ccDrill1 = true; touchCSF('Govern');
  await say(r.verdictOk ? 'Her verdict held, and now it rests on the server’s logs instead of her experience. Tell her what was missing, privately. She’ll fix the template herself.' : 'Her verdict held, but only once someone read PORTAL-01’s logs. Her close cited the WAF count alone. Coach it privately; the template changes.', who);
  await say('Councillor Rasmussen is in the chamber. Budget day. Bring numbers.', who);
}
async function fenTalk() {
  const f = G.f, who = 'Councillor Fen Rasmussen', c = CC();
  if (f.ccDirective) { await say('One post now, one at the next budget, and my name on the risk. Fair enough. River Road gets its first half.', who); return; }
  await say('Fen Rasmussen, roads committee. River Road is falling apart, and I’m told the security team just grew. I want two of your posts, the night analysts, to fund the resurfacing. $186,000 a year. (game)', who);
  while (true) {
    const i = await choose('How do you answer the roads committee?', [
      {label: 'Lay out what the two posts change in money, hours and risk, with options, and let the council decide and sign for it', meta: {good: true}},
      {label: 'Refuse outright: security staffing is not a budget line a council should be able to cut at all'},
      {label: 'Warn them the town will be hacked within weeks without the night analysts, and stop there'},
      {label: 'Accept quietly: it’s the council’s money, and arguing with a councillor isn’t your place'}], {shuffle: true});
    if (i === 0) { c.directive = 'options'; break; }
    if (i === 1) await say('Every budget line is the council’s to set. Your job is to make sure they set it knowing what it costs.');
    else if (i === 2) await say('A threat with no numbers is a guess, and if nothing happens in a few weeks you’ve lost the council’s trust.');
    else await say('Say nothing and the council cuts it without knowing what it buys. Inform the decision; don’t make it, and don’t hide from it.');
  }
  await say('Your options, then.', who);
  await say('The two posts cover nights. Without them, a night intrusion waits for the morning: a modelled nine more hours before anyone sees it (game). Keep both; keep one and defer one, with a written risk acceptance; or cut both, with the same. The council’s choice, and its name on it.');
  await say('Keep one, defer one to the next budget. I’ll sign the risk acceptance, and Bram’s committee can review it in six months. (game)', who);
  c.dec.owned += 1; c.dec.total += 1; track();
  G.f.ccDirective = true; unlock('act', 'ccriskbiz'); touchCSF('Govern');
  await say('(Present risk in business terms, then let the people accountable decide and own it.)');
}
async function adaTalk() {
  const f = G.f, who = 'Ada Pemberton';
  if (!f.ccNight2) { await say('Ada Pemberton, communications. If a reporter calls you, you send them to me. If I call you, I need facts, not adjectives.', who); return; }
  if (!f.ccDrill2) { await ccDrill2(); return; }
  await say('Our 16:00 update went out on time. Two follow-up calls, both satisfied. That’s what “no guessing” buys you.', who);
}
async function ccDrill2() {
  const who = 'Ada Pemberton';
  await say('“Town Hall hacked again: 40,000 residents’ files stolen this week.” 2,700 shares, and the reporter wants a comment before noon. Is it about us, and is it true? I won’t say a word until you tell me what we know.', who);
  const r = await ccDrill('press');
  G.f.ccDrill2 = true; touchCSF('Respond');
  await say(r.verdictOk ? 'The planning applications from the Records Hall incident, published now; nothing new this week. Noor is already deciding notices for those. I can say exactly that, and our next update is at 16:00.' : 'It’s the planning applications from the Records Hall incident: the file names are on Noor’s list, and nothing left this week. I can say that, and nothing more.', who);
  await say('Elsie has the insurer’s question 7 for you. It’s due Friday.', who);
}
async function ccDrill3() {
  const who = 'Elsie Corrigan';
  await say('Question 7: “At the time of the incident on the fd-admin account, was MFA enforced on all remote access?” Rae asked in your first week why fd-admin was on an exceptions list, and who approved it. Now somebody has to sign an answer.', who);
  const r = await ccDrill('insurer');
  G.f.ccDrill3 = true; touchCSF('Govern');
  await say(r.verdictOk ? 'No, then, with the record and what changed. Noor has read it. I’d rather sign a true no than a hopeful yes.' : 'The true answer is no: fd-admin was on the exceptions list and signed in on a password alone. Noor has read it; I’ll send it Friday.', 'Noor Castellanos');
  await say('Wendell’s dojo is open, and the Mayor’s committee room after that.', who);
}

/* ---------- Governance dojo (original puzzles) ---------- */
async function wendellTalk() {
  const who = 'Wendell Osei', f = G.f;
  if (!f.ccDrill3) { await say('Wendell Osei. The dojo opens once your week’s cases are done.', who); return; }
  if (!f.ccDojoMet) {
    f.ccDojoMet = true;
    await say('Three terminals: a risk to treat, a policy with a hole in it, and one line to a council. No tools today. Governance is choosing, writing and asking.', who);
    return;
  }
  if (f.ccDojoDone) { await say('Treat it, write it down with its exceptions, and ask for one thing at a time.', who); return; }
  await say('Puzzles solved: ' + CC().dojo.filter(Boolean).length + ' of 3. The terminals are to my left.', who);
}
async function ccDojoPuzzle(i) {
  const f = G.f, c = CC();
  if (i < 0) return;
  if (!f.ccDojoMet) { await say('A practice terminal. Talk to Wendell first.'); return; }
  const p = CC_DOJO[i];
  if (c.dojo[i]) { await say('Solved. ' + p.explain); return; }
  while (true) {
    const k = await choose(p.q, p.opts.map((o, j) => ({label: o, meta: {good: j === p.good}})), {shuffle: true});
    if (k === p.good) break;
    await say('Not quite. Read it again as the council would.');
  }
  await say('Correct. ' + p.explain);
  c.dojo[i] = true; touchCSF('Govern');
  if (!c.dojo.every(Boolean) || f.ccDojoDone) return;
  f.ccDojoDone = true;
  const t = tool(); if (t) { t.lvl++; await say('All three. ' + TOOLS[t.id].name + ' reached Lv ' + t.lvl + '.', 'Wendell Osei'); }
}

/* ---------- Council Board ---------- */
async function ccBoardScript() {
  const who = 'Mayor Dalia Merrin', f = G.f, c = CC();
  if (f.ccBoard) { await say('The Charter Badge means the town has a security team, not a security person. Keep it that way.', who); return; }
  if (!f.ccDrill3) { await say('The council sits as a board once your week’s cases are done.', who); return; }
  await say('The Council Board. Three questions, the way the council really asks them. We don’t grade the answer you like; we grade the one we can act on.', who);
  for (const s of CC_BOARD_SPECS()) {
    const items = s.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    while (true) {
      const i = await UI.openModal(s.title, '<p><b>' + esc(s.who) + ':</b> ' + esc(s.ask) + '</p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      await say(s.resp[i].why, s.who);
    }
  }
  f.ccBoard = true; f.ccCharter = true;
  G.focusMax = Math.max(G.focusMax, 52); G.focus = G.focusMax;
  c.dec.owned = c.dec.total; c.board = {day: G.day}; track();
  await say('You cleared the Council Board. This is the Charter Badge.', who);
  await say('Its power: every alert in your queue now arrives with its district lead’s first look, so you start with evidence in hand. And you carry a little more: Focus 52. (game)', who);
  await say('Rank: Security team lead. Your responsibility: the team’s cases go to the right people, every close is read, and the council hears plain facts on time.');
  touchCSF('Govern');
}

/* ---------- Boss: a town-wide incident, played as incident command (game-original) ---------- */
async function ccBossScript() {
  const c = CC(), who = 'Rae Okafor';
  await surfaceMissed(true);
  c.boss = {day: G.day, first: []};
  await say('00:50, the war room. One account, one laptop, three districts. The leads are on the phone. You’re the incident commander now. Command it; don’t do it.', who);
  await say('Rae and Magda checked first: nothing ties tonight to svc-print or the closet router. A different intruder. (game)');
  const S = ccBossStages();
  for (const k of ['s1', 's2', 's3']) {
    const st = S[k];
    const items = st.resp.map(r => ({label: r.label, meta: {good: !!r.good}}));
    let first = true;
    while (true) {
      const i = await UI.openModal(st.title, '<ul>' + st.clues.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><p><b>' + esc(st.ask) + '</b></p>', items, {shuffle: true, closable: false, cls: 'drill'});
      if (items[i].meta.good) break;
      first = false;
      await say(st.resp[i].why);
    }
    c.boss.first.push(first);
    if (k === 's1') { touchCSF('Respond'); await say('00:58: Paz stopped the export. t.ashby is disabled, its sessions revoked. DS-LT-03 is off the network, still powered; Ruth is copying its memory and disk. Bea copied the inbox rule, then removed it. Noor and Ada are up; the Mayor knows.'); }
    if (k === 's2') { c.brief.total++; if (first) c.brief.on++; track(); await say(first ? 'The council heard it at 08:00: what we know, what we don’t, and 14:00 for the next update. The Mayor approved the outside firm from the insurer’s panel. (game)' : 'The council heard it, late and after a false start. Next update promised for 14:00.'); }
    if (k === 's3') { c.brief.total++; if (first) c.brief.on++; track(); }
  }
  c.dec.owned += 3; c.dec.total += 3; c.act.total += 3; c.led++; track();
  c.boss.ok = c.boss.first.every(Boolean);
  G.f.ccBoss = true; unlock('act', 'cccommand'); touchCSF('Recover'); touchCSF('Govern');
  bumpUptime(0.01);
  await say('14:00, on time: the owners agreed the order. The portal’s resident services come back first through a clean admin path; DS-LT-03 is rebuilt from a clean image, its copies kept. Noor has the 18,600 rows and their fields, and she decides who must be told. The FBI and CISA have the extortion email. No payment: the Mayor’s decision, with Noor. (game)');
  await say('Three new actions, each with an owner: portal admin only from admin workstations, a rule for attachments in mailboxes that take outside mail, and the night post at the next budget. (game)');
  await say('Before you sign off the week: Rae, in the team room. The suspicion file.', 'Mayor Dalia Merrin');
}

/* ---------- The edition ending ---------- */
function ccDistrictRows() {
  const D = [
    ['Front Desk', G.badge ? 'Key' : '—', null, null, G.f.bossDone],
    ['Mail Room', G.f.mrSeal ? 'Seal' : '—', typeof MR_DRILLS !== 'undefined' ? MR_DRILLS : null, G.mr, G.f.mrBoss],
    ['Clerks’ Row', G.f.crShield ? 'Shield' : '—', typeof CR_DRILLS !== 'undefined' ? CR_DRILLS : null, G.cr, G.f.crBoss],
    ['Market Square', G.f.mkLantern ? 'Lantern' : '—', typeof MK_DRILLS !== 'undefined' ? MK_DRILLS : null, G.mk, G.f.mkBoss],
    ['Records Hall', G.f.rhVault ? 'Vault' : '—', typeof RH_DRILLS !== 'undefined' ? RH_DRILLS : null, G.rh, G.f.rhBoss],
    ['IT Basement', G.f.bmBeacon ? 'Beacon' : '—', typeof BM_DRILLS !== 'undefined' ? BM_DRILLS : null, G.bm, G.f.bmBoss],
    ['Server Room', G.f.svCrown ? 'Crown' : '—', typeof SV_DRILLS !== 'undefined' ? SV_DRILLS : null, G.sv, G.f.svBoss],
    ['Water Plant', G.f.wtTide ? 'Tide' : '—', WT_DRILLS, G.wt, G.f.wtBoss],
    ['Council Chambers', G.f.ccCharter ? 'Charter' : '—', CC_DRILLS, G.cc, G.f.ccBoss]];
  return D.map(([name, badge, drills, st, boss]) => {
    const sc = drills ? Object.keys(drills).map(k => st && st.drills && st.drills[k] ? st.drills[k].score : '—').join(' · ') : '—';
    return '<tr><td>' + esc(name) + '</td><td>' + esc(badge) + '</td><td>' + sc + '</td><td>' + (boss ? 'handled' : '—') + '</td></tr>';
  }).join('');
}
async function ccEnding() {
  await surfaceMissed(true);
  const c = CC();
  if (!G.f.ccSummary) { c.act.closed = Math.max(c.act.closed, 19); track(); }
  G.f.ccSummary = true;
  const body = '<p class="big">Town Hall: every district secured.</p>' +
    '<p>Rank <b>' + G.rank + '</b> · Field Manual <b>' + fmPct() + '%</b> · Time played <b>' + fmtTime(G.playMs) + '</b> · Days <b>' + G.day + '</b></p>' +
    '<h3>Nine districts</h3><table class="sc"><tr><th>District</th><th>Badge</th><th>Drills (game)</th><th>Incident</th></tr>' + ccDistrictRows() + '</table>' +
    '<h3>Your scorecard, every district</h3>' + scorecardHtml() +
    (c.boss ? '<p>The night of the portal export: ' + (c.boss.ok ? 'commanded, briefed on time and recovered in the owners’ order, with notification left to counsel' : 'handled, with false starts the debriefs named') + '.</p>' : '') +
    '<p>Missed attacks found in review: <b>' + G.m.surfaced + '</b>.</p>' +
    ccQtSummaryHtml() +
    '<h3>Credits</h3><p class="small">UPTIME, Town Hall edition. Original game. Framework IDs from MITRE ATT&amp;CK® (© 2026 The MITRE Corporation; reproduced and distributed with its permission); function and category names from the NIST CSF 2.0; the full list of sources is under Credits.</p>' +
    '<p class="big">Next edition: coming later.</p>';
  Series.markEdition(EDITION.id, {done: true, councilChambers: true, editionComplete: true});
  while (true) {
    const i = await UI.openModal('End of the Town Hall edition', body, [{label: 'Keep exploring Town Hall', meta: {good: true}}, {label: 'Credits'}, {label: 'Title screen'}], {nav: 'district-end', closable: false, cls: 'summary'});
    if (i === 1) { await UI.openModal('Credits', creditsHtml(), [{label: 'Back'}]); continue; }
    storeSet(encodeSave(G));
    if (i === 2) { started = false; titleScreen(); }
    break;
  }
}
