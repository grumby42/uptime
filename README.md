# Uptime

A security-analyst RPG in small offline editions. You're the new hire on a small town's security team: investigate alerts, fix what's broken, and keep the district running. Each edition is one HTML file that works from `file://` or a static host, on a phone or a desktop, with no network requests. Saves stay in your browser.

Planned home: GitHub Pages at `grumby42/uptime` (open `index.html` for the series menu).

## Editions

| # | Edition | District | Status |
|---|---|---|---|
| 1 | Town Hall | Front Desk, the Mail Room, Clerks' Row, Market Square, Records Hall, the IT Basement, then the Server Room | playable (about 30 minutes each) |
| | | Water Plant | next |

## Layout

```
index.html                  series menu (generated)
engine/                     shared code
  shell.html, style.css     page skeleton and layout (phone portrait: map above pad; desktop/landscape: overlays)
  core-data.js              sprites, palettes, tile legend, tool classes, tools, abilities, NIST CSF function names
  engine.js                 RNG, sprite cache, integer scaling, input, dialogue/choice/modal UI (answer lists opt into a seeded shuffle, so position never gives the answer away), save codec
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
  records-data.js           Records Hall (district 5): art, map, people, techniques, threats, alerts, restore tests, BIA, restore-order rules, drills, dojo, cards, facts
  records-quiet.js          Quiet Thread clue found in Records Hall
  records-story.js          Records Hall objectives, fieldwork, directive, drills, Records Board, ransomware incident and restore-order mini-game, metrics, summary
  basement-data.js          IT Basement (district 6): art, map, people, techniques, threats, alerts, log sources, clocks, firewall rules, tuning week, drills, dojos, cards, facts
  basement-quiet.js         Quiet Thread clue found in the IT Basement, and the suspicion-file timeline
  basement-story.js         IT Basement objectives, fieldwork, rule tuning, directive, drills, dojos, Basement Board, intruder incident, suspicion file, metrics, summary
  server-data.js            Server Room (district 7): art, map, people, techniques, threats, alerts, the service-account registry, audit policy, tiering crossings, drills, assessment findings, cards, facts
  server-quiet.js           Quiet Thread clue found in the Server Room (svc-print's nested group)
  server-story.js           Server Room objectives, fieldwork (privileged accounts, PAWs, LAPS, Protected Users, audit, tiering), directive, drills, Assessment Findings, Server Board, domain-compromise incident, metrics, summary
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

    node tests/bot.js desktop      # plays New game -> Front Desk -> Mail Room -> Clerks' Row -> Market Square -> Records Hall -> IT Basement -> Server Room -> end-of-district with the keyboard
    node tests/bot.js phone        # same with taps on the on-screen pad (360x800); run it last and alone (about 15 minutes)
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
    node tests/records.js          # Records Hall: Lantern Badge door, timed restore test (a Success job fails to restore), BIA (directory and DNS
                                   #   critical) and RTO/RPO with the owner, 3-2-1 + offline copy + escrowed key, separate backup credentials,
                                   #   Quiet Thread backup-console clue (T1555), drills (guessing 40, focused 100, Tally + trap 95), save/reload,
                                   #   finance directive, alert mix and Vault Badge halving, Dojo, Records Board (Vault Badge, Cairn -> Bulwark),
                                   #   time to contain, restore-order rules (dependencies, reinfection), ransomware incident (pay decision, three
                                   #   stages, recovery from clean points), summary, phone layout
    node tests/basement.js         # IT Basement: Vault Badge stairs, coverage (questions to sources), NTP and UTC, retention (M-21-31 rescinded,
                                   #   federal only), firewall review (owners, replace before remove, deny by default), Quiet Thread any-to-any
                                   #   clue, rule tuning (switching off refused, narrow exclusions, an over-broad exclusion hides a real attack
                                   #   that incident review surfaces), drills (guessing 40, focused 100, Tally), save/reload, directive (DNS
                                   #   stays), measured skew, alert mix, Dojos, Basement Board (Beacon Badge, Tier 3, Ledger -> Annalist, slower
                                   #   dwell with full logging), boss stages, suspicion file consistent with every clue, summary, phone layout
    node tests/server.js           # Server Room: Beacon Badge door (the Basement's west wall), Tier 3 scorecard, privileged accounts out of
                                   #   Tier 0, service-account registry (gMSA/vault/retire) and the Quiet Thread svc-print nesting clue (T1078.002,
                                   #   not in the Basement's 12-note timeline), PAWs/LAPS/Protected Users, directory audit (4769 encryption type,
                                   #   5136/4662 SACL), tiering mini-game, drills (guessing 40, focused 100, Tally), save/reload, least-privilege
                                   #   directive (svc-permits), Assessment Findings (over-privileged account, unconstrained delegation, open share),
                                   #   Server Board (Crown Badge, Tier 3 lead investigator, Keyling -> Tessera, lateral halved), boss (scope, evict all
                                   #   at once, krbtgt twice), Quiet Thread not resolved, summary, Water Plant handoff, phone layout

The bots also check: zero console errors, zero network requests, mid-game save/reload (including the series save), the export-code round trip, no horizontal scroll, and that no Quiet Thread technique ever appears as an ordinary alert. Set `UPTIME_FILE=file:///path/to/build.html` to test another build.

## Saves

- Edition save: `uptime.slice1.save` (Town Hall), plus an export/import code (`UPT1.…`).
- Series save: `uptime.series`, shared by every edition: `{v, quietThread: {stage, cluesFound[], evicted}, editions: {<id>: {done}}}`. Each edition save also carries a copy of `quietThread`, so an export code moves it to another device; Continue and Import merge it back.

## The Quiet Thread (spoilers)

A hidden, series-long intruder that lives off the land and never raises a normal alert. It has no wild encounter and is never in the alert mix. In Town Hall it relays its traffic through a hijacked old small-office router and signs in with a real service account. From Day 2 there are five faint clues, each visible only with the right capability: overnight sign-ins on the Ledger console at your desk (logging on), the closet router's connections (Lanternkeep, after the firewall fix), a short security log on FD-STAFF-14 (Ledger), a scheduled task on FD-STAFF-11 (Sentry's process tree), and a remark from Hal in facilities. Each adds an entry to the Field Manual's Unexplained chapter. Three or more and the end-of-slice summary says something is moving; hunt mode opens in a later edition. In the IT Basement, with clocks synchronised and logs kept, the thread becomes visible: one more clue in the old any-to-any firewall rule's hit log, then every Unexplained note on one timeline, handed to Rae as a suspicion file. It is not resolved; it continues.

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


## Records Hall (district 5)

Reached from the plaza after Market Square (Lantern Badge door, south of the plaza between the Identity Board and the Dojo). Backup and recovery. You stay Tier 2 and own the recovery decisions. Odile Brennan's problem: backups say Success every night and nobody has restored one; the backup console opens with any domain admin password; nobody has agreed recovery objectives with the people who own the services. Fieldwork: a timed restore test in an isolated lab (a job that said Success fails: the portal's second disk was never selected), a business impact analysis lite (the directory and DNS go on the critical list because everything depends on them) and RTO/RPO agreed with the permits owner (NIST SP 800-34 Rev. 1 definitions; RTO inside the owner's limit, backups twice a day for a 12-hour RPO), 3-2-1 taught as a rule of thumb plus one copy ransomware can't reach (retention-locked appliance, weekly encrypted tapes offsite, the key escrowed apart from the data), and separate backup admin accounts with MFA and alerts on deletes (NCSC principles). A finance directive (cut backup storage 40%, game) teaches retention against cost and RPO. Three drills: twelve thousand renamed files (the migration's own account and untouched ways back, on the file server and the writing host, decide; count and extension are traps), a backup that succeeded at 41 GB (job log detail and the console audit log: the shares moved to a volume the job never selected; the storage dashboard is the trap), and a ransom note claiming 200 GB (flow records and the endpoint history show 3.8 GB packed with a compression utility and uploaded to cloud storage; the note and a forum rumour are traps; budget 3). The Cryptography Dojo covers encoding vs hashing vs encryption (Base64 is not encryption), why ransomware uses symmetric and asymmetric ciphers, and why an encrypted backup needs its key escrowed. The Records Board gives the Vault Badge (T1490/T1485 threats halved, game) and Cairn, a recovery tool, which becomes Bulwark after the incident. The incident is retold in outline from the City of Atlanta (22 March 2018; SamSam): leadership, legal, the cyber insurer (game), the FBI and CISA told automatically, four tabletop cards, a pay decision framed by the FBI's position and OFAC's 2021 advisory, three stages (encryption pushed by group policy, the attack on the backups that the separate credentials and retention lock refuse, and a second attacker account that means the directory itself must be rebuilt), then the restore-order mini-game: one crew, 48 game hours, dependencies, and restore points where any copy holding the attacker's foothold reinfects; the directory comes back from before the earliest compromise (checked in the lab, krbtgt reset twice) and misses its RPO by design. New Tier 2 metrics: restore test success rate, measured recovery time within RTO, RPO, critical systems with an offline copy, mean time to contain. One Quiet Thread clue sits in the backup console's old audit log: svc-print, from the Front Desk closet router, exporting the backup server's stored credentials at 03:14.


## The IT Basement (district 6)

Reached from the plaza after Records Hall (the stairs west of the records office, locked since slice 1, open with the Vault Badge). Logging, detection engineering and the network boundary. You start as Tier 2; clearing the Basement Board makes you Tier 3 senior analyst, responsible for detection engineering: you write the rules others triage. Magda Petrov's problem: logs come from a fraction of systems, clocks disagree by minutes, retention is 7 days, the firewall has years of unowned rules including an any-to-any, and the SIEM is noisy. Fieldwork: map investigation questions to the sources that answer them and onboard the VPN appliance, the edge firewall, DNS and server process creation (the ASD-led event logging guide's priorities); one clock for every log (internal NTP servers, UTC, ISO 8601; NIST SP 800-92, RFC 5905); retention from a risk assessment (OMB M-21-31 was rescinded by M-26-14 in May 2026, and both are federal-only); a firewall rule review (owner, reason, hits; replace a rule that still carries traffic before removing it; narrow through change control; deny by default both ways, per NIST SP 800-41 Rev. 1); and rule tuning, the mini-game: a week of alerts from one scan detection, narrow exclusions with a reason, owner and expiry, never switching it off; an over-broad exclusion (the IT subnet, a night window, a higher threshold) looks better on screen and silently hides a real attack that incident review surfaces later. A CIO directive (cut the SIEM licence 30%, game) teaches why DNS stays. Three drills: forty quiet minutes (FS-02's own log and the collector's health log, event 1102), seven minutes apart (each clock's offset and one shared event; ingest time is not event time), and long DNS names to one domain (Sysmon event 22's process and the domain's owner; count and randomness are traps). The Log Analysis and Scanning Dojos cover a web log line field by field, three clocks on one UTC timeline, guessing versus spraying, SYN versus connect scans, open/closed/filtered (Nmap reference guide) and written scope. The Basement Board gives the Beacon Badge (close one log-source gap; dwell grows slower where a district's logging is complete) and evolves Ledger into Annalist. The incident is game-original, its outline following what ATT&CK records for Volt Typhoon (G1017): an exploited VPN appliance, a service account, a cleared Security log whose forwarded copies survived, a firewall rule added for a way out, and scanning; the broad VPN rule waiting for Friday's change window was the way in. New metrics: log source coverage, largest clock skew, detection precision, firewall rules with an owner, and a modelled mean time to detect. One Quiet Thread clue sits in the any-to-any rule's hit log; afterwards Rae asks for the suspicion file.


## The Server Room (district 7)

Reached from the IT Basement (the west-wall door, opened by the Beacon Badge). Identity infrastructure: Active Directory. You stay Tier 3; clearing the Server Board makes you Tier 3 lead investigator, incident commander for the technical scope. Everything is written from the defender's side: records, alerts, ownership and remediation, never an attacker's method. Beatriz Solano's problem: everyday accounts are domain admins, service accounts have old passwords and no owners, admins read email on the machines they administer from, and nothing audits the directory. Fieldwork: separate admin accounts and privileged access workstations (PAWs) with admin tiering; a service-account registry with an owner for each account, moving to group managed service accounts (gMSA) where the app supports it and long vault passwords otherwise; Windows LAPS for local passwords and the DSRM account; Protected Users for the human admin accounts after a test (never service or computer accounts); the directory and Kerberos audit policy (4768, 4769 with the encryption type, 4624 logon types, 4728/4732/4756 group changes, 5136 and 4662 with a SACL, 4697); and the tiering mini-game (five crossings where control runs downward: an admin on an everyday laptop, the help desk over Server Admins, a backup account spanning tiers, the sync server, the DC monitoring collector). A least-privilege directive (Hugo Pereira insists svc-permits stays a domain admin "because it broke last time") teaches a tested smaller right set, a rollback and a risk acceptance the business owns. Three drills, each led end to end: a Kerberoasting burst versus the monitoring server (the 4769 encryption type and the requesting account decide; count and time of night are traps), a user added to a privileged group and removed ten minutes later (the change event's Subject and what the account did in the window; the clean current membership is a trap), and a replication request from a non-domain-controller (the requesting account and whether it is documented for replication, like an Entra Connect connector; the 2.1 GB volume is a trap). The Assessment Findings area (its Enumeration & Exploitation framing is inspired by the National Cyber League, credited under Inspiration only) is three findings from an authorised assessment — an over-privileged service account, a computer trusted for unconstrained delegation, an admin share open to everyone — where you choose the remediation and the owner; concepts and defence only, no offensive method. The Server Board gives the Crown Badge (privileged-group changes need a second approver map-wide; lateral-movement encounters halved) and evolves Keyling into Tessera. The incident is game-original: a domain compromise whose outline follows documented identity-attack behaviour (a DCSync-style replication by an account quietly given replication rights, pass-the-hash to the file and database servers, and the risk of forged tickets) and the published eviction guidance (CISA AR21-134A, AA20-245A and the 2024 ASD-led AD-compromise guide): scope the whole blast radius, evict all at once from clean PAWs, reset every privileged and service account and the krbtgt twice, rebuild the compromised hosts, and watch for the return. New Tier 3 metrics: privileged (Tier 0) accounts, service accounts with an owner, tier-crossing sign-ins a day, a modelled mean time to scope, and investigations led. One Quiet Thread clue is found building the registry: svc-print sits in a group nested in a group that grants it local administrator everywhere, added in 2019 by an account deleted in 2021. It is added to Rae's suspicion file and is not resolved; it continues.
