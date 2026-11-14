/* ============================================================
   UPTIME · editions/charter/data.js
   Charter (edition 3, the CISO): base tables the shared engine needs, the
   maps (the Compact offices and the Compact Board room), the people met there,
   Field Manual text and the game notes. Charter has no wild alerts: no
   cabling, no alert mix (THREATS is empty), no ATT&CK technique in this slice.
   Its loops are the risk register, the appetite statement, the budget, drills
   whose evidence is records, the Board and its acceptances.
   People, the Compact's numbers, accounts, counts, times, prices and ratings are
   invented (game). Real facts are cited in CREDITS.md, section "Charter".
   Timeline: scratchpad charter-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

/* ---------- Palettes (people met in Crossroads keep their Crossroads colours) ---------- */
Object.assign(PAL, {
  chReg: ['#1b2233', '#6e2a2a', '#c05a5a', '#f2d7d7'],
  chRegOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  chDesk: ['#1b2233', '#2a3550', '#5a6fa0', '#d7dbe4'],
  chDojo: ['#0b2b33', '#1f6f78', '#7cc6c4', '#ffd96a'],
  chFile: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  chMinutes: ['#1b2233', '#4a3a6e', '#8a7ac0', '#e0d8f7'],
  chTable: ['#1b2233', '#1f4a6e', '#5f9fd6', '#dbeaf7'],
  thornquist: ['#1a1a2e', '#3a1d10', '#e0b090', '#2a5a5a'],
  penhallow: ['#1a1a2e', '#8c8c8c', '#f0c8a0', '#2a2a4a'],
  solano: ['#1a1a2e', '#3b2418', '#c98a54', '#3a6e8a'],
  noor: ['#1a1a2e', '#141414', '#a8703f', '#3a4a6b'],
  ferreday: ['#1a1a2e', '#3b2418', '#c98a54', '#2a5a8a'],
  fanshawe: ['#1a1a2e', '#5b3a26', '#f0c8a0', '#6e2a4a']
});

/* ---------- Tiles (single UTF-16 units, so map rows keep their lengths) ---------- */
Object.assign(TILES, {
  'µ': {spr: 'K', pal: 'chReg', solid: true},                       // the risk register on the wall
  'Ɓ': {spr: 'counter', pal: 'chDesk', solid: true, under: ','},   // desks (identity, shared services, finance)
  '¤': {spr: 'pc', pal: 'chDojo', solid: true, under: ','},        // the Risk & Budget terminals
  '£': {spr: 'K', pal: 'chFile', solid: true},                       // the contracts and quotes cabinet
  '±': {spr: 'K', pal: 'chMinutes', solid: true},                    // the Board room's shelves of minutes
  'Ɠ': {spr: 'counter', pal: 'chTable', solid: true, under: ','}    // the Board table
});

/* ---------- Maps: the Compact offices and the Compact Board room ---------- */
// The offices sit beside the operations room. North wall: the risk register (west), the identity desk, the shared-services
// desk, the finance desk, the contracts cabinet (east). West door: the Compact Board room. South: the Risk & Budget
// terminals (west) and your desk (east).
const MAPS = {
  choffice: {
    name: 'The Compact offices',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,µµµ,,,,,,,ƁƁ,,,,ƁƁ,,,,ƁƁ,££w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,¤,¤,¤,,,,,,,,,,,,,,,,,,Y,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'0,6': {to: 'chboard', x: 16, y: 5, dir: 'left'}}
  },
  chboard: {
    name: 'The Compact Board room',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w±±,,,,,,,,,,,,±±w",
      "w±±,,,,,,,,,,,,±±w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,D",
      "w,,,ƓƓƓƓƓƓƓƓƓƓ,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'17,5': {to: 'choffice', x: 1, y: 6, dir: 'right'}}
  }
};
const CH_MAPS = ['choffice', 'chboard'];
const GROUPS = {};          // no building groups: Charter has no baseline-hardening metric
const ACCOUNTS_TOTAL = 1;   // unused (no MFA metric here)

/* ---------- People ---------- */
const NPCS = [
  {id: 'penhallow', name: 'Ivor Penhallow', role: 'chair of the Compact Board', map: 'chboard', x: 8, y: 3, dir: 'down', pal: 'penhallow'},
  {id: 'noorch', name: 'Noor Castellanos', role: 'town attorney, counsel for the town and the shared services', map: 'chboard', x: 4, y: 4, dir: 'down', pal: 'noor', cond: G => !G.f.chAppetite || (!!G.f.chDay66 && !G.f.chBoard)},
  {id: 'beatrizch', name: 'Beatriz Solano', role: 'identity team lead (the shared directory)', map: 'choffice', x: 12, y: 2, dir: 'down', pal: 'solano'},
  {id: 'edda', name: 'Edda Thornquist', role: 'the Compact’s shared-services director', map: 'choffice', x: 18, y: 2, dir: 'down', pal: 'thornquist'},
  {id: 'fanshawe', name: 'Oriel Fanshawe', role: 'the Compact’s finance director', map: 'choffice', x: 24, y: 2, dir: 'down', pal: 'fanshawe'},
  {id: 'ferreday', name: 'Joanna Ferreday', role: 'airport manager, the Regional Airport', map: 'choffice', x: 6, y: 3, dir: 'left', pal: 'ferreday', cond: G => !!G.f.chAlloc && !G.f.chDirective}
];

/* ---------- No ATT&CK technique and no wild alerts in this slice (the engine's alert tables stay empty) ---------- */
const TECH = {};
const THREATS = {};
const MAL_WEIGHTS = [];
const HOSTS = ['CP-OPS-02'];
const ALERTS = {};
const ALERT_CHAINS = {};
const BRIEFS = [];
const QT_CLUES = {};        // no new Quiet Thread clue in this slice; notes found earlier are counted in the series record

/* ---------- Field Manual ---------- */
const EXTRA_ACTIONS = {
  chremit: {name: 'Know who decides', desc: 'The CISO owns the risk programme, the register, policy and reporting to the governing body, and advises everyone else. Operations are run by their owner, each member decides for itself, and counsel decides legal questions. Name one decider for each decision.'},
  chappetite: {name: 'An appetite with measurable tolerances', desc: 'Say, for each kind of risk, how much the organisation will carry (the appetite), then turn it into limits anyone can measure (the tolerances). The governing body approves it, and every later decision is measured against it.'},
  chowner: {name: 'A named owner and a review date for every risk', desc: 'Each risk in the register has one named business owner (a person, not a department) and a date when it is next reviewed. A risk nobody owns is a risk nobody decides about.'},
  chclaim: {name: 'Check a claim against the records', desc: 'A claim in a funding request is checked like a finding: read the policy’s exceptions and the records of what actually happened. Correct the paper before it reaches the board.'},
  chmeasure: {name: 'Did the spend work?', desc: 'Compare the measure the spend was meant to move, before and after, and list what else changed in between. Credit is shared with every other change; two incidents are a sample, not a trend.'},
  chquote: {name: 'A quote against the requirement', desc: 'Read each quote’s scope against the written requirement line by line. Price comes after cover: a cheaper quote that leaves part of the requirement out buys less, not the same for less.'},
  challoc: {name: 'Budget as risk allocation', desc: 'Spend follows the register. For each line show the cost, the risk left after it (the residual) and the appetite it is measured against, so the board can see what each choice buys and what it leaves.'},
  chaccept: {name: 'A risk acceptance, signed by its owner', desc: 'A risk left above appetite stays only with an acceptance signed by its business owner, with an expiry, a review date and any interim measures. The CISO writes it up and records it; the CISO does not sign for someone else’s risk.'},
  chboard: {name: 'Both cases, in business terms', desc: 'When two asks compete for one budget, present both the same way: what each costs, what it buys and what risk each leaves against the approved appetite. Then the board decides.'}
};
const FACTS = {
  chnice: {name: 'CISO in the NICE Framework', desc: 'The closest NICE work role is Executive Cybersecurity Leadership (OG-WRL-007). Its tasks include T1227, “Manage cybersecurity budget, staffing, and contracting”; T1059, “Perform cost/benefit analyses of cybersecurity programs, policies, processes, systems, and elements”; T1060, “Advise senior management on organizational cybersecurity efforts”; T1088, “Communicate the value of cybersecurity to organizational stakeholders”; and T1906, “Establish a cybersecurity risk management program”. “CISO” is a job title: NICE work roles group work and carry no title or seniority.', src: 'CISA NICCS, Executive Cybersecurity Leadership work role page and task pages T1059 and T1060 (the role page shows NICE Framework version 2.0.0); NIST NICE Framework Components v2.1.0 (3 December 2025) and v2.2.0 (28 April 2026) summaries of changes, which list no change to this role or these tasks'},
  chcsf: {name: 'Risk appetite and resources in CSF 2.0 Govern', desc: 'CSF 2.0 subcategory GV.RM-02: “Risk appetite and risk tolerance statements are established, communicated, and maintained”. One of NIST’s implementation examples for it: “Translate risk appetite statements into specific, measurable, and broadly understandable risk tolerance statements”. GV.RR-03: “Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies”, with the example “Identify resource allocation and investment in line with risk tolerance and response”.', src: 'NIST, CSF 2.0 Implementation Examples (26 February 2024)'}
};
const GAME_NOTES = [
  'Charter keeps the series’ day count from Crossroads (Day 1 was Crossroads’ first Monday), so Charter starts on Day 64, a Monday, and every recalled Crossroads date keeps its number. (game)',
  'The Compact Board’s appointment of a CISO, the reporting line, the remit, the risk register, its six lines, ratings, ranks, owners and options, the appetite scale (Low: only a Low residual is within appetite; Moderate: Medium or Low), every tolerance, the $480k budget, every price and the two quotes are invented. (game)',
  'The Board’s rule when it overrides an allocation (the upgrade in full, the service-account review and the restore space deferred, then the payment line and vendor access trimmed if the total is still over, the 911 center’s line never cut) is invented. (game)',
  'Every person, the Riverbend Shared Services Compact, its members, accounts (fin-ap, board-display, the group MFA-Exempt), counts and times are invented. Recalled Crossroads facts are quoted from Crossroads. (game)',
  'Charter never says what any law requires. Counsel decides legal questions: Noor for the town and the shared services, each member’s own counsel for that member. (game)',
  'The carry-over effects (Focus +2 for each Crossroads track played, +2 if Crossroads was finished) and the Plumb Badge’s effects (every register line arriving with its owner and review date; Focus +4) are invented. (game)'
];
