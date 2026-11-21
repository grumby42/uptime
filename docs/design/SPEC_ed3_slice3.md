# Charter slice 3: District 3, Policy lifecycle (exceptions with owner, expiry, review)
Spec written 2026-11-14 (UTC). Read SPEC_ed3.md, SPEC_ed3_slice1–2.md, review_charter1–2.md and charter1–2-changes.md (do not repeat any failure), every earlier review lesson class, BACKLOG.md, charter-timeline.md (extend it FIRST), CAREER_LADDER.md §3/§6/§7a, then the repo after the slice 2 fixes.

Reviewers: a sitting CISO, a CIO, an internal-audit lead (third line), a public-authority board member, and a principal DFIR consultant.

## Primitive: the exception register (build it now)
Each exception: the policy clause it departs from, the system/accounts in scope (exact), the business reason, the compensating controls, the owner who accepts it (the business owner, not the CISO), the approver per the policy's own rule, the start date, the expiry date, the review date, and status (open / expired / renewed / closed). Expired exceptions are not silently open: they either renew through the same route with fresh evidence, or close. Tolerances from slice 1 still bind.

## Content
- The fd-admin lesson at programme scale: Town Hall's front-desk admin exception (recall it exactly — grep editions/townhall or the Town Hall data for its wording, dates and outcome; if Town Hall does not state a fact, do not invent it) becomes the seed for a Compact-wide exception register. Also reuse slice 1's MFA-Exempt / fin-ap exceptions and slice 2's dropped must-have clauses as entries — they are exceptions too.
- Policy lifecycle: draft → consult (members' owners, counsel for legal wording, the director of shared services for operability) → approve (the Board approves the top-level policy; the CISO issues standards under it — confirm against how slice 1 set the remit) → publish → measure → review on a date. One decider per step.
- Drills (3, `needs`, several sources each): (1) "Is this exception still valid?" — decisive: its expiry date and the review record, not that nobody complained; (2) "Does the compensating control actually cover the gap?" — decisive: the control's scope and the sign-in/log records for the excepted accounts (defender-side log lines only); (3) "Is the policy being followed?" — decisive: the measurement (sample of records) against the policy's own wording, not the attestation e-mail.
- Directive (game): a member's leader asks for a permanent exception "because it's always been this way"; teach owner + expiry + compensating control, or refuse via the policy's route; the CISO does not grant it alone.
- Board: Policy round (3 rounds) → original badge (collision-searched, incl. franchises).
- Dojo: Policy — 3 original puzzles (expiry arithmetic, who approves, does the control cover the gap).
- Scorecard (CAREER_LADDER §3 where it applies, else labelled game metrics), scoring the player's advice: exceptions with owner+expiry+review %, expired exceptions resolved %, policies with a review date %.
- CSF 2.0 GV.PO subcategories only if fetched word for word from the NIST Implementation Examples PDF already used; omit otherwise.
- Summary + "Next: The Board report".

## Facts, quality, process
Same as slice 2: defender-side only, zero-tolerance facts with URLs and dates in CREDITS.md, name searches logged, RFC 2606/5737/3849 only, recalled facts grepped exactly, timeline first, tells pass on the first build, extend tests/charter.js (exception register, expiry handling, approver routing) and the other suites/bots, full sequence with phone bots last and alone, zero console errors and network requests, Town Hall and Crossroads tables byte-identical, copy builds to /home/claude, commit locally with the session trailer, do NOT push, do not schedule tasks.
