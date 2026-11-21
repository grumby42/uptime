/* ============================================================
   UPTIME · editions/charter/data.js
   Charter (edition 3, the CISO): base tables the shared engine needs, the
   maps (the Compact offices and the Compact Board room), the people met there,
   Field Manual text and the game notes. Charter has no wild alerts: no
   cabling, no alert mix (THREATS is empty), no ATT&CK technique in this slice.
   Its loops are the risk register, the appetite statement, the budget, drills
   whose evidence is records, the Board and its acceptances, the supplier
   register, (District 3) the exception register and the policy library,
   (District 4) the Board report, and (the finale) the disclosure clock, the
   facts packets and the decision log.
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
  chExc: ['#1b2233', '#4a4a24', '#a8a050', '#f2edc8'],
  thornquist: ['#1a1a2e', '#3a1d10', '#e0b090', '#2a5a5a'],
  penhallow: ['#1a1a2e', '#8c8c8c', '#f0c8a0', '#2a2a4a'],
  solano: ['#1a1a2e', '#3b2418', '#c98a54', '#3a6e8a'],
  noor: ['#1a1a2e', '#141414', '#a8703f', '#3a4a6b'],
  ferreday: ['#1a1a2e', '#3b2418', '#c98a54', '#2a5a8a'],
  quellan: ['#1a1a2e', '#5b3a26', '#f0c8a0', '#6e2a4a'],
  thrushcombe: ['#1a1a2e', '#2a2a2a', '#e0b090', '#4a6e3a'],
  strand: ['#1a1a2e', '#2b1d16', '#a8703f', '#6e2a4a'],   // Director Mina Strand keeps her Crossroads colours
  ada: ['#1a1a2e', '#5b3a26', '#e0b090', '#b8432f']        // Ada Pemberton keeps her Town Hall colours
});

/* ---------- Tiles (single UTF-16 units, so map rows keep their lengths) ---------- */
Object.assign(TILES, {
  'µ': {spr: 'K', pal: 'chReg', solid: true},                       // the risk register on the wall
  'Ɓ': {spr: 'counter', pal: 'chDesk', solid: true, under: ','},   // desks (identity, shared services, finance)
  '¤': {spr: 'pc', pal: 'chDojo', solid: true, under: ','},        // the Risk & Budget terminals
  '£': {spr: 'K', pal: 'chFile', solid: true},                       // the contracts and quotes cabinet
  '±': {spr: 'K', pal: 'chMinutes', solid: true},                    // the Board room's shelves of minutes
  'Ɠ': {spr: 'counter', pal: 'chTable', solid: true, under: ','},   // the Board table
  'Ξ': {spr: 'K', pal: 'chExc', solid: true}                         // the exception register (District 3)
});

/* ---------- Maps: the Compact offices and the Compact Board room ---------- */
// The offices sit beside the operations room. North wall: the risk register (west), the exception register, the identity
// desk, the shared-services desk, the finance desk, the contracts cabinet (east). West door: the Compact Board room. South: the Risk & Budget
// terminals (west) and your desk (east).
const MAPS = {
  choffice: {
    name: 'The Compact offices',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,µµµ,,ΞΞ,,,ƁƁ,,,,ƁƁ,,,,ƁƁ,££w",
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
  {id: 'noorch', name: 'Noor Castellanos', role: 'town attorney, counsel for the town and the shared services', map: 'chboard', x: 4, y: 4, dir: 'down', pal: 'noor', cond: G => !G.f.chAppetite || (!!G.f.chDay66 && !G.f.chBoard) || (!!G.f.chSupThu && !G.f.chSupBoard) || (!!G.f.chPolCheck && !G.f.chPolBoard) || (!!G.f.chRepDay87 && !G.f.chRepBoard) || chFinNoorBoard(G)},
  {id: 'beatrizch', name: 'Beatriz Solano', role: 'identity team lead (the shared directory)', map: 'choffice', x: 12, y: 2, dir: 'down', pal: 'solano'},
  {id: 'edda', name: 'Edda Thornquist', role: 'the Compact’s shared-services director', map: 'choffice', x: 18, y: 2, dir: 'down', pal: 'thornquist'},
  {id: 'quellan', name: 'Marit Quellan', role: 'the Compact’s finance director', map: 'choffice', x: 24, y: 2, dir: 'down', pal: 'quellan'},
  {id: 'ferreday', name: 'Joanna Ferreday', role: 'airport manager, the Regional Airport', map: 'choffice', x: 6, y: 3, dir: 'left', pal: 'ferreday', cond: G => !!G.f.chAlloc && !G.f.chDirective},
  // Suppliers (slice 2): Joanna again on Wednesday (Tarnfield's clause), and Ilka Thrushcombe, procurement, by the cabinet.
  {id: 'ferredaysup', name: 'Joanna Ferreday', role: 'airport manager, the Regional Airport', map: 'choffice', x: 6, y: 3, dir: 'left', pal: 'ferreday', cond: G => !!G.f.chSupDay72 && !G.f.chSupDirective},
  {id: 'thrushcombe', name: 'Ilka Thrushcombe', role: 'the Compact’s procurement lead', map: 'choffice', x: 27, y: 3, dir: 'up', pal: 'thrushcombe', cond: G => !!G.f.chSupDrillC && !G.f.chSupBoard},
  // Policy (slice 3): the Library's Director, by the risk register on Wednesday (the directive). Met in Crossroads.
  {id: 'strand', name: 'Director Mina Strand', role: 'library director', map: 'choffice', x: 6, y: 3, dir: 'left', pal: 'strand', cond: G => !!G.f.chPolReplies && !G.f.chPolDirective},
  // The finale: Noor by the window in the offices (the members' call, her determination, her terminals), and in the Board
  // room for the statement and the debrief; Ada Pemberton, the town's communications officer (met in Town Hall), in the
  // Board room, advising the chair on the Compact's statement.
  {id: 'noorfin', name: 'Noor Castellanos', role: 'town attorney, counsel for the town and the shared services', map: 'choffice', x: 21, y: 3, dir: 'down', pal: 'noor', cond: G => !!G.f.chFinStart && !G.f.chFinDay94 && !chFinNoorBoard(G)},
  {id: 'ada', name: 'Ada Pemberton', role: 'communications officer, the town', map: 'chboard', x: 12, y: 4, dir: 'down', pal: 'ada', cond: G => chFinNoorBoard(G)}
];
// Noor (and Ada) are in the Board room for the chair's statement (Wednesday 12:00) and the debrief (Thursday 14:00).
function chFinNoorBoard(G) { return (!!G.f.chFinPacket3 && !G.f.chFinStatement) || (!!G.f.chFinDay94 && !G.f.chFinBoard); }

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
  chaccept: {name: 'A risk acceptance, signed by its owner', desc: 'A risk left above appetite stays only with an acceptance signed by its business owner, with an expiry, a review date and any interim measures; a risk the governing body decides to carry above its own appetite is also minuted as the governing body’s decision, and approved by it. The CISO writes it up and records it; the CISO does not sign for someone else’s risk.'},
  chboard: {name: 'Both cases, in business terms', desc: 'When two asks compete for one budget, present both the same way: what each costs, what it buys and what risk each leaves against the approved appetite. Then the board decides.'},
  // Suppliers (slice 2)
  chdataflow: {name: 'A supplier’s access, from the records', desc: 'Whether a supplier holds your data, and whether it can reach your systems, is read from the data-flow record and the account lists, not from its questionnaire. A questionnaire says what the supplier believes.'},
  chtier: {name: 'Tier suppliers by what breaks and what they hold', desc: 'Tier each supplier by what stops for residents if it stops, and by what it holds or can reach, never by the size of its invoice. The biggest supplier is often not the most critical one.'},
  chattest: {name: 'An assurance report: its scope and its dates', desc: 'A clean report is clean about what it looked at, when it looked. Read its scope against the service you use, and its period against how recent your requirement says it must be.'},
  chvendorir: {name: 'A supplier’s incident, from your side', desc: 'Find what the supplier can reach in your systems, suspend that access while the evidence stays (suspending destroys nothing), ask for the facts you need with times, say only what the records show, check your own logs and edge too, and give access back when the evidence covers the latest activity, measured against your tolerances. Counsel decides any notice; the supplier’s root cause is its own.'},
  chclock: {name: 'The clock starts where the contract says', desc: 'A notification clause names its trigger (detecting, confirming, becoming aware) and who must receive the notice. Count from that trigger, in the supplier’s own stated time, to when the named contact had it: not from the time either side prefers.'},
  chclause: {name: 'Security requirements in the contract, by tier', desc: 'Each tier has its must-have clauses. Price them within the money, ask each supplier for no more than it will give, and where your plan leaves a must-have out, that is your recommendation: its business owner decides on it and signs an acceptance with an expiry, a review date and an interim measure. Leaving one out when the money covers it is poor advice. Procurement and counsel hold the contract.'},
  chsupboard: {name: 'Suppliers in the board’s language', desc: 'Tell the board which suppliers matter most and why, what a missing clause cost in time, and whose decision each contract is. A member’s own contracts are its owner’s to decide.'},
  // Policy (slice 3)
  chpolcycle: {name: 'The policy lifecycle', desc: 'Draft, consult (each consultee answers for its own part, and legal wording is counsel’s), approve (the governing body approves the policy; the CISO issues the standards under it), publish, measure, and review on a date. One decider per step.'},
  chpolvalid: {name: 'Is the exception still valid?', desc: 'Read its expiry date and its review record. That nobody complained, or that the system still lets the account in, says nothing. An expired exception is not open: its owner closes it, or renews it through the route with fresh evidence.'},
  chexcreg: {name: 'An exception register', desc: 'Each exception: the clause, the exact accounts or systems, the reason, the compensating controls, its owner, its approver by the policy’s own rule, a start, an expiry no more than 12 months on, a review date, its tolerance line, and its status. The owner asks for it and signs for running the control; who decides follows the CISO’s check: a standard one, the owner; an escalated one (the CISO against, a partial control, a broken tolerance, safety-of-life or personal records, a second renewal), someone above the owner. The CISO writes it up, checks it and recommends.'},
  chpolcover: {name: 'Does the control cover the gap?', desc: 'Read the control’s scope (what it applies to) and the records for the excepted accounts (whether it applied). Where people happened to sit is not a control.'},
  chpolmeasure: {name: 'Is the policy followed?', desc: 'Measure the records against the document’s own wording, by a plan set before they are drawn (the population, the period, the size, how they are picked; every record where there are fewer than 50). Records with misses in them prove “not as written”; a clean sample would not prove the opposite. An attestation says what someone believes; an outcome that went well says nothing about the rule.'},
  chexcroute: {name: 'Exceptions through the route', desc: 'A permanent exception is not one: a difference meant to last goes to the standard’s review. An exception has an owner who signs, an expiry, a review and a control that covers the gap, and is decided by whoever the rule names. The CISO does not grant it.'},
  chpolboard: {name: 'The register in the board’s language', desc: 'Tell the board what the register shows: each exception’s owner, dates and control, and any past its expiry. A policy that says “all” needs a register that is read.'},
  // The Board report (slice 4)
  chrepmfa: {name: 'A line checked like a finding', desc: 'Before a line goes into a report, read it against the records it stands on. “Every” is said only where the record says every: name the exceptions, briefly.'},
  chrepsup: {name: 'A trend needs two measures', desc: 'A first measure is a baseline, not a fall or a rise. A plan or a request is what is sought; a signed contract is what is in place.'},
  chrepwho: {name: 'Who decided, as minuted', desc: 'The minute says who decided; the acceptance says who signed, and for what. A report names both, from the records, and never moves a decision to the person who signed for the checks.'},
  chrepdir: {name: 'What the board knows still goes in', desc: 'Every risk the board carries above appetite goes on the page each time, in one line with the minute’s reference. The report states it; it doesn’t argue it.'},
  chrepbuild: {name: 'One page and an annex', desc: 'A report to the board is one page in its terms, every line tied to a dated record in the annex: risks against appetite and who accepted them, what changed, the decisions it must take with one decider each and your recommendation, exceptions due and expired, supplier gaps and asks. Leaving out a required item is worse than a dull line.'},
  chrepboard: {name: 'Answering the board from the records', desc: 'When a member questions a line, answer from its record. A line the record does not support is corrected in the minute, in the wording the record supports.'},
  // The finale (slice 5)
  chfinlog: {name: 'Open the incident log at once', desc: 'The first record of an incident starts the plan’s clocks. Open the log when the notice is in, not when everyone agrees it is an incident or when a supplier confirms it: a clock that starts late is still late.'},
  chfincontain: {name: 'Contain without destroying evidence', desc: 'Pausing a supplier’s feed or access destroys nothing, so it is not delayed for an export or an answer. Keep the logs and your own copies as they are; delete nothing on either side. The platform’s owner decides, on the CISO’s recommendation.'},
  chfinhold: {name: 'What a supplier holds, from your own records', desc: 'In a supplier’s incident, read what it holds of yours from your own data-flow record and the job that feeds it, not from its notice or the contract.'},
  chfinedge: {name: 'Did anything reach us?', desc: 'Read your account lists and your edge log for the supplier’s range. A register says what was set up; a view is a view; logs say what happened, for your side only.'},
  chfinpacket: {name: 'A facts packet for counsel', desc: 'At each checkpoint: what is known, what is not known, since when, and from which record, one row each. What is not known goes in, stated as not known. No “likely” as fact, no silence read as “no”, no claim about another party’s cause, and every decision named with its own decider. It goes to counsel directly, on time.'},
  chfinroute: {name: 'One decider per decision, in an incident', desc: 'Containment on a shared platform is its director’s; any legal duty to notify is counsel’s, each member’s own for that member; the public statement is the chair’s, on counsel’s and communications’ advice; a member’s service is its leadership’s. The CISO decides what the facts say, recommends, and decides no disclosure.'},
  chfindirective: {name: 'Facts go to counsel, unknowns included', desc: 'When someone asks to hold the facts back until they look complete, or to word them so the open question disappears, the facts still go to counsel at the checkpoint, with what is not known stated as not known. Counsel decides on both.'},
  chfinclock: {name: 'The clock starts where its rule says', desc: 'Each notification rule names its trigger: the first log entry, a determination, a notice. Count from the recorded time of that trigger, in the rule’s own units (hours, working days), not from detection, arrival or the moment anyone feels sure.'},
  chfinrules: {name: 'Rules with named triggers', desc: 'Write each notification rule with its trigger, its window, who receives and who decides, so the clock is read from the record and not argued.'},
  chfinstatement: {name: 'The statement is the chair’s', desc: 'The public statement is decided by the governing body’s chair, on counsel’s and communications’ advice, from the facts packet: plain words, what is known and what is not, no personal details, nothing about another party’s cause.'},
  chfinboard: {name: 'The debrief from the packets as sent', desc: 'After an incident, the board reads the facts packets as they were sent, with their times and their rules. A row the record does not support is corrected in the minute.'}
};
const FACTS = {
  chnice: {name: 'CISO in the NICE Framework', desc: 'The closest NICE work role is Executive Cybersecurity Leadership (OG-WRL-007). Its tasks include T1227, “Manage cybersecurity budget, staffing, and contracting”; T1059, “Perform cost/benefit analyses of cybersecurity programs, policies, processes, systems, and elements”; T1060, “Advise senior management on organizational cybersecurity efforts”; T1088, “Communicate the value of cybersecurity to organizational stakeholders”; T1906, “Establish a cybersecurity risk management program”; and T1308, “Coordinate cybersecurity policy review and approval processes”. “CISO” is a job title, not a NICE work role: a job may cover one or more work roles, or part of one.', src: 'CISA NICCS, Executive Cybersecurity Leadership work role page and task pages T1059, T1060 and T1308 (the role page shows NICE Framework version 2.0.0); NIST NICE Framework Resource Center, “Occupations, Jobs, and Work Roles”; NIST NICE Framework Components v2.1.0 (3 December 2025) and v2.2.0 (28 April 2026) summaries of changes, which list no change to this role or these tasks'},
  chcsfsc: {name: 'Suppliers in CSF 2.0 Govern', desc: 'GV.SC-04: “Suppliers are known and prioritized by criticality”, with NIST’s example “Develop criteria for supplier criticality based on, for example, the sensitivity of data processed or possessed by suppliers, the degree of access to the organization’s systems, and the importance of the products or services to the organization’s mission”. GV.SC-05: “Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts and other types of agreements with suppliers and other relevant third parties”, with the example “Establish security requirements for suppliers, products, and services commensurate with their criticality level and potential impact if compromised”. GV.SC-06: “Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party relationships”. GV.SC-07: “The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, assessed, responded to, and monitored over the course of the relationship”. GV.SC-08: “Relevant suppliers and other third parties are included in incident planning, response, and recovery activities”. GV.SC-10: “Cybersecurity supply chain risk management plans include provisions for activities that occur after the conclusion of a partnership or service agreement”, with the example “Establish processes for terminating critical relationships under both normal and adverse circumstances”.', src: 'NIST, CSF 2.0 Implementation Examples (26 February 2024)'},
  chcsfpo: {name: 'Policy in CSF 2.0 Govern', desc: 'GV.PO-01: “Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities and is communicated and enforced”, with NIST’s examples “Periodically review policy and supporting processes and procedures to ensure that they align with risk management strategy objectives and priorities, as well as the high-level direction of the cybersecurity policy” and “Require approval from senior management on policy”. GV.PO-02: “Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced to reflect changes in requirements, threats, technology, and organizational mission”.', src: 'NIST, CSF 2.0 Implementation Examples (26 February 2024)'},
  chcsfov: {name: 'Oversight in CSF 2.0 Govern', desc: 'GV.OV-01: “Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction”, with NIST’s example “Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives”. GV.OV-03: “Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed”, with the example “Collect and communicate metrics on cybersecurity risk management with senior leadership”. The subcategories as the CSF 2.0 Core words them (NIST CSWP 29; the Implementation Examples print “measured” for “evaluated” in GV.OV-03), the examples from the Implementation Examples.', src: 'NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (26 February 2024), and NIST, CSF 2.0 Implementation Examples (26 February 2024)'},
  chcsfrs: {name: 'Incident communication in CSF 2.0', desc: 'RS.CO-02: “Internal and external stakeholders are notified of incidents”, with NIST’s example “Notify law enforcement agencies and regulatory bodies of incidents based on criteria in the incident response plan and management approval”. RS.CO-03: “Information is shared with designated internal and external stakeholders”, with the example “Regularly update senior leadership on the status of major incidents”. GV.RR-02: “Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced”, with the example “Document who is responsible and accountable for cybersecurity risk management activities and how those teams and individuals are to be consulted and informed”. The subcategories as the CSF 2.0 Core words them (NIST CSWP 29), the examples from the Implementation Examples. NIST offers the examples as illustrations, and none of these texts names counsel.', src: 'NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (26 February 2024), and NIST, CSF 2.0 Implementation Examples (26 February 2024)'},
  chfinsec: {name: 'How a US public company is timed (comparison only)', desc: 'Not the Compact’s rule: the Compact is a public authority, not an SEC registrant. Form 8-K, General Instruction B.1: “A report pursuant to Item 1.05 is to be filed within four business days after the registrant determines that it has experienced a material cybersecurity incident.” Instruction 1 to Item 1.05: “A registrant’s materiality determination regarding a cybersecurity incident must be made without unreasonable delay after discovery of the incident.” Item 1.05(c) lets disclosure be delayed only if the US Attorney General determines that it poses a substantial risk to national security or public safety and notifies the Commission in writing. The registrant decides; the rule names no officer.', src: 'SEC, final rule, Release No. 33-11216 (Federal Register, 4 August 2023; effective 5 September 2023), and the SEC’s fact sheet for it'},
  chcases: {name: 'Two real cases, as their records state them', desc: 'United States v. Sullivan: on 5 October 2022 a federal jury convicted Uber’s former Chief Security Officer of obstructing an FTC proceeding (18 U.S.C. § 1505) and of misprision of felony (18 U.S.C. § 4); on 5 May 2023 he was sentenced to three years’ probation and a $50,000 fine. The Ninth Circuit affirmed (No. 23-927; filed 13 March 2025, amended 12 November 2025): “Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary.” The court said it need not decide whether a bug bounty program may give researchers prior authorisation. The Supreme Court denied certiorari on 29 June 2026 (No. 25-1082). SEC v. SolarWinds Corp. and Brown: the SEC’s allegations, never findings. In July 2024 the court “denies in part, but grants in large part, the motion to dismiss”, letting only fraud claims based on the pre-incident Security Statement go on at the pleading stage; on 20 November 2025 the SEC dismissed the case “with prejudice”, “in the exercise of its discretion”.', src: 'US Department of Justice, N.D. Cal., press releases of 5 October 2022 and 5 May 2023; US Court of Appeals for the Ninth Circuit, United States v. Sullivan, No. 23-927, opinion and amended opinion; Supreme Court of the United States, docket No. 25-1082; S.D.N.Y., SEC v. SolarWinds Corp., 23 Civ. 9518 (PAE), opinion and order of 18 July 2024; SEC Litigation Release No. 26423 (20 November 2025)'},
  chnicefin: {name: 'The CISO in an incident, in the NICE Framework', desc: 'Among the tasks of Executive Cybersecurity Leadership (OG-WRL-007): T1310, “Implement protective or corrective measures when a cybersecurity incident or vulnerability is discovered”; T1054, “Scope analysis reports to various audiences that accounts for data sharing classification restrictions”; T0006, “Advocate organization\'s official position in legal and legislative proceedings” (shared with Cybersecurity Legal Advice, OG-WRL-006); T1234, “Develop Computer Network Defense (CND) guidance for organizational stakeholders”; T1779, “Coordinate strategic planning efforts with internal and external partners”; and T1476, “Promote awareness of cybersecurity policy and strategy among management”. None of them names a board, a regulator, counsel or a deadline.', src: 'CISA NICCS, Executive Cybersecurity Leadership work role page (it shows NICE Framework version 2.0.0) and task pages T1310, T1054, T0006, T1234, T1779 and T1476'},
  chcsf: {name: 'Risk appetite and resources in CSF 2.0 Govern', desc: 'CSF 2.0 subcategory GV.RM-02: “Risk appetite and risk tolerance statements are established, communicated, and maintained”. One of NIST’s implementation examples for it: “Translate risk appetite statements into specific, measurable, and broadly understandable risk tolerance statements”. GV.RR-03: “Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies”, with the example “Identify resource allocation and investment in line with risk tolerance and response”.', src: 'NIST, CSF 2.0 Implementation Examples (26 February 2024)'}
};
const GAME_NOTES = [
  'Charter keeps the series’ day count from Crossroads (Day 1 was Crossroads’ first Monday), so Charter starts on Day 64, a Monday, and every recalled Crossroads date keeps its number. (game)',
  'The Compact Board’s appointment of a CISO, the reporting line, the remit, the risk register, its six lines, ratings, ranks, owners and options, the appetite scale (Low: only a Low residual is within appetite; Moderate: Medium or Low), every tolerance, the $480k budget, every price and the two quotes are invented. (game)',
  'The Board’s rule is invented (game): it never leaves the 911 center’s line unfunded, correcting any allocation that does in its minute; it approves the CISO’s allocation as sent when the upgrade is funded in full, or when the allocation keeps every line within appetite and tolerances and the first two rounds were answered right first time; otherwise it overrides (the upgrade in full, the service-account review and the restore space deferred), and it trims the service-account review, the restore space, the payment line and vendor access, in that order, while the total is over. A line that breaks one of Monday’s tolerances counts as above appetite. (game)',
  'Every person, the Riverbend Shared Services Compact, its members, accounts (fin-ap, board-display, the group MFA-Exempt), counts and times are invented. Recalled Crossroads facts are quoted from Crossroads. (game)',
  'Charter never says what any law requires. Counsel decides legal questions: Noor for the town and the shared services, each member’s own counsel for that member. (game)',
  'The carry-over effects (Focus +2 for each Crossroads track played, +2 if Crossroads was finished) and the Ballast Badge’s effects (every register line arriving with its owner and review date; Focus +4) are invented. (game)',
  'Suppliers: every supplier (Inkmere Print & Post, Thimbleford Payroll, Wellhollow Backup, Tarnfield IT Services, Pewterlane AV; Stillmark, Shelfwright Systems and Wrenfold Health Software as met in Crossroads), every spend, the tiering rule, the clause catalogue and its tiers, Contract A, every contract’s clauses, the $30k envelope, each price uplift and each supplier’s goodwill, the Brindlemark Assurance Report, and Ilka Thrushcombe are invented. (game)',
  'Any supplier incident in Suppliers is told only through the Compact’s records: the supplier’s notice, our own logs, the times, and who decided what. Any outside address is a documentation address. Nothing says what happened on the supplier’s side, and Contract A’s column in a timeline is what its clauses would have changed. (game)',
  'Insurance and indemnity clauses are counsel’s and procurement’s call; the game shows them and never lets the CISO choose them. The Hawser Badge’s effects (every Tier 1 supplier’s security contact, or its account manager where its contract names none yet, on the incident page; Focus +4) are invented. (game)',
  'Policy: POL-1, the Compact’s security policy, the five standards under it (STD-1 to STD-5) and their wording, the exception rule, every exception, account (cp-backup, cp-logfwd, cp-patch, cp-files-lib, cp-files-cl, cp-files-ap), group (FIN-STAFF), rule, host (PATCH-01, LIB-FILM-01), count, record, time and date, and the Sheet Bend Badge’s effects (every exception’s expiry and review date to its owner and your desk the Monday before it falls due; Focus +4) are invented. (game)',
  'The register’s first entry, the town’s fd-admin exception, is quoted from the town’s own records (Town Hall) and nothing is added to it: what they do not state is shown as not stated. (game)',
  'The finale: Wellhollow’s incident and every notice, answer, time, store, count and record of it, the Compact’s notification rules (N-1 to N-4) and their windows, the facts packets and their rows, the grading and the packet score, the decision log, the statement, the members’ questions, and the Heaving Line Badge’s effects are invented. The incident is told only through the Compact’s records: nothing says how Wellhollow’s side was reached, or why. The SEC rule is a labelled comparison only: the Compact is not an SEC registrant, and Charter never says what any law requires. (game)',
  'The real cases (United States v. Sullivan; SEC v. SolarWinds Corp. and Brown) are told only as their records state them, in the Disclosure terminals and one of the Board’s questions: never as a story, and with no characterisation of anyone. (game)',
  'The Board report: the one-page summary and its ten-line limit, every row and wording, the annex’s records and their times, the grading and the report score, the members’ questions, the contracts status, and the Rolling Hitch Badge’s effects (every line in a report to the Board arriving with its record’s reference and time; Focus +4) are invented. Each line is filled from your own records. The suspicion file appears on the page as one open item, with no conclusion. (game)'
];
