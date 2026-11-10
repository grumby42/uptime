/* ============================================================
   UPTIME · editions/crossroads/airport-data.js
   Crossroads district 5: the Regional Airport (both tracks), its business and
   office IT only: billing, hangar leases, tenant records, email and the
   vendor's remote support. Art, map, people, the manager track's tables
   (tenant coordination, the week-4 rota, the tabletop with the airport
   manager, the Airport annex's retainer test, the weekend plan, the AAR), the
   DFIR track's tables (the scoping letter, what the firm may take, evidence
   intake, separate stores per owner), three drills per track, two reports, the
   directive, the Airport Board, the two dojos, the boss's stages for each
   seat, and Field Manual text.
   One decider per decision (game): the airport manager on duty decides airport
   operations (Joanna Ferreday on weekdays; Callum Breck, the weekend duty
   manager, on Saturday and Sunday): the terminal, how its front desk works when
   systems are down and when it goes back, and what the airport's network lets
   connect. Odette Varga owns Plinthwise, its data and its contract. Ansel
   Whitcombe, counsel to the Airport Authority, engages the firm, decides who
   receives its reports and what tenants are told about their records. Dario
   Fenn runs the office network and its servers. Each tenant decides about its
   own systems. The Airport Board decides any payment, with counsel and the
   insurer. Pilots decide about their own flights.
   Nothing here depicts airport physical security, access control, fuel, Wi-Fi,
   aircraft or any airfield system: access control and fuelling are separate
   systems, not affected and not part of this work (game). Attacker actions are
   shown only as what a defender sees afterwards. The game names no real
   airport, FBO, airline or vendor and retells no real incident. CISA's, the
   FAA's and ACRP's lines are quoted only in the Field Manual, in their own
   words. The Regional Airport Authority, Plinthwise, Kettlebrook Flight School,
   Brackenlow Aero Services, Corrowind Aviation, every host, person, count, time
   and the attack are invented (game). Domains: RFC 2606; addresses: RFC 5737.
   Real facts: CREDITS.md, section "Crossroads". Timeline: scratchpad
   crossroads-timeline.md (Regional Airport section); every line here is
   checked against it.
   ============================================================ */
'use strict';

/* ---------- Art ---------- */
Object.assign(PAL, {
  apDesk: ['#1b2233', '#6e5a2a', '#c0a05a', '#f7ecd2'],
  apDeskOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  apBill: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  apBillOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  apPatch: ['#1b2233', '#6e2a2a', '#c05a5a', '#f2d7d7'],
  apPatchOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  apTenantPc: ['#1b2233', '#3a3a3a', '#8a8a8a', '#d7dbe4'],
  apMgr: ['#1b2233', '#4a3a6e', '#8a7ac0', '#e0d8f7'],
  apOffice: ['#1b2233', '#1f4a6e', '#5f9fd6', '#dbeaf7'],
  apRack: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  ferreday: ['#1a1a2e', '#3b2418', '#c98a54', '#2a5a8a'],
  breck: ['#1a1a2e', '#c0a040', '#f0c8a0', '#4a6e2a'],
  varga: ['#1a1a2e', '#141414', '#e0b090', '#7a3d8a'],
  whitcombe: ['#1a1a2e', '#8c8c8c', '#f2c7a0', '#2a2a2a'],
  fenn: ['#1a1a2e', '#5b3a26', '#a8703f', '#3a8a5a'],
  castell: ['#1a1a2e', '#2b1d16', '#c98a54', '#6e5a2a'],
  teller: ['#1a1a2e', '#6e6e6e', '#f0c8a0', '#8a1f1f'],
  darrow: ['#1a1a2e', '#141414', '#6e4a2c', '#2f5a5a'],
  adair: ['#1a1a2e', '#d7dbe4', '#f0c8a0', '#3a3a5a'],
  quist: ['#1a1a2e', '#3a1d10', '#c98a54', '#5a2a6e'],
  moreau: ['#1a1a2e', '#2b1d16', '#e0b090', '#2a4a7a']
});
Object.assign(TILES, {
  'Ǎ': {spr: 'counter', pal: 'apDesk', solid: true, under: ','},   // the terminal's front desk (two PCs, one shared login until Thursday)
  'Ǐ': {spr: 'K', pal: 'apBill', solid: true},                      // AP-BIL-01, Plinthwise's server, in the business office
  'Ǒ': {spr: 'pc', pal: 'apTenantPc', solid: true, under: ','},     // a tenant's own PC (the tenant's: shown, never touched)
  'Ǔ': {spr: 'K', pal: 'apPatch', solid: true},                     // the tenant patch panel in the IT closet
  'Ǖ': {spr: 'counter', pal: 'apMgr', solid: true, under: ','},     // the airport manager's desk
  'Ǘ': {spr: 'pc', pal: 'apOffice', solid: true, under: ','},       // the business office's PCs
  'Ǚ': {spr: 'K', pal: 'apRack', solid: true}                       // the IT closet's rack: AP-SW-01, AP-DC-01, AP-FS-01
});

/* ---------- Map: the terminal building's offices and the Airport Board room ---------- */
// North door from the town square (the square's south edge, beside the Library's). North: the airport manager's
// office (west), the terminal lobby with the front desk and the FBO's counter, the business office (east). Middle: the
// corridor; west door: the Airport Board room. South: the flight school's office, the maintenance shop's office, the
// IT closet, the training room (dojo), the meeting room (the table and the evidence locker), the staff room (the desk).
Object.assign(MAPS, {
  airport: {
    name: 'The Regional Airport · terminal offices',
    rows: [
      "wwwwwwwwwwwwwwwDwwwwwwwwwwwwww",
      "w,,,,,,,w,,,,,,,,,,,,w,,,,,ǏǏw",
      "w,,ǕǕ,,,w,ǍǍǍ,,,,,,,,w,,,,,,,w",
      "w,,,,,,,w,,,,,,,,,,,,w,Ǘ,Ǘ,Ǘ,w",
      "w,,,,,,,w,,,,,,,,,,,,w,,,,,,,w",
      "wwww,wwwwwwwww,,,wwwwwwww,wwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "www,wwwww,www,wwwww,www,www,ww",
      "wǑǑ,,,wǑǑ,,wǙ,Ǔw¤¤¤,w,,,,,w,,w",
      "w,,,,,w,,,,w,,,w,,,,w,§§,,w,,w",
      "w,,,,,w,,,,w,,,w,,,,w,,,,£w,Yw",
      "w,,,,,w,,,,w,,,w,,,,w,,,,,w,,w",
      "w,,,,,w,,,,w,,,w,,,,w,,,,,w,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'15,0': {to: 'csquare', x: 15, y: 9, dir: 'up'}, '0,7': {to: 'apboard', x: 16, y: 5, dir: 'left'}}
  },
  apboard: {
    name: 'The Airport Board room',
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
    doors: {'17,5': {to: 'airport', x: 1, y: 7, dir: 'right'}}
  }
});
const AP_MAPS = ['airport', 'apboard'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'ferreday', name: 'Joanna Ferreday', role: 'airport manager', map: 'airport', x: 5, y: 2, dir: 'down', pal: 'ferreday'},
  {id: 'breck', name: 'Callum Breck', role: 'weekend duty manager', map: 'airport', x: 17, y: 2, dir: 'left', pal: 'breck', cond: G => !!G.f.apNight26 && !G.f.apNight28},
  {id: 'moreau', name: 'Lise Moreau', role: 'the front desk', map: 'airport', x: 11, y: 1, dir: 'left', pal: 'moreau'},
  {id: 'darrow', name: 'Yusuf Darrow', role: 'manager, Corrowind Aviation (the FBO, a tenant)', map: 'airport', x: 19, y: 3, dir: 'left', pal: 'darrow'},
  {id: 'varga', name: 'Odette Varga', role: 'business office manager', map: 'airport', x: 24, y: 2, dir: 'down', pal: 'varga'},
  {id: 'castell', name: 'Imre Castell', role: 'owner, Kettlebrook Flight School (a tenant)', map: 'airport', x: 3, y: 12, dir: 'up', pal: 'castell'},
  {id: 'teller', name: 'Bronwen Teller', role: 'owner, Brackenlow Aero Services (a tenant)', map: 'airport', x: 9, y: 12, dir: 'up', pal: 'teller'},
  {id: 'fenn', name: 'Dario Fenn', role: 'the airport’s IT coordinator', map: 'airport', x: 13, y: 12, dir: 'up', pal: 'fenn'},
  {id: 'quist', name: 'Yara Quist', role: 'the Authority’s training officer', map: 'airport', x: 18, y: 12, dir: 'up', pal: 'quist'},
  {id: 'whitcombe', name: 'Ansel Whitcombe', role: 'counsel to the Airport Authority', map: 'airport', x: 24, y: 13, dir: 'up', pal: 'whitcombe'},
  {id: 'luciaap', name: 'Lucia Ferrand', role: 'engagement lead, Tallowmere Forensics', map: 'airport', x: 24, y: 10, dir: 'down', pal: 'lucia', cond: G => G.trackId === 'dfir' || !!G.f.apBoss},
  {id: 'theoap', name: 'Theo Marchetti', role: 'junior analyst, Tallowmere Forensics', map: 'airport', x: 21, y: 13, dir: 'up', pal: 'theo', cond: G => G.trackId === 'dfir'},
  {id: 'adair', name: 'Rhoswen Adair', role: 'chair of the Airport Board', map: 'apboard', x: 8, y: 3, dir: 'down', pal: 'adair'}
);
const AP_NPC_IDS = ['ferreday', 'breck', 'moreau', 'darrow', 'varga', 'castell', 'teller', 'fenn', 'quist', 'whitcombe', 'luciaap', 'theoap', 'adair'];

/* ---------- Manager: who owns what (Day 23 11:30; pick four) ---------- */
const AP_OWNERS = [
  {id: 'pcs', name: 'Tenants’ own PCs', csf: 'Govern', text: 'Each tenant’s PCs and its own network are the tenant’s. The airport can’t examine them without the tenant.', good: true},
  {id: 'ports', name: 'The office network', csf: 'Protect', text: 'The airport’s switch and its ports are the airport’s: its IT runs them, and the airport manager decides what may connect.', good: true},
  {id: 'data', name: 'Plinthwise and its data', csf: 'Identify', text: 'Billing, leases and tenant records belong to the business office, and Odette owns the system and its contract.', good: true},
  {id: 'list', name: 'One list, one keeper', csf: 'Identify', text: 'The list of tenant connections has one keeper, Dario, and one approver, the airport manager, for every line on it.', good: true},
  {id: 'share', name: 'Shared means ours', csf: 'Protect', text: 'Tenants’ PCs are the airport’s to examine whenever Joanna likes: they plug into its network.'},
  {id: 'vendor', name: 'The vendor’s data', csf: 'Identify', text: 'Plinthwise’s data belongs to Plinthwise Systems, which supports the system, hosts its updates and fixes it.'},
  {id: 'firm', name: 'The firm’s list', csf: 'Govern', text: 'Tallowmere keeps the list of tenant connections and decides each line, as the firm called in an incident.'}];

/* ---------- The week-4 rota (Nights 21 to 29; Nights 21 and 22 carried for the in-a-row rule) ---------- */
const AP_ROTA = {
  title: 'On-call rota, week 4', first: 21, carry: 2, nights: 9, hours: 12, maxRun: 2, maxWeek: 2, budget: 30, callCost: 3, tiredCost: 5, waitUntil: '07:00',
  intro: '<p>Nights 23 to 29: the town, the Library, the School District, the Clinic, Fire &amp; EMS Dispatch and now the Regional Airport. Nights 21 and 22 are carried from week 3 for the in-a-row rule. The night post is still advertised (game).</p>',
  people: [
    {id: 'bea', name: 'Bea Lindqvist', note: 'email, identity'},
    {id: 'ruth', name: 'Ruth Avila', note: 'endpoints'},
    {id: 'paz', name: 'Paz Delgado', note: 'web'},
    {id: 'odile', name: 'Odile Brennan', note: 'backups', off: [25]},
    {id: 'magda', name: 'Magda Petrov', note: 'logs, network'},
    {id: 'beatriz', name: 'Beatriz Solano', note: 'identity, servers'},
    {id: 'rae', name: 'Rae Okafor', note: 'the suspicion file', max: 1}],
  calls: {}
};

/* ---------- Manager: the tabletop with the airport manager (Day 24 09:00) ---------- */
const AP_TT_OBJ = [
  {label: 'Its own risk register: the office down on a busy weekend, both managers there', good: true},
  {label: 'Replay the most famous attack in this month’s news, for Joanna and Callum to take seriously', why: 'A famous case tests somebody else’s systems. The register says where this airport is weakest.'},
  {label: 'Read the plan’s contents page aloud with Joanna, and tick each section as you reach it', why: 'Reading tests nothing. A scenario has to make people decide something.'},
  {label: 'Switch Plinthwise off for real on Saturday morning, without telling the front desk', why: 'A real outage on a busy day, sprung on the front desk, is an incident, not a test. And the terminal is Callum’s to run.'}];
const AP_TT_INJECTS = [
  {t: 'Exercise, Saturday 08:00 (simulated): Plinthwise won’t open and there is a queue at the front desk. Who decides how the desk works?',
   opts: [{label: 'The weekend’s manager: paper slips and a paper log until it is back', good: true},
          {label: 'You decide it: an outage during an incident is the IR manager’s to run', why: 'You advise. The terminal is the duty manager’s, and so is how its desk works.'},
          {label: 'Shut the front desk until Plinthwise is back, and send the queue to the FBO’s counter', why: 'Closing it helps nobody. The desk works on paper, on the duty manager’s call.'},
          {label: 'Callum keeps retrying Plinthwise and turns people away until it opens', why: 'Retrying isn’t a procedure. The paper is.'}]},
  {t: 'Exercise, 08:20 (simulated): a pilot at the desk asks whether the airport is open.',
   opts: [{label: 'Callum: the office is down, the airfield isn’t. Flights are their pilots’ call', good: true},
          {label: 'Tell pilots the airport is shut until IT says otherwise, and post it at the front desk', why: 'The office systems don’t run the airfield. Over-reacting turns an office outage into a closure nobody needed.'},
          {label: 'Say only what the firm has confirmed, once its report is written', why: 'Silence helps nobody. The duty manager answers with what is known.'},
          {label: 'Tell them it is fine to fly: the firm has checked the systems', why: 'The firm checks office systems, and a flight is its pilot’s decision. Never promise safety.'}]},
  {t: 'Exercise, Monday 07:30 (simulated): Plinthwise is back. When does the desk go back, and what about the paper?',
   opts: [{label: 'The manager on duty picks the time after a test entry. A second person signs off each receipt', good: true},
          {label: 'The moment the sign-in screen shows, Dario decides: that is the test', why: 'A screen isn’t a working system. A test entry first.'},
          {label: 'Odette enters each receipt at the end of the month, with the rest of the month’s billing run', why: 'Paper that waits gets lost. Enter it the same day, checked.'},
          {label: 'Plinthwise Systems decides, as it is the vendor’s system that came back', why: 'The vendor supports the system. The airport manager on duty decides when the desk uses it.'}]}];
const AP_EX_ACTIONS = 3;

/* ---------- Manager: the Airport annex's retainer test (Day 27 07:55) ---------- */
const AP_ACTIVATE = [
  {label: 'Met as written: ransomware on the office network. Call the firm now', good: true},
  {label: 'Not yet: hold off for Joanna on Monday, as she is the one who signs for the airport', why: 'The annex says when the retainer is called, and ransomware on the office network is its first line. Waiting for Monday loses the weekend’s evidence.'},
  {label: 'Callum decides whether the firm comes: he is the manager on duty this weekend', why: 'Callum decides how the terminal runs. The retainer is the Compact’s, and its annex says when it is called.'},
  {label: 'Not met: billing isn’t an airport operation, and the airfield is working as normal', why: 'The annex names the office network. That the airfield is unaffected is good news, not a reason to wait.'},
  {label: 'Met, and more: shut the terminal until the firm’s report is in and read', why: 'Closing it is Callum’s call, and nothing points to it. Call the firm; the desk works on paper.'}];
const AP_ACT_OK = 15, AP_ACT_LATE = 20;   // game minutes

/* ---------- Manager: the weekend (Day 27 14:00, boss stage 3; rota/budget forecast for week 4, game) ---------- */
const AP_COVER = [
  {label: '12-hour shifts: Night 27’s rota lead on site tonight, a fresh lead Sunday, handovers at seven', good: true, k: 'shifts', gaps: 0, overtime: 20},
  {label: 'Everyone stays on until Plinthwise is back: the airport needs the hands', k: 'all', gaps: 0, overtime: 44, why: 'By Sunday nobody makes a clear call. Forecast: 44 overtime hours against 30, and nobody fresh on Monday.'},
  {label: 'You stay on site both days yourself with no handover, keeping the picture in one head', k: 'one', gaps: 0, overtime: 30, why: 'One person with no rest is a single point of failure. Forecast: 30 hours, all yours.'},
  {label: 'Stand down until Monday: the desk is on paper and the firm works overnight', k: 'none', gaps: 24, overtime: 6, why: 'Two nights and a day with nobody for the Compact while the office is rebuilt. Forecast: 24 hours uncovered.'},
  {label: 'Night 27’s lead, on call overnight, also works Sunday’s day shift, to keep it in one head', k: 'double', gaps: 0, overtime: 23, why: 'Twelve hours on call, then twelve more: a 24-hour stretch is the tired call the rota exists to prevent.'}];

/* ---------- Manager: the AAR (Day 29 13:00; blameless; owners arrive assigned under the Library Board's rule: Bookmark Badge) ---------- */
const AP_FACTORS = [
  {id: 'flat', name: 'One office network', csf: 'Protect', text: 'Tenants shared the airport’s office network, so the encrypting PC could reach a tenant’s PC at 05:55.', good: true},
  {id: 'admin', name: 'One account everywhere', csf: 'Protect', text: 'ap-admin had admin rights on every office server and PC, so one account reached all of them.', good: true},
  {id: 'night', name: 'The alert that waited', csf: 'Detect', text: 'The 04:40 alert on a large transfer out waited for the morning: no night threshold with the Compact.', good: true},
  {id: 'list', name: 'The list that came in time', csf: 'Identify', text: 'Until Friday nobody could say which ports were tenants’. The list made the 08:05 cut and the 08:30 calls possible.', good: true},
  {id: 'login', name: 'User error', csf: 'Protect', text: 'Root cause: the front desk’s shared login, which the staff should have known better than to use.'},
  {id: 'vendor', name: 'The vendor’s door', csf: 'Protect', text: 'Plinthwise’s remote support let the attackers into the office network on Saturday morning.'},
  {id: 'drill', name: 'The tabletop', csf: 'Recover', text: 'Wednesday’s tabletop tired the staff out and made Saturday’s front desk slower.'}];
const AP_IMPACT = [
  {label: 'The desk on paper 07:48 Saturday to 08:00 Monday: 64 slips, all entered and checked', good: true},
  {label: 'No impact to report: the airport stayed open on Saturday and Sunday', why: 'The front desk worked on paper for two days and the office was rebuilt. Say what it cost, as counted.'},
  {label: 'The airport was shut for 48 hours while the office was down', why: 'It wasn’t: the airfield’s own systems are separate, and the desk worked on paper.'},
  {label: 'Unknown until the receipts have been reconciled at the end of the month', why: 'The receipts were counted and checked this morning. The count is known now.'}];
const AP_AAR = [
  {id: 'seg', name: 'Tenants on their own segment: the tenant portal and the internet, nothing else', owner: 'Joanna Ferreday, with Dario doing it',
   dates: [{label: 'Day 36, a Monday, with the tenant agreement signed', good: true},
           {label: 'As soon as possible', why: 'A date nobody can check. Day 36, with the agreement.'},
           {label: 'When the budget allows', why: 'The switch can do it already. Nothing to buy. Day 36.'},
           {label: 'Day 30, tomorrow, before the tenant agreement exists', why: 'Cutting tenants over before they have agreed what they can reach is a new outage for them. Day 36.'}]},
  {id: 'named', name: 'Named admin accounts with MFA in place of ap-admin, kept that way', owner: 'Dario Fenn',
   dates: [{label: 'Day 29, today: done on Sunday, confirmed today', good: true},
           {label: 'As soon as possible', why: 'It is done already. Confirm it today and close it.'},
           {label: 'When the budget allows', why: 'Nothing to buy. It was done on Sunday: today.'},
           {label: 'Day 60, once a new identity tool has been bought', why: 'The directory can do it now, and it did. Today.'}]},
  {id: 'thresh', name: 'A night threshold with the Compact for the airport’s office alerts, in writing', owner: 'Joanna Ferreday',
   dates: [{label: 'Day 31, Wednesday', good: true},
           {label: 'As soon as possible', why: 'An action without a date doesn’t close. Day 31.'},
           {label: 'When the budget allows', why: 'A threshold costs nothing to write. Day 31.'},
           {label: 'Day 90, a Sunday, after the next budget round', why: 'Saturday’s alert waited for the morning. A quarter is too long: Day 31.'}]}];

/* ---------- The directive (game): a tenant wants a permanent direct connection into the office network ---------- */
const AP_DIRECTIVE = {
  manager: [
    {label: 'The trade-off and the choices, among them a tenant segment: the airport manager decides', good: true},
    {label: 'Refuse it, and every tenant connection with it, for good: the airport is better alone', why: 'An absolute with a price nobody has counted. Lay out the options; the owner decides.'},
    {label: 'Agree it, as before: the flight school has been connected for years', why: 'It was connected, and on Saturday the encrypting PC reached a tenant’s PC. The decision is Joanna’s.'},
    {label: 'You decide it now, as the IR manager, and tell Imre what you decided', why: 'You advise. What the airport’s network lets connect is the airport manager’s decision.'},
    {label: 'Dario decides: he runs the switch, so what it lets through is his to choose, not anyone else’s', why: 'Dario runs it. What may connect is Joanna’s to decide.'}],
  dfir: [
    {label: 'The case: one shared network let the encrypting PC reach a tenant’s PC. Joanna decides', good: true},
    {label: 'Tell him the report requires a separate network, and Joanna must comply', why: 'A report recommends. The owner decides, knowing what the case showed.'},
    {label: 'Say the network’s design is outside the letter Ansel signed, and say no more', why: 'Ansel has agreed the facts can be shared. Silence leaves the decision blind.'},
    {label: 'Tell him the flight school’s own connection let the attack in, and it must be cut this week', why: 'Nothing shows that. How the attacker got in is unknown. Say what the case showed.'}]};

/* ---------- DFIR D1: the scoping letter (game) ---------- */
const AP_LETTER = [
  {label: 'Confirm the questions, then list who owns each system before collecting', good: true},
  {label: 'Take a copy of each PC on the office network, tenants’ too: they share it', why: 'Tenants’ PCs are theirs. The letter lets the firm take only what a tenant chooses to give.'},
  {label: 'Ask Plinthwise for its support logs yourself, without going through Ansel', why: 'Its systems are out of scope. Requests go through counsel and are logged when sent.'},
  {label: 'Start on a redesign of the tenants’ network, which will be needed anyway', why: 'The letter asks three questions. A redesign is advice for later, and the owner’s decision.'}];

/* ---------- DFIR D2: what the firm may take ---------- */
const AP_TAKE = [
  {label: 'The airport’s own records now, the flight school’s copy only as Imre gives it', good: true},
  {label: 'Copy the flight school’s mailbox from its PC while it sits on the airport’s network', why: 'Its PC and its mailbox are the flight school’s. Ask, and take only what it gives.'},
  {label: 'Ask Imre to forward the email again, as a new message, to arrive cleanly', why: 'A new message loses the headers. As an attachment, it keeps them.'},
  {label: 'Hold off for Plinthwise’s own logs before collecting any of the airport’s', why: 'The airport’s records answer two of the questions now, and its logs roll on. Collect them now.'}];

/* ---------- DFIR D3: evidence intake (the airport's store, case AIR) ---------- */
const AP_INTAKE = {
  a02: {id: 'A-02', what: 'The flight school’s copy of the email, forwarded as an attachment with its headers', form: 'Given by Imre Castell at 09:25; SHA-256 on receipt recorded. His consent, signed: for question 1 only.',
    opts: [{label: 'Log it as the flight school’s, with its consent and its limit: question 1 only', good: true},
           {label: 'Log it as the airport’s: it was sent here, so it is likely the airport’s', why: 'It is the flight school’s mail. Record whose it is and what it was given for.'},
           {label: 'Log it for questions 1 to 3, as it may turn out to help with each', why: 'Its consent is for question 1. Using it for more needs his agreement.'},
           {label: 'Skip the hash: an email can’t change once it has left its sender', why: 'A file can change after it is copied. Hash it like any item.'}]},
  a03: {id: 'A-03', what: 'The remote-support connector’s log on AP-BIL-01, its 30 days', form: 'Exported 09:30 by Dario Fenn; SHA-256 at export recorded.',
    opts: [{label: 'Compare the hashes, log Dario’s handover, seal it as received, work on a copy', good: true},
           {label: 'Read the connector’s live log instead: Dario says it is the same, and newer', why: 'The live log rolls on. The export is the fixed record.'},
           {label: 'Keep only the lines for Tuesday night, seal those, and hash them against the record', why: 'An edited item isn’t the item. Seal what was exported.'},
           {label: 'Forward a copy to Plinthwise, sealed and hashed, to compare its sessions with ours', why: 'Requests to the vendor go through counsel. The evidence stays in the store.'}]},
  a04: {id: 'A-04', what: 'Plinthwise’s application audit, Day 22 00:00 to Day 23 09:00', form: 'Exported 09:35 by Odette Varga, the system’s owner; SHA-256 at export recorded.',
    opts: [{label: 'Compare the hashes and log her handover: Odette isn’t in question', good: true},
           {label: 'Discard it: an export made by Odette, the system’s owner, can’t be used', why: 'Odette isn’t in question. Record who made it, compare the hashes, and use it.'},
           {label: 'Skip the comparison and seal it: Odette is staff here, and her export is trusted', why: 'The check is about the file, not the person. Compare every item.'},
           {label: 'Log it only if it turns out to matter to one of the letter’s three questions', why: 'The log records what was received, before anyone reads it.'}]},
  a06: {id: 'A-06', what: 'AP-DC-01’s directory query log, its 7 days', form: 'Exported 09:45 by Dario Fenn; SHA-256 at export recorded.',
    opts: [{label: 'As each item: compare the hashes, log the handover, seal it, use a copy', good: true},
           {label: 'File it in the town’s case and seal it there: the directory trusts the town’s directory', why: 'It is the airport’s directory and the airport’s log. It goes in the airport’s store, case AIR.'},
           {label: 'Omit the item from the log: not one of the three questions is about the directory', why: 'It was handed over, so it is logged. Whether it is read is a separate decision.'},
           {label: 'Ask Dario to clear the log once it is copied, to save space on the server', why: 'The original stays where it is. Nothing is cleared.'}]}
};

/* ---------- DFIR D5: separate stores per owner (Day 24 10:00) ---------- */
const AP_STORES = [
  {label: 'A store of its own for the shop’s log, unread until Bronwen and Ansel agree its use', good: true},
  {label: 'Into the airport’s case: anything from a device on its network is the airport’s to use', why: 'The log is the shop’s. Its own store, with what it was given for agreed first.'},
  {label: 'Hash it and read it first, and decide where it goes once we know what is in it', why: 'Reading it first uses it for something nobody agreed. Store it, then agree.'},
  {label: 'Delete it: the maintenance shop isn’t Ansel’s client, and we can’t hold it', why: 'Deleting what a tenant offered destroys evidence. Store it apart and ask Ansel.'}];

/* ---------- DFIR, Day 29 07:30: the airport manager asks the consultant ---------- */
const AP_SWITCH_DFIR = [
  {label: 'What the firm found on AP-BIL-02 since the rebuild: the time is Joanna’s call', good: true},
  {label: 'It is fine: go back now, and enter the paper in its own time next week', why: 'The firm says what it found. When, and how the paper is entered, is the airport manager’s call.'},
  {label: 'Not until every tenant’s PC has been checked', why: 'Tenants’ PCs are off the airport’s network. Keeping the desk on paper for them is a cost with no reason.'},
  {label: 'The report says the desk stays on paper until the case is finished', why: 'A report recommends, and this one doesn’t say that. The decision is Joanna’s.'}];

/* ---------- Drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const AP_DRILLS = {
  mailmgr: {
    id: 'mailmgr', title: 'The “Airport Operations” email', budget: 2,
    intro: '<p>Imre Castell forwarded it at 07:50: “Is this real? Bronwen and Yusuf got it too.” Review the record: is it from the airport, or someone pretending to be?</p>',
    artefact: '<pre class="art">From: Airport Operations &lt;operations@rvb-airports.example&gt;\n' +
      'To: Kettlebrook Flight School · Day 22 16:12 (game data)\n' +
      'Subject: Hangar rent: our bank account has changed\n' +
      'Please pay November’s hangar rent to the new\n' +
      'account below by Friday to avoid a late fee.\n' +
      '[the airport’s logo]  Airport Operations</pre>' +
      '<p class="small">The airport’s mail is rvb-airport.example. Its message trace says what the airport sent; the business office says, on a number you already had, whether anything changed.</p>',
    question: 'Did the airport send it, or is someone impersonating it?',
    sources: [
      {id: 'logo', name: 'The logo', qs: [
        {q: 'Is it the airport’s real logo?', kind: 'trap', res: ['Yes: the same image as on the airport’s public website.', '(Anyone can copy a logo from a website.)']}]},
      {id: 'deadline', name: 'The deadline', qs: [
        {q: 'How urgent is it?', kind: 'trap', res: ['“By Friday to avoid a late fee.”', '(Urgency fits a real reminder and a fake one alike.)']}]},
      {id: 'trace', name: 'The airport’s message trace and the copy’s headers', qs: [
        {q: 'Did any airport mailbox send it, and where did the copy come from?', kind: 'focus', key: true,
         res: ['Trace, exported by Dario at 08:50: no message from any airport mailbox to any tenant after 11:00 on Monday', 'The copy’s headers: From and Return-Path at rvb-airports.example; received from a mail server that isn’t the airport’s mail service']},
        {q: 'Every message the airport sent or received on Monday', kind: 'broad', rows: 3140,
         wall: ['{t}  out  billing@  → tenant{i}  invoice', '{t}  in   newsletter  → ops@', '{t}  out  ops@  → council{i}']}]},
      {id: 'finance', name: 'The business office, on a known number', qs: [
        {q: 'Has the airport’s bank account changed?', kind: 'focus', key: true,
         res: ['08:30: Imre rang Odette on the number in his lease file. “No change. We have sent nothing about the account.”', 'Plinthwise’s invoice template carries the same account as in 2021']}]}
    ],
    ai: {everything: {text: 'The message uses the airport’s official logo and refers to hangar rent, a real airport charge. It appears to be a genuine notice from airport operations. Recommend tenants update their payment details.', wrong: true,
                      reveal: 'Tally read a logo and a subject line. It never read the trace, the headers, or asked the business office on a known number.'},
         specific: {q: 'Which domain sent the forwarded copy?', text: 'rvb-airports.example. The airport’s own domain is rvb-airport.example.'}},
    verdicts: [
      {label: 'Not ours: an impersonation from a lookalike domain, as our records and Odette agree', good: true, needs: ['trace', 'finance'],
       needsWhy: 'the answer rests on two records: the airport’s trace with the copy’s headers, and the business office on a known number. You read only one of them.',
       why: 'The trace says the airport sent nothing, the headers say where it came from, and Odette says nothing changed.'},
      {label: 'Real: the logo is the airport’s, and the email’s charge is a real one', why: 'A copied logo and a real charge fit a fake as well. The trace and the business office decide it.'},
      {label: 'An airport mailbox broken into and used to send it, with every password to be changed', why: 'The trace shows no such message from any airport mailbox, and the headers name another domain’s server.'}],
    reasons: [
      {label: 'We sent nothing to tenants after 11:00, and Odette says nothing changed: two records agree', good: true, why: 'Our record of what we sent, and the owner of the account on a known number.'},
      {label: 'The deadline is too short: real notices from the airport give tenants a month or more', why: 'A deadline is a style, not a record.'},
      {label: 'The logo is real: somebody at the airport must have sent it', why: 'Logos can be copied from any website.'}],
    alts: [
      {label: 'An airport mailbox used to send it', good: true, why: 'Ruled out: the trace shows nothing from any airport mailbox to tenants after 11:00.'},
      {label: 'A real change the business office forgot to announce', good: true, why: 'Ruled out: Odette, on a known number, says nothing changed.'},
      {label: 'The flight school’s own mail broken into', why: 'Nothing points to it: three tenants got the same message from the same domain.'},
      {label: 'A printing error on the last invoice', why: 'Beside the point: the invoice template is unchanged since 2021.'}],
    path: '<p>“From us, or impersonating us?” is decided by <b>the airport’s message trace with the copy’s headers</b> and <b>the business office on a number you already had</b>. A logo and a deadline fit either answer. T1657 (Financial Theft) covers business email compromise, where an adversary may impersonate a trusted entity.</p>',
    response: ['Odette rings every tenant on its lease-file number: no change, don’t pay', 'Dario blocks rvb-airports.example at the airport’s mail', 'Each tenant asks its own bank about any payment it made', 'Keep the copy with its headers, and thank Imre for asking'],
    techs: ['T1657'], acts: ['apmail']
  },
  maildfir: {
    id: 'maildfir', title: 'Question 1: the “Airport Operations” email', budget: 3,
    intro: '<p>The letter’s first question. Your copies of A-01, A-02 and A-04 are on the bench. The finding needs two sources that each decide part of it.</p>',
    artefact: '<pre class="art">Case AIR-01 · question 1 (game data)\n' +
      'A-01  mail message trace, Day 22 to 23\n' +
      'A-02  the flight school’s copy (for question 1)\n' +
      'A-04  Plinthwise’s application audit\n' +
      'Note  three tenants received it, Day 22 16:12</pre>' +
      '<p class="small">A-01 says what the airport’s mail sent; A-02’s headers say where the copy came from.</p>',
    question: 'Did the email come from the airport’s mail system?',
    sources: [
      {id: 'logo', name: 'The logo', qs: [
        {q: 'Is it the airport’s?', kind: 'trap', res: ['The same image as on the public website.', '(A copy proves nothing about the sender.)']}]},
      {id: 'deadline', name: 'The deadline', qs: [
        {q: 'How urgent?', kind: 'trap', res: ['“By Friday.”', '(A tone, not a record.)']}]},
      {id: 'trace', name: 'A-01: the message trace', qs: [
        {q: 'Did any airport mailbox send a message to a tenant on Monday afternoon?', kind: 'focus', key: true,
         res: ['None after 11:00 on Day 22', 'The last airport message to the flight school: an invoice on Day 18, from billing@rvb-airport.example']}]},
      {id: 'headers', name: 'A-02: the copy’s headers', qs: [
        {q: 'Where did the copy come from?', kind: 'focus', key: true,
         res: ['From and Return-Path: operations@rvb-airports.example', 'Received from a mail server outside the airport’s mail service. The domain isn’t on the airport’s list of its own domains']},
        {q: 'Every header line, and the whole body', kind: 'broad', rows: 640,
         wall: ['Received: from relay{i}.example', 'X-Spam-Score: {n}', 'Content-Type: multipart/mixed']}]},
      {id: 'audit', name: 'A-04: Plinthwise’s audit', qs: [
        {q: 'Did the invoice account change?', kind: 'focus', key: true,
         res: ['The invoice template’s bank account unchanged since 2021. No change to it on Day 22 or 23']}]}
    ],
    verdicts: [
      {label: 'No: an impersonation from a lookalike domain. A-01 and A-02 show it, A-04 agrees', good: true, needs: ['trace', 'headers'],
       needsWhy: 'the finding rests on two sources: A-01 (what the airport sent) and A-02 (where the copy came from). You read only one.',
       why: 'Each decides its half.'},
      {label: 'Yes: the logo, the domain and the charge look like the airport’s own', why: 'A copied logo is not a sender. A-01 and A-02 say who sent it.'},
      {label: 'Unknown until every tenant’s mailbox has been examined', why: 'Tenants’ mail is theirs, and A-01 and A-02 already answer the question.'}],
    reasons: [
      {label: 'A-01: we sent nothing then. A-02: the copy came via another domain’s server', good: true, why: 'Our record, and the copy’s own route.'},
      {label: 'A-04: the invoices haven’t changed since 2021, which shows the email can’t be ours', why: 'A-04 supports it; it doesn’t show who sent the email.'},
      {label: 'Three tenants got it: the airport must have sent a mailing', why: 'A count of recipients isn’t a sender.'}],
    alts: [
      {label: 'An airport mailbox used to send it', good: true, why: 'Ruled out: A-01 shows none after 11:00.'},
      {label: 'The copy altered in transit', good: true, why: 'Not supported: it came as an attachment, hashed on receipt, its headers whole.'},
      {label: 'A tenant playing a joke', why: 'Nothing points to it.'},
      {label: 'The airport’s website being changed', why: 'Beside the point: the logo is a copy either way.'}],
    path: '<p>Two decisive sources: <b>A-01</b> (what the airport’s mail sent) and <b>A-02</b> (the copy’s headers). A-04 agrees. T1657 (Financial Theft) covers business email compromise, where an adversary may impersonate a trusted entity.</p>',
    response: ['Report to Ansel: not from the airport, from a lookalike domain', 'Recommend tenants hear from the business office on known numbers', 'Keep A-02 for question 1 only, as its consent says', 'Who sent it stays unknown: nothing in scope can say'],
    techs: ['T1657'], acts: ['apmail']
  },
  vendmgr: {
    id: 'vendmgr', title: 'The 02:40 vendor sign-in', budget: 2,
    intro: '<p>The Compact’s alert from 02:41: “vendor support sign-in outside hours”. Review the record: was it Plinthwise’s work, airport staff, or an intruder?</p>',
    artefact: '<pre class="art">Compact log platform · alert · Day 23 02:41 (game data)\n' +
      'Vendor support sign-in outside 07:00–19:00\n' +
      'Account  pw-support   Host  AP-BIL-01\n' +
      'From     203.0.113.40\n' +
      'Severity low · no night page</pre>' +
      '<p class="small">An account is a name, not a person. Who was behind it is in the connector’s log and the vendor’s ticket, and in the vendor’s own word on a number from the contract.</p>',
    question: 'Who signed in at 02:40: Plinthwise, staff, or an intruder?',
    sources: [
      {id: 'hour', name: 'The alert’s hour', qs: [
        {q: 'When was it?', kind: 'trap', res: ['02:40, outside office hours.', '(Updates are often run at night.)']}]},
      {id: 'age', name: 'The account’s age', qs: [
        {q: 'How old is pw-support, and its password?', kind: 'trap', res: ['Created in 2019; its password never changed.', '(A risk to fix, and no record of who signed in.)']}]},
      {id: 'log', name: 'The connector’s log and the vendor’s ticket', qs: [
        {q: 'Where did the session come from, and is there a ticket?', kind: 'focus', key: true,
         res: ['02:40–03:25 from 203.0.113.40, inside Plinthwise’s documented support range. Session note: PW-4471', 'PW-4471: the monthly update, Tuesday 02:30–03:30, announced to the business office by email on Day 15']}]},
      {id: 'call', name: 'Odette’s call to Plinthwise', qs: [
        {q: 'What does the vendor say, on which number?', kind: 'focus', key: true,
         res: ['08:45, on the support line in the contract: “PW-4471, our technician, the monthly update. Finished 03:25.”', 'Odette wrote and signed a note of the call at 08:55']}]}
    ],
    ai: {everything: {text: 'A vendor account with a password unchanged since 2019 authenticated at 02:40, outside business hours. This pattern is consistent with credential compromise. Recommend treating AP-BIL-01 as compromised and rebuilding it.', wrong: true,
                      reveal: 'Tally joined an hour and an old password. It never read the ticket, or asked the vendor on the contract’s number.'},
         specific: {q: 'Is 203.0.113.40 in Plinthwise’s documented range?', text: 'Yes: the range is 203.0.113.32 to 47.'}},
    verdicts: [
      {label: 'Plinthwise’s scheduled update, PW-4471, as the ticket and the vendor’s word agree', good: true, needs: ['log', 'call'],
       needsWhy: 'the answer rests on two records: the connector’s log with the ticket, and the vendor’s word on the contract’s number. You read only one.',
       why: 'The log, the ticket and the vendor agree.'},
      {label: 'An intruder, as confirmed by a 2019 password used at 02:40', why: 'The hour and the password fit a scheduled update too. The ticket and the vendor say what it was.'},
      {label: 'Airport staff, Dario likely among them, testing the vendor’s old account late at night', why: 'The session came from the vendor’s range, under its ticket, and the vendor confirms it.'}],
    reasons: [
      {label: 'The range, a Day 15 ticket, and the vendor’s word on the contract’s line: they agree', good: true, why: 'The records and the vendor, each from its own source.'},
      {label: 'Vendors never work at night: the hour itself settles it', why: 'Monthly updates are run at night so nobody is using the system.'},
      {label: 'An old password confirms somebody other than the vendor must have used the account', why: 'Old is a risk, not a record.'}],
    alts: [
      {label: 'Someone outside Plinthwise using the account', good: true, why: 'Not supported: the session came from its range, under its ticket, and it confirms the work.'},
      {label: 'Staff at the airport using pw-support', good: true, why: 'Ruled out: the session came from 203.0.113.40, not an airport address.'},
      {label: 'A password guessed overnight by someone outside', why: 'Nothing points to it: one sign-in, first time, with a ticket.'},
      {label: 'The update breaking billing', why: 'Beside the point: Plinthwise opened normally at 07:30.'}],
    path: '<p>“Who signed in?” is decided by <b>the connector’s log with the vendor’s ticket</b> and <b>the vendor on the contract’s own number</b>. The hour and the account’s age fit either answer. T1133 (External Remote Services) is the explanation this evidence ruled out.</p>',
    response: ['Close it with both sources cited', 'pw-support on demand from 11:00: Odette enables it per ticket', 'Ask Plinthwise for MFA and a new password under its contract: Odette’s decision', 'Thank Odette: the call on the contract’s number is what settled it'],
    techs: ['T1133'], acts: ['apvendor']
  },
  venddfir: {
    id: 'venddfir', title: 'Question 2: the 02:40 session', budget: 3,
    intro: '<p>The letter’s second question: who used pw-support at 02:40, and what was done? A-03, A-04, A-07 and A-08 are on the bench. The finding needs two sources.</p>',
    artefact: '<pre class="art">Case AIR-01 · question 2 (game data)\n' +
      'A-03  remote-support connector log\n' +
      'A-04  Plinthwise’s application audit\n' +
      'A-07  AP-BIL-01’s EDR, 02:00–04:00\n' +
      'A-08  Odette’s signed note, the Day 15 email</pre>' +
      '<p class="small">A-03 says where the session came from; A-08 is the vendor’s word on the contract’s number, with its announcement.</p>',
    question: 'Who used pw-support at 02:40, and what was done?',
    sources: [
      {id: 'hour', name: 'The hour', qs: [
        {q: 'When?', kind: 'trap', res: ['02:40.', '(Night is when updates run.)']}]},
      {id: 'age', name: 'The account’s age', qs: [
        {q: 'How old is its password?', kind: 'trap', res: ['Unchanged since 2019.', '(A risk, not a record.)']}]},
      {id: 'log', name: 'A-03: the connector’s log', qs: [
        {q: 'Where from, and under what note?', kind: 'focus', key: true,
         res: ['02:40–03:25 from 203.0.113.40, in Plinthwise’s documented range. Session note PW-4471']}]},
      {id: 'call', name: 'A-08: the call and the announcement', qs: [
        {q: 'What did the vendor say, on which number, and what had it announced?', kind: 'focus', key: true,
         res: ['Odette’s signed note: her 08:45 call on the contract’s support line, “PW-4471, our technician, the monthly update”', 'The Day 15 email to the business office: PW-4471, Tuesday 02:30–03:30']}]},
      {id: 'audit', name: 'A-04 and A-07: what the session did', qs: [
        {q: 'What ran, and what changed?', kind: 'focus', key: true,
         res: ['A-04: the updater at 02:44; the application’s version changed at 03:20; no other change, no new account', 'A-07: the updater and its child processes, files in the program folder only']},
        {q: 'Every audit line since Sunday', kind: 'broad', rows: 18400,
         wall: ['{t}  invoice  create  INV-{n}', '{t}  lease  view  H-{i}', '{t}  signin  billing{i}']}]}
    ],
    verdicts: [
      {label: 'Plinthwise’s update, as A-03 and A-08 show. A-04 and A-07: nothing else', good: true, needs: ['log', 'call'],
       needsWhy: 'the finding rests on two sources: A-03 (where the session came from) and A-08 (the vendor’s word and its announcement). You read only one.',
       why: 'Each decides its part.'},
      {label: 'Likely an intruder: a 2019 password, used at night', why: 'Both fit an update. A-03 and A-08 say what it was.'},
      {label: 'Unknown until Plinthwise has answered R-01 in full with its own records of the night', why: 'Our records and the vendor’s word already agree. R-01 will add to them, not decide them.'}],
    reasons: [
      {label: 'A-03: its range and ticket. A-08: its word on the contract’s line, and its notice', good: true, why: 'The session, and the vendor’s word with its announcement.'},
      {label: 'A-07: the updater ran on AP-BIL-01, and whoever ran it must have been its vendor', why: 'A-07 shows what ran, not who ran it.'},
      {label: 'The alert fired: the sign-in was a threat by definition', why: 'An alert is a reason to look.'}],
    alts: [
      {label: 'Someone outside Plinthwise using the account', good: true, why: 'Not supported: A-03 and A-08 agree on the range, the ticket and the work.'},
      {label: 'A change beyond the update', good: true, why: 'Ruled out: A-04 and A-07 show the updater only.'},
      {label: 'Two technicians working together', why: 'Nothing points to it.'},
      {label: 'AP-BIL-01’s clock being wrong', why: 'Beside the point: A-03 and A-08 agree on the times.'}],
    path: '<p>Two decisive sources: <b>A-03</b> (the session, its range and its ticket) and <b>A-08</b> (the vendor’s word on the contract’s number, and its announcement). A-04 and A-07 agree. T1133 (External Remote Services) is the explanation this evidence ruled out.</p>',
    response: ['Report to Ansel: Plinthwise’s update, nothing else changed', 'pw-support on demand from 11:00, its logs kept', 'Recommend MFA and a new password in Plinthwise’s contract: Odette’s decision', 'R-01 stays open and dated: Day 23 (Tuesday) 11:15'],
    techs: ['T1133'], acts: ['apvendor']
  },
  tenantmgr: {
    id: 'tenantmgr', title: 'The tenant’s PC', budget: 2,
    intro: '<p>Sunday 10:00. Bronwen Teller won’t let the firm image MS-PC-01, her shop’s PC. What can be done about it, and who decides?</p>',
    artefact: '<pre class="art">Bronwen Teller, by phone · Day 28 09:40 (game data)\n' +
      'That PC holds my customers’ maintenance records.\n' +
      'It is mine. Nobody images it. I’m not having\n' +
      'strangers in my shop on a Sunday.</pre>' +
      '<p class="small">A tenant’s PC is the tenant’s. What the airport can decide is what its own network lets connect. The lease and counsel say the rest.</p>',
    question: 'What can be done about MS-PC-01, and who decides?',
    sources: [
      {id: 'tone', name: 'Bronwen’s call', qs: [
        {q: 'How angry is she?', kind: 'trap', res: ['Very. She hung up once.', '(Anger is not a reason either way.)']}]},
      {id: 'age', name: 'The PC’s age', qs: [
        {q: 'How old is MS-PC-01?', kind: 'trap', res: ['Eight years.', '(Old PCs fail and get attacked alike. It says nothing about Saturday.)']}]},
      {id: 'flows', name: 'The firm’s flows and Plinthwise’s audit', qs: [
        {q: 'What did MS-PC-01 do on Saturday, as recorded?', kind: 'focus', key: true,
         res: ['04:19: MS-PC-01 to AP-BIL-01’s database port, three failed database sign-ins', '05:55: AP-OF-03 to MS-PC-01’s file sharing, accepted. What happened on MS-PC-01 is unknown', 'Nothing from MS-PC-01 since 08:05, when the tenants’ ports were shut']}]},
      {id: 'lease', name: 'The lease and Ansel’s note', qs: [
        {q: 'What does the lease allow, and what does counsel say?', kind: 'focus', key: true,
         res: ['The 2017 lease: tenants may connect “subject to the Authority’s IT rules”. Nothing about examining tenants’ equipment', 'Ansel, 09:30: the airport can’t require an image. It can decide what its own network lets connect']}]}
    ],
    ai: {everything: {text: 'MS-PC-01 attempted unauthorised database access before the encryption began. It is the most likely point of entry. Recommend imaging it immediately to preserve evidence.', wrong: true,
                      reveal: 'Tally turned three failed sign-ins into a way in, and never read the lease or counsel’s note.'},
         specific: {q: 'Has MS-PC-01 sent anything since 08:05?', text: 'No. Its port was shut with the tenants’ at 08:05.'}},
    verdicts: [
      {label: 'She picks who preserves it. Keeping it off our network is Joanna’s to decide', good: true, needs: ['flows', 'lease'],
       needsWhy: 'the answer rests on two records: what MS-PC-01 did, and what the lease and counsel allow. You read only one.',
       why: 'What the records show, what the airport may decide, and whose PC it is.'},
      {label: 'Copy its disk tonight while the shop is shut: Joanna can allow it on the airport’s network', why: 'Its PC is hers. The airport decides its network, not her PC.'},
      {label: 'Plug it back in, since a tenant’s PC is none of the airport’s business', why: 'It connected to billing’s database at 04:19. The airport can keep it off its own network until it is checked.'},
      {label: 'You order the shop to hand it over under the lease, as the IR manager', why: 'The lease says nothing of the kind, and you decide neither the lease nor her PC.'}],
    reasons: [
      {label: 'The 04:19 and 05:55 records, and a lease that gives the airport its network: what it may decide', good: true, why: 'What happened, and what the airport may decide.'},
      {label: 'She is angry: she must have something to hide', why: 'Anger is not evidence.'},
      {label: 'An 8-year-old PC is a risk on any network: its age alone makes it the way in', why: 'Old isn’t a record of Saturday.'}],
    alts: [
      {label: 'MS-PC-01 as the way in', good: true, why: 'Unknown: three failed sign-ins are a lead, not a finding. The examination is hers to arrange.'},
      {label: 'MS-PC-01 still sending to the airport', good: true, why: 'Ruled out: nothing since 08:05, when its port was shut.'},
      {label: 'Bronwen herself, or someone at her shop', why: 'Nothing points to any person. The records name a PC.'},
      {label: 'The PC’s age', why: 'Beside the point.'}],
    path: '<p>“What can be done, and who decides?” is decided by <b>what MS-PC-01 did, as recorded</b> and <b>what the lease and counsel allow</b>. Her anger and the PC’s age fit either answer.</p>',
    response: ['Joanna keeps MS-PC-01’s port shut until it is checked', 'Ansel writes to Bronwen: what the airport saw, and what it asks', 'Bronwen’s own IT firm preserves it, memory first: her choice', 'What it finds about the two connections is shared only as she and Ansel agree'],
    techs: [], acts: ['aptenant']
  },
  lastdfir: {
    id: 'lastdfir', title: 'Question 2, again: when did the vendor last connect?', budget: 3,
    intro: '<p>Plinthwise wrote at 15:40: no session or technician activity for the airport on Wednesday. Our records show connections from its range at 14:05. How do you word it? It needs two sources.</p>',
    artefact: '<pre class="art">Case AIR-01 · question 2, Wednesday (game data)\n' +
      'A-10  Plinthwise’s portal log, Days 20–23\n' +
      'A-11  flows, Day 24 13:00–14:30\n' +
      'A-12  connector log, the same window\n' +
      'A-13  Plinthwise’s statement, 15:40\n' +
      'R-02  requested Day 24 (Wednesday) 15:00</pre>' +
      '<p class="small">A-11 says what connected from where; A-12 says what the connector did with it. A-10 and A-13 are the vendor’s account of its own side.</p>',
    question: 'When did the vendor last connect, and how should the finding read?',
    sources: [
      {id: 'certain', name: 'The statement’s tone', qs: [
        {q: 'How sure does Plinthwise sound?', kind: 'trap', res: ['“No activity of ours.” Signed, on letterhead.', '(Certainty is a tone, not a record.)']}]},
      {id: 'size', name: 'Plinthwise’s size', qs: [
        {q: 'How big is the vendor?', kind: 'trap', res: ['It supports billing at dozens of sites.', '(Size makes a mistake neither likelier nor less likely.)']}]},
      {id: 'flows', name: 'A-11: flows', qs: [
        {q: 'What connected on Wednesday, from where, to what?', kind: 'focus', key: true,
         res: ['203.0.113.44, inside Plinthwise’s documented range, to the connector’s port on AP-BIL-01, 14:05–14:07']}]},
      {id: 'conn', name: 'A-12: the connector’s log', qs: [
        {q: 'What did the connector do with those connections?', kind: 'focus', key: true,
         res: ['14:05 and 14:06: sign-in on pw-support rejected, account disabled. No session']}]},
      {id: 'vendor', name: 'A-10 and A-13: the vendor’s side', qs: [
        {q: 'What does Plinthwise’s own log show?', kind: 'focus', key: true,
         res: ['A-10: its last session for the airport, Tuesday 02:40–03:25, PW-4471', 'A-13: no session or technician activity on Wednesday; 203.0.113.44 is one of its support addresses; it is checking']}]}
    ],
    verdicts: [
      {label: 'Tuesday’s was the last session. In evidence for Wednesday: two rejected sign-ins, cause unknown', good: true, needs: ['flows', 'conn'],
       needsWhy: 'the finding rests on two sources: A-11 (what connected from where) and A-12 (that the sign-ins were rejected). You read only one.',
       why: 'What our records show, what the vendor says, and an honest unknown with the request dated.'},
      {label: 'Plinthwise’s log is wrong: our records show its address connected on Wednesday', why: 'Its log records sessions, and there was none. Write what each record shows.'},
      {label: 'Plinthwise likely tried to get back in on Wednesday afternoon, after its account was disabled', why: 'An address in its range is not the vendor. Who tried is unknown.'},
      {label: 'No activity on Wednesday: the vendor says so, and no session opened', why: 'Our records show two sign-in attempts. They go in the finding whatever the vendor says.'}],
    reasons: [
      {label: 'A-11, A-12: two rejections. A-10, A-13: its word. R-02 is open', good: true, why: 'Each record for what it shows, the vendor’s word as the vendor’s.'},
      {label: 'A-13 is signed by the vendor, and its signature outweighs our flows', why: 'A signature is not a record of Wednesday.'},
      {label: 'The account was disabled: the attempts don’t matter', why: 'They matter: someone tried. The control worked, which is a finding too.'}],
    alts: [
      {label: 'The flows being misread', good: true, why: 'Not supported: A-11 and A-12 agree on the times and the address.'},
      {label: 'A session nobody logged', good: true, why: 'Ruled out: A-12 shows both sign-ins rejected, and A-11 shows two minutes of connections, no more.'},
      {label: 'The vendor lying in its statement', why: 'Not something the records can show. Write its statement as its statement.'},
      {label: 'The vendor’s size', why: 'Beside the point.'}],
    path: '<p>Two decisive sources: <b>A-11</b> (what connected from where) and <b>A-12</b> (that the connector rejected it). A-10 and A-13 are the vendor’s account, written as such. T1133 (External Remote Services) is the question this evidence can’t yet answer: who tried the vendor’s remote access on Wednesday.</p>',
    response: ['Write it as it reads: the last session Tuesday, Wednesday’s rejected attempts, who tried unknown', 'R-02 stays open and dated: Day 24 (Wednesday) 15:00', 'pw-support stays disabled; its logs kept', 'Say plainly that the on-demand control did its job'],
    techs: ['T1133'], acts: ['aplast']
  }
};

/* ---------- DFIR report 1: AIR-01, for counsel (Day 24 17:00) ---------- */
const AP_REPORT_1 = {
  title: 'AIR-01: the email, the vendor’s sessions and who owns what', audience: 'Ansel Whitcombe, counsel to the Airport Authority',
  intro: '<p>Eight findings for Ansel, covering his three questions, each from the evidence in the custody log.</p>',
  claims: [
    {id: 'mail', text: 'The “Airport Operations” email did not come from the airport’s mail system.', truth: 'confirmed',
     evidence: ['A-01: no message from any airport mailbox to a tenant after 11:00 on Day 22', 'A-02: sent from rvb-airports.example, through a server outside the airport’s mail service'], why: 'The trace and the copy’s headers agree.'},
    {id: 'sender', text: 'Who sent the email.', truth: 'unknown',
     evidence: ['A-02: a domain that isn’t the airport’s', 'Nothing in scope says who holds it'], why: 'Nothing in scope can say.'},
    {id: 'session', text: 'The 02:40 session on pw-support was Plinthwise’s scheduled monthly update, PW-4471.', truth: 'confirmed',
     evidence: ['A-03: 02:40–03:25 from its documented range, note PW-4471', 'A-08: the vendor’s word on the contract’s line; the Day 15 announcement', 'A-10: its own portal log'], why: 'Our records and the vendor’s agree.'},
    {id: 'change', text: 'That session changed nothing but the application’s version.', truth: 'confirmed',
     evidence: ['A-04: the updater, the version change, no other change and no new account', 'A-07: the updater and its child processes only'], why: 'The application’s audit and the EDR agree.'},
    {id: 'tries', text: 'On Wednesday at 14:05 and 14:06, two sign-ins on the disabled pw-support account were rejected.', truth: 'confirmed',
     evidence: ['A-11: 203.0.113.44 to the connector, 14:05–14:07', 'A-12: both sign-ins rejected, account disabled'], why: 'The flows and the connector agree.'},
    {id: 'network', text: 'The Wednesday connections came from Plinthwise’s own support network.', truth: 'likely',
     evidence: ['A-11: the address is inside the range Plinthwise documents', 'A-13: Plinthwise says it wasn’t its activity'], why: 'The address points to it; an address in a range isn’t proof of who was behind it.'},
    {id: 'who', text: 'What made the Wednesday connections.', truth: 'unknown',
     evidence: ['A-13: Plinthwise is checking', 'R-02: its records for 203.0.113.44, requested on Day 24 (Wednesday) 15:00'], why: 'Nothing in scope can say. The request is dated.'},
    {id: 'ports', text: 'Of the office switch’s 46 ports, 15 serve tenants’ devices.', truth: 'confirmed',
     evidence: ['A-09: Dario’s port list, checked against the switch’s own address table'], why: 'The list and the switch agree.'}]
};

/* ---------- DFIR report 2 (the boss, stage 3): AIR-02, what the ransomware reached (Day 27 15:30) ---------- */
const AP_REPORT_2 = {
  title: 'AIR-02: Saturday on the office network', audience: 'Ansel Whitcombe, counsel to the Airport Authority',
  intro: '<p>Seven findings on the second letter’s three questions, from the evidence logged since 08:40.</p>',
  claims: [
    {id: 'enc', text: 'AP-FS-01, AP-BIL-01, the two front-desk PCs and the four business office PCs were encrypted 05:52–06:20, from AP-OF-03 under ap-admin.', truth: 'confirmed',
     evidence: ['A-17: the EDR’s file events, 04:00 to 08:00', 'A-20: the ransom note and twenty encrypted sample files'], why: 'Each host’s file events, and the files themselves.'},
    {id: 'dc', text: 'AP-DC-01 was not encrypted between 04:00 and 08:00.', truth: 'confirmed',
     evidence: ['A-17: no file events on AP-DC-01 in that window', 'A-16: its directory database opens normally'], why: 'Its own file events, and its data still opening, over the window they cover.'},
    {id: 'export', text: 'The tenant records table was exported at 04:28 by ap-admin from AP-OF-03.', truth: 'confirmed',
     evidence: ['A-18: Plinthwise’s audit, as forwarded to the Compact’s platform before 05:52'], why: 'The audit records the export, the account and the host.'},
    {id: 'left', text: 'Tenant records left the airport’s network.', truth: 'likely',
     evidence: ['A-19: 1.4 GB from AP-OF-03 to 203.0.113.58, 04:31–05:02', 'A-18: the export at 04:28 was 1.38 GB'], why: 'The sizes and the times point to it; the contents of the transfer aren’t visible.'},
    {id: 'mspc', text: 'Whether the ransomware reached MS-PC-01.', truth: 'unknown',
     evidence: ['A-19: one accepted connection from AP-OF-03 at 05:55', 'MS-PC-01 is the tenant’s, outside the letter'], why: 'Nothing in scope can say.'},
    {id: 'way', text: 'How the attacker got ap-admin.', truth: 'unknown',
     evidence: ['A-14, A-17, A-18: ap-admin’s use from 04:28, nothing earlier in the window', 'Nothing in scope shows the way in'], why: 'Nothing read so far can say.'},
    {id: 'pub', text: 'Whether tenant records have been published.', truth: 'unknown',
     evidence: ['No post or claim seen', 'Nothing in scope records it'], why: 'Nothing in scope can say.'}]
};

/* ---------- Dojos (original puzzles; concepts only, no tool syntax) ---------- */
const AP_DOJO_MGR = [
  {q: 'A tenant’s PC on your network looks suspicious. What can you do?',
   opts: ['Ask the tenant to have it looked at: what your network lets it reach is yours to decide',
          'Examine it yourself: it is on your network, and your rules apply to whatever is on it',
          'Stay out of it, since a tenant’s PC is entirely the tenant’s affair'], good: 0,
   explain: 'The PC is the tenant’s; the network is yours. Ask, and decide what connects.'},
  {q: 'A vendor needs remote access to support your system. How should it work?',
   opts: ['On demand per confirmed ticket, from its documented range, with MFA and a log',
          'Always on, letting the vendor fix problems before anyone notices them',
          'One shared password for its account, kept by your IT lead and read out over the phone'], good: 0,
   explain: 'Access that is off until it is needed can’t be used when nobody expects it.'},
  {q: 'Who should own the list of what connects to your network?',
   opts: ['One named keeper, the network’s owner approving each line',
          'Every tenant, each keeping its own part of the list in its own way',
          'The outside firm, which sees the network during an incident'], good: 0,
   explain: 'A list everyone keeps is a list nobody keeps. One keeper, one approver.'}];
const AP_DOJO_DFIR = [
  {q: 'An email looks like it came from your organisation. What settles it?',
   opts: ['Your mail system’s record of what it sent, and a whole copy’s headers',
          'The logo and signature, and how much they look like the real ones',
          'How many people received the email, and how quickly they forwarded it'], good: 0,
   explain: 'The trace says what you sent; the headers say where the copy came from.'},
  {q: 'A colleague wants to send you a suspicious email. How should it reach you?',
   opts: ['As an attachment: its headers come with it',
          'Pasted into a new email, with every word of its text intact',
          'As a screenshot, which shows exactly what they saw'], good: 0,
   explain: 'A new message or a picture loses the route the email took.'},
  {q: 'A vendor’s log and your flows disagree about when it last connected. What do you write?',
   opts: ['Each record for what it shows: the vendor’s word as its word, the unknown dated',
          'That the vendor’s log is wrong: your flows were made by you',
          'That nothing happened at all on Wednesday: the vendor has said so on its letterhead'], good: 0,
   explain: 'Two records can both be right about different things: a session, and a connection.'}];

/* ---------- The Airport Board (original; Rhoswen Adair; three rounds per track) ---------- */
const AP_BOARD_SPECS_MGR = () => [
  {title: 'Round 1: did it touch the airfield?', who: 'Rhoswen Adair',
   ask: '“Did any of this touch the airfield, or a flight?”',
   resp: [{label: 'Only the office systems. The desk ran on paper, and pilots decided their flights', good: true},
          {label: 'Yes: the whole airport was down from Saturday morning until Monday', why: 'The office was. Access control and fuelling are separate systems, not affected.'},
          {label: 'We can’t say until the firm has checked the airfield’s own systems as well as the office’s', why: 'The airfield’s systems aren’t on the office network and weren’t part of this. Say what was affected.'}]},
  {title: 'Round 2: should we pay?', who: 'Rhoswen Adair',
   ask: '“Should the Board pay the ransom?”',
   resp: [{label: 'The Board decides, with counsel and the insurer. Plinthwise came back without it', good: true},
          {label: 'Pay it, since there is no other way left to protect the tenants’ records from being published', why: 'Paying can’t call back what left. The Board decides, with counsel and the insurer.'},
          {label: 'The IR manager will decide that, once the firm has reported', why: 'You advise. Any payment is the Board’s decision.'}]},
  {title: 'Round 3: what stops it again?', who: 'Rhoswen Adair',
   ask: '“What stops Saturday happening again?”',
   resp: [{label: 'Tenants on their own segment, named admin accounts with MFA, a night threshold', good: true},
          {label: 'A new antivirus product on every PC, and a training video for all the office staff', why: 'One account reached everything across a shared network. A product fixes neither.'},
          {label: 'Nothing for us to do: a tenant let them in, and the tenant must fix it', why: 'Nothing shows that, and the shared network is the airport’s risk.'}]}];
const AP_BOARD_SPECS_DFIR = () => [
  {title: 'Round 1: were tenants’ records stolen?', who: 'Rhoswen Adair',
   ask: '“Were the tenants’ records stolen?”',
   resp: [{label: 'Likely copied out on Saturday: not confirmed, and publication unknown', good: true},
          {label: 'Yes: stolen and published, and the tenants must be told that today', why: 'Nothing shows publication, and copying out is likely, not confirmed.'},
          {label: 'No: nothing is missing from Plinthwise, and nothing was taken', why: 'An export leaves the original in place. 1.4 GB left after it.'}]},
  {title: 'Round 2: did the shop let them in?', who: 'Rhoswen Adair',
   ask: '“Did the maintenance shop let them in?”',
   resp: [{label: 'Unknown. Its PC is the tenant’s, examined by its own IT. No one is named', good: true},
          {label: 'Yes, its PC is where the attack started on Saturday', why: 'Three failed sign-ins are a lead, not a finding.'},
          {label: 'No: a tenant’s PC couldn’t have reached the billing system’s database at all', why: 'It did connect, at 04:19. What that means is unknown.'}]},
  {title: 'Round 3: can we tell the tenants?', who: 'Rhoswen Adair',
   ask: '“Can the Board write to the tenants today?”',
   resp: [{label: 'Ansel decides what tenants are told, and the Board can give him a view', good: true},
          {label: 'Yes, the firm will write to every tenant tonight', why: 'The firm reports to Ansel. What tenants are told is his decision.'},
          {label: 'Never: tenants are told nothing at all while any case is still open', why: 'An absolute nobody asked for. Ansel decides, with the Board’s view.'}]}];

/* ---------- The boss: ransomware on the office network on a busy weekend (game-original), one seat per track ---------- */
function apMgrBossStages() {
  return {
    s1: {title: 'Stage 1 (08:00): coordinate',
      clues: ['07:40: a ransom note on the front-desk PC, and Plinthwise won’t open. 07:48: Callum, the duty manager, put the desk on paper.', 'The airfield’s own systems are separate and working. Access control and fuelling aren’t part of this. (game)', 'Dario is in the IT closet. Joanna is off today, reachable by phone.'],
      ask: 'You are the IR manager. Who does what, first?',
      resp: [{label: 'Desk on paper, Callum’s call. The office cut off when he agrees. Firm, Joanna told', good: true},
             {label: 'You decide: shut each office PC and server down at once, before it spreads', why: 'Their memory is evidence, and cutting the office off stops the spread without losing it.'},
             {label: 'Hold off for Joanna and Odette on Monday: they own the systems', why: 'The ransomware doesn’t wait. Containment and the firm come now; the owners are told.'},
             {label: 'You set the front desk’s procedure yourself: Callum is busy with the queue at the desk', why: 'Callum called it at 07:48. The terminal is his today. You coordinate everyone else.'},
             {label: 'Shut the terminal, with Callum, until the office systems return', why: 'The airport’s operations aren’t on the office network, and closing it is Callum’s call. He hasn’t.'}]},
    s2: {title: 'Stage 2 (12:30): Callum, Joanna and the Board’s chair',
      clues: ['11:00, the firm, through Ansel: the office systems encrypted from AP-OF-03; AP-DC-01 not encrypted; the tenant records exported at 04:28 and 1.4 GB sent out at 04:31–05:02.', 'Measured so far: the desk on paper since 07:48, every payment on a paper receipt. The airfield isn’t affected.', 'Not known: how the attacker got ap-admin, what reached MS-PC-01, who tried the vendor’s account on Wednesday.'],
      ask: 'What do you give them? (Ansel agreed the tenant wording at 12:15.)',
      resp: [{label: 'What’s known, tenant records as likely copied out, 16:00 next, nothing promised', good: true},
             {label: 'Promise Plinthwise back by Monday morning, for the tenants to plan', why: 'A promise nobody can keep yet. The next update at 16:00, with what is known.'},
             {label: 'Tell the tenants their records came to no harm, and nobody need panic', why: 'They likely aren’t. Say what is known, in Ansel’s wording.'},
             {label: 'Tell the tenants their records were stolen and published', why: 'Copying out is likely, not confirmed, and nothing shows publication.'},
             {label: 'Nothing until the firm’s report is final: Ansel decides when', why: 'Silence leaves the tenants guessing. Say what is known, and when more comes.'}]},
    s3: {title: 'Stage 3 (14:00): the weekend',
      clues: ['The desk stays on paper over the weekend: Callum’s call. Plinthwise is rebuilt on Sunday: Dario, with the vendor on a one-time account. pw-support stays disabled.', 'The Compact’s people have been at it since 07:45. Night 27 is in the week-4 rota.', 'Dario’s hours are Joanna’s to set, the front desk’s are Callum’s. Yours are the Compact’s.'],
      ask: 'How does the Compact cover the weekend?',
      resp: AP_COVER.map(o => ({label: o.label, good: !!o.good, why: o.why}))}
  };
}
function apDfirBossStages() {
  return {
    s1: {title: 'Stage 1 (08:35): preserve',
      clues: ['The office network has been cut off since 08:05, its hosts left running. ap-admin was disabled at 08:10.', 'Ansel extended the engagement at 08:20: what did it reach? Did tenant records leave? What can’t the evidence say yet?', 'The 01:00 nightly copy of AP-BIL-01 is held off the network. Odette wants the front desk back on it.'],
      ask: 'What do you do first?',
      resp: [{label: 'Memory of AP-OF-03, AP-BIL-01, AP-DC-01 as they run, the copy untouched, then disks', good: true},
             {label: 'Shut it all down and copy the disks: a disk copy is the one that lasts', why: 'Memory goes with the power. Capture it with the hosts running and cut off.'},
             {label: 'Restore Plinthwise from the nightly copy at once, so the front desk can get back to work', why: 'Restoring before it is preserved, or the copy shown clean, can bring the attack back. The desk is on paper.'},
             {label: 'Copy MS-PC-01’s disk too: AP-OF-03 connected to it at 05:55', why: 'It is the tenant’s PC, outside the letter. Only the tenant can agree to that.'},
             {label: 'Hold it until Monday, when the office is open and Odette is in', why: 'The memory and the trail go with time. Collect now; nothing here touches the terminal.'}]},
    s2: {title: 'Stage 2 (13:00): what did it reach?',
      clues: ['A-17: 05:52–06:20, files encrypted on AP-FS-01, AP-BIL-01, AP-FD-01, AP-FD-02 and AP-OF-01..04, from AP-OF-03 under ap-admin. No file events on AP-DC-01.', 'A-18: 04:28, a full export of the tenant records table, 1.38 GB, by ap-admin from AP-OF-03. A-19: 1.4 GB from AP-OF-03 to 203.0.113.58, 04:31–05:02.', 'A-19: 05:55, AP-OF-03 to MS-PC-01’s file sharing, accepted. MS-PC-01 is the tenant’s.'],
      ask: 'From the evidence, what did it reach?',
      resp: [{label: 'The office systems, from AP-OF-03. Tenant records likely left. MS-PC-01 unknown', good: true},
             {label: 'The whole airport, the airfield’s systems included', why: 'The evidence covers the office network. The airfield’s systems are separate and not part of it.'},
             {label: 'Tenant records confirmed stolen, and published', why: 'The sizes point to it; the contents aren’t visible, and nothing shows publication.'},
             {label: 'Nothing left the network: the ransom note lists only encrypted files', why: 'The note is the attacker’s claim. The flows show 1.4 GB out.'},
             {label: 'MS-PC-01 is confirmed as where it started: it connected to billing first, at 04:19', why: 'Three failed sign-ins are a lead. Unknown, and the tenant’s to examine.'}]}
  };
}

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  apmail: {name: 'Is this email really from us?', desc: 'Read your own mail system’s message trace (what you sent) and the headers of a copy forwarded as an attachment (where it came from), and ask the owner of the account named, on a number you already had. Logos and deadlines fit a real notice and a fake one alike.'},
  apvendor: {name: 'Vendor remote support, on demand', desc: 'Check an unexplained vendor sign-in against the vendor’s ticket and its own word on the contract’s number. Whatever the answer, make the access off until needed: enabled per ticket, from the vendor’s documented range, with MFA, and logged.'},
  aplast: {name: 'Two records, two truths', desc: 'A vendor’s log records the sessions its people opened. Your flows record every connection, and your connector records what it did with each. When they disagree, write what each shows, the vendor’s word as its word, and who it was as unknown, with the request dated.'},
  aptenant: {name: 'Tenants own their systems', desc: 'A tenant’s PC is the tenant’s, even on your network. You can ask the tenant to have it checked, and you decide what your own network lets it reach. Leases and agreements are counsel’s.'},
  apowners: {name: 'Who owns what, written down', desc: 'For every system on a shared network: whose it is, who runs it, who decides what connects. One keeper for the list of connections, one approver for each line.'},
  appaper: {name: 'The front desk on paper', desc: 'When the office systems are down, the manager on duty puts the desk on paper receipts and a paper log, practised beforehand. When the system is back, a test entry first, the manager on duty picks the time, and the paper is entered the same day and checked by a second person.'},
  apcopy: {name: 'Restore only from a checked copy', desc: 'Preserve first. Then check the copy in isolation before trusting it: scan it, and read its own records for anything the attack did. Restore onto a rebuilt server, with the accounts the attack used replaced.'},
  apseg: {name: 'Keep tenants on their own segment', desc: 'Give tenants their own network segment that reaches only what they need (the tenant portal and the internet), under a signed tenant agreement. The airport manager decides what connects, knowing the cost.'},
  apweekend: {name: 'A weekend incident with rest', desc: 'Twelve-hour shifts with written handovers, the night from the rota, outside help for the specialist work, and nobody on the day after their night.'},
  apaar: {name: 'An AAR the tenants can read', desc: 'Blameless: what let one account reach everything across a shared network, and what kept the airport working. Each action with one owner and a date. The cost as counted.'},
  apstatus: {name: 'Read the firm’s status report', desc: 'A retained firm reports what it found, what it didn’t, and anything it saw outside its questions, which goes to counsel first.'}
});
Object.assign(FACTS, {
  apcisa: {name: 'CISA: the transportation systems sector', desc: 'CISA’s Transportation Systems Sector page says: “Aviation includes aircraft, air traffic control systems, and about 19,700 airports, heliports, and landing strips.” This slice looks only at one airport’s business and office IT (game).', src: 'CISA, Transportation Systems Sector'},
  apnotam: {name: 'NOTAMs, in the FAA’s words', desc: 'The FAA’s page “What is a NOTAM?” says: “A NOTAM is a notice containing information essential to personnel concerned with flight operations”. In the game the office outage changes nothing on the airfield (game).', src: 'FAA, What is a NOTAM'},
  apacrp: {name: 'ACRP: a guidebook for airport cybersecurity', desc: 'The Airport Cooperative Research Program published ACRP Report 140, Guidebook on Best Practices for Airport Cybersecurity, in 2015. The game names it and quotes nothing from it.', src: 'ACRP Report 140 (2015)'}
});
GAME_NOTES.push(
  'The Regional Airport and the Regional Airport Authority, its people, tenants and counts, Plinthwise and Plinthwise Systems, Kettlebrook Flight School, Brackenlow Aero Services, Corrowind Aviation, every host (AP-BIL-01, AP-FS-01, AP-DC-01, AP-OF-03 …), the lookalike email and its domain, the vendor’s sessions, the rejected sign-ins, the ransomware and the busy weekend are invented. Only the airport’s business and office IT appear: access control and fuelling are separate systems, not affected and not part of this work. No real airport, FBO, airline or vendor and no real incident appear. (game)',
  'The Airport annex, the week-4 rota, the tabletop, the paper procedure and its 11-minute practice, the weekend plan and its forecasts, the AAR, the 64 receipts, the directory’s trust with the town’s, the nightly copy held off the network, the Windsock Badge’s effects and every score are invented. The game never says what any rule requires of the airport: counsel decides what tenants are told, and the Board decides any payment. (game)'
);
