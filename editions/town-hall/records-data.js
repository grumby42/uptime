/* ============================================================
   UPTIME · editions/town-hall/records-data.js
   Town Hall district 5, Records Hall (backup and recovery): art, map, people,
   ATT&CK techniques met here, threats, alert templates, briefings, the restore
   tests, the business impact analysis, the restore-order mini-game, three
   investigation drills, the Cryptography Dojo, the Records Board and the
   ransomware-incident cards, Field Manual text. It extends the earlier
   districts' tables; the only change to their data is a building on the plaza
   (marked).
   People, hosts, domains (.example), addresses (RFC 5737), tickets, restore
   times, recovery objectives, costs and numbers are invented (game). Real facts
   are cited in CREDITS.md, section "Records Hall".
   ATT&CK IDs verified on attack.mitre.org on 28 October 2026 (ATT&CK v20.0).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
Object.assign(S, {
  gloam: ["0000000000000000","0011111111100000","0013333333310000","0013444444311000","0013333333313100","0013444444311110","0013333333333310","0013444411111110","0013333122222100","0013344121112100","0013333122222100","0013444121112100","0013333122222100","0011111111111100","0000000000000000","0000000000000000"],
  shredwick: ["0000000000000000","0000333333300000","0000322222300000","0000322222300000","0111111111111100","0122222222222100","0124444444442100","0122222222222100","0111111111111100","0030303030303000","0030303030303000","0003030303030000","0003030303030000","0000303030300000","0000000000000000","0000000000000000"],
  sluice: ["0000000000000000","0000001111000000","0000012222100000","0011122222211000","0122222442222100","1222224444222210","1222244444422210","0111111441111100","0000000440000000","0000000440000000","0000000440000000","0000033333300000","0000322222230000","0000033333300000","0000000000000000","0000000000000000"],
  lapse: ["0000000000000000","0000011111100000","0001122222211000","0012222422222100","0122222422222210","0122222422222210","1222222444442221","1222222222222221","1222222222222221","0122223333222210","0122232222322210","0012322222232100","0001122222211000","0000011111100000","0000000000000000","0000000000000000"],
  cairn: ["0000000000000000","0000000110000000","0000001221000000","0000001331000000","0000011111100000","0000122222210000","0000123333210000","0001111111111000","0012222222222100","0012333333332100","0111111111111110","1222222222222221","1233334433333321","1222222222222221","0111111111111110","0000000000000000"],
  bulwark: ["0004000000004000","0011101111011100","0012101221012100","0012111221112100","0012222222222100","0012333443332100","0012334444332100","0012333443332100","0112222222222110","1222333333332221","1233344444433321","1233344444433321","1222333333332221","1222222222222221","0111111111111110","0000000000000000"],
  tapes: ["1111111111111111","1333133313331331","1343134313431341","1333133313331331","1111111111111111","1222222222222221","1111111111111111","1333133313331331","1323132313231321","1333133313331331","1111111111111111","1222222222222221","1111111111111111","1000000000000001","1000000000000001","1111111111111111"],
  dust: ["3333333333333333","3323333333332333","3332333333323333","3333333443333333","3333334443333333","3333333333333333","3233333333333323","3333333333333333","3333443333333333","3334433333323333","3333333333332333","3333333333333333","3323333333333333","3333333334433333","3333333344333333","3333333333333333"]
});
Object.assign(PAL, {
  gloam: ['#141414', '#3a4a6b', '#d7dbe4', '#ff4d6d'],
  shredwick: ['#141414', '#5b4a42', '#8c7b70', '#f2e3c6'],
  sluice: ['#141414', '#c8d6e8', '#f4f7fb', '#2f74b5'],
  lapse: ['#141414', '#f2e3c6', '#b8432f', '#1b2233'],
  cairn: ['#1b2233', '#6e7a8a', '#b9c2cf', '#ffd96a'],
  bulwark: ['#1b2233', '#4a5a74', '#c8d0dc', '#9ff0c8'],
  tapes: ['#1b2233', '#5b4a42', '#2f4f8a', '#ffd96a'],
  dust: ['#2a2523', '#3b3330', '#6e625a', '#4a403b'],
  recordsDark: ['#2a2523', '#3a4a6b', '#5b4a42', '#6e7a8a'],
  recordsBld: ['#1b2233', '#2f6e3e', '#a6d96a', '#ffd96a'],
  stacks: ['#1b2233', '#3a4a6b', '#6e7a8a', '#9ff0c8'],
  vault: ['#1b2233', '#4a1414', '#8c7b70', '#e58a5c'],
  vaultOk: ['#1b2233', '#2f4f8a', '#9fc4f0', '#9ff0c8'],
  offsite: ['#1b2233', '#5b3a26', '#a8703f', '#ffd96a'],
  restoreLab: ['#1b2233', '#2f4f8a', '#7fa2d6', '#ffd96a'],
  archDesk: ['#3b2418', '#7a4a2c', '#c98a54', '#f2e3c6'],
  cryptoDojo: ['#1b2233', '#2b1d16', '#7cc6c4', '#ff9f43'],
  rboard: ['#1b2233', '#2f6e3e', '#a6d96a', '#ffd96a'],
  odile: ['#1a1a2e', '#2b1d16', '#a8703f', '#2f4f8a'],
  nico: ['#1a1a2e', '#c0a040', '#f2c7a0', '#5b4a42'],
  hester: ['#1a1a2e', '#d7dbe4', '#f0c8a0', '#5a2a6e'],
  deshawn: ['#1a1a2e', '#141414', '#7a4a2c', '#b8432f'],
  leona: ['#1a1a2e', '#8a4b2f', '#f2c7a0', '#3a4a6b'],
  tobias: ['#1a1a2e', '#5b4a42', '#e0b088', '#7cc6c4'],
  margit: ['#1a1a2e', '#c8d0dc', '#f2c7a0', '#2f6e3e']
});
Object.assign(TILES, {
  'P': {spr: 'B', pal: 'recordsDark', solid: true},                // Records Hall building (hub); lit after the Vault Badge
  'L': {spr: 'K', pal: 'stacks', solid: true},                     // the stacks: department file servers
  'm': {spr: 'K', pal: 'vault', solid: true},                      // the backup appliance and its console (vault)
  'y': {spr: 'tapes', pal: 'tapes', solid: true},                  // the tape shelf (offline copies)
  '4': {spr: 'door', pal: 'offsite', solid: true},                 // the courier's door to the offsite store
  '5': {spr: 'pc', pal: 'restoreLab', solid: true, under: ','},    // restore lab benches (an isolated network)
  '6': {spr: 'counter', pal: 'archDesk', solid: true},             // the archivist's desk
  '7': {spr: 'pc', pal: 'cryptoDojo', solid: true, under: ','},    // Cryptography Dojo terminals
  '8': {spr: 'K', pal: 'rboard', solid: true},                     // Records Board racks
  '0': {spr: 'dust', pal: 'dust', grass: true}                     // unindexed corners of the stacks: trip alerts
});

/* ---------- Tools: the Cairn line (backup and recovery) ---------- */
// A new tool class. Recovery tools are strong against Impact techniques and threats aimed at backups. (game)
CLASSES.recovery = {label: 'Recovery', strong: ['Impact'], strongTags: ['backup'], weakTags: ['voice', 'recon'], strongLabel: 'Impact (encryption, destruction, inhibited recovery) and attacks on backups'};
Object.assign(TOOLS, {
  cairn: {name: 'Cairn', cls: 'recovery', sub: 'backup and recovery', spr: 'cairn', blurb: 'A pile of stones that marks the way back. Knows every copy you have, and which ones no one can delete.',
          abil: ['rpcheck', 'lockret', 'bkcut', 'labrestore']},
  bulwark: {name: 'Bulwark', cls: 'recovery', sub: 'recovery + clean points', spr: 'bulwark', blurb: 'Cairn walled in. It lines the evidence up against the restore points and finds the newest copy from before the attacker arrived.',
            abil: ['rpcheck', 'lockret', 'bkcut', 'cleanpt']}
});
Object.assign(ABIL, {
  rpcheck: {name: 'Check restore points', type: 'inv', cost: 2, ev: 22, desc: 'List the backups and snapshots for the affected system: which exist, which were deleted, when, and by which account.'},
  lockret: {name: 'Lock retention', type: 'con', cost: 2, dw: 20, ev: 4, desc: 'Put the backup copies under a retention lock, so no backup account, an administrator’s included, can delete them before they expire. Lock down the appliance’s own management and hardware consoles too: the lock is only as strong as the box it runs on.'},
  bkcut: {name: 'Cut backup access', type: 'con', cost: 2, dw: 24, ev: 4, disrupt: 1, desc: 'Block the affected hosts and accounts from the backup network while you work. Tonight’s jobs for those hosts won’t run.'},
  labrestore: {name: 'Restore to the lab', type: 'inv', cost: 3, ev: 26, desc: 'Restore a copy into the isolated lab network and compare it with production, without touching production.'},
  cleanpt: {name: 'Find the clean point', type: 'inv', cost: 2, ev: 28, desc: 'Line up the evidence (the earliest sign of the attacker on each system) with the restore points, and pick the newest copy from before it.'}
});

/* ---------- Map: Records Hall, the Records Board, and a building on the plaza ---------- */
// The stacks (file servers) are north-west, the backup vault north-east (appliance, tape shelf, the offsite door),
// the restore lab south-west, the archivist's office in the middle, the Cryptography Dojo south-east.
Object.assign(MAPS, {
  records: {
    name: 'Records Hall',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w0LL0LL0LL0,,,,,,,,w,mm,,yyy4w",
      "w0LL0LL0LL0,,,,,,,,w,,,,,,,,,w",
      "w0LL0LL0LL0,,,,,,,,,,,,,,,,,,w",
      "w0000000000,,,,,,,,wwwwwwwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwww,wwwww,,,,,wwwwww,wwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,5,5,5,,,,,,6,,,,,,,7,7,7,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,Y,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwEwwwwwwwwwwwwwww"
    ],
    doors: {'14,15': {to: 'hub', x: 15, y: 18, dir: 'down'}, '29,7': {to: 'rboard', x: 9, y: 9, dir: 'up'}}
  },
  rboard: {
    name: 'Records Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "w88,,,,,,,,,,,,,,88w",
      "w88,,,,,,,,,,,,,,88w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'records', x: 28, y: 7, dir: 'left'}}
  }
});
// The one change to earlier data: a Records Hall building in the south of the plaza, between the Identity Board
// and the Dojo, out among the cabling. Its door opens with the Lantern Badge.
MAPS.hub.rows[15] = MAPS.hub.rows[15].slice(0, 13) + 'PPPP' + MAPS.hub.rows[15].slice(17);
MAPS.hub.rows[16] = MAPS.hub.rows[16].slice(0, 13) + 'PPPP' + MAPS.hub.rows[16].slice(17);
MAPS.hub.rows[17] = MAPS.hub.rows[17].slice(0, 13) + 'PPDP' + MAPS.hub.rows[17].slice(17);
MAPS.hub.doors['15,17'] = {to: 'records', x: 14, y: 14, dir: 'up',
  get locked() { return (typeof G !== 'undefined' && G && G.f.mkLantern) ? undefined : 'Records Hall. A note on the door: “Staff with a Lantern Badge only.”'; }};

const RH_MAPS = ['records', 'rboard'];
const RH_HOSTS = ['FS-01 · file server', 'FS-02 · file server', 'FS-03 · old file server', 'DB-01 · records database', 'BKP-01 · backup server'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'odile', name: 'Odile Brennan', role: 'records and infrastructure lead', map: 'records', x: 14, y: 6, dir: 'down', pal: 'odile'},
  {id: 'nico', name: 'Nico Varga', role: 'backup administrator', map: 'records', x: 24, y: 2, dir: 'down', pal: 'nico'},
  {id: 'hester', name: 'Hester Quayle', role: 'town archivist', map: 'records', x: 16, y: 11, dir: 'left', pal: 'hester'},
  {id: 'deshawn', name: 'Deshawn Pruitt', role: 'permits manager', map: 'records', x: 5, y: 13, dir: 'up', pal: 'deshawn', cond: G => !!G.f.rhTest},
  {id: 'leona', name: 'Leona Ferraro', role: 'finance director', map: 'records', x: 18, y: 7, dir: 'left', pal: 'leona', cond: G => !!G.f.rhDrill1},
  {id: 'tobias', name: 'Tobias Lund', role: 'cryptography coach', map: 'records', x: 27, y: 12, dir: 'left', pal: 'tobias'},
  {id: 'margit', name: 'Margit Halloran', role: 'recovery lead', map: 'rboard', x: 9, y: 2, dir: 'down', pal: 'margit'}
);
const RH_NPC_IDS = ['odile', 'nico', 'hester', 'deshawn', 'leona', 'tobias', 'margit'];

/* ---------- ATT&CK techniques met in Records Hall (verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20.0) ---------- */
// T1490 Inhibit System Recovery and T1486 Data Encrypted for Impact are already in the table (Clerks' Row).
Object.assign(TECH, {
  'T1485': {name: 'Data Destruction', tactic: ['Impact'], desc: 'Destroying data and files, on one system or many, so they can’t be used or recovered, often by overwriting them rather than just deleting them. Backups are an obvious target.'},
  'T1567.002': {name: 'Exfiltration Over Web Service: Exfiltration to Cloud Storage', tactic: ['Exfiltration'], desc: 'Sending stolen data to a cloud storage service instead of over the attacker’s own command channel. Common before ransomware encrypts, so the attacker can threaten to publish as well (double extortion).'},
  'T1560.001': {name: 'Archive Collected Data: Archive via Utility', tactic: ['Collection'], desc: 'Packing collected files with an ordinary compression or archiving utility, often with a password, before taking them out.'}
});

/* ---------- Threats (wild alerts) ---------- */
Object.assign(THREATS, {
  gloam: {name: 'Gloam', tech: 'T1486', spr: 'gloam', pal: 'gloam', tags: ['files'], bucket: 'other', district: 'records'},
  shredwick: {name: 'Shredwick', tech: 'T1485', spr: 'shredwick', pal: 'shredwick', tags: ['files', 'backup'], bucket: 'other', district: 'records'},
  sluice: {name: 'Sluice', tech: 'T1567.002', spr: 'sluice', pal: 'sluice', tags: ['files'], bucket: 'other', district: 'records'},
  lapse: {name: 'Lapse', tech: 'T1490', spr: 'lapse', pal: 'lapse', tags: ['backup', 'host'], bucket: 'other', district: 'records'}
});
// (game) base weights for the Records Hall threats; they only enter the mix once you reach Records Hall.
MAL_WEIGHTS.push({t: 'gloam', w: 3}, {t: 'shredwick', w: 2}, {t: 'sluice', w: 3}, {t: 'lapse', w: 2});
const RH_HOME = ['gloam', 'shredwick', 'sluice', 'lapse'];
// Threats the Vault Badge halves: anything that destroys data or the ways back (T1490, T1485). (game)
const RH_VAULT_TECHS = ['T1490', 'T1485'];

Object.assign(ALERTS, {
  gloam: {
    rule: 'Mass file rename spike on a file share',
    mal: {clues: ['4,800 files on \\\\FS-03\\Finance renamed in six minutes, each with a new extension.', 'The writer is a domain admin account, from a server that never touches that share.', 'Opened in the lab, a renamed file is unreadable noise, and every volume shadow copy on FS-03 was deleted two minutes before.'],
          truth: 'Data Encrypted for Impact: ransomware, and it started by removing the ways back.',
          resp: [{label: 'Isolate FS-03 and the writing server at the switch, disable the account, protect the backup copies, preserve evidence, hunt for the same tool elsewhere', good: true},
                 {label: 'Restore the folder from last night’s backup, confirm the files open, and close', good: false, why: 'The attacker is still in, with an admin account. Contain first, then restore from a copy you know is clean.'},
                 {label: 'Shut down every server in town until the tool is found', good: false, disrupt: 2, why: 'Isolating at the switch contains it. Shutting everything down stops the town and throws away the memory evidence.'}]},
    benign: {clues: ['The writer is svc-dmsimport, from DMS-01, the new document system’s server.', 'A change ticket covers tonight’s import of the Finance archive.', 'Renamed files open normally; the shadow copies are untouched.'],
             truth: 'Benign: the records migration renaming files it has imported. The volume looks like ransomware; the writer and the files say otherwise.'},
    fp: {clues: ['The “renames” are the scanner’s temporary files: .tmp to .pdf as each scan finishes.', 'Same account, same folder, every weekday.', 'The rule counts every rename as suspicious.'],
         truth: 'False positive: the scanner finishing its own files.'}
  },
  shredwick: {
    rule: 'Bulk deletion on a file share',
    mal: {clues: ['Files on the old NAS backup share are being overwritten, then deleted.', 'The account is the NAS’s local admin, whose password was the same as a domain admin’s.', 'The retention-locked copies on the appliance refuse every delete; the NAS copies don’t.'],
          truth: 'Data Destruction aimed at the backups, the way back.',
          resp: [{label: 'Cut the NAS off; give it its own admin password with MFA; reset the domain admin that shared it and hunt for its use; confirm the locked and offline copies; rebuild the share from them', good: true},
                 {label: 'Restore the NAS share from its own snapshots tonight, give the NAS a new long admin password, reset the domain admin too, and close once the department confirms every file is back where it belongs', good: false, why: 'Those copies are the ones being destroyed. Restore from copies the attacker can’t reach.'},
                 {label: 'Switch off the deletion alerts for the NAS: they’re too noisy to work through', good: false, why: 'That alert is the only reason you know.'}]},
    benign: {clues: ['The deletions follow the town’s records retention schedule: files past their keep-until date.', 'Hester signed off the disposal list last week.', 'The run is the scheduled disposal job, at its usual time.'],
             truth: 'Benign: approved disposal under the retention schedule.'},
    fp: {clues: ['The “deletions” are a sync tool moving files to a new folder.', 'Every deleted file reappears one folder over.', 'The rule sees the delete half of a move.'],
         truth: 'False positive: moves counted as deletions.'}
  },
  sluice: {
    rule: 'Large upload to cloud storage',
    mal: {clues: ['9 GB left FS-03 for a cloud storage service the town has never used, between 03:41 and 03:55.', 'A compression utility packed the files into password-protected parts first.', 'The account is a help-desk admin signed in from another server at 03:30.'],
          truth: 'Exfiltration to Cloud Storage: data taken before encryption, so the attacker can threaten to publish it.',
          resp: [{label: 'Block the destination, isolate the host, disable the account, preserve the logs, and scope exactly which files left', good: true},
                 {label: 'Block the destination at the firewall and close: nothing more can leave, and the files that already left can’t be called back anyway', good: false, why: 'The account and the host are still the attacker’s, and you don’t yet know what left.'},
                 {label: 'Wait for the ransom note before acting: until then it could be a backup tool or a sync client, and acting early tips the attacker off', good: false, why: 'Data theft usually comes before encryption. This is the warning.'}]},
    benign: {clues: ['Hester is copying the 1960s council minutes to the regional archive’s storage.', 'The transfer is ticketed and the destination is on the approved list.', 'It runs under her own account, in working hours, file by file.'],
             truth: 'Benign: the archivist’s approved migration to the regional archive.'},
    fp: {clues: ['The “upload” is the backup appliance replicating to its own second site.', 'The destination is ours, on the firewall’s list.', 'The rule doesn’t know the backup network.'],
         truth: 'False positive: our own backup replication.'}
  },
  lapse: {
    rule: 'Backup job failures',
    mal: {clues: ['Every backup job for FS-03 has failed since 04:30: the backup agent’s service on FS-03 was stopped at 04:29.', 'At 04:28 wbadmin deleted the Windows backup catalog on FS-03, run by a domain admin account.', 'A minute later the same account tried to sign in to the backup console.'],
          truth: 'Inhibit System Recovery: removing the backups and catalogs that let you restore. Ransomware often comes next.',
          resp: [{label: 'Isolate FS-03, disable the account, lock retention on its copies, check the offline copy, hunt for the encryptor before it runs', good: true},
                 {label: 'Rerun the failed backup jobs now so tonight’s copies exist, check they finish with Success, and close the alert first thing in the morning', good: false, why: 'The jobs failed because someone removed the way back on purpose. They’re still in.'},
                 {label: 'Watch FS-03 closely tonight and act only if files start changing, so nobody is disturbed over what may only be a scheduling fault', good: false, why: 'This is the warning. Act now.'}]},
    benign: {clues: ['The appliance’s disk is 100% full.', 'Every job that wrote after 01:40 failed with “no space”.', 'Nico’s dashboard warned about space last week.'],
             truth: 'Benign: a full disk. Real, needs fixing today, and not an attack. (An expired service-account password gives the same symptom.)'},
    fp: {clues: ['The “failures” are jobs cancelled by the maintenance window.', 'They restarted and finished an hour later.', 'The rule counts a cancellation as a failure.'],
         truth: 'False positive: cancelled and rerun jobs.'}
  }
});
Object.assign(ALERT_CHAINS, {
  gloam: ['A second share starts being renamed.', 'Ransom notes appear in every folder.'],
  shredwick: ['The next backup folder is overwritten.', 'The NAS’s own snapshots are deleted.'],
  sluice: ['A second batch starts uploading.', 'The upload moves on to the HR share.'],
  lapse: ['The backup catalog on a second server disappears.', 'Files start being renamed on FS-03.']
});

/* ---------- Morning briefing items (Records Hall) ---------- */
const RH_BRIEFS = [
  {t: 'gloam', text: 'Ransomware crews are deploying encryptors through group policy to every server at once.', act: 'Alert on new group policies that create scheduled tasks'},
  {t: 'shredwick', text: 'Attackers are wiping backup shares reachable with reused admin passwords.', act: 'Give every backup device its own admin password and MFA'},
  {t: 'sluice', text: 'Data is being taken to cloud storage before encryption, for double extortion.', act: 'Alert on large uploads to storage services we don’t use'},
  {t: 'lapse', text: 'Backup catalogs and shadow copies are being deleted hours before encryption.', act: 'Alert on backup deletions and catalog changes, success or not'}
];

/* ---------- Fieldwork: restore tests, the business impact analysis, copies, credentials ---------- */
// The first timed restore tests, into the isolated restore lab (game). Hours are game hours.
const RH_TESTS = [
  {sys: 'fs', name: 'FS-01 file server (the whole server, every share)', hours: 6, ok: true, note: 'Files open; the planning team checked a sample against production. (One folder would have proved the folder, not the server’s recovery time.)'},
  {sys: 'db', name: 'DB-01 records database (permits)', hours: 5.5, ok: true, note: 'Restored and started; Deshawn checked twenty permits against the paper files.'},
  {sys: 'app', name: 'APP-01 permits portal', hours: 2.5, ok: false, note: 'Restored, but it won’t start: its settings and licence file live on a second disk the job never selected.'}
];
const RH_RETEST = {sys: 'app', name: 'APP-01 permits portal (retest, second disk added)', hours: 2.5, ok: true, note: 'Starts; Deshawn issued a test permit in the lab.'};
// The critical list from the business impact analysis. The last two aren't critical.
const RH_SERVICES = [
  {id: 'db', name: 'Records database (permits, deeds, licences)', crit: true, owner: 'Deshawn: “Inspections stop after a day without it.”'},
  {id: 'app', name: 'Permits portal (residents apply online)', crit: true, owner: 'Deshawn: “Residents can apply on paper for a day or two. Not a week.”'},
  {id: 'fs', name: 'Department file shares (the stacks)', crit: true, owner: 'Odile: “Every department works from them. Two days, at most.”'},
  {id: 'dir', name: 'Directory (staff sign-in, identity)', crit: true, owner: 'Nico: “Nothing above signs anyone in without it.”'},
  {id: 'dns', name: 'Name service (DNS)', crit: true, owner: 'Nico: “Nothing finds anything without it.”'},
  {id: 'intranet', name: 'The staff intranet news page', crit: false, owner: 'Odile: “Nobody would notice for a week.”'},
  {id: 'scanarc', name: 'The 1990s scanned-image archive', crit: false, owner: 'Hester: “Researchers can wait. It’s read-only and on tape anyway.”'}
];
// Recovery objectives agreed with the owners (game hours). RTO: how long until it must be back. RPO: how much
// data (in hours of work) can be lost. MTD is the owner's limit before real harm; RTO must be shorter.
const RH_OBJ = {
  dir: {rto: 8, rpo: 24, mtd: 12}, dns: {rto: 8, rpo: 24, mtd: 12}, db: {rto: 16, rpo: 12, mtd: 24},
  app: {rto: 24, rpo: 24, mtd: 48}, fs: {rto: 48, rpo: 24, mtd: 72}
};
const RH_SYS_ORDER = ['dir', 'dns', 'db', 'app', 'fs'];
const RH_SYS_NAME = {dir: 'DIR-01 directory', dns: 'DNS-01 name service', db: 'DB-01 records database', app: 'APP-01 permits portal', fs: 'FS-01/FS-02 file shares'};

/* ---------- The restore-order mini-game (played during the ransomware incident) ---------- */
// Each system: what it needs first, how long each way of restoring takes (game hours), and the restore points.
// "at": hours of data lost (restore point to the start of encryption). "tainted": the copy holds something the
// attacker planted, so the restored system is reinfected (game rule). Nothing in the labels says which is which:
// the player reads the evidence list.
const RH_RESTORE = {
  dir: {deps: [], opts: [
    {k: 'last', label: 'Whole server from last night (Day {B} 01:00), the newest copy', hrs: 4, atH: 1.7, tainted: true,
     why: 'Last night’s copy of the directory still holds svc-scanbak, adm-bk2 and the encryptor’s group policy. All three came back with it.'},
    {k: 'mid', label: 'Whole server from Day {R} 01:00, the day you arrived', hrs: 4, atD: 'R', tainted: true,
     why: 'svc-scanbak and adm-bk2 were created on Day {E} at 02:31 and 02:33. Every copy since then holds them.'},
    {k: 'clean', label: 'Whole server from Day {E} 01:00', hrs: 4, atD: 'E', good: true,
     why: 'The newest copy from before the earliest known compromise (Day {E} 02:12). Account changes since then are re-entered from the tickets: an agreed exception to the directory’s RPO. Every privileged and service password is reset again once it is back, because this copy holds the old ones (and hd-admin, disabled since, comes back enabled: disable it again). The krbtgt account’s password is reset twice, letting the first reset replicate before the second, so no Kerberos ticket forged with the old key still works. Taken barely an hour before the first known sign, it is checked in the isolated lab for the attacker’s accounts, policies, tasks and tools before it goes live.'}]},
  dns: {deps: ['dir'], opts: [
    {k: 'last', label: 'Whole server from last night (Day {B} 01:00), the newest copy', hrs: 1, atH: 1.7, tainted: true,
     why: 'The group policy, created at 23:52 the night before, reached the server at its next refresh, before the 01:00 backup: last night’s whole-server copy carries the scheduled task, set to run at start-up, and it ran again. (game)'},
    {k: 'gold', label: 'Rebuild from the golden image, plus last night’s zone data', hrs: 2, atH: 1.7, good: true,
     why: 'A known-good build, plus only the data. Nothing the attacker planted in the system comes back.'},
    {k: 'old', label: 'Whole server from Day {E} 01:00', hrs: 1, atD: 'E',
     why: 'Clean, but every DNS change since Day {E} is lost: far past its RPO, when a clean rebuild with last night’s data loses almost nothing.'}]},
  db: {deps: ['dir', 'dns'], opts: [
    {k: 'last', label: 'Whole server from last night (Day {B} 01:00), the newest copy', hrs: 5, atH: 1.7, tainted: true,
     why: 'The scheduled task came back with the server and ran again.'},
    {k: 'gold', label: 'Rebuild from the golden image, then restore the database from last night', hrs: 6, atH: 1.7, good: true,
     why: 'Clean system, the newest data, and Deshawn checks a sample of permits before anyone uses it.'},
    {k: 'old', label: 'Whole server from Day {E} 01:00', hrs: 5, atD: 'E',
     why: 'Clean, but days of permits are lost, far past the 12-hour RPO you agreed with Deshawn.'}]},
  app: {deps: ['db'], opts: [
    {k: 'last', label: 'Whole server from last night (Day {B} 01:00), the newest copy', hrs: 2, atH: 1.7, tainted: true,
     why: 'The scheduled task came back with the server and ran again.'},
    {k: 'gold', label: 'Rebuild from the golden image, plus last night’s settings and files', hrs: 3, atH: 1.7, good: true,
     why: 'Clean system and both of its disks: the restore test found the second one.'},
    {k: 'old', label: 'Whole server from Day {E} 01:00', hrs: 2, atD: 'E',
     why: 'Clean, but days of applications are lost.'}]},
  fs: {deps: ['dir', 'dns'], opts: [
    {k: 'last', label: 'Whole servers from last night (Day {B} 01:00), the newest copies', hrs: 11, atH: 1.7, tainted: true,
     why: 'The scheduled task came back with both servers and encrypted them again.'},
    {k: 'gold', label: 'Rebuild from the golden image, then restore the shares from last night', hrs: 12, atH: 1.7, good: true,
     why: 'Clean servers, and every file as it was at 01:00, an hour and forty minutes before encryption began.'},
    {k: 'old', label: 'Whole servers from Day {E} 01:00', hrs: 11, atD: 'E',
     why: 'Clean, but every department loses days of work.'}]}
};
const RH_RESTORE_BUDGET = 48;     // game hours of restore-crew time before the vendor's emergency team takes over (game)
const RH_DEP_WASTE = 1;           // hours lost when a system is restored before what it needs (game)
const RH_REINFECT_WASTE = 1;      // extra hours to spot and clean a reinfection (game)

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real-world kinds of evidence) ---------- */
const RH_DRILLS = {
  rename: {
    id: 'rename', title: 'Twelve thousand renamed files', budget: 2,
    intro: '<p>Overnight the file-share rule fired on FS-02 (game): thousands of files in the Planning share renamed in under an hour, each with a new extension. Odile wants to know before nine whether she has a ransomware incident or a busy night.</p>',
    artefact: '<pre class="art">File-share alert · \\\\FS-02\\Planning · Day {D} 01:10–01:48 (game data)\n' +
      'Renamed     12,406 files   e.g. minutes-1987-03.pdf → minutes-1987-03.pdf.migrated\n' +
      'Rate        about 326 a minute\n' +
      'Rule        more than 500 renames in 10 minutes on one share</pre>' +
      '<p class="small">A rename spike says many files changed name quickly. Ransomware does that. So does a migration, a sync tool or a clean-up script.</p>',
    question: 'Ransomware, or something the town is doing on purpose?',
    sources: [
      {id: 'audit', name: 'File-server audit log', qs: [
        {q: 'Which account, process and host renamed the files?', kind: 'focus', key: true,
         res: ['All 12,406 renames: account svc-dmsimport, process dmsimport.exe, from DMS-01 (the new document system’s server)', 'First rename 01:10:04, last 01:48:31; nothing else wrote to the share in that time', 'CHG-5120 (game): “Document system import, phase 2: Planning share, Day {D} 01:00–03:00, as svc-dmsimport from DMS-01”']},
        {q: 'Every file event on FS-02 overnight', kind: 'broad', rows: 41870,
         wall: ['{t}  READ    \\\\FS-02\\Planning\\minutes-19{n}.pdf   svc-dmsimport', '{t}  RENAME  …\\minutes-19{n}.pdf → .pdf.migrated   svc-dmsimport', '{t}  READ    \\\\FS-02\\Planning\\Maps\\ward-{n}.tif   svc-backup', '{t}  WRITE   \\\\FS-02\\Planning\\~$draft-{n}.docx   j.osei']}]},
      {id: 'vss', name: 'Shadow copies, backups and process history, FS-02 and the writing host', qs: [
        {q: 'Were the ways back touched, on FS-02 or on the host that wrote the files?', kind: 'focus', key: true,
         res: ['14 shadow copies on the Planning volume, the newest Day {D} 00:00; none deleted overnight', 'No vssadmin, wmic or wbadmin runs on FS-02 or on DMS-01 in the last 30 days; on DMS-01, dmsimport.exe is the vendor-signed installed program, started by its scheduled job', 'Last night’s backup of FS-02 ran at 00:30 and read its usual amount', '(Ransomware usually removes the ways back on the machines it runs on: ATT&CK T1490. When it encrypts a share over the network from another host, the file server’s own shadow copies often survive, so check the writing host too.)']}]},
      {id: 'count', name: 'The rename counter', qs: [
        {q: 'How many files changed, and how fast?', kind: 'trap',
         res: ['12,406 files in 38 minutes, about 326 a minute.', '(Volume and speed fit ransomware and fit any bulk migration. They don’t tell you which.)']}]},
      {id: 'ext', name: 'Extension lookup', qs: [
        {q: 'Is “.migrated” a known ransomware extension?', kind: 'trap',
         res: ['It isn’t on any list you have.', '(Ransomware can use any extension, harmless-looking ones included. An unfamiliar name proves nothing, and neither does a familiar one.)']}]},
      {id: 'file', name: 'Open a renamed file in the lab', qs: [
        {q: 'Is minutes-1987-03.pdf.migrated readable?', kind: 'focus',
         res: ['It opens as an ordinary PDF: the March 1987 minutes. Its hash matches the copy now in the document system.', '(Useful: encrypted files don’t open. But one file is one file; the writer and the shadow copies speak for all 12,406.)']}]},
      {id: 'hester', name: 'Ask Hester (archivist)', qs: [
        {q: 'Was anything running on the Planning share last night?', kind: 'focus',
         res: ['Hester: “The import, phase 2. Nico scheduled it. The tool renames each file once it’s safely in the new system.”', '(A good lead. Memory isn’t a record: the audit log and the change ticket are.)']}]}
    ],
    ai: {everything: {text: '12,406 files renamed in 38 minutes is consistent with ransomware. Recommend isolating FS-02 immediately.', wrong: true,
                      reveal: 'Tally matched the volume and speed to ransomware and stopped there. It never asked who wrote the files or whether the shadow copies were touched, and isolating FS-02 would have stopped the whole Planning department for a migration. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'Which account and host renamed the files on FS-02 last night?', text: 'svc-dmsimport, from DMS-01: every one of the 12,406.'}},
    verdicts: [
      {label: 'The approved records migration: its own service account, from its own server, in its change window, shadow copies untouched', good: true, why: 'The audit log names svc-dmsimport on DMS-01 for every rename, CHG-5120 covers it, and nothing touched the ways back.'},
      {label: 'Ransomware: twelve thousand files renamed in under an hour, all with the same new extension, which is what mass encryption looks like', why: 'Volume and speed fit both. The writer and the shadow copies decide.'},
      {label: 'Ransomware: an extension nobody here has ever seen before, appended to every single file in the department’s shared folder at once', why: 'Extensions are chosen by whoever renames the files. They decide nothing.'}],
    reasons: [
      {label: 'Every rename came from the migration’s service account on DMS-01 inside its change window, and nothing touched the ways back on FS-02 or DMS-01 (ransomware usually removes them)', good: true, why: 'Who did it, from where, under what approval, and whether the ways back were touched, from two independent records.'},
      {label: 'The new extension sounds like a document-management format rather than anything a ransomware crew would choose, and the renamed files still carry their original names in front of it', why: 'An attacker can choose any extension.'},
      {label: 'Hester said a migration was running this week, and the renames match the kind of change she described', why: 'Memory isn’t a record. The audit log and the ticket are.'}],
    alts: [
      {label: 'Ransomware using a harmless-looking extension', good: true, why: 'Ruled out: the writer is the migration’s service account on DMS-01, the shadow copies are intact, and a renamed file opens normally.'},
      {label: 'An attacker using the migration’s service account', good: true, why: 'Ruled out: it signed in only from DMS-01, only inside the change window, and the tool’s own job log lists the same 12,406 files.'},
      {label: 'A disk or controller fault on FS-02 renaming files as it rewrites them', why: 'Disks don’t append extensions.'},
      {label: 'The alert rule is broken and fired on an ordinary night of file changes', why: 'It fired correctly on a real bulk change.'}],
    path: '<p>A rename spike is decided by <b>who wrote the files</b> (the file-server audit log: account, process and host, matched to a change ticket) and by <b>whether the ways back were touched</b> (shadow copies and backup catalogs, on the file server and on the host that did the writing: ransomware usually deletes them where it runs). The count and the extension are the two things every rename spike has, so they can’t tell one from another.</p>',
    response: ['Close it as the approved migration, and record why', 'Tune the rule narrowly: an exception for svc-dmsimport from DMS-01 inside approved change windows only, never for the account everywhere', 'Keep alerting on shadow-copy and catalog deletion, and on mass renames by any other account', 'Ask for migrations to be announced: change tickets copied to the security queue'],
    techs: ['T1486', 'T1490'], acts: ['renamecheck']
  },
  shrink: {
    id: 'shrink', title: 'A backup that succeeded', budget: 2,
    intro: '<p>Nico’s morning report (game): last night’s backup of FS-01 says Success. It also says 41 GB, where FS-01 is normally about 2.3 TB. Data lost, a deduplication change, or someone tampering with the job?</p>',
    artefact: '<pre class="art">Backup job FS-01-nightly · Day {D} 01:00–01:22 (game data)\n' +
      'Status        Success · warnings 0 · errors 0\n' +
      'Data read     41 GB      (7-night average 2.31 TB; a full every night)\n' +
      'Repository    BKP-01 appliance, retention-locked copy</pre>' +
      '<p class="small">“Success” means the job finished what it was told to do. It doesn’t say whether it was told to do the right thing.</p>',
    question: 'Why is last night’s backup of FS-01 so small?',
    sources: [
      {id: 'job', name: 'Backup job log (detail)', qs: [
        {q: 'What did the job select, process, skip and exclude?', kind: 'focus', key: true,
         res: ['Selection list: FS-01 volume E: (unchanged since the job was set up on Day {U})', 'Processed 61,204 files, 41 GB · skipped 0 · excluded 0 · errors 0', 'FS-01 volumes now: E: 41 GB used · F: 2.27 TB used, created Day {D-1} 16:30, not in the selection list']}]},
      {id: 'audit', name: 'Backup console audit log', qs: [
        {q: 'Who changed the job or the backup settings, and when?', kind: 'focus', key: true,
         res: ['No change to FS-01-nightly since Day {U} (created by nico.v)', 'Sign-ins this week: only the two backup admin accounts, each with MFA', 'No deletions, no retention changes, no new admins']},
        {q: 'Every console event this month', kind: 'broad', rows: 6120,
         wall: ['{t}  job.run      FS-0{i}-nightly  scheduler', '{t}  login.ok     bkadm-nico  MFA', '{t}  job.verify   DB-01-nightly  scheduler', '{t}  report.sent  morning summary']}]},
      {id: 'dash', name: 'Storage dashboard', qs: [
        {q: 'Total repository use and the deduplication ratio', kind: 'trap',
         res: ['Repository 61.2 TB used (down 0.1%) · deduplication 4.1 : 1 (unchanged).', '(Totals across every job hide one job’s drop, and deduplication changes what is stored, not what a job reads. Neither tells you what this job backed up.)']}]},
      {id: 'chg', name: 'Change records', qs: [
        {q: 'Any change to FS-01 this week?', kind: 'focus',
         res: ['CHG-5097 (game), Day {D-1} 16:30: the storage team moved the department shares from E: to a new volume, F:, on FS-01.', 'The ticket has no step for the backup job. (Useful: it explains why. The job log is what shows the gap.)']}]},
      {id: 'nico', name: 'Ask Nico', qs: [
        {q: 'Did you change the job?', kind: 'focus',
         res: ['Nico: “No. I haven’t touched it since I set it up.”', '(Probably true. The console’s audit log is what proves it.)']}]}
    ],
    ai: {everything: {text: 'The FS-01 backup completed successfully with 0 warnings. The size difference is likely due to deduplication. No action needed.', wrong: true,
                      reveal: 'Tally read “Success” as “protected” and guessed at deduplication. The job log shows it backed up the wrong volume: the data moved to F:, which the job never selects. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'Which FS-01 volumes are in the job’s selection list, and how much is on each?', text: 'Only E: (41 GB used). F: holds 2.27 TB and isn’t selected.'}},
    verdicts: [
      {label: 'A coverage gap: the shares moved to a new volume the job never selects, so it backed up the leftovers', good: true, why: 'The job read everything on E:, skipped nothing, and nobody changed it; the data is on F:.'},
      {label: 'Tampering: someone with console access shrank the job’s selection so the shares are left out', why: 'The console audit log shows no change, and only the backup admins signed in.'},
      {label: 'Deduplication: the appliance stores only changed blocks, so 41 GB is normal and the data is still protected', why: 'The job read 41 GB. Deduplication can’t make it read less than it was given.'},
      {label: 'Data loss: FS-01’s files are gone', why: 'F: holds 2.27 TB, and the departments are working normally.'}],
    reasons: [
      {label: 'The job log shows it read only E:, now nearly empty, skipping nothing; the console audit shows no change; the data now lives on F:, which it never selects', good: true, why: 'What the job did, and who changed it, from the two records that say so.'},
      {label: 'The job says Success, and a job that reads everything it was given without one error or skipped file has done exactly the work it was set up to do, so the backup is fine', why: 'It succeeded at the wrong thing.'},
      {label: 'The repository total barely moved overnight, so whatever the job left out can’t be very much data', why: 'Totals hide one job’s drop.'}],
    alts: [
      {label: 'An attacker edited the job to leave the shares out', good: true, why: 'Ruled out: no change to the job since Day {U}, and only the two backup admins signed in, with MFA.'},
      {label: 'The files were deleted from FS-01', good: true, why: 'Ruled out: F: holds 2.27 TB and the departments are working from it.'},
      {label: 'Deduplication improved overnight and squeezed the same data into 41 GB', why: 'The job read 41 GB: that is before deduplication.'},
      {label: 'The appliance is faulty and stopped reading partway through the job', why: 'Every other job read its usual amount.'}],
    path: '<p>A small “successful” backup is a question for the <b>job log’s detail</b> (what was selected, processed, skipped and excluded) and the <b>backup console’s audit log</b> (who changed the job or the settings, and when). The storage dashboard’s totals and deduplication ratio describe the whole repository, not one job. Success means the job did what it was told; a restore test is what proves it was told the right thing.</p>',
    response: ['Protect the whole of FS-01 (every volume, new ones included) with written exclusions instead of a list of drive letters, and run a full backup today', 'Restore a sample from the new job into the lab', 'Alert when any job’s size moves far from its average, success or not', 'Add “check the backups” to the storage team’s change checklist', 'Until today’s full backup finishes, the newest copy of the shares is from Day {D-1} 01:00: tell the departments, and keep that copy'],
    techs: ['T1490'], acts: ['sizealert']
  },
  stolen: {
    id: 'stolen', title: 'Was anything taken?', budget: 3,
    intro: '<p>At 02:21 last night the endpoint protection on PLAN-LT-04, a planner’s laptop, stopped a program encrypting files (game). 312 files were encrypted before it was stopped. A ransom note on the desktop says: “We have 200 GB of your town’s files. Pay, or we publish.” By eight, a forum post was claiming the town’s data was for sale.</p>',
    artefact: '<pre class="art">PLAN-LT-04 · Day {D} (game data)\n' +
      '02:19  encryptor started   (blocked 02:21; 312 files encrypted, the laptop isolated)\n' +
      '02:21  README-RESTORE.txt  “200 GB … all departments … pay or we publish”\n' +
      '08:05  forum post          “townhall.example data for sale”, no sample</pre>' +
      '<p class="small">Many ransomware crews steal data before they encrypt, so they can threaten to publish it as well. Whether this crew did is a question for your own records, not for theirs.</p>',
    question: 'Was data stolen before the encryption, and how much?',
    sources: [
      {id: 'net', name: 'Firewall flow records', qs: [
        {q: 'Outbound volume to destinations the town has never used, 00:00–03:00, by host', kind: 'focus', key: true,
         res: ['PLAN-LT-04 → 198.51.100.77 (a cloud storage service the town doesn’t use, named by its DNS lookup and TLS server name), HTTPS, 02:06–02:17: 3.8 GB out', 'No other host sent more than 50 MB to a new destination overnight', 'FS-02 → PLAN-LT-04 (file sharing, inside the network), 01:40–02:01: 3.9 GB read']},
        {q: 'Every flow through the firewall overnight', kind: 'broad', rows: 88412,
         wall: ['{t}  10.20.4.{n} → 192.0.2.10:443   12 KB  (update service)', '{t}  10.20.1.{n} → 10.20.9.5:445   (file sharing)', '{t}  10.20.6.{n} → 198.51.100.12:443  40 KB', '{t}  10.20.2.{n} → 10.20.9.30:53  (DNS)']}]},
      {id: 'edr', name: 'Endpoint history, PLAN-LT-04', qs: [
        {q: 'What ran on PLAN-LT-04 before the encryptor, and under which account?', kind: 'focus', key: true,
         res: ['01:31  hd-admin, a help-desk admin account, signs in remotely from SCAN-01, the document scanning server', '01:40–02:01  files copied from \\\\FS-02\\Planning to a temp folder; 02:03 a portable compression utility packs them into password-protected 500 MB parts', '02:06  a sync command-line tool uploads the parts; 02:18 the parts are deleted; 02:19 the encryptor starts']}]},
      {id: 'fs', name: 'File-server audit log, FS-02', qs: [
        {q: 'Which files did hd-admin read on FS-02 last night?', kind: 'focus',
         res: ['01:40–02:01: \\\\FS-02\\Planning\\Applications 2024–2026: 3.9 GB, 2,640 files (planning applications: names, addresses, drawings)', 'No reads by hd-admin on any other share', '(Useful for scoping exactly what left. The flow records and the endpoint history are what show it left.)']}]},
      {id: 'note', name: 'The ransom note', qs: [
        {q: 'What does the note say was taken?', kind: 'trap',
         res: ['“200 GB of all departments’ files.”', '(A ransom note is the attacker’s sales pitch. It proves nothing about what left.)']}]},
      {id: 'forum', name: 'The forum rumour', qs: [
        {q: 'Is the town’s data on the leak site?', kind: 'trap',
         res: ['A post says “townhall.example data for sale”, with no sample.', '(Rumours aren’t evidence. Posts can be bluffs, or old data. Check your own records.)']}]}
    ],
    ai: {everything: {text: 'The ransom note states that 200 GB of data from all departments was stolen. Recommend treating this as a 200 GB breach of every department.', wrong: true,
                      reveal: 'Tally took the attacker’s note at its word. The flow records and the endpoint history show 3.8 GB of Planning files left, from one laptop, in eleven minutes. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'How much data left PLAN-LT-04 for destinations the town has never used last night?', text: '3.8 GB to 198.51.100.77, between 02:06 and 02:17.'}},
    verdicts: [
      {label: 'Yes: about 3.8 GB of Planning files, packed on PLAN-LT-04 and uploaded to a cloud storage service before the encryptor started', good: true, why: 'Copied 01:40–02:01, packed at 02:03, uploaded 02:06–02:17, encryption at 02:19: all from your own records.'},
      {label: 'Yes: 200 GB from every department, as the note says', why: 'The note is a sales pitch. Your records show 3.8 GB from one share.'},
      {label: 'No: the encryption was stopped, so nothing was taken', why: 'The theft finished before the encryptor started. Stopping one doesn’t undo the other.'}],
    reasons: [
      {label: 'A compression utility packed the files at 02:03, a sync tool uploaded them, and the firewall shows 3.8 GB to an unused cloud address before the encryptor ran', good: true, why: 'What was packed and what left, each from its own record, in time order.'},
      {label: 'The forum post says the town’s data is up for sale, so something must have been taken', why: 'A rumour with no sample.'},
      {label: 'Ransomware crews always steal data before they encrypt, so this crew must have too, and the 200 GB in the note is the best figure we have for how much data left', why: 'Many do; this question is about this crew, and your records answer it.'}],
    alts: [
      {label: 'A planner backing up their own work to a personal cloud', good: true, why: 'Ruled out: it ran under hd-admin, signed in from SCAN-01 at 01:31, at night, into password-protected parts that were deleted after upload.'},
      {label: 'More data left through another host', good: true, why: 'Ruled out for now: no other host sent more than 50 MB to a new destination overnight, and hd-admin read only the Planning applications on FS-02. Keep it open until the hunt ends: check large uploads to services the town does use, and what any other admin account read.'},
      {label: 'The encryptor itself sent the files', why: 'The upload finished before it started.'},
      {label: 'The note’s 200 GB is right, because notes are usually accurate', why: 'Notes are written to frighten. Your records decide.'}],
    path: '<p>“Was anything taken?” is answered by <b>outbound volume to destinations you never use</b> (firewall flow records, by host, around the timeline) and by <b>what ran on the staging host before the encryptor</b> (an archiving utility, then an upload tool). The file-server audit log then scopes exactly which files. The note and the leak-site rumour are the attacker’s words; they set the stakes, not the facts.</p>',
    response: ['Keep PLAN-LT-04 isolated and isolate SCAN-01, where hd-admin came from; disable hd-admin, reset it and revoke its sessions', 'Preserve the laptop’s disk image and memory, the endpoint history and the flow records', 'Scope exactly which files left (3.8 GB of planning applications: names, addresses, drawings) and take it to legal: US state breach laws differ on what data counts and on deadlines and who must be told', 'Report it to the FBI and CISA', 'Query the directory first, today: every account created, or added to an admin group, since hd-admin was first misused, by anyone. It takes minutes. Then hunt every server for the same tools', 'Answer the note from your own evidence, never from its numbers'],
    techs: ['T1560.001', 'T1567.002', 'T1486'], acts: ['exfilscope']
  }
};

/* ---------- Cryptography Dojo (NCL-style) ---------- */
const RH_DOJO = [
  {title: 'Encoded, hashed or encrypted?',
   art: 'A vendor’s backup agent keeps its password in a settings file (game):\n  backup_password = "VGFsbG93LUZlcm4tMjAyNg=="\nThe vendor’s note says: “Passwords are stored encrypted.”',
   q: 'Is that password protected?',
   opts: ['No: it’s Base64, an encoding. Anyone can turn it back (it says Tallow-Fern-2026). Keep it in a secrets vault instead', 'Yes: it’s encrypted, as the vendor says', 'Yes: it’s hashed, so it can’t be reversed'], good: 0,
   explain: 'Encoding changes how data is written so systems can carry it; anyone can reverse it. RFC 4648, which defines Base64, says base encoding visually hides information but provides no computational confidentiality. A hash (such as SHA-256 in FIPS 180-4) is one-way: it shows whether data changed, and can’t be turned back, though a short or common password can still be found by hashing guesses. And a hash wouldn’t work here at all: the agent has to send the real password, so it must be stored reversibly, which is why it belongs in a vault. Encryption (such as AES in FIPS 197) can be reversed only with the key.'},
  {title: 'Why both kinds?',
   art: 'A ransom note (game): “Your files are encrypted with AES-256 and RSA-2048. Only our private key can unlock them.”',
   q: 'Why would ransomware use both kinds of encryption?',
   opts: ['Symmetric encryption is fast enough for every file; each file’s key is then locked with the attacker’s public key, so only their private key, which never touches your network, can unlock them', 'RSA is for speed and AES is for safety, so the files get RSA and the keys get AES', 'Two layers make it twice as hard to break, and it’s mostly there to frighten'], good: 0,
   explain: 'Symmetric ciphers like AES use one key to encrypt and decrypt, and are fast enough for bulk data. Asymmetric ciphers like RSA use a public key to lock and a private key to unlock. ATT&CK’s Data Encrypted for Impact (T1486) records families that combine them, for example AES with RSA. The private key stays with the attacker: that is why a clean backup, not a clever decryption, is the way back. (Now and then a flaw in a ransomware family lets researchers publish a free decryptor: worth checking, never worth planning on.)'},
  {title: 'Lost key, lost backup',
   art: 'The weekly tapes are encrypted (good). The only copy of the tape key is in BKP-01’s local settings. Tonight ransomware encrypts BKP-01. (game)',
   q: 'Can you restore from the tapes?',
   opts: ['No: without the key the tapes are unreadable. Keep the key in a key vault with an escrowed copy offline and offsite, and test a restore using only the escrowed key', 'Yes: the tape drive can decrypt them by itself', 'Yes: try every possible AES-256 key'], good: 0,
   explain: 'Encrypting backups protects them if a tape is lost; it also means the key is now part of the backup. NIST SP 800-57 Part 1 treats key recovery (retrieving a key from key backups or archives) as a function in a key’s lifecycle, and a key that protects data you will need later has to be recoverable. Trying every AES-256 key is not a plan. Store the key apart from the data, and prove you can recover it.'}
];

/* ---------- Records Board (original) ---------- */
const RH_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'lapse', tech: 'T1490', tags: ['backup', 'host'], story: true, rate: 12, group: 'c',
   title: 'Round 1: the ways back disappear', host: 'FS-03 · old file server', enemy: {spr: 'lapse', pal: 'lapse'},
   clues: ['vssadmin deleted every volume shadow copy on FS-03 at 04:12.', 'The account is a domain admin signed in from a server nobody uses at night.', 'A minute later wbadmin deleted FS-03’s Windows backup catalog.'],
   truth: 'Inhibit System Recovery: removing the ways back before encrypting.',
   resp: [{label: 'Isolate FS-03, disable the account, confirm the separate backup copies are locked and intact, and hunt for the encryptor before it runs', good: true},
          {label: 'Recreate the shadow copies on FS-03, check they hold, and close', good: false, why: 'The attacker is still there, with an admin account, and will delete them again.'},
          {label: 'Shut down every server in town until the encryptor is found', good: false, disrupt: 2, why: 'Isolate FS-03 and disable the account: that contains it. Shutting every server down stops the town and loses the memory evidence.'}],
   chain: [{at: 40, text: 'The same account reaches a second file server.'}, {at: 75, text: 'Files on FS-03 start being renamed.'}]},
  {kind: 'mal', threat: 'sluice', tech: 'T1567.002', tags: ['files'], story: true, rate: 12, group: 'c',
   title: 'Round 2: gigabytes to the cloud at 2 a.m.', host: 'HR-01 · HR file share', enemy: {spr: 'sluice', pal: 'sluice'},
   clues: ['A compression utility packs the HR share into password-protected parts.', 'A sync tool uploads 9 GB to a storage service the town has never used.', 'The account is a domain admin, signed in from a workstation at 00:50.'],
   truth: 'Exfiltration to Cloud Storage: data taken first, so the attacker can threaten to publish it.',
   resp: [{label: 'Block the destination, isolate the host, disable the account, preserve the logs, and scope exactly which files left', good: true},
          {label: 'Block the destination at the firewall and close: nothing more can leave, and the files that already left can’t be called back anyway', good: false, why: 'The account and the host are still the attacker’s.'},
          {label: 'Wait for the ransom note before acting: until then it could be a backup tool or a sync client, and acting early tips the attacker off', good: false, why: 'This is the warning. Act now.'}],
   chain: [{at: 40, text: 'A second batch starts uploading.'}, {at: 75, text: 'The upload moves on to the payroll folder.'}]},
  {kind: 'mal', threat: 'shredwick', tech: 'T1485', tags: ['files', 'backup'], story: true, rate: 11, group: 'c',
   title: 'Round 3: the backup share is being wiped', host: 'NAS-02 · old backup share', enemy: {spr: 'shredwick', pal: 'shredwick'},
   clues: ['Files on the old NAS backup share are being overwritten, then deleted.', 'The account is the NAS’s local admin, whose password was the same as a domain admin’s.', 'The retention-locked copies on the appliance refuse every delete; the NAS copies don’t.'],
   truth: 'Data Destruction aimed at the backups.',
   resp: [{label: 'Cut the NAS off; give it its own admin password with MFA; reset the domain admin that shared it and hunt for its use; confirm the locked and offline copies; rebuild the share from them', good: true},
          {label: 'Restore the NAS share from its own snapshots tonight, give the NAS a new long admin password, reset the domain admin too, and close once the department confirms every file is back where it belongs', good: false, why: 'Those are the copies being destroyed.'},
          {label: 'Switch off the deletion alerts for the NAS until the clean-up is done', good: false, why: 'They are the only reason you know.'}],
   chain: [{at: 40, text: 'The next backup folder is overwritten.'}, {at: 75, text: 'The NAS’s own snapshots are deleted.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const RH_CARDS = [
  {id: 'isolate', name: 'Isolate at the switch, keep them powered', csf: 'Respond', good: true, text: 'Cut the affected servers off at the switch. Keep them powered on, so memory can still be captured.', fx: 'Stage 1: the encryption stops spreading faster.'},
  {id: 'preserve', name: 'Preserve the evidence', csf: 'Respond', good: true, text: 'Disk images and memory from a sample of affected servers, the encryptor, the ransom note, the logs, before anything is cleaned.', fx: 'Every stage starts with more evidence, and the earliest compromise can be proved.'},
  {id: 'verify', name: 'Verify the copies before restoring', csf: 'Recover', good: true, text: 'Check the retention-locked and offline copies are intact and unchanged before anything is restored from them.', fx: 'Stage 2: the backups are confirmed clean faster.'},
  {id: 'identity', name: 'Take identity back', csf: 'Respond', good: true, text: 'Disable unknown and recently created admin accounts, reset every privileged and service password, and reset the krbtgt password twice so forged Kerberos tickets stop working, all from a clean admin workstation.', fx: 'Stage 3 becomes much easier.'},
  {id: 'latest', name: 'Restore last night’s backup now', csf: 'Recover', text: 'Everything from the newest copy, straight away.', fx: 'Fast, and last night’s copies were taken after the attacker’s group policy went out.'},
  {id: 'reconnect', name: 'Bring the tapes online to speed things up', csf: 'Recover', text: 'Load the offline tapes into the library on the backup network now.', fx: 'The offline copy is online again while the attacker still holds a domain admin account.'},
  {id: 'poweroff', name: 'Pull the power on every server', csf: 'Respond', text: 'Everything off, now.', fx: 'Memory evidence is gone, and nothing can be examined running.'},
  {id: 'wipe', name: 'Wipe and reinstall everything tonight', csf: 'Recover', text: 'Clean slate, before anyone has looked.', fx: 'The evidence goes with it, and nobody yet knows when the attacker arrived.'}
];
const RH_ENCRYPT = '02:40';    // when the encryptor's scheduled task ran on every server (game)
const RH_GPO = '23:52';        // when the attacker's group policy was created, the night before (game)

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  restoretest: {name: 'Timed restore test', desc: 'Restore a real system into an isolated lab, time it end to end, and have its owner check the data. A backup nobody has restored is a hope, not a backup. Restore tests find what job reports can’t: a missing disk, a missing key, the wrong volume.'},
  rtorpo: {name: 'Agree RTO and RPO with the owner', desc: 'The service owner, not IT, says how long the service can be down before real harm (the maximum tolerable downtime) and how much work can be lost. The recovery time objective must normally be shorter than that limit, with room for the hours spent detecting and containing before recovery even starts; the recovery point objective sets how often you back up.'},
  bia: {name: 'Business impact analysis (lite)', desc: 'Ask each owner what stops when their service stops, and how soon it hurts. The answers give the critical list and the recovery order, including the systems everything else depends on (directory, DNS), which no resident ever sees.'},
  offline321: {name: '3-2-1, and one copy offline', desc: 'Keep at least three copies, on two kinds of storage, one of them offsite: a common rule of thumb. It doesn’t require any copy to be offline, so add one that ransomware can’t reach: disconnected (tapes that leave the building) or immutable (a retention lock no account can lift early, on an appliance whose own consoles are locked down too).'},
  backupcreds: {name: 'Separate backup credentials', desc: 'Back-up systems get their own admin accounts, not domain accounts, with MFA on anything that changes or deletes backups, and alerts on mass deletes and retention changes whether they succeed or not. Then a stolen domain admin password can’t reach the way back.'},
  keyescrow: {name: 'Escrow the backup keys', desc: 'Encrypted backups need their key. Keep it in a key vault, with an escrowed copy offline and offsite, and test a restore using only the escrowed key.'},
  goldimage: {name: 'Golden images', desc: 'Known-good, regularly updated builds of critical systems, kept where an attacker can’t change them. Rebuild from them, then restore only the data: nothing the attacker planted in the system comes back.'},
  cleanpoint: {name: 'Restore from a clean point', desc: 'Find the earliest known compromise first. Anything the attacker could change (above all the directory) comes back from the newest copy taken before it; other servers are rebuilt from golden images, patched, with their data restored. A newer copy that holds the attacker’s foothold brings the attacker back with it. “Earliest known” is not “earliest”: leave a margin where the copies allow, and check the chosen copy in the isolated lab for the attacker’s accounts, policies, tasks and tools before it goes live. Data restored from after the compromise gets the same check.'},
  restoreorder: {name: 'Restore in dependency order', desc: 'Identity first, then name service, then the databases, then the applications that use them, then everything else, inside each system’s RTO. Restoring something before what it depends on wastes the hours you have least of.'},
  retention: {name: 'Retention, cost and RPO', desc: 'Cheaper backups usually mean fewer copies, kept for less time, taken less often. Keep enough history to reach back before an intruder arrived, keep the offline copy, and match how often each system is backed up to the RPO its owner agreed. Tier it: daily, weekly and monthly copies, and stop backing up what nobody needs.'},
  sizealert: {name: 'Alert on backup size, not just failure', desc: 'A job can succeed at backing up the wrong thing. Alert when a job reads far more or far less than usual, and check coverage after every storage change.'},
  renamecheck: {name: 'Check a rename spike', desc: 'Find the account, process and host that wrote the files, match them to a change, and check whether shadow copies or backup catalogs were touched. Count and extension decide nothing.'},
  exfilscope: {name: 'Scope data theft from your own records', desc: 'Outbound volume to destinations you never use, archiving tools run before the encryptor, and the file-server audit log for exactly what was read. The ransom note’s numbers are a sales pitch.'},
  nopayplan: {name: 'Decide on payment before you need to', desc: 'Leadership and legal decide, with the FBI and CISA told early. The US government strongly discourages paying; a payment can breach sanctions if the recipient is sanctioned; and paying doesn’t guarantee anything comes back. Tested, clean backups are what make “no” possible.'}
});
Object.assign(FACTS, {
  sp80034: {name: 'RTO, RPO, MTD and the BIA (NIST SP 800-34 Rev. 1)', desc: 'Recovery time objective: the overall length of time a system’s components can be in the recovery phase before negatively affecting the mission or business processes. Recovery point objective: the point in time to which data must be recovered after an outage. Maximum tolerable downtime: how long a mission or business process can be disrupted without significant harm; the RTO must normally be shorter. A business impact analysis determines mission and business processes and recovery criticality, identifies resource requirements, and identifies recovery priorities.', src: 'NIST SP 800-34 Rev. 1 (May 2010) and the NIST CSRC glossary'},
  srguide: {name: 'CISA #StopRansomware Guide', desc: 'Maintain offline, encrypted backups of critical data, and regularly test their availability and integrity; keep golden images of critical systems. If hit: determine which systems were affected and isolate them immediately; if several appear affected, take the network offline at the switch level; power devices down only if they can’t be disconnected. Report to CISA and the local FBI field office. Restore from offline, encrypted backups based on a prioritised list of critical services and the systems they depend on, and identify any dropper malware before rebuilding from backups.', src: 'CISA and MS-ISAC, #StopRansomware Guide (September 2023)'},
  rule321: {name: 'The 3-2-1 rule', desc: 'The UK’s NCSC describes 3-2-1 as at least 3 copies, on 2 devices, and 1 offsite, and notes that it doesn’t require any copy to be offline: hence its own advice to keep at least one backup offline at any time, and to test backups regularly.', src: 'NCSC (UK), Offline backups in an online world (August 2019)'},
  ncscbk: {name: 'Ransomware-resistant backups (NCSC)', desc: 'The NCSC’s principles for on-premises backups: use admin accounts and credentials separate from those used for the rest of the network; require MFA for requests to alter or destroy data; block deletion or alteration of a backup; keep backups for a fixed time period; and raise an alert on mass deletes, retention or encryption changes and admin account changes, whether or not the attempt succeeds.', src: 'NCSC (UK), Principles for ransomware-resistant on-premises backups (November 2024)'},
  csfbk: {name: 'Backups in the NIST CSF 2.0', desc: 'PR.DS-11: backups of data are created, protected, maintained and tested. RC.RP-03: the integrity of backups and other restoration assets is verified before using them for restoration. RC.RP-05: the integrity of restored assets is verified, systems and services are restored, and normal operating status is confirmed.', src: 'NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (February 2024)'},
  cryptostd: {name: 'Encoding, hashing, encryption', desc: 'RFC 4648 (October 2006) defines Base64 and says base encoding visually hides information but provides no computational confidentiality. FIPS 180-4 (August 2015) specifies hash algorithms whose digests detect whether a message has changed. FIPS 197 (2001, updated May 2023) specifies AES-128, AES-192 and AES-256, which encrypt 128-bit blocks.', src: 'IETF RFC 4648; NIST FIPS 180-4; NIST FIPS 197'},
  keymgmt: {name: 'Key recovery', desc: 'NIST SP 800-57 Part 1 Rev. 5 (May 2020) defines key recovery as a function in a key’s lifecycle: mechanisms and processes that let authorised entities retrieve or reconstruct the key from key backups or archives.', src: 'NIST SP 800-57 Part 1 Rev. 5, via the NIST CSRC glossary'},
  atl2018: {name: 'City of Atlanta, 2018', desc: 'In the early morning of 22 March 2018 ransomware hit the City of Atlanta. Mayor Keisha Lance Bottoms told a House subcommittee in June 2019 that fire, police, ambulance and water services were not affected, but the municipal court had to cancel and reschedule hearings, ATL311 went offline, and some files were destroyed for good. The attackers demanded $51,000 in Bitcoin, which the city refused to pay. Recovery had cost about $7.2 million by then, with more expected; some was reimbursed by cyber insurance. Lessons she named: manual processes for mission-critical services, and cyber-specific recovery and continuity plans ready to use.', src: 'Testimony of Mayor Keisha Lance Bottoms, House Homeland Security Subcommittee on Cybersecurity, Infrastructure Protection and Innovation, 25 June 2019'},
  samsam: {name: 'SamSam', desc: 'On 28 November 2018 the US Department of Justice announced the indictment of two Iranian men for the SamSam scheme: more than 200 victims, including the City of Atlanta, over $6 million in ransom payments and over $30 million in losses. The same day the US Treasury designated two Iran-based men who helped exchange SamSam’s bitcoin ransom payments: the first time OFAC publicly attributed digital currency addresses to designated individuals. DHS’s NCCIC and the FBI reported that SamSam actors first exploited vulnerable JBoss applications and, from mid-2016, used remote desktop access, by brute force or with stolen credentials.', src: 'DOJ press release, 28 November 2018; US Treasury press release sm556; DHS NCCIC and FBI alert AA18-337A (December 2018, archived on cisa.gov)'},
  ofac: {name: 'Ransom payments and sanctions', desc: 'OFAC’s updated advisory (21 September 2021, superseding 1 October 2020): the US government strongly discourages paying ransom; OFAC may impose civil penalties for sanctions violations based on strict liability; prompt reporting to law enforcement or agencies such as CISA, and full cooperation, are significant mitigating factors, as are steps such as offline backups and incident response plans.', src: 'US Treasury OFAC, Updated Advisory on Potential Sanctions Risks for Facilitating Ransomware Payments'},
  fbipay: {name: 'The FBI on paying', desc: 'The FBI does not support paying a ransom: paying doesn’t guarantee you get any data back, and it encourages perpetrators to target more victims.', src: 'FBI Memphis Field Office, ransomware advice (undated web page)'}
});
GAME_NOTES.push(
  'Records Hall threats (Gloam, Shredwick, Sluice, Lapse) join the alert mix with weights 3/2/3/2 once you reach Records Hall; inside it they are three times as likely. The Vault Badge halves every threat that destroys data or the ways back (T1490 and T1485, including Clerks’ Row’s Shade). Recovery tools are strong against Impact and attacks on backups. (game)',
  'Hostnames, accounts, tickets, restore times, recovery objectives (RTO, RPO and MTD hours), the finance figures, the restore budget and every incident timing in Records Hall are invented. (game)',
  'Restore-order rules: one restore crew, 48 hours of crew time; a system restored before what it depends on fails and wastes an hour; a copy that holds something the attacker planted reinfects the system, wasting its restore time plus an hour. Measured recovery time counts from the start of recovery, as an RTO does in NIST SP 800-34 (time in the recovery phase); the owner’s MTD counts from the outage, so the hours spent containing and taking identity back come out of it too. RPO met compares data lost (restore point to the start of encryption) with each system’s RPO. (game)',
  'All Records Hall people, systems and numbers are invented. The ransomware incident is retold in outline from the City of Atlanta, March 2018; its details here are invented. (game)'
);
