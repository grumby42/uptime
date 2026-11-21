# Charter slice 4: District 4, The Board report (claims graded against records)
Spec written 2026-11-14 (UTC). Read SPEC_ed3.md, SPEC_ed3_slice1–3.md, review_charter1–3.md and charter1–3-changes.md (no failure may recur), every earlier review lesson class, BACKLOG.md, charter-timeline.md (extend it FIRST), CAREER_LADDER.md §3/§6/§7a, then the repo after the slice 3 fixes.

Reviewers: a sitting CISO, a CIO, a public-authority board chair, an internal-audit lead, and a principal DFIR consultant.

## Primitive: board-report assembly (build it now; reuse report.js grading)
- The player assembles the quarterly report to the Compact Board from the scorecards of Budget, Suppliers and Policy (the player's own results flow in — the report reflects what the player actually did; nothing shown as earned that was fixed).
- Each candidate claim is a card tied to records. Grading: supported (the record says it), unsupported (no record, or a record that says less), overstated ("likely" as fact, a trend from one point, "fully"/"all" when a sample was taken, a drill or game number presented as operations), or misplaced (a decision attributed to the wrong decider). Report times never precede evidence times; nothing reported before its evidence exists.
- Structure the player builds: top risks vs appetite and tolerances (with every above-appetite item and who accepted it, as minuted), what changed since last quarter, decisions the Board must take (one decider each, with the CISO's recommendation), exceptions due/expired, supplier tier-1 gaps, and asks. Business terms, not tool names. A one-page summary plus an annex of records.
- Over-length penalty and an omission penalty: leaving out an above-appetite risk or an expired exception is worse than a dull report.

## Content
- Drills (3, `needs`): (1) "Can the report say 'MFA on every sign-in'?" — decisive: the exceptions register and the sign-in records (the Budget lesson, now at reporting level); (2) "Can the report say supplier risk fell?" — decisive: the tier-1 clause coverage before/after and what else changed; (3) "Who does the report say accepted R2/R3?" — decisive: the Board minute and the signed acceptances.
- Directive (game): Edda asks the CISO to leave the platform-upgrade side effects (R2/R3 above appetite) out of the summary "since the Board already knows"; teach that the report states it, briefly, with the minute reference.
- The Board meeting: questions from members (3 rounds) based on the report the player actually sent; questions target any weak claim the player left in → an original badge (collision-searched incl. franchises).
- Dojo: Reporting — 3 original puzzles (supported vs overstated, trend from one point, who decided).
- Scorecard: claims supported %, required items present %, decisions with a named decider and recommendation % (scoring the player's report as sent).
- CSF 2.0 GV.OV subcategories (and GV.RM if apt) only if fetched word for word from the NIST Implementation Examples PDF; NICE task text only if re-verified on NICCS. Omit otherwise.
- The Quiet Thread: do not resolve; at most one small, defender-side observation already consistent with the five recorded clues (T1021.001, T1018, T1083, T1049, T1087 — already cited), entering the report only as an open item with no conclusion.
- Summary + "Next: The finale".

## Facts, quality, process
Same as slice 3: defender-side only, zero-tolerance facts with URLs and dates in CREDITS.md, name searches logged, RFC 2606/5737/3849 only, recalled facts grepped exactly, timeline first, tells pass on the first build, extend tests/charter.js (claim grading classes, omission penalty, report reflecting player's earlier results, Board questions keyed to sent report) and the other suites/bots, full sequence with phone bots last and alone, zero console errors and network requests, Town Hall and Crossroads tables byte-identical, copy builds to /home/claude, commit locally with the session trailer, do NOT push, do not schedule tasks.
