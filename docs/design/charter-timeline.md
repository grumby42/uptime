# Charter timeline (edition 3, the CISO). Rebuilt 2026-11-21 (UTC) from editions/charter/ after a container reset lost the working copy.
Every day, weekday and clock time below was grepped from the code at 6d5aa6c (1a2d488 plus docs); the index at the end is generated from the sources. Everything is (game) unless marked [fact] (cited in CREDITS.md, section "Charter") or recalled from Town Hall or Crossroads (quoted, file named). Defender side only. Addresses RFC 5737 only (203.0.113.77). No URL text.

## Day count and weekdays
- The series' day count runs on from Crossroads: Day 1 = Crossroads' first Monday, so Day n's weekday is (n-1) mod 7 from Monday. Checked with python over every "Day n" in editions/charter: 51 day-and-weekday pairs agree; the one that does not, "Day 445, a Wednesday" (policy-data.js, dojo 1), is a deliberate wrong option (Day 445 is a Thursday).
- Days used: 27 Sat (the Airport's Saturday), 31 Wed (the operations room opens; the Airport's night threshold), 33/34 Night 33 (Fri to Sat), 43 Mon (per-member accounts replace svc-fileops), 50 Mon (R1's requirement written), 51 Tue to 55 Sat (Tarnfield's incident and notice), 57 Mon (the Board votes for the post), 58 Tue (Tarnfield's account back), 61 Fri (Edda's request and the quotes), 64 Mon to 67 Thu (prologue and Budget), 68 Fri (tiering rule, clause catalogue, Contract A), 71 Mon to 74 Thu (Suppliers), 75 Fri (PATCH-01 retired 16:10; EX-01 and EX-03 expire; Inkmere's old contract ends; POL-1 v0.1 drafted), 77 Sun (end of drill 3's 30 days), 78 Mon to 81 Thu (Policy), 155 Mon (the next quarterly Board: reviews), 246 Mon (the quarterly Board after), 428 Mon (the start of next year's budget cycle; acceptances expire), 445 Thu (dojo 1), 446 Fri (Day 81 + 365), 600 Fri (a review date too far).
- Day 64 is 91 days before Day 155: the appointment Board on Day 64 was a quarterly Board, so "since the last quarterly Board" means since Day 64.

## People and deciders (story.js, data.js NPCS)
Ivor Penhallow (chair), Edda Thornquist (shared-services director: decides the shared services' operations and the directory's settings), Marit Quellan (finance director: owns payments, payroll and print-and-post), Beatriz Solano (identity team lead), Noor Castellanos (counsel for the town and the shared services; each member's counsel for that member), Joanna Ferreday (airport manager), Ilka Thrushcombe (procurement, Suppliers week), Director Mina Strand (the Library). Named, not present: Celia Marrow (R5), Rae Okafor (suspicion-file lead, Crossroads), Dario Fenn, Marisol Quintero. One decider per decision, whoever is on duty; the CISO advises, keeps the registers and the report, and never signs, approves, renews or closes for an owner.

## Prologue and Budget (Days 64 to 67; story.js, prologue-data.js, budget-*.js)
- Day 64 Mon: 08:45 the offices; 09:00 Board room: the remit and four questions; 10:30 the appetite statement (availability Moderate; privacy Low; safety-of-life Low; financial Moderate; tolerances, including "no payment detail changed without a call-back on a known number"); 12:00 approved; 13:30 Marit: $480k (game), papers out this evening, the CISO's section by Wednesday 17:00; 14:00 the register: owners (R2 Edda, R4 Marit, R5 Celia) and review dates (Day 155); 16:30 end of day.
- Day 65 Tue: 09:00 drill A (MFA claim: MFA-Exempt export 08:40, sign-ins 30 days to 08:00: fin-ap 212, board-display 40); 10:15 Edda corrects her paper; 11:00 drill B (138 minutes to 10: 05:52 to 08:10 at the Airport, 02:31 to 02:41 on Night 33); 14:00 drill C (Quote B).
- Day 66 Wed: 09:00 the allocation; 10:00 in the papers; 11:30 Joanna's directive (11:50 her acceptance: AP, Medium against Low privacy, expiry 428, review 155); 13:00 Marit's terminals; 17:00 papers.
- Day 67 Thu: 14:00 the budget round, three rounds; 15:00 the Board's decision and minute (chBudgetMinuteParts in risk.js: persuaded, approved as sent with the extension; or override, R2 and R3 deferred, R4 trimmed, acceptances decided by the Board and signed by the owners); 15:20 owners sign; the gap acceptance for R4 on the persuaded path (Marit, closed Day 79 10:40); the Ballast Badge; 16:00 summary. Invariant checkpoints: the minute and the district end.

## Suppliers (Days 71 to 74; suppliers-*.js, supplier.js)
- Day 71 Mon: 08:45; 09:00 drill A (Inkmere: data-flow record and account lists, 08:30); 10:15 register updated; 10:30 tiering; 14:00 drill B (Wellhollow's report: period ended 15 months ago).
- Day 72 Tue: Thimbleford's notice (sent Day 71 21:14, read 08:10); 08:20 Marit; 08:30 the register and log (failed sign-in 23:52 from 203.0.113.77; last success Day 67 06:00); 08:40 cp-xfer suspended; 08:50 log exported; 09:00 address blocked, edge searched; 09:10 questions to Thimbleford; 09:15 Noor; 12:00 facts; 12:30 Noor: no notice yet; 17:30 "confidential"; 17:50 Noor writes.
- Day 73 Wed: 09:00 drill C (Tarnfield: detected Day 52 16:10, reached Day 55 18:30, 74 h 20 min against 72); 11:30 Ilka's directive (11:50 Marit); 14:00 the clause plan ($30k envelope; 14:40 sent; 15:00 acceptances for any must-have left out, on the CISO's recommendation); 15:30 Ilka's terminals; 16:40 Thimbleford's summary (detected 15:05); 16:50 return not yet; 16:55 Marit asks again.
- Day 74 Thu: 11:00 Thimbleford's second answer; 11:30 Noor; 11:45 the Compact's own evidence; 11:50 measured against the privacy tolerance (above it; Marit signs; staff records not in the appetite's list: "Both go to the Board's Day 155 review"); 12:00 cp-xfer back key-only; 12:10 the timeline beside Contract A; 12:30 requirements to members' owners; 14:00 Supplier round; 15:00 minute; the Hawser Badge; 16:00 summary. Inkmere's renewal signed Thursday with the clauses the plan priced (Ilka, story.js).

## Policy (Days 78 to 81; policy-*.js, policy.js)
- Day 78 Mon: 08:45 POL-1 v0.1 (Friday Day 75); 08:40 Beatriz's exports; 08:50 the town's list; 09:00 drill 1 (board-display, expired Day 75 17:00; signed in Monday 08:31 and 08:34); 09:50 Edda closes EX-01; 10:30 the intake; 11:10 Edda closes EX-03 (PATCH-01 retired Day 75 16:10); 14:00 consultation; 14:20 sent.
- Day 79 Tue: 08:40 the rule's settings; 09:00 drill 2 (fin-ap, 7 days to 08:00: 49); 10:15 Edda; 10:20 fin-ap in scope; 10:31 applied; 10:40 Marit's call-back rule (the financial tolerance holds from here); 13:00 the chair decides EX-02 and EX-04 (6.2a; EX-04 the Board's under 6.3 on the override path); 14:00 drill 3 (all 30 leaver records: 27 on time).
- Day 80 Wed: 09:00 replies (09:20 STD-4 v2; 12:40 members' owners agree); 11:30 Director Strand (11:50 EX-05 signed under the draft); 14:00 the library; 15:00 the segment set; 15:30 Edda's terminals.
- Day 81 Thu: 06:00 Thimbleford's pickup; 09:00 Edda's checks; 09:05 EX-05 on the register; 14:00 Policy round; 15:00 minute (POL-1 approved; review date set in the minute); the Sheet Bend Badge; 15:30 standards issued; 15:40 any undated standard dated; 16:00 summary.
- Registers at the end of Policy: open EX-02 (five service accounts, Edda, to Day 155), EX-04 (fin-ap, Marit, to Day 155), EX-05 (LIB-FILM-01, to Day 428), any EX-1x (imported must-haves, to Day 428); closed EX-01 and EX-03 (Edda, Day 78). MFA-Exempt holds six: the five and fin-ap.

## Index: clock times in the code, by file (generated from editions/charter/*.js at 6d5aa6c)
- budget-data.js: 02:31, 02:35, 02:40, 02:41, 04:40, 05:52, 06:20, 07:40, 08:00, 08:10, 08:40, 11:30, 14:00
- budget-story.js: 08:00, 08:40, 09:00, 10:00, 10:15, 11:00, 11:30, 11:50, 12:00, 13:00, 14:00, 15:00, 15:20, 16:00
- policy-data.js: 08:00, 08:31, 08:34, 08:40, 08:45, 09:00, 09:20, 09:50, 10:15, 10:20, 10:30, 10:31, 11:30, 12:00, 12:40, 14:00, 16:10, 17:00
- policy-story.js: 06:00, 08:00, 08:45, 08:50, 09:00, 09:05, 09:20, 09:50, 10:20, 10:30, 10:31, 10:40, 11:10, 11:30, 11:50, 12:00, 12:40, 13:00, 14:00, 14:20, 15:00, 15:30, 15:40, 16:00, 16:10, 17:00
- policy.js: 10:30, 14:00, 17:00
- prologue-data.js: 09:00, 10:30, 12:00, 14:00
- risk.js: 10:40
- story.js: 08:20, 08:45, 09:00, 10:30, 11:00, 11:30, 12:00, 13:00, 13:30, 14:00, 15:30, 16:00, 17:00, 17:30, 17:50, 23:52
- supplier.js: 12:00, 21:14
- suppliers-data.js: 06:00, 08:00, 08:10, 08:20, 08:30, 08:35, 08:40, 09:05, 09:10, 09:30, 11:00, 11:30, 12:00, 12:05, 14:00, 15:05, 16:10, 16:40, 16:50, 17:30, 18:00, 18:29, 18:30, 18:50, 21:14, 21:20, 22:40, 23:52
- suppliers-story.js: 06:00, 08:10, 08:20, 08:30, 08:40, 08:45, 08:50, 09:00, 09:10, 09:15, 10:15, 10:30, 11:00, 11:30, 11:45, 11:50, 12:00, 12:30, 14:00, 14:40, 15:00, 15:05, 15:30, 16:00, 16:40, 16:50, 16:55, 18:00, 21:14, 23:52

---

# Slice 4: District 4, The Board report (Days 82 to 88). Written 2026-11-20 (UTC) before any dialogue, option or code; rewritten 2026-11-21 after the reset, unchanged in substance.
Everything here is (game) unless marked [fact] (CREDITS.md, section "Charter", slice 4) or [slice 1] / [slice 2] / [slice 3] / [Crossroads] (recalled, grepped, quoted exactly). Defender side only: every record is the Compact's own. No technique, no ATT&CK ID beyond the five already cited for the Quiet Thread, no attack research. No URL text. No new person.

## Days and weekdays (checked with python before writing)
- Day 82 Friday (Ivor's note asking for the CISO's first report; narrated on Monday).
- **Day 85 Monday, Day 86 Tuesday, Day 87 Wednesday, Day 88 Thursday** (report week).
- Day 64 Monday: the last quarterly Board (91 days before Day 155). "Since the last quarterly Board" means since Day 64.
- Day 74 Thursday: Inkmere's renewal signed, with the clauses the plan sought ([slice 2] story.js: "Inkmere signs on Thursday, with the clauses your plan priced").
- Day 95 Thursday: Thimbleford's next pickup (fortnightly: 53, 67, 81, 95). Day 155 Monday; Day 246 Monday; Day 428 Monday.

## What the report is (game)
- The CISO's first report to the Compact Board: the quarter since Day 64. Ivor's note (Friday Day 82): for the Board's Thursday meeting (Day 88, 14:00); one page and an annex of records; papers out Wednesday (Day 87) 17:00; from Day 155, one at every quarterly Board.
- Assembled Wednesday 09:00 at the CISO's desk; sent to Marit for the papers at 12:00 (the report's time: Day 87 12:00). Every record it cites is dated Day 86 17:00 or earlier. The Board's questions are not knowable before Day 88 14:00; Ivor's "the members have your page" only from Day 88 (the papers go out at 17:00 on Wednesday).
- Built from the player's own results: the acceptances (G.ch.accept) read on today's tolerances (chLineNow), the Board's decision (G.ch.final, G.ch.decision), the plan as sent (G.ch.sup.planSent and sup.accept), the exception register (G.ch.pol.exc), the appetite statement. Nothing fixed is shown as earned.

## The rows (the primitive). One line each; one supported wording and two or three weak ones (unsupported, overstated, misplaced), or left out. Page: 10 lines (game).
Required: A1 (owners' acceptances above appetite: the airport's trust, Joanna; cp-xfer's return, Marit), A2 (when present: lines the Board's decision left above appetite and still above today; override path R2 and R3; R4 is within from Day 79 10:40 although its acceptance stays open), C1 (staff records into the privacy appetite: the Board decides, at Day 155; [slice 2] Day 74 11:50), C2 (EX-02 and EX-04 expire Day 155: the chair decides each under 6.2a, or on the override path the chair EX-02 and the Board in its minute EX-04 under 6.3; recommendation renew to Day 246, controls read again), C3 (when present: Day 428: the upgrade back as the extension ends on the persuaded path, or the Board's deferred lines back for funding; the Board decides), D1 (EX-01 and EX-03 expired Day 75, closed by Edda Day 78; board-display's two sign-ins after expiry, Day 78 08:31 and 08:34, reported), E1 (the Compact's tier-1 contracts signed with every must-have: 0 of 2 on Day 71 and Day 85; what the plan sought; the members' four theirs), E2 (when present: each must-have left out on the CISO's recommendation, decided and signed by its owner). Optional: A3 (n of 6 within on the Board's decision, k unchanged until next year's money), B1 (MFA but for six accounts on open, dated exceptions), B2 (tiered first on Day 71; 0 of 2 signed), B3 (138 minutes to 10, two nights), B4 (no staff exercise counted: the terminals are training), F1 (ask: each representative takes its tier's requirements to its own owner).
- Weak wordings per row: misplaced (a decision to the wrong decider: the Board for an owner's acceptance; the owner for the Board's; payroll's owner for the appetite; the owners for escalated exceptions; Edda for the budget; the CISO for closing; owners' choice for the CISO's recommendation; the Board directing members), overstated (a trend from one or two points; "every"/"all" where the record says less; a breach stated as what will happen; "for good, proven"; a game number as operations), unsupported (no record, or a record saying less).
- The open item (fixed, not a claim, not scored, not a line): while the file holds notes and the Thread is not evicted, "the suspicion file, n notes, with Rae Okafor's team and counsel"; one observation only when the file holds a Crossroads note: "every Crossroads note in it comes from FD-STAFF-11's address between 03:11 and 03:22" ([Crossroads] quiet.js: lb-rdp 03:12 to 03:16, sd-probe 03:21 to 03:22, cn-folders 03:14, dp-conns 03:11, ap-accounts 03:13, each from FD-STAFF-11's address); "Who, and why: not known. This report draws no conclusion." No row, drill, question or option is about it.
- The annex's records and times: APP Day 64 12:00; M67 Day 67 15:00; M74 Day 74 15:00; M81 Day 81 15:00; X74 Day 74 11:50; LOG Day 34 02:44; SCO Day 81 16:00; SUP Day 85 08:30; SGN Day 85 08:40; ACC Day 86 17:00; EXC Day 86 17:00.

## Grading (game; Crossroads' report.js scale: a right wording scores, an overclaim scores nothing; here a weak line costs)
- +20 a supported line, -10 a weak line, -20 a required row left out, -10 each line over 10; out of 20 per required row; 0 to 100. A dull report (required rows only, supported) scores 100; an omission is worse than a dull line.
- Metrics on the report as sent: claims supported %; required items present %; decisions with a named decider and the CISO's recommendation % (C1, C2, C3 when present, sent in the supported wording). Targets 100.
- Recommended report (the bot's): the required rows supported, plus B1 and B2. Recommended path: A1, B1, B2, C1, C2, C3, D1, E1 (8 lines).

## Day 85, Monday
- 08:45 desk: Ivor's note (above); GV.OV-01 and Ex1 [fact].
- 09:00 Drill 1, Beatriz: "Can the report say 'MFA on every sign-in'?" Traps: the draft line (Marit's office, "from Thursday's minute"); the MFA service's settings page ("enforced: on"). Keys: the exception register and MFA-Exempt (08:40: the five and fin-ap, EX-02 and EX-04 open to Day 155); the sign-in records, 7 days to 08:00 (fin-ap 47 interactive without MFA, from the finance office's three PCs, the location rule applied on each; the five non-interactive from their own servers; every other account MFA). Verdict: "No: six accounts sign in without MFA, and each is on an open, dated exception". 09:40 Marit corrects her draft line.
- 11:00 Drill 2, Marit: "Can the report say supplier risk fell?" Traps: Marit's draft; the plan sent Day 73 14:40. Keys: Ilka's contracts status (08:30: Inkmere renewed Day 74 with the clauses the plan sought, Tier 2; Thimbleford's amendment with its counsel, not signed; Wellhollow's renewal in negotiation, not signed; the members' four theirs); the register's history (first tiered Day 71; tier-1 signed with every must-have 0 of 2 on Day 71 and Day 85; between: Thimbleford's incident Days 71 to 74, cp-xfer back key-only Day 74, tier-1 contacts on the incident page). Verdict: "No: there is one measure, from Day 71, and the signed tier-1 contracts are 0 of 2 on both days".
- 14:00 Drill 3, Edda: "Who does the report say accepted R2 and R3?" Override path (repwho): keys the Day 67 minute (the game's own sentence, chBudgetMinuteParts) and the acceptances (decided by the Compact Board (minute, Day 67), against the CISO's advice; signed by Edda for the interim measures and the treatment plan); verdict "The Board, in its Day 67 minute, and Edda signed for running the interim measures". Persuaded path (repwho2): keys the minute ("approved your allocation as sent, the extension carrying the platform ... No line is left above appetite once its line delivers") and the acceptances (none for R2 or R3); verdict "Nobody: the Board funded both, so neither of them needed an acceptance".
- 16:30 end of day.

## Day 86, Tuesday
- 09:00 desk: the quarter's records (the scorecard as recorded, the acceptances, any must-have left out); GV.OV-03 and Ex3 [fact].
- 11:00 Edda's directive. Override path: "Leave R2 and R3 out of the summary ... The Board decided them itself on Day 67." Persuaded path: "Leave cp-xfer's return out of the summary ... It was in the Supplier minute on Day 74." (Not "Thursday's": on Day 86 the last Thursday is Day 81, the Policy round.) Right: "It stays in the summary: one line is enough, with the minute's reference".
- 14:00 Beatriz's Reporting terminals (supported vs overstated; one measure is a baseline; who decided). Focus +2.

## Day 87, Wednesday
- 09:00 desk: the report editor (sections; rows cycle their wordings in a seeded order; the page count; the page and annex). 12:00 sent; the debrief. 17:00 papers out.

## Day 88, Thursday
- 14:00 the Board: three members' questions keyed to the report as sent: each required row left out first, then misplaced, overstated, unsupported lines in row order; the Board's standing questions fill any round left. A weak-line question quotes the player's line; the options are the row's wordings.
- 15:00 the minute: received as sent; corrections for the rows asked about, in the supported wording; the chair asks for the other weak or omitted rows to be read again before Day 155; the decisions with their deciders; the open item noted. The invariant. The Rolling Hitch Badge: from the next district on, every line in a report to the Board arrives with its record's reference and time; Focus +4.
- 16:00 summary; "Next: The finale". The invariant at the district's end.

## The systemic invariant, extended
Eight checkpoints (minutes and district ends of Days 67, 74, 81, 88). Once a report is sent: its required rows match the records (the Board's lines and the owners' acceptances above appetite from chRiskStates; the must-haves left out; D1's, C2's, B1's and E1's fixed wording against the registers).

## CSF and NICE [fact] (fetched 20 Nov 2026)
- GV.OV-01 "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction"; Ex1 "Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives". GV.OV-03 "Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed"; Ex3 "Collect and communicate metrics on cybersecurity risk management with senior leadership". EXACT, controls rejected ("evaluated"; "Collect and report ... to senior leadership"; "organisation"). CAREER_LADDER §3 quoted GV.OV-03 with "evaluated"; NIST prints "measured".
- NICE T1060 "Advise senior management on organizational cybersecurity efforts" (NICCS task page; OG-WRL-007 among five roles); control "Advise the board ..." absent.

## Invented names (logged in CREDITS.md)
Rolling Hitch Badge (adopted after three searches). Dropped: Plimsoll (Plimsoll Publishing, a company-analysis report publisher; Plimsoll Productions), Clove Hitch (Cloverhitch Technologies), Carrick Bend (Carrick Capital Partners, a software investor), Lead Line (a LEADLINE trademark). Record IDs are generic.
