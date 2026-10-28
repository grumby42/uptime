# Uptime

A security-analyst RPG in small offline editions. You're the new hire on a small town's security team: investigate alerts, fix what's broken, and keep the district running. Each edition is one HTML file that works from `file://` or a static host, on a phone or a desktop, with no network requests. Saves stay in your browser.

Planned home: GitHub Pages at `grumby42/uptime` (open `index.html` for the series menu).

## Editions

| # | Edition | District | Status |
|---|---|---|---|
| 1 | Town Hall | Front Desk, then the Mail Room | playable (about 30 minutes each) |
| | | Clerks' Row | next |

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

    node tests/bot.js desktop      # plays New game -> Front Desk -> Mail Room -> end-of-district with the keyboard
    node tests/bot.js phone        # same with taps on the on-screen pad (360x800)
    GAMER=1 node tests/bot.js desktop   # closes everything as a false positive; hidden missed attacks must surface
    node tests/layout.js           # pad and screen fit in phone portrait/landscape and desktop; series menu fits a phone
    node tests/frontdesk.js        # Front Desk: escalation evidence gate + precision, boss MFA-card fix, alert weighting,
                                   #   scoping question, ATT&CK licence in Credits
    node tests/quiet.js            # Quiet Thread: scripted clue path, saves across reload / New game / export-import, summary lines
    node tests/mailroom.js         # Mail Room: Key Badge door, inbox room, drills (broad vs focused, Tally), save/reload,
                                   #   Quiet Thread mailbox clues, alert mix (home x3, Seal Badge), time to quarantine, report rate only from
                                   #   staff report events, AiTM timeline consistency, no-query guessing scores low, phone drill layout

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

