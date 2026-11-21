# Charter (edition 3, the CISO) slice 1: scaffold, carry-over, prologue (appointment + risk appetite), district 1 (Budget)
Spec written 2026-11-14 (UTC). Read SPEC_ed3.md, CAREER_LADDER.md §3, §6, §7a; SPEC_slice1.md and SPEC_ed2.md / SPEC_ed2_slice1–6.md (all hard rules carry over); every review_crossroads*.md, review_maint1.md and their *-changes.md (do not repeat any failure); BACKLOG.md; crossroads-timeline.md (for facts recalled from Crossroads); then the whole repo /home/claude/uptime (pushed at 4063274, build ARCD-20261110-1218Z), especially editions/crossroads/ (as the template), engine/*.js, tools/build.py and every test.

Reviewers: a sitting CISO, a CIO, a public-sector CFO/budget director, a board member of a public authority, and a principal DFIR consultant (to check that technical claims under the budget are true).

## Engine and scaffold
- editions/charter/ with edition.json; build.py builds it; series menu lists Town Hall, Crossroads, Charter, then "Next edition: coming later". Crossroads' ending keeps its own "Next edition: coming later" text unless the menu flow makes "Charter" available — then say "Next: Charter".
- Carry-over: read (never write) the Town Hall save, the Crossroads save and the Crossroads NG+ save. Carry: name, track(s) played (manager/dfir/both), badges as history, Quiet Thread clues found. Fresh defaults if none. Own save key; Town Hall and Crossroads saves never mutated (test it byte-for-byte).
- Primitives (designed now, used here): budget allocation (fixed sum across register risks, residual risk shown per risk; the Compact Board can override and must sign a risk acceptance); risk-appetite statement builder. Board-report, contract-clause and exception-register primitives come in later slices — leave hooks only.
- Tests: tests/charter.js (carry-over with/without each earlier save, never mutating them, save/reload, no network); extend tells (a cr-style Charter population with enforced bands incl. stems, punctuation, names, lone features — write so it passes on the first build), layout, modalfit, doors, highlight, sprites, settings, bots (play the prologue and Budget). Town Hall and Crossroads tables byte-identical.

## Prologue (game): the appointment
After the Compact finale, the Compact Board appoints the player its first CISO. Short: who you report to (the Board, via its chair; the director of shared services owns IT operations — the CIO-like counterpart, a recurring character), what you own (the risk programme, policy, reporting to the Board), what you don't (each member's own leadership decides for that member; counsel decides legal questions). Build the risk-appetite statement (GV.RM-02, only if its text is verified from NIST — else describe it in game words): per category (service availability, data privacy, safety-of-life services, financial), choose appetite and tolerances; the Board approves. Every later decision is measured against it.

## District 1: Budget (risk allocation)
- Fixed sum (game numbers) across the register's top risks (carry real lessons from the earlier districts: vendor remote access, shared service accounts, backups proven clean, phishing/BEC, downtime procedures). Each funding choice shows residual risk vs appetite; the cost/benefit is explicit (T1059 if re-verified). Unfunded risks above appetite need a signed risk acceptance by the risk's business owner — not by the CISO.
- The director of shared services wants the money for a platform upgrade (a fair case: availability). Teach presenting both in business terms and letting the Board decide; the CISO advises, doesn't decide.
- Drills (3, `needs` on every verdict): evidence is records — the register, the incident log from Crossroads (recalled exactly), quotes, contracts. E.g. "Is the claim 'MFA everywhere' in the funding request true?" (decisive: the sign-in policy's exceptions list and the sign-in records); "Did last year's spend reduce the risk it was meant to?" (decisive: the metric before/after and what else changed); "Which of two quotes covers the requirement?" (decisive: the requirement and each quote's scope — not price).
- Board: Budget round with the Compact Board (3 rounds) → an original badge (game).
- Dojo: Risk & Budget — 3 original puzzles (residual risk, cost/benefit, risk acceptance owner).
- Directive (game): a member's leader asks the CISO to "just sign off" its risk acceptance; teach that the owner signs.
- Scorecard (CAREER_LADDER §3): risks within appetite %, register risks with owner and review date %, budget against top-five risks %.
- Summary + "Next: Suppliers".

## Facts
Zero tolerance: re-verify OG-WRL-007 and any task text on NICCS; CSF 2.0 Govern text only if fetched from NIST (try the CSF 2.0 reference tool / CPRT pages); omit otherwise. No pay data; no real budgets. No real organisation named. Defender perspective. RFC 2606/5737/3849 only. Extend a Charter timeline file (charter-timeline.md in the scratchpad) FIRST with weekdays and clock times, and check every line against it and against what's knowable at that moment.

## Quality
All suites in order (frontdesk … quiet, crossroads, charter, layout, modalfit, highlight, doors, sprites, settings, tells), lentell/tells2 (add Charter), desktop bots (Town Hall, both Crossroads tracks to the ending + NG+, Charter prologue + Budget), GAMER=1, phone bots last and alone (no cap under 45 min). Zero console errors and network requests. Copy builds to /home/claude/charter.html, /home/claude/crossroads.html, /home/claude/uptime.html (Town Hall). Report as before. Do not schedule tasks. Commit locally with the session trailer; do NOT push.

