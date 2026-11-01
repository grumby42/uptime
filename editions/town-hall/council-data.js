/* ============================================================
   UPTIME · editions/town-hall/council-data.js
   Town Hall district 9, the finale: Council Chambers (governance, leadership,
   incident command). Art, map, people, the fieldwork tables (the one-page
   incident response plan, the risk register, the delegation mini-game, outside
   contacts, the plain-words council briefing), three investigation drills, the
   Governance dojo, the Council Board and the town-wide incident's stages, Field
   Manual text. It extends the earlier districts' tables; the only change to
   their data is the Water Plant's south wall (desk room), which becomes the
   Council Chambers door (marked), opened by the Tide Badge.
   You are the town's first security team lead: you assign, coach and brief;
   the district leads do the hands-on work. Legal counsel decides notification:
   the game never states what any law requires. No new alerts on the map: the
   delegated queue recycles one alert type from each earlier district.
   People, hosts, domains (.example), addresses (RFC 5737 only), money, counts
   and timings are invented (game). Real facts are cited in CREDITS.md, section
   "Council Chambers" (NIST CSF 2.0 Govern, SP 800-61 Rev. 3, NICE work roles,
   CISA CTEP, CIRCIA's status on 1 November 2026). Timeline: scratchpad
   council-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Art (original palettes over existing sprites) ---------- */
Object.assign(PAL, {
  ccDais: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  ccClerk: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  ccClerkOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  ccWar: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  ccWarOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  ccTeam: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  ccTeamOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  ccPress: ['#1b2233', '#2b2f3a', '#4a5163', '#dbeaf7'],
  ccLegal: ['#1b2233', '#3a1d10', '#8c7b70', '#e0b090'],
  ccDojo: ['#1b2233', '#1f5a8a', '#7fa2d6', '#ffd96a'],
  ccBoard: ['#1b2233', '#1f5a8a', '#7cc6c4', '#ffd96a'],
  // people
  merrin: ['#1a1a2e', '#5b4a42', '#c98a54', '#4a1414'],
  fen: ['#1a1a2e', '#a8703f', '#e0b090', '#2f6e3e'],
  noor: ['#1a1a2e', '#141414', '#a8703f', '#3a4a6b'],
  ada: ['#1a1a2e', '#5b3a26', '#e0b090', '#b8432f'],
  elsie: ['#1a1a2e', '#d7dbe4', '#f2c7a0', '#5a6fa0'],
  wendell: ['#1a1a2e', '#141414', '#5b3a26', '#7cc6c4']
});
// Every ASCII tile character is taken by earlier districts; these are single UTF-16 units, so map rows keep their lengths.
Object.assign(TILES, {
  '_': {spr: 'counter', pal: 'ccDais', solid: true, under: ','},   // council seats on the dais
  '§': {spr: 'counter', pal: 'ccClerk', solid: true, under: ','},  // the clerk's records desk (decision log, risk register)
  '¶': {spr: 'pc', pal: 'ccPress', solid: true, under: ','},       // press room desks
  '£': {spr: 'counter', pal: 'ccLegal', solid: true, under: ','},  // legal counsel's desk
  '¥': {spr: 'counter', pal: 'ccWar', solid: true, under: ','},    // the war room's incident command table
  'µ': {spr: 'K', pal: 'ccTeam', solid: true},                      // the team board (who has which case)
  '¤': {spr: 'pc', pal: 'ccDojo', solid: true, under: ','},        // Governance dojo terminals
  '±': {spr: 'K', pal: 'ccBoard', solid: true}                      // Council Board committee racks
});

/* ---------- Map: Council Chambers and the Council Board ---------- */
// North-west: the council chamber (dais). North middle: the lobby and the clerk's records desk. North-east: the press
// room. Middle: legal counsel's office (west; its west-wall door leads to the Council Board), the war room (centre), the
// team room (east). South: the Governance dojo and your desk. The door back to the Water Plant is in the north wall.
Object.assign(MAPS, {
  council: {
    name: 'Council Chambers',
    rows: [
      "wwwwwwwwwwwwwwDwwwwwwwwwwwwwww",
      "w,_,_,_,_,,w,,,,,,,,,w,¶,,¶,,w",
      "w,,,,,,,,,,w,,,,,,§,,w,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,w,,,,,,,,,w,,,,,,,w",
      "wwwwww,wwwwwwww,wwwwwww,wwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,£,,,,,w,,¥¥¥¥,,,,w,,µµ,,,,w",
      "w,,,,,,,,w,,,,,,,,,,w,,,,,,,,w",
      "wwww,wwwwwwwwwww,wwwwwwwwww,ww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,¤,¤,¤,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,Y,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'14,0': {to: 'water', x: 14, y: 14, dir: 'up'},
      '0,7': {to: 'ccboard', x: 16, y: 5, dir: 'left'}}
  },
  ccboard: {
    name: 'Council Board',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w±±,,,,,,,,,,,,±±w",
      "w±±,,,,,,,,,,,,±±w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,E",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'17,5': {to: 'council', x: 1, y: 7, dir: 'right'}}
  }
});
// The one change to earlier data: the Water Plant's south wall (desk room) becomes the door to Council Chambers (Tide Badge opens it).
MAPS.water.rows[15] = MAPS.water.rows[15].slice(0, 14) + 'D' + MAPS.water.rows[15].slice(15);
MAPS.water.doors['14,15'] = {to: 'council', x: 14, y: 1, dir: 'down',
  get locked() { return (typeof G !== 'undefined' && G && G.f.wtTide) ? undefined : 'A door in the south wall: the service corridor to Town Hall. A card reader: “Council Chambers. Tide Badge required.”'; }};

const CC_MAPS = ['council', 'ccboard'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'merrin', name: 'Mayor Dalia Merrin', role: 'mayor and council chair', map: 'council', x: 5, y: 2, dir: 'down', pal: 'merrin'},
  {id: 'bramcc', name: 'Councillor Bram Whitlock', role: 'town council', map: 'council', x: 8, y: 3, dir: 'left', pal: 'bram'},
  {id: 'fen', name: 'Councillor Fen Rasmussen', role: 'roads committee chair', map: 'council', x: 2, y: 3, dir: 'right', pal: 'fen', cond: G => !!G.f.ccDrill1 && !G.f.ccDirective},
  {id: 'noor', name: 'Noor Castellanos', role: 'town attorney', map: 'council', x: 5, y: 8, dir: 'up', pal: 'noor'},
  {id: 'ada', name: 'Ada Pemberton', role: 'communications officer', map: 'council', x: 25, y: 2, dir: 'down', pal: 'ada'},
  {id: 'elsie', name: 'Elsie Corrigan', role: 'town clerk', map: 'council', x: 19, y: 2, dir: 'down', pal: 'elsie'},
  {id: 'wendell', name: 'Wendell Osei', role: 'governance coach', map: 'council', x: 10, y: 11, dir: 'left', pal: 'wendell'},
  {id: 'raecc', name: 'Rae Okafor', role: 'suspicion-file lead', map: 'council', x: 25, y: 8, dir: 'left', pal: 'rae'},
  {id: 'merrinb', name: 'Mayor Dalia Merrin', role: 'Council Board lead', map: 'ccboard', x: 8, y: 2, dir: 'down', pal: 'merrin'}
);
const CC_NPC_IDS = ['merrin', 'bramcc', 'fen', 'noor', 'ada', 'elsie', 'wendell', 'raecc', 'merrinb'];

/* ---------- Scorecard starting figures (game) ---------- */
const CC_ASSIGN0 = 45;                    // mean time to assign, game minutes: every alert waits for you
const CC_LOAD0 = 300;                     // busiest person's load, % of capacity: you, carrying every district's escalations
const CC_DEC0 = {owned: 3, total: 12};    // the council's decision log: decisions with a named owner
const CC_ACT0 = {closed: 9, total: 23};   // post-incident actions from the eight earlier districts' incidents

/* ---------- Fieldwork 2: the risk register (game risks; each recalls an earlier district) ---------- */
// For each risk the player names the owner. The owner is the person who owns the service and would carry the loss,
// not the security team. Likelihood and impact are 1-5 (game); the decision and review date are shown once owned.
const CC_RISKS = [
  {id: 'vendor', text: 'Vendor emergency access to the water plant', lik: 2, imp: 5, decision: 'accept: the on-call path stays, as signed', review: 'six months',
   owners: [{label: 'Gil Hartley, the plant manager, who signed the emergency path', good: true}, {label: 'Joss Kettering, the controls engineer who approves each window'}, {label: 'You, as the security team lead who designed it'}, {label: 'Audra Finch, the CIO, since the box sits on the network'}],
   why: 'The plant is Gil’s; he signed the risk acceptance for the on-call path. Joss runs the windows; he doesn’t own the plant’s risk.'},
  {id: 'permits', text: 'Ransomware stopping permits for longer than the agreed recovery time', lik: 3, imp: 4, decision: 'mitigate (offline copies, restore tests) and transfer part (the cyber insurance)', review: 'six months',
   owners: [{label: 'Odile Brennan, who runs the backups and the restore tests'}, {label: 'Deshawn Pruitt, the permits manager', good: true}, {label: 'You: ransomware is a security risk, so security owns it'}, {label: 'Leona Ferraro, finance director, who pays for storage'}],
   why: 'Deshawn owns permits and agreed how long it may be down. Odile runs the backups that reduce the risk; running a control isn’t owning the risk.'},
  {id: 'cards', text: 'Card data handled on the town’s own pages', lik: 2, imp: 4, decision: 'avoid: card entry stays on the processor’s hosted page', review: 'yearly',
   owners: [{label: 'Paz Delgado, who runs the town’s web pages'}, {label: 'The card processor, which hosts the page now'}, {label: 'Oona Quist: taking payments is her job', good: true}, {label: 'You, since the WAF is a security tool'}],
   why: 'Oona owns taking payments and the merchant agreement. Paz runs the pages; the processor runs its own page, not the town’s risk.'},
  {id: 'bec', text: 'A supplier’s hijacked mailbox redirecting a payment', lik: 3, imp: 3, decision: 'mitigate: a call-back on a known number before any bank change', review: 'yearly',
   owners: [{label: 'Bea Lindqvist, who runs the mail filters'}, {label: 'Jonah Abara, since his team pays the invoices', good: true}, {label: 'Each supplier, for keeping its own mailbox safe'}, {label: 'You, since phishing is a security problem'}],
   why: 'Jonah’s team pays the invoices and makes the call-back. Bea’s filters help; the supplier’s mailbox isn’t the town’s to own.'}
];

/* ---------- Fieldwork 3: delegation (mini-game) ---------- */
// Leads on shift (game): what they are good at, how many cases they hold, and how many they can hold.
const CC_LEADS = [
  {id: 'rae', name: 'Rae Okafor', skills: ['identity', 'email'], load: 2, cap: 3, busy: 'the suspicion file takes most of her time'},
  {id: 'bea', name: 'Bea Lindqvist', skills: ['email', 'identity'], load: 1, cap: 3},
  {id: 'ruth', name: 'Ruth Avila', skills: ['endpoint'], load: 1, cap: 3},
  {id: 'paz', name: 'Paz Delgado', skills: ['web'], load: 1, cap: 3},
  {id: 'odile', name: 'Odile Brennan', skills: ['backups', 'endpoint'], load: 1, cap: 3},
  {id: 'magda', name: 'Magda Petrov', skills: ['logs', 'network'], load: 1, cap: 3},
  {id: 'beatriz', name: 'Beatriz Solano', skills: ['identity', 'servers'], load: 3, cap: 3, busy: 'running the access review the insurer asked for'},
  {id: 'joss', name: 'Joss Kettering', skills: ['plant'], load: 0, cap: 3}
];
// One recycled alert type from each earlier district; ret is the verdict the lead sends back. Exactly one closes
// without evidence (bad: true): the Mail Room's "usual supplier" close, the BEC lesson.
const CC_QUEUE = [
  {threat: 'sprayer', district: 'Front Desk', skill: 'identity', ret: 'Benign: staff mistyping new passwords after Monday’s forced reset. Evidence: the sign-in log shows each failure from a town device, followed by that user’s own success.'},
  {threat: 'payee', district: 'Mail Room', skill: 'email', bad: true, ret: 'Benign: the bank change came from our usual supplier’s address. Evidence: none recorded. No call-back on a known number, no header or sign-in check.'},
  {threat: 'quill', district: 'Clerks’ Row', skill: 'endpoint', ret: 'Benign: the finance workbook starting its approved add-in. Evidence: the process tree, and the add-in on the approved list.'},
  {threat: 'slipquote', district: 'Market Square', skill: 'web', ret: 'Benign: the authorised penetration test. Evidence: the test letter’s addresses and window match every request.'},
  {threat: 'lapse', district: 'Records Hall', skill: 'backups', ret: 'Benign: a full disk on the backup target, fixed this afternoon. Evidence: the job log’s error and the disk report.'},
  {threat: 'scrub', district: 'IT Basement', skill: 'logs', ret: 'Benign: the collector’s planned restart. Evidence: the servers’ own logs hold the six minutes; the change ticket.'},
  {threat: 'elevate', district: 'Server Room', skill: 'identity', ret: 'Benign: an approved change with two approvers, made by the group’s owner. Evidence: the change event’s Subject and the ticket.'},
  {threat: 'nudge', district: 'Water Plant', skill: 'plant', ret: 'Benign: the night operator’s storm change. Evidence: the HMI audit log and the shift log.'}
];
// Time to assign, game minutes (game): a lead with the skill and room takes it at once; a full lead's queue makes it
// wait; a lead without the skill hands it back.
const CC_T_OK = 4, CC_T_FULL = 8, CC_T_SKILL = 12;

/* ---------- Fieldwork 5: the plain-words briefing on the booster station (facts from the Water Plant) ---------- */
const CC_BRIEF = [
  {part: 'What happened', opts: [
    {label: 'Someone reached a pump station through a vendor’s modem nobody had listed, and stopped its pumps', good: true},
    {label: 'An internet-accessible device with default credentials led to loss of view on PLC-BS3 (ATT&CK for ICS T0829)'},
    {label: 'Probably the same overseas group that hit other water systems in 2023, going after our water supply'}]},
  {part: 'Impact on residents', opts: [
    {label: 'Nobody in zone 3 lost water: the tank carried them, then operators ran the pumps by hand until 16:10', good: true},
    {label: 'Thousands of homes in zone 3 were at risk of losing water overnight, so we were lucky this time'},
    {label: 'Zone 3’s elevated tank was at 78% when BS-3’s telemetry was lost at 01:47; its pressure was normal by 02:40'}]},
  {part: 'What we are doing', opts: [
    {label: 'The modem is gone, the password changed, and vendor devices are on the list we test from outside', good: true},
    {label: 'Everything is fixed for good: it can’t happen again, because nothing at the plant faces the internet'},
    {label: 'We hardened the attack surface and moved the booster skid’s remote support to the RA-01 on-demand vendor workflow'}]},
  {part: 'What we need from you', opts: [
    {label: 'Adopt the one-page incident plan at this session, so you know who decides what next time', good: true},
    {label: 'Nothing for now: this is a technical matter, and the team has it all in hand'},
    {label: 'A blank cheque for whatever the plant needs, before the next attack comes'}]},
  {part: 'When we next update you', opts: [
    {label: 'A written note on Friday at noon, and at once if anything changes before then', good: true},
    {label: 'When the vendor has finished its own review, whenever that turns out to be'},
    {label: 'At next month’s session, with the rest of the IT report'}]}
];

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const CC_DRILLS = {
  review: {
    id: 'review', title: 'A close that cites one query', budget: 2,
    intro: '<p>Every close gets a second look this week (game). Yesterday at 14:52 Paz Delgado closed a WAF alert on PORTAL-01 as benign: background scanning, all blocked. Paz led the Market Square incident; nobody in town knows that WAF better. You are reviewing the work, not the person.</p>',
    artefact: '<pre class="art">Close note · WAF · PORTAL-01 · Day {D-1} 14:52 (game data)\n' +
      'Alert       SQL injection pattern, 203.0.113.163\n' +
      'Closed by   Paz Delgado, digital services lead\n' +
      'Verdict     benign: background scanning\n' +
      'Note        “All blocked. I’ve seen a thousand of these.”</pre>' +
      '<p class="small">A close note says what someone concluded. Their query log says what they looked at; the server’s own logs say what happened.</p>',
    question: 'Was the evidence enough to close it?',
    sources: [
      {id: 'record', name: 'Paz’s record', qs: [
        {q: 'How experienced is Paz with this WAF?', kind: 'trap',
         res: ['Paz led the Market Square incident and tuned this WAF rule by rule. Nobody in town knows it better.', '(Experience makes a good guess likelier. It doesn’t show what she looked at.)']}]},
      {id: 'note', name: 'The close note', qs: [
        {q: 'How sure was she?', kind: 'trap',
         res: ['“All blocked. I’ve seen a thousand of these.” Opened at 14:46, closed at 14:52.', '(Certainty is how she felt about it, not what the evidence showed.)']}]},
      {id: 'qlog', name: 'Paz’s query log', qs: [
        {q: 'Which sources did her queries reach?', kind: 'focus', key: true,
         res: ['14:46  WAF dashboard: 860 matches from 203.0.113.163, action block', 'No query to PORTAL-01’s access log or to the database log', 'The close note cites the WAF count only']}]},
      {id: 'access', name: 'PORTAL-01 access and database logs', qs: [
        {q: 'Did any of the 860 requests reach PORTAL-01?', kind: 'focus', key: true,
         res: ['PORTAL-01’s access log: no request from 203.0.113.163 all day; the WAF answered all 860 with a 403', 'Database log, 14:00–15:30: no errors, no query returning more than 50 rows', 'No other address sent requests like these that day: all 860 matches came from 203.0.113.163']},
        {q: 'Every PORTAL-01 request yesterday', kind: 'broad', rows: 48200,
         wall: ['{t}  GET  /portal/search?q=…   200  4{n} B', '{t}  GET  /portal/permits/{n}     200  6{n} B', '{t}  POST /portal/login          302', '{t}  GET  /static/app.js         304']}]}
    ],
    ai: {everything: {text: 'The close by Paz Delgado, digital services lead, rests on a WAF block count that fits routine scanning. The verdict is sound; no further review needed.', wrong: true,
                      reveal: 'Tally matched the pattern and trusted the name on the close. It never asked which sources her queries reached, or whether anything got past the WAF to the server.'},
         specific: {q: 'Did any request from 203.0.113.163 reach PORTAL-01?', text: 'No: PORTAL-01’s access log has none; the WAF answered all 860 with a 403.'}},
    verdicts: [
      {label: 'The close stands, but only now: PORTAL-01’s logs show nothing got past the WAF; her close cited its count', good: true, needs: 'access',
       needsWhy: 'her query log shows what she skipped; only PORTAL-01’s access and database logs show whether anything got through.',
       why: 'Her query log shows the gap, and the server’s own logs fill it.'},
      {label: 'It was enough as written: Paz led the Market Square incident and knows this WAF better than anyone in the town', why: 'Seniority isn’t a source. Her one query showed what the WAF blocked, not what reached the server.'},
      {label: 'Reopen it as an incident: 860 injection attempts were waved off by one person after a single dashboard query', why: 'The logs she skipped show nothing reached the server. The close needed evidence, not an incident.'}],
    reasons: [
      {label: 'Her only query was the WAF count; PORTAL-01’s access log has none of the 860 and the database shows no errors', good: true, why: 'What she looked at, and what the server recorded, each from its own source.'},
      {label: 'A lead who tuned that WAF rule by rule, and decided this one in six minutes, would have seen anything odd about these', why: 'Speed and skill say nothing about which logs were read.'},
      {label: '860 blocked requests in one afternoon is a normal day for a town portal, so scanning is the likeliest story', why: 'Likely isn’t shown. A count fits scanning and an attack that got partly through alike.'}],
    alts: [
      {label: 'One request got past the WAF to the server', good: true, why: 'Ruled out: the access log has no request from that address, and the database shows no errors.'},
      {label: 'The scanner moved to a new address once it was blocked', good: true, why: 'Ruled out: no other address sent requests like these that day.'},
      {label: 'Paz waving it off to keep her numbers up', why: 'Nothing points to it, and a review is about the evidence, not a motive.'},
      {label: 'The WAF dashboard miscounting the requests', why: 'The access log and the WAF agree: none of them reached the server.'}],
    path: '<p>A review of someone else’s close is decided by <b>their query log</b> (which sources they reached) and by <b>the decisive source itself</b> (here PORTAL-01’s access and database logs). Seniority and certainty fit a careful close and a guess alike, so they decide nothing.</p>',
    response: ['The close stands: add the access and database log results to the note, so it rests on evidence', 'Tell Paz in private what was missing: a coaching point, not a reprimand in the team channel', 'Change the close template: every close names its decisive source', 'Keep the WAF rule as it is'],
    techs: ['T1190'], acts: ['ccreview']
  },
  press: {
    id: 'press', title: 'A story that says the town was hacked', budget: 2,
    intro: '<p>At 07:10 a county news site posted (game): “Town Hall hacked again: 40,000 residents’ files stolen this week”. By 08:00 it has 2,700 shares, and the reporter wants a comment before a follow-up at noon. Is it about us, and is it true?</p>',
    artefact: '<pre class="art">news.example · Day {D} 07:10 (game data)\n' +
      'Headline   Town Hall hacked again: 40,000 residents’ files stolen this week\n' +
      'Sample     three planning applications, addresses blacked out\n' +
      'Screenshot leak site listing “townhall.example · 40 GB”\n' +
      'Claim      “taken from the town’s planning files this week”</pre>' +
      '<p class="small">A story says what someone believes. Our incident records say what we know left, and when; the named system’s own logs say what happened to it.</p>',
    question: 'Is the story about us, and is it true?',
    sources: [
      {id: 'reporter', name: 'The reporter', qs: [
        {q: 'How sure is the reporter?', kind: 'trap',
         res: ['“Our source is certain. It’s 40,000 residents, taken this week. We publish the follow-up at noon.”', '(A source’s certainty is a claim, not a record.)']}]},
      {id: 'social', name: 'Social media', qs: [
        {q: 'How widely is it being shared?', kind: 'trap',
         res: ['2,700 shares by 08:00; residents asking whether to cancel their cards.', '(Volume measures attention. It says nothing about what happened.)']}]},
      {id: 'records', name: 'Our incident records', qs: [
        {q: 'Do we have a known loss that matches the sample?', kind: 'focus', key: true,
         res: ['Records Hall incident: 3.8 GB of planning applications (names, addresses, drawings) copied from FS-02’s Planning share and sent out from PLAN-LT-04; Noor holds the file list', 'The sample’s three file names are on Noor’s list', 'Our other known loss: the Market Square search, 1,204 resident records (names, emails, streets), not planning files']}]},
      {id: 'fs02', name: 'FS-02, the planning file server: logs', qs: [
        {q: 'Did anything leave FS-02’s Planning share this week?', kind: 'focus', key: true,
         res: ['FS-02’s own Security log and its copy in the SIEM, this week: no bulk read of the Planning share, no account reading it outside staff and the backup', 'This week’s flow records: no host sent more than 50 MB to a new destination', 'Nothing in our records near 40 GB or 40,000 residents']},
        {q: 'Every FS-02 file event this week', kind: 'broad', rows: 212000,
         wall: ['{t}  READ   \\\\FS-02\\Planning\\app-{n}.pdf   staff', '{t}  WRITE  \\\\FS-02\\Planning\\app-{n}.pdf   staff', '{t}  READ   \\\\FS-02\\Planning\\Maps\\ward-{n}.tif   svc-backup', '{t}  LOGON  4624  svc-backup']}]}
    ],
    ai: {everything: {text: 'Multiple reports and a leak-site listing indicate a new breach of the town’s planning files affecting about 40,000 residents. Recommend confirming the breach publicly before noon.', wrong: true,
                      reveal: 'Tally summed up the story and the shares and recommended confirming numbers nobody had checked. It never compared the sample with our own incident records or read FS-02’s logs.'},
         specific: {q: 'Are the sample’s file names on the list of files that left in the Records Hall incident?', text: 'Yes: all three are on Noor’s list of the 3.8 GB.'}},
    verdicts: [
      {label: 'About us but old: the sample left in the Records Hall incident; nothing left this week, and 40,000 isn’t ours', good: true, needs: 'records',
       needsWhy: 'FS-02’s logs show nothing left this week; only our incident records tie the sample to the 3.8 GB that left in the Records Hall incident.',
       why: 'Our records match the sample; this week’s logs and flows rule out the rest of the claim.'},
      {label: 'True as written: the reporter is certain, thousands are sharing it, and a leak site lists the town by its own name', why: 'Certainty and shares are not records. Ours show 3.8 GB of planning applications, taken in the Records Hall incident, and nothing this week.'},
      {label: 'Not about us: FS-02 shows nothing leaving this week, so those files must come from some other town', why: 'Nothing left this week, but the sample’s file names are on our own list from the Records Hall incident.'}],
    reasons: [
      {label: 'The sample’s file names are on Noor’s list of the 3.8 GB, and FS-02 and the flows show nothing leaving this week', good: true, why: 'Our own records for the sample, the named system’s logs for the claim.'},
      {label: 'A reporter with a source inside the group would not publish a figure like 40,000 without seeing the data', why: 'A source’s figure is a claim. Records decide it.'},
      {label: 'The story spread to 2,700 shares within an hour, which a false story about a small town rarely does', why: 'Attention decides nothing about what happened.'}],
    alts: [
      {label: 'Something new left this week from another host', good: true, why: 'Ruled out: this week’s flow records show no host sending more than 50 MB to a new destination.'},
      {label: 'The sample came from another town’s files', good: true, why: 'Ruled out: the three file names are on our own list.'},
      {label: 'A disgruntled employee leaking to the press', why: 'Nothing points to it; the sample matches what the criminals took.'},
      {label: 'The reporter inventing the story', why: 'The sample is real and ours. The headline’s numbers and dates are what’s wrong.'}],
    path: '<p>A press claim is decided by <b>our own incident records</b> (does what we know left match the sample?) and by <b>the named system’s logs</b> (did anything leave it, and when?). The reporter’s certainty and the number of shares fit a true story and a false one alike.</p>',
    response: ['Ada and Noor answer before noon: what we know, what we don’t yet, what we’re doing, and the next update at 16:00', 'No number we can’t back: we name the planning applications from the Records Hall incident, not 40,000', 'Noor decides who must be told, as she already is for the 3.8 GB; we give her today’s facts', 'Add the publication to the existing report to the FBI and CISA; capture the post and the listing for the record'],
    techs: ['T1567.002'], acts: ['ccpress']
  },
  insurer: {
    id: 'insurer', title: 'MFA on all remote access?', budget: 2,
    intro: '<p>The insurer’s renewal questionnaire is due Friday (game). Question 7: “At the time of the incident on the fd-admin account, was MFA enforced on all remote access?” The policy says one thing. People remember another. What is the true answer?</p>',
    artefact: '<pre class="art">Renewal questionnaire · question 7 (game data)\n' +
      '“At the time of the incident on the fd-admin account,\n' +
      ' was multi-factor authentication enforced on all\n' +
      ' remote access?”          [ yes ]   [ no ]\n' +
      'Signed by the town; the insurer relies on the answers.</pre>' +
      '<p class="small">A policy says what should happen. The identity system’s sign-in records say what was enforced, sign-in by sign-in; the exceptions list says who was left out.</p>',
    question: 'Was MFA enforced on all remote access at the time?',
    sources: [
      {id: 'policy', name: 'Policy IS-04', qs: [
        {q: 'What does the policy say?', kind: 'trap',
         res: ['IS-04 (game): “Multi-factor authentication is required for all remote access.” Approved 2024.', '(A policy says what should happen. It doesn’t show what the systems did.)']}]},
      {id: 'memory', name: 'Ask Audra Finch, the CIO', qs: [
        {q: 'Did everyone have MFA by then?', kind: 'trap',
         res: ['Audra: “Everyone had MFA by 2024. We rolled it out ourselves.”', '(Honest, and from memory. Records decide it.)']}]},
      {id: 'signin', name: 'Identity system: sign-in records', qs: [
        {q: 'What did fd-admin’s sign-ins pass with that night?', kind: 'focus', key: true,
         res: ['fd-admin’s sign-in from a hosting provider abroad: password only, one factor', 'MFA policy result: not applied; fd-admin was excluded through the group MFA-Exceptions', 'That week MFA was being enforced account by account, as the Key Badge reached each one: not on every account yet']}]},
      {id: 'except', name: 'The MFA exceptions list and its history', qs: [
        {q: 'Who was on the exceptions list then, and who approved it?', kind: 'focus', key: true,
         res: ['MFA-Exceptions, that night: one member, fd-admin, added in 2023 “for convenience”', 'No approver recorded, no expiry, no review', 'fd-admin removed the morning after the incident; the list has been empty since']},
        {q: 'Every sign-in for the month', kind: 'broad', rows: 61400,
         wall: ['{t}  r.okafor    MFA ok   town device', '{t}  t.reyes     MFA ok   town device', '{t}  l.zhao      MFA ok   home', '{t}  svc-backup  service  no MFA (service)']}]}
    ],
    ai: {everything: {text: 'Policy IS-04 requires MFA for all remote access, and the CIO confirms the rollout was complete in 2024. Answer: yes.', wrong: true,
                      reveal: 'Tally read the policy and the CIO’s recollection and answered yes. It never read the sign-in records, which show fd-admin passing on a password alone, or the exceptions list that left it out.'},
         specific: {q: 'Did the MFA policy apply to fd-admin’s sign-in from abroad?', text: 'No: fd-admin was excluded through MFA-Exceptions; the sign-in passed on a password alone.'}},
    verdicts: [
      {label: 'No: fd-admin was on the exceptions list, and its sign-in from abroad passed on a password alone', good: true, needs: 'signin',
       needsWhy: 'the exceptions list shows who was meant to be left out; only the sign-in records show what was enforced on the night.',
       why: 'The sign-in records show one factor; the exceptions list shows why.'},
      {label: 'Yes: policy IS-04 required MFA for all remote access from 2024, and the CIO says the rollout was complete', why: 'A policy and a memory say what should have been. The sign-in records show fd-admin passing on a password alone.'},
      {label: 'Yes, with a footnote: one admin account on an exceptions list is a detail the insurer can read about below', why: '“All” means all. One exempt admin account makes the true answer no, whatever the footnote says.'}],
    reasons: [
      {label: 'The MFA policy didn’t apply to fd-admin’s sign-in: MFA-Exceptions excluded it, with no approver or expiry', good: true, why: 'What was enforced, and why, each from its own record.'},
      {label: 'The CIO ran the MFA rollout herself and would surely remember any account that was left without MFA in 2024', why: 'Memory decides nothing; the list had no approver, so nobody had a reason to remember it.'},
      {label: 'IS-04 was approved in 2024, before the incident, so the town was covered by policy at the time', why: 'A policy on paper isn’t enforcement in the identity system.'}],
    alts: [
      {label: 'Another account on the exceptions list that night', good: true, why: 'Ruled out: the list had one member, fd-admin.'},
      {label: 'fd-admin passing a second factor the records missed', good: true, why: 'Ruled out: the policy result says not applied, and the sign-in shows one factor.'},
      {label: 'The insurer asking about a different incident', why: 'The question names the fd-admin incident.'},
      {label: 'MFA switched off town-wide that night', why: 'The records show MFA applied wherever it was enforced that night.'}],
    path: '<p>An attestation is decided by <b>the identity system’s sign-in records</b> for the period (what was enforced, sign-in by sign-in) and by <b>the exceptions list and its history</b> (who was left out, and on whose say). The policy and people’s memory say what should have happened.</p>',
    response: ['Answer no, with the record: fd-admin was on the exceptions list and its sign-in passed on a password alone', 'Say what changed: MFA enforced on fd-admin since the morning after, and the list empty since', 'Exceptions now need an approver and an expiry, and Bram’s committee reads the list every month', 'Noor reads the answer before it goes, because the town signs it'],
    techs: ['T1110.003'], acts: ['ccattest']
  }
};

/* ---------- Governance dojo (original puzzles; no NCL area) ---------- */
const CC_DOJO = [
  {q: 'The old badge-reader server can’t be patched until its replacement arrives in March. The vendor offers nothing. It sits on its own network segment with one rule in. What is the right treatment, until March?',
   opts: ['Accept it in writing: the facilities owner signs, the segment mitigates it, and it ends in March',
          'Transfer it: the cyber insurance pays out if anything goes wrong with the badge readers before March',
          'Avoid it: switch the badge readers off until March and have guards check badges by hand at every door'], good: 0,
   explain: 'Accept, mitigate, transfer and avoid are the four answers to a risk. Here the mitigation is already in place, so what is left is an owned, dated acceptance. Insurance moves part of a loss, never the risk itself; switching the readers off costs more than the risk.'},
  {q: 'Policy draft: “MFA is required for all remote access. — IT.” What is missing that matters most?',
   opts: ['How exceptions work: who may approve one, for how long, and who reads the list',
          'A list of which MFA apps staff may install, and on which phone models',
          'A paragraph on why MFA matters, so staff understand it, with the latest statistics on stolen passwords'], good: 0,
   explain: 'fd-admin sat on an exceptions list with no approver and no expiry, under a policy that said “all”. A policy needs an owner, a review date and an exceptions process; app lists and statistics belong in guidance, not policy.'},
  {q: 'Write the one-line ask to the council.',
   opts: ['Approve $40,000 for night monitoring: it cuts a modelled nine hours off finding a night-time intrusion',
          'We urgently need night monitoring, because attacks are rising sharply across the country this year',
          'Please note the team’s recommendation on 24/7 SOC coverage, MTTD and SIEM ingest in appendix C'], good: 0,
   explain: 'One line: what you want, what it costs, what it changes, in words the council uses. Fear without numbers and jargon in an appendix both leave the decision with you, where it doesn’t belong. (Figures are game.)'}
];

/* ---------- Council Board (original; the Mayor; three rounds, judged by the council) ---------- */
const CC_BOARD_SPECS = () => [
  {title: 'Round 1: the funding request', who: 'Mayor Dalia Merrin',
   ask: 'You ask for $40,000 a year for night monitoring (game). Make the case.',
   resp: [{label: 'The case in their terms: what a night intrusion costs us, what the money changes, and when you report back', good: true},
          {label: 'A warning: without it, ransomware will shut the town down within a year, so there is really no choice', why: 'Fear without numbers forces a decision instead of informing one, and the council can’t weigh it against roads.'},
          {label: 'The figures: our MTTD in hours, 61 log sources, a 24/7 SOC tier, and the SIEM ingest rate per day', why: 'Accurate, and meaningless to the people deciding. Say what it costs and what it changes.'}]},
  {title: 'Round 2: do we tell residents?', who: 'Councillor Bram Whitlock',
   ask: 'Bram, in session: “The planning applications those criminals published this morning. Do we have to tell people? Can we say yes now?”',
   resp: [{label: 'Noor decides what the law requires and whom; we give her the facts today, and nothing is announced first', good: true},
          {label: 'Yes, say so now: telling residents straight away is always the honest course, whatever the law says', why: 'Honest intentions, wrong order: an announcement before counsel reads the facts can be wrong, incomplete, or premature.'},
          {label: 'No need to say anything at all until the investigation is over, every fact is settled and nothing can change', why: 'That decision isn’t yours to make by default. Notification deadlines can run while you wait; Noor decides.'}]},
  {title: 'Round 3: what changes now?', who: 'Mayor Dalia Merrin',
   ask: 'After the press story, the Mayor asks: “So what changes, and how will we know?”',
   resp: [{label: 'Three actions, each with an owner and a date, so the council sees them closed', good: true},
          {label: 'A new tool: the vendor demo showed it would have caught the whole thing in minutes', why: 'A purchase isn’t a change. Who does what, by when, and how the council sees it done.'},
          {label: 'Nothing on our side: the criminals took the files, and the press got the numbers wrong', why: 'Both true, and neither is a lesson. Every incident leaves actions with owners.'}]}
];

/* ---------- The boss: a town-wide incident, played as incident command (game-original) ---------- */
// Stages are command decisions, not hands-on battles. Every wrong option is one the spec names: the lead doing
// everything personally, briefing with guesses, promising "no data was taken" before evidence, paying or announcing
// without counsel, and wiping or rebuilding before preserving.
function ccBossStages() {
  return {
    s1: {title: 'Stage 1 (00:50): stand up command',
      clues: ['23:52: an inbox rule in t.ashby’s mailbox moves replies from IT and security to an archive folder (Bea’s team).', '00:20: a remote-management tool nobody approved is running on DS-LT-03, Tess Ashby’s town laptop, on the VPN from her home (Ruth’s team).', '00:45: t.ashby’s admin account, from DS-LT-03, starts an export of the resident table on PORTAL-01 (Paz’s team).'],
      ask: 'One account, one laptop, three districts. You are the incident commander. What do you do first?',
      resp: [{label: 'Take command: Paz stops the export, Ruth takes the laptop off the network powered on, Beatriz the account, Bea the rule', good: true},
             {label: 'Run it yourself: you know every district, and you can work through the night faster than waking five leads', why: 'One person becomes the bottleneck for three districts at once, and nobody else knows what has been done. Command, then assign.'},
             {label: 'Unplug the laptop, take the whole portal offline, and wake the leads in the morning to work out who does what', why: 'Unplugging loses the laptop’s memory, a portal outage hits every resident, and nobody is assigned while the attacker is active.'},
             {label: 'Let it run until morning and watch: the export shows us what they want, and the leads need their sleep', why: 'The export is the data leaving. Stop it now; watching is what the timeline is for afterwards.'}]},
    s2: {title: 'Stage 2 (08:00): brief the council',
      clues: ['00:58: Paz stopped the export. t.ashby is disabled and its sessions revoked; DS-LT-03 is off the network, still powered, its memory and disk copied.', '02:10: Magda’s flow records show DS-LT-03 sent 9 MB to 198.51.100.150, a file-sharing service the town doesn’t use, at 00:51–00:53.', 'What the 9 MB held is not known yet: Ruth will have read the laptop’s copies by 13:00.'],
      ask: 'Emergency session at 08:00. The facts are incomplete. What do you tell the council?',
      resp: [{label: 'What we know: what happened, what is contained, that 9 MB left and we don’t yet know what it held; next update 14:00', good: true},
             {label: 'That no resident data was taken: the export was stopped at 00:58, before it could finish', why: '9 MB left at 00:51–00:53, before the stop. A promise made before the evidence is read is a guess, and this one may be false.'},
             {label: 'The full technical picture: likely an initial-access broker, probably the whole resident table, at least 40,000 rows', why: 'Jargon and guesses. The council needs what we know, what we don’t, and when they’ll hear more.'},
             {label: 'Nothing yet: ask to brief them once the forensic copy is read and everything is certain', why: 'The council needs to hear it from us first, with a time for the next update; silence fills with rumour.'}]},
    s3: {title: 'Stage 3 (14:00): recover, and hand legal the question',
      clues: ['13:00, Ruth’s read-out: the 9 MB was the export file, 18,600 resident rows: names, email addresses, street addresses. No card data: card entry is on the processor’s page.', '13:20: an email to Ada: pay, or the file is published.', 'Paz wants resident services on PORTAL-01 back today; Tess’s manager wants her laptop back.'],
      ask: 'Recovery order and the notification question. Which plan do you take to the owners and to Noor?',
      resp: [{label: 'The owners set the order: portal first via a clean admin path, laptop rebuilt after its copies; Noor decides notice', good: true},
             {label: 'Announce this evening that 18,600 residents’ details were stolen, so the criminals can’t get ahead of the town’s own story', why: 'An announcement before Noor has decided can be wrong or premature. She decides who must be told and when; Ada writes it.'},
             {label: 'Pay quietly through the insurance so the file is never published, and say nothing either way', why: 'A payment buys a promise from the people who stole it, and it is the Mayor’s decision with Noor and law enforcement, never a quiet one.'},
             {label: 'Rebuild DS-LT-03 and the portal in the order the team prefers, as fast as the team can manage', why: 'The business owners set the order, and the laptop is rebuilt only once its copies are kept. Fast and unowned is how mistakes get made.'}]}
  };
}

/* ---------- The Quiet Thread hand-off (story choice) ---------- */
// (Its options live in council-quiet.js.)

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  ccplan: {name: 'A one-page incident response plan', desc: 'Name who commands, who leads the technical work, who advises on the law, who speaks for the organisation and who decides on high-impact actions, each with a deputy and a phone number; say who decides what. Keep it to a page people will read, and practise it. (The role names are the game’s; see Facts: SP 800-61 Rev. 3.)'},
  ccrisk: {name: 'A risk register with owners', desc: 'For each risk: a description, likelihood and impact, a decision (accept, mitigate, transfer or avoid), a review date, and an owner from the business who would carry the loss. The security team runs controls; it doesn’t own every risk.'},
  ccdelegate: {name: 'Delegate by skill and load', desc: 'Give each case to a lead with the skill and the room to take it, and read what comes back: a close must name its decisive source. A lead who is full makes the case wait; a lead without the skill hands it back.'},
  ccbrief: {name: 'Brief leaders in plain words', desc: 'What happened, the impact on the people you serve, what you are doing, what you need from them, and when they will next hear from you. No jargon, no guesses, and a time for the next update even when the news is incomplete.'},
  ccreview: {name: 'Review the work, not the person', desc: 'To review a close, read the query log (which sources were reached) and run the decisive query if it is missing. Seniority and certainty decide nothing. Coach in private; change the template so the next close cites its source.'},
  ccpress: {name: 'Check a press claim against your own records', desc: 'Compare what the story claims with your incident records and the named system’s logs. Answer with what you know, what you don’t yet, and when you will update; never a number you can’t back, never a flat denial.'},
  ccattest: {name: 'Answer an attestation from records', desc: 'When an insurer or auditor asks whether a control was in force, answer from the system’s own records for that period and its exceptions list, not from the policy or anyone’s memory. Counsel reads the answer before it is signed.'},
  ccriskbiz: {name: 'Present risk in business terms', desc: 'Say what a cut or a purchase changes, in money, hours of service and likelihood, with the options; let the people accountable decide and record who owns the risk they accept.'},
  cccommand: {name: 'Incident command', desc: 'One commander, named leads for each part, legal and communications in the room from the start, the executive told. The commander assigns, keeps the timeline and briefs; the leads do the hands-on work. Preserve before you wipe; the owners set the recovery order; counsel decides notification.'}
});
Object.assign(FACTS, {
  cccsf: {name: 'NIST CSF 2.0: the Govern function', desc: 'CSF 2.0 (February 2024) has six Functions. Govern covers how an organisation’s cybersecurity risk management strategy, expectations and policy are set, communicated and monitored. Its Categories: Organizational Context (GV.OC), Risk Management Strategy (GV.RM), Roles, Responsibilities, and Authorities (GV.RR), Policy (GV.PO), Oversight (GV.OV) and Cybersecurity Supply Chain Risk Management (GV.SC). GV.RR-01 says leadership is responsible and accountable for cybersecurity risk.', src: 'NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (26 February 2024)'},
  ccregister: {name: 'Risk registers and risk responses (CSF 2.0 examples)', desc: 'NIST’s CSF 2.0 implementation examples suggest templates such as a risk register to record each risk’s description, exposure, treatment and ownership (GV.RM-06), deciding whether to buy cybersecurity insurance (GV.RM-04), and criteria for deciding whether to accept, transfer, mitigate or avoid a risk (ID.RA-06).', src: 'NIST, CSF 2.0 Implementation Examples (February 2024)'},
  cc80061: {name: 'NIST SP 800-61 Rev. 3: incident response roles', desc: 'SP 800-61 Rev. 3 (April 2025), a CSF 2.0 Community Profile that replaces Rev. 2 (2012), lists example incident response roles: leadership (oversees the response, allocates funding, and may decide on high-impact actions), incident handlers, technology professionals, legal, public affairs and media relations, human resources, physical security and facilities management, and asset owners. It does not use the term “incident commander”: the town’s role names are the game’s. It recommends notifying law enforcement and regulators based on criteria in the incident response plan, and notifications in line with applicable laws.', src: 'NIST SP 800-61 Rev. 3, Incident Response Recommendations and Considerations for Cybersecurity Risk Management (April 2025)'},
  ccnice: {name: 'Your new role in the NICE Framework', desc: 'The NICE Framework has no work role for a security team lead. The closest is Incident Response (PD-WRL-003): “Responsible for investigating, analyzing, and responding to network cybersecurity incidents”, whose tasks include coordinating incident response functions (T0510). Leading people and budgets sits higher, in Executive Cybersecurity Leadership (OG-WRL-007), which this edition doesn’t play. Legal advice is its own role, Cybersecurity Legal Advice (OG-WRL-006).', src: 'NIST, NICE Framework work roles (SP 800-181 Rev. 1; components v2.2.0, April 2026); NICCS work role page'},
  ccctep: {name: 'CISA Tabletop Exercise Packages (CTEP)', desc: 'CISA publishes tabletop exercise packages that organisations can use to run their own exercises: template objectives, scenarios and discussion questions, references, and templates for invitations, facilitators, participants, feedback and an after-action report. Cyber scenarios include ransomware, insider threats, phishing and industrial control system compromise, with sector scenarios for local governments and water among others.', src: 'CISA, CISA Tabletop Exercise Packages'},
  cccircia: {name: 'CIRCIA: where it stands (1 November 2026)', desc: 'The Cyber Incident Reporting for Critical Infrastructure Act of 2022 will require covered critical-infrastructure entities to report covered cyber incidents to CISA within 72 hours, and ransom payments within 24 hours, once CISA’s final rule takes effect. CISA proposed the rule on 4 April 2024. As of 1 November 2026 the final rule has not been published, and nobody is required to report under CIRCIA until it takes effect; CISA asks for voluntary reports meanwhile. Whether the town or its water plant would be covered is a question for counsel.', src: 'CISA CIRCIA page; Federal Register NPRM 89 FR 23644 (4 April 2024); Unified Agenda RIN 1670-AA04'}
});
GAME_NOTES.push(
  'Council Chambers has no new alerts and no cabling: queued alerts recycle the earlier districts’ types. The delegation mini-game’s leads, skills, loads, capacities and times (4 game minutes for a lead with the skill and room, +8 when the lead is full, +12 when the lead lacks the skill) are invented. (game)',
  'Security team lead scorecard: mean time to assign, the busiest person’s load as a share of capacity, decisions in the council’s log with a named owner, council briefings on time, and post-incident actions closed. All starting figures and their changes are invented. (game)',
  'The Charter Badge: every queued alert arrives with its district lead’s first look (Evidence starts at 15), and Focus rises to 52. (game)',
  'Every person, risk, sum of money, policy number, host, address and timing in Council Chambers is invented, and so is the town-wide incident. The game never says what any law requires: Noor, the town attorney, decides notification. (game)'
);
