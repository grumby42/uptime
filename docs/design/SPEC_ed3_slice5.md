# Charter slice 5: Finale — a material incident and the disclosure clock
Spec written 2026-11-21 (UTC). Read docs/design/SPEC_ed3.md, SPEC_ed3_slice1–4.md, LESSONS.md (every class), BACKLOG.md, charter-timeline.md (extend it FIRST), CAREER_LADDER.md §3/§6/§7a, docs/design/facts_slice5.md (the ONLY source for real-case facts in this slice), and the repo after the slice 4 fixes.

Reviewers: a sitting CISO, general counsel of a public authority, a public-authority board chair, a communications director, and a principal DFIR consultant.

## Defender-side only (hard rule)
The incident is told only through the Compact's records: alerts, log lines, timestamps, decisions, notices and outcomes. No intrusion mechanism; no ATT&CK IDs beyond those already cited (the Quiet Thread's five). Fixed content lists.

## The incident (game)
A Compact-wide incident touching a tier-1 supplier relationship or a shared service from earlier districts (reuse, don't invent new infrastructure). The CISO's job: establish facts on time, contain without destroying evidence, keep a record of who knew what and when, and put facts in front of the deciders. Deciders (one each, whoever is on duty): counsel (Noor for the Compact; each member's counsel for that member) decides legal notification duties; the Board's chair decides the Compact's public statement on counsel's and communications' advice; the owner decides service changes; Edda decides technical containment on the shared platform. The CISO recommends and supplies facts; never decides disclosure.

## The disclosure clock (primitive, build it now)
- A clock driven by the game's own (game-labelled) notification rules for the Compact — a public authority, not an SEC registrant. Each rule states its trigger in exact game wording; the clock starts where the rule says (the Suppliers lesson), not where anyone prefers.
- A labelled comparison card: "How a US public company would be timed (comparison only)": SEC Form 8-K Item 1.05 — report within four business days after the registrant determines the incident is material; materiality determined without unreasonable delay after discovery; delay only on the US Attorney General's written notice to the SEC; the registrant decides, not the CISO. Quote only from facts_slice5.md and spot-check each quote on the primary page before use (the research note says WebFetch reassembled long sentences).
- Facts packets: the player assembles what counsel needs at each checkpoint (what is known, what is not known, since when, from which record); graded with the slice 4 claim grades (supported / unsupported / overstated / misplaced). Unknowns stated as unknowns earn credit.

## Real cases (dojo and boss framing only, from facts_slice5.md)
- United States v. Sullivan, as "what the court record says": convicted 5 Oct 2022 of obstruction of an FTC proceeding (18 U.S.C. § 1505) and misprision of felony (18 U.S.C. § 4); sentenced 5 May 2023 to three years' probation and a $50,000 fine; the Ninth Circuit affirmed (No. 23-927, opinion filed 13 Mar 2025, amended 12 Nov 2025); certiorari denied 29 Jun 2026 (No. 25-1082) — state these ONLY after spot-checking each on the primary page. Lesson: facts go to counsel (the record: he did not inform Uber's general counsel). Do NOT imply bug bounty payments are illegal (the court said it need not decide). No characterisation beyond the record.
- SEC v. SolarWinds and Brown: dojo discussion only, never a boss. Allegations labelled as allegations; no findings. State: July 2024 SDNY opinion granted the motion to dismiss in large part (only fraud claims based on the pre-incident Security Statement survived at the pleading stage); the SEC later dismissed with prejudice (Litigation Release No. 26423, 20 Nov 2025). Discussion question only.

## Frameworks
- CSF 2.0 (from facts_slice5.md, spot-checked): RS.CO-02 Ex3, RS.CO-03 Ex4, GV.OV-03 (use the Core wording "evaluated"; note the Implementation Examples PDF says "measured" — quote whichever document you cite, exactly), GV.RR-02 Ex2. Do not claim CSF mentions counsel.
- NICE OG-WRL-007 tasks confirmed on their own NICCS pages only (T1060, T1310, T1054, T0006, T1234, T1779, T1476); omit T1221 unless its task page is fetched. Use the version the NICCS page shows (2.0.0) and correct CAREER_LADDER where it says otherwise.

## The Quiet Thread
Advances, not resolved (resolution is the final edition's): a risk-committee and disclosure matter — one defender-side observation consistent with the five recorded clues enters the facts packet as an open item with no conclusion, and counsel decides whether it is in scope for any notice.

## Endgame
Board debrief (3 rounds) keyed to the packets the player actually sent → final original badge (collision-searched twice, incl. franchises and security/GRC/software companies); edition scorecard from all districts (scoring advice as sent); credits; "Next edition: coming later" (the vCISO edition) in the menu and ending; NG+ hooks if cheap.

## Facts, quality, process
As slice 4: zero-tolerance facts (URLs and dates in CREDITS.md), name searches logged, RFC 2606/5737/3849 only, recalled facts grepped exactly, timeline first, tells pass on the first build and the scanner reads every scored list, the systemic tolerance invariant and the NPC outcome-timing test cover every new checkpoint, extend tests/charter.js (clock triggers, packet grading, decider routing, Quiet Thread unresolved) and every other suite/bot, full sequence with phone bots last and alone, zero console errors and network requests, Town Hall and Crossroads tables byte-identical, copy builds (uptime.html = Town Hall, cmp it), commit after each stage, do NOT push, do not schedule tasks. Working files in docs/design/.
