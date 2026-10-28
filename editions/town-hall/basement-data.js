/* ============================================================
   UPTIME · editions/town-hall/basement-data.js
   Town Hall district 6, the IT Basement (logging, detection engineering, the
   network boundary): art, map, people, ATT&CK techniques met here, threats,
   alert templates, briefings, log sources, clocks, the firewall rule binder,
   the rule-tuning week, three investigation drills, the Log Analysis and
   Scanning Dojos, the Basement Board and the boss incident's cards, Field
   Manual text. It extends the earlier districts' tables; the only change to
   their data is the stairs on the plaza, which become a door (marked).
   People, hosts, domains (.example), addresses (RFC 5737 and private ranges),
   tickets, clock offsets, rule numbers, counts, costs and timings are invented
   (game). Real facts are cited in CREDITS.md, section "IT Basement".
   ATT&CK IDs verified on attack.mitre.org on 28 October 2026 (ATT&CK v20.0).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
Object.assign(S, {
  scrub: ["0000000000000000","0000011111100000","0001144444411000","0014444444444100","0144111441114410","0144131441314410","0144111441114410","0144444444444410","0014442222444100","0001444444441000","0000111111110000","0001222222221000","0012323232323100","0012222222222100","0001111111111000","0000000000000000"],
  hinge: ["0000000000000000","0111111111111110","0122222222222210","0123333113333210","0123333113333210","0122222222222210","0123311331133210","0123311331133210","0122222222222210","0123333443333210","0123333443333210","0122222222222210","0111111111111110","0001100000011000","0011000000001100","0000000000000000"],
  sweep: ["0000000000000000","0000000011100000","0000001122210000","0000012233321000","0000122344432100","0001223444443210","0001234411144321","0012344100014432","0012341000001443","0001233100013321","0000122333332210","0000011222221100","0000000111110000","0000000011000000","0000001111110000","0000000000000000"],
  burrow: ["0000000000000000","0000000000000000","0000111100000000","0001222210000000","0012414221000000","0012222222100000","0001222222210000","0000122222221000","0000012222222100","0000001222232210","0000000122322321","0000000012333321","0000000001222210","0000000000111100","0000000000000000","0000000000000000"],
  smuggle: ["0000000000000000","0011111111111100","0122222222222210","0123333333333210","0123111111113210","0123144444413210","0123141111413210","0123141331413210","0123141331413210","0123141111413210","0123144444413210","0123111111113210","0123333333333210","0122222222222210","0011111111111100","0000000000000000"],
  annalist: ["0000000000000400","0000000000004100","0111111111141110","0122222212412210","0124444214444210","0121111211111210","0124414214414210","0121111211111210","0124444214444210","0123333213333210","0122222212222210","0111111111111110","0001100000011000","0001100000011000","0011100000011100","0000000000000000"],
  clock: ["2222222222222222","2333333333333332","2333311111133332","2333144444413332","2331444144441332","2314444144444132","2314444144444132","2314444111444132","2314444444444132","2314444444444132","2331444444441332","2333144444413332","2333311111133332","2333333333333332","1111111111111111","3443443443443443"],
  trays: ["3333333333333333","3222222222222223","3242424242424243","3222222222222223","3333333333333333","3313131313131333","3131313131313133","3333333333333333","3222222222222223","3242424242424243","3222222222222223","3333333333333333","3313131313131333","3131313131313133","3333333333333333","3333333333333333"]
});
Object.assign(PAL, {
  scrub: ['#141414', '#5b4a42', '#e58a5c', '#f2e3c6'],
  hinge: ['#141414', '#4a1414', '#b8432f', '#ffd96a'],
  sweep: ['#141414', '#1f5a8a', '#7fa2d6', '#ff4d6d'],
  burrow: ['#141414', '#6b6253', '#a89a80', '#ff4d6d'],
  smuggle: ['#141414', '#3a4a6b', '#8b93a7', '#ff9f43'],
  annalist: ['#1b2233', '#2f6e3e', '#a6d96a', '#ffd96a'],
  trays: ['#1b2233', '#2b2f3a', '#4a5163', '#7fa2d6'],
  collector: ['#1b2233', '#3a4a6b', '#6e7a8a', '#e58a5c'],
  collectorOk: ['#1b2233', '#3a4a6b', '#6e7a8a', '#9ff0c8'],
  edgefw: ['#4a1414', '#8a4b2f', '#c98a54', '#f2e3c6'],
  edgefwOk: ['#1b2233', '#2f6e3e', '#5aa64b', '#f2e3c6'],
  binder: ['#2a2523', '#5b4a42', '#8c7b70', '#ffd96a'],
  ntpBad: ['#1b2233', '#3a4a6b', '#b8432f', '#f2e3c6'],
  ntpOk: ['#1b2233', '#3a4a6b', '#2f6e3e', '#f2e3c6'],
  siem: ['#1b2233', '#5b3a26', '#a8703f', '#9ff0c8'],
  logDojo: ['#1b2233', '#1f6f78', '#7cc6c4', '#ffd96a'],
  scanDojo: ['#1b2233', '#5a3a7a', '#9a7ac0', '#ffd96a'],
  bboard: ['#1b2233', '#1f5a8a', '#7fa2d6', '#ffd96a'],
  magda: ['#1a1a2e', '#3b2418', '#c98a54', '#2f6e3e'],
  devraj: ['#1a1a2e', '#141414', '#a8703f', '#b8432f'],
  lena: ['#1a1a2e', '#c0a040', '#f2c7a0', '#3a4a6b'],
  audra: ['#1a1a2e', '#8b93a7', '#e0b090', '#5a2a6e'],
  quinn: ['#1a1a2e', '#2b1d16', '#8a5a3c', '#7cc6c4'],
  soren: ['#1a1a2e', '#5b4a42', '#f0c8a0', '#9a7ac0'],
  hollis: ['#1a1a2e', '#d7dbe4', '#b07850', '#1f5a8a']
});
Object.assign(TILES, {
  '#': {spr: 'K', pal: 'collector', solid: true},                 // the log collector in the server racks
  '%': {spr: 'F', pal: 'edgefw', solid: true},                     // the town's edge firewall
  '&': {spr: 'counter', pal: 'binder', solid: true, under: ','},   // the firewall rule binder
  '@': {spr: 'clock', pal: 'ntpBad', solid: true},                 // the clock on the wall (NTP)
  '$': {spr: 'pc', pal: 'siem', solid: true, under: ','},          // SIEM consoles
  '*': {spr: 'pc', pal: 'logDojo', solid: true, under: ','},       // Log Analysis Dojo terminals
  '+': {spr: 'pc', pal: 'scanDojo', solid: true, under: ','},      // Scanning Dojo terminals
  '^': {spr: 'K', pal: 'bboard', solid: true},                     // Basement Board racks
  '~': {spr: 'trays', pal: 'trays', grass: true}                   // cable trays nobody logs: trip alerts
});

/* ---------- Tools: Ledger's next form (detection engineering) ---------- */
// Logging tools are strong against threats that tamper with logs. Network tools are strong against threats at the edge. (game)
CLASSES.logging.strongTags = (CLASSES.logging.strongTags || []).concat(['logs']);
CLASSES.network.strongTags = (CLASSES.network.strongTags || []).concat(['edge']);
Object.assign(TOOLS, {
  annalist: {name: 'Annalist', cls: 'logging', sub: 'SIEM + detection engineering', spr: 'annalist', blurb: 'Ledger, grown up. Keeps every record in one clock’s order, and writes the rules that read them.',
             abil: ['search', 'correlate', 'timeline', 'backtest']}
});
EVOLVED_FROM.annalist = 'ledger';
Object.assign(ABIL, {
  backtest: {name: 'Replay the rule', type: 'inv', cost: 2, ev: 26, fpBonus: true, desc: 'Replay a detection rule against last month’s stored logs: how often would it have fired, on what, and would it have caught the attacks you already know about?'}
});

/* ---------- Map: the IT Basement, the Basement Board, and the stairs on the plaza ---------- */
// North-west: the server racks with the log collector, among cable trays nobody logs. North: the SIEM room, with
// the clock on the wall. North-east: the firewall room and its rule binder. Middle: the corridor and the Board door.
// South: the Log Analysis Dojo (west), your desk, the Scanning Dojo (east), and the stairs up.
Object.assign(MAPS, {
  basement: {
    name: 'IT Basement',
    rows: [
      "wwwwwwwwwwwwwwwww@wwwwwwwwwwww",
      "wKK#KK,KKw,,,$,$,,,w%%,,,&&,,w",
      "w~~,~~,~~w,,,,,,,,,w,,,,,,,,,w",
      "w~~,~~,~~,,,,,,,,,,,,,,,,,,,,w",
      "w~~~~~~~~w,,,,,,,,,w,,,,,,,,,w",
      "wwwwwwwwwwwww,,,wwwwwwwwwwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwww,wwwwwwwwwwwwwwww,wwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,*,*,*,,,,,,,,,,,,,,,+,+,+,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w~~~,,,,,,,,,Y,,,,,,,,,,,,~~~w",
      "w~~~,,,,,,,,,,,,,,,,,,,,,,~~~w",
      "wwwwwwwwwwwwwwEwwwwwwwwwwwwwww"
    ],
    doors: {'14,15': {to: 'hub', x: 3, y: 10, dir: 'right'}, '29,7': {to: 'bboard', x: 9, y: 9, dir: 'up'}}
  },
  bboard: {
    name: 'Basement Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "w^^,,,,,,,,,,,,,,^^w",
      "w^^,,,,,,,,,,,,,,^^w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'basement', x: 28, y: 7, dir: 'left'}}
  }
});
// The one change to earlier data: the stairs on the plaza (locked since slice 1) become the door down. The Vault Badge opens it.
MAPS.hub.doors['2,10'] = {to: 'basement', x: 14, y: 14, dir: 'up',
  get locked() { return (typeof G !== 'undefined' && G && G.f.rhVault) ? undefined : 'IT Basement. A sign on the door: “Staff with a Vault Badge only.”'; }};

const BM_MAPS = ['basement', 'bboard'];
const BM_HOSTS = ['MGMT-01 · management server', 'LOG-01 · log collector', 'LOG-02 · Linux log relay', 'VPN-01 · VPN appliance', 'FW-EDGE · edge firewall', 'DNS-01 · resolver'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'magda', name: 'Magda Petrov', role: 'IT operations lead', map: 'basement', x: 14, y: 7, dir: 'down', pal: 'magda'},
  {id: 'devraj', name: 'Devraj Sood', role: 'network engineer', map: 'basement', x: 23, y: 2, dir: 'down', pal: 'devraj'},
  {id: 'lena', name: 'Lena Mortimer', role: 'detection engineer', map: 'basement', x: 11, y: 2, dir: 'down', pal: 'lena'},
  {id: 'audra', name: 'Audra Finch', role: 'chief information officer', map: 'basement', x: 18, y: 7, dir: 'left', pal: 'audra', cond: G => !!G.f.bmDrill1 && !G.f.bmDirective},
  {id: 'quinn', name: 'Quinn Adair', role: 'log analysis coach', map: 'basement', x: 9, y: 11, dir: 'left', pal: 'quinn'},
  {id: 'soren', name: 'Soren Vale', role: 'scanning coach', map: 'basement', x: 21, y: 11, dir: 'right', pal: 'soren'},
  {id: 'hollis', name: 'Hollis Grant', role: 'detection lead', map: 'bboard', x: 9, y: 2, dir: 'down', pal: 'hollis'},
  {id: 'raeb', name: 'Rae Okafor', role: 'SOC lead', map: 'basement', x: 16, y: 7, dir: 'down', pal: 'rae', cond: G => !!G.f.bmBoss}
);
const BM_NPC_IDS = ['magda', 'devraj', 'lena', 'audra', 'quinn', 'soren', 'hollis', 'raeb'];

/* ---------- ATT&CK techniques met in the IT Basement (verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20.0) ---------- */
// In v20, clearing logs sits under T1685 Disable or Modify Tools and firewall changes under T1686 Disable or Modify
// System Firewall, both in the Defense Impairment tactic (TA0112). T1685.005 is also a Quiet Thread technique: it is
// never in the alert mix; it appears here only in a drill and in the boss incident.
Object.assign(TECH, {
  'T1685.005': {name: 'Disable or Modify Tools: Clear Windows Event Logs', tactic: ['Defense Impairment'], desc: 'Clearing a Windows computer’s event logs to hide what happened. Clearing the Security log writes event 1102, and copies already forwarded to a collector survive. Before ATT&CK v19 this was T1070.001.'},
  'T1685.006': {name: 'Disable or Modify Tools: Clear Linux or Mac System Logs', tactic: ['Defense Impairment'], desc: 'Clearing or truncating the system logs on a Linux or macOS machine (most live under /var/log), for example the authentication log, to hide a sign-in.'},
  'T1686.002': {name: 'Disable or Modify System Firewall: Network Device Firewall', tactic: ['Defense Impairment'], desc: 'Changing a router’s or network firewall’s rules, or switching them off, so traffic that should be blocked gets through. Its old address, T1562.013, now redirects here.'},
  'T1046': {name: 'Network Service Discovery', tactic: ['Discovery'], desc: 'Listing the services running on other hosts and network devices, usually by scanning ports, to find something to use next.'},
  'T1071.004': {name: 'Application Layer Protocol: DNS', tactic: ['Command and Control'], desc: 'Hiding commands and stolen data inside DNS lookups and answers, so the traffic blends in with the name lookups every network makes.'},
  'T1572': {name: 'Protocol Tunneling', tactic: ['Command and Control'], desc: 'Wrapping one protocol inside another (for example remote desktop carried inside an SSH tunnel) to get past filtering or reach systems that are otherwise out of reach. Running a protocol on a port it doesn’t normally use, such as SSH on TCP 443, is a separate technique: Non-Standard Port (T1571).'},
  'T1110.001': {name: 'Brute Force: Password Guessing', tactic: ['Credential Access'], desc: 'Trying many passwords against one account. Spraying (T1110.003) is the reverse: one or two passwords against many accounts.'}
});

/* ---------- Threats (wild alerts) ---------- */
Object.assign(THREATS, {
  scrub: {name: 'Scrub', tech: 'T1685.006', spr: 'scrub', pal: 'scrub', tags: ['logs', 'host'], bucket: 'other', district: 'basement'},
  hinge: {name: 'Hinge', tech: 'T1686.002', spr: 'hinge', pal: 'hinge', tags: ['edge'], bucket: 'other', district: 'basement'},
  sweep: {name: 'Sweep', tech: 'T1046', spr: 'sweep', pal: 'sweep', tags: ['recon'], bucket: 'other', district: 'basement'},
  burrow: {name: 'Burrow', tech: 'T1071.004', spr: 'burrow', pal: 'burrow', tags: [], bucket: 'other', district: 'basement'},
  smuggle: {name: 'Smuggle', tech: 'T1572', spr: 'smuggle', pal: 'smuggle', tags: ['edge'], bucket: 'other', district: 'basement'}
});
// (game) base weights for the IT Basement threats; they only enter the mix once you reach the basement.
MAL_WEIGHTS.push({t: 'scrub', w: 3}, {t: 'hinge', w: 2}, {t: 'sweep', w: 3}, {t: 'burrow', w: 3}, {t: 'smuggle', w: 2});
const BM_HOME = ['scrub', 'hinge', 'sweep', 'burrow', 'smuggle'];

Object.assign(ALERTS, {
  scrub: {
    rule: 'Server log tampering suspected',
    mal: {clues: ['On LOG-02, the Linux relay for the building-system logs, /var/log/auth.log shrank to nothing at 03:22.', 'The last lines the collector received before that show an SSH sign-in as root from a staff workstation that never manages servers.', 'The forwarded copies on the collector are now the only record of that session.'],
          truth: 'Clearing a Linux server’s logs to hide a sign-in. The copies already on the collector are the evidence now.',
          resp: [{label: 'Preserve the collector’s copies and LOG-02’s disk: they’re the evidence. Disable the account and its key, isolate its workstation, hunt for the same sign-in', good: true},
                 {label: 'Restart logging on LOG-02 and confirm auth.log is being written, then close: the collector holds every line of the session, so nothing is lost', good: false, why: 'The account and the workstation are still the intruder’s, and you haven’t asked what the session did.'},
                 {label: 'Reimage LOG-02 tonight from a clean build, so nothing the intruder left survives', good: false, disrupt: 1, why: 'Preserve first: the disk is evidence, and the intruder came from somewhere else.'}]},
    benign: {clues: ['The log collector restarted at 02:00 for its upgrade; every source shows a gap until 02:06.', 'Each server’s own log still holds those six minutes.', 'Change ticket CHG-6011 (game) covers the upgrade.'],
             truth: 'Benign: the collector’s planned restart. Pull the six minutes from the servers’ own logs, and alert when a source goes quiet.'},
    fp: {clues: ['FS-01’s log timestamps jumped back three minutes at 04:10.', 'That was NTP correcting FS-01’s drifting clock: the drift alarm fired at 04:09.', 'No lines are missing; the rule reads “time went backwards” as “lines removed”.'],
         truth: 'False positive: an NTP clock correction, not tampering. Fix the drift; tune the rule to check line counts, not the clock.'}
  },
  hinge: {
    rule: 'Edge firewall rule changed',
    mal: {clues: ['At 23:10 a rule letting any outside address reach FS-03 on remote desktop (TCP 3389) was added to the edge firewall.', 'The change was made with a network engineer’s admin account while he was on leave, from a Clerks’ Row laptop that never manages the firewall.', 'Within ten minutes, remote-desktop sign-in attempts from abroad start arriving at FS-03.'],
          truth: 'Modifying a network device firewall: a stolen admin account opened a way in.',
          resp: [{label: 'Remove the rule; disable the engineer’s account and revoke its sessions; isolate the laptop; check FS-03’s sign-ins and the account’s other changes', good: true},
                 {label: 'Remove the rule, confirm FS-03 had no successful remote-desktop sign-in, and close: with the rule gone, nothing from abroad can reach FS-03', good: false, why: 'The account and the laptop that made the change are still the intruder’s.'},
                 {label: 'Lock everyone out of the firewall for a week', good: false, disrupt: 1}]},
    benign: {clues: ['Devraj changed rule R8 at 11:20.', 'Change ticket CHG-6020 (game) covers it: letting the new second resolver, DNS-02, answer lookups.', 'He signed in with his own firewall admin account and MFA, from the network team’s admin workstation.'],
             truth: 'Benign: an approved, ticketed change, made by the rule’s owner.'},
    fp: {clues: ['The “change” is the firewall’s nightly update of its threat signatures.', 'The configuration audit shows only a new signature version; no rule changed.', 'The rule counts every configuration commit as a rule change.'],
         truth: 'False positive: a signature update, not a rule change.'}
  },
  sweep: {
    rule: 'One host touching many hosts on admin ports',
    mal: {clues: ['A staff workstation touched 140 hosts on TCP 445 and 3389 in four minutes.', 'The program doing it is an unsigned file in a user’s temp folder, started under that user’s account.', 'Minutes later the same workstation tried to sign in to two servers with an admin account.'],
          truth: 'Network Service Discovery: an intruder mapping what it can reach next.',
          resp: [{label: 'Isolate the workstation, collect triage, reset the account it used, and check the two servers’ sign-ins: it may have got in', good: true},
                 {label: 'Block the workstation’s address at its switch port so it can’t reach any other host, and close: nothing scans from behind a port that is shut', good: false, why: 'The program is still on the machine, and the account it tried is still at risk.'},
                 {label: 'Ignore it: scans like this hit the town every day, from inside and out, and none of them has ever turned into anything', good: false, why: 'Outside scans are routine. A staff workstation scanning inside the network is not.'}]},
    benign: {clues: ['The source is VS-01, the town’s own vulnerability scanner.', 'Its scan is approved and scheduled: Tuesdays 22:00 to 02:00, with a written scope.', 'It touched only the subnets in scope.'],
             truth: 'Benign: the town’s own authorised vulnerability scan. Exclude it narrowly, with a reason and an expiry.'},
    fp: {clues: ['The source is BKP-01, the backup server, at 01:00.', 'It connects to every server on the backup agent’s port every night.', 'The rule counts any port as an admin port.'],
         truth: 'False positive: the backup server doing its job.'}
  },
  burrow: {
    rule: 'Long, random-looking DNS names to one domain',
    mal: {clues: ['A workstation made 6,000 lookups of long random names under one domain in three hours.', 'Endpoint telemetry: the lookups come from an unsigned program in a temp folder, not the browser or a security agent.', 'The domain was registered last week and appears in no vendor’s documentation.'],
          truth: 'DNS used as a command channel: commands and data hidden in lookups.',
          resp: [{label: 'Isolate the workstation, sinkhole the domain at the resolver, collect triage, and search the DNS logs for other hosts that asked for it', good: true},
                 {label: 'Block the domain at the town’s resolver and close: with no answers coming back the program has no channel left, so the workstation can stay in use', good: false, why: 'The program is still running, and it can try another domain.'},
                 {label: 'Block all DNS for that floor', good: false, disrupt: 2}]},
    benign: {clues: ['The lookups come from the endpoint security agent, a signed process.', 'Its vendor’s documentation (game) says the agent checks file reputations by DNS, under the vendor’s own domain.', 'That domain is on the town’s approved list.'],
             truth: 'Benign: the security agent’s documented reputation lookups. The process and the domain’s owner decide it, not the shape of the names.'},
    fp: {clues: ['The long names are the content delivery network’s hostnames for the town website’s images.', 'They’re long, not random: the same names every day, from every browser.', 'The rule measures length only.'],
         truth: 'False positive: long but ordinary CDN hostnames.'}
  },
  smuggle: {
    rule: 'Unexpected protocol inside an allowed port',
    mal: {clues: ['A server holds an SSH session open all night to an outside address on TCP 443, where the firewall expects TLS.', 'While it is open, FS-03 logs remote-desktop sign-ins coming from that server, which never uses remote desktop: the outside end is reaching FS-03 through the tunnel.', 'The process is a portable tunnelling tool copied to the server yesterday by an admin account, from a laptop that never manages servers.'],
          truth: 'Protocol Tunneling: remote desktop wrapped inside an SSH tunnel. SSH on TCP 443, a port it doesn’t normally use, is also Non-Standard Port (T1571).',
          resp: [{label: 'Block the destination, isolate the server, collect the tool, disable the account that copied it, and check what crossed the tunnel', good: true},
                 {label: 'Close: outbound TCP 443 is allowed for this server, and blocking it would break every web connection it makes, updates included', good: false, why: 'The port is allowed. What’s inside it isn’t.'},
                 {label: 'Block all outbound TCP 443 for the town', good: false, disrupt: 2}]},
    benign: {clues: ['It’s the network team’s documented out-of-band management link to the internet provider’s router.', 'The firewall rule that allows it names an owner and gives that reason.', 'Endpoints and times match the documentation.'],
             truth: 'Benign: a documented, owned management tunnel.'},
    fp: {clues: ['The traffic is ordinary TLS; the inspection engine mislabelled a new TLS extension.', 'The inspection vendor’s notice confirms the bad signature (game).', 'Same flows every day from the update server.'],
         truth: 'False positive: an inspection signature mislabelled normal TLS.'}
  }
});
Object.assign(ALERT_CHAINS, {
  scrub: ['The same account signs in to a second server.', 'That server’s log is truncated too.'],
  hinge: ['Sign-in attempts on FS-03 multiply.', 'One remote-desktop sign-in succeeds.'],
  sweep: ['The workstation starts on a second subnet.', 'An admin sign-in from it succeeds.'],
  burrow: ['The lookups get longer: data is leaving.', 'A second workstation starts the same lookups.'],
  smuggle: ['A second tunnel opens from another server.', 'Large transfers start inside the tunnel.']
});

/* ---------- Morning briefing items (IT Basement) ---------- */
const BM_BRIEFS = [
  {t: 'scrub', text: 'Intruders are clearing or truncating server logs to hide their sign-ins.', act: 'Forward server logs off the box as they are written'},
  {t: 'hinge', text: 'Attackers who reach a firewall’s admin account add rules that let themselves in.', act: 'Alert on every firewall change without a ticket'},
  {t: 'sweep', text: 'After getting in, intruders scan the inside network for file sharing and remote desktop.', act: 'Alert on hosts touching many hosts on admin ports'},
  {t: 'burrow', text: 'Malware is using DNS lookups as a hidden channel out of networks.', act: 'Keep DNS logs; alert on long names to new domains'},
  {t: 'smuggle', text: 'Attackers wrap other protocols inside allowed ports to tunnel out.', act: 'Check what really runs on allowed ports'}
];

/* ---------- Fieldwork: log sources (game weights: roughly how many systems each covers) ---------- */
const BM_SOURCES = [
  {id: 'idp', name: 'Identity sign-ins (directory and cloud)', w: 2, on: true, ask: 'Who signed in, where from, with which factor?'},
  {id: 'laptops', name: 'Endpoint process creation, staff laptops (EDR)', w: 2, on: true, ask: 'Which program ran, started by what?'},
  {id: 'web', name: 'Web server and WAF logs', w: 1, on: true, ask: 'What did the internet ask the town’s sites?'},
  {id: 'backup', name: 'Backup console audit', w: 1, on: true, ask: 'Who changed or deleted a backup?'},
  {id: 'vpn', name: 'VPN appliance (sign-ins, admin sessions)', w: 2, on: false, ask: 'Who connected from outside, and who changed the appliance?'},
  {id: 'firewall', name: 'Edge firewall (traffic and configuration audit)', w: 2, on: false, ask: 'What crossed the boundary, and who changed a rule?'},
  {id: 'dns', name: 'DNS resolver queries', w: 2, on: false, ask: 'Which host looked up which name?'},
  {id: 'servers', name: 'Endpoint process creation, servers', w: 2, on: false, ask: 'Which program ran on a server, started by what?'},
  {id: 'proxy', name: 'Web proxy', w: 1, on: false, ask: 'Which staff device fetched what from the web?'},
  {id: 'bms', name: 'Building management controllers (HVAC, doors)', w: 1, on: false, ask: 'Who changed a building controller?'}
];
// The source questions (each answered by one source), with the earlier case that needed it.
const BM_QUESTIONS = [
  {q: 'Who signed in to the VPN at 02:00, and from where?', good: 'vpn', why: 'Only the VPN appliance knows who connected through it. Today its logs stay on the box for 14 days (game), then roll over: copy off what it holds when you start forwarding.'},
  {q: 'Which program on a laptop made a connection? (Clerks’ Row, the flagged download)', good: 'laptops', why: 'Process creation from the endpoint tool, as in Clerks’ Row: the proxy saw a download, the laptop saw what ran.'},
  {q: 'Which host looked up a newly registered domain?', good: 'dns', why: 'The resolver’s query log is the only place that answers “who asked for this name”. Nobody collects it yet.'},
  {q: 'Who changed a firewall rule, and when? (Records Hall: data left through the edge)', good: 'firewall', why: 'The firewall’s configuration audit. In Records Hall the flow records answered what left; nobody here can yet say who changes the rules.'}
];
// Which sources each district needs for "full logging" (the Beacon Badge's dwell effect). (game)
const BM_DISTRICT_SOURCES = {
  fd: ['idp', 'laptops', 'bms'], mail: ['idp', 'dns'], clerks: ['laptops', 'proxy'], market: ['web', 'firewall', 'dns'],
  records: ['backup', 'servers', 'firewall'], basement: ['vpn', 'firewall', 'dns', 'servers']
};
const BM_MAP_DISTRICT = {hub: 'fd', desk: 'fd', board: 'fd', dojo: 'fd', mail: 'mail', mboard: 'mail', clerks: 'clerks', eboard: 'clerks',
  market: 'market', wboard: 'market', records: 'records', rboard: 'records', basement: 'basement', bboard: 'basement'};

/* ---------- Fieldwork: clocks (game offsets, seconds, against the reference) ---------- */
const BM_CLOCKS = [
  {host: 'LOG-01 · log collector', off: 0.3, src: 'internet time server (direct)'},
  {host: 'FW-EDGE · edge firewall', off: -95, src: 'none: set by hand at install'},
  {host: 'VPN-01 · VPN appliance', off: 248, src: 'vendor default server, unreachable'},
  {host: 'DIR-01 · directory', off: 0.4, src: 'internet time server (direct)'},
  {host: 'FS-02 · file server', off: -420, src: 'its own hardware clock'},
  {host: 'DNS-01 · resolver', off: 31, src: 'its own hardware clock'}
];

/* ---------- Fieldwork: the firewall rule binder (game) ---------- */
// good: keep | narrow | remove | replace. owner: who answers for the rule (null = nobody).
const BM_RULES = [
  {id: 'R1', text: 'Internet → WEB-01, TCP 443', owner: 'web team (Paz)', why: 'the town website', hits: '2.1 million', good: 'keep'},
  {id: 'R2', text: 'Staff network → internet, TCP 80 and 443', owner: 'network team (Devraj)', why: 'staff web browsing, through the proxy', hits: '9.4 million', good: 'keep'},
  {id: 'R3', text: 'ANY → ANY, any service', owner: null, why: '“router install, temporary” (2019)', hits: '412', good: 'replace'},
  {id: 'R4', text: 'VPN address pool → internal network, ANY service', owner: 'network team (Devraj)', why: '“vendor support needs it” (2021)', hits: '88,310', good: 'narrow'},
  {id: 'R5', text: 'BKP-01 → all servers, backup agent port and TCP 445 (file shares)', owner: 'backup team (Nico)', why: 'nightly backups', hits: '31,002', good: 'keep'},
  {id: 'R6', text: 'Internet → ANNEX-PC-03, TCP 3389 (disabled)', owner: null, why: '“HVAC contractor remote access”', hits: '0 since it was disabled', good: 'remove'},
  {id: 'R7', text: '203.0.113.20 → FS-03, SFTP', owner: null, why: '“payroll vendor uploads” (2018)', hits: '0 (its counter hasn’t moved in 14 months)', good: 'remove'},
  {id: 'R8', text: 'Internal network → DNS-01, TCP and UDP 53', owner: 'network team (Devraj)', why: 'name lookups', hits: '51 million', good: 'keep'}
];
const BM_RULE_ACTS = {
  keep: {label: 'Keep it: owner, reason and recent hits all check out', why: 'It has an owner who can say why it exists, and the hits match that reason.'},
  narrow: {label: 'Owner confirmed: raise a change to narrow it to the services that need it, with a date', why: 'It has an owner and real traffic, but “any service” is far more than VPN users need. Narrow it through change control, not by deleting it this afternoon. And decide with the owner, in writing, whether the risk can wait for the change window or needs an emergency change: remote access this wide is a risk the town carries every night until then.'},
  remove: {label: 'Remove it: nobody owns it and nothing uses it', why: 'No owner and no traffic. A rule nobody can explain is a door nobody watches. Ask the department its reason names once and record the answer, then remove it through a change that keeps the old rule on record, so it can be put back if something nobody knew about breaks.'},
  replace: {label: 'Read what it carries, write specific rules (with owners) for the legitimate flows, then remove it', why: 'It still carries traffic, so deleting it blind breaks something. Find what uses it, give that its own narrow rule and an owner, and let the default deny catch the rest.'}
};

/* ---------- Fieldwork: the rule-tuning week (game) ---------- */
// One detection: "an internal host touches 20 or more hosts on admin ports (445, 3389, 22) in 5 minutes".
// truth: what each alert really was. triage: what last week's on-call analyst recorded.
const BM_TUNE_RULE = 'An internal host touches 20 or more hosts on admin ports (TCP 445, 3389, 22) within 5 minutes';
const BM_WEEK = [
  {id: 'vs1', host: 'VS-01 (10.20.8.20)', when: 'Tue 22:10', n: 250, truth: 'fp', triage: 'false positive: approved vulnerability scan'},
  {id: 'vs2', host: 'VS-01 (10.20.8.20)', when: 'Tue 23:40', n: 250, truth: 'fp', triage: 'false positive: approved vulnerability scan'},
  {id: 'pm1', host: 'PM-01 (10.20.8.30)', when: 'Wed 19:05', n: 31, truth: 'fp', triage: 'false positive: patch deployment'},
  {id: 'pm2', host: 'PM-01 (10.20.8.30)', when: 'Wed 19:50', n: 31, truth: 'fp', triage: 'false positive: patch deployment'},
  {id: 'pm3', host: 'PM-01 (10.20.8.30)', when: 'Wed 20:40', n: 31, truth: 'fp', triage: 'false positive: patch deployment'},
  {id: 'hr', host: 'HR-WS-03 (10.20.3.41)', when: 'Thu 15:12', n: 140, truth: 'real', triage: 'malicious: escalated and contained'},
  {id: 'mg', host: 'MGMT-01 (10.20.8.57)', when: 'Sat 02:10', n: 34, truth: 'real', triage: 'benign: “IT admin activity” (no ticket)'}
].concat([1, 2, 3, 4, 5, 6, 7].map(d => ({id: 'bk' + d, host: 'BKP-01 (10.20.9.12)', when: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1] + ' 01:00', n: 31, truth: 'fp', triage: 'false positive: nightly backup'})));
// Tuning options. hides(alert): true when the option stops that alert firing.
const BM_TUNES = [
  {k: 'vs', good: true, label: 'Exclude VS-01 only, only inside its approved scan window (Tue 22:00–02:00), until the scanning contract ends', hides: a => /^VS-01/.test(a.host)},
  {k: 'bk', good: true, label: 'Exclude BKP-01 only, only on TCP 445 (its backup job reads each server’s shares), only 00:30–04:00', hides: a => /^BKP-01/.test(a.host)},
  {k: 'pm', good: true, label: 'Exclude PM-01 only, only inside the approved patch window', hides: a => /^PM-01/.test(a.host)},
  {k: 'subnet', good: false, label: 'Exclude the whole IT subnet, 10.20.8.0/24: IT scans things all the time', hides: a => /\(10\.20\.8\./.test(a.host)},
  {k: 'night', good: false, label: 'Exclude everything from 00:00 to 04:00: it’s all maintenance', hides: a => /\b0[0-3]:\d\d$/.test(a.when)},
  {k: 'thresh', good: false, label: 'Raise the threshold from 20 hosts to 60', hides: a => a.n < 60},
  {k: 'off', good: false, label: 'Disable the rule: almost all of it is noise', hides: () => true}
];

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real-world kinds of evidence) ---------- */
const BM_DRILLS = {
  gap: {
    id: 'gap', title: 'Forty quiet minutes', budget: 2,
    intro: '<p>Lena’s new “source went quiet” rule, piloted on FS-02 alone so far, fired this morning (game): FS-02’s Security log has nothing in the SIEM between 01:20 and 02:00 UTC. An attacker who clears a log leaves a hole like that. So does a collector that stopped listening.</p>',
    artefact: '<pre class="art">SIEM · FS-02 · Security log · Day {D} (game data, UTC)\n' +
      '01:19:41  4624  logon          svc-backup\n' +
      '          …  no events  …\n' +
      '02:00:12  4634  logoff         svc-backup\n' +
      'Usual rate  about 60 events a minute</pre>' +
      '<p class="small">Event 1102 (“The audit log was cleared”) is written every time a Windows Security log is cleared. An empty stretch in the SIEM is a question, not an answer.</p>',
    question: 'Were FS-02’s logs cleared, or did the collector miss them?',
    sources: [
      {id: 'count', name: 'SIEM event-count dashboard', qs: [
        {q: 'How many events did the SIEM take in overnight?', kind: 'trap',
         res: ['Events per hour fell from about 180,000 to 61,000 between 01:00 and 02:00.', '(A drop says something stopped arriving. It doesn’t say why, or from where.)']}]},
      {id: 'host', name: 'FS-02’s own Security log (on the server)', qs: [
        {q: 'Does FS-02’s local log hold 01:20–02:00, and is there an event 1102?', kind: 'focus', key: true,
         res: ['The local log holds 01:20–02:00: 2,211 events, the usual mix (backup sign-ins, file access)', 'No event 1102 in the whole log; its oldest entry is from Day {D-12}', 'The local copy was never cleared: the hole is in the SIEM, not on the server']}]},
      {id: 'health', name: 'Collector health log', qs: [
        {q: 'What did the collector itself record between 01:00 and 02:30?', kind: 'focus', key: true,
         res: ['01:19:44  ingest queue full (disk 100%): dropping incoming events', '02:00:09  nightly clean-up freed disk; ingest resumed', 'Sources with a gap from 01:19 to 02:00: 61 of 61']},
        {q: 'Every collector message this month', kind: 'broad', rows: 9330,
         wall: ['{t}  ingest ok   source FS-0{i}  rate {n}/min', '{t}  parser     WEB-01 access log  ok', '{t}  disk       {n} GB free', '{t}  forwarder  DIR-01 reconnected']}]},
      {id: 'nico', name: 'Ask Nico (FS-02’s owner)', qs: [
        {q: 'Did anyone touch FS-02 last night?', kind: 'trap',
         res: ['Nico: “Nobody touched it. I’d know.”', '(Probably true, and no use either way: people don’t see what an intruder does. Records do.)']}]},
      {id: 'others', name: 'SIEM: other servers, same window', qs: [
        {q: 'Did other servers go quiet at the same time?', kind: 'focus',
         res: ['DIR-01, DNS-01, WEB-01 and APP-01 all have nothing between 01:19 and 02:00.', '(Useful: a gap everywhere at once points at the collector. The collector’s own log says why.)']}]}
    ],
    ai: {everything: {text: 'FS-02’s security log is empty for 40 minutes overnight, consistent with log clearing (ATT&CK T1685.005). Recommend isolating FS-02 and starting incident response.', wrong: true,
                      reveal: 'Tally saw a hole and named a technique. It never asked whether FS-02’s own log still held the forty minutes, or whether every other source went quiet at the same moment. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'Is there an event 1102 in FS-02’s local Security log?', text: 'No. The local log runs unbroken back to Day {D-12}.'}},
    verdicts: [
      {label: 'Collector outage: its disk filled and it dropped every source’s events for 40 minutes; FS-02’s own log was never cleared', good: true, why: 'The local log holds the window with no 1102, and the collector logged the drop for all 61 sources.'},
      {label: 'Log clearing on FS-02: an intruder cleared the Security log around 01:20 to hide 40 minutes, and the SIEM’s overnight drop is the hole it left', why: 'A cleared Security log starts with event 1102, and the window would be gone from the server too. Both are still there.'},
      {label: 'Can’t tell either way: whatever FS-02 wrote in those 40 minutes never reached the SIEM, so the record we would need is gone', why: 'They aren’t gone. They’re on FS-02, where they were written.'}],
    reasons: [
      {label: 'FS-02’s local log still holds 01:20–02:00 and contains no 1102, and the collector’s own log records dropping every source’s events in exactly that window', good: true, why: 'The server and the collector, each speaking for itself, agree.'},
      {label: 'The SIEM’s event count fell by two thirds between 01:00 and 02:00, exactly when FS-02 went quiet, which a 40-minute hole explains', why: 'A fall fits a clearing and an outage alike.'},
      {label: 'Nico, who owns FS-02 and checks it every morning, says nobody touched it, and svc-backup’s logon at 01:19 and logoff at 02:00 bracket the window like a normal backup run', why: 'Nobody would see an intruder. The records decide.'}],
    alts: [
      {label: 'An intruder cleared FS-02’s Security log', good: true, why: 'Ruled out: the local log holds the window and has no 1102 anywhere.'},
      {label: 'An intruder stopped FS-02’s forwarding to hide one session', good: true, why: 'Ruled out: all 61 sources went quiet at 01:19, and the collector says why.'},
      {label: 'A time-zone or daylight-saving change on FS-02 moved the forty minutes to another hour', why: 'Everything here is in UTC; nothing moved.'},
      {label: 'The SIEM deleted them to save space', why: 'It never received them: the collector dropped them on the way in.'}],
    path: '<p>A hole in collected logs is decided by <b>the host’s own log</b> (does it still hold the window, and is there an event 1102 for a cleared Security log?) and by <b>the collector’s own health log</b> (did it drop events, and for which sources?). A gap on every source at once is the collector; a gap on one host with a 1102 is the host. No 1102 is not proof on its own: an intruder can stop the event log service (event 1100) or delete selected records, and neither clears the log, so check that the window’s events are on the host and match what was forwarded. The SIEM’s totals and anyone’s memory fit both.</p>',
    response: ['Pull the missing 40 minutes from each server’s local log while they are still there', 'Alert on the collector’s own health: disk, queue and dropped events', 'Size the collector’s disk for the new sources, with headroom, and have forwarders keep and resend events until the collector confirms them, so an outage leaves a delay, not a hole; turn the quiet-source rule on for every source', 'Keep the alert on event 1102, and keep forwarding as events are written, so a clearing can never take the only copy'],
    techs: ['T1685.005'], acts: ['gapcheck']
  },
  clocks: {
    id: 'clocks', title: 'Seven minutes apart', budget: 2,
    intro: '<p>Devraj’s change review (game): yesterday he added the new archive server to the backup rule, R5, under ticket CHG-6017. The firewall says the rule changed at <b>14:03</b>. MGMT-01, the management server he says he signed in to first, says he signed in at <b>14:10</b>. Either someone changed the rule before he sat down, or a clock is wrong.</p>',
    artefact: '<pre class="art">Day {D-1} · as each device recorded it (game data)\n' +
      'FW-EDGE   14:03:10  config change   rule R5 edited   by fw-devraj\n' +
      'MGMT-01   14:10:00  4624 logon      d.sood (remote desktop)\n' +
      'SIEM      14:12:31  both events ingested</pre>' +
      '<p class="small">A timeline is only as good as the clocks that wrote it. Before you trust an order, check each clock.</p>',
    question: 'Which came first: Devraj’s sign-in or the rule change?',
    sources: [
      {id: 'siem', name: 'SIEM event order', qs: [
        {q: 'In what order did the SIEM receive them?', kind: 'trap',
         res: ['Both arrived at 14:12:31, the rule change listed first.', '(Ingest time is when the SIEM got an event, not when it happened. MGMT-01 sends in batches.)']}]},
      {id: 'ntp', name: 'Time status, FW-EDGE and MGMT-01', qs: [
        {q: 'What was each device’s clock offset from the reference yesterday afternoon?', kind: 'focus', key: true,
         res: ['FW-EDGE: synchronised to NTP-01 since the NTP fix yesterday, before Devraj’s change window; offset at 14:03 yesterday 0.2 s', 'MGMT-01: not synchronised. It sits in the management network, and UDP 123 from there to NTP-01 is blocked; it runs on its own hardware clock', 'MGMT-01’s offset at 14:30 yesterday, from the monitoring server’s hourly time check: +10 min 30 s (fast)']}]},
      {id: 'ref', name: 'A shared reference event', qs: [
        {q: 'Find one connection both devices recorded', kind: 'focus', key: true,
         res: ['MGMT-01 → FW-EDGE management port, one session:', '  FW-EDGE recorded it at 14:00:05', '  MGMT-01 recorded the same session at 14:10:35', 'The same moment, 10 min 30 s apart: MGMT-01’s clock was fast by that much']},
        {q: 'Every event from both devices that afternoon', kind: 'broad', rows: 18440,
         wall: ['{t}  FW-EDGE  allow  10.20.{n}.4 → 192.0.2.10:443', '{t}  MGMT-01  4688  process  mmc.exe', '{t}  FW-EDGE  allow  10.20.8.57 → 10.20.9.{n}:3389', '{t}  MGMT-01  4624  logon  svc-monitor']}]},
      {id: 'ticket', name: 'Change ticket CHG-6017', qs: [
        {q: 'What does the ticket say about timing?', kind: 'focus',
         res: ['Approved Tuesday; window Day {D-1} 13:30–15:00; implementer: Devraj; steps: sign in to MGMT-01, edit R5, test', '(Useful: it says what should have happened. The clocks decide what did.)']}]}
    ],
    ai: {everything: {text: 'The rule changed at 14:03, seven minutes before the only admin sign-in at 14:10. Someone changed the firewall without signing in to MGMT-01: possible compromise of fw-devraj.', wrong: true,
                      reveal: 'Tally put the two timestamps side by side as if both clocks were right. MGMT-01’s clock was ten and a half minutes fast: corrected, Devraj signed in at 13:59:30, then changed the rule. Check every clock before you trust an order.'},
         specific: {q: 'Was MGMT-01’s clock synchronised yesterday afternoon?', text: 'No. It runs on its own hardware clock, about 10 min 30 s fast.'}},
    verdicts: [
      {label: 'The sign-in came first (13:59:30, once MGMT-01’s clock is corrected), then the change at 14:03:10: the ticketed change, in order', good: true, why: 'MGMT-01 was 10 min 30 s fast; the shared connection proves it.'},
      {label: 'The rule changed first, at 14:03, seven minutes before Devraj sat down: someone else used his firewall account inside the window', why: 'Only if both clocks were right. MGMT-01’s wasn’t.'},
      {label: 'The change came first: the SIEM, which stamps every event with one clock, lists the change above the sign-in', why: 'The SIEM shows when it received events, not when they happened.'}],
    reasons: [
      {label: 'MGMT-01 wasn’t synchronised: one connection both devices recorded puts it 10 min 30 s fast, so the sign-in was 13:59:30, before the 14:03:10 change', good: true, why: 'Each clock checked, then one shared event to line them up.'},
      {label: 'CHG-6017 says sign in to MGMT-01, then edit R5; both events fall inside its approved 13:30–15:00 window, and Devraj has followed his own tickets to the letter on every change this year', why: 'A ticket is a plan. The clocks say what happened.'},
      {label: 'The SIEM received both at 14:12:31 and listed the change first; with one SIEM clock, device skew can’t change that order', why: 'Ingest order isn’t event order.'}],
    alts: [
      {label: 'An attacker used fw-devraj before Devraj signed in', good: true, why: 'Ruled out: corrected for MGMT-01’s clock, the sign-in comes first, inside the ticket’s window, and the firewall’s session came from MGMT-01’s address.'},
      {label: 'The firewall’s clock is the wrong one', good: true, why: 'Ruled out: FW-EDGE was synchronised to NTP-01 with a 0.2 s offset; MGMT-01 wasn’t synchronised at all.'},
      {label: 'Devraj worked from home over the VPN, so his sign-in reached MGMT-01 late', why: 'His session came from MGMT-01, on site.'},
      {label: 'Daylight saving time moved the clocks', why: 'Both devices log in UTC; nothing changed that day.'}],
    path: '<p>Two timelines that disagree are decided by <b>each clock’s offset at the time</b> (its time-sync status and measured offset) and by <b>one event both devices recorded</b>, which gives the exact correction between them, and so their order, even if neither clock was right. The SIEM’s ingest time and the order rows appear in are when events arrived, not when they happened.</p>',
    response: ['Allow UDP 123 from the management network to the internal NTP servers, and sync MGMT-01 today', 'Alert when any device stops synchronising or drifts more than a second', 'Note the correction (+10 min 30 s) in the case file for anything MGMT-01 logged before the fix', 'Close CHG-6017’s review: changed in order, by its owner'],
    techs: ['T1686.002'], acts: ['clockcheck']
  },
  dns: {
    id: 'dns', title: 'Long names to one domain', budget: 2,
    intro: '<p>A new detection Lena wrote fired overnight (game): thousands of DNS lookups of long, random-looking names, all under one domain, cdn-metrics.example. DNS tunnels look like that. So do some security products and content networks.</p>',
    artefact: '<pre class="art">DNS-01 resolver · Day {D-1} 21:00 to Day {D} 03:00 (game data)\n' +
      'Domain    cdn-metrics.example\n' +
      'Queries   9,412   e.g. q7x2kf0a9m3t5c1v8b6n4p0z.cdn-metrics.example  (TXT)\n' +
      'Answers   short TXT strings, different every time</pre>' +
      '<p class="small">The shape of a name is a hint. Which program asked, and who owns the domain, are the evidence.</p>',
    question: 'A DNS tunnel, or a legitimate service?',
    sources: [
      {id: 'count', name: 'Query counter', qs: [
        {q: 'How many queries, and how fast?', kind: 'trap',
         res: ['9,412 queries in six hours, about 26 a minute.', '(Plenty of legitimate services make thousands of lookups. Volume fits both.)']}]},
      {id: 'entropy', name: 'Name-randomness score', qs: [
        {q: 'How random are the names?', kind: 'trap',
         res: ['Randomness score 4.6 (high).', '(Security products and content networks use long random-looking names too. Shape alone fits both.)']}]},
      {id: 'edr', name: 'Endpoint DNS and process telemetry (Sysmon event 22)', qs: [
        {q: 'Which host and which process made the lookups?', kind: 'focus', key: true,
         res: ['All 9,412 from one host, PL-WS-07; the resolver’s query log, kept since the fieldwork, shows no other host asking for this domain', 'Process: C:\\Users\\r.abara\\AppData\\Local\\Temp\\wuphelper.exe (unsigned), started at 20:58 by a document opened from email', 'Not the browser, not the security agent (a signed process whose lookups go to its own vendor’s domain)']}]},
      {id: 'owner', name: 'Domain ownership and vendor documentation', qs: [
        {q: 'Who owns cdn-metrics.example, and does any vendor document it?', kind: 'focus', key: true,
         res: ['Registered nine days ago (game), through a privacy service', 'Not in any of the town’s vendors’ documentation, and not on the approved list', 'Its name servers answer only these long names; the domain has no website']},
        {q: 'Every domain looked up in town overnight', kind: 'broad', rows: 1204000,
         wall: ['{t}  10.20.{n}.7    update.vendor.example        A', '{t}  10.20.4.{n}    townhall.example              A', '{t}  10.20.{n}.31   img.cdn.example               AAAA', '{t}  10.20.6.{n}    av-telemetry.example          TXT']}]},
      {id: 'proxy', name: 'Web proxy’s own log (kept on the proxy; not in the SIEM yet)', qs: [
        {q: 'Did PL-WS-07 reach cdn-metrics.example over the web?', kind: 'focus',
         res: ['No web requests to that domain from anyone.', '(Useful: a domain used only for DNS fits a tunnel. Some telemetry does that too, so the process and the owner decide it.)']}]}
    ],
    ai: {everything: {text: 'The lookups are high-volume and high-entropy, typical of DNS tunnelling. Recommend blocking the domain.', wrong: true,
                      reveal: 'Tally matched the shape and the volume, which a security agent or a content network can share. Right this time, for the wrong reasons, and blocking the domain alone leaves the program running. Ask which process asked and who owns the domain.'},
         specific: {q: 'Which process on PL-WS-07 made the lookups of cdn-metrics.example?', text: 'wuphelper.exe, unsigned, in r.abara’s temp folder.'}},
    verdicts: [
      {label: 'A DNS tunnel: an unsigned program on PL-WS-07, started from an email attachment, talking to a nine-day-old domain no vendor uses', good: true, why: 'The process and the domain’s owner, each from its own record.'},
      {label: 'The endpoint security agent’s reputation lookups: TXT queries of long random names, at a steady rate all night, as reputation checks look', why: 'The agent is a signed process and uses its own vendor’s domain; this one isn’t and doesn’t.'},
      {label: 'A DNS tunnel: 9,412 long, random-looking names to one domain in six hours, with a randomness score of 4.6, is the tunnelling signature', why: 'Right answer, weak reason: shape and volume fit legitimate services too.'}],
    reasons: [
      {label: 'Endpoint telemetry names an unsigned program in a temp folder as the only asker; the domain is nine days old and in no vendor’s documentation', good: true, why: 'Who asked, and who answers.'},
      {label: 'The randomness score is 4.6, far above the town’s normal lookups, and every one of the 9,412 names is a different long random string that no person or browser would produce', why: 'So is a content network’s.'},
      {label: 'Nine thousand queries to one domain in six hours, about 26 a minute, is far more than any one site or service needs, even the busiest one in town', why: 'Volume fits both.'}],
    alts: [
      {label: 'The endpoint security agent’s telemetry', good: true, why: 'Ruled out: the agent is signed and looks up its own vendor’s domain; this program is unsigned and the domain belongs to no vendor.'},
      {label: 'A content delivery network for a site the user visited', good: true, why: 'Ruled out: no web traffic to the domain at all, from anyone, and a CDN’s names repeat from browser to browser.'},
      {label: 'A misconfigured resolver retrying failed lookups and appending its search domain to every name', why: 'One program on one host made every query.'},
      {label: 'The user typing names', why: 'Nine thousand random names, at night.'}],
    path: '<p>Long names to one domain are decided by <b>which process on which host asked</b> (endpoint DNS and process telemetry, such as Sysmon event 22) and by <b>who owns the domain</b> (registration, vendor documentation, the approved list). Count and randomness are the two things tunnels, security agents and content networks share, so they can’t tell them apart.</p>',
    response: ['Isolate PL-WS-07 and collect triage, the program included', 'Block and sinkhole cdn-metrics.example at the town’s resolver', 'Search the DNS logs for every host that asked for it (only PL-WS-07 since collection began: you can say so because the DNS logs exist, and you can say nothing about the weeks before)', 'Find the email and everyone who received it; reset r.abara’s password and revoke the sessions', 'Keep the detection, and record why it fired'],
    techs: ['T1071.004'], acts: ['dnscheck']
  }
};

/* ---------- Log Analysis Dojo (NCL-style) ---------- */
const BM_LOG_DOJO = [
  {title: 'One web log line',
   art: 'A line from the town website’s access log (Apache Combined Log Format; game data):\n198.51.100.23 - - [27/Oct/2026:22:14:07 -0500] "POST /permits/login HTTP/1.1" 401 512 "-" "python-requests/2.31"',
   q: 'What does this line tell you?',
   opts: ['198.51.100.23 sent a login POST at 03:14:07 UTC on 28 October; it was refused (401), 512 bytes came back, and the client says it is a script library', 'User “frank” signed in successfully at 22:14 UTC', 'The request came from the town’s own server at 22:14 UTC: python-requests is the town’s monitoring script, 401 is the login page’s code and 512 is the user’s ID'], good: 0,
   explain: 'Field by field: client address, two dashes (no identity, no authenticated user), the time with its offset from UTC, the request line, the status, the size of the response body, the referrer and the user agent. The Apache documentation gives the time as [day/month/year:hour:minute:second zone]: 22:14:07 at −0500 is 03:14:07 UTC the next day. A 401 means the login was refused. The user-agent string is whatever the client chose to send.'},
  {title: 'Three clocks, one timeline',
   art: 'Three records of one evening (game data):\nA  web log (hosting provider’s zone)  [27/Oct/2026:22:14:07 -0500]  login refused for “permits-admin”\nB  firewall     2026-10-28T03:13:52Z           198.51.100.23 → WEB-01:443 allowed\nC  directory    2026-10-27 23:16:40 (local, UTC−4) permits-admin locked out',
   q: 'In UTC, what is the order?',
   opts: ['B, then A, then C: in UTC they are 03:13:52Z, 03:14:07Z and 03:16:40Z', 'A, then C, then B: read the times as written, since each device stamps its own events correctly', 'C, then A, then B: the lockout must come first, since it is what refused the login'], good: 0,
   explain: 'Convert everything to UTC before you sort: A is 22:14:07 + 5 h = 03:14:07Z; C is 23:16:40 + 4 h = 03:16:40Z; B is already UTC (the Z). The joint guide on event logging led by Australia’s ASD (with CISA, the FBI, the NSA and others, 2024) calls UTC the preferred time standard and recommends ISO 8601 timestamps such as 2024-07-25T20:54:59.649Z, so nobody has to do this sum at three in the morning.'},
  {title: 'Guessing or spraying?',
   art: 'Two sign-in logs from the same night (game data):\nX  one account (j.osei): 300 failures in 10 minutes, all from 203.0.113.80\nY  280 accounts: one failure each, the same password tried, from three addresses, over 30 minutes; then one success (h.marsh)',
   q: 'Which is which, and what matters most now?',
   opts: ['X is password guessing (one account, many passwords); Y is password spraying (one password, many accounts), and Y’s one success is the account to deal with first', 'X is spraying (300 tries from one address) and Y is guessing (one password per account); deal with j.osei first: 300 failures is the bigger attack', 'Both are the same attack; lock all 280 accounts'], good: 0,
   explain: 'ATT&CK separates them: Password Guessing (T1110.001) tries many passwords against an account; Password Spraying (T1110.003) tries one or a few passwords against many accounts, staying under each account’s lockout limit. Per-account lockouts catch X and never see Y. What matters is the success: reset h.marsh, revoke its sessions, and check what it did.'}
];
/* ---------- Scanning Dojo (NCL-style) ---------- */
const BM_SCAN_DOJO = [
  {title: 'Half-open',
   art: 'The firewall’s capture, VS-01 against FS-02 (game data):\n→ SYN to 445      ← SYN/ACK      → RST\n→ SYN to 23       ← RST\nFS-02’s file-sharing service logged no connections at all.',
   q: 'What kind of scan is this?',
   opts: ['A TCP SYN scan: it never completes the handshake, so the service on FS-02 never sees a connection', 'A TCP connect scan: the SYN/ACK shows the handshake completed on 445, and the RST is the scanner closing the finished connection afterwards', 'Not a scan: a backup job'], good: 0,
   explain: 'The Nmap reference guide calls the SYN scan “half-open”: it sends a SYN, a SYN/ACK means the port is listening, an RST means nothing is, and it never finishes the connection. A connect scan asks the operating system to complete the connection, so targets are more likely to log it. A SYN scan needs raw-packet privileges; without them, Nmap falls back to a connect scan.'},
  {title: 'Open, closed, filtered',
   art: 'One host, three ports (game data):\n445   SYN/ACK came back\n23    RST came back\n3389  no reply after several retries',
   q: 'How would a scanner report these three ports?',
   opts: ['445 open, 23 closed (it sent RST), 3389 filtered (no reply)', '445 open, 23 filtered (it sent RST), 3389 closed (no reply)', 'All three closed: only a completed connection proves that a port is open'], good: 0,
   explain: 'In Nmap’s terms: open means an application is accepting connections; closed means the port answers but nothing is listening; filtered means packet filtering stopped the probes, so it can’t tell whether anything is there. Filtered is not the same as safe: something may be listening behind the filter.'},
  {title: 'Scope first',
   art: 'A councillor (game): “The parking vendor’s cloud portal looks dodgy. You’ve got a scanner. Scan it tonight and tell me if it’s safe.”',
   q: 'What do you do?',
   opts: ['Don’t scan it: get written permission from its owner (the vendor), with a scope, times and a contact; meanwhile ask the vendor for its security assurances', 'Scan it, gently: one light pass over the portal’s public pages at night is no more than any visitor’s browser does, and a councillor asked for it', 'Scan it from home, so it isn’t the town doing it'], good: 0,
   explain: 'Scanning systems you don’t own or have permission to test can break laws and contracts, and can knock fragile systems over. Even the town’s own scanner, VS-01, runs under a written scope with agreed times. Get permission in writing from whoever owns the systems; for a vendor, ask for its own testing reports instead.'}
];

/* ---------- Basement Board (original) ---------- */
const BM_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'scrub', tech: 'T1685.006', tags: ['logs', 'host'], story: true, rate: 12, group: 'c',
   title: 'Round 1: the log that shrank', host: 'LOG-02 · Linux log relay', enemy: {spr: 'scrub', pal: 'scrub'},
   clues: ['/var/log/auth.log on LOG-02 is empty since 03:22; the collector still has everything up to 03:21.', 'The collector’s copy shows root signing in over SSH from a desktop that never manages servers.', 'The desktop’s user is on holiday, and her account signed in to it at 03:15.'],
   truth: 'Clearing Linux system logs to hide a sign-in. Forwarding as events are written kept the evidence.',
   resp: [{label: 'Preserve the collector’s copies and the disk; disable the account and the root key; isolate the desktop; hunt for the same sign-in', good: true},
          {label: 'Restart logging on LOG-02 and close: the collector kept everything up to 03:21, so the record is complete and the session is already documented', good: false, why: 'The intruder’s account and desktop are still live.'},
          {label: 'Wipe LOG-02 now', good: false, disrupt: 1, why: 'Preserve first.'}],
   chain: [{at: 40, text: 'The same key opens a second server.'}, {at: 75, text: 'That server’s log empties too.'}]},
  {kind: 'mal', threat: 'hinge', tech: 'T1686.002', tags: ['edge'], story: true, rate: 12, group: 'c',
   title: 'Round 2: a rule nobody asked for', host: 'FW-EDGE · edge firewall', enemy: {spr: 'hinge', pal: 'hinge'},
   clues: ['A new rule at the top of the list lets any outside address reach FS-03 on remote desktop.', 'Made at 23:10 by a network admin account whose owner is on leave, from a laptop that never manages the firewall.', 'Sign-in attempts from abroad start arriving at FS-03 within minutes.'],
   truth: 'Modifying a network device firewall to let an attacker in.',
   resp: [{label: 'Remove the rule; disable the account, end its sessions: its owner is on leave. Isolate the laptop; check FS-03 and the account’s other changes', good: true},
          {label: 'Remove the rule and close: it is tonight’s only change, and with it gone nothing outside can reach FS-03 on remote desktop', good: false, why: 'The account that made it is still the attacker’s.'},
          {label: 'Ignore it: rules change every day', good: false, why: 'Not without a ticket, at 23:10, from that laptop.'}],
   chain: [{at: 40, text: 'Remote-desktop attempts on FS-03 multiply.'}, {at: 75, text: 'One sign-in on FS-03 succeeds.'}]},
  {kind: 'mal', threat: 'burrow', tech: 'T1071.004', tags: [], story: true, rate: 11, group: 'c',
   title: 'Round 3: whispers in the lookups', host: 'FIN-WS-02 · finance workstation', enemy: {spr: 'burrow', pal: 'burrow'},
   clues: ['6,000 lookups of long random names under one domain in three hours, all from FIN-WS-02.', 'Endpoint telemetry: an unsigned program in a temp folder makes every one of them.', 'The domain is five days old and in no vendor’s documentation.'],
   truth: 'DNS used as a command channel.',
   resp: [{label: 'Isolate FIN-WS-02, block and sinkhole the domain, collect triage, search the DNS logs for other hosts asking for it, in case it spread', good: true},
          {label: 'Block the domain at the resolver and close: the program can’t reach its server any more, and finance needs FIN-WS-02 back for the month-end run', good: false, why: 'The program will try another domain.'},
          {label: 'Turn off DNS logging: too noisy', good: false, why: 'That log is how you found it.'}],
   chain: [{at: 40, text: 'The lookups lengthen: data is leaving.'}, {at: 75, text: 'A second workstation joins in.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const BM_CARDS = [
  {id: 'preserve', name: 'Preserve what logs remain', csf: 'Respond', good: true, text: 'Keep the collector’s copies, MGMT-01’s disk and memory, and the VPN appliance’s own logs, before anything is cleaned or rebuilt.', fx: 'Every stage starts with more evidence.'},
  {id: 'timeline', name: 'One timeline, from every source, in UTC', csf: 'Respond', good: true, text: 'Check each source’s clock against NTP, normalise everything to UTC, then join the firewall, DNS, VPN, directory and backup audit records into one timeline.', fx: 'Stage 1 moves faster: the order of events is certain.'},
  {id: 'rule', name: 'Close the rule', csf: 'Respond', good: true, text: 'Narrow “VPN address pool → internal network, ANY” to the few services VPN users need, today, under an emergency change. Deny and log the rest.', fx: 'Stage 2 becomes much easier: the path the intruder used is shut.'},
  {id: 'hunt', name: 'Hunt for the same behaviour elsewhere', csf: 'Detect', good: true, text: 'Search every server, and the collector’s copies, for event 1102, for the event log service stopping (1100) and for windows where a host holds fewer events than it forwarded (selective deletion writes no 1102); for the intruder’s account and for its tools; and replay the scan detection over the last month.', fx: 'Stage 3 becomes much easier.'},
  {id: 'wipe', name: 'Reimage MGMT-01 tonight', csf: 'Recover', text: 'A clean build, before anyone has looked.', fx: 'The disk and memory go with it, and nobody knows yet how the intruder got in.'},
  {id: 'restorelog', name: 'Restore MGMT-01’s Security log from backup', csf: 'Recover', text: 'Bring last night’s copy of the log file back and call the gap closed.', fx: 'Last night’s copy was taken before tonight’s session, so it can’t fill tonight’s gap, and writing it back over MGMT-01 destroys what is left. (Read as a separate copy in the lab, it is worth having: the intruder has been on MGMT-01 since last Saturday.)'},
  {id: 'blockip', name: 'Block one address and close', csf: 'Respond', text: 'Block the outside address in the alert and close the case.', fx: 'The intruder has an account and a foothold inside: one address is nothing.'},
  {id: 'wait', name: 'Wait for more alerts', csf: 'Detect', text: 'Leave everything running to learn more.', fx: 'They’re clearing logs: waiting loses evidence, not gains it.'}
];

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  coverage: {name: 'Map log sources to questions', desc: 'List the questions an investigation asks (who signed in, what ran, what crossed the boundary, who looked up what, who changed what) and the one source that answers each. Collect those first: edge devices, identity, DNS, process creation. A source nobody collects answers nothing.'},
  timesync: {name: 'One clock for every log', desc: 'Every host, appliance and the collector syncs to the same internal NTP servers, which each sync to at least four independent traceable sources (RFC 8633); logs are written in UTC with ISO 8601 timestamps; and you alert when a device stops synchronising or drifts. Then measure: a fix that a firewall rule stops from arriving isn’t a fix.'},
  retention: {name: 'Keep logs for as long as intrusions hide', desc: 'Set retention from a risk assessment, not the default: searchable long enough for day-to-day investigations, and archived (cheaper, slower) long enough to reach back to when an intruder may have arrived. Seven days reaches back seven days. Check legal and records-retention duties too, and keep the archive where the accounts that run the logged systems can’t delete it: the ASD-led guide recommends segmented storage to reduce the risk of logs being tampered with.'},
  fwreview: {name: 'Review the firewall rules', desc: 'Every rule has an owner, a written reason and recent hits that match the reason. Keep what checks out; narrow what is too broad through change control; remove what nobody owns and nothing uses; and replace a broad rule that still carries traffic with specific rules for what it carries, before you remove it.'},
  defaultdeny: {name: 'Deny by default, both ways', desc: 'Block all inbound and outbound traffic not expressly permitted, and log the denials. Rules then say what is allowed, each as specific as it can be.'},
  tuning: {name: 'Tune, don’t switch off', desc: 'Suppress a known false positive as narrowly as possible (one host, one port, one window), with a written reason, an owner and an expiry date. Never disable a rule to quiet it, and never build an exclusion on a triage label nobody checked.'},
  precision: {name: 'Precision and recall', desc: 'Precision: of the alerts a rule raises, the share that are real. Recall: of the real attacks, the share the rule raises. You can measure precision from your queue. Recall needs known attacks (red-team tests, replayed past incidents), because a missed attack leaves no alert to count.'},
  gapcheck: {name: 'Check a hole in the logs', desc: 'Does the host’s own log still hold the window, and is there an event 1102 for a cleared Security log? What does the collector’s own health log say, and did every source go quiet at once? No 1102 is not proof: stopping the log service (1100) or deleting selected records doesn’t clear the log, so compare the host’s events with the forwarded copy. Totals and memories decide nothing.'},
  clockcheck: {name: 'Check the clocks before the order', desc: 'For each device: was it synchronised, and what was its offset at the time? Then find one event both devices recorded, and use it to line the timelines up. Ingest time is not event time.'},
  dnscheck: {name: 'Check odd DNS by process and owner', desc: 'Which process on which host made the lookups, and who owns the domain? Count and randomness fit tunnels, security agents and content networks alike.'},
  suspicion: {name: 'Write a suspicion file', desc: 'When faint clues line up but prove nothing: what was seen, where, when (with how far each clock can be trusted), what it might mean, and what would confirm or rule it out. Hand it to whoever owns the decision. No conclusions, and no action on your own.'},
  scanscope: {name: 'Scan only with written permission', desc: 'Scan systems only with written authorisation from their owner, with a scope, times and a contact. That includes your own town’s systems.'}
});
Object.assign(FACTS, {
  asdlog: {name: 'Event logging best practice (ASD-led, 2024)', desc: 'A joint guide led by Australia’s ASD’s ACSC with CISA, the FBI, the NSA and other partners (August 2024) recommends a centralised logging facility, synchronised and validated time servers, UTC as the preferred time standard and ISO 8601 timestamps. It says default retention periods are often insufficient, retention should be informed by an assessment of risk, and some incidents take up to 18 months to discover. Its priority log sources include edge devices such as boundary routers and firewalls, identity and domain management servers, and DNS. It lists unexpected clearing of logs among behaviours to watch for.', src: 'ASD’s ACSC and partners, Best practices for event logging and threat detection (August 2024)'},
  sp80092: {name: 'Clocks and logs (NIST SP 800-92)', desc: 'If a host’s clock is inaccurate, the timestamps in its logs will be too, which makes analysing logs from several hosts harder. SP 800-92 recommends time synchronisation such as NTP servers to keep log sources’ clocks consistent, and that each logging host’s clock is synced to a common time source.', src: 'NIST SP 800-92, Guide to Computer Security Log Management (September 2006)'},
  rfc5905: {name: 'NTP version 4 (RFC 5905)', desc: 'RFC 5905 (June 2010, Proposed Standard) specifies version 4 of the Network Time Protocol, which is widely used to synchronise computer clocks across the internet. It obsoletes RFC 1305 (NTPv3) and RFC 4330 (SNTPv4).', src: 'IETF RFC 5905'},
  m2614: {name: 'US federal logging rules (federal agencies only)', desc: 'OMB memorandum M-26-14 (22 May 2026) rescinded M-21-31. It applies to US federal agencies, not to towns: logs actively searchable for at least 6 months and retrievable for a year after creation, and network time synchronised by NTP or an equivalent to a traceable source. It does not apply to national security systems.', src: 'OMB M-26-14 (May 2026)'},
  sp80041: {name: 'Firewall policy (NIST SP 800-41 Rev. 1)', desc: 'Firewalls should block all inbound and outbound traffic that has not been expressly permitted (“deny by default”). Rulesets should be as specific as possible, managed through formal change control, and reviewed or tested periodically. SP 800-41 calls filtering outgoing traffic “egress filtering” (§2.1.1), and also uses the term for blocking outbound traffic with source addresses the organisation doesn’t use (§4.1.1). Deny by default outbound is egress filtering in the first sense.', src: 'NIST SP 800-41 Rev. 1, Guidelines on Firewalls and Firewall Policy (September 2009)'},
  ev1102: {name: 'Event 1102', desc: 'Windows writes Security event 1102, “The audit log was cleared”, every time the Security audit log is cleared, naming the account that cleared it. Microsoft’s guidance: you should typically not see this event; monitor it and investigate why it happened.', src: 'Microsoft Learn, 1102(S): The audit log was cleared'},
  sysmon22: {name: 'Sysmon event 22', desc: 'Sysmon’s DNSEvent (event ID 22) is generated when a process executes a DNS query, whether the result succeeds or fails, cached or not. The telemetry exists from Windows 8.1 on.', src: 'Microsoft Learn, Sysinternals Sysmon'},
  nmap: {name: 'Port scans and port states (Nmap)', desc: 'The Nmap reference guide: a SYN scan is “half-open” (it never completes the connection; SYN/ACK means listening, RST means not, no reply after retries means filtered) and needs raw-packet privileges; a connect scan completes connections, so targets are more likely to log it. Open: an application is accepting connections. Closed: reachable, nothing listening. Filtered: packet filtering stops the probes.', src: 'Nmap Reference Guide: Port Scanning Basics, Port Scanning Techniques'},
  csflog: {name: 'Logging in the NIST CSF 2.0', desc: 'PR.PS-04: log records are generated and made available for continuous monitoring. DE.CM-01: networks and network services are monitored to find potentially adverse events. DE.AE-03: information is correlated from multiple sources.', src: 'NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (February 2024)'},
  g1017: {name: 'Living off the land at the edge', desc: 'ATT&CK’s entry for Volt Typhoon (G1017), a PRC state-sponsored group, records exploitation of vulnerabilities in internet-facing software and appliances, reliance on valid credentials, selectively cleared Windows Event Logs and system logs, and network service discovery with commercial tools, built-in utilities and appliances already present. It also records credentials taken from where network appliances stored them insecurely (T1552). The IT Basement incident is game-original; it borrows only that outline.', src: 'MITRE ATT&CK, Volt Typhoon (G1017), v20'}
});
GAME_NOTES.push(
  'IT Basement threats (Scrub, Hinge, Sweep, Burrow, Smuggle) join the alert mix with weights 3/2/3/3/2 once you reach the basement; inside it they are three times as likely. The Beacon Badge closes one chosen log-source gap, and in any district whose log sources are all collected, malicious alerts gain dwell 3 points slower per step. Logging tools are strong against log tampering; network tools against threats at the edge. (game)',
  'Log source coverage weights each source by roughly how many systems it covers. Mean time to detect is a model, not a measurement: 4 hours, plus 150 hours scaled by the share of sources not collected, plus a day if any clock is more than a minute out, plus 12 hours if detection precision is under 50%, plus a day if logs are kept under 30 days. (game)',
  'Hostnames, accounts, rule numbers, clock offsets, the tuning week, the directive’s figures, every incident timing and every person in the IT Basement are invented. (game)',
  'The IT Basement incident is game-original. Its outline (an exploited internet-facing appliance, valid accounts, selectively cleared logs, scanning with tools already present) follows behaviours ATT&CK records for Volt Typhoon (G1017); it is not a retelling of any real victim’s case. (game)'
);
