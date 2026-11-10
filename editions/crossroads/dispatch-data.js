/* ============================================================
   UPTIME · editions/crossroads/dispatch-data.js
   Crossroads district 4: Fire & EMS Dispatch (both tracks). Art, map, people,
   the manager track's tables (the Dispatch annex's retainer test, the week-3
   rota, the cards drill with the supervisor, the backup center's pack, the
   24-hour plan, the AAR measured in response time), the DFIR track's tables
   (the scoping letter, preservation that never slows the floor, evidence intake,
   separate stores), three drills per track, two reports, the directive, the
   Dispatch Board, the two dojos, the boss's stages for each seat, and Field
   Manual text.
   One decider per decision (game): the supervisor on duty on the floor (Imogen
   Hale by day; the night supervisor from 19:00) decides dispatch operations (cards or CAD, when to go and when to return,
   rolling overflow calls to the backup center, the timing of any change that
   touches the floor); Chief Gideon Sayre decides response policy; Dr Anselm
   Oduya, the EMS medical director, decides patient-care protocol; Celia Marrow,
   director of the county 911 authority, owns the center's systems and contracts
   and decides what the authority reports, and to whom, with counsel; Lionel
   Ashdown, the county attorney, engages the firm and decides who receives its
   reports; Petra Vasko, the county IT director, runs the county network and the
   center's servers. Life safety first: nothing here delays a response or leaves
   a caller unanswered, and both over- and under-reactions are graded wrong.
   The game names no real CAD or radio vendor and retells no real dispatch
   center's incident; nothing here touches the radio room. The CISA, 911.gov and
   FCC lines are quoted only in the Field Manual, in their own words; the game
   says nothing about what any rule requires of the center. Stillmark, Stillmark
   CAD, the center's hosts, people, counts, times and the attack are invented
   (game). Addresses: RFC 5737 only. Real facts: CREDITS.md, section
   "Crossroads". Timeline: scratchpad crossroads-timeline.md (Fire & EMS Dispatch
   section); every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  dpConsole: ['#1b2233', '#1f4a6e', '#5f9fd6', '#dbeaf7'],
  dpRadio: ['#1b2233', '#3a3a3a', '#8a8a8a', '#d7dbe4'],
  dpRack: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  dpRackOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  dpLink: ['#1b2233', '#6e2a2a', '#c05a5a', '#f2d7d7'],
  dpLinkOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  dpSup: ['#1b2233', '#4a3a6e', '#8a7ac0', '#e0d8f7'],
  dpCards: ['#1b2233', '#6e5a2a', '#c0a05a', '#f7ecd2'],
  dpCardsOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  hale: ['#1a1a2e', '#2b1d16', '#c98a54', '#2a4a7a'],
  sayre: ['#1a1a2e', '#8c8c8c', '#e0b090', '#8a1f1f'],
  marrow: ['#1a1a2e', '#3b2418', '#a8703f', '#2f5a5a'],
  ashdown: ['#1a1a2e', '#141414', '#f0c8a0', '#3a3a5a'],
  vasko: ['#1a1a2e', '#5b3a26', '#f2c7a0', '#4a6e2a'],
  orrin: ['#1a1a2e', '#c0a040', '#e0b090', '#2a5a8a'],
  moll: ['#1a1a2e', '#3a1d10', '#c98a54', '#6e5a2a'],
  grange: ['#1a1a2e', '#d7dbe4', '#f0c8a0', '#5a2a6e'],
  teague: ['#1a1a2e', '#6e6e6e', '#f2c7a0', '#2a2a2a'],
  okoro: ['#1a1a2e', '#141414', '#6e4a2c', '#7a3d8a'],
  reyes: ['#1a1a2e', '#2b1d16', '#a8703f', '#3a8a5a']
});
Object.assign(TILES, {
  'Ř': {spr: 'pc', pal: 'dpConsole', solid: true, under: ','},     // the console positions on the dispatch floor
  'Ŗ': {spr: 'K', pal: 'dpRadio', solid: true},                     // the radio room's racks (shown, never touched)
  'Ŝ': {spr: 'K', pal: 'dpRack', solid: true},                      // the CAD server room: CAD-01, CAD-02, MQ-01
  'Ź': {spr: 'K', pal: 'dpLink', solid: true},                      // the building link's patch panel (DP-SW-01)
  'Ŵ': {spr: 'counter', pal: 'dpSup', solid: true, under: ','},     // the supervisor's desk
  'Ŷ': {spr: 'K', pal: 'dpCards', solid: true}                      // the backup positions' cards cabinet
});

/* ---------- Map: the center and the Dispatch Board room ---------- */
// South door from the town square (the square's north edge). North: the dispatch floor, the radio room, the CAD server
// room. Middle: the supervisor's desk, the backup positions and the cards cabinet. South: the chief's office, the
// training room (dojo), the lobby, the incident room (the table and the evidence locker), the staff room (the desk).
// West door: the Dispatch Board room.
Object.assign(MAPS, {
  dispatch: {
    name: 'Fire & EMS Dispatch',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,Ř,Ř,Ř,,,,,,w,Ŗ,Ŗ,w,Ŝ,Ŝ,Ŝ,Ź,w",
      "w,,,,,,,,,,,,w,,,,,w,,,,,,,,,w",
      "w,Ř,Ř,Ř,,,,,,w,,,,,w,,,,,,,,,w",
      "w,,,,,,,,,,,,w,,,,,w,,,,,,,,,w",
      "wwwwww,wwwwwwwww,wwwwwww,wwwww",
      "w,,,,,,,,Ŵ,,,,,,,,,ŶŶ,,,,,,,,w",
      "D,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "www,wwwww,wwww,,,www,wwwwww,ww",
      "w,,,,,,w¤,¤,¤w,,,w,,,,,,w,,,,w",
      "w,,,,,,w,,,,,w,,,w,,§§,,w,,,,w",
      "w,,,,,,w,,,,,w,,,w,,,,,£w,,Y,w",
      "w,,,,,,w,,,,,w,,,w,,,,,,w,,,,w",
      "w,,,,,,w,,,,,w,,,w,,,,,,w,,,,w",
      "wwwwwwwwwwwwwwwDwwwwwwwwwwwwww"
    ],
    doors: {'15,15': {to: 'csquare', x: 15, y: 1, dir: 'down'}, '0,7': {to: 'dpboard', x: 16, y: 5, dir: 'left'}}
  },
  dpboard: {
    name: 'The Dispatch Board room',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w±±,,,,,,,,,,,,±±w",
      "w±±,,,,,,,,,,,,±±w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'17,5': {to: 'dispatch', x: 1, y: 7, dir: 'right'}}
  }
});
const DP_MAPS = ['dispatch', 'dpboard'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'hale', name: 'Imogen Hale', role: 'day supervisor on the floor', map: 'dispatch', x: 9, y: 7, dir: 'down', pal: 'hale'},
  {id: 'reyes', name: 'Tamsin Reyes', role: 'telecommunicator', map: 'dispatch', x: 8, y: 2, dir: 'left', pal: 'reyes'},
  {id: 'sayre', name: 'Chief Gideon Sayre', role: 'fire & EMS chief', map: 'dispatch', x: 3, y: 12, dir: 'right', pal: 'sayre'},
  {id: 'teague', name: 'Warren Teague', role: 'county administrator', map: 'dispatch', x: 5, y: 13, dir: 'left', pal: 'teague', cond: G => !!G.f.dpBoss},
  {id: 'orrin', name: 'Felix Orrin', role: 'county CAD administrator', map: 'dispatch', x: 22, y: 3, dir: 'left', pal: 'orrin'},
  {id: 'vasko', name: 'Petra Vasko', role: 'county IT director', map: 'dispatch', x: 26, y: 3, dir: 'left', pal: 'vasko'},
  {id: 'moll', name: 'Ezra Moll', role: 'the Compact’s field technician at the center', map: 'dispatch', x: 24, y: 2, dir: 'down', pal: 'moll'},
  {id: 'marrow', name: 'Celia Marrow', role: 'director, county 911 authority', map: 'dispatch', x: 19, y: 13, dir: 'up', pal: 'marrow'},
  {id: 'ashdown', name: 'Lionel Ashdown', role: 'county attorney', map: 'dispatch', x: 22, y: 13, dir: 'up', pal: 'ashdown'},
  {id: 'grange', name: 'Hollis Grange', role: 'training coordinator', map: 'dispatch', x: 10, y: 12, dir: 'up', pal: 'grange'},
  {id: 'luciadp', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'dispatch', x: 23, y: 10, dir: 'left', pal: 'lucia', cond: G => G.trackId === 'dfir' || !!G.f.dpBoss},
  {id: 'theodp', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'dispatch', x: 18, y: 13, dir: 'up', pal: 'theo', cond: G => G.trackId === 'dfir'},
  {id: 'okoro', name: 'Delphine Okoro', role: 'chair of the Dispatch Board', map: 'dpboard', x: 8, y: 3, dir: 'down', pal: 'okoro'}
);
const DP_NPC_IDS = ['hale', 'reyes', 'sayre', 'teague', 'orrin', 'vasko', 'moll', 'marrow', 'ashdown', 'grange', 'luciadp', 'theodp', 'okoro'];

/* ---------- Manager: the Dispatch annex's retainer test (Day 16 08:10) ---------- */
const DP_ACTIVATE = [
  {label: 'Ring Felix’s directory line now. Unless he can confirm, the annex is met: firm, counsel told', good: true},
  {label: 'Not met: the account belongs to county staff, and county staff answer to Petra, not the firm', why: 'The annex says may have been reached by someone not authorised. Nobody can yet say who signed in at 03:20.'},
  {label: 'Not yet: hold off until Felix’s next shift, then decide with counsel whether the annex applies', why: 'He is off until the afternoon, and the sign-in is unexplained now. Ring him now on a known number; if he can’t confirm it, the annex’s may is met.'},
  {label: 'Met, and more: take CAD offline and put the floor on cards until the firm has checked it', why: 'Nothing shows CAD is failing, and taking it down slows every dispatch. The floor is Imogen’s to run. Call the firm.'},
  {label: 'Imogen decides whether the firm comes in, once the morning’s calls have eased off', why: 'The retainer is the Compact’s and its annex says when it is called. You make the call, and Imogen and counsel are told at once.'}];
const DP_ACT_OK = 15, DP_ACT_LATE = 20;   // game minutes

/* ---------- The week-3 rota (Nights 14 to 22; Nights 14 and 15 carried for the in-a-row rule) ---------- */
const DP_ROTA = {
  title: 'On-call rota, week 3', first: 14, carry: 2, nights: 9, hours: 12, maxRun: 2, maxWeek: 2, budget: 30, callCost: 3, tiredCost: 5, waitUntil: '07:00',
  intro: '<p>Nights 16 to 22: the town, the Library, the School District, the Clinic and now Fire &amp; EMS Dispatch. Nights 14 and 15 are carried for the in-a-row rule. The night post is still advertised (game).</p>',
  people: [
    {id: 'bea', name: 'Bea Lindqvist', note: 'email, identity'},
    {id: 'ruth', name: 'Ruth Avila', note: 'endpoints'},
    {id: 'paz', name: 'Paz Delgado', note: 'web'},
    {id: 'odile', name: 'Odile Brennan', note: 'backups', off: [20]},
    {id: 'magda', name: 'Magda Petrov', note: 'logs, network'},
    {id: 'beatriz', name: 'Beatriz Solano', note: 'identity, servers'},
    {id: 'rae', name: 'Rae Okafor', note: 'the suspicion file', max: 1}],
  calls: {}
};

/* ---------- Manager: the cards drill with the supervisor (Day 17 09:00) ---------- */
const DP_DRILL_OBJ = [
  {label: 'A trainee shadows every live call on cards while the live position dispatches it on CAD', good: true},
  {label: 'The whole floor goes off CAD for an hour, to make it real for each telecommunicator on shift', why: 'Every caller’s dispatch would slow for a drill. A shadow position on paper tests the cards while CAD dispatches every call.'},
  {label: 'Talk it through at the table: the cards are in the cabinet, and Imogen knows where', why: 'Talking tests nothing. The cards have to be used at a position, against real calls, to show what is missing.'},
  {label: 'Run it at 03:00 when it is quiet, without telling the supervisor, and measure it in seconds', why: 'It is her floor, and every change on it is her decision. A drill nobody agreed to is a surprise, not a test.'}];
const DP_DRILL_INJECTS = [
  {t: 'Exercise, 09:20 (simulated): CAD freezes at two positions for half a minute. Who calls cards, and when?',
   opts: [{label: 'Imogen calls it on her floor: a position CAD can’t serve goes to cards at once', good: true},
          {label: 'Wait until county IT confirms CAD is down, and keep the floor on CAD until then', why: 'Callers wait while IT checks. The supervisor decides on what the floor sees.'},
          {label: 'You call it: an outage during an incident is the IR manager’s, so it is yours to run', why: 'You advise. The floor is Imogen’s, and so is the switch to cards.'},
          {label: 'Go to cards at the first slowness, even a second, and stay there until Petra checks', why: 'Switching for every pause costs more time than it saves. Her criteria, applied as written.'}]},
  {t: 'Exercise, 09:40 (simulated): on cards, a caller says a person isn’t breathing. What does the call-taker do?',
   opts: [{label: 'Send the ambulance from the run card at once, then the same protocol’s instructions on paper', good: true},
          {label: 'Skip the instructions to get the ambulance out faster: the cards are slow enough', why: 'Instructions don’t hold up the dispatch: the ambulance goes first, then the instructions. They are care, and changing them is Dr Oduya’s decision as medical director.'},
          {label: 'Work through the whole protocol on paper first, and only then send the ambulance from the card', why: 'The ambulance goes as soon as the address and the problem are known. The questions and instructions follow while it is on its way.'},
          {label: 'Imogen shortens the protocol for cards, and each call-taker keeps up', why: 'The medical protocol is medical direction’s to change. The supervisor runs the floor, not the care.'},
          {label: 'Transfer each medical call to Oxlow’s center while the position is on cards', why: 'A transfer is a delay for a caller who needs help now, and Oxlow takes overflow, not our protocol.'}]},
  {t: 'Exercise, 10:00 (simulated): CAD is back. How does the floor go back to it?',
   opts: [{label: 'Imogen’s time: the floor waits for a test incident, open calls checked twice', good: true},
          {label: 'At once, the moment the sign-in screen shows again: the sign-in is the test', why: 'A screen isn’t a working system. A test incident end to end first.'},
          {label: 'Enter the open cards into CAD later in the week, when the floor is quieter', why: 'Open calls belong in CAD before it is trusted, and the rest within the shift, checked.'},
          {label: 'The chief decides when the floor switches back: the units are his', why: 'The chief decides response policy. When the floor goes back to CAD is Imogen’s call.'}]}];
const DP_EX_ACTIONS = 3;

/* ---------- Manager: what the backup center needs (Day 17 11:00; pick four) ---------- */
const DP_PACK = [
  {id: 'map', name: 'Our map and response areas', csf: 'Recover', text: 'Our street map, address points and response-area boundaries, so each call is placed in our area and passed back right.', good: true},
  {id: 'roster', name: 'Units and a line back', csf: 'Respond', text: 'Our unit roster, and the supervisor-to-supervisor line for passing a call back to us.', good: true},
  {id: 'contact', name: 'Named contacts', csf: 'Govern', text: 'A named contact each way, day and night, with direct numbers.', good: true},
  {id: 'test', name: 'A test, on a date', csf: 'Recover', text: 'A rollover test call at 11:30 today, one tonight with the night shift, then monthly.', good: true},
  {id: 'login', name: 'A CAD login', csf: 'Protect', text: 'A login to our CAD for Oxlow’s staff, shared between them, for the busy hours.'},
  {id: 'db', name: 'A CAD copy', csf: 'Recover', text: 'A full copy of our CAD database, in case Oxlow needs any history.'},
  {id: 'radio', name: 'Radio settings', csf: 'Respond', text: 'The configuration of our radio consoles, so Oxlow can set theirs to match.'}];

/* ---------- Manager: the next 24 hours (Day 18 17:30, boss stage 3; rota/budget forecast for week 3, game) ---------- */
const DP_COVER = [
  {label: 'Two 12-hour shifts, Night 18’s rota lead on site tonight, handovers at seven', good: true, k: 'shifts', gaps: 0, overtime: 22},
  {label: 'Everyone stays until CAD is back: the center needs as many hands as it can get', k: 'all', gaps: 0, overtime: 46, why: 'By three in the morning nobody makes a clear call. Forecast: 46 overtime hours against 30, and nobody fresh on Friday.'},
  {label: 'You and Ezra cover it between you, day and night, with no rest and no handover', k: 'two', gaps: 0, overtime: 36, why: 'Two people with no rest, and one of them is the only one who knows the collector. Forecast: 36 hours.'},
  {label: 'Stand down until the morning, since the floor is on cards and the firm works overnight', k: 'none', gaps: 12, overtime: 14, why: 'The night would have nobody for the Compact while CAD is rebuilt. Forecast: 12 hours uncovered.'},
  {label: 'Night 18’s lead, on call overnight, also works Friday’s day shift, to keep the picture in one head', k: 'double', gaps: 0, overtime: 25, why: 'Twelve hours on call, then twelve more: a 24-hour stretch is the tired call the rota exists to prevent.'}];

/* ---------- Manager: the AAR (Day 19 10:30; blameless; owners arrive assigned under the Library Board's rule: Bookmark Badge) ---------- */
const DP_FACTORS = [
  {id: 'dir', name: 'CAD leaned on the county', csf: 'Identify', text: 'CAD’s sign-ins and name look-ups went through the county’s directory server, CO-DC-01.', good: true},
  {id: 'flat', name: 'One network', csf: 'Protect', text: 'The county office and the center shared one network, so the county’s outage reached the floor.', good: true},
  {id: 'mdg', name: 'The gateway’s place', csf: 'Identify', text: 'The unit-status gateway sits at the county office, so cutting the link put every status on the radio from 14:15.', good: true},
  {id: 'alerts', name: 'Alerts that stopped short', csf: 'Detect', text: 'County office alerts reached county IT only. The floor learned from frozen screens at 14:05.', good: true},
  {id: 'user', name: 'User error', csf: 'Protect', text: 'Root cause: a county clerk opened something they should have known was a trap, and that is the cause.'},
  {id: 'vendor', name: 'The vendor’s door', csf: 'Protect', text: 'Stillmark’s always-on remote access let the attackers in to the county and the center.'},
  {id: 'drill', name: 'The drill', csf: 'Recover', text: 'Wednesday’s cards drill tired the floor out and made Thursday’s dispatching slower.'}];
const DP_AAR = [
  {id: 'local', name: 'CAD signs in and looks up names without the county’s directory, tested monthly', owner: 'Celia Marrow, with county IT doing it',
   dates: [{label: 'Day 22, Monday, after the test window', good: true},
           {label: 'As soon as possible', why: 'A date nobody can check. Day 22, after the test window.'},
           {label: 'When the budget allows', why: 'Local sign-in exists already: it was used on Thursday night. Nothing to buy. Day 22.'},
           {label: 'Day 20, Saturday: tomorrow, on the weekend shift', why: 'An untested change to CAD on a weekend is a new risk to the floor. Day 22.'}]},
  {id: 'alerts', name: 'County alerts that touch the shared network page the floor and the Compact’s on-call', owner: 'Petra Vasko',
   dates: [{label: 'Day 19, today', good: true},
           {label: 'As soon as possible', why: 'An action without a date doesn’t close. Today at 17:00.'},
           {label: 'When the budget allows', why: 'It is a routing rule, not a purchase. Today.'},
           {label: 'Day 40, once a new alerting tool has been bought', why: 'The routing works with the tool the county has. Today.'}]},
  {id: 'roll', name: 'The rollover to Oxlow tested monthly, with Oxlow holding our current map and response areas', owner: 'Imogen Hale',
   dates: [{label: 'Day 26, the first monthly test', good: true},
           {label: 'As soon as possible', why: 'A test needs a date both centers can keep. Day 26.'},
           {label: 'When the budget allows', why: 'A test call costs nothing. Day 26.'},
           {label: 'Day 90, a Saturday: a quarterly test, after the budget round', why: 'Wednesday’s test was the first in years. A month, not a quarter: Day 26.'}]}];

/* ---------- The directive (game): fold the center onto the county's general network ---------- */
const DP_DIRECTIVE = {
  manager: [
    {label: 'The savings, the cost of Thursday, and the choices, so Celia decides knowing them', good: true},
    {label: 'Refuse it outright: the center never shares anything with the county again', why: 'An absolute with a price nobody has counted. Lay out the options, and the owner decides.'},
    {label: 'Fold it in this month, since it saves money and the floor coped on cards on Thursday', why: 'The floor coped, helped by its drill. CAD failed because it leaned on the county. The decision is Celia’s.'},
    {label: 'You decide it now, as the IR manager, and tell the county administrator what you decided', why: 'You advise. The center’s systems are the 911 authority’s, and Celia decides.'},
    {label: 'Petra decides: she runs both networks, and the design of each is her choice', why: 'Petra runs them. Who owns the 911 decision is the 911 authority, and that is Celia.'}],
  dfir: [
    {label: 'What the case showed: CAD failed through the county’s directory. Celia decides', good: true},
    {label: 'Tell him what the report requires: a separate network, and Celia must comply with it', why: 'A report recommends. The owner decides, knowing what the case showed.'},
    {label: 'Say the network’s design is outside the letter counsel signed, and say no more', why: 'Lionel has agreed the facts can be shared. Silence leaves the decision blind.'},
    {label: 'Tell him the shared network let the attack into CAD, and it must be split at once', why: 'It didn’t: CAD wasn’t encrypted. It was cut off when the county’s directory went down.'}]};

/* ---------- DFIR D1: the scoping letter (game) ---------- */
const DP_LETTER = [
  {label: 'Confirm the questions, then agree with Imogen what can be taken, so no position is touched', good: true},
  {label: 'Image CAD-01 first, then agree with Imogen an hour of cards at each position while it is copied', why: 'That puts every caller on the slower system for evidence the standby already holds. Never slow the floor for a copy.'},
  {label: 'Ask Stillmark, without counsel, to decide what remote access the firm can have', why: 'Its systems are out of scope. Requests for what it holds go through counsel and are logged when sent.'},
  {label: 'Start a review of the flat network: the county will need a redesign either way', why: 'The letter asks three questions. A redesign is advice for later, and the owner’s decision.'}];

/* ---------- DFIR D2: preserve without taking the floor down ---------- */
const DP_PRESERVE = [
  {label: 'From what doesn’t serve the positions: copy the logs off the standby and the gateway', good: true},
  {label: 'Take CAD-01 offline at 10:00 and image it: an hour on cards is a fair price for a clean copy', why: 'The floor would dispatch slower for evidence CAD-02 already holds. Collect from the standby.'},
  {label: 'A full database export from CAD-01 now, during the morning peak, while the evidence is fresh', why: 'That loads the live server the positions use. The standby has the same audit tables.'},
  {label: 'Wait until tonight, and collect what is left once Imogen’s floor is quiet', why: 'The gateway keeps 48 hours: Sunday night’s lines start rolling off tonight. And the standby and the gateway can be read now without touching a position.'}];

/* ---------- DFIR D3: evidence intake (the county's store, case DSP) ---------- */
const DP_INTAKE = {
  d01: {id: 'D-01', what: 'CAD audit log, Day 13 00:00 to Day 16 09:00, from CAD-02', form: 'Exported 09:20 by Felix Orrin from CAD-02’s copy of the audit tables; SHA-256 at export recorded. Question 1 asks about his account’s 03:20 sign-in.',
    opts: [{label: 'Note who made it, ask Petra for a second export, and compare the two hashes', good: true},
           {label: 'Discard it, and ask Petra to start again: an owner’s export can’t be used', why: 'It can be used, with the record honest about who made it. A second export by someone else, compared, settles it.'},
           {label: 'Log it as it is: Felix is county staff, and who exported it doesn’t matter', why: 'Independence matters when the exporter’s own account is in the question. Write it down and get a second export.'},
           {label: 'Ask Felix to export the same range again himself, and compare the two hashes', why: 'The same person twice proves nothing new. Someone else exports the second copy.'}]},
  d02: {id: 'D-02', what: 'Flow records, the core switch and the edge firewall, the same window', form: 'Exported 09:25 by Petra Vasko; SHA-256 at export recorded.',
    opts: [{label: 'Hash it on receipt against Petra’s export record, log it, seal it, read a copy', good: true},
           {label: 'Read the firewall’s live console instead, since it has the same flows as Petra’s, and newer', why: 'The console rolls on. The export is the fixed record.'},
           {label: 'Keep only the rows for CAD-01, the server in question 1, and hash those against the record', why: 'Question 3 needs the gateway’s rows too. Keep the export whole.'},
           {label: 'Seal it, then send a copy to the firewall vendor’s analysts, telling counsel after', why: 'Who sees the county’s evidence goes through Lionel. Ask him first.'}]},
  d03: {id: 'D-03', what: 'DP-VPN, the vendor gateway’s log: its 48 hours, Day 14 09:30 to Day 16 09:30', form: 'Exported 09:30 by Petra Vasko; SHA-256 at export recorded. The gateway keeps 48 hours.',
    opts: [{label: 'Compare the hashes, log Petra’s handover, seal it as received, work on a copy', good: true},
           {label: 'Keep it on the gateway: the vendor decides about its own log, not the county', why: 'The gateway is the county’s and keeps 48 hours. Sunday night’s lines would be gone.'},
           {label: 'Edit out the lines from before Sunday, and seal only the window that matters', why: 'An edited item isn’t the item. Seal what was exported.'},
           {label: 'Forward a copy to Stillmark, and compare its sessions with the vendor’s own list', why: 'Requests to the vendor go through counsel. Our evidence stays in our store.'}]},
  d06: {id: 'D-06', what: 'DP-LOG-01, the Compact’s collector: its own security and process log', form: 'Exported 09:45 by Ezra Moll; SHA-256 at collection recorded (Bookmark Badge).',
    opts: [{label: 'As each item: compare the hashes, log Ezra’s handover, seal it, use a copy', good: true},
           {label: 'Skip the hash comparison: Ezra works for the Compact, as you once did', why: 'The check is about the file, not the person. Compare every item.'},
           {label: 'File a copy in the town’s evidence, as the collector belongs to the Compact', why: 'It sits on the center’s network and holds its logs. It goes in the county’s store, case DSP.'},
           {label: 'Log each item only if it turns out to matter to the three questions', why: 'The log records what was received, before anyone reads it.'}]}
};

/* ---------- DFIR D5: separate stores (Day 17 10:00) ---------- */
const DP_STORES = [
  {label: 'One store per client: Oxlow waits until both counsels and Lucia decide', good: true},
  {label: 'File it in both: Oxlow’s center runs the same CAD, and they need to know today', why: 'Each client’s evidence stays in its own store. Whether Oxlow hears of the address is for Lucia and both counsels.'},
  {label: 'Merge both clients’ stores into a single Stillmark case, and decide what is shared later', why: 'Two clients, two stores. A merged folder mixes evidence nobody agreed to share.'},
  {label: 'Ring Oxlow’s supervisor and read her the address: they are our backup center', why: 'Our backup center is still another client. Counsel decides what leaves the county’s case.'}];

/* ---------- DFIR, Day 19 07:30: the chief asks the consultant ---------- */
const DP_SWITCH_DFIR = [
  {label: 'Whether it’s safe is what the firm found. When to switch back is Imogen’s call', good: true},
  {label: 'CAD is safe: Imogen can switch back now, and enter the paper next week', why: 'The firm says what it found. Whether the floor is ready is the supervisor’s checklist, and her decision.'},
  {label: 'Not until Petra decides the county office has been rebuilt', why: 'CAD runs without the county’s directory now. Keeping cards for that is a cost with no reason.'},
  {label: 'The report says what the floor must do: stay on cards until the case is finished', why: 'A report recommends, and this one doesn’t say that. The floor is Imogen’s.'}];

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const DP_DRILLS = {
  lagmgr: {
    id: 'lagmgr', title: 'The night handover: an attack on unit status?', budget: 2,
    intro: '<p>The night supervisor’s handover note to Imogen, 06:50. You are reviewing the record, not the person: is the unit-status lag an attack, or a failing queue or network link?</p>',
    artefact: '<pre class="art">Night supervisor to Imogen Hale · Day 16 06:50 (game data)\n' +
      'Unit status lagging since Sunday, worse overnight.\n' +
      '23 crew complaints. Started on the festival weekend:\n' +
      'could someone be messing with us? Rang county IT\n' +
      'on-call 03:02, no call back.</pre>' +
      '<p class="small">Statuses come in from the vehicles to the gateway at the county office, cross the building link to the queue, MQ-01, and go on to CAD. A queue keeps its own timings; a link keeps its own error counts.</p>',
    question: 'Is the lag an attack, or a failing queue or link?',
    sources: [
      {id: 'complaints', name: 'The crews’ complaints', qs: [
        {q: 'How many, and how angry?', kind: 'trap', res: ['23 complaints since Sunday, some of them very angry.', '(Complaints count people who noticed, not causes.)']}]},
      {id: 'festival', name: 'The calendar', qs: [
        {q: 'When did it start?', kind: 'trap', res: ['Sunday morning, on the town’s river festival weekend.', '(A busy weekend fits a fault and an attack alike.)']}]},
      {id: 'queue', name: 'MQ-01’s own metrics and log', qs: [
        {q: 'Where is the time lost, and who sends to the queue?', kind: 'focus', key: true,
         res: ['From Sunday 09:00, messages from MDG-01 reach MQ-01 late, in bursts: median 41 s, up to 90 s', 'CAD-01 takes each message within a second of its arrival', 'Volume normal, about 2,100 an hour by day. No producer but MDG-01']},
        {q: 'Every line of the queue’s log since Sunday', kind: 'broad', rows: 96400,
         wall: ['{t}  enq  MDG-01  unit E{i}  status ENR', '{t}  deq  CAD-01  unit M{i}  status AVL', '{t}  enq  MDG-01  unit L{i}  status ONS']}]},
      {id: 'link', name: 'The building link’s counters on DP-SW-01', qs: [
        {q: 'Is the link between the county office and the center clean?', kind: 'focus', key: true,
         res: ['Port 24, the building link: CRC errors 0 to 3 an hour until Sunday 08:00', '3,800 to 4,600 an hour since', 'Retransmits on the MDG-01 to MQ-01 sessions rise with them']}]}
    ],
    ai: {everything: {text: 'A sudden degradation of unit status starting on a holiday weekend, with 23 user reports, is consistent with deliberate interference. Recommend treating MQ-01 as compromised and rebuilding it.', wrong: true,
                      reveal: 'Tally counted complaints and read a calendar. It never asked where the time was lost, or what the link’s counters say.'},
         specific: {q: 'Where are the messages delayed?', text: 'Between MDG-01 and MQ-01. CAD takes each one within a second.'}},
    verdicts: [
      {label: 'Not an attack: a failing building link. The queue’s timings and the link’s errors agree', good: true, needs: ['queue', 'link'],
       needsWhy: 'the finding rests on two records: the queue’s own timings, and the link’s error counts. You read only one of them.',
       why: 'The time is lost on the link, and the link is failing.'},
      {label: 'An attack on the queue: it began on a holiday weekend, and the link’s errors are its trace', why: 'The weekend and the complaints fit any cause. The queue’s timings point at the link, and the link’s counters show it failing.'},
      {label: 'MQ-01 overloaded by the festival traffic: the queue’s timings agree, and it is not big enough', why: 'Volume is normal, and CAD takes each message within a second. The delay is before the queue.'}],
    reasons: [
      {label: 'MDG-01’s messages arrive late at MQ-01, and the link’s errors began on Sunday', good: true, why: 'Where the time goes, from the queue, and why, from the link.'},
      {label: 'Twenty-three complaints in two days: more than the link’s errors could cause', why: 'Complaints count people.'},
      {label: 'Attackers like holidays, and messages arrive late when someone interferes', why: 'A habit isn’t evidence about this weekend.'}],
    alts: [
      {label: 'A rogue sender flooding the queue', good: true, why: 'Ruled out: no producer but MDG-01, at normal volume.'},
      {label: 'CAD itself slow to take the messages', good: true, why: 'Ruled out: CAD-01 takes each one within a second of arrival.'},
      {label: 'The vehicles’ terminals all failing at once', why: 'Nothing points to it: the messages reach MDG-01 and are slowed after it.'},
      {label: 'Felix’s 03:24 restart causing it', why: 'Beside the point: the lag began on Sunday.'}],
    path: '<p>“Attack or failing link?” is decided by <b>the queue’s own timings</b> (where the time is lost) and <b>the link’s error counters</b> (whether it is failing). The calendar and the complaints fit either answer.</p>',
    response: ['Tell Imogen and Petra: a failing building link, not an attack', 'Petra’s team replaces the link’s optic at 14:00, with Imogen’s agreement on the time: unit statuses by radio for those minutes, CAD up throughout', 'Keep the queue’s and the switch’s records', 'Imogen talks it through with the night supervisor: complaints count people, not causes'],
    techs: [], acts: ['dplag']
  },
  lagdfir: {
    id: 'lagdfir', title: 'Question 2: is the lag an attack?', budget: 3,
    intro: '<p>The letter’s second question. Your copies of D-02, D-04 and D-05 are on the bench. This finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case DSP-01 · question 2 (game data)\n' +
      'D-02  flows, core switch and edge firewall\n' +
      'D-04  MQ-01 metrics and log\n' +
      'D-05  DP-SW-01 counters history\n' +
      'Note  23 crew complaints since Sunday</pre>' +
      '<p class="small">D-04 says where the time is lost; D-05 says whether the link is failing.</p>',
    question: 'Is the unit-status lag an attack?',
    sources: [
      {id: 'complaints', name: 'The crews’ complaints', qs: [
        {q: 'How many?', kind: 'trap', res: ['23 since Sunday.', '(A count of people, not of causes.)']}]},
      {id: 'festival', name: 'The calendar', qs: [
        {q: 'When did it begin?', kind: 'trap', res: ['Sunday, the festival weekend.', '(Timing alone decides nothing.)']}]},
      {id: 'queue', name: 'D-04: MQ-01’s metrics', qs: [
        {q: 'Where is the time lost, and who sends?', kind: 'focus', key: true,
         res: ['Arrival from MDG-01 late since Sunday 09:00: median 41 s, bursts to 90 s', 'CAD-01 takes each message within a second. Normal volume. MDG-01 the only producer']}]},
      {id: 'link', name: 'D-05: DP-SW-01 counters', qs: [
        {q: 'Is the building link failing?', kind: 'focus', key: true,
         res: ['Port 24: CRC errors 0 to 3 an hour until Sunday 08:00, then 3,800 to 4,600 an hour']}]},
      {id: 'flows', name: 'D-02: flows on the building link', qs: [
        {q: 'Anything new talking to MQ-01?', kind: 'focus', key: true,
         res: ['Retransmits on every MDG-01 to MQ-01 session since Sunday', 'No host but MDG-01 and CAD-01 talks to MQ-01']},
        {q: 'Every flow on the building link since Sunday', kind: 'broad', rows: 512000,
         wall: ['{t}  MDG-01 → MQ-01:5671  retrans {i}', '{t}  CO-PC-{n} → CO-FS-01:445', '{t}  CAD-01 → CO-DC-01:53']}]}
    ],
    verdicts: [
      {label: 'Not an attack: a failing link, as D-04 and D-05 show, with D-02 in support', good: true, needs: ['queue', 'link'],
       needsWhy: 'the finding rests on two sources: D-04 (where the time is lost) and D-05 (whether the link is failing). You read only one.',
       why: 'Each decides its half.'},
      {label: 'Yes: an attack timed for the festival weekend. D-02’s retransmits are its trace', why: 'The calendar and the complaints fit a fault too. The counters show the link failing.'},
      {label: 'Not known until MQ-01 has been taken apart and read in full, line by line', why: 'D-04 and D-05 answer the question. Imaging the queue would slow the floor for nothing.'}],
    reasons: [
      {label: 'D-04: the delay before the queue. D-05: the link’s errors from Sunday', good: true, why: 'Where, from the queue, and why, from the switch.'},
      {label: 'D-02: retransmits on the link mean someone is interfering with it', why: 'Retransmits are what a failing link causes.'},
      {label: 'Twenty-three complaints: the errors can’t be one cable', why: 'A count of people.'}],
    alts: [
      {label: 'A new host sending to MQ-01', good: true, why: 'Ruled out: D-02 shows only MDG-01 and CAD-01 talking to it.'},
      {label: 'CAD-01 slow to take messages', good: true, why: 'Ruled out: D-04 shows each taken within a second.'},
      {label: 'Sabotage of the optic', why: 'Nothing points to it, and question 2 has its answer.'},
      {label: 'The vehicles’ clocks being wrong', why: 'Beside the point: D-04 times arrival at the queue itself.'}],
    path: '<p>Two decisive sources: <b>D-04</b> (where the time is lost) and <b>D-05</b> (whether the link is failing). D-02 agrees. The calendar and the complaints decide nothing.</p>',
    response: ['Report to Lionel: a failing link, not an attack', 'Petra replaces the optic at 14:00, at the time Imogen agrees', 'Keep D-04 and D-05 sealed, work on copies', 'Note that no evidence was taken from a position'],
    techs: [], acts: ['dplag']
  },
  adminmgr: {
    id: 'adminmgr', title: 'The 03:20 admin sign-in', budget: 2,
    intro: '<p>The Compact’s alert from 03:21: “CAD admin sign-in outside hours”. Review the record: was it the vendor, county staff, or an intruder?</p>',
    artefact: '<pre class="art">Compact log platform · alert · Day 16 03:21 (game data)\n' +
      'CAD admin sign-in outside 07:00–19:00\n' +
      'Account  f.orrin-adm   Host  CAD-01\n' +
      'From     county office subnet (CO-IT-07)\n' +
      'Severity low · no night page</pre>' +
      '<p class="small">An account is a name, not a person. Who was behind it is in the vendor’s gateway, the county’s on-call ticket, and the owner’s own word on a number you already had.</p>',
    question: 'Who signed in at 03:20: the vendor, county staff, or an intruder?',
    sources: [
      {id: 'hour', name: 'The alert’s hour', qs: [
        {q: 'When was it?', kind: 'trap', res: ['03:20, outside business hours.', '(Plenty of real work happens at night.)']}]},
      {id: 'subnet', name: 'The address', qs: [
        {q: 'Where did it come from?', kind: 'trap', res: ['The county office subnet, not the center’s.', '(The county office is where county IT sits.)']}]},
      {id: 'gateway', name: 'DP-VPN’s log and the county’s on-call ticket', qs: [
        {q: 'Was the vendor connected, and what does the ticket say?', kind: 'focus', key: true,
         res: ['No vendor session at 03:20. The last sm-support session: Night 14, 02:10–02:40, from 198.51.100.183 in Stillmark’s range, no Stillmark ticket, blocked at 10:10 today', 'County ticket: the night supervisor rang the on-call number at 03:02 about the lag. Felix Orrin on call. Closed 03:45: “restarted CAD status receiver”']}]},
      {id: 'call', name: 'Imogen’s call to Felix', qs: [
        {q: 'What does the account’s owner say, on which number?', kind: 'focus', key: true,
         res: ['08:40, on the county staff directory number: “That was me. On call. Restarted the status receiver at 03:24.”', 'Imogen wrote and signed a note of the call at 08:50']}]}
    ],
    ai: {everything: {text: 'An administrator account authenticating at 03:20 from outside the dispatch center, during a period of service degradation, indicates credential compromise. Recommend disabling f.orrin-adm and treating CAD-01 as compromised.', wrong: true,
                      reveal: 'Tally joined an hour, an address and a lag. It never read the ticket, or asked the owner on a known number.'},
         specific: {q: 'Was there a vendor session at 03:20?', text: 'No. The last one on sm-support was on Night 14, at 02:10.'}},
    verdicts: [
      {label: 'County staff: Felix, on call from his desk, restarting the status receiver. Not an intruder', good: true, needs: ['gateway', 'call'],
       needsWhy: 'the answer rests on two records: the gateway and the ticket, and the owner’s word on a known number. You read only one.',
       why: 'The ticket, the gateway and Felix’s own word agree.'},
      {label: 'An intruder at Felix’s desk: an admin account at 03:20 from outside the center', why: 'The hour and the address fit on-call work. The ticket and the owner say what it was.'},
      {label: 'The vendor on call, not county staff: Stillmark’s technicians work through the night', why: 'The gateway shows no vendor session at 03:20.'}],
    reasons: [
      {label: 'No vendor session then, a ticket that names him, and his own word on a directory number', good: true, why: 'The records and the owner, each from its own source.'},
      {label: 'Admin accounts aren’t used at night, and his word on the phone can’t settle it', why: 'An on-call rota exists for nights.'},
      {label: 'The county office is outside the center, so a sign-in from there is from outside', why: 'The county office is where county IT works.'}],
    alts: [
      {label: 'Someone else at Felix’s desk', good: true, why: 'Not supported: the ticket and his own word put him there.'},
      {label: 'A vendor technician on the gateway', good: true, why: 'Ruled out: no vendor session at 03:20.'},
      {label: 'A password guessed from outside', why: 'Nothing points to it: the sign-in came from CO-IT-07.'},
      {label: 'Felix covering for a colleague', why: 'Beside the point: the records and his word agree.'}],
    path: '<p>“Who signed in?” is decided by <b>the gateway and the on-call ticket</b> and <b>the owner’s word on a known number</b>. An hour and an address fit either answer. T1078 (Valid Accounts) is the explanation this evidence ruled out.</p>',
    response: ['Close it with both sources cited', 'An action for Petra: the county’s on-call tells the floor supervisor whenever it works on CAD at night', 'The Night 14 session on sm-support is the firm’s question, already with it', 'Thank Imogen: the call on a directory number is what settled it'],
    techs: ['T1078'], acts: ['dpadmin']
  },
  admindfir: {
    id: 'admindfir', title: 'Question 1: the 03:20 sign-in', budget: 3,
    intro: '<p>The letter’s first question: who signed in to CAD-01 as f.orrin-adm at 03:20, and what was done? D-01, D-03 and D-08 are on the bench. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case DSP-01 · question 1 (game data)\n' +
      'D-01  CAD audit log, two exports, hashes match\n' +
      'D-03  DP-VPN log, its 48 hours\n' +
      'D-08  county on-call ticket, Imogen’s signed note\n' +
      'Alert 03:21 “admin sign-in outside hours”</pre>' +
      '<p class="small">D-03 says whether the vendor was connected; D-08 is the ticket and the owner’s word on a known number.</p>',
    question: 'Who signed in at 03:20, and what was done?',
    sources: [
      {id: 'hour', name: 'The alert’s hour', qs: [
        {q: 'When?', kind: 'trap', res: ['03:20.', '(Nights are when on-call staff work.)']}]},
      {id: 'subnet', name: 'The address', qs: [
        {q: 'From where?', kind: 'trap', res: ['The county office subnet.', '(Where county IT sits.)']}]},
      {id: 'gateway', name: 'D-03: the vendor gateway', qs: [
        {q: 'Any vendor session at 03:20?', kind: 'focus', key: true,
         res: ['None. The last sm-support session ended at 02:40 on Night 14']}]},
      {id: 'ticket', name: 'D-08: the ticket and the call', qs: [
        {q: 'What does the ticket say, and what did the owner say, on which number?', kind: 'focus', key: true,
         res: ['On-call ticket: the night supervisor’s call at 03:02, Felix Orrin on call, closed 03:45 “restarted CAD status receiver”', 'Imogen’s signed note: her 08:40 call on the county staff directory number, “That was me”']}]},
      {id: 'audit', name: 'D-01: CAD’s audit log', qs: [
        {q: 'What did the session do?', kind: 'focus', key: true,
         res: ['f.orrin-adm from CO-IT-07, 03:20 to 03:41', 'One action: the status receiver restarted at 03:24. No configuration change']},
        {q: 'Every line of the audit log since Saturday', kind: 'broad', rows: 23800,
         wall: ['{t}  signin  pos{i}  CAD-01', '{t}  incident  create  pos{i}', '{t}  unit  status  M{n}  AVL']}]}
    ],
    verdicts: [
      {label: 'Felix, on call, restarting the receiver: D-03 and D-08, with D-01 in support', good: true, needs: ['gateway', 'ticket'],
       needsWhy: 'the finding rests on two sources: D-03 (no vendor session) and D-08 (the ticket and the owner’s word). You read only one.',
       why: 'Each decides its part.'},
      {label: 'Likely an intruder: an admin account, at night, from outside the center, during a lag', why: 'Each of those fits on-call work. D-03 and D-08 say what it was.'},
      {label: 'Unknown until Felix has been interviewed formally by counsel, with the firm present', why: 'The owner’s word on a known number, the ticket and the audit already agree. Question 1 has its answer.'}],
    reasons: [
      {label: 'D-03: no vendor then. D-08: a ticket naming Felix, and his word on the directory number', good: true, why: 'The gateway, and the ticket with the owner’s word.'},
      {label: 'D-01: an admin account at 03:20 is unusual, and unusual means someone other than its owner', why: 'Unusual isn’t unknown.'},
      {label: 'The alert fired: the sign-in was a threat by definition', why: 'An alert is a reason to look.'}],
    alts: [
      {label: 'A vendor session at 03:20', good: true, why: 'Ruled out: D-03 shows none.'},
      {label: 'A change to CAD’s configuration in that session', good: true, why: 'Ruled out: D-01 shows one restart and no change.'},
      {label: 'A second person in the county office that night', why: 'Nothing points to it.'},
      {label: 'CAD-01’s clock being wrong', why: 'Beside the point: D-01 and D-08 agree on the times.'}],
    path: '<p>Two decisive sources: <b>D-03</b> (no vendor session) and <b>D-08</b> (the ticket and the owner’s word on a known number). D-01 agrees. T1078 (Valid Accounts) is the explanation this evidence ruled out.</p>',
    response: ['Report to Lionel: Felix, on call, one restart, no change', 'Recommend: the county’s on-call tells the floor supervisor whenever it works on CAD at night', 'Name the account and the desk, as the evidence does', 'Keep D-01’s two exports and their matching hashes together'],
    techs: ['T1078'], acts: ['dpadmin']
  },
  switchmgr: {
    id: 'switchmgr', title: 'The chief wants CAD back', budget: 2,
    intro: '<p>Friday 07:30. Chief Sayre: “It’s been up since midnight. Why are we still on cards?” What must be true before the floor goes back to CAD, and who decides?</p>',
    artefact: '<pre class="art">Chief Gideon Sayre to Imogen Hale · Day 19 07:15 (game data)\n' +
      'County IT says CAD has been up since 23:40.\n' +
      'My crews are waiting on paper. Switch back\n' +
      'now, please.</pre>' +
      '<p class="small">A system that is up is not yet a system the floor can trust. What the firm found on CAD is one half; the supervisor’s return checklist is the other.</p>',
    question: 'Can the floor go back to CAD now, and who decides?',
    sources: [
      {id: 'up', name: 'County IT’s message', qs: [
        {q: 'What does it say?', kind: 'trap', res: ['23:40: “CAD is up in local sign-in mode.”', '(Up isn’t proven. Nothing in the message says what was checked.)']}]},
      {id: 'pace', name: 'The cards’ pace', qs: [
        {q: 'How slow is the floor on cards?', kind: 'trap', res: ['Slower than CAD, every call.', '(A real cost, and a reason to return well, not to return blind.)']}]},
      {id: 'firm', name: 'The firm’s check of CAD', qs: [
        {q: 'What did the firm find on CAD-01 and CAD-02?', kind: 'focus', key: true,
         res: ['Complete at 02:00, after the vendor session: no file encrypted on either; no foreign process in a fresh capture of CAD-01’s memory at 23:50, or in its EDR since 21:00; nothing set to persist', 'The session’s record: the sign-in change only. No sign-in from a county office host since 14:00. The building link stays cut']}]},
      {id: 'list', name: 'Imogen’s return checklist', qs: [
        {q: 'What has to be done on the floor first?', kind: 'focus', key: true,
         res: ['A test incident end to end through CAD', 'Open incidents entered from the cards, each checked by a second telecommunicator', 'Unit statuses matched to the cards, and by radio until the link is back', 'The shift briefed, the cards left at the positions. Not started yet']}]}
    ],
    ai: {everything: {text: 'CAD has been operational for over seven hours with no reported errors. Recommend returning to CAD immediately to restore normal dispatch times.', wrong: true,
                      reveal: 'Tally counted hours of uptime. It never read the firm’s check, or the supervisor’s checklist.'},
         specific: {q: 'Has the return checklist started?', text: 'No. It needs the day shift: it starts at 08:10.'}},
    verdicts: [
      {label: 'The checklist first: the firm’s check is done. Imogen decides the time, not the chief', good: true, needs: ['firm', 'list'],
       needsWhy: 'the answer rests on two records: what the firm found on CAD, and the supervisor’s checklist. You read only one.',
       why: 'Both halves, and one decider.'},
      {label: 'Now: county IT says it has been up for seven hours without an error, and the chief has asked for it', why: 'Up isn’t ready. The checklist hasn’t started, and the switch is the supervisor’s decision.'},
      {label: 'Not until Petra has the county office clean and the building link back', why: 'CAD runs without the county’s directory now, and statuses come by radio. Waiting for that costs every caller time.'}],
    reasons: [
      {label: 'CAD came up clean, and the checklist’s test and open incidents come first', good: true, why: 'What is known about CAD, and what the floor still has to do.'},
      {label: 'Seven hours up without an error is the test: CAD is ready for the floor', why: 'Nobody was using it.'},
      {label: 'The chief commands the units, and the open incidents are his to order', why: 'He decides response policy, not the floor.'}],
    alts: [
      {label: 'CAD-01 still carrying the attack', good: true, why: 'Not supported: the firm’s check after the vendor session found nothing encrypted, foreign or set to persist.'},
      {label: 'Open incidents lost in the switch', good: true, why: 'Prevented by the checklist: each is entered and checked by a second person.'},
      {label: 'The county’s directory coming back and confusing CAD', why: 'Nothing points to it: CAD now signs in locally and the link is cut.'},
      {label: 'The chief and Imogen disagreeing', why: 'Beside the point: the decision is hers.'}],
    path: '<p>“Can the floor go back?” is decided by <b>the firm’s check of CAD</b> and <b>the supervisor’s return checklist</b>. Uptime and urgency fit either answer.</p>',
    response: ['Tell the chief: not yet, and why. The time is Imogen’s', 'The checklist from 08:10: a test incident, the open incidents entered and checked, statuses matched', 'Back on CAD at 09:10, Imogen’s decision. The closed incidents from the cards back-entered by 11:00, each checked', 'Unit statuses by radio until the county office is clean and the link returns'],
    techs: [], acts: ['dpreturn']
  },
  vendordfir: {
    id: 'vendordfir', title: 'Question 3: the vendor says it wasn’t them', budget: 3,
    intro: '<p>Stillmark’s support manager wrote at 13:30: no technician used its access on Sunday night. Our records show sessions from its range. How do you word the finding? It needs two sources.</p>',
    artefact: '<pre class="art">Case DSP-01 · question 3 (game data)\n' +
      'D-02  flows, edge firewall and core switch\n' +
      'D-03  DP-VPN log\n' +
      'D-09  Stillmark’s statement, 13:30\n' +
      'R-01  requested Day 16 (Tuesday) 10:30</pre>' +
      '<p class="small">D-02 says what connected from where; D-03 says which account signed in. D-09 is the vendor’s account of its own side.</p>',
    question: 'How should the finding about the vendor’s account read?',
    sources: [
      {id: 'certain', name: 'The statement’s tone', qs: [
        {q: 'How sure does Stillmark sound?', kind: 'trap', res: ['“No Stillmark technician accessed your system.” Firm, signed, on letterhead.', '(Certainty is a tone, not a record.)']}]},
      {id: 'size', name: 'Stillmark’s size', qs: [
        {q: 'How big is the vendor?', kind: 'trap', res: ['It supports CAD at many centers.', '(Size makes a mistake neither likelier nor less likely.)']}]},
      {id: 'flows', name: 'D-02: flows', qs: [
        {q: 'What connected, from where, and to what?', kind: 'focus', key: true,
         res: ['198.51.100.183, inside Stillmark’s documented range, to DP-VPN 02:09–02:41 on Night 14', 'From the session’s address, small connections to CAD-01’s remote-support port, 02:12–02:38']}]},
      {id: 'gateway', name: 'D-03: DP-VPN', qs: [
        {q: 'Which account signed in, and how?', kind: 'focus', key: true,
         res: ['sm-support, password only, 02:10. Out at 02:40', 'No Stillmark ticket for the center on record']}]},
      {id: 'audit', name: 'D-01: CAD’s audit log', qs: [
        {q: 'Did anyone sign in to CAD in that window?', kind: 'focus', key: true,
         res: ['No CAD sign-in 02:10–02:40', 'CAD’s audit log records sign-ins to CAD, not connections to its support port']}]}
    ],
    verdicts: [
      {label: 'Our records show sm-support from Stillmark’s range. Who used it is unknown', good: true, needs: ['flows', 'gateway'],
       needsWhy: 'the finding rests on two sources: D-02 (what connected from where) and D-03 (which account signed in). You read only one.',
       why: 'What our records show, what the vendor says, and an honest unknown with the request dated.'},
      {label: 'Stillmark’s statement is false: our records show its technicians were in', why: 'The flows show an address and an account, not a technician. Write what each record shows.'},
      {label: 'An intruder from outside Stillmark’s range used the vendor’s account', why: 'Possible, not shown. Write it as unknown, with the request for Stillmark’s records.'},
      {label: 'No access occurred: the vendor says who used it, and it says nobody did', why: 'Our own gateway shows the account signed in. That is in the record whatever the vendor says.'}],
    reasons: [
      {label: 'D-02, D-03: the account and the range. D-09: Stillmark’s word. R-01 is open', good: true, why: 'Each record for what it shows, the vendor’s word as the vendor’s.'},
      {label: 'D-09 is signed by a manager, and it outweighs what D-02 and D-03 show', why: 'A signature is not a record of the night.'},
      {label: 'D-01 shows no sign-in: nothing happened that night, and R-01 is open only for form', why: 'The audit doesn’t record support-port connections.'}],
    alts: [
      {label: 'The flows being misread', good: true, why: 'Not supported: D-02 and D-03 agree on the times and the account.'},
      {label: 'A Stillmark ticket for that night', good: true, why: 'Not supported: none on record. R-01 asks for its own.'},
      {label: 'The session changing CAD’s configuration', why: 'Unknown: D-01 doesn’t record the support port, and D-07 shows only that its service took the connections.'},
      {label: 'Stillmark’s size making it careful', why: 'Beside the point.'}],
    path: '<p>Two decisive sources: <b>D-02</b> (the address and the connections) and <b>D-03</b> (the account). D-09 is the vendor’s account, written as such. T1133 (External Remote Services) is the question this evidence can’t yet answer: whether someone outside Stillmark’s support used its remote access.</p>',
    response: ['Write it as it reads: our records, Stillmark’s statement, and who used it as unknown', 'R-01 stays open and dated: Day 16 (Tuesday) 10:30', 'sm-support stays blocked, its logs kept. Vendor support on demand by ticket', 'Recommend MFA and on-demand access in Stillmark’s contract: Celia’s decision'],
    techs: ['T1133'], acts: ['dpvendor']
  }
};

/* ---------- DFIR report 1: DSP-01, for counsel (Day 16 15:30) ---------- */
const DP_REPORT_1 = {
  title: 'DSP-01: the sign-in, the lag and the vendor’s account', audience: 'Lionel Ashdown, county attorney',
  intro: '<p>Eight findings for Lionel, covering his three questions, each from the evidence in the custody log.</p>',
  claims: [
    {id: 'felix', text: 'The 03:20 sign-in as f.orrin-adm was Felix Orrin, the county’s on-call CAD administrator, at his desk PC.', truth: 'confirmed',
     evidence: ['D-08: the on-call ticket names him; the county office’s door log has his badge in at 03:15; Imogen’s note of his own word on the staff directory number', 'D-03: no vendor session at 03:20', 'D-01: the sign-in from CO-IT-07, his desk PC'], why: 'The ticket, the owner’s word and the logs agree.'},
    {id: 'restart', text: 'That session restarted CAD’s status receiver at 03:24 and changed nothing else.', truth: 'confirmed',
     evidence: ['D-01: one action, the restart; no configuration change', 'D-08: the ticket records the same restart'], why: 'The audit log records every admin action. D-01 is CAD-02’s replicated copy, so a gap on CAD-01 would copy too: the ticket agrees.'},
    {id: 'lag', text: 'The unit-status lag came from errors on the building link, not from an attack.', truth: 'confirmed',
     evidence: ['D-04: the delay before the queue; MDG-01 the only producer', 'D-05: CRC errors from Sunday 08:00'], why: 'Where the time went, and why.'},
    {id: 'session', text: 'sm-support signed in from an address in Stillmark’s documented range, 02:10 to 02:40 on Night 14.', truth: 'confirmed',
     evidence: ['D-02: 198.51.100.183 to DP-VPN', 'D-03: sm-support, password only, 02:10 to 02:40'], why: 'The flows and the gateway agree.'},
    {id: 'network', text: 'That session came through Stillmark’s own support network.', truth: 'likely',
     evidence: ['D-02: the address is inside the range Stillmark documents for its support', 'D-09: Stillmark says no technician used its access'], why: 'The address points to it; an address in a range isn’t proof of who was behind it.'},
    {id: 'who', text: 'Who used sm-support that night.', truth: 'unknown',
     evidence: ['D-09: Stillmark says none of its technicians', 'R-01: Stillmark’s own access records, requested on Day 16 (Tuesday) 10:30'], why: 'Nothing in scope can say. The request is dated.'},
    {id: 'what', text: 'What that session did on CAD-01.', truth: 'unknown',
     evidence: ['D-01: no CAD sign-in in the window; the audit doesn’t record support-port connections', 'D-02: small connections to the support port, 02:12 to 02:38', 'D-07: CAD-01’s EDR: the support service took those connections; no new process, file or account'], why: 'The EDR shows what ran and what changed, not what the support service showed or was asked. Nothing in scope records that.'},
    {id: 'time', text: 'During the lag, answer-to-dispatch ran at a median of 65 s, against 64 s the week before.', truth: 'confirmed',
     evidence: ['D-10: CAD’s answer-to-dispatch report, Days 7 to 16, from CAD-02’s copy'], why: 'Measured, from CAD’s own report.'}]
};

/* ---------- DFIR report 2 (the boss, stage 3): DSP-02, encrypted or cut off; built at run time for the measured numbers ---------- */
function dpReport2() {
  const m = dpCardsMedian();
  return {
    title: 'DSP-02: CAD on Thursday', audience: 'Lionel Ashdown, county attorney',
    intro: '<p>Seven findings on the second letter’s three questions, from the evidence logged since 14:20.</p>',
    claims: [
      {id: 'enc', text: 'No file on CAD-01 or CAD-02 was encrypted between 13:00 and 15:00.', truth: 'confirmed',
       evidence: ['D-13: 13:00 to 15:00, no file renamed and no burst of writes on CAD-01, CAD-02, MQ-01 or RMS-01', 'D-12: CAD-02’s 14:50 snapshot: its database files open and read normally', 'D-14: CAD-01’s database service ran without error'], why: 'Each server’s own file events, and its data still opening, over the window they cover.'},
      {id: 'cut', text: 'CAD failed at the positions because it lost the county’s directory and name service at 14:05.', truth: 'confirmed',
       evidence: ['D-14: from 14:05 every sign-in check and name look-up to CO-DC-01 timed out', 'D-15: CO-DC-01 stopped answering at 14:05'], why: 'CAD’s own log and the flows agree.'},
      {id: 'refused', text: 'The encrypting county PC’s connection to CAD-01 was refused.', truth: 'confirmed',
       evidence: ['D-15: CO-PC-31 to CAD-01’s file-sharing port at 14:03, refused', 'CAD-01 shares nothing'], why: 'The flows record it.'},
      {id: 'clean', text: 'Nothing from the attack is on CAD-01.', truth: 'likely',
       evidence: ['D-11: nothing foreign in the memory capture so far', 'D-13: no file events from the attack'], why: 'Everything read points to it; the memory analysis finishes overnight.'},
      {id: 'link', text: 'Night 14’s session on sm-support is linked to Thursday’s attack.', truth: 'unknown',
       evidence: ['DSP-01: who used sm-support is unknown', 'Nothing in scope connects the two'], why: 'Nothing in scope can say.'},
      {id: 'time', text: 'On cards, 14:07 to 18:00, answer-to-dispatch ran at a median of ' + m + ' s, against 64 s on CAD the week before; 38 calls were answered, 4 at Oxlow, and 2 hang-ups were each called back.', truth: 'confirmed',
       evidence: ['D-16: the phone system’s answer, rollover and call-back times, the radio logger’s dispatch times, and Oxlow’s answer times for the 4 rolled calls', 'D-10: CAD’s report for the week before'], why: 'Measured, from the phones, the radio logger and Oxlow’s own times.'},
      {id: 'harm', text: 'Whether any patient or firefighter came to harm because dispatch was slower.', truth: 'unknown',
       evidence: ['D-16: timings only', 'Each call is reviewed by the chief’s office and medical direction'], why: 'Timing records can’t show it.'}]
  };
}

/* ---------- Dojos (original puzzles; concepts only, no tool syntax) ---------- */
const DP_DOJO_MGR = [
  {q: 'Your main system could be down for hours. What keeps the service going?',
   opts: ['A practised manual procedure, a named person who calls it, and a way back',
          'A vendor’s promise to restore within an hour, written into the contract',
          'A second identical system on the same network, with a person on call to switch'], good: 0,
   explain: 'A practised procedure works whatever the cause. A promise doesn’t answer a call, and a twin on the same network fails with the first.'},
  {q: 'The system is “back up”. When does the service switch back?',
   opts: ['When the floor’s lead says so, after a test, with open work carried over',
          'As soon as IT says it is up and has run its own test',
          'When the most senior person asks, with the open work entered later'], good: 0,
   explain: 'Up isn’t ready. A test end to end, the open work carried over, and the operations lead decides.'},
  {q: 'After an outage, what do you report as its impact?',
   opts: ['The service’s own measure, as measured: the time from answer to dispatch',
          'System uptime in percent, measured the way the dashboards show it',
          'The tickets raised, and the time it took to clear them'], good: 0,
   explain: 'Uptime and tickets describe the systems. The time from answer to dispatch is what callers felt, and it is measured.'}];
const DP_DOJO_DFIR = [
  {q: 'Updates arrive late in bursts. Attack, or a failing link?',
   opts: ['Where time is lost, from the queue’s timings, and the link’s error counts',
          'How many people complained, and the time they spent waiting on the phone to do it',
          'Whether it began on a holiday, when attackers like to work'], good: 0,
   explain: 'Timings say where; counters say why. Complaints and calendars fit any cause.'},
  {q: 'Your flows show sessions from a vendor’s range. The vendor says none of its staff connected. What do you write?',
   opts: ['Your records, the vendor’s word, and who it was as unknown: the request dated',
          'What the flows show: the vendor’s statement is false, and its staff were in',
          'That nothing happened: the vendor has confirmed who it was, in writing'], good: 0,
   explain: 'Each source for what it shows. An address and an account aren’t a person, and a statement isn’t a record.'},
  {q: 'A server stopped serving when a neighbouring network was hit. Encrypted, or cut off?',
   opts: ['Its own records: file events, whether its data opens, what it can’t reach',
          'What the ransom note lists: its systems list says everything was encrypted',
          'How long it was down for, since a longer outage means the files were encrypted'], good: 0,
   explain: 'A server’s own file events, and whether its data still opens, say whether it was encrypted over the window they cover; its own log says what it lost.'}];

/* ---------- The Dispatch Board (original; Delphine Okoro; three rounds per track) ---------- */
const DP_BOARD_SPECS_MGR = () => {
  const m = dpCardsMedian();
  return [
    {title: 'Round 1: were response times hurt?', who: 'Delphine Okoro',
     ask: '“Were response times hurt on Thursday?”',
     resp: [{label: 'On cards: ' + m + ' s against 64 s, as measured, every call answered or called back', good: true},
            {label: 'No impact to report: every call was answered, and answering is what was measured', why: 'Answering isn’t dispatching. The time from answer to dispatch rose, and it was measured.'},
            {label: 'Response times doubled to 128 seconds while the floor was on cards', why: 'That isn’t what was measured. Give the numbers the phones and the radio logger recorded.'}]},
    {title: 'Round 2: who calls it next time?', who: 'Delphine Okoro',
     ask: '“Should the Board approve the switch to cards next time?”',
     resp: [{label: 'The supervisor decides on the floor in real time. The Board sets the plan and its drills', good: true},
            {label: 'Yes: the Board approves it by phone first, so the decision is made at the top', why: 'Callers wait while the Board is rung. The supervisor decides on the floor.'},
            {label: 'The IR manager calls it next time, as the person who sees the whole incident', why: 'You advise. The floor is the supervisor’s.'}]},
    {title: 'Round 3: what stops it again?', who: 'Delphine Okoro',
     ask: '“What stops Thursday happening again?”',
     resp: [{label: 'Its own segment and sign-in, county alerts to the floor, cards drilled each quarter', good: true},
            {label: 'A new antivirus product on every county PC, and a training video for the staff', why: 'CAD wasn’t encrypted. It leaned on the county’s directory. A product fixes neither.'},
            {label: 'Nothing for us to do: the county office was the problem, not the center', why: 'The county’s outage reached the floor because the networks were one. That is the center’s risk.'}]}];
};
const DP_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: was CAD hacked?', who: 'Delphine Okoro',
   ask: '“Was CAD hacked on Thursday?”',
   resp: [{label: 'Not encrypted: cut off when the county’s directory went down. One question is open', good: true},
          {label: 'Yes: the positions froze when the county’s directory was encrypted', why: 'Its own file events show nothing encrypted. It lost the county’s directory.'},
          {label: 'No: nothing touched CAD, and no question is open', why: 'Who used the vendor’s account on Night 14 is unknown. Say what is open.'}]},
  {title: 'Round 2: who is to blame?', who: 'Delphine Okoro',
   ask: '“Who is to blame: the vendor, or our CAD administrator?”',
   resp: [{label: 'Nobody, in either report: the 03:20 sign-in was on-call work', good: true},
          {label: 'Stillmark: its account was used on Sunday night, so Thursday followed', why: 'Who used the account is unknown, and nothing links it to Thursday.'},
          {label: 'Felix Orrin: his 03:20 sign-in on call is where it started', why: 'His sign-in was on-call work, and the reports say so.'}]},
  {title: 'Round 3: the numbers', who: 'Delphine Okoro',
   ask: '“Can the Board publish Thursday’s response numbers?”',
   resp: [{label: 'The director decides with counsel: the Board may ask', good: true},
          {label: 'Yes: the firm will publish what it measured on Monday', why: 'The firm reports to Lionel. What is published is Celia’s decision.'},
          {label: 'Never: response times stay confidential, and Celia can’t change that', why: 'An absolute nobody asked for. Celia decides, with counsel.'}]}];

/* ---------- The boss: ransomware at the county office, CAD failing mid-shift (game-original), one seat per track ---------- */
function dpMgrBossStages() {
  return {
    s1: {title: 'Stage 1 (14:12): coordinate',
      clues: ['13:52: a house fire on the east side, dispatched on CAD at 13:53. 13:59: a working fire, the incident commander on scene.', '14:02: ransomware at the county office. 14:05: CAD sign-ins and address look-ups hang, two positions freeze. 14:06: the incident commander asks for a second alarm.', '14:07: Imogen calls cards. 14:08: the second alarm dispatched from the run card. 14:10: overflow 911 calls roll to Oxlow.'],
      ask: 'You are the IR manager. Who does what, first?',
      resp: [{label: 'Floor on cards, Imogen’s call already. The link cut when she agrees. Firm and chief told', good: true},
             {label: 'Shut CAD-01 down now, before the ransomware can reach it from the county office', why: 'It is the way back, its memory is evidence, and nothing yet shows it encrypted. The floor is already on cards.'},
             {label: 'Keep the floor on CAD for now, and wait for county IT to say what is wrong with it first', why: 'Positions are frozen during a working fire. The floor went to cards at 14:07, on Imogen’s call.'},
             {label: 'You tell the telecommunicators to go to cards: Imogen is busy with the fire', why: 'Imogen called it at 14:07. The floor is hers. You coordinate everyone else.'},
             {label: 'Roll every 911 call to Oxlow and send the floor home until CAD is fixed', why: 'Oxlow has four positions and its own area’s calls. Callers would wait. The floor works on cards.'}]},
    s2: {title: 'Stage 2 (16:30): the chief, Celia and the county administrator',
      clues: ['Measured on the floor so far: every 911 call since 14:07 answered, 4 at Oxlow, one hang-up called back. Answer-to-dispatch on cards, median ' + dpCardsMedian() + ' s, against 64 s on CAD last week.', '16:10, the firm, through Lionel: no file on CAD-01 or CAD-02 encrypted from 13:00 to 15:00, and their data opens. CAD cut off since 14:05, when the county’s directory server stopped answering.', 'Not known: how it got into the county office, when CAD returns, whether Sunday night’s session is linked.'],
      ask: 'What do you give them?',
      resp: [{label: 'Measured numbers, every call handled, what’s open, 18:30 next, no promises', good: true},
             {label: 'Tell them CAD will be back by six o’clock, so the chief can plan the evening', why: 'A promise nobody can keep yet. The next update at 18:30, with what is known.'},
             {label: 'Tell them the median has doubled, to show how serious it is', why: 'That isn’t what was measured. Give the measured numbers.'},
             {label: 'Nothing until the firm’s report is complete: Celia wants it right first', why: 'Silence leaves the chief planning blind. Say what is known, and when more comes.'}]},
    s3: {title: 'Stage 3 (17:30): the next 24 hours',
      clues: ['The floor stays on cards. CAD’s way back runs overnight: county IT, with Stillmark’s support on a one-time account. sm-support stays blocked.', 'The Compact’s people have been at it since the morning. Night 18 is in the week-3 rota.', 'The floor’s staffing is Imogen’s, county IT’s is Petra’s. Yours is the Compact’s.'],
      ask: 'How does the Compact cover the next 24 hours?',
      resp: DP_COVER.map(o => ({label: o.label, good: !!o.good, why: o.why}))}
  };
}
function dpDfirBossStages() {
  return {
    s1: {title: 'Stage 1 (14:30): preserve without slowing the floor',
      clues: ['The floor has been on cards since 14:07. CAD-01 is running, cut off from the county’s directory.', 'Lionel extended the engagement at 14:20: is CAD encrypted, or only cut off? Did the attack reach the center’s systems? The measured impact since 14:07.', 'Felix is in the server room. Imogen is on the floor.'],
      ask: 'What do you do first?',
      resp: [{label: 'Imogen agrees, then CAD-01’s memory as it runs, CAD-02’s snapshot, copy the logs', good: true},
             {label: 'Shut CAD-01 down and image its disk: an image is the copy that lasts', why: 'It is the way back, and its memory goes with the power. Capture memory with it running.'},
             {label: 'Restart CAD-01 to see whether it recovers by itself, then collect from it after that', why: 'A restart clears memory and could bring the failure back to the positions. Preserve first.'},
             {label: 'Wait until the fire is out and Imogen decides the floor can spare it', why: 'Nothing is gained by waiting, and the attack may still move. Collecting from CAD-01 doesn’t touch a position now.'},
             {label: 'Collect from CO-DC-01 ourselves: it is where the trouble started', why: 'The county office’s systems are county IT’s to preserve, and outside the letter.'}]},
    s2: {title: 'Stage 2 (16:00): encrypted, or cut off?',
      clues: ['D-13: 13:00 to 15:00, no file renamed and no burst of writes on CAD-01, CAD-02, MQ-01 or RMS-01. D-12: CAD-02’s 14:50 snapshot opens normally.', 'D-14: from 14:05, every sign-in check and name look-up CAD-01 sent to CO-DC-01 timed out.', 'D-15: CO-PC-31 tried CAD-01’s file-sharing port at 14:03 and was refused. County IT: CO-DC-01 stopped answering at 14:05.'],
      ask: 'From the evidence, what happened to CAD?',
      resp: [{label: 'Cut off, not encrypted: CAD had already lost the county’s directory at 14:05', good: true},
             {label: 'Encrypted: the positions froze, and the ransom note says all systems', why: 'CAD’s own file events show nothing renamed. The note is the attacker’s claim.'},
             {label: 'Unknown until CAD-01 is cut off and imaged offline, then read in full', why: 'The evidence answers it now, and imaging offline would slow CAD’s return.'},
             {label: 'Only CO-DC-01, the county’s directory, matters: CAD is the county’s problem', why: 'Beside the question. The letter asks about CAD.'}]}
  };
}
// The floor's measured median on cards, Thursday 14:07 to 18:00 (game): 87 s, measured on Thursday by the phones and the
// radio logger. It is not taken from Wednesday's shadow drill, whose times are drill times, not dispatch times. On the
// manager seat only, +6 s for each false start in the first coordination stage (game: coordination at 14:12 cost the floor
// time in its first hour). The DFIR seat's first stage comes at 14:30, after the floor settled on cards: it moves nothing.
function dpCardsMedian() { const b = G && G.cr && G.cr.dp && G.cr.dp.boss; return 87 + (G.trackId === 'manager' && b && b.w1 ? 6 * b.w1 : 0); }

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  dplag: {name: 'A lag: attack, or a failing link?', desc: 'Find where the time is lost from the queue’s own timings, and whether the link is failing from its error counters. Complaints and the calendar fit any cause.'},
  dpadmin: {name: 'An unexplained admin sign-in', desc: 'Read the gateway and the on-call ticket, and ask the account’s owner on a number you already had. An hour and an address fit on-call work and an intruder alike.'},
  dpvendor: {name: 'Vendor access: block first, word it honestly', desc: 'When a vendor’s account shows a session nobody can explain, block it at once, clearing nothing. Then write what your records show, what the vendor says, and who used it as unknown, with the request dated. Make vendor access on demand, from its range, with MFA. Never re-enable the blocked account for a session: a one-time account with MFA, watched, and the system checked again afterwards.'},
  dpcards: {name: 'Cards: the supervisor calls it', desc: 'When CAD can’t serve a position, that position goes to the cards, on the supervisor’s call. On a medical call the ambulance goes from the run card at once, and the same protocol’s instructions follow on paper. Drill it with a shadow position: a trainee works live calls on paper while the live position dispatches them on CAD. A shadow time is a drill time, not a dispatch time.'},
  dpreturn: {name: 'Back to CAD with a checklist', desc: 'A system that is up isn’t a system the floor can trust. A test incident end to end, the open incidents entered and checked by a second person, statuses matched, the shift briefed. The supervisor decides the time.'},
  dpbackup: {name: 'A backup center that can take the calls', desc: 'Give the backup center what a call needs: your map and response areas, a line back to your floor, named contacts, and a tested rollover. Never your system’s logins.'},
  dpstandby: {name: 'Collect without slowing the floor', desc: 'Take evidence from what doesn’t serve the positions: a standby’s copy, a gateway, a queue’s metrics, flow records. Never take a live dispatch system down for a copy.'},
  dpcutoff: {name: 'Encrypted, or cut off?', desc: 'A server’s own file events, and whether its data still opens, say whether it was encrypted, over the window they cover. Its own service log says what it could no longer reach.'},
  dpmeasure: {name: 'Measure what callers feel', desc: 'Report an outage’s impact as the service’s own measure, measured: here, the time from call answer to dispatch, and the calls answered or called back. Uptime describes the system, not the callers.'},
  dpshifts: {name: 'A 24-hour incident with rest', desc: 'Twelve-hour shifts with written handovers, the night from the rota, outside help for the specialist work, and nobody on the day after their night.'},
  dpaar: {name: 'An AAR in response time', desc: 'Blameless: what made the county’s outage reach the floor, and what kept the floor working. Each action with one owner and a date. The impact as measured.'},
  dpsegment: {name: 'Keep emergency communications apart', desc: 'Give the center its own network segment and its own sign-in, so an outage on the general network doesn’t reach the floor. The system owner decides, knowing the cost.'},
  dpstatus: {name: 'Read the firm’s status report', desc: 'A retained firm reports what it found, what it didn’t, and anything it saw outside its questions, which goes to counsel first.'}
});
Object.assign(FACTS, {
  dpcisa: {name: 'CISA on 911 centers: manual mode and separation', desc: 'CISA’s 911 Cybersecurity Best Practices Package (July 2023) includes advice from public safety colleagues (“First 48”: What to Expect When a Cyber Incident Occurs). It says: “Regularly train all staff to practice good cyber hygiene and frequently exercise operating under manual mode to help prevent, discover, and respond to cyber incidents better.” And: “Consider network segmentation as a physical and virtual architectural approach as emergency communications should operate separately from the municipality administrative network.” It also recommends deploying “the cyber incident response plan as soon as they observe signs of compromise.” Which of these the center adopts, and how, is the 911 authority’s decision.', src: 'CISA, 911 Cybersecurity Best Practices Package (July 2023)'},
  dpng911: {name: 'NG911, in 911.gov’s words', desc: 'The National 911 Program’s site says: “Next Generation 911 (commonly referred to as NG911) is a digital, internet protocol (IP)-based system”. The program is housed within the National Highway Traffic Safety Administration at the U.S. Department of Transportation. The game says nothing about the center’s own phone system beyond that it depends neither on CAD nor on the building link (game).', src: '911.gov, Next Generation 911; About'},
  dpfcc: {name: '911 outages: the FCC’s page, in its own words', desc: 'The FCC’s page on 911 outages reporting says that under 47 CFR § 4.9, “communications providers, as defined in § 4.3, must swiftly notify the Commission and all applicable designated public safety officials regarding reportable network outages”, and that “providers quickly notify PSAPs with pertinent information about 911 outages that potentially impact the PSAP.” Whether any rule applies to the center’s own CAD failure, and what the center or the county reports to anyone, is for the 911 authority and counsel. The game says neither.', src: 'FCC, 911 outages reporting page'}
});
TECH['T1133'] = {name: 'External Remote Services', tactic: ['Persistence', 'Initial Access'], desc: 'Using remote services that face the internet, such as a VPN, to get in or come back. Here it is the open question: whether someone outside the vendor’s support used its always-on remote access on Sunday night.'};
GAME_NOTES.push(
  'Fire & EMS Dispatch, its positions, staffing and call counts, Stillmark and Stillmark CAD, every host (CAD-01, CAD-02, MQ-01, MDG-01, DP-VPN, DP-LOG-01, CO-DC-01 …), the building link, the lag, the sign-ins, the vendor-account session, the ransomware, the house fire on the east side, Oxlow Township’s center as the backup and every log line are invented. The 911 phones and the radio depending neither on CAD nor on the building link, CAD’s local sign-in mode and CAD-02’s copy of CAD-01 are game models. No real CAD or radio vendor and no real dispatch center’s incident appear. (game)',
  'The Dispatch annex to the Compact’s plan, the week-3 rota, the cards drill and its timings, the 24-hour plan and its forecasts, the AAR, the answer-to-dispatch numbers (64 s on CAD; the Wednesday shadow drill’s 101 s and 84 s to a paper run-card pick, drill times; 87 s on cards on Thursday, +6 s per false start in the manager’s first stage), the hang-ups and call-backs, the one-time vendor account, the Relay Badge’s effects and every score are invented. The game never says what any rule requires of the center: the 911 authority decides reporting, with counsel. (game)'
);
