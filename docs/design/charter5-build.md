# Charter slice 5 build log (the finale: a material incident and the disclosure clock)
Build agent, 2026-11-21 (UTC). Spec: docs/design/SPEC_ed3_slice5.md. Timeline first: charter-timeline.md, slice 5 section (commit 4b71ff9), before any dialogue, option or code.

## What was built
- editions/charter/disclosure.js (the primitive): the disclosure clock (each rule names its trigger; the clock starts at the recorded time of that trigger, in hours or working days; a rule whose trigger has not happened has no clock); facts packets (rows with one supported wording and weak ones, graded on the slice 4 scale: only required rows earn, so no optional row cancels a penalty; unknowns are required rows; every wording cites as many records as the supported one; the editor shows none); each packet's sent time against its rule's due time; the decision log; the finale's tolerance rule (S-7) in the invariant; the register's residual today and the target, side by side.
- editions/charter/finale-data.js and finale-story.js: Days 92 to 95. Wellhollow Backup (tier 1, reused) tells the Compact of an incident on its service; told only through the Compact's records. The game's notification rules N-1 to N-4; three drills with `needs`; containment (Edda decides; pausing destroys nothing); three facts packets (to Noor and the chair; to Noor at her checkpoint; for the chair's statement, no personal details); the members' call (N-2); the decision log (six decisions, one decider each, four options a list); Marit's directive (hold the packet); Noor's determination (the trigger of N-3 for the town); the clock and the labelled 8-K comparison card; the chair's statement on Noor's and Ada's advice; Noor's Disclosure terminals (Sullivan, SolarWinds, the 8-K timing); the Board's three questions keyed to the packets as sent; the minute; the Heaving Line Badge; the edition's end (the scorecard from every district, the clock, the register today and on the plan, credits, "Next edition: coming later (the vCISO edition)").
- The Quiet Thread advances, not resolved: one open item in packet 1 (CP-OPS-02's sign-in log shows no sign-in from FD-STAFF-11's address; who and why not known; no link drawn), and Noor decides it is not in scope for any notice on these facts.
- Wiring: story.js (objective chain finObjective, NPC lines, desk, metrics, scorecard, badge flag), data.js (Noor in the offices, Ada Pemberton from Town Hall in the Board room, Field Manual practices and facts, game notes), risk.js (the invariant and the acceptance's decision of record), edition.json.
- Series menu: Charter now numbered 3 (edition number), not 4 (it showed its slice count since slice 4: tools/build.py now prefers an "edition" field); "Next edition: coming later (the vCISO edition)".

## Decisions
- S-7 (BACKLOG): the Board is the decider of record for an owner's acceptance that breaks one of its tolerances (LESSONS 9), and until its next minute the chair decides within five working days of the signing (LESSONS 11). The Day 95 minute adopts the rule and decides cp-xfer's acceptance (Marit, Day 74, the privacy tolerance: carried to the Day 155 review). Enforced in the invariant from that minute; its failure is re-created in tests/charter.js. For Ted to confirm.
- CAREER_LADDER.md: the NICE version used is 2.0.0 as NICCS shows it (v2.2.0 is described only as NIST's later release); Sullivan's appeal and certiorari now stated as verified; the SolarWinds July 2024 opinion now read on the court's site. GV.OV-03 "evaluated" unchanged.
- NG+ for Charter not built (not cheap): the series record carries finale, editionComplete and heavingLine as the hook. T1221 not used.

## Facts and names
- Every quote spot-checked on its primary page with WebFetch on 2026-11-21 (CREDITS.md, "Facts used in Charter, the finale"): CSWP 29 (RS.CO-02, RS.CO-03, GV.RR-02, GV.OV-03), the Implementation Examples (RS.CO-02 Ex3, RS.CO-03 Ex4, GV.RR-02 Ex2), NICCS (role page version 2.0.0; T1310, T1054, T0006, T1234, T1779, T1476, T1060), DOJ (5 Oct 2022, 5 May 2023), Ninth Circuit No. 23-927 (amended opinion), Supreme Court docket 25-1082, SEC LR-26423, S.D.N.Y. opinion of 18 July 2024, the SEC final rule (Federal Register, rule text) and fact sheet.
- Name: the Heaving Line Badge, searched four times (company/software/app/game; security/GRC/trademark; brewery/band/film/franchise; exact forms), two trademark hits opened and cleared. "Monkey's Fist" considered and dropped.
- Recalled facts grepped exactly (CREDITS.md lists them).

## Tests
- tests/charter.js: 160/160 (was 138); tests/tells.js: ch-finale district, the packets scanned, refs equal, length ranks, all passing; tests/layout.js 377/377 with the finale's pages; tests/bot.js plays Charter to the edition's end (ten checkpoints).
- Mutation check and the full sequence: see the end of this file.

## Mutation check (docs/design/ch5/mut)
18 rules broken on purpose (muts.json), each run against tests/charter.js in a copy of the repo (run.py, three workers). 17 caught on the first pass. The one that survived, "supported optional rows earn", was not pinned: the padding checks asserted only "below 100", and with that bug the padded packets still scored below 100. The check now asserts the exact scores (60 and 70), and the rerun (muts-rerun.json, rerun-0.json) catches it. 18 of 18 caught.

## Full sequence (build ARCD-20261121-2113Z; logs docs/design/ch5/logs/full, scripts ch5/runall.sh and ch5/phone.sh)
- Suites, all exit 0: frontdesk, mailroom, clerks, market, records, basement, server, water, council, quiet, crossroads, charter (160/160), layout (377/377), modalfit, highlight (and Charter), doors (and Crossroads, Charter), sprites, settings, tells (no FAIL).
- tools/lentell.js and tools/tells2.js: identical to the baseline (ch5/base) except the new ch-finale row: 43 lists, longest-is-correct 17 (chance 13.2), shortest-is-correct 16 (chance 11.7); mean rank 2.23 (chance 2.25). The packets' own rows pass the stricter rank check in tells.js.
- tells --report: lines 1-370 (Town Hall and Crossroads) byte-identical to the baseline (cmp).
- Desktop bots: Town Hall; Crossroads manager and DFIR to the ending and New Game+; Charter through the finale to the edition's end (ten checkpoints clean, save/reload mid-finale); GAMER=1. All exit 0, errors [], requests [].
- Phone bots last and alone (0 other bots before): Town Hall 1605 s, Crossroads manager 764 s, DFIR 751 s, Charter 564 s. All exit 0, errors [], requests [], no horizontal scroll.
- Copies: /home/claude/charter.html, /home/claude/crossroads.html, /home/claude/uptime.html, each cmp-identical to its editions/*/index.html (uptime.html = editions/town-hall/index.html).

## Fix pass (review_charter5.md)
See docs/design/charter5-fixes.md. Timeline first (dd2cc48). Final build ARCD-20261122-0206Z: charter 171/171; mutation check 17/17; full sequence passed, with the phone bots last and alone.
