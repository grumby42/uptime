/* ============================================================
   UPTIME · editions/charter/prologue-data.js
   Charter's prologue (Day 64, Monday): the remit the Board gives its first
   CISO (four questions: who decides), the risk-appetite statement (four
   categories, each an appetite with measurable tolerances), and the inherited
   register's missing owners and review dates. One decider per decision: the
   Board approves the appetite and decides the budget; each risk's business
   owner signs its acceptance; Edda runs the shared services; each member's own
   leadership decides for that member; counsel decides legal questions; the
   CISO owns the register, the risk programme, policy and reporting, and advises.
   Everything here is invented (game) except the CSF line credited in CREDITS.md.
   Timeline: scratchpad charter-timeline.md (Day 64).
   ============================================================ */
'use strict';

/* ---------- The remit (Day 64 09:00, the Board room; Ivor asks four questions) ---------- */
const CH_REMIT = [
  {title: 'The remit · 1 of 4', ask: 'The Clinic is replacing its records system. It asks whether to keep the paper downtime cart afterwards. Whose decision is that?',
   resp: [{label: 'The Clinic’s leaders decide it, since it is their service: you advise', good: true},
          {label: 'You decide it, since it is security: the Clinic’s leaders are told after', why: 'You advise. Each member’s own leadership decides for that member.'},
          {label: 'Edda decides it, as the Compact runs the Clinic’s systems for it', why: 'Edda runs the shared services. The Clinic decides how the Clinic works.'},
          {label: 'The Board decides it for the six members at its next meeting', why: 'The Board governs the Compact’s programme. It decides nothing for a member.'}]},
  {title: 'The remit · 2 of 4', ask: 'A member asks whether last month’s incident has to be reported to a regulator. Who answers that?',
   resp: [{label: 'Counsel decides it: the shared services’ counsel, or that member’s', good: true},
          {label: 'You answer it, as you hold the incident’s facts better than anyone else', why: 'You supply the facts. Whether a report is required is a legal question: counsel decides.'},
          {label: 'The Board answers it, as it governs the programme the incident fell in', why: 'A legal question is counsel’s. The Board governs the programme.'},
          {label: 'Edda answers it: the systems the incident touched are the shared services', why: 'Edda runs the systems. Counsel decides what the law asks.'}]},
  {title: 'The remit · 3 of 4', ask: 'Who sets the shared directory’s maintenance window?',
   resp: [{label: 'Edda, as she runs the shared services. You set the requirement it meets', good: true},
          {label: 'You decide it, as the directory is the security system the Compact leans on most', why: 'You set what the window must meet. Running the shared services, and their windows, is Edda’s.'},
          {label: 'Each member votes on it, and the window most of them choose wins', why: 'A vote makes six deciders. The shared services have one: Edda.'},
          {label: 'Beatriz sets it alone, as she does the directory’s exports and changes', why: 'Beatriz does the work for Edda. Edda decides for the shared services.'}]},
  {title: 'The remit · 4 of 4', ask: 'Who keeps the risk register and reports on it to the Board?',
   resp: [{label: 'You do, so the register, the risk programme and the reporting stay in one place', good: true},
          {label: 'Edda does: most of the register’s risks sit in the services she runs', why: 'She owns many of its risks. Keeping the register and reporting it is the CISO’s job.'},
          {label: 'Each member keeps its own part and reports it to the Board its own way', why: 'Six registers in six formats can’t be compared. The CISO keeps one and reports it.'},
          {label: 'Noor does: a register can carry legal exposure, so counsel should hold it for you', why: 'Counsel advises on what it says. Keeping it is the CISO’s job.'}]}];

/* ---------- The risk-appetite statement (Day 64 10:30; the members' representatives at the table) ---------- */
// Each category: an appetite level (Low: only a Low residual is within appetite; Moderate: Medium or Low) and measurable
// tolerances. The Board approves the statement at 12:00 and Ivor signs it.
const CH_APPETITE = [
  {id: 'avail', name: 'Service availability', intro: 'The members’ services, apart from life safety: the branch, the clinic’s front desk, the airport’s billing, the school’s records.',
   ask: 'Which statement should the Board approve for service availability?',
   opts: [{label: 'Moderate: no member’s main service down over 24 hours, paper covering it', good: true, level: 'Moderate', tol: 'no member’s main service down more than 24 hours, paper covering it meanwhile'},
          {label: 'Low: no member’s service down for a minute, at any cost, ever again after this year', why: 'A limit nobody can meet or pay for isn’t a tolerance. Say what the Board will carry, in hours.'},
          {label: 'Moderate: how long a service may be down is set by each incident, at the time', why: 'A tolerance set at the time is no tolerance. GV.RM-02’s example: measurable, in advance.'},
          {label: 'High: members can work on paper for 7 days, so no tighter limit', why: 'Paper buys time, not forever. Without a limit, nothing can be measured against it.'}]},
  {id: 'privacy', name: 'Data privacy', intro: 'Residents’, patrons’, patients’ and students’ records, held in members’ systems the Compact runs.',
   ask: 'Which statement should the Board approve for data privacy?',
   opts: [{label: 'Low: no system with those records reached from outside without MFA, so each session is logged', good: true, level: 'Low', tol: 'no system holding personal records reachable from outside without MFA, and every such session logged'},
          {label: 'Moderate: a few records exposed each year is the price of running six members’ systems for them', why: 'People’s records are the category to carry least of. And “a few” isn’t measurable.'},
          {label: 'Low: not one record may ever be exposed, whatever it costs, and you make sure of it', why: 'A promise nobody can keep, made for the Board by you. Low, with limits that can be measured.'},
          {label: 'Low: the tolerance is whatever each member’s counsel says after an incident', why: 'Counsel decides legal questions after the fact. The Board sets its tolerance before.'}]},
  {id: 'safety', name: 'Safety-of-life services', intro: 'Fire & EMS Dispatch, and care at the Clinic.',
   ask: 'Which statement should the Board approve for safety-of-life services?',
   opts: [{label: 'Low: no cyber cause adds time to answer-to-dispatch, and the fallback is timed each month', good: true, level: 'Low', tol: 'no cyber cause adds time to answer-to-dispatch, and the manual fallback is timed each month'},
          {label: 'Moderate: dispatch has its cards, so an outage there matters less than elsewhere', why: 'The cards keep calls answered. They don’t make an outage at a 911 center a small thing.'},
          {label: 'Low: the tolerance is left unwritten, so responders aren’t second-guessed', why: 'An unwritten tolerance can’t be measured. Write it, in the floor’s own measure.'},
          {label: 'You set it alone: only security knows this risk well enough', why: 'The Board approves the appetite. You draft it with the people who run the service.'}]},
  {id: 'fin', name: 'Financial', intro: 'Fraud, recovery costs, and any payment to an attacker.',
   ask: 'Which statement should the Board approve for financial risk?',
   opts: [{label: 'Moderate: no loss over $25k without the Board, no bank change without a call-back', good: true, level: 'Moderate', tol: 'no single loss above $25k without the Board’s decision, and no payment detail changed without a call-back on a known number'},
          {label: 'Low: every payment over $1k needs two Board signatures before it goes', why: 'An over-reaction: the Board would sign invoices all day. Set a limit and a control.'},
          {label: 'High: the insurer covers losses, so the financial risk is the insurer’s to carry, not ours', why: 'Cover has limits and terms. The Board still carries the risk.'},
          {label: 'Moderate: losses are fine as long as the year still balances at the end', why: 'That limit comes after the money has gone. Set one before, with a control.'}]}];

/* ---------- The inherited register's owners (Day 64 14:00): three lines name a department, not a person ---------- */
const CH_OWNERS = [
  {line: 'R2', was: 'IT', ask: 'R2, service accounts not reviewed. Who owns it?',
   resp: [{label: 'Edda Thornquist, who runs the shared services those accounts belong to', good: true},
          {label: 'You, as the CISO: service accounts are a security matter', why: 'You keep the register. The owner is whoever runs what carries the risk: Edda.'},
          {label: 'Beatriz Solano, who resets and exports the shared directory every week', why: 'Beatriz works for Edda. The owner decides; Edda runs the shared services.'},
          {label: 'Oriel Fanshawe: she pays for the accounts’ upkeep', why: 'Paying isn’t owning. Edda runs the services the accounts serve.'}]},
  {line: 'R4', was: 'Finance', ask: 'R4, payment fraud by email. Who owns it?',
   resp: [{label: 'Oriel Fanshawe, who runs the payment process', good: true},
          {label: 'You, as the CISO: fraud by email starts in the mail system', why: 'It starts in email and ends in a payment. The payment process is Oriel’s.'},
          {label: 'Edda Thornquist, who runs the mail system the fraud arrives by', why: 'Edda runs the mail. The loss lands in the payment process: Oriel’s.'},
          {label: 'The Compact’s bank, which carries out the payments', why: 'The bank moves what the Compact tells it to. The process is Oriel’s.'}]},
  {line: 'R5', was: 'Dispatch', ask: 'R5, the 911 center’s own segment. Who owns it?',
   resp: [{label: 'Celia Marrow, director of the 911 authority, whose decision it was: you advise her', good: true},
          {label: 'Imogen Hale, the day supervisor, who runs the floor the segment serves', why: 'The supervisor runs the floor. The segment was the 911 authority’s decision: Celia’s.'},
          {label: 'Edda Thornquist, as the Compact helps run the center’s systems', why: 'The Compact helps run them. The center’s network was Celia’s decision.'},
          {label: 'You, as the CISO: a network’s design is a security decision', why: 'You advise. Celia decided it, on the Dispatch Thursday’s evidence.'}]}];
const CH_REVIEW = [
  {label: 'Day 155, a Monday: the next quarterly Board, every line', good: true},
  {label: 'When something changes: each line is reviewed as events call for it', why: 'A review “when something changes” never comes on a quiet line. Day 155.'},
  {label: 'Day 428, a Monday: next year’s budget round, for every line', why: 'A year is too long for High lines. The quarterly Board, Day 155.'},
  {label: 'Whenever the CISO has the time, since the register is yours to keep', why: 'A date the Board can hold you to: Day 155.'}];
