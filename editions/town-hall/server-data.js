/* ============================================================
   UPTIME · editions/town-hall/server-data.js
   Town Hall district 7, the Server Room (identity infrastructure / Active
   Directory): art, map, people, ATT&CK techniques met here, threats, alert
   templates, briefings, the privileged-account and service-account fieldwork,
   admin tiering (PAWs), Protected Users and Windows LAPS, the directory audit
   policy, the tiering mini-game, three investigation drills, the Assessment
   Findings area (an authorised assessment's findings and their defensive
   remedies, no offensive content), the Server Board and the boss incident's
   cards, Field Manual text. It extends the earlier districts' tables; the only
   change to their data is the Basement's west wall, which becomes the Server
   Room door (marked), opened by the Beacon Badge.
   Everything the player sees is written from the defender's side: log entries,
   alerts, ownership records, decisions and remediation. Attacker technique
   names and IDs appear only after a fight, never a step-by-step method.
   People, hosts, domains (.example), addresses (RFC 5737 and private ranges),
   tickets, group names, counts and timings are invented (game). Real facts are
   cited in CREDITS.md, section "Server Room". ATT&CK IDs verified on
   attack.mitre.org on 28 October 2026 (ATT&CK v20.0).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
// Threat sprites reuse earlier original grids under new palettes (an engine convenience); the Tessera tool sprite is new.
Object.assign(S, {
  tessera: ["0000011111100000","0001122222211000","0012344334432100","0123411111143210","0124133333314210","0124131221314210","0124131221314210","0124133333314210","0123411111143210","0012344334432100","0001122222211000","0000012332100000","0000012222100000","0000012332100000","0000001221000000","0000001111000000"]
});
Object.assign(PAL, {
  svCage: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  svPaw: ['#1b2233', '#24402f', '#2f6e3e', '#a6d96a'],
  svPawOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  svLedger: ['#2a2523', '#5b4a42', '#8c7b70', '#ffd96a'],
  svWhite: ['#1b2233', '#3a4a6b', '#8b93a7', '#f2e3c6'],
  svFind: ['#1b2233', '#5a3a7a', '#9a7ac0', '#ffd96a'],
  svBoard2: ['#1b2233', '#5b3a26', '#c98a54', '#ffd96a'],
  svTray: ['#1b2233', '#2b2f3a', '#4a5163', '#7fa2d6'],
  svCageOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  // threat palettes
  harvest: ['#141414', '#5a3a7a', '#c49ae0', '#ffd96a'],
  elevate: ['#141414', '#4a1414', '#b8432f', '#ffd96a'],
  spanner: ['#141414', '#1f5a8a', '#7fa2d6', '#ff4d6d'],
  relay: ['#141414', '#3a4a6b', '#8b93a7', '#ff9f43'],
  mirror: ['#141414', '#5b4a42', '#a89a80', '#ff4d6d'],
  // tool
  tessera: ['#1b2233', '#2f6e3e', '#a6d96a', '#ffd96a'],
  // people
  beatriz: ['#1a1a2e', '#3a1d10', '#c98a54', '#ffd96a'],
  tamsin: ['#1a1a2e', '#5b4a42', '#e0b090', '#7cc6c4'],
  raviMenon: ['#1a1a2e', '#141414', '#8a5a3c', '#3a4a6b'],
  hugo: ['#1a1a2e', '#2b1d16', '#a8703f', '#b8432f'],
  sana: ['#1a1a2e', '#5a2a6e', '#c49ae0', '#9ff0c8'],
  maraEl: ['#1a1a2e', '#1f5a8a', '#7fa2d6', '#ffd96a']
});
Object.assign(TILES, {
  '!': {spr: 'K', pal: 'svCage', solid: true},                    // the domain controllers' cage
  '9': {spr: 'pc', pal: 'svPaw', solid: true, under: ','},        // admin workstations (PAWs)
  '(': {spr: 'counter', pal: 'svLedger', solid: true, under: ','},// the service-account registry
  ')': {spr: 'sign', pal: 'svWhite', solid: true, under: ','},    // the identity office whiteboard
  '/': {spr: 'pc', pal: 'svFind', solid: true, under: ','},       // Assessment Findings terminals
  ':': {spr: 'K', pal: 'svBoard2', solid: true},                  // Server Board racks
  ';': {spr: 'trays', pal: 'svTray', grass: true}                 // cabling nobody owns: trip alerts
});

/* ---------- Tools: Keyling's next form (identity) ---------- */
// Identity tools are strong against credential-access threats; the new form also reads directory changes.
Object.assign(TOOLS, {
  tessera: {name: 'Tessera', cls: 'identity', sub: 'identity governance', spr: 'tessera', blurb: 'Keyling, set in stone. Knows who every account is, what it may touch, and who answers for it.',
            abil: ['signins', 'reset', 'revoke', 'whoowns']}
});
EVOLVED_FROM.tessera = 'keyling';
Object.assign(ABIL, {
  whoowns: {name: 'Trace the rights', type: 'inv', cost: 2, ev: 26, desc: 'Follow an account’s group memberships and the access each one grants, back to who owns the account and who approved the rights.'}
});

/* ---------- Map: the Server Room and the Server Board ---------- */
// West: the door back to the IT Basement. North-west: the domain controllers' cage, among unowned cabling. North:
// the admin-workstations (PAW) room. North-east: the service-account registry. Middle: the identity office and the
// Board door. South: the Assessment Findings terminals and your desk.
Object.assign(MAPS, {
  server: {
    name: 'Server Room',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w!!,!!,!!w,9,9,9,9w,(,(,(,(,w",
      "w;;,;;,;;w,,,,,,,,w,,,,,,,,,w",
      "w;;,;;,;;,,,,,,,,,,,,,,,,,,,w",
      "w;;,;;,;;w,,,,,,,,w,,,,,,,,,w",
      "wwwwwwwwwwww,,,wwwwwwwwwwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,,,,,,,,,,,,),),,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwww,wwwwwwwwwwwwwww,wwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,/,/,/,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w;;;,,,,,,,,Y,,,,,,,,,,,;;;,w",
      "w;;;,,,,,,,,,,,,,,,,,,,,;;;,w",
      "wwwwwwwwwwwwwEwwwwwwwwwwwwwww"
    ],
    doors: {'0,7': {to: 'basement', x: 1, y: 7, dir: 'right',
      get locked() { return (typeof G !== 'undefined' && G && G.f.bmBeacon) ? undefined : 'A sealed door in the west wall. A card reader: “Beacon Badge required.”'; }},
      '28,7': {to: 'svboard', x: 8, y: 8, dir: 'up'}}
  },
  svboard: {
    name: 'Server Board',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w::,,,,,,,,,,,,::w",
      "w::,,,,,,,,,,,,::w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwEwwwwwwwww"
    ],
    doors: {'8,9': {to: 'server', x: 27, y: 7, dir: 'left'}}
  }
});
// The one change to earlier data: the Basement's west wall becomes the door to the Server Room (Beacon Badge opens it).
MAPS.basement.rows[7] = 'D' + MAPS.basement.rows[7].slice(1);
MAPS.basement.doors['0,7'] = {to: 'server', x: 1, y: 7, dir: 'right',
  get locked() { return (typeof G !== 'undefined' && G && G.f.bmBeacon) ? undefined : 'A door in the west wall. A card reader: “Server Room. Beacon Badge required.”'; }};

const SV_MAPS = ['server', 'svboard'];
const SV_HOSTS = ['DC-01 · domain controller', 'DC-02 · domain controller', 'PAW-01 · admin workstation', 'FS-04 · file server', 'APP-03 · application server', 'SYNC-02 · identity sync'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'beatriz', name: 'Beatriz Solano', role: 'identity team lead', map: 'server', x: 14, y: 7, dir: 'down', pal: 'beatriz'},
  {id: 'tamsin', name: 'Tamsin Fry', role: 'service-account registrar', map: 'server', x: 23, y: 2, dir: 'down', pal: 'tamsin'},
  {id: 'ravim', name: 'Ravi Menon', role: 'identity administrator', map: 'server', x: 11, y: 2, dir: 'down', pal: 'raviMenon'},
  {id: 'hugo', name: 'Hugo Pereira', role: 'head of Permits', map: 'server', x: 18, y: 7, dir: 'left', pal: 'hugo', cond: G => !!G.f.svDrill1 && !G.f.svDirective},
  {id: 'sana', name: 'Sana Okoro', role: 'assessment coach', map: 'server', x: 10, y: 11, dir: 'left', pal: 'sana'},
  {id: 'marael', name: 'Mara Ellison', role: 'identity board lead', map: 'svboard', x: 8, y: 2, dir: 'down', pal: 'maraEl'},
  {id: 'raesv', name: 'Rae Okafor', role: 'SOC lead', map: 'server', x: 16, y: 7, dir: 'down', pal: 'rae', cond: G => !!G.f.svBoss}
);
const SV_NPC_IDS = ['beatriz', 'tamsin', 'ravim', 'hugo', 'sana', 'marael', 'raesv'];

/* ---------- ATT&CK techniques met in the Server Room (verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20.0) ---------- */
Object.assign(TECH, {
  'T1558.003': {name: 'Steal or Forge Kerberos Tickets: Kerberoasting', tactic: ['Credential Access'], desc: 'Requesting Kerberos service tickets for accounts that have a service name (an SPN) and taking the tickets away to crack their passwords offline. Service tickets issued with RC4 (encryption type 0x17 in event 4769) are the easiest to crack; AES (0x11/0x12) only makes cracking slower; a long random or managed service-account password is what makes it impractical.'},
  'T1098.007': {name: 'Account Manipulation: Additional Local or Domain Groups', tactic: ['Persistence', 'Privilege Escalation'], desc: 'Adding an account to extra local or domain groups to give it rights it should not have. Adding a member to a privileged group writes a group-management event (4728/4732/4756) naming the account that made the change.'},
  'T1021.002': {name: 'Remote Services: SMB/Windows Admin Shares', tactic: ['Lateral Movement'], desc: 'Using the hidden administrative shares every Windows machine has (C$, ADMIN$, IPC$), reachable only by administrators, to reach files and run things on other machines across the network.'},
  'T1550.002': {name: 'Use Alternate Authentication Material: Pass the Hash', tactic: ['Lateral Movement'], desc: 'Signing in to other machines with a stolen password hash instead of the password itself. On the network it shows up as NTLM logons (4624 type 3) that don’t line up with the person the account belongs to.'},
  'T1550.003': {name: 'Use Alternate Authentication Material: Pass the Ticket', tactic: ['Lateral Movement'], desc: 'Signing in with a stolen Kerberos ticket rather than a password. A forged ticket-granting ticket (a “golden ticket”) is a worse case of this, which is why the krbtgt account’s password is reset twice to invalidate forged tickets.'},
  'T1003.006': {name: 'OS Credential Dumping: DCSync', tactic: ['Credential Access'], desc: 'Asking a domain controller to replicate account password data by pretending to be another domain controller. Only domain controllers and a few documented accounts should ever make a replication request; one from any other host (event 4662 with the replication rights) is the sign.'},
  'T1558.001': {name: 'Steal or Forge Kerberos Tickets: Golden Ticket', tactic: ['Credential Access'], desc: 'Forging ticket-granting tickets using the krbtgt account’s password hash, so the attacker can mint access as anyone. Resetting the krbtgt password twice (letting the first reset replicate before the second) invalidates the forged tickets.'}
});

/* ---------- Threats (wild alerts) ---------- */
Object.assign(THREATS, {
  harvest: {name: 'Harvest', tech: 'T1558.003', spr: 'burrow', pal: 'harvest', tags: ['identity'], bucket: 'cred', district: 'server'},
  elevate: {name: 'Elevate', tech: 'T1098.007', spr: 'hinge', pal: 'elevate', tags: [], bucket: 'other', district: 'server'},
  spanner: {name: 'Spanner', tech: 'T1021.002', spr: 'sweep', pal: 'spanner', tags: ['lateral'], bucket: 'other', district: 'server'},
  relay: {name: 'Relay', tech: 'T1550.002', spr: 'smuggle', pal: 'relay', tags: ['lateral'], bucket: 'other', district: 'server'},
  mirror: {name: 'Mirror', tech: 'T1003.006', spr: 'scrub', pal: 'mirror', tags: ['identity'], bucket: 'cred', district: 'server'}
});
// (game) base weights for the Server Room threats; they only enter the mix once you reach the Server Room.
MAL_WEIGHTS.push({t: 'harvest', w: 3}, {t: 'elevate', w: 2}, {t: 'spanner', w: 2}, {t: 'relay', w: 2}, {t: 'mirror', w: 2});
const SV_HOME = ['harvest', 'elevate', 'spanner', 'relay', 'mirror'];
// Network tools gain the 'lateral' tag; identity tools already strong vs Credential Access.
CLASSES.network.strongTags = (CLASSES.network.strongTags || []).concat(['lateral']);

Object.assign(ALERTS, {
  harvest: {
    rule: 'Many service tickets for SPN accounts, weak encryption',
    mal: {clues: ['A staff workstation requested Kerberos service tickets (event 4769) for 14 different service accounts in six minutes.', 'Every request asked for RC4 (ticket encryption type 0x17), the kind easiest to crack offline, not the AES the town’s services use.', 'The requesting account is a planning clerk’s; the process is an unsigned program in that user’s profile, and the clerk has no reason to reach any of those services.'],
          truth: 'Kerberoasting: service tickets gathered to crack service-account passwords offline. The requesting account and the RC4 encryption type decide it.',
          resp: [{label: 'Isolate the workstation and reset the clerk, because the program is still there; rotate the roasted accounts and move them to AES after a test', good: true},
                 {label: 'Rotate the 14 service accounts and stop there: with new 30-character passwords the stolen tickets can’t be cracked, so the attacker gains nothing from them', good: false, why: 'Rotation does make the stolen tickets worthless: cracking one now yields a dead password. But the clerk’s account and the program on the workstation are still the attacker’s, and they will simply ask again.'},
                 {label: 'Block RC4 across the domain tonight', good: false, disrupt: 2, why: 'AES first, tested: some old service still needs RC4, and turning it off blind breaks sign-ins.'}]},
    benign: {clues: ['The source is MON-01, the monitoring server (svc-monitor).', 'It requests service tickets for the services it checks every night, about 1,900 of them, all AES256 (0x12).', 'Change CHG-7140 (game) documents the monitoring job and its account.'],
             truth: 'Benign: the monitoring server’s nightly health checks. The account is documented and the tickets are AES, not RC4.'},
    fp: {clues: ['The “many accounts” are one service, requested by one app server starting up after a reboot.', 'Every ticket is AES256; the account is the app’s own service account.', 'The rule counts each retried request as a separate account.'],
         truth: 'False positive: one service, retried at start-up. Tune the rule to count distinct service names and flag RC4, not retries.'}
  },
  elevate: {
    rule: 'New member of a privileged group',
    mal: {clues: ['At 14:20 an account was added to Server Admins (event 4728); the Subject that made the change is a help-desk account.', 'The added account belongs to a clerk who is on site visits all day and has never been in that group.', 'Ten minutes later the added account read 2,300 files from a payroll share, then was removed from the group again.'],
          truth: 'A privileged-group membership used for ten minutes to reach data, then removed. The change event’s Subject and that account’s actions in the window decide it, not the group’s current membership.',
          resp: [{label: 'Isolate the host and reset both accounts, because the credential is still live; take the help desk’s rights over the group; scope the payroll share before closing', good: true},
                 {label: 'Note that the group’s membership is clean now and close the case, because the account was removed at 14:30 and nobody is left holding the extra rights any more', good: false, why: 'The membership is clean because they removed it. The ten minutes in between is the incident.'},
                 {label: 'Disable every help-desk account until the review is done', good: false, disrupt: 2, why: 'One help-desk credential was misused, from one host. Scope that; don’t take the whole desk offline.'}]},
    benign: {clues: ['An account was added to a privileged group at 10:30 by the identity team’s own admin.', 'Change CHG-7151 (game) covers it: a new server administrator joining the team.', 'A second approver signed the change, as privileged-group changes now require.'],
             truth: 'Benign: an approved, two-person-approved change, made by the group’s owner.'},
    fp: {clues: ['The “new member” is a group being renamed; the directory logged a group change (4735, 4737 or 4755 by the group’s scope, and a 5136), not a membership change.', 'No account’s rights changed: the same members, under a new name.', 'The rule reads any 5136 on the group object as a new member.'],
         truth: 'False positive: a group rename, not a new member. Tune the rule to the membership-change events (4728/4732/4756), not every object change.'}
  },
  spanner: {
    rule: 'One host reaching many hosts over admin shares',
    mal: {clues: ['A server opened the hidden admin shares (C$, ADMIN$) on 40 other servers in four minutes.', 'The account doing it is a service account that has no reason to touch those machines, used from a host it never runs on.', 'On two of the servers, a program was then written to the admin share and started.'],
          truth: 'Moving across the network over Windows admin shares: the account and the pattern of one host reaching many decide it.',
          resp: [{label: 'Isolate the host and reset the service account, because it is still in use; check the two servers it reached, then close', good: true},
                 {label: 'Block SMB between servers at the firewall: with the shares unreachable the account can’t spread any further tonight', good: false, why: 'The backup and management jobs use those shares too, and the account and the program it dropped are still live.'},
                 {label: 'Delete the dropped program from the two servers, set their admin shares back to defaults, and mark the alert resolved in the queue', good: false, why: 'The account is still the attacker’s, and it reached more than those two.'}]},
    benign: {clues: ['The source is BKP-01, the backup server, at 01:00.', 'It reads each server’s shares every night to back them up; change records and the backup rule cover it.', 'It used its own documented backup account.'],
             truth: 'Benign: the backup server doing its nightly job, with its own account.'},
    fp: {clues: ['The “many hosts” are one cluster’s nodes talking to each other, as they always do.', 'It’s the cluster service account, on the cluster’s own subnet.', 'The rule counts each node as a separate host reached.'],
         truth: 'False positive: ordinary cluster traffic. Exclude the cluster’s nodes narrowly, with a reason and an expiry.'}
  },
  relay: {
    rule: 'An account signing in by hash, not where it belongs',
    mal: {clues: ['A service account made NTLM network sign-ins (4624 type 3) to two servers it has never signed in to.', 'The account’s password hasn’t changed, but these sign-ins don’t line up with the service that owns it: wrong hosts, wrong hours.', 'They started minutes after that account’s hash would have been exposed on a third host.'],
          truth: 'Pass-the-hash: a stolen hash used to sign in elsewhere. The mismatch between the account and where and when it signs in decides it.',
          resp: [{label: 'Reset the service account and revoke its sessions; isolate the host its hash came from, because it can leak it again; then close', good: true},
                 {label: 'Block NTLM for the account and close the case: with NTLM off a stolen hash is no use for these sign-ins, so the lateral movement stops where it is tonight', good: false, why: 'The hash is still good for Kerberos and the host it came from is still compromised; find and reset, don’t just block one protocol.'},
                 {label: 'Wait and watch which servers it tries next tonight, to map the whole move across the network before anyone resets anything at all', good: false, why: 'Waiting lets it keep moving. You have enough: reset and contain now.'}]},
    benign: {clues: ['The NTLM sign-ins come from an old line-of-business app that doesn’t support Kerberos.', 'Its own service account, from its own server, to the database it has always used.', 'The app’s documentation (game) explains the NTLM fallback; the endpoints and hours match.'],
             truth: 'Benign: a documented legacy app that still uses NTLM, on its own account and host.'},
    fp: {clues: ['The “hash sign-ins” are a vulnerability scanner’s authenticated checks.', 'VS-01, in its approved Tuesday scan window, with its scan account.', 'The rule flags any NTLM type-3 logon as pass-the-hash.'],
         truth: 'False positive: the town’s authorised scanner. Exclude its account in its window, narrowly.'}
  },
  mirror: {
    rule: 'A replication request from a non-domain-controller',
    mal: {clues: ['A host that is not a domain controller asked DC-01 to replicate account password data (event 4662 with the replication rights).', 'The account that asked is an ordinary user account, not a domain controller and not on the documented replication list.', 'It made the request once, from a workstation, then the account signed in to a file server it had never touched.'],
          truth: 'A DCSync-style replication request from somewhere that should never make one: the account and the source host decide it, not how much data moved.',
          resp: [{label: 'Isolate the host and disable the account; every password is exposed, because one replication pulls them all; plan to reset every account and the krbtgt twice', good: true},
                 {label: 'Block replication from that host at the firewall: with the one host blocked, no more password data can be replicated out of the domain tonight', good: false, why: 'If it replicated once, the hashes are out: a block doesn’t recall them. This is a domain-level incident.'},
                 {label: 'Reset the one account that made the request and close the case', good: false, why: 'The replication already happened; treat every credential as exposed and scope the whole domain.'}]},
    benign: {clues: ['The request comes from SYNC-02, the identity sync server (Entra Connect), by its MSOL_ connector account.', 'That account is documented for replication: Entra Connect needs “Replicate Directory Changes” and “Replicate Directory Changes All” to sync password hashes.', 'SYNC-02 is owned by the identity team and sits in Tier 0; change CHG-7104 (game) covers it.'],
             truth: 'Benign: the identity sync product’s documented replication, by its own connector account, from an owned Tier 0 server.'},
    fp: {clues: ['The “replication” is a monitoring probe reading a directory attribute, not a replication right.', 'Event 4662 fired because the object’s audit list is broad; no replication right was used.', 'The rule reads any 4662 on the domain object as a replication request.'],
         truth: 'False positive: an ordinary directory read, not replication. Tune the rule to the replication control-access rights, not every 4662.'}
  }
});
Object.assign(ALERT_CHAINS, {
  harvest: ['The same account requests tickets for more services.', 'A roasted account’s password is tried on a server.'],
  elevate: ['The added account opens a second share.', 'It is removed from the group to cover the trail.'],
  spanner: ['The source reaches a third server’s admin share.', 'A program it dropped starts running.'],
  relay: ['The hash is tried on a third server.', 'One of the sign-ins reaches a file server.'],
  mirror: ['The account signs in to a second server.', 'A privileged account’s hash is used elsewhere.']
});

/* ---------- Morning briefing items (Server Room) ---------- */
const SV_BRIEFS = [
  {t: 'harvest', text: 'Attackers are collecting Kerberos service tickets to crack weak service-account passwords offline.', act: 'Move service accounts to AES and long managed passwords'},
  {t: 'elevate', text: 'Intruders add a stolen account to a privileged group for a few minutes, then remove it.', act: 'Alert on every privileged-group change, add and remove'},
  {t: 'spanner', text: 'After getting a foothold, attackers spread over the hidden Windows admin shares.', act: 'Alert on one host reaching many over admin shares'},
  {t: 'relay', text: 'Stolen password hashes are being replayed to sign in to other servers.', act: 'Separate admin accounts and put human admins in Protected Users'},
  {t: 'mirror', text: 'Attackers are asking domain controllers to replicate password data from hosts that aren’t DCs.', act: 'Alert on replication requests from anything but a DC or the documented sync'}
];

/* ---------- Fieldwork: privileged accounts (Tier 0) ---------- */
// Members of the top groups, and which are everyday accounts that should be split off.
const SV_PRIV0 = 17, SV_PRIV0_EVERYDAY = 9, SV_PRIV0_AFTER = 5;

/* ---------- Fieldwork: the service-account registry (game) ---------- */
// 23 accounts behave like service accounts; 9 had owners before (39%). Each gets an owner and a plan.
const SV_SVC_TOTAL = 23, SV_SVC_OWNED_BEFORE = 9;
const SV_SVC_PLAN = [
  {k: 'gmsa', label: 'Move it to a group managed service account (gMSA): the domain manages and rotates its password', why: 'Best where the app supports it (a Windows service, app pool or scheduled task). Nine accounts qualify.'},
  {k: 'vault', label: 'Keep a user account with a 30+ character random password in the vault, rotated on a schedule', why: 'For the twelve apps that can’t use a gMSA yet. Long random passwords make Kerberoasting impractical.'},
  {k: 'retire', label: 'Disable it: no owner, and unused since 2022', why: 'Two accounts nobody owns and nothing uses. Disable, watch, then remove.'}
];

/* ---------- Fieldwork: the directory audit policy (verified event IDs; see CREDITS) ---------- */
const SV_AUDIT = [
  {id: '4768', name: 'Kerberos authentication ticket (TGT) requested'},
  {id: '4769', name: 'Kerberos service ticket requested (encryption type shown)'},
  {id: '4624', name: 'Account logged on (logon type: 2 interactive, 3 network, 10 remote desktop)'},
  {id: '4728/4729', name: 'Member added to / removed from a global group'},
  {id: '4732/4733', name: 'Member added to / removed from a local group'},
  {id: '4756/4757', name: 'Member added to / removed from a universal group'},
  {id: '5136', name: 'Directory object modified (needs a SACL on the object)'},
  {id: '4662', name: 'Operation on a directory object (replication rights; needs a SACL)'},
  {id: '4697', name: 'A service was installed (service type and account shown)'}
];

/* ---------- Tiering mini-game (game): crossings where control flows the wrong way ---------- */
// good: the fix that removes the exposure without stopping the work. Each crossing lights up when control runs downward.
const SV_TIER_CROSS = [
  {id: 'paw', text: 'A domain admin account signs in to an everyday laptop to read email, then administers a server from the same machine.',
   fix: 'Give each admin a separate Tier 0 account that signs in only from a privileged access workstation (PAW); keep email and web off it',
   bad: ['Tell the admins to sign out of admin consoles before opening email', 'Keep one account each, with endpoint protection, disk encryption and MFA on the admins’ laptops'],
   why: 'A Tier 0 credential typed on an everyday machine is exposed to everything on that machine. Separate accounts, and a PAW the admin account signs in from.'},
  {id: 'helpdesk', text: 'The help desk can reset the passwords of Server Admins’ members: a Tier 2 role controlling Tier 1.',
   fix: 'Delegate the help desk password resets on the staff accounts it supports; take away its reset rights over Server Admins’ members',
   bad: ['Log the help desk’s changes to Server Admins and review them weekly', 'Leave it: the help desk answers the phone at night when the server team is asleep, and a locked-out server admin needs a reset fast'],
   why: 'A lower tier must not control a higher one. Delegate the help desk the Tier 2 scope it needs, and nothing above it.'},
  {id: 'backup', text: 'One backup account is a domain admin and backs up both the domain controllers and the member servers.',
   fix: 'Split it: a Tier 0 account for the DCs, a Tier 1 account for the servers, each with only the rights it needs',
   bad: ['Give the backup account a 30-character random password in the vault, rotated monthly, and leave its rights as they are', 'Run the backups weekly instead of nightly, so the powerful account is signed in for a far smaller share of the time'],
   why: 'One account that spans tiers lets a Tier 1 compromise reach Tier 0. Split it along the tier line.'},
  {id: 'sync', text: 'The identity sync server holds replication rights but sits on the ordinary server network, administered from everyday machines.',
   fix: 'Treat the sync server as Tier 0: admin it from a PAW only, and protect it like a domain controller',
   bad: ['Leave it on the server network, alert on every sign-in to it, and keep its replication rights limited to the connector account', 'Move its replication rights to a domain admin account instead'],
   why: 'A server that can replicate password data is effectively Tier 0. It belongs behind the same controls as a DC.'},
  {id: 'monitor', text: 'The domain-controller monitoring collector runs on a Tier 2 workstation that staff also use.',
   fix: 'Move the DC monitoring to a dedicated Tier 0 collector that nothing else logs in to',
   bad: ['Keep it on the workstation but require a second factor to open the tool', 'Move the collector to a Tier 1 server with the other monitoring tools, away from the staff who use that workstation'],
   why: 'The collector runs its agent on the DCs, and Microsoft puts any system that operates or manages Tier 0, monitoring included, in Tier 0. It must sit at the tier it watches.'}
];
const SV_TIER_BEFORE = 46;

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const SV_DRILLS = {
  roast: {
    id: 'roast', title: 'Tickets for every service account', budget: 2,
    intro: '<p>Overnight the RC4-ticket rule fired (game): one workstation, PK-WS-11, requested Kerberos service tickets for all 12 of the town’s service accounts with service names, every one with RC4 encryption. Kerberoasting looks exactly like that. So does a monitoring tool checking the same services.</p>',
    artefact: '<pre class="art">SIEM · event 4769 · Day {D} 02:10–02:17 UTC (game data)\n' +
      'Account requesting   Service(s)        Count   Ticket Enc. Type\n' +
      'PK-WS-11 / d.okonjo  12 SPN accounts    38      0x17 (RC4)\n' +
      'MON-01 / svc-monitor ~140 services      1,904   0x12 (AES256)</pre>' +
      '<p class="small">In event 4769 the Ticket Encryption Type field shows the cipher: 0x17 is RC4 (easiest to crack), 0x11/0x12 are AES. Since Microsoft’s 2026 Kerberos updates, DCs issue AES unless an account explicitly allows RC4; these twelve still do (game). Who asked, and why, decide it.</p>',
    question: 'Kerberoasting, or the monitoring server doing its rounds?',
    sources: [
      {id: 'count', name: 'Ticket counter', qs: [
        {q: 'How many service tickets were requested overnight?', kind: 'trap',
         res: ['MON-01 requested 1,904; PK-WS-11 requested 38.', '(By count MON-01 dwarfs PK-WS-11. Count is the trap: the monitor legitimately asks for far more.)']}]},
      {id: 'time', name: 'Time of the requests', qs: [
        {q: 'When did each burst happen?', kind: 'trap',
         res: ['Both bursts fell between 02:00 and 02:40.', '(Both ran overnight. The hour tells them apart no better than the count.)']}]},
      {id: 'enc', name: 'Encryption type and account (4769, on the DCs) and the process (PK-WS-11’s endpoint agent)', qs: [
        {q: 'What encryption type did each request, and from what account and process?', kind: 'focus', key: true,
         res: ['PK-WS-11: every one of the 38 was RC4 (0x17), for d.okonjo, a clerk in Parks; the 4769s give the account and PK-WS-11’s address, and its endpoint agent names the process: an unsigned program in the user’s profile', 'MON-01: all 1,904 were AES256 (0x12), from svc-monitor, by the monitoring service', 'RC4 is the type an attacker asks for to crack offline; the town’s services use AES']}]},
      {id: 'reason', name: 'Business reason for the requesting host', qs: [
        {q: 'Does PK-WS-11 have a reason to reach these services?', kind: 'focus', key: true,
         res: ['PK-WS-11 is d.okonjo’s own workstation; d.okonjo is a clerk in Parks', 'None of the 12 services is one that workstation or that clerk ever uses', 'MON-01 is the monitoring server, and its job is to check those services (CHG-7140)']},
        {q: 'Every 4769 in the domain overnight', kind: 'broad', rows: 240000,
         wall: ['{t}  4769  svc-monitor  AES256 0x12  {n}', '{t}  4769  j.okafor     AES256 0x12  mail', '{t}  4769  d.okonjo     RC4 0x17     svc-sql', '{t}  4769  web-app      AES256 0x12  web']}]}
    ],
    ai: {everything: {text: 'A workstation requested 38 service tickets for 12 accounts overnight, consistent with Kerberoasting (T1558.003). Recommend rotating the service accounts.', wrong: true,
                      reveal: 'Tally matched the shape and recommended a rotation, but it never separated PK-WS-11 from MON-01, which requests fifty times as many tickets and is meant to. The encryption type and the requesting account are what tell them apart.'},
         specific: {q: 'What encryption type did PK-WS-11’s requests use?', text: 'RC4 (0x17), every one; the monitoring server’s were AES256.'}},
    verdicts: [
      {label: 'Kerberoasting from PK-WS-11: a clerk’s workstation requested RC4 tickets for services it never uses', good: true, why: 'The encryption type (RC4) and the requesting account with no business reason decide it.'},
      {label: 'The monitoring server’s nightly checks: a scheduled job requesting service tickets for the services it watches, as it does every night', why: 'That is MON-01, on AES, documented. PK-WS-11 is the one that doesn’t fit.'},
      {label: 'Kerberoasting from MON-01: 1,904 service-ticket requests in one night is fifty times what PK-WS-11 asked for, far beyond any health check', why: 'Count is the trap: MON-01 is the documented monitor, on AES, doing its nightly checks. PK-WS-11 is the one that doesn’t fit.'}],
    reasons: [
      {label: 'PK-WS-11’s 38 requests were all RC4, from a clerk’s account, for services it never reaches; MON-01’s were AES, from the documented monitor', good: true, why: 'The encryption type and the requesting account, each from its own record.'},
      {label: 'PK-WS-11 made 38 service-ticket requests in seven minutes, a burst far faster than any person would ever generate by hand, and at two in the morning', why: 'The monitor made far more, faster; speed fits both.'},
      {label: 'The requests came at 02:10, outside business hours, when no legitimate user would be asking for service tickets at all', why: 'The monitor runs overnight too; the hour decides nothing.'}],
    alts: [
      {label: 'The monitoring server’s nightly ticket requests', good: true, why: 'Ruled out: MON-01 used AES and its documented account; PK-WS-11 used RC4 and a clerk’s.'},
      {label: 'An application server requesting its own service’s tickets at start-up', good: true, why: 'Ruled out: those are AES, for one service, from the app’s own account, not a clerk’s workstation across 12.'},
      {label: 'A clock problem bunched old requests into one window', why: 'The clocks are synchronised; the 4769 events are real and recent.'},
      {label: 'The clerk opening 12 applications at once', why: 'A person opening apps doesn’t ask for RC4 tickets for service accounts they never use.'}],
    path: '<p>A burst of service-ticket requests is decided by <b>the encryption type and the requesting account</b> in event 4769 (RC4/0x17 for cracking versus the AES the town uses; a clerk’s account versus a documented service) and by <b>whether the requesting host has a business reason</b> to reach those services. The total count and the time of night fit a monitoring tool just as well, so they decide nothing.</p>',
    response: ['Isolate PK-WS-11 and collect triage, the program included', 'Reset d.okonjo and revoke its sessions; find the email the program came from', 'Rotate the 12 roasted service accounts, svc-permits first (its 2019 password and domain-admin rights make it the worst case), and hunt its sign-ins since 02:10; the other 11 already have long random passwords, rotate them anyway', 'Move the RC4 ones to AES after a test, and keep the RC4-ticket rule'],
    techs: ['T1558.003'], acts: ['krbaudit']
  },
  tenmin: {
    id: 'tenmin', title: 'In the group for ten minutes', budget: 2,
    intro: '<p>The privileged-group rule fired yesterday afternoon (game): a planning clerk, p.nash, was added to Server Admins at 14:20 and removed at 14:30. p.nash was on site visits all day. The group’s membership is clean now. Something happened in those ten minutes.</p>',
    artefact: '<pre class="art">SIEM · Server Admins · Day {D-1} (game data, UTC)\n' +
      '14:20:11  4728  member added    p.nash        Subject: hd-lwong\n' +
      '14:30:02  4729  member removed  p.nash        Subject: hd-lwong\n' +
      'Current members: 6 (unchanged from last week)</pre>' +
      '<p class="small">The 4728 names the Subject that made the change. A clean current membership says only how it looks now, not what happened in between.</p>',
    question: 'Who used p.nash’s ten minutes in Server Admins, and for what?',
    sources: [
      {id: 'now', name: 'Current group membership', qs: [
        {q: 'Who is in Server Admins now?', kind: 'trap',
         res: ['Six members, the same as last week; p.nash is not among them.', '(It looks clean because they removed p.nash at 14:30. The current list is the trap.)']}]},
      {id: 'subject', name: 'The change event’s Subject and its sign-ins', qs: [
        {q: 'What account made the change, and where was it signed in from?', kind: 'focus', key: true,
         res: ['Subject on both events: hd-lwong, a help-desk account', 'hd-lwong signed in by NTLM (4624 type 3) to DC-01 from HD-WS-02, the front-counter PC, at 14:18', 'Lisa Wong, who owns hd-lwong, badged out to lunch 14:00–15:00; her own sign-ins are Kerberos from HD-WS-01', 'hd-lwong could change the group through a second delegation nobody drew on the whiteboard: write access to Server Admins’ membership, set directly on the group’s own permissions (game)']}]},
      {id: 'pnash', name: 'What p.nash did in the window', qs: [
        {q: 'What did p.nash do between 14:20 and 14:30?', kind: 'focus', key: true,
         res: ['14:21–14:28: p.nash, from HD-WS-02, read 2,300 files from \\\\FS-04\\HR\\Payroll (Server Admins is local admin there)', 'Nothing on any domain controller or Tier 0 server in the window', 'p.nash was on site visits; his own laptop shows no activity then']},
        {q: 'Every event from HD-WS-02 yesterday', kind: 'broad', rows: 41000,
         wall: ['{t}  HD-WS-02  4624  hd-lwong  type 3  DC-01', '{t}  HD-WS-02  4688  process  mmc.exe', '{t}  FS-04     5140  share    HR, from HD-WS-02', '{t}  HD-WS-02  4634  logoff   hd-lwong']}]},
      {id: 'ticket', name: 'Change tickets for Server Admins', qs: [
        {q: 'Was there a ticket for adding p.nash?', kind: 'focus',
         res: ['No change ticket for adding p.nash to Server Admins.', '(Useful: a privileged-group change with no ticket is already a finding; who made it and what it did decide the rest.)']}]}
    ],
    ai: {everything: {text: 'A user was added to and removed from Server Admins within ten minutes. The group is clean now, so no lasting change was made; likely a help-desk error.', wrong: true,
                      reveal: 'Tally read the clean current membership and called it harmless. It never looked at what p.nash did in the ten minutes (2,300 payroll files) or at whose account made the change (hd-lwong, from the front-counter PC, while Lisa was at lunch).'},
         specific: {q: 'What account was the Subject of the 4728, and from where was it signed in?', text: 'hd-lwong, from HD-WS-02, by NTLM, while Lisa Wong was at lunch.'}},
    verdicts: [
      {label: 'hd-lwong’s credential, used from HD-WS-02, added p.nash to Server Admins to read the payroll share, then removed it again ten minutes later', good: true, why: 'The change event’s Subject and p.nash’s actions in the window, against Lisa’s lunch and the host, decide it.'},
      {label: 'A help-desk mistake, spotted and undone, where hd-lwong added the wrong person and took them back out of the group ten minutes later', why: 'In those ten minutes p.nash read 2,300 payroll files. That is the incident, not a slip.'},
      {label: 'p.nash borrowed a help-desk login at the front counter to add himself to Server Admins, read the payroll share, then take himself out again', why: 'p.nash was on site visits all day and his own laptop shows nothing then; the credential in use was hd-lwong’s, from the front-counter PC.'}],
    reasons: [
      {label: 'hd-lwong was the Subject of both events, signed in by NTLM from the front counter while Lisa was at lunch, and p.nash read 2,300 payroll files in the ten-minute window', good: true, why: 'The change, the account behind it and the data it reached, each from its own record.'},
      {label: 'p.nash was on site visits all day, so he can’t have added himself to the group or read the share himself, which makes this someone using his account', why: 'True but partial: it rules p.nash out, not in whose credential did it.'},
      {label: 'There was no change ticket for adding p.nash, and every legitimate privileged-group change has one', why: 'A missing ticket is a flag, not the finding; the actions in the window are.'}],
    alts: [
      {label: 'A genuine help-desk change made in error', good: true, why: 'Ruled out: it read 2,300 payroll files in the window and used Lisa’s account while she was at lunch.'},
      {label: 'Lisa Wong herself made the change', good: true, why: 'Ruled out: her own sign-ins are Kerberos from HD-WS-01; this was NTLM from HD-WS-02, during her badged-out lunch.'},
      {label: 'p.nash added himself to the group', why: 'p.nash was on site visits and the Subject on the event is hd-lwong, not p.nash.'},
      {label: 'The group’s membership was never really changed; the events are noise', why: 'The 4728/4729 pair and the payroll share access in between are all real.'}],
    path: '<p>A member added to a privileged group and quickly removed is decided by <b>the change event’s Subject</b> (which account made it, and from where it was signed in) and by <b>what the added account did in the window</b> (its logons and the data it reached). The group’s current membership looks clean because they cleaned it, so it decides nothing.</p>',
    response: ['Isolate HD-WS-02, the front-counter PC the change came from, and find how both credentials came to be used there: hd-lwong signed in on it last week, and p.nash uses the counter (game)', 'Reset hd-lwong and p.nash and revoke their sessions', 'Remove the help desk’s leftover write access to Server Admins (a Tier 2 role must not control Tier 1), and review every delegation on Tier 0 and Tier 1 groups: the whiteboard missed this one', 'Scope what left FS-04; tell HR and legal the payroll share was read', 'Hunt NTLM sign-ins from HD-WS-02 and the front-counter PCs'],
    techs: ['T1098.007'], acts: ['grpaudit']
  },
  replica: {
    id: 'replica', title: 'A replication request from a server', budget: 2,
    intro: '<p>The replication-from-non-DC rule fired this morning (game): a host that is not a domain controller asked DC-01 and DC-02 to replicate directory data, and 2.1 GB came back. An attacker pulling password data looks like that. So does a new identity sync product on its first full run.</p>',
    artefact: '<pre class="art">SIEM · event 4662 · Day {D} 09:00–11:40 UTC (game data)\n' +
      'Source      SYNC-02 (not a domain controller)\n' +
      'Account     MSOL_5c2e19a0b7d4\n' +
      'Right used  Replicating Directory Changes (All)\n' +
      'Volume      2.1 GB from DC-01 and DC-02</pre>' +
      '<p class="small">A replication request from anything but a DC is the signal. Which account made it, and whether that account is documented for replication, decide whether it’s an attack.</p>',
    question: 'An attacker replicating password data, or a legitimate identity sync?',
    sources: [
      {id: 'vol', name: 'Volume transferred', qs: [
        {q: 'How much data was replicated?', kind: 'trap',
         res: ['2.1 GB from the two domain controllers over two hours and forty minutes.', '(A first full directory sync moves gigabytes; so would a bulk dump. Volume fits both and decides nothing.)']}]},
      {id: 'acct', name: 'The requesting account and whether it’s documented', qs: [
        {q: 'Which account made the request, and is it documented for replication?', kind: 'focus', key: true,
         res: ['MSOL_5c2e19a0b7d4, the connector account the Entra Connect identity sync uses', 'Entra Connect legitimately holds “Replicate Directory Changes” and “…All” to sync password hashes', 'CHG-7104 documents it as SYNC-02’s connector, but nobody had added it to the rule’s documented replication list yet; the old SYNC-01’s connector is on it, which is why SYNC-01 never fires']}]},
      {id: 'host', name: 'The source host and its owner', qs: [
        {q: 'What is SYNC-02, and who owns it?', kind: 'focus', key: true,
         res: ['SYNC-02 is the new Entra Connect server, stood up three days before you arrived (CHG-7104), owned by the identity team', 'It was placed in Tier 0 during the fieldwork and is administered from a PAW only', 'This is its first full sync; the window matches the change ticket, 09:00–11:40']},
        {q: 'Every 4662 on the domain object this week', kind: 'broad', rows: 88000,
         wall: ['{t}  4662  svc-monitor  read attribute   DC-01', '{t}  4662  MSOL_5c2e..  replicate        DC-01', '{t}  4662  admin-audit  read ACL         DC-02', '{t}  4662  backup-svc   read attribute   DC-01']}]}
    ],
    ai: {everything: {text: 'A non-domain-controller made a replication request for 2.1 GB of directory data, consistent with DCSync (T1003.006). Recommend isolating the host and resetting krbtgt twice.', wrong: true,
                      reveal: 'Tally matched the pattern and jumped to the worst case. It never checked that the requesting account (the MSOL_ connector) is documented for replication, or that SYNC-02 is the identity team’s own Tier 0 sync server on its first run.'},
         specific: {q: 'Is the account that made the request documented for replication?', text: 'Yes: it’s the Entra Connect MSOL_ connector, documented under CHG-7104, though not yet on the rule’s list.'}},
    verdicts: [
      {label: 'Legitimate: the documented Entra Connect connector account, from the identity team’s own Tier 0 sync server, on its first full run', good: true, why: 'The requesting account is documented for replication (CHG-7104) and the source host is the owned, documented sync server.'},
      {label: 'A DCSync-style dump: a non-domain-controller asked for 2.1 GB of replicated password data, which is how an attacker pulls every hash', why: 'The signal is right but the account and host clear it: the connector is documented and SYNC-02 is owned.'},
      {label: 'An attack through SYNC-02 itself: a server stood up days ago, replicating 2.1 GB before anyone reviewed it, is how a planted sync server would look', why: 'Newness and volume decide nothing: the account is the documented connector, and SYNC-02 is the identity team’s own Tier 0 server under CHG-7104.'}],
    reasons: [
      {label: 'The requesting account is the documented Entra Connect MSOL_ connector, and SYNC-02 is the identity team’s own Tier 0 sync server, placed in Tier 0 during the fieldwork, on its first run', good: true, why: 'Who asked, whether it’s documented, and who owns the host.'},
      {label: 'Only 2.1 GB moved this morning, far less than the whole directory would be, well under what a full password-data dump would need to pull', why: 'Volume fits both a first sync and a dump; it decides nothing.'},
      {label: 'The request went to both domain controllers at once, which is how ordinary directory replication works and not how a quiet attacker pulling hashes would behave', why: 'An attacker can target either or both DCs; the destinations don’t clear it.'}],
    alts: [
      {label: 'A DCSync-style credential dump from a compromised host', good: true, why: 'Ruled out: the account is the documented connector and the host is the owned Tier 0 sync server.'},
      {label: 'A rogue account quietly granted replication rights', good: true, why: 'Ruled out: this account was created with SYNC-02 under a change ticket, holds only the connector’s documented rights, and replicates only from SYNC-02.'},
      {label: 'A domain controller replicating to another, logged by mistake as a non-DC', why: 'SYNC-02 is not a domain controller; the source is correct.'},
      {label: 'An admin reading the directory in a management console', why: 'Reading objects in a console doesn’t use the replication rights; this request did.'}],
    path: '<p>A replication request from a non-DC is decided by <b>which account made it</b> (is it documented for replication, like an Entra Connect connector?) and by <b>who owns the source host</b> (an owned Tier 0 sync server versus a workstation). The volume moved fits a first full sync and a bulk dump alike, so it decides nothing. The two keys clear it only together: the documented connector used from any host but SYNC-02 would be the attack (the ASD-led guide lists Entra Connect compromise).</p>',
    response: ['Keep the rule; add SYNC-02 and the MSOL_ account to the documented replication list with an owner, so the rule stays quiet for that pair alone', 'Treat SYNC-02 as Tier 0: administered from a PAW only, protected like a domain controller', 'Retire the old sync server, SYNC-01, after cut-over', 'Alert on any OTHER account using the replication rights'],
    techs: ['T1003.006'], acts: ['replaudit']
  }
};

/* ---------- Assessment Findings (NCL Enumeration & Exploitation area, defender framing) ---------- */
// Each: a finding an authorised assessor reported, then the correct remediation and the correct owner. No offensive content.
const SV_FINDINGS = [
  {title: 'An over-privileged service account',
   finding: 'The assessment report: the service account svc-report is a member of Domain Admins. The application it runs only needs to read one database and write to one share. An account with domain-admin rights and a crackable service-account password is a single point of failure for the whole domain.',
   q: 'What is the right remediation, and who owns it?',
   opts: ['Remove svc-report from Domain Admins and grant only the database read and share write it needs, tested first, with the business signing a risk acceptance',
          'Leave svc-report in Domain Admins but give it a 30-character password, so that even if its service ticket is roasted the password can’t be cracked in any useful time',
          'Move svc-report into a second admin group and monitor its sign-ins'], good: 0,
   owner: ['The business that owns the application (with the identity team)', 'The identity team (with the help desk), as owner of every account in the directory', 'The help desk'], ownerGood: 0,
   explain: 'Least privilege: an account gets only the rights its job needs, and a service account should never be a domain admin. The fix is tested first (apps break when rights are pulled blind) and the business that owns the app owns the risk, because it is their app and their trade-off to accept.'},
  {title: 'A computer trusted for unconstrained delegation',
   finding: 'The assessment report: APP-07 is configured to be trusted for delegation to any service (unconstrained delegation). Any privileged account that authenticates to APP-07 leaves a usable ticket on it. If APP-07 is compromised, those tickets can be reused against other services, up to and including a domain controller.',
   q: 'What is the right remediation, and who owns it?',
   opts: ['Change APP-07 to constrained delegation for the services it needs, and mark privileged accounts “sensitive and cannot be delegated” or add them to Protected Users',
          'Restrict who can log on to APP-07 and review its sign-in logs, leaving the delegation setting as it is, since limiting who signs in limits who could abuse the tickets it keeps',
          'Reset APP-07’s computer account password, which clears the tickets currently cached on it'], good: 0,
   owner: ['The identity team (with the application’s owner)', 'APP-07’s application owner (with the network team), since it is their server’s setting', 'The network team'], ownerGood: 0,
   explain: 'Unconstrained delegation is the broad, risky form; Microsoft’s guidance is to move to constrained delegation and to protect privileged accounts from being delegated at all (the “sensitive and cannot be delegated” flag, or the Protected Users group). Domain controllers are expected to delegate; ordinary servers should not. The identity team owns delegation settings, with the app’s owner.'},
  {title: 'A data share open to everyone',
   finding: 'The assessment report: the hidden administrative paths on FS-06 are reachable, but a data share on it, \\\\FS-06\\Archive, has its permissions set to allow Everyone to read and write. Every signed-in account can read or change the archive (the folder’s own permissions don’t narrow it), and a share this open is a common way for an intruder to spread files between machines.',
   q: 'What is the right remediation, and who owns it?',
   opts: ['Replace the Everyone permission with the groups that need the archive, read or write as each needs, and check what was written while it was open',
          'Hide the share by adding a $ to its name, so that it no longer shows up when people browse to the server over the network',
          'Move the archive to a different server and leave the old share in place until everyone has the new path'], good: 0,
   owner: ['The team that owns FS-06 and the archive data (with the identity team)', 'The identity team (with the help desk), which manages the groups used in every permission', 'The outside assessor who found it, since it is their finding to follow up to closure'], ownerGood: 0,
   explain: 'An “Everyone” share is an access-control failure: replace it with the groups that actually need the data, least privilege again, and check what the open window allowed. Hiding a share with a $ does not restrict access; it only hides it from browsing. The data’s owner owns the fix, with the identity team.'}
];

/* ---------- Server Board (original) ---------- */
const SV_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'harvest', tech: 'T1558.003', tags: ['identity'], story: true, rate: 12, group: 'c',
   title: 'Round 1: tickets in the night', host: 'PAW-view · directory', enemy: {spr: 'burrow', pal: 'harvest'},
   clues: ['One workstation requested service tickets for every service account with a name, all RC4.', 'The account is an ordinary user’s; the process is unsigned, in the user’s profile.', 'None of those services is one that user ever reaches.'],
   truth: 'Kerberoasting: service tickets gathered to crack service-account passwords offline.',
   resp: [{label: 'Isolate the host and reset the user, because the program still runs; rotate the roasted accounts, AES after a test', good: true},
          {label: 'Rotate the service accounts and stand down: new long passwords make the stolen tickets useless, so the attacker gains nothing', good: false, why: 'The user’s account and the program are still live.'},
          {label: 'Turn RC4 off for every account in the domain tonight, services and old line-of-business apps included, without a test first', good: false, disrupt: 1, why: 'AES first, tested.'}],
   chain: [{at: 40, text: 'A roasted account’s password is tried on a server.'}, {at: 75, text: 'The same workstation asks for more tickets.'}]},
  {kind: 'mal', threat: 'elevate', tech: 'T1098.007', tags: [], story: true, rate: 12, group: 'c',
   title: 'Round 2: ten minutes in the group', host: 'Server Admins · directory', enemy: {spr: 'hinge', pal: 'elevate'},
   clues: ['An account was added to Server Admins and removed ten minutes later; the Subject is a help-desk account.', 'In between, the added account read a payroll share it had no reason to touch.', 'The group’s membership is clean now.'],
   truth: 'A privileged-group membership borrowed for ten minutes to reach data, then returned.',
   resp: [{label: 'Isolate the host and reset both accounts, because the credential is live; take the help desk’s rights; scope the share', good: true},
          {label: 'Note the membership is clean and log it as resolved, because the account was removed and nobody is left holding the extra rights tonight', good: false, why: 'The ten minutes in between is the incident.'},
          {label: 'Disable every help-desk account in town, and route all password resets through the identity team until the review is done', good: false, disrupt: 1, why: 'Scope the one credential and host.'}],
   chain: [{at: 40, text: 'The added account opens a second share.'}, {at: 75, text: 'It is removed to cover the trail.'}]},
  {kind: 'mal', threat: 'mirror', tech: 'T1003.006', tags: ['identity'], story: true, rate: 11, group: 'c',
   title: 'Round 3: a request only a DC should make', host: 'DC-01 · domain controller', enemy: {spr: 'scrub', pal: 'mirror'},
   clues: ['A workstation, not a domain controller, asked DC-01 to replicate account password data.', 'The requesting account is an ordinary user’s, not on the documented replication list.', 'Right after, that account signed in to a server it had never touched.'],
   truth: 'A DCSync-style replication request from a host that should never make one.',
   resp: [{label: 'Isolate the host and disable the account; every password is exposed, because one replication pulls them all; reset them all and krbtgt twice', good: true},
          {label: 'Block replication from that host, since with the one host blocked no more password data can be replicated out of the domain tonight', good: false, why: 'If it replicated once, the hashes are already out.'},
          {label: 'Reset the one account that made the request and move on', good: false, why: 'Scope the whole domain: the replication already happened.'}],
   chain: [{at: 40, text: 'The account signs in to a second server.'}, {at: 75, text: 'A privileged account’s hash is used elsewhere.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const SV_CARDS = [
  {id: 'scope', name: 'Scope before you evict', csf: 'Respond', good: true, text: 'List every account and host the intruder touched, from the directory, replication, sign-in and service-install records, before changing anything, so every reset can happen together.', fx: 'Every stage starts knowing what must be reset together.'},
  {id: 'allatonce', name: 'Evict all at once', csf: 'Respond', good: true, text: 'Plan the reset as one coordinated action, not account by account: every account, privileged and service first, then every staff and computer account, and the krbtgt, so the intruder can’t ride a surviving credential back in.', fx: 'Stage 3 becomes much easier: nothing is left half-reset to hold on by.'},
  {id: 'krbtgt', name: 'Reset krbtgt twice', csf: 'Recover', good: true, text: 'Reset the krbtgt account’s password twice, letting the first reset replicate and waiting at least ten hours before the second, so forged tickets stop working.', fx: 'Stage 3 becomes much easier: forged tickets are cancelled.'},
  {id: 'cleanpaw', name: 'Rebuild from clean admin workstations', csf: 'Recover', good: true, text: 'Do every eviction step from clean Tier 0 PAWs, and rebuild the compromised hosts from known-good images, so the work itself doesn’t hand credentials back.', fx: 'The reset can’t be undone by a credential typed on a dirty machine.'},
  {id: 'piecemeal', name: 'Reset accounts as you find them', csf: 'Respond', text: 'Reset each account the moment the scoping turns it up, without waiting for the rest: every credential reset tonight is one the intruder can no longer use while you look for the others.', fx: 'The intruder notices, uses a credential you haven’t reached yet, and adapts. Reset together.'},
  {id: 'krbonce', name: 'Reset krbtgt once', csf: 'Recover', text: 'Reset the krbtgt password once, tonight, and leave it there: a second reset would invalidate every Kerberos ticket in town at once and take every sign-in down with it.', fx: 'The krbtgt keeps a two-password history, so one reset leaves forged tickets working. It must be reset twice.'},
  {id: 'watchonly', name: 'Watch and wait', csf: 'Detect', text: 'Leave everything running for a month with no containment, and watch: the longer you observe, the more footholds you will know.', fx: 'They have every hash: waiting hands them time, not you evidence.'},
  {id: 'blockone', name: 'Block one host', csf: 'Respond', text: 'Block APP-03, the host in the alert, at the firewall and call it contained: the replication came from there, and with it cut off the intruder has no way left to the DCs.', fx: 'The intruder has the directory’s secrets: one host is nothing.'}
];

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  adminsplit: {name: 'Separate admin accounts and PAWs', desc: 'Give each administrator a separate privileged account that is used only from a hardened privileged access workstation (PAW), with no email or web on it. A Tier 0 credential typed on an everyday machine is exposed to everything on that machine.'},
  tiering: {name: 'Admin tiering', desc: 'Put accounts, machines and services in tiers by what they control (Tier 0: the directory and what rules it; Tier 1: servers; Tier 2: workstations and the people who support them). Control must never flow downward: a higher-tier credential is never used on a lower-tier machine, and a lower tier never administers a higher one.'},
  svcreg: {name: 'Service-account registry', desc: 'Keep a register of every account that behaves like a service account, each with a named owner. Move accounts to group managed service accounts (gMSA) where the app supports it, so the domain manages the password; where it can’t, use a long random password in a vault, rotated on a schedule.'},
  laps: {name: 'Local administrator password management (LAPS)', desc: 'Windows LAPS automatically sets and rotates a unique local administrator password on every machine and backs it up to the directory, and can manage the DSRM password on domain controllers. Unique local passwords stop one captured hash from opening every machine.'},
  protusers: {name: 'Protected Users and legacy authentication', desc: 'Put human admin accounts in the Protected Users group after a test: it forces Kerberos with AES (no NTLM, no RC4, no delegation, a short ticket life) so those credentials can’t be relayed or delegated. Never add service or computer accounts: their secrets live on the host regardless, so membership only breaks them.'},
  diraudit: {name: 'Audit the directory and Kerberos', desc: 'Turn on auditing for Kerberos tickets (4768, 4769 with the encryption type), logons (4624 with the logon type), group-membership changes (4728/4732/4756 and their removals), directory object changes (5136, with a SACL) and directory access (4662, with a SACL on the domain object), and service installs (4697). Alert on privileged-group changes, replication requests from non-DCs, and RC4 service tickets.'},
  leastpriv: {name: 'Least privilege with a risk owner', desc: 'An account gets only the rights its job needs. When a business insists on more “because it broke last time”, test the smaller set in a staging copy, give the business a rollback, and have the business sign a risk acceptance for anything the test can’t cover. The risk belongs to whoever owns the system, not to the analyst.'},
  krbaudit: {name: 'Read a ticket burst by encryption type and account', desc: 'For a burst of Kerberos service-ticket requests (4769): what encryption type (RC4/0x17 is for offline cracking; the town uses AES), which account asked, and whether that host has a business reason to reach those services. The total count and the hour fit a monitoring tool too.'},
  grpaudit: {name: 'Read a privileged-group change by Subject and window', desc: 'For a member added to a privileged group: the change event’s Subject (which account made it, from where), and what the added account did while it was in the group. A clean current membership only says how it looks now.'},
  replaudit: {name: 'Read a replication request by account and host', desc: 'For a replication request from a non-DC (4662 with the replication rights): which account made it and whether it is documented for replication (an identity sync connector is), and who owns the source host. The volume moved fits a first full sync and a dump alike.'},
  evictall: {name: 'Evict all at once', desc: 'When the directory is compromised, scope first, then reset every account (privileged and service first, then every staff and computer account, with LAPS rotating every local and DSRM password) and the krbtgt in one coordinated operation, from clean PAWs, and rebuild compromised hosts from known-good images. Resetting piecemeal lets the intruder ride a surviving credential back in. The krbtgt is reset twice, at least ten hours apart (CISA CM0050), because it keeps a two-password history.'},
  assessfinding: {name: 'Read an assessment finding for the fix', desc: 'An authorised assessment reports what is exposed (an over-privileged account, unconstrained delegation, an open share). The defender’s job is the remediation and the owner: least privilege, constrained delegation with privileged accounts protected from delegation, and shares scoped to the groups that need them.'}
});
Object.assign(FACTS, {
  svtier: {name: 'Admin tiering and the enterprise access model', desc: 'Microsoft’s tier model keeps Tier 0 (the directory control plane), Tier 1 (servers) and Tier 2 (workstations and their support) apart, so a compromise at one tier can’t climb to another: higher-tier admins never sign in to lower-tier machines, and lower tiers never control higher ones, each administered from a privileged access workstation matching its tier. The enterprise access model builds Tier 0 out into a control plane across on-premises and cloud.', src: 'Microsoft Learn, AD DS tier model and the enterprise access model (privileged access)'},
  svgmsa: {name: 'Group managed service accounts (gMSA)', desc: 'A gMSA lets Windows manage and rotate a service account’s password automatically across the servers that use it, instead of an administrator setting it by hand. The application must support it (a Windows service, app pool or scheduled task); where it can’t, a long random password in a vault is the fallback.', src: 'Microsoft Learn, Group Managed Service Accounts Overview'},
  svlaps: {name: 'Windows LAPS', desc: 'Windows LAPS automatically manages and backs up a unique local administrator password on each machine, and can manage the DSRM account password on domain controllers. Microsoft lists protection against pass-the-hash and lateral movement among its benefits, because local admin accounts otherwise share one password an attacker can reuse everywhere.', src: 'Microsoft Learn, Windows LAPS overview'},
  svprot: {name: 'Protected Users security group', desc: 'Members of Protected Users are forced onto stronger Kerberos (no NTLM, no DES or RC4, no delegation, a four-hour ticket life and no cached sign-in), which stops their credentials being relayed or delegated. Microsoft says never to add service or computer accounts, whose secrets are on the host anyway, and to test before adding privileged accounts so they aren’t locked out.', src: 'Microsoft Learn, Protected Users Security Group'},
  svdeleg: {name: 'Unconstrained delegation', desc: 'A computer trusted for unconstrained delegation keeps a usable ticket for every privileged account that authenticates to it; if that computer is compromised, those tickets can be reused elsewhere. Microsoft’s guidance is to use constrained delegation limited to the services actually needed, and to mark privileged accounts “sensitive and cannot be delegated” or add them to Protected Users.', src: 'Microsoft Learn, Defender for Identity: unconstrained Kerberos delegation assessment'},
  svsync: {name: 'Entra Connect replication permissions', desc: 'Microsoft Entra Connect’s AD DS connector account (often an MSOL_ account by default) is granted “Replicate Directory Changes” and “…All” so it can synchronise password hashes. It is a documented, legitimate holder of replication rights, which is why a replication request from the sync server is expected while one from any other host is not. Because of those rights the sync server is a prime target and is treated as Tier 0.', src: 'Microsoft Learn, Microsoft Entra Connect: Accounts and permissions'},
  svkrbtgt: {name: 'Reset the krbtgt twice', desc: 'To cancel forged Kerberos tickets after a domain compromise, the krbtgt account’s password is reset twice, with the first reset allowed to replicate before the second, because the account keeps a two-password history. CISA advises waiting at least 10 hours before the second reset, and warns that a reset invalidates existing tickets: tell the business to expect sign-in trouble. This is CISA eviction countermeasure CM0050 and is called out in the joint AD-compromise guidance.', src: 'CISA Eviction Strategies CM0050; ASD-led guidance on detecting and mitigating AD compromises (September 2024)'},
  svevict: {name: 'Evicting an intruder from a domain', desc: 'CISA’s SolarWinds/AD eviction guidance has the steps done in order and fully, with all secrets rotated (every AD account) and the krbtgt reset twice; the joint uncovering-and-remediating advisory warns against premature, piecemeal containment that risks “tipping off” the adversary and against preemptive resets that miss other credentials, and says to hold incident communications out of band.', src: 'CISA AR21-134A (May 2021); joint advisory AA20-245A (September 2020)'},
  svadguide: {name: 'Detecting and mitigating AD compromises (ASD-led, 2024)', desc: 'A joint guide led by Australia’s ASD with CISA, the NSA and partners (September 2024) covers the most prevalent techniques against Active Directory, among them Kerberoasting, DCSync, Golden Ticket and unconstrained delegation, and their mitigations: minimise accounts with service names and replication rights, use gMSAs and long passwords, protect privileged accounts from delegation, and reset the krbtgt twice.', src: 'ASD’s ACSC with CISA, NSA and partners, Detecting and Mitigating Active Directory Compromises (September 2024)'},
  ev4769: {name: 'Event 4769 and the encryption type', desc: 'Windows logs event 4769 each time a Kerberos service ticket is requested, and records the Ticket Encryption Type: 0x17 is RC4, 0x11 and 0x12 are AES128 and AES256. A service ticket issued with RC4 is the easiest to crack offline, so a burst of RC4 service tickets is the sign of Kerberoasting. Microsoft advises monitoring for any type other than 0x11 and 0x12. Only domain controllers write it, and it gives the client’s address, not the program that asked: that comes from the endpoint.', src: 'Microsoft Learn, 4769(S, F): A Kerberos service ticket was requested'},
  ev4662: {name: 'Event 4662 and replication', desc: 'Event 4662 records an operation on a directory object and fires only where the object’s audit list (SACL) asks for it. A 4662 showing the directory-replication control-access rights, from a host that is not a domain controller, is how a DCSync-style credential pull shows up.', src: 'Microsoft Learn, 4662(S, F): An operation was performed on an object'}
});
GAME_NOTES.push(
  'Server Room threats (Harvest, Elevate, Spanner, Relay, Mirror) join the alert mix with weights 3/2/2/2/2 once you reach the Server Room; inside it they are three times as likely. The Crown Badge makes privileged-group changes map-wide need a second approver and halves lateral-movement encounters (Spanner, Relay). Identity tools are strong against credential-access threats; network tools against lateral movement. (game)',
  'Tier 3 scorecard: privileged (Tier 0) accounts, service accounts with an owner, tier-crossing sign-ins a day, mean time to scope an incident (modelled), and investigations led. Mean time to scope is a model: 6 hours, less 1 for each of the Basement’s four sources collected (at most 2 hours off), plus 4 if any Tier 0 group still holds everyday accounts. (game)',
  'Hostnames, accounts, group names, the registry counts, the directive’s figures, every incident timing and every person in the Server Room are invented. (game)',
  'The Server Room boss is game-original: a domain compromise in a small town, its outline following documented identity-compromise behaviour (DCSync, pass-the-hash, forged tickets) and the published eviction guidance. It is not a retelling of any one real victim’s case. (game)'
);
