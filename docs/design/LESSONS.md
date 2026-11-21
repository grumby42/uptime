# Review lessons (every slice must pass all of these)
Recovered 2026-11-21 after a container reset lost the scratchpad (individual review_*.md and *-changes.md files are gone; the repo history and commit messages hold the fixes).

## Hard rules
- Defender-side only: outcomes, log lines, records, decisions. No intrusion mechanism research; only ATT&CK IDs already cited in the repo (T1021.001, T1018, T1083, T1049, T1087 for the Quiet Thread).
- No copied material; seeds are grand-scale concepts only. Real facts only from primary sources, logged with URL and fetch date in CREDITS.md; omit what can't be verified; never paraphrase as a quote.
- RFC 2606/5737/3849 names and addresses only. Every invented name web-searched at least twice for collisions with real organisations (esp. security/GRC/software), products and franchises; searches logged in CREDITS.md. (Renames so far: Plumb→Ballast Badge, Oriel Fanshawe→Marit Quellan, Glasswick→Pewterlane AV, Cobbleton→Thimbleford Payroll, Bowline→Sheet Bend Badge.)
- Game numbers labelled (game); drill numbers never presented as operations; fixed numbers never shown as earned.

## Recurring failure classes
1. Promises beyond the evidence; "likely" stated as fact; claims about another party's root cause.
2. Weekday/clock drift; characters (NPC lines) or screens knowing outcomes before their timeline time; report times before evidence times.
3. Rules and records disagree (e.g. a tier rule vs the data-flow record).
4. Naming a person the evidence doesn't identify.
5. Containment delayed when blocking doesn't destroy evidence.
6. Returning a system/credential to service before the evidence covers the latest activity, and before the Compact checks its own evidence first.
7. Restoring before the copy is proven clean.
8. One decider per decision, whoever is on duty. Each member's counsel/leadership decides for that member.
9. Who chose: a CISO's choice is recorded as the CISO's recommendation; the owner decides on it and signs. When a body (the Board) takes risk above its own appetite, its minute records the decision and its acceptance; the owner signs for running the interim measures.
10. Tolerances bind, not just appetite levels — enforced by the systemic invariant in tests/charter.js at every district end and Board minute, on recommended, override and poor-advice paths.
11. Exception approval is two-tier: owner decides low risk; escalated (CISO recommends against, partial control, tolerance breaks, safety-of-life or personal records, second renewal) → the Board's chair (or the member's own leadership) within five working days.
12. Scorecards score the player's advice as sent, not a scripted end state.
13. Compare like with like (e.g. time-to-someone-acting vs time-to-someone-acting).
14. Answer tells: length, hedges, Yes/No/"No:" openers, "you / as the CISO" wording, lone features, odd-one-out; the scanner must actually read every scored list (`good` and `ok`).
15. Recalled facts from earlier editions grepped and quoted exactly.

## Process
Spec → build agent (timeline first, facts, tests, commit locally) → independent review panel → fix agent (changes log) → verify, push, send. Full test order: suites (… charter, layout, modalfit, highlight, doors, sprites, settings, tells), lentell/tells2, desktop bots, GAMER=1, phone bots last and alone (no cap under 45 min). uptime.html = editions/town-hall/index.html (cmp it).
Working files (timeline, reviews, change logs) now live in docs/design/ so a container reset can't lose them.
