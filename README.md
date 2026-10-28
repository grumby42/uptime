# Uptime

A security-analyst RPG in small offline editions. You're the new hire on a small town's security team: investigate alerts, fix what's broken, and keep the district running. Each edition is one HTML file that works from `file://` or a static host, on a phone or a desktop, with no network requests. Saves stay in your browser.

Planned home: GitHub Pages at `grumby42/uptime` (open `index.html` for the series menu).

## Editions

| # | Edition | District | Status |
|---|---|---|---|
| 1 | Town Hall | Front Desk, the Mail Room, Clerks' Row, then Market Square | playable (about 30 minutes each) |
| | | Records Hall | next |

## Layout

```
index.html                  series menu (generated)
engine/                     shared code
  shell.html, style.css     page skeleton and layout (phone portrait: map above pad; desktop/landscape: overlays)
  core-data.js              sprites, palettes, tile legend, tool classes, tools, abilities, NIST CSF function names
  engine.js                 RNG, sprite cache, integer scaling, input, dialogue/choice/modal UI, save codec
  drill.js                  investigation drills: one artefact, a query budget, verdict, reasoning, alternatives, AI helper
  series.js                 series save ('uptime.series') and the Quiet Thread core
  game.js                   overworld, battles, alerts, scorecard, Field Manual, menus, save/load, title, debug hooks
editions/town-hall/
  edition.json              build entry: name, blurb, which files to include, in order
  data.js                   maps, people, ATT&CK techniques met here, threats, alerts, briefings, dojo, cards, facts
  quiet.js                  Quiet Thread clues for this edition
  story.js                  EDITION settings, state, objectives, interactions, story scripts, summary
  mailroom-data.js          Mail Room (district 2): art, map, people, techniques, threats, alerts, drills, mini-games, facts
  mailroom-quiet.js         Quiet Thread clues found in the Mail Room
  mailroom-story.js         Mail Room objectives, scripts, metrics, Mail Board, payment-fraud incident, summary
  clerks-data.js            Clerks' Row (district 3): art, map, people, techniques, threats, alerts, advisories, drills, dojo, cards, facts
  clerks-quiet.js           Quiet Thread clues found in Clerks' Row
  clerks-story.js           Clerks' Row objectives, fieldwork, patch triage, drills, Endpoint Board, worm incident, metrics, summary
  market-data.js            Market Square (district 4): art, map, people, techniques, threats, alerts, inventory, WAF rules, scripts, drills, dojo, cards, facts
  market-quiet.js           Quiet Thread clue found in Market Square
  market-story.js           Market Square objectives, fieldwork, WAF review, directive, drills, Web Board, skimming incident, metrics, summary
  index.html                the built game (generated)
tools/build.py              builds every edition and the menu
tests/                      Playwright checks
```

An edition supplies `EDITION`, `newState`, `objective`, `interact`, `triggers`, `editionTile`, `introScript`, `summary`, `surfaceMissed`, `evolveCheck` and its data tables; the engine calls them.

## Build

    python3 tools/build.py                                   # all editions + index.html
    python3 tools/build.py town-hall --copy town-hall=/tmp/uptime.html

Every build is stamped `ARCD-YYYYMMDD-HHMMZ` with a UTC timestamp from the clock at build time (shown on the title screen, the menu and the footer). The build validates sprites (16x16, indices 0 to 4), maps, threats and Quiet Thread clues, and refuses to write a file that contains a URL or a network API.

## Tests

Need Node and Playwright (Chromium).

    node tests/bot.js desktop      # plays New game -> Front Desk -> Mail Room -> Clerks' Row -> Market Square -> end-of-district with the keyboard
    node tests/bot.js phone        # same with taps on the on-screen pad (360x800)
    GAMER=1 node tests/bot.js desktop   # closes everything as a false positive; hidden missed attacks must surface
    node tests/layout.js           # pad and screen fit in phone portrait/landscape and desktop; series menu fits a phone
    node tests/frontdesk.js        # Front Desk: escalation evidence gate + precision, boss MFA-card fix, alert weighting,
                                   #   scoping question, ATT&CK licence in Credits
    node tests/quiet.js            # Quiet Thread: scripted clue path, saves across reload / New game / export-import, summary lines
    node tests/mailroom.js         # Mail Room: Key Badge door, inbox room, drills (broad vs focused, Tally), save/reload,
                                   #   Quiet Thread mailbox clues, alert mix (home x3, Seal Badge), time to quarantine, report rate only from
                                   #   staff report events, AiTM timeline consistency, no-query guessing scores low, phone drill layout
    node tests/clerks.js           # Clerks' Row: Seal Badge door, local admin, patch triage (KEV vs CVSS, effective compliance),
                                   #   drills (guessing scores low), save/reload, admin exception, Quiet Thread laptop clues, alert mix,
                                   #   Endpoint Board (Shield Badge, Tier 2, Watchling/Sentry/Overwatch), isolation cost, MTTC,
                                   #   drill 3 sign-in check (budget 3), automatic leadership notice, worm containment from fleet-search
                                   #   evidence (no red laptops, one decoy), summary, phone triage and drill layout
    node tests/market.js           # Market Square: Shield Badge door, inventory (no single source finds everything), WAF detection first,
                                   #   CMS patch, test site retired in order (subdomain takeover), payment scope, scripts (6.4.3), CSP/SRI, tamper
                                   #   check (11.6.1), drills (guessing 40, trap + Tally 88, focused 100), save/reload, WAF review false-positive
                                   #   cost (residents can't pay), directive, Quiet Thread DMZ clue, alert mix, Dojo, Web Board (Lantern Badge,
                                   #   Shroud -> Mirrorcoat), time to contain, exposure-window logic, skimming incident, summary, phone layout

The bots also check: zero console errors, zero network requests, mid-game save/reload (including the series save), the export-code round trip, no horizontal scroll, and that no Quiet Thread technique ever appears as an ordinary alert. Set `UPTIME_FILE=file:///path/to/build.html` to test another build.

## Saves

- Edition save: `uptime.slice1.save` (Town Hall), plus an export/import code (`UPT1.…`).
- Series save: `uptime.series`, shared by every edition: `{v, quietThread: {stage, cluesFound[], evicted}, editions: {<id>: {done}}}`. Each edition save also carries a copy of `quietThread`, so an export code moves it to another device; Continue and Import merge it back.

## The Quiet Thread (spoilers)

A hidden, series-long intruder that lives off the land and never raises a normal alert. It has no wild encounter and is never in the alert mix. In Town Hall it relays its traffic through a hijacked old small-office router and signs in with a real service account. From Day 2 there are five faint clues, each visible only with the right capability: overnight sign-ins on the Ledger console at your desk (logging on), the closet router's connections (Lanternkeep, after the firewall fix), a short security log on FD-STAFF-14 (Ledger), a scheduled task on FD-STAFF-11 (Sentry's process tree), and a remark from Hal in facilities. Each adds an entry to the Field Manual's Unexplained chapter. Three or more and the end-of-slice summary says something is moving; hunt mode opens in a later edition.

Real-world basis: joint advisory AA24-038A (CISA, NSA, FBI and partners, February 2024) on Volt Typhoon. See CREDITS.md.

## Controls

Arrows or D-pad move. Z = A (talk, confirm). X = B (back). Enter = Start (menu). Shift = Select (alert queue).

## Licence

Code: MIT (see LICENSE). Framework data keeps its own terms (see CREDITS.md).

## The Mail Room (district 2)

Reached from the plaza after the Identity Board (Key Badge door east of the records office). Bea Lindqvist's problem: phishing gets through and nobody reports it. Inbox room (trust or report, escape-room framing), text stream (smishing), phone booth (vishing: call back on a known number), three investigation drills (an adversary-in-the-middle ShareBox phish that relays the password and the push approval, a BEC invoice from a hijacked supplier mailbox, MFA push fatigue), Tally the AI assistant (specific questions help; "everything" runs past its context limit, gets silently truncated and is wrong once). Drill credit needs evidence: a right verdict with no decisive query scores as a guess. The report rate counts staff report events only, and a report of safe mail is never a mistake, the OSINT Dojo (defensive), the Mail Board (Seal Badge + Sieve, which evolves to Sifter), and a payment-fraud incident (tabletop + three stages). New Tier 1 metrics: phishing report rate, time to quarantine, BEC payments stopped. Drillbit evolves into Reportbird when one-click reporting arrives. Two more Quiet Thread clues sit on the old shared-mailbox console.


## Clerks' Row (district 3)

Reached from the plaza after the Mail Room (Seal Badge door east of the Mail Room). Ruth Avila's problem: months behind on patches, and every clerk is a local administrator. Fieldwork: remove local admin with a help-desk exception process (checked, time-limited, logged) and Windows LAPS for a rotated local admin password on every laptop, Patch Tuesday triage (a month of invented advisories into this week / next week / later; known-exploited items count double; a CVSS 9.8 on software nobody runs goes last; compliance counts patches in effect, so the offline conference laptop and the one with a postponed restart stay dark), attack surface reduction and application control in audit mode first, and PowerShell script block logging checked at event 4104. Three drills: did a flagged download execute (process creation and Prefetch, not the proxy or Amcache), a scheduled task registered at lunch (process tree and task definition; event 106 names the account, not the person; 4698 needs Audit Other Object Access Events), and real-time protection off with the engine still running (tamper or an admin change: script block log, change ticket, and the sign-in log to confirm the person behind the admin account; budget 3). The Forensics Dojo covers Prefetch, Amcache and Shimcache limits and timeline building. The Endpoint Board gives the Shield Badge (isolate any laptop from the map; over-isolation costs uptime, reputation and someone's work) and promotes you to Tier 2 incident responder: you lead containment. Watchling (for players without Sentry) evolves into Sentry at the Board; Sentry integrates with Ledger into Overwatch. The worm incident is retold in outline from WannaCry: leadership is notified automatically, a tabletop of four technical cards, patient zero, containment on the map (nothing is coloured: a fleet search shows which laptops scan other laptops on TCP 445, with one decoy that only talks to the file server), then shadow copies and the kill switch (which stops new infections, not encryption already running). New metrics: patch compliance (KEV and other), mean time to contain, isolations needed vs clean hosts isolated, staff with local admin. Two more Quiet Thread clues sit on the spare laptop CR-LT-12 (a netsh port proxy and the discovery commands before it).


## Market Square (district 4)

Reached from the plaza after Clerks' Row (Shield Badge door by the firewall, north-east). The only district that faces the internet: everything arrives through the WAF gate. You are Tier 2 and lead containment. Paz Delgado's problem: nobody knows what is exposed, the WAF was never tuned, the CMS has flaws, and the payment page loads third-party scripts. Fieldwork: an internet-facing asset inventory (pick sources; no single one finds all seven assets, including a forgotten test site at an outside host and the WAF's own admin page), the WAF in detection mode first, the CMS patched the same day and then checked for signs of earlier use (a WAF rule is a filter, not a fix), the test site retired in order (logs first, DNS record before the hosting, or someone can take over the name), and the payment page (move card entry to the processor's hosted page, cut the scripts to the two it needs with a written reason each per PCI DSS 6.4.3, CSP in report-only first, SRI only on files that never change, and a tamper check per 11.6.1). The WAF rule review is the mini-game: nine rules with what each matched in detection mode; block, log only or switch off; blocking apostrophes or non-GET payments locks residents out of paying bills, and the false-positive rate stays on the scorecard. A councillor's directive (payments back within an hour, game) teaches recovery time against a clean recovery. Three drills: did the injection work (status codes, response sizes and the database log, not the WAF count or GeoIP), a new script on the payment page (change records and the vendor's notice checked on its portal: a legitimate change), and an admin nobody made (audit log, access log and the uploads folder: a web shell from before the patch replayed Rafe's open session on the server itself, where the WAF can't see; budget 3). The Web Application Security Dojo covers parameterised queries, IDOR and why validation alone isn't enough (OWASP Top 10:2025). The Web Board gives the Lantern Badge and Shroud (a WAF tool), which becomes Mirrorcoat after the incident. The skimming incident is retold in outline from British Airways (ICO, 2018 breach, 2020 penalty): processor and leadership told automatically, four tabletop cards, three stages, and an exposure window built from evidence (the tamper check's frequency and how fast card entry moves to the hosted page decide it; bringing our own page back early adds a second stretch unless an enforced CSP blocks the re-injected skimmer's sends, a game simplification: CSP narrows a skimmer's exits, it doesn't seal them; and everyone who typed a card in the window is affected, paid or not). New Tier 2 metrics: internet-facing assets inventoried, WAF false-positive rate, mean time to contain, exposure window. One Quiet Thread clue sits in the DMZ log: the Front Desk closet router signing in to the web server at 03:09, as svc-print.
