# Review: Charter slice 5, the finale (Days 92 to 95)
Independent review panel, 2026-11-21 (UTC), five roles: a sitting CISO, the general counsel of a public authority, a public-authority board chair, a communications director and a principal DFIR consultant. Reviewed at 1475b00 (build ARCD-20261121-2113Z). The diff reviewed runs from 13b860d to HEAD. Scope: editions/charter/disclosure.js, finale-data.js, finale-story.js and their wiring (story.js, data.js, risk.js, edition.json); tests/charter.js and tests/tells.js; CREDITS.md (the finale section); CAREER_LADDER.md; README.md; BACKLOG.md; tools/build.py and index.html (the series menu). These were checked against SPEC_ed3_slice5.md, facts_slice5.md, LESSONS.md (every class), review_charter4.md, charter4-fixes.md and charter-timeline.md (slice 5).

Nothing in the repo was edited except this file. Tests were run read-only. `node tests/tells.js` exited 0 with no FAIL. `node tests/charter.js` passed every check it ran (count at the end). No bot test was run.

Severity scale:
- **Blocker:** a real-world fact is wrong as published, or the slice breaks its own rule.
- **Must-fix:** a LESSONS class recurs, or the game teaches something wrong.
- **Should-fix:** a real weakness that teaches nothing wrong outright.
- **Nit:** a small point.

---

## Blocker

### B-1. "Only the Attorney General can delay" an 8-K Item 1.05 report is false. Item 1.05(d) is a second ground for delay.
- **Where:** editions/charter/finale-data.js:57 (the comparison card: "Item 1.05(c): disclosure may be delayed **only** “if the United States Attorney General determines …”"); finale-data.js:461 (dojo 2's explanation: "**only** the US Attorney General’s written notice to the SEC can delay disclosure"); editions/charter/data.js:179 (Field Manual `chfinsec`: "Item 1.05(c) lets disclosure be delayed **only** if the US Attorney General …").
- **Problem:** the codified rule has a second, separate delay provision for registrants subject to the FCC's CPNI breach rule. facts_slice5.md scoped the claim correctly ("Only the US Attorney General can trigger the national-security or public-safety delay"). The game dropped that scope and now makes a categorical claim about the law that is wrong. A general counsel or securities lawyer would catch it at once. Both quoted sentences also begin "Notwithstanding General Instruction B.1.", and the card leaves that out without saying so. It reads as harmless, but it hides the fact that there are two parallel provisions.
- **Evidence:** the SEC final rule, Federal Register, 4 August 2023, https://www.govinfo.gov/content/pkg/FR-2023-08-04/html/2023-16194.htm, rule text (fetched 2026-11-21, offset 360000):
  - Item 1.05(c): "Notwithstanding General Instruction B.1. to Form 8-K, if the United States Attorney General determines that" / "disclosure required by paragraph (a) of this Item 1.05 poses a substantial risk to national security or public safety," …
  - Item 1.05(d): "Notwithstanding General Instruction B.1. to Form 8-K, if a registrant that is subject to 47 CFR 64.2011 is required" / "to delay disclosing a data breach pursuant to such rule, it may delay providing the disclosure required" / "by this Item 1.05 for such period that is applicable under 47 CFR 64.2011(b)(1) and in no event" / "for more than seven business days after notification required under such provision has been made," …
- **Fix:** in all three places, replace "only" with a scoped statement. For example, on the card: "Item 1.05(c): disclosure may be delayed “if the United States Attorney General determines … and notifies the Commission of such determination in writing” (a separate paragraph, 1.05(d), covers telecommunications carriers under an FCC rule)." In dojo 2's explanation: "a national-security or public-safety delay comes only from the US Attorney General’s written notice to the SEC". Add the 1.05(d) entry to CREDITS.md. Add a tests/charter.js check that no finale text says "delayed only" or "only the US Attorney General … can delay".

---

## Must-fix

### M-1. NPCs state decisions on facts they have not yet received (LESSONS 2)
- **Where:**
  - finale-story.js:133-135. On the held path, Noor says at **Day 92 11:00**: "And the open item, when your packet reaches me: not in scope for any notice on these facts … My decision, as counsel." Packet 1 reaches her at **Day 93 09:10**. The record is timed 09:10, but the decision is spoken 22 hours earlier. tests/charter.js:1171 enshrines this.
  - finale-story.js:197. At Day 93 15:00 Noor says "On the facts in your packets: … That is my determination". On the held path packet 2 reaches her at 16:30, and on the misrouted path at 15:20 (finale-data.js:241-243). She cannot be determining on a packet she does not have.
  - finale-story.js:115. On the held path, at about 13:45, the narration says "Noor has it at 16:30, and sends it on to each member’s counsel then". The screen states an outcome hours before its time, ahead of the 15:00 scene.
  - finale-story.js:222-227. When packet 3 is held (sent 14:30), Ivor says "Your facts are not in front of me", and the same modal then says "From your packet, the chair took the record’s wording for …".
- **Problem:** this is the recurring class 2: characters know outcomes before their timeline time. The game's own lesson ("the facts go to counsel first") is undercut when counsel decides on facts that have not yet reached her.
- **Fix:**
  - Members' call (held path): Noor says only "I don’t have your packet yet; I’ll decide the open item when it reaches me". Add a later beat, when the packet arrives (Day 93 09:10, at Edda's 09:00 scene or at Noor's desk), in which Noor decides.
  - Determination: on held or misrouted packet 2, she says "On packet 1 and what Edda and Wellhollow have told me" (no packet 2). Alternatively, move her determination to the packet's arrival time and let N-3's trigger move with it (the clock follows the record).
  - The 13:45 line: "Held. Noor’s checkpoint was 14:00." Nothing more about the future.
  - The statement modal on the held path: "The chair worked from Noor’s and Edda’s facts; your packet reached him at 14:30."
  - Re-pin tests/charter.js:1171 and add a test for each path.

### M-2. The chair praises "on time" unconditionally; the badge and the end ignore the packets as sent (LESSONS 12)
- **Where:** finale-story.js:305 ("You brought this Board the facts on time, and counsel first."); finale-story.js:328 ("The facts reached counsel first, and on time, with what was not known said plainly.").
- **Problem:** both lines run on every path. On the path tests/charter.js plays (1220-1230: P1 late, P3 late, on time 33%, K3 left out), the chair still says "on time" and "what was not known said plainly". Scorecards must score the advice as sent, not a scripted end state. Here the narrative contradicts the scorecard on the same screen.
- **Fix:** key both lines to `chFinStats()`. On time 100% and every unknown stated: the current line. Otherwise, name what was late or left out: "Packet 1 reached Noor on Tuesday, a day after N-1’s time; K3 was not in it." Keep the badge if it is a progression item, but give it a different citation when the packets were late. Add a test on the poor-advice path that the line does not say "on time".

### M-3. The Board receives packet 1 "as you sent it", including the open item Noor kept out of the Board papers (LESSONS 3; repeats the review_charter4 S-1 class)
- **Where:** finale-story.js:296 ("This Board has your three packets as you sent them"), with disclosure.js:115 (packet 1 as sent carries the open item: FD-STAFF-11's address and the CP-OPS-02 sign-in observation); finale-story.js:134 (Noor: "It stays with Rae Okafor’s team and me, and out of the Board papers. My decision, as counsel."); finale-story.js:292 (the minute: "The suspicion file noted as an open item, with counsel").
- **Problem:** counsel decided the observation stays out of the Board papers. The chair then tells a meeting of every member's representative that they have the packet as sent, and the minute (a Board paper, and in a public authority often a public record) mentions the matter. That contradicts her decision. The general counsel and board-chair roles both flag this as the same error the slice 4 fix pass closed.
- **Fix:** "This Board has the rows of your three packets as you sent them. The open item is with Noor, at her direction." Remove "The suspicion file noted as an open item" from the minute, or word it as Noor's: "One matter is with counsel, at counsel’s direction." Add a test that the minute and the Board round contain no FD-STAFF, no CP-OPS-02 sign-in observation and no "suspicion file".

### M-4. Packet 3 says "our chair decided this statement" two hours before he decides it (LESSONS 2)
- **Where:** finale-data.js:215 (M4's supported wording: "… and our chair decided this statement", records DET and MEM); the packet is sent at Day 94 10:00 (finale-data.js:246) with records to 09:30, and the chair decides at 12:00 (finale-story.js:220-225). The misplaced variants at :217 and :219 carry the same clause.
- **Problem:** a facts packet records a decision that has not been taken, and cites no record of it (none exists until 12:00). It also presumes the decider's outcome, which the slice warns against. The chair could have decided on a different statement, or on none.
- **Fix:** M4 supported: "Each member’s own counsel decides any notice to its people, and our chair decides this statement". Make the same change in both variants. In chFinStatementText (finale-story.js:216-219), the chair's published version can turn it into "decided" after 12:00.

### M-5. Packet 2 goes to counsel alone, but N-1 says counsel *and the chair* at each checkpoint (LESSONS 3)
- **Where:** finale-data.js:40 (N-1: "The CISO gives counsel and the chair the facts known … within 4 hours of the incident log’s first entry, then at each checkpoint counsel sets."); finale-data.js:139-140 (P2 "to Noor", dueRule "Noor’s checkpoint (N-1)"); finale-data.js:240 (the recommended send: "Send it to Noor at 13:45").
- **Problem:** the recommended path breaks the rule it is graded under. The chair, who decides the statement the next day, never receives packet 2 from the CISO.
- **Fix:** either send packet 2 "to Noor and the chair at 13:45", or reword N-1 to "… then to counsel at each checkpoint counsel sets". Choose one, and pin it in tests/charter.js.

### M-6. A supplier's retention is "ruled out" from the Compact's own job setting (LESSONS 1: claims about another party)
- **Where:** finale-data.js:347 (finhold alt: "Wellhollow keeps more than the job sets", good: true, "Ruled out: the job sets 35 nights at Wellhollow."); :330 ("Kept at Wellhollow: 35 nights"); :95 (K2 supported: "Wellhollow holds 35 nights of copies …, by our own records"); :97-98 (the "not known until Wellhollow says" wording graded *unsupported* because "Our own records say it").
- **Problem:** the Compact's job sets a retention value and records what it sent. What the supplier still holds is on the supplier's side: its own snapshots, replicas, deleted-but-recoverable data, and any failure to apply the retention setting. Clause C7 (return and delete) applies only at exit. A DFIR consultant would never treat our own config as proof of a third party's holdings. The drill teaches that it is, and the packet then penalises the more careful wording.
- **Fix:** K2 supported: "Sent to Wellhollow: every member’s file shares, records included, nightly; our job keeps 35 nights there, by our own records; whether Wellhollow holds more is its to say (asked 06:40)". The alt becomes "Wellhollow keeps more than the job sets", not good, why "Not ruled out by our records: our job sets 35 nights; what Wellhollow holds beyond that is for its answer". The drill verdict: "… sent nightly, 35 nights by our setting". Re-grade K2's "not known" variant as overstated (it denies what our own records do show: what was sent), not as unsupported.

### M-7. The Board's debrief ignores when and to whom the packets went, and a standing question rests on a false premise on late paths (LESSONS 12, 2)
- **Where:** finale-story.js:259-269 (chFinBoardQs: weak rows only, never `sent.onTime` or `sent.to`); finale-data.js:466 ("Why did Noor have the facts before most of this Board?", with its good answer "N-1 names counsel and the chair, within four hours").
- **Problem:** a player whose rows are all supported but who held packet 1 until Tuesday, or sent it through the chair, gets the standing questions. Those questions presume Noor had the facts within four hours. The timeliness the finale is about is never questioned at the Board, and the debrief is keyed to the packets' rows, not to the packets as sent.
- **Fix:** give a late or misrouted packet priority after an omitted row: "Your packet 1 reached Noor on Day 93 09:10. N-1 says 10:25 on Monday. Why?", with options taken from the CH_FIN_SEND whys. Ask "Who heard first" only when packet 1 was on time and sent direct.

### M-8. Length tell: the right answer is the longest in all six dojo and standing Board lists (LESSONS 14)
- **Where:** finale-data.js:447-461 (CH_FIN_DOJO) and :464-482 (CH_FIN_BOARD_SPECS).
- **Evidence:** a vm harness (labels as written) gives option lengths, the right one in bold: dojo 0 **150**/125/116; dojo 1 110/**120**/96; dojo 2 76/75/**77**; "Who heard first" **78**/76/67/61; "The court record" **79**/72/64/74; "Our statement" **58**/53/51/45. The chance of 6 of 6 is (1/3)³ × (1/4)³ = 1/1728. These are the lists every player meets on the recommended path, and they carry the real cases.
- **Context (the lentell count):** across the district, lentell reports longest-is-correct 17 of 43 against 13.2 by chance, and shortest-is-correct 16 against 11.7. Each count alone is within about 1.3 sd. Together, 33 right answers sit at an extreme against about 25 by chance. "Never pick the middle length" is a weaker tell across the district. The length signal is concentrated in these six lists and in the packets (S-11).
- **Fix:** shorten each right answer or lengthen a distractor so the right answer is third or shorter in at least three of the six. For example, dojo 0: "Convicted 5 October 2022 (FTC obstruction, misprision); probation and a $50,000 fine; affirmed; certiorari denied". Extend tells.js's rank check to CH_FIN_DOJO and CH_FIN_BOARD_SPECS.

---

## Should-fix

### S-1. N-1's clock starts at an act of the CISO, the person it times (governance; general counsel and board chair)
- **Where:** finale-data.js:34 (trigger `log`, the incident log's first entry), :39-41, :302-305.
- **Problem:** the rule lets the person whose timeliness is measured choose when the measurement starts. The game makes the right answer "open it at 06:25", but as a rule it is the weakest of the four. A general counsel would anchor it to an event the CISO does not control: the notice's receipt by the named security contact (Day 92 06:10, a recorded event already in CH_FIN_EVENTS). The wrong-answer text "a clock that starts late is still late" (:304) contradicts the rule's own mechanics: under N-1 as written, a log opened at 08:45 *does* move the due time to 12:45.
- **Fix:** N-1 and N-2 triggered by "the notice’s receipt by the Compact’s named security contact, or the incident log’s first entry, whichever is first". Due times become 10:10 and Day 93 06:10, and P1 at 10:00 is still on time. Alternatively, keep the rule and add one line to the Field Manual on why a trigger should not be in the timed person's hands.

### S-2. Pausing the copies leaves the Compact with no off-site copy, and nobody records or decides that (CISO)
- **Where:** suppliers-data.js:53 (Wellhollow: "until we need a restore: then it is our only off-site copy"); finale-story.js:61-62, :351.
- **Problem:** containment is right (nothing destroyed, LESSONS 5), but it opens an availability gap of three days and more against the availability tolerance. No line in the incident log, the register or the decision log records it. A CISO would put it in front of Edda the same morning (an interim off-site copy, or an accepted gap with an end date).
- **Fix:** one beat at 08:05: "No off-site copy while paused: Edda’s to decide (interim copy to …, or accepted until the copies resume)". Add a decision log row, and a K5 clause in the supported wording ("our only off-site copy paused").

### S-3. The conditions for resuming omit rotating the Compact's credential to Wellhollow's store (DFIR; LESSONS 6)
- **Where:** finale-story.js:351 (Edda: "until Wellhollow’s answers cover the store and our own evidence agrees"); charter-timeline.md slice 5, Deciders. The upload key is named at finale-data.js:300.
- **Fix:** "… and our upload key to its store replaced", stated in Edda's line and in the timeline.

### S-4. Evidence handling: no hashes, no custodians, no time base, a rolling 35-day edge log, and no preservation request to the supplier (DFIR, general counsel)
- **Where:** finale-data.js:61-74 (records with times only), :367-374 (the edge log is "35 days", rolling); finale-story.js:64 (the export at 08:05).
- **Problem:** a defender-side record that will reach counsel and maybe a court should show, for each export, who took it, a hash, and where it is held. It should also state the clock all times are in. Wellhollow's 22:47 is "Wellhollow’s time", and C1's 7 h 23 min assumes the same zone. The edge log will roll the incident's days out within weeks unless it is preserved. Counsel would also normally send the supplier a written request to preserve its logs.
- **Fix:** give each record a custodian and a "hash noted" field, for example "JOB · exported 08:05 by Edda’s team, hash noted, evidence share" (game). Add one line, "All times Compact time; Wellhollow’s as it states them, its zone asked at 06:40". Add the edge log to a hold at 08:30. Add a decision row "Asking Wellhollow in writing to preserve its logs: Noor".

### S-5. Nobody asks whether the copies were encrypted, or who holds the key (general counsel, DFIR)
- **Where:** the packets (finale-data.js:78-228) and drill 1 (:309-353).
- **Problem:** for counsel deciding "may have been acquired", whether the copies were encrypted before they left, and whether Wellhollow held the key, is often the decisive fact. It is the first question an experienced general counsel asks.
- **Fix:** an optional row K7 in packet 1, or better a required one: "Copies encrypted before sending: yes or no by the job’s settings; the key held by: …", or "not known at 09:20", graded like K3. This also gives the job's scope record a second use.

### S-6. The copies at risk are the store's contents during 21:58 to 22:40 on Day 91, not Day 58 to Day 92 (DFIR precision)
- **Where:** finale-data.js:155 (L2 "every night’s copy from Day 58 to Day 92"); :165 (L3); finale-story.js:171.
- **Problem:** Day 92's copy (01:00 to 01:42) went to the store after the window Wellhollow names, and after its detection at 22:47. With 35 nights kept, the store during the window held about Day 57 to Day 91. L2 is a true statement about the store today, but L3 and M2 ask about the window.
- **Fix:** L2: "… 35 nights; during 21:58 to 22:40 on Day 91 it held our copies of Days 57 to 91, by our job log, Day 92’s going after". Alternatively, keep L2 and add the window to L3's supported wording.

### S-7. "In: none" for a service our side only connects out to (DFIR)
- **Where:** finale-data.js:372 (the edge log "in, none in 35 days"), :113, :377.
- **Problem:** traffic returned within the nightly outbound sessions is "in" in any packet capture. The precise statement is that no connection was opened from Wellhollow's range. This is a wording point only and needs no mechanism.
- **Fix:** "no connection opened from 198.51.100.0/24 in 35 days; only our own nightly sessions out", with the verdict worded the same way.

### S-8. The public statement, as a communications director reads it
- **Where:** finale-story.js:216-219 (the statement is the four required P3 rows' supported wordings, joined); finale-data.js:189-220.
- **Problems:**
  - (a) It ends "and our chair decided this statement". That is internal governance language in public copy, and it reads as defensive.
  - (b) The news is buried. M1 says only "an incident", while M2 reveals that "files [were] taken from the supplier’s store". The known fact (files were copied out of one store) should lead, with the unknown next to it.
  - (c) It gives no next step for residents (what to watch for, where to ask), no contact point, and no time for the next update. These are the basic parts of a holding statement.
  - (d) "Each member’s own counsel decides any notice to its people" is accurate but reads as handing off responsibility. It should say the members will contact affected people directly.
  - (e) Because the statement is the CISO's packet rows verbatim, Ada's and Noor's advice changes nothing. That contradicts "Ada advises and drafts" (finale-data.js:248).
  - (f) Ada is the *town's* communications officer (data.js), and the town is itself an affected member with its own notice clock. The members' own communications leads are not coordinated with the statement.
- **Fix:** keep packet 3 as facts. Build the statement from them in Ada's words, for example: "On Day 92 our off-site backup supplier told us that files had been copied from one of its storage systems on Day 91. We do not yet know whether copies of our members’ records were among them. We stopped sending copies to the supplier the same morning and told every member. Where anyone’s information may be affected, their own organisation will contact them directly. Next update: [Day]. Questions: [line] (game)." Note in the scene that Ada coordinated it with each member's communications lead.

### S-9. S-7 as adopted is sound in principle, but incomplete as enforced (board chair, general counsel)
- **Where:** disclosure.js:181-192 (chFinAuditNow); finale-story.js:271-279 and :290-291.
- **Assessment:** making the Board the decider of record for a breach of its own tolerance, with delegated authority to the chair within five working days and ratification at the next minute, is standard board practice. It is consistent with LESSONS 9 and 11. Three gaps:
  - (a) The minute says the chair's decision goes "into this Board’s next minute", but the invariant accepts the chair's decision alone and never checks the ratification.
  - (b) The minute decides cp-xfer's acceptance without recording that it ran 21 days on its owner alone, past its five-working-day mark (Day 81). A minute should record the lapse, not just cure it.
  - (c) There is no fallback when the chair is conflicted or absent (the vice-chair, or the Board by written resolution).

  Separately, an owner's acceptance that is above appetite but within tolerance (the airport's trust) remains the owner's alone. That is defensible, but the rule should at least require it to be reported to the Board at its next meeting.
- **Fix:**
  - The invariant: after the next minute's day, require `boardDecided` (the ratification).
  - Minute text: "… which ran on its owner’s acceptance alone from Day 74, past Day 81, before this rule; now this Board’s decision of record …".
  - Add "(or, if the chair signed it or is absent, the vice-chair)".
  - Add "above-appetite acceptances within tolerance: reported to this Board at its next meeting".

### S-10. The packets' "rows supported" metric is lifted by supported optional rows
- **Where:** disclosure.js:153 (`claims = sup/inc`, optional rows included) and :165-167 (chFinStats, the scorecard's chFinClaims).
- **Problem:** the packet score is correctly protected: only required rows earn. The scorecard's "Packet rows supported (%)" is not. With 13 required rows and 2 weak, the metric reads 85%. Add the three optional rows, all supported, and it reads 88%. Optional credit partly offsets a penalty in a scored metric, which is the B-1 class from slice 4, in a milder form.
- **Fix:** compute chFinClaims over the required rows sent. Alternatively, label it "of every row sent" and show the count of weak rows next to it.

### S-11. Packets: the supported wording is the shortest in 8 of 16 rows (chance 4.9), and tells.js checks only one side
- **Evidence:** the harness gives shortest supported wordings in K1, K2, K5, L3, L4, M1, M3 and M4, and longest in L1 and L5. In packet 3, 3 of the 4 required rows have the shortest supported wording. tests/tells.js:657 and :704 require the right wording to rank ≥ 3 *at least* a third of the time and rank ≤ 2 *at most* at chance. That pushes wordings toward the shortest and never caps it. The send choices have the same lean: the right one is the shortest in 2 of 3 lists.
- **Fix:** cap "shortest" at chance + 1 in the same check, and lengthen the supported wording in two or three of K1, K5, M1, M3 and M4.

### S-12. Privilege and public-records markings on the counsel packets (general counsel)
- **Where:** finale-data.js:79-80 and :139-140 (the packet heads).
- **Fix:** "Prepared at counsel’s request, for counsel and the chair (game)" on P1 and P2. Packet 3 says "for the statement" and is not marked. This is one line, and it teaches that the facts go to counsel *as counsel's*.

### S-13. No decider is named for referral to law enforcement
- **Where:** finale-data.js:253-259 (CH_FIN_DECISIONS); N-3 depends on a law-enforcement request (:46); the comparison card and RS.CO-02 Ex3 are about notifying law enforcement.
- **Fix:** add the decision "Whether to report the incident to law enforcement: Noor, for the town and the shared services". Alternatively, say in the timeline why it is out of scope.

### S-14. The series menu's order still depends on the slice counts of Town Hall and Crossroads
- **Where:** tools/build.py:36 and :147 (`edition`, else `slice`); editions/town-hall/edition.json and editions/crossroads/edition.json have no `edition` field (they have slice 1 and 2).
- **Problem:** the fix is correct today (the menu reads 1, 2, 3). But it will break again the first time Crossroads' slice count is not 2.
- **Fix:** add `"edition": 1` and `"edition": 2`, and add a build check that every edition.json has `edition`.

---

## Nits
- **N-1.** finale-data.js:454: "most claims dismissed in July 2024". The court says "grants in large part"; use its words, or say "most of the SEC’s claims were dismissed at the pleading stage".
- **N-2.** finale-data.js:59: the card cites "effective 5 September 2023". For Item 1.05, the fact sheet gives compliance from "the later of 90 days after the date of publication in the Federal Register or December 18, 2023" (smaller reporting companies "or June 15, 2024"), https://www.sec.gov/files/33-11216-fact-sheet.pdf. Add it, or drop the date.
- **N-3.** finale-data.js:44 (N-2's decider: "the chair tells them, the CISO and Noor beside him") disagrees with finale-story.js:128-129, where the CISO and Noor are together by the window while "the chair is on the call". Change it to "the chair tells them; Noor and the CISO brief him".
- **N-4.** finale-data.js:479: "You did, …" is the only "You" opener among the standing questions, and it is the right one (LESSONS 14). Suggest "The chair: on Noor’s and Ada’s advice, from the facts packet".
- **N-5.** disclosure.js:108: the open item cites "CP-OPS-02’s sign-in log, 30 days to 09:00", which is not in CH_FIN_RECORDS, so it has no record line or time in "The records". Add it as a record (for counsel only).
- **N-6.** story.js:318: on the held path, `G.day >= 93` makes Ivor say "Your packet is with me, and with Noor" before 09:10 on Day 93.
- **N-7.** CAREER_LADDER.md (the Sullivan paragraph, edited in this diff) still says "about 57 million users and drivers". DOJ: "records on approximately 57 million Uber users and 600,000 driver license numbers" (facts_slice5.md §1a).
- **N-8.** CREDITS.md and story.js:28 (creditsFacts) say NIST's v2.1.0 and v2.2.0 change summaries "list no change" to the earlier tasks. That claim was carried forward, not re-checked in this slice. Either re-check it or drop it now that 2.0.0 is the version used.

---

## Verified as correct (fetched 2026-11-21 unless noted)
- **DOJ, verdict:** https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-convicted-federal-charges-covering-data-breach. The page reads "Wednesday, October 5, 2022"; "the jury concluded he obstructed justice, in violation of 18 U.S.C. § 1505"; "in violation of 18 U.S.C. § 4"; "including the General Counsel of Uber, and never mentioned the incident to them."; "which disclosed the breach publicly, and to the FTC, in November 2017."
- **DOJ, sentencing:** https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-sentenced-three-years-probation-covering-data. The page reads "Friday, May 5, 2023"; "was sentenced to serve a three-year term of probation and ordered to pay a fine of $50,000"; "two felonies". The game never says prison. Dojo 0's prison option and the Board's prison option are both wrong answers.
- **Ninth Circuit, No. 23-927:** https://cdn.ca9.uscourts.gov/datastore/opinions/2025/11/12/23-927.pdf reads "Filed March 13, 2025"; "Amended November 12, 2025"; "No. 23-927"; "AFFIRMED."; "The opinion filed March 13, 2025, is hereby amended."; "The petition for rehearing en banc is DENIED."; "Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary."; footnote 6 begins "We need not decide whether a bug bounty program". The original opinion (…/2025/03/13/23-927.pdf) also reads "Filed March 13, 2025" and contains the same general-counsel sentence. The game quotes it exactly (data.js:180, finale-data.js:451).
- **Bug bounty:** no right answer or Field Manual line says bug bounty payments are illegal. The only such statements are wrong answers (finale-data.js:449 and :474), and each is rebutted with "The court said it need not decide that". The paraphrase "may give researchers prior authorisation" is not presented as a quote.
- **Supreme Court, No. 25-1082:** https://www.supremecourt.gov/docket/docketfiles/html/public/25-1082.html shows "Joseph Sullivan, Petitioner" v. "United States"; "Mar 12 2026 Petition for a writ of certiorari filed."; "Jun 29 2026 Petition DENIED."
- **SEC Litigation Release 26423:** https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26423 reads "Litigation Release No. 26423 / November 20, 2025"; "No. 1:23-cv-09518-PAE (S.D.N.Y. filed Oct. 30, 2023)"; "to dismiss, with prejudice,"; "in the exercise of its discretion".
- **S.D.N.Y. opinion:** https://nysd.uscourts.gov/sites/default/files/2024-07/SolarWinds%20Opinion%20Dkt.%20125-1.pdf reads "Filed 07/18/24"; "23 Civ. 9518 (PAE)"; "For the reasons that follow, the Court denies in part, but grants in large part, the motion to dismiss."; "As to pre-SUNBURST disclosures, the Court sustains the SEC's claims of securities fraud" / "based on the company's Security Statement."; "As to post-SUNBURST disclosures, the Court dismisses all claims." The game frames SolarWinds as allegations only, states no finding, gives no reason beyond the quoted words, and uses it only in the dojo. Its wrong answers ("found … false", "settled", "penalty") are rebutted.
- **8-K, apart from B-1:** General Instruction B.1 "A report pursuant to Item 1.05 is to be filed within four business days after the registrant determines" / "that it has experienced a material cybersecurity incident." and Instruction 1 "A registrant's materiality determination regarding a cybersecurity incident must be made" / "without unreasonable delay after discovery of the incident." match the card exactly (Federal Register rule text, offset 360000). The fact sheet's "file an Item 1.05 Form 8-K generally within four business days of such determination." is confirmed. The card is labelled comparison only, says "the registrant" decides and that the rule names no officer, says business days counted from the determination, and says the Compact is not a registrant.
- **CSF 2.0 Core (CSWP 29),** https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf: RS.CO-02 "Internal and external stakeholders are notified of incidents"; RS.CO-03 "Information is shared with designated internal and external stakeholders"; GV.RR-02 "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated," / "understood, and enforced"; GV.OV-03 "… is evaluated and reviewed for adjustments needed". "Counsel" does not appear in the document. The game never claims CSF mentions counsel, and data.js:178 says none of these texts names it.
- **Implementation Examples,** https://www.nist.gov/system/files/documents/2024/02/21/CSF%202.0%20Implementation%20Examples.pdf: RS.CO-02 Ex3 "Notify law enforcement agencies and regulatory bodies of incidents based on criteria in the incident response plan" / "and management approval"; RS.CO-03 Ex4 "Regularly update senior leadership on the status of major incidents"; GV.RR-02 Ex2 "Document who is responsible and accountable for cybersecurity risk management activities" / "and how those teams and individuals are to be consulted and informed"; GV.OV-03 there reads "measured". The finale quotes the Core for subcategories and the IE for examples, each labelled. GV.OV-03 keeps "evaluated" (the slice 4 B-2 class does not recur).
- **NICE:** the NICCS role page shows "Version: 2.0.0" and "(NIST SP 800-181 Rev 1) (Version: 2.0.0)", and lists T1310, T1054, T0006, T1234, T1779, T1476 and T1060 word for word as data.js:181 quotes them. The T0006 task page lists OG-WRL-006 Cybersecurity Legal Advice and OG-WRL-007. T1221 is not used. CAREER_LADDER now says 2.0.0 consistently, describes v2.2.0 only as NIST's later release, and states the appeal and the July 2024 ruling as verified, with primary URLs.
- **Heaving Line Badge, two independent searches:** (1) "Heaving Line" with company, software, app, game or badge; (2) with cybersecurity, GRC, compliance, trademark, brand, podcast or brewery. Neither found a company, product, game, trademark, GRC or security tool, franchise or podcast of that name. The nearest results were Heave Ho (a game) and generic GRC podcasts. This agrees with the build's four searches in CREDITS.md. No collision.
- **Days and weekdays:** Day 91 Sunday, 92 Monday, 93 Tuesday, 94 Wednesday, 95 Thursday, 107 Tuesday, 155 Monday, 74 Thursday, 81 Thursday. N-3: ten working days after Day 93 is Day 107 (97/98 and 104/105 skipped). The distractors' Day 103 (from Day 91) and Day 106 (from Day 92) are computed correctly. Day 58 to Day 92 is 35 nights. 22:47 to 06:10 is 7 h 23 min. Day 74 to Day 95 is 21 days. CH_DAY and CH_FIN_DAY agree. Within the week, lines name earlier days by number.
- **Deciders:** one per decision, and the CISO decides only what the packets say. Edda decides containment, Noor the town's and shared services' notice, the Clinic's counsel the Clinic's, the chair the statement on Noor's and Ada's advice, and Director Strand the Library's data. Every misplaced wording and every wrong routing choice is rebutted. The CISO never decides disclosure.
- **Clocks start at their triggers:** N-3 runs from Noor's determination, not from detection, the notice or Wellhollow's answer. Drill 3 teaches exactly that. A rule whose trigger has not happened shows "waits". N-4 has no clock of its own.
- **Graded as sent:** `rec.sent.picks` is copied at send time and graded from that copy. Unknowns (K3, L3, M2) are required rows and earn. The packet score lets only required rows earn: optional supported rows add 0 and weak optional rows cost 10, so no optional row cancels a penalty in the packet score (S-10 covers the claims metric).
- **Containment:** pausing destroys nothing. The "export first" and "keep running" options are rebutted (LESSONS 5). Deleting the supplier-held copies is rebutted as destroying evidence.
- **Defender side only:** no ATT&CK ID, no intrusion mechanism, nothing on how Wellhollow's side was reached. Addresses are 198.51.100.0/24 and 203.0.113.x only (RFC 5737). There is no domain, URL or e-mail in the finale files.
- **The Quiet Thread** advances and stays unresolved. It is one open item with "Who, and why: not known. No link to Wellhollow’s incident is drawn.", and Noor decides scope. The edition's end reads "Who, and why: not yet known". (M-3 concerns where the item goes, not whether it is resolved.)
- **Recalled quotes grepped:** "No account on our side." (suppliers-data.js:53); C1 "within 24 hours of detecting a security incident on any system used for the service, with the time it was detected" (:67); C7 (:79); Ada's "If a reporter calls you, you send them to me." (town-hall/council-story.js:443); "communications officer" (town-hall/council-data.js).
- **Series menu and next edition:** index.html lists 1 Town Hall, 2 Crossroads, 3 Charter, then "Next edition: coming later (the vCISO edition)". The ending says the same. README and edition.json are updated.
- **The no-repeat check against review_charter4:** B-1 (padding) does not recur in the packet score. B-2 (GV.OV-03 wording) does not recur. M-1 (a records-count tell) does not recur: refs are equal and hidden in the editor. M-3 ("as") is in band. M-5 (weekday drift) does not recur. M-6 (the minute lists decisions as made, with deciders) holds. S-1 (the open item in Board papers) recurs: see M-3. The M-2 length class recurs in a new shape: see M-8 and S-11.

## Tests run (read-only)
- `node tests/tells.js`: exit 0, no FAIL. It reports the packets scanned (16 lists, one supported wording each, refs equal) and passes its one-sided rank check (see S-11).
- `node tests/charter.js`: exit 0, passed 160, failed 0 (matches charter5-build.md). The tests pin behaviour that M-1 (tests/charter.js:1171) and M-2 (:1225) say must change.

## Summary
One blocker. The comparison card, dojo 2 and the Field Manual say that only the US Attorney General can delay an Item 1.05 report. The rule's own paragraph (d) gives a second, FCC-based delay, so the statement is false as published.

Eight must-fixes:
- NPCs decide on packets they have not yet received, on the held and misrouted paths (Noor's open-item decision, her determination, the statement modal).
- The chair praises "on time" on every path.
- The Board is told it has packet 1 "as sent", with the open item counsel kept out of Board papers.
- Packet 3 says the chair "decided" the statement two hours before he does.
- Packet 2 bypasses the chair, though N-1 names him.
- The drill "rules out" what a supplier holds from the Compact's own retention setting.
- The Board's debrief never asks about late or misrouted packets.
- The right answer is the longest in all six dojo and standing Board lists (about 1 in 1,700 by chance).

The real-world record otherwise checks out word for word: Sullivan's dates, statutes, the Ninth Circuit's caption and its general-counsel sentence, footnote 6, certiorari denied 29 June 2026, SolarWinds as allegations with the SDNY opinion and LR-26423, CSF Core and IE wording, NICE 2.0.0. Heaving Line has no collision. The days, deciders, triggers and as-sent grading are sound. S-7 is sound governance in principle; S-9 lists what it still needs (ratification enforced, the lapse minuted, a fallback when the chair is conflicted). The DFIR record is defender-side and plausible, but it needs custody details, a time base, the encryption question, credential rotation before resuming, and the exfiltration window scoped correctly.
