# Review: Charter slice 4, District 4 (the Board report)
Independent review panel, 2026-11-21 (UTC): a sitting CISO, a CIO, a public-authority board chair, an internal-audit lead and a principal DFIR consultant. Reviewed at 966de62 (build ARCD-20261121-1350Z). Scope: editions/charter/report.js, report-data.js, report-story.js and their wiring (story.js, data.js, risk.js, index.html), tests/charter.js, CREDITS.md (District 4), docs/design/charter4-build.md. Checked against SPEC_ed3_slice4.md, SPEC_ed3.md, LESSONS.md (every class) and charter-timeline.md.
Nothing in the repo was edited except this file. Tests run (read-only): `node tests/tells.js` (exit 0, no FAIL) and `node tests/charter.js` (result at the end). No bot test was run.

Severity: **blocker** (the slice's own rule is broken, or a real-world fact is wrong as published), **must-fix** (a LESSONS class recurs, or the game teaches something wrong), **should-fix**, **nit**.

---

## Blockers

### B-1. The omission and over-length penalties vanish once optional lines pad the page (spec §Primitive, LESSONS 12)
- **Where:** editions/charter/report.js:204-206 (`points = 20*sup - 10*weak - 20*omitted - 10*over`, divided by `20*req.length`, then clamped to 100); tests/charter.js:927-947.
- **Problem:** every supported line earns +20, required or not, and the score is clamped at 100. On the recommended path there are 6 required rows and 6 optional ones, so five supported optional lines (+100) cancel up to five omissions (-20 each). A report that leaves out the above-appetite acceptances (A1) **and** the expired exceptions (D1) scores the same 100 as the dull report. The spec says the opposite: "leaving out an above-appetite risk or an expired exception is worse than a dull report". The over-length penalty has the same flaw. Every row in, all supported (12 lines, 2 over) gives 240 - 20 = 220 of 120, so the score is still 100.
- **Evidence:** a reproduction harness (report-data.js and report.js loaded in a VM with recommended-path facts) gives:
  - dull, required rows only, all supported: score 100;
  - A1 left out, plus A3, B1, B2, B3 and B4 supported: **score 100** (required 83%);
  - D1 left out, plus the same five: **score 100**;
  - A1 and D1 left out, plus six optional lines: **score 100** (required 67%);
  - A1 misplaced, plus B1 and B2 supported: **score 100** (claims 88%);
  - A1 and D1 weak, plus B1, B2 and B3: **score 100**.

  The test passes only because its "flashy" case pairs the omission with *weak* optional lines (tests/charter.js:932). It never pads with supported ones, and it never asserts `long.score`.
- **Fix:** optional lines must not offset required ones. For example: `score = clamp(100 * (20*supRequired - 10*weak - 20*omitted - 10*over) / (20*req.length))`, where optional supported lines earn 0. Alternatively, cap the score at `100 - 20*omitted - 10*weak - 10*over` (worked out in percentage points). Add tests for both kinds of padding. One omission plus five supported optional lines must score below the dull report (spec: "worse than a dull report"). One weak line must score below 100. Every row in, over the page, must score below 100.

### B-2. GV.OV-03 is quoted as "CSF 2.0" in the wording of the Implementation Examples, and CREDITS calls the CSF Core's own wording "wrong"
- **Where:** editions/charter/report-story.js:75 (shown in game as "CSF 2.0 GV.OV-03: “… is measured and reviewed …”"); data.js:156 (Field Manual, sourced only to the Implementation Examples); CREDITS.md:267-268 ("GV.OV-03 with 'evaluated' for 'measured' (the wording in the design note CAREER_LADDER.md §3, which is wrong)"); docs/design/charter-timeline.md:96 ("CAREER_LADDER §3 quoted GV.OV-03 with 'evaluated'; NIST prints 'measured'"); tests/charter.js:840 pins the "measured" text.
- **Problem:** NIST's two documents word GV.OV-03 differently. The CSF 2.0 Core itself, CSWP 29, says **"evaluated"**. CAREER_LADDER.md:202-211 cites "CSF 2.0 Govern (CSWP 29)" and quotes that wording correctly. The Implementation Examples PDF says **"measured"**. The game shows the IE wording labelled plainly "CSF 2.0 GV.OV-03", and the repo's fact log says the authoritative wording is wrong. A CISO or auditor who checks the in-game quote against the Framework will find it does not match. LESSONS (Hard rules): "Real facts only from primary sources … never paraphrase as a quote."
- **Evidence (fetched 2026-11-21):**
  - NIST CSWP 29, *The NIST Cybersecurity Framework (CSF) 2.0*, 26 February 2024, https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf. Two separate fetches returned: GV.OV-03 "Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed". The second fetch also confirmed that "measured" does not appear next to GV.OV-03.
  - NIST, *NIST CSF 2.0 Implementation Examples*, 26 February 2024, https://www.nist.gov/system/files/documents/2024/02/21/CSF%202.0%20Implementation%20Examples.pdf. GV.OV-03: "Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed".
  - Independent confirmation that third-party catalogues of the Core use "evaluated" (WebSearch, exact phrase), e.g. https://ce.prod.cloudaware.com/frameworks/nist-csf-v2.0/gv-ov/03 (title: "GV.OV-03: Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed").
- **Fix:**
  - (a) In report-story.js:75 and data.js:156, either quote the Core (CSWP 29) wording "evaluated", or label the quote "as worded in NIST's CSF 2.0 Implementation Examples" and add "(the CSF 2.0 Core, CSWP 29, says 'evaluated')". The cleanest option: quote the subcategory from CSWP 29 and the example (Ex3) from the IE.
  - (b) Correct CREDITS.md:268 and charter-timeline.md:96. CAREER_LADDER is right for CSWP 29. Record both documents and both wordings with URLs and dates.
  - (c) Update tests/charter.js:840 to the chosen text.
  - (d) Sweep every other subcategory the edition quotes from the IE (GV.RM-02, GV.RR-03, GV.SC-04/05/06/07/08/10, GV.PO-01/02) against CSWP 29. Where the two differ, the same label problem applies.

---

## Must-fix

### M-1. The editor gives away the answer through the records each wording cites
- **Where:** editions/charter/report.js:154 (`'Records: ' + refs.join(', ') || 'none'` shown for the current wording); report-data.js, `refs` on every variant.
- **Problem:** the supported wording never cites fewer records than a weak one. It cites strictly the most in 9 of 14 rows (A1, A2, A3, B1, C1, C2, D1, E2, F1) and ties in the other 5. Ten of the 34 weak wordings show "Records: none", and no supported wording ever does. "Cycle to the wording with the most records" is a mechanical strategy that never loses. It is an odd-one-out and lone-feature tell (LESSONS 14) that tests/tells.js does not scan, because it reads labels, not the editor's notes.
- **Evidence:** count from report-data.js. Good refs against the others: A1 2 vs 1,1,0; A2 2 vs 1,1,0; A3 2 vs 1,1; B1 2 vs 1,0; C1 2 vs 1,1,0; C2 2 vs 1,1,1; D1 2 vs 1,1,0; E2 2 vs 1,1; F1 1 vs 0,0; ties: B2, B3, B4, C3, E1.
- **Fix:** give each weak wording the record it misreads, with as many citations as the supported one. Real overclaims usually cite a real record that says less: B2 overstated cites SUP and M74; A1 misplaced cites ACC and M74; D1 overstated cites EXC and M81. Alternatively, hide the refs in the editor and show them only in the annex after sending. Add the note text to the tells scan.

### M-2. Length tell: the supported wording is never the shortest in any report row
- **Where:** report-data.js:52-176 (CH_REP_ROWS). These lists are also the Board's question options (report.js:228).
- **Problem:** across the 14 rows, the supported wording is the longest in 5 (B2, C2, D1, E1, F1) and second-longest in the other 9. It is never third or fourth. By chance, with six 4-option rows and eight 3-option rows, rank ≤ 2 everywhere has probability 0.5^6 × (2/3)^8 ≈ 0.0006. "Pick one of the two longest" wins every row (LESSONS 14: length).
- **Evidence:** measured with the tokens filled on the recommended path, e.g. E1 good 143 characters (longest of 4), C2 132 (longest of 4), D1 119 (longest of 4).
- **Fix:** in at least a third of the rows, make the supported wording the shortest or third-longest, for example by trimming E1's "the members’ 4 theirs to decide" into the annex. Then extend tests/tells.js with a rank-distribution check (not only "longest"), so the bound applies to CH_REP_ROWS.

### M-3. Word tell: a causal "as …" clause marks the weak wording
- **Where:** report-data.js rows, e.g. :69 ("as the interim checks run"), :77 ("as the Day 67 minute shows"), :93 ("as the plan seeks"), :111, :121 ("as a pay-data breach will follow"), :131 ("as their controls are proven"), :145 ("as each one was closed"), :147 ("as its keeper"), :155, :159, :175.
- **Problem:** "as" appears in 21 report-row options and 18 of them are weak (86%), against a 29% base rate of supported wordings. In 8 of the 14 rows only weak wordings carry it. tells.js reports "as wrong 11/11 (chance 7.4)" for ch-report, but passes it because the lone-feature bound is 2.5 sd + 1. As a tracked word it would sit far outside 35-65% (LESSONS 14: word leans).
- **Fix:** give supported wordings their own justification clauses with "as" (e.g. A2 "…, as minuted on Day 67"; E1 "…, as Ilka’s status of Day 85 shows"), or remove "as" from weak wordings. Add `\bas\b` (causal) to the tracked word groups for Charter.

### M-4. Drill 3, persuaded path: "the Board funded both, so neither needed an acceptance" teaches the error the slice warns against
- **Where:** report-data.js:328-341 (repwho2 verdict, its why, and reasons :335-337); compare :75-78 (A3: "unchanged until next year’s money arrives"; "A budget decided is not a risk brought down: next year’s money hasn’t delivered") and risk.js:179 ("No line is left above appetite once its line delivers").
- **Problem:** the verdict gives *funding* as the reason no acceptance is needed. The game's own model (risk.js:58-60, "every line is next year's money, so none has yet [delivered]") reads residual risk on the decided treatment plan. The reason R2 and R3 need no acceptance is that the Board's decided option puts them within appetite. Money approved is not the reason. R4 was funded too and still needed a gap acceptance on Day 67. A board chair will read "funded, so nothing to accept" as "approve the budget and the risk goes away", which the A3 row in the same slice calls overstated. The CISO and auditor personas also note that A3's supported line says "6 of 6 within appetite … 5 of them unchanged". To a lay reader, that line says the risks are within appetite and unchanged at once.
- **Fix:** verdict: "Nobody: the Board’s decision puts both within appetite on its treatment plan, and no tolerance breaks while they wait, so neither needed an acceptance". Reason: "The minute decided the treatment, and the register lists no acceptance for them". Reword A3's supported line to "{within} of 6 lines within appetite on the Board’s treatment plan; {asnow} of them still at today’s level until next year’s money delivers". The wider design point (residual read on the plan, not on what is in force) is in S-7.

### M-5. Weekday drift in two lines (LESSONS 2)
- **Where:** report-data.js:294 ("The CISO: the allocation sent on Wednesday …", read on Day 85, a Monday, about Day 66); report-data.js:144 (D1's why: "both expired on Friday and closed by their owner on Monday", shown in the Day 87 debrief and at the Day 88 Board, about Days 75 and 78).
- **Problem:** from Day 85, the last Wednesday is Day 80 (the next is Day 87, when the report itself is sent). From Days 87 and 88, the last Friday is Day 82, which is the day of Ivor's note. Both lines point at the wrong day. Every other weekday in the slice is relative to the day it is read and correct: "Thursday’s minute" (Day 81, read on Day 85), "Tuesday’s rule" (Day 79), "Day 74" in Edda's persuaded-path request.
- **Fix:** "the allocation sent on Day 66"; "both expired on Day 75 and were closed by their owner on Day 78".

### M-6. The minute's list of decisions includes rows the player did not send, and calls the chair's decision the Board's
- **Where:** report-story.js:144 (`dec = rows.filter(r => r.decision)` from all present rows, not the picks sent), :149 ("The decisions it puts to the Board: …").
- **Problem:** if the player left C1 or C3 out, the minute still says the report "puts" them to the Board. That credits the report with decisions it omitted, and the scorecard and minute then disagree (LESSONS 3, 12). Also, C2 is decided by the chair under 6.2a (or by the Board only for EX-04 on the override path), so "puts to the Board … C2 (the chair)" mixes two deciders under one heading (LESSONS 8).
- **Fix:** list the decision rows sent (`p.sent.picks[r.id]`). Name omitted ones separately ("not in the report: C1; the chair asks for it before Day 155"). Word it "The decisions due, each with its decider: C1 (this Board), C2 (the chair), …". Rename the section "Decisions for the Board" (report-data.js:48) to "Decisions due, with their deciders".

---

## Should-fix

### S-1. The open item puts investigation detail into general Board papers without counsel's decision (DFIR and board-chair concern)
- **Where:** report.js:122-128; report-story.js:149.
- **Problem:** the line "Every Crossroads note in it comes from FD-STAFF-11’s address between 03:11 and 03:22" goes into papers circulated to every member's representative, and public-authority board papers are often public records. The spec permits one observation, and the line is accurate against editions/crossroads/quiet.js (lb-rdp 03:12 to 03:16, sd-probe 03:21 to 03:22, cn-folders 03:14, dp-conns 03:11, ap-accounts 03:13, each from FD-STAFF-11’s address). But naming the host of an open matter in open papers can alert whoever is behind it, and it is exactly the "facts go to counsel" lesson the finale teaches.
- **Fix:** keep the line, but frame it as counsel's routing: "Open item (not a claim): the suspicion file, n notes, with Rae Okafor’s team and counsel; one observation is with the chair in confidence, at Noor’s direction. Who, and why: not known. This report draws no conclusion." Alternatively, add one sentence saying Noor decided the observation may appear.

### S-2. C2 schedules the renewal decision on the expiry day itself
- **Where:** report-data.js:125 ("Day 155: EX-02 and EX-04 expire, {renewDecide} at the review …").
- **Problem:** D1, in the same report, records a lapse: two exceptions expired on Day 75, a Friday, and were closed on Day 78, with board-display signing in twice in between. Deciding on Day 155 means the exceptions are expired before the decision is minuted. An auditor would ask for the decision *before* expiry (LESSONS 11: chair within five working days).
- **Fix:** "Day 155: EX-02 and EX-04 expire; {renewDecide} before then, and I recommend …". Optionally add a weak variant that puts the decision after expiry.

### S-3. Grade classes are inconsistent for claims the record contradicts
- **Where:** report-data.js:59 (A1 "back within appetite …" graded overstated), :145 (D1 "none … lapsed, as each one was closed on time" graded overstated), against :149 (D1 "every exception … still stands open" graded unsupported) and :79 (A3 "fell by a third" graded unsupported).
- **Problem:** the spec defines overstated as "'likely' as fact, a trend from one point, 'fully'/'all' when a sample was taken, a drill or game number presented as operations". It defines unsupported as "no record, or a record that says less". "Closed on time" and "back within appetite" are contradicted by the record. They are not an overreach from a sample, yet they are graded overstated. The debrief teaches executives these four classes by name, so they should be applied the same way every time.
- **Fix:** grade contradicted claims as unsupported, and give each row's "overstated" slot a true overreach ("every", a trend from one point, "proven"). Alternatively, add a fifth class, "contradicted", and keep it consistent.

### S-4. "Better or worse" good answer conflicts with B3
- **Where:** report-data.js:391 (good: "Where there are two measures, yes or no. Where there is one, it is a baseline") against :394 (wrong: "The night cover: 93% faster …", why "Two nights are a sample, not a trend") and B3 :101-102.
- **Problem:** 138 minutes and 10 minutes *are* two measures. The good answer's rule would allow "better", and the next option rejects it. The real distinction is two measures of the same thing, taken the same way over a period, against two separate incidents. As written, the lesson contradicts itself.
- **Fix:** "Where the same measure has been taken twice, yes or no. Where there is one, it is a baseline, and two incidents are a sample".

### S-5. Account and system names on the one-page summary (spec: "Business terms, not tool names")
- **Where:** report-data.js:143 (D1 good: "board-display’s two later sign-ins"); report.js:49 (CH_REP_SHORT 'CP-XFER': "cp-xfer’s return"), which feeds A1; drill 1's own response at report-data.js:222 says "Business terms on the page; the account names go in the annex".
- **Problem:** the supported lines break the rule the drill teaches.
- **Fix:** "the Board room display’s account, two sign-ins after expiry"; "the payroll supplier’s transfer account back in service". Keep the account names in the annex records.

### S-6. Debrief and summary show row codes, not names
- **Where:** report.js:213-215 (`x.id`: "A1 supported").
- **Problem:** an executive reading the debrief sees "A1, B3, C2" with no meaning attached. The page itself uses section names.
- **Fix:** show `x.name` beside the id ("A1 · Above appetite, on its owner’s acceptance").

### S-7. Owners accept tolerance breaks alone, while exceptions that break a tolerance escalate (carried from slices 1 and 2, now stated to the Board as supported)
- **Where:** A1 (report-data.js:55): "{ownerAcc}: above appetite, each one signed by its owner". The underlying acceptances: the airport's trust (Joanna; Medium against a Low privacy appetite) and cp-xfer (suppliers-story.js:118-132; "above the tolerance … Marit signs").
- **Problem:** LESSONS 11 escalates any *exception* that breaks a tolerance to the chair within five working days. A *risk acceptance* that breaks the Board's own privacy tolerance stays with a single owner until Day 155. A board chair would ask why a director can accept a breach of the Board's tolerance for 81 days when an exception cannot (LESSONS 3, rules and records disagree). The report now presents this to the Board as supported.
- **Fix (design note for the fix agent or the finale spec):** either record the chair's endorsement of each tolerance-breaking acceptance (as with 6.2a), or have A1's supported wording say "accepted by its owner; above the Board’s tolerance, so for the Board’s decision on Day 155". In both cases the Board is the decider of record. Also, A3 and drill 3 read residual risk on the decided plan rather than on what is in force (see M-4). A CISO's board report normally states the current residual and the target separately.

### S-8. The Board questions and minute recompute the facts on Day 88, not from the report as sent
- **Where:** report.js:222 and :228 (`chRepFacts()` fills the options); report-story.js:141 and :147 (the minute's corrected wording uses a fresh `chRepFacts()`); `p.sent.facts` is stored (report-story.js:130) but unused.
- **Problem:** nothing changes between Day 87 12:00 and Day 88 today. But LESSONS 12 ("as sent") is safest enforced structurally, and a later slice that changes the register mid-week would silently change the "as sent" quotes.
- **Fix:** use `p.sent.facts` in chRepBoardQs and chRepMinute.

### S-9. Recommended report carries two lines with the same fact
- **Where:** B2 (report-data.js:91) and E1 (:153), both recommended in (charter-timeline.md:70).
- **Problem:** both say tier-1 contracts signed with every must-have are 0 of 2. A CIO trimming a one-page report would cut B2. Spending one of ten lines on a repeat teaches padding.
- **Fix:** make B2 recommended out, or reword it to what changed: "Suppliers tiered for the first time on Day 71: the baseline for next quarter".

---

## Nits
- N-1. report-data.js:385: the good answer "I do, as the CISO: …" is the only option with "as the CISO" (LESSONS 14 names that wording). Suggest "I do: each decision in it stays with its own decider".
- N-2. report-data.js:360 (dojo 0): "MFA on every sign-in, but for six accounts …" drops the "to the shared directory" scope that B1 and the drill keep. cp-xfer (CP-XFER-01, key-only, outside the directory) also signs in without MFA, so the unscoped line is false.
- N-3. report-data.js:163: E2 with two or more must-haves reads "{a} and {b}: left out on my recommendation, its owner deciding …". Use "each one’s owner".
- N-4. report.js:72 on the override path gives "the chair decides EX-02 and this Board, in its minute, EX-04 at the review". It is clumsy but correct. Suggest "the chair decides EX-02, and this Board EX-04 in its minute,".
- N-5. Ivor's note calls it "the quarter since Day 64", but Day 87 is 23 days into a 91-day quarter (the next quarterly Board is Day 155). "Your first report, since Day 64" is more exact. The page header (report.js:131) has the same wording.
- N-6. story.js:27 creditsFacts and data.js:156 cite "NIST’s CSF 2.0 Implementation Examples" for GV.OV. After B-2's fix, add CSWP 29 there too.
- N-7. The `decide` metric (report.js:208) is labelled "decisions with a named decider and your recommendation". It actually counts *supported* wordings. C2's overstated variant names a decider and a recommendation but scores 0. Relabel it "decisions sent in the wording the records support", or score only decider and recommendation.
- N-8. charter4-build.md mentions no review of the CSWP 29 wording, and tests/charter.js:840 locks in the IE wording. Fix it together with B-2.

---

## Verified correct
- **GV.OV-01** (IE PDF and CSWP 29 agree): "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction". **GV.OV-01 Ex1** (IE PDF): "Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives". **GV.OV-03 Ex3** (IE PDF): "Collect and communicate metrics on cybersecurity risk management with senior leadership". The quotes in report-story.js:30 and :75 and data.js:156 match the IE exactly. The IE is dated "February 26, 2024" as printed. Sources: https://www.nist.gov/system/files/documents/2024/02/21/CSF%202.0%20Implementation%20Examples.pdf and https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf, fetched 2026-11-21.
- **NICE T1060**: "Advise senior management on organizational cybersecurity efforts", associated with OG-WRL-001, -003, -007, -008 and -014, matching CREDITS.md:270. https://niccs.cisa.gov/tools/nice-framework/task/t1060, fetched 2026-11-21. Slice 4 adds no new in-game use of it (data.js:153 is the slice 1 text).
- **Rolling Hitch Badge, name collisions**: five independent WebSearches, 2026-11-21: (1) "Rolling Hitch" with company, software, app or brand; (2) with security, GRC, compliance, cyber, game or badge; (3) with brewery, band, film, video game, podcast or LLC; (4) "Rolling Hitch" trademark; (5) with Pokémon, anime, One Piece, Fortnite, Minecraft or Zelda. No company, product, trademark, GRC or security tool, game, character or franchise of that name was found. The nearest results were generic "Hitch" towing apps and HITCH-formative trademarks (RAPID HITCH, HIDDEN HITCH). No collision; the name can stay.
- **Weekdays** (Day n = (n-1) mod 7 from Monday): Day 82 Friday, 85 Monday, 86 Tuesday, 87 Wednesday, 88 Thursday, 95 Thursday, 155, 246 and 428 Monday, 75 Friday, 78 Monday, 79 Tuesday, 81 Thursday. CH_DAY and CH_REP_DAY agree. The relative weekdays "Thursday’s minute" (Day 81), "Tuesday’s rule" (Day 79) and Edda's "Supplier minute on Day 74" are right for the day they are read. The exceptions are M-5.
- **Evidence before report**: every annex record is dated Day 86 17:00 or earlier (APP 64 12:00 … ACC/EXC 86 17:00). The report's time is Day 87 12:00. Ivor's "the members have your page" appears only after the Day 87 flag. The Board's questions are generated only at Day 88 14:00.
- **Arithmetic**: 05:52 to 08:10 = 138 minutes; 02:31 to 02:41 = 10; (138 - 10)/138 = 92.8%, so "93%"; Day 71 21:14 to Day 72 08:10 = 10 h 56 min; Day 64 to Day 155 = 91 days.
- **Recalled quotes** grepped exactly: "Inkmere signs on Thursday, with the clauses your plan priced" (story.js:333); "Staff records aren’t in the appetite’s list either. Both go to the Board’s Day 155 review" (suppliers-story.js:131); board-display 08:31 and 08:34 (policy-data.js:156); Rae Okafor "suspicion-file lead" (crossroads/data.js:93); the Quiet Thread times (crossroads/quiet.js:28-40).
- **Governance, as designed**: the override-path drill 3 (the Board decided in its Day 67 minute; Edda signed for the interim measures) and A2's supported line follow LESSONS 9. E2 records leaving a must-have out as the CISO's recommendation, with the owner deciding (LESSONS 9). C1 and C3 name the Board as decider with the CISO's recommendation. C2 names the escalated decider (6.2a / 6.3), never the owners alone (LESSONS 11). Marit and Edda each decide their own draft lines. The directive keeps the above-appetite item on the page in one line with the minute reference. The CISO never closes, signs or accepts.
- **Defender side only**: no technique, no new ATT&CK ID, no attack research. The only IDs in the edition remain the five Quiet Thread ones in Crossroads.
- **RFC 2606/5737/3849**: the slice-4 files contain no IP address, domain or URL.
- **Build**: report-data.js, report.js, report-story.js, story.js, data.js and risk.js are embedded verbatim in editions/charter/index.html.
- **Quiet Thread**: not resolved. One open item, not scored, not a line, no row, drill, question or option about it. "Who, and why: not known. This report draws no conclusion." The observation is consistent with the five recorded clues (S-1 covers where it goes, not whether it is accurate).
- **tests/charter.js**: exit 0, 134 of 134 checks "ok" (matches charter4-build.md). It passes despite B-1 because no check covers padding with supported lines.
- **tests/tells.js**: exit 0, no FAIL. The Charter scan covers the Board report's 14 rows. The gaps it misses are M-1 to M-3.

---

## Summary
Two blockers. (1) The report score's omission and over-length penalties are cancelled by supported optional lines: a report that leaves out both the above-appetite acceptances and the expired exceptions scores 100, the same as the dull report, which breaks the slice's central rule. The test misses it. (2) GV.OV-03 is shown as "CSF 2.0" in the Implementation Examples' wording ("measured"), while the CSF 2.0 Core (CSWP 29) says "evaluated". CREDITS and the timeline wrongly call the Core's wording "wrong".

Six must-fixes. Three are answer tells the scanner does not see: the editor's "Records:" note always favours the supported wording; the supported wording is never the shortest; and "as …" marks the weak wording 86% of the time. The other three: drill 3's persuaded-path verdict teaches "funded, so nothing to accept"; two weekday references drift; and the minute's decision list ignores what was sent and mixes the chair with the Board.

The real-world facts otherwise check out exactly (GV.OV-01, its Ex1, GV.OV-03 Ex3, NICE T1060 and its roles). Rolling Hitch has no collision in five searches. The timeline, the evidence-before-report rule, the arithmetic, the deciders, the defender-side scope and the RFC rules all hold.
