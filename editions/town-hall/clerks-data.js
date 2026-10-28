/* ============================================================
   UPTIME · editions/town-hall/clerks-data.js
   Town Hall district 3, Clerks' Row (endpoints): art, map, people, ATT&CK
   techniques met here, threats, alert templates, briefings, patch-triage
   advisories, investigation drills, Forensics Dojo puzzles, Endpoint Board and
   worm-incident cards, Field Manual text. It extends the Front Desk and Mail
   Room tables; the only change to their data is a door on the plaza (marked).
   People, hosts, hashes, advisories (ADV-26-xxx), tickets, times and numbers are
   invented (game). Real facts are cited in CREDITS.md, section "Clerks' Row".
   ATT&CK IDs verified on attack.mitre.org on 28 October 2026 (ATT&CK v20).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
Object.assign(S, {
  watchling: ["0000000000000000","0000000000000000","0001100000011000","0012211111122100","0122222222222210","0123311221133210","0134431221344310","0134131221314310","0123311111133210","0122222442222210","0012222222222100","0001233333321000","0000122222210000","0000011111100000","0000110000110000","0000000000000000"],
  overwatch: ["4000000110000004","1400001221000041","1221111221111221","1222222222222221","0123311221133210","0134431221344310","0134131221314310","0123311111133210","0122222442222210","1222224444222221","1212222442222121","0012332222332100","0001233443321000","0000122222210000","0000110000110000","0001100000011000"],
  quill: ["0000000000000000","0011111111100000","0014444444410000","0014111144441000","0014444444444100","0014111111144100","0014444444444100","0014111111144100","0014444433344100","0014444322234100","0014443244234100","0014443244234100","0014444322234100","0014444433344100","0011111111111100","0000000000000000"],
  mimic: ["0000000000000000","0000011111100000","0001122222211000","0012222222222100","0122111221112210","0121441221441210","0121141221141210","0122111221112210","0122222222222210","0122222332222210","0012223333222100","0012222222222100","0001222112221000","0000111001110000","0000000000000000","0000000000000000"],
  cipher: ["0000000000000000","0111111111111100","1222222222222210","0141343134314100","0143134313414100","0141343134314100","0143413431414100","0141343134314100","0143134313414100","0141343134314100","0143413431414100","0141343134314100","1222222222222210","0111111111111100","0000000000000000","0000000000000000"],
  siphon: ["0000000000000000","0000000001111000","0000000012222100","0000000123333210","0000001233443210","0000012334413210","0000123333332100","0001233333321000","0012333333210000","0123332222100000","1233210000000000","1232100000000000","1221000000000000","0110000000000000","0000000000000000","0000000000000000"],
  blinder: ["0000000000000000","0000000000000000","0000011111100000","0001122222211000","0012233333322100","0123334444333210","1111111111111111","1444444444444441","1111111111111111","0123333333333210","0012233333322100","0001122222211000","0000011111100000","0000000000000000","0000000000000000","0000000000000000"],
  shade: ["0000000000000000","0000011111100000","0000122222210000","0001210000121000","0001200000021000","0001200000021000","0111111111111110","0122222222222210","0123333113333210","0123333113333210","0123333443333210","0123333443333210","0123333333333210","0122222222222210","0111111111111110","0000000000000000"],
  worm: ["0000000000000000","0000000000111100","0000000001222210","0000000012344321","0000000012311321","0000000012222210","0000111112222100","0001222222221000","0012233333210000","0122333322100000","1223332210000000","1233321000000000","1222210000000000","0122100000000000","0011000000000000","0000000000000000"],
  cords: ["4444444444444443","4442224444444443","4424442444222443","4424442442444243","4442244424444243","4444424244442443","4444442444424443","4422224244244443","4244442424444443","4244444244444443","4424444424422243","4442222444244423","4444444442444423","4444444444222443","4444444444444443","3333333333333333"]
});
Object.assign(PAL, {
  watchling: ['#1b2233', '#5a6f8a', '#b9cce6', '#ffd96a'],
  overwatch: ['#1b2233', '#2f4f8a', '#9fc4f0', '#9ff0c8'],
  quill: ['#141414', '#5b4a42', '#2f74b5', '#f2e3c6'],
  mimic: ['#141414', '#3a4a6b', '#8b93a7', '#ff4d6d'],
  cipher: ['#141414', '#8a4b2f', '#2f6e3e', '#f2e3c6'],
  siphon: ['#141414', '#5a2a6e', '#c49ae0', '#ff4d6d'],
  blinder: ['#141414', '#3a4a6b', '#7fa2d6', '#d7dbe4'],
  shade: ['#141414', '#4a1414', '#b8432f', '#ffd96a'],
  worm: ['#141414', '#2f6e3e', '#a6d96a', '#ff4d6d'],
  cords: ['#3a3a4a', '#2b2f3a', '#b9bccb', '#dcdfe8'],
  pcHot: ['#1b2233', '#5b3a26', '#a8703f', '#ff4d6d'],
  pcIso: ['#1b2233', '#3a4a6b', '#6d7fa6', '#7fa2d6'],
  deploy: ['#2a2523', '#3a4a6b', '#7fa2d6', '#d8cbb0'],
  forensic: ['#1b2233', '#0b2b33', '#7cc6c4', '#ffd96a'],
  eboard: ['#1b2233', '#2f4f8a', '#9fc4f0', '#ffd96a'],
  clerkBld: ['#1b2233', '#2f4f8a', '#9fc4f0', '#ffd96a'],
  clerkDark: ['#2a2523', '#3a4a6b', '#5b4a42', '#6e7a8a'],
  ruth: ['#1a1a2e', '#5b4a42', '#e0b090', '#2f74b5'],
  arlo: ['#1a1a2e', '#2b1d16', '#c98a54', '#5aa64b'],
  sunita: ['#1a1a2e', '#141414', '#a8703f', '#ff9f43'],
  mateo: ['#1a1a2e', '#3b2418', '#d9a87a', '#7fa2d6'],
  gus: ['#1a1a2e', '#8b93a7', '#f2c7a0', '#b8432f'],
  yara: ['#1a1a2e', '#141414', '#8a5a3c', '#9ff0c8'],
  teo: ['#1a1a2e', '#c0a040', '#f0c8a0', '#2f4f8a']
});
Object.assign(TILES, {
  'R': {spr: 'B', pal: 'clerkDark', solid: true},                  // Clerks' Row building (hub); lit after the Shield Badge
  'l': {spr: 'pc', pal: 'pcOff', solid: true, under: ',', laptop: true}, // staff laptop: dark = unpatched, lit = patched
  'T': {spr: 'counter', pal: 'deploy', solid: true, under: ','},   // deployment office console
  'f': {spr: 'pc', pal: 'forensic', solid: true, under: ','},      // Forensics Dojo terminals
  'V': {spr: 'K', pal: 'eboard', solid: true},                     // Endpoint Board racks
  'x': {spr: 'cords', pal: 'cords', grass: true}                   // unmanaged devices and tangled cords: trips alerts
});

/* ---------- Tools: the Watchling line (endpoint) ---------- */
// Endpoint tools are strong against threats that live on a host ('host' tag), whatever their tactic. (game)
CLASSES.endpoint.strongTags = (CLASSES.endpoint.strongTags || []).concat(['host']);
Object.assign(TOOLS, {
  watchling: {name: 'Watchling', cls: 'endpoint', sub: 'EDR agent', spr: 'watchling', blurb: 'A fledgling owl on every laptop. Sees process starts, not much else yet.',
              abil: ['ptree', 'askuser', 'kill']},
  overwatch: {name: 'Overwatch', cls: 'endpoint', sub: 'EDR + SIEM', spr: 'overwatch', blurb: 'Sentry wired into Ledger: every host’s telemetry in one place, searchable at once.',
              abil: ['ptree', 'fleet', 'isolate', 'collect']}
});
Object.assign(ABIL, {
  fleet: {name: 'Fleet search', type: 'inv', cost: 2, ev: 26, desc: 'Search every host’s telemetry at once for the same hash, command line or task name.'},
  collect: {name: 'Collect triage', type: 'inv', cost: 2, ev: 22, desc: 'Collect a forensic triage package (event logs, Prefetch, Amcache, task and process lists) before anything is cleaned or wiped.'}
});

/* ---------- Map: Clerks' Row interior, the Endpoint Board, and a door on the plaza ---------- */
// Laptops: three rows of six. Hostnames CR-LT-01..18 run left to right, top row first (game).
Object.assign(MAPS, {
  clerks: {
    name: 'Clerks’ Row',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wTTT,,,,,w,l,l,l,l,l,l,wf,f,fw",
      "w,,,,,,,,w,,,,,,,,,,,,,w,,,,,w",
      "w,,,,,,,,w,l,l,l,l,l,l,w,,,,,w",
      "w,,,,,,,,w,,,,,,,,,,,,,w,,,,,w",
      "w,,,,,,,,w,l,l,l,l,l,l,w,,,,,w",
      "wwwww,wwwwwwwwww,wwwwwwwww,www",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,Y,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,xxxxx,,,,,,,,,,,,,,,,,,,,,w",
      "w,,xxxxx,,,,,,,,,,,,,,,,,,,,,w",
      "w,,xxxxx,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwEwwwwwwwwwwwwwww"
    ],
    doors: {'14,15': {to: 'hub', x: 25, y: 11, dir: 'down'}, '29,10': {to: 'eboard', x: 9, y: 9, dir: 'up'}}
  },
  eboard: {
    name: 'Endpoint Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "wVV,,,,,,,,,,,,,,VVw",
      "wVV,,,,,,,,,,,,,,VVw",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'clerks', x: 28, y: 10, dir: 'left'}}
  }
});
// The one change to earlier data: a Clerks' Row building east of the Mail Room on the plaza.
// Its door opens with the Seal Badge.
MAPS.hub.rows[9] = "h.S.cccc......==.MMMM..RRRR..h";
MAPS.hub.rows[10] = "h.X.ccDc......==.MMDM.3RRDRGGh";
MAPS.hub.doors['25,10'] = {to: 'clerks', x: 14, y: 14, dir: 'up',
  get locked() { return (typeof G !== 'undefined' && G && G.f.mrSeal) ? undefined : 'Clerks’ Row. A note on the door: “Staff with a Seal Badge only.”'; }};

const CR_MAPS = ['clerks', 'eboard'];
const CR_LAPTOP_COLS = [11, 13, 15, 17, 19, 21], CR_LAPTOP_ROWS = [1, 3, 5];
function crHostAt(x, y) {
  const c = CR_LAPTOP_COLS.indexOf(x), r = CR_LAPTOP_ROWS.indexOf(y);
  if (c < 0 || r < 0) return null;
  return 'CR-LT-' + String(r * 6 + c + 1).padStart(2, '0');
}
function crHostXY(h) { const n = +h.slice(6) - 1; return {x: CR_LAPTOP_COLS[n % 6], y: CR_LAPTOP_ROWS[Math.floor(n / 6)]}; }
const CR_HOSTS_ALL = Array.from({length: 18}, (_, i) => 'CR-LT-' + String(i + 1).padStart(2, '0'));

/* ---------- People ---------- */
NPCS.push(
  {id: 'ruth', name: 'Ruth Avila', role: 'Clerks’ Row lead', map: 'clerks', x: 14, y: 9, dir: 'down', pal: 'ruth'},
  {id: 'arlo', name: 'Arlo Petrakis', role: 'deployment technician', map: 'clerks', x: 4, y: 3, dir: 'down', pal: 'arlo'},
  {id: 'sunita', name: 'Sunita Rao', role: 'records clerk', map: 'clerks', x: 22, y: 2, dir: 'left', pal: 'sunita'},
  {id: 'mateo', name: 'Mateo Ferreira', role: 'licensing clerk', map: 'clerks', x: 22, y: 4, dir: 'left', pal: 'mateo'},
  {id: 'gus', name: 'Gus Halloran', role: 'planning clerk', map: 'clerks', x: 10, y: 9, dir: 'down', pal: 'gus'},
  {id: 'yara', name: 'Yara Haddad', role: 'forensics coach', map: 'clerks', x: 26, y: 4, dir: 'down', pal: 'yara'},
  {id: 'teo', name: 'Teo Brandt', role: 'endpoint security lead', map: 'eboard', x: 9, y: 2, dir: 'down', pal: 'teo'}
);
const CR_NPC_IDS = ['ruth', 'arlo', 'sunita', 'mateo', 'gus', 'yara', 'teo'];

/* ---------- ATT&CK techniques met in Clerks' Row (verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20) ---------- */
Object.assign(TECH, {
  'T1204.002': {name: 'User Execution: Malicious File', tactic: ['Execution'], desc: 'Getting someone to open a malicious file, such as an Office document with macros, so its code runs.'},
  'T1218.011': {name: 'System Binary Proxy Execution: Rundll32', tactic: ['Stealth'], desc: 'Using rundll32.exe, a signed Windows program, to run attacker code from a DLL, so a trusted name shows in the process list. Its tactic, Stealth (TA0005), was called Defense Evasion before ATT&CK v19.'},
  'T1218.005': {name: 'System Binary Proxy Execution: Mshta', tactic: ['Stealth'], desc: 'Using mshta.exe, a signed Windows program that runs HTML applications, to run attacker script.'},
  'T1059.001': {name: 'Command and Scripting Interpreter: PowerShell', tactic: ['Execution'], desc: 'Running PowerShell commands and scripts, often encoded (base64) to hide what they do. Script block logging records the script as it actually runs.'},
  'T1003.001': {name: 'OS Credential Dumping: LSASS Memory', tactic: ['Credential Access'], desc: 'Reading the memory of LSASS, the Windows process that handles sign-ins, to steal the credentials cached in it. ATT&CK lists comsvcs.dll’s MiniDump run through rundll32, and procdump, among the ways.'},
  'T1685': {name: 'Disable or Modify Tools', tactic: ['Defense Impairment'], desc: 'Disabling or tampering with security tools (antivirus, EDR, logging) so an attack goes unseen. New in ATT&CK v19 under the Defense Impairment tactic; the old ID T1562.001 now redirects here.'},
  'T1490': {name: 'Inhibit System Recovery', tactic: ['Impact'], desc: 'Deleting backups and restore points (for example, vssadmin deleting volume shadow copies) so victims can’t recover without paying. Common just before ransomware encrypts.'},
  'T1210': {name: 'Exploitation of Remote Services', tactic: ['Lateral Movement'], desc: 'Exploiting a flaw in a network service to move from one host to the next. ATT&CK lists WannaCry using an SMBv1 exploit to spread.'},
  'T1486': {name: 'Data Encrypted for Impact', tactic: ['Impact'], desc: 'Encrypting data on one host or many to make it unusable, usually for ransom.'},
  'T1053.005': {name: 'Scheduled Task/Job: Scheduled Task', tactic: ['Execution', 'Persistence', 'Privilege Escalation'], desc: 'Using the Windows Task Scheduler to run a program at set times or at sign-in, so it keeps coming back.'}
});

/* ---------- Threats (wild alerts) ---------- */
// Scheduled-task persistence (T1053.005) is met in drill 2, not as a wild alert: it is a Quiet Thread technique,
// and Quiet Thread techniques never enter the alert mix.
Object.assign(THREATS, {
  quill: {name: 'Quill', tech: 'T1204.002', spr: 'quill', pal: 'quill', tags: ['host', 'mail'], bucket: 'phish', district: 'clerks'},
  mimic: {name: 'Mimic', tech: 'T1218.011', spr: 'mimic', pal: 'mimic', tags: ['host'], bucket: 'other', district: 'clerks'},
  cipher: {name: 'Cipher', tech: 'T1059.001', spr: 'cipher', pal: 'cipher', tags: ['host'], bucket: 'other', district: 'clerks'},
  siphon: {name: 'Siphon', tech: 'T1003.001', spr: 'siphon', pal: 'siphon', tags: ['host'], bucket: 'cred', district: 'clerks'},
  blinder: {name: 'Blinder', tech: 'T1685', spr: 'blinder', pal: 'blinder', tags: ['host'], bucket: 'other', district: 'clerks'},
  shade: {name: 'Shade', tech: 'T1490', spr: 'shade', pal: 'shade', tags: ['host'], bucket: 'other', district: 'clerks'}
});
// (game) base weights for the Clerks' Row threats; they only enter the mix once you reach Clerks' Row.
MAL_WEIGHTS.push({t: 'quill', w: 5}, {t: 'mimic', w: 3}, {t: 'cipher', w: 4}, {t: 'siphon', w: 3}, {t: 'blinder', w: 3}, {t: 'shade', w: 2});
const CR_HOME = ['quill', 'mimic', 'cipher', 'siphon', 'blinder', 'shade'];

Object.assign(ALERTS, {
  quill: {
    rule: 'Office document started another program',
    mal: {clues: ['Word opened “Remittance_0412.docm” from an email attachment, then started a script host.', 'The script contacted an address registered last week and saved a file to the user’s temp folder.', 'The document was saved into a Trusted Location folder a vendor set up years ago: Office skips its internet-macro block there.'],
          truth: 'Malicious document: macros in the file ran code (User Execution: Malicious File).',
          resp: [{label: 'Isolate the laptop, kill the process tree, collect triage, block the address, purge the email, reset the user’s password', good: true},
                 {label: 'Delete the document and close', good: false, why: 'The code already ran; whatever it saved is still on the laptop.'},
                 {label: 'Reimage every laptop in the row', good: false, disrupt: 2}]},
    benign: {clues: ['The document is the finance team’s budget workbook, with a macro signed by IT.', 'The program it started is the town’s reporting add-in, launched the same way every month.', 'Same file, same add-in, same day last month.'],
             truth: 'Benign: a known business workbook starting an approved add-in.'},
    fp: {clues: ['The “Office document” was WordCount.exe, the records team’s own tool.', 'Word itself was never running.', 'The rule matches process names by keyword.'],
         truth: 'False positive: a keyword rule matched a program name.'}
  },
  mimic: {
    rule: 'rundll32 loaded a DLL from a user folder',
    mal: {clues: ['rundll32.exe loaded a DLL from the user’s Downloads folder, calling an odd export name.', 'The DLL is unsigned and the browser wrote it two minutes earlier.', 'Right after, rundll32.exe connected to an address nobody here uses.'],
          truth: 'System binary proxy execution: a signed Windows program used to run attacker code (Rundll32).',
          resp: [{label: 'Isolate the laptop, kill rundll32 and its children, collect triage, block the address and the DLL’s hash on every laptop', good: true},
                 {label: 'Block rundll32.exe on every laptop', good: false, disrupt: 2, why: 'Windows and many apps use rundll32. Block the DLL and the behaviour, not the system program.'},
                 {label: 'Close: rundll32 is a Microsoft program', good: false, why: 'It is; that is the point. Attackers borrow trusted programs.'}]},
    benign: {clues: ['The DLL sits in a meeting app’s per-user install folder under AppData.', 'It is signed by the app’s publisher and hasn’t changed since the last update.', 'Every laptop with the app does the same at sign-in.'],
             truth: 'Benign: a per-user app using rundll32 to load its own signed DLL.'},
    fp: {clues: ['The match is a file named rundll32.exe.txt in a training folder.', 'Nothing ran: it is last year’s workshop notes.', 'The rule matches file names, not process starts.'],
         truth: 'False positive: the rule matched a file name, not a running program.'}
  },
  cipher: {
    rule: 'PowerShell started with an encoded command',
    mal: {clues: ['powershell.exe -NoProfile -WindowStyle Hidden -EncodedCommand … started under the clerk’s account.', 'Script block logging (event 4104) shows the decoded script: it downloads code and runs it in memory.', 'It ran while the laptop sat locked at lunch.'],
          truth: 'PowerShell abuse: an encoded command hiding a download-and-run script.',
          resp: [{label: 'Isolate the laptop, kill the process, keep the 4104 logs, collect triage, find what launches it and remove it', good: true},
                 {label: 'Uninstall PowerShell everywhere', good: false, disrupt: 2, why: 'Admins and management tools depend on it. Log it, restrict it, and catch abuse instead.'},
                 {label: 'Close: IT uses PowerShell all the time', good: false, why: 'IT’s scripts are known and logged; this one hides what it does.'}]},
    benign: {clues: ['The encoded command comes from the town’s device-management agent.', 'Event 4104 shows the decoded script: it reads the battery health report.', 'Same script, every laptop, every Monday.'],
             truth: 'Benign: a management agent that encodes its scripts.'},
    fp: {clues: ['The match was the word “encoded” in a file name passed to a normal script.', 'The script is plain text and signed by IT.', 'The rule looks for the word, not the parameter.'],
         truth: 'False positive: the rule matched a word in a file name.'}
  },
  siphon: {
    rule: 'A process read LSASS memory',
    mal: {clues: ['rundll32.exe ran comsvcs.dll’s MiniDump against the LSASS process.', 'A 60 MB .dmp file appeared in C:\\Windows\\Temp a second later.', 'It ran with admin rights, from an admin account that signed in from another laptop an hour ago.'],
          truth: 'Credential dumping from LSASS memory: whoever has that dump may have every credential cached on this laptop.',
          resp: [{label: 'Isolate the laptop, preserve then remove the dump, reset every account that signed in there and revoke their sessions, trace the admin account', good: true},
                 {label: 'Delete the .dmp file and close', good: false, why: 'The dump may already be copied out; the credentials in it are what matter.'},
                 {label: 'Reset only the clerk’s password', good: false, why: 'Every account cached on that laptop is exposed, including the admin account that ran the dump.'}]},
    benign: {clues: ['The read came from the antivirus engine’s own memory scan.', 'It is signed, it touches LSASS on every laptop, and it wrote no file.', 'The same pattern follows every definition update.'],
             truth: 'Benign: the security product’s own memory scan.'},
    fp: {clues: ['The process is “lsass_monitor.exe”, the help desk’s health check.', 'It reads LSASS’s CPU and memory counters, not its memory contents.', 'The rule matches any process with “lsass” in its name.'],
         truth: 'False positive: the rule matched a name, not a memory read.'}
  },
  blinder: {
    rule: 'Antivirus real-time protection turned off',
    mal: {clues: ['Defender event 5001, real-time protection disabled, at 02:10. No change ticket.', 'The change came from a PowerShell session under a local account created yesterday.', 'Tamper protection was off on this laptop, so nothing blocked it.'],
          truth: 'Defense impairment: an intruder turned off the antivirus to work unseen (Disable or Modify Tools).',
          resp: [{label: 'Isolate the laptop, turn protection back on, turn on tamper protection, remove the new account, hunt for what ran while it was off', good: true},
                 {label: 'Turn it back on and close', good: false, why: 'Someone switched it off on purpose. Find what ran in the gap.'},
                 {label: 'Reinstall antivirus on every laptop', good: false, disrupt: 1}]},
    benign: {clues: ['A change ticket says the deployment office paused protection for a vendor install.', 'Event 5007 shows the setting going back on twelve minutes later.', 'The technician confirms it on his known number.'],
             truth: 'Benign: a ticketed maintenance change (still worth asking why protection had to be off).'},
    fp: {clues: ['Event 5001 came from a laptop on the re-imaging bench.', 'The image build turns protection off and back on by design.', 'The rule doesn’t exclude the bench.'],
         truth: 'False positive: the re-imaging bench.'}
  },
  shade: {
    rule: 'Volume shadow copies deleted',
    mal: {clues: ['vssadmin.exe deleted every volume shadow copy on the laptop at 03:02.', 'Minutes earlier the same account copied a tool to five laptops over file sharing.', 'Deleting shadow copies removes Windows’ easy restore points: a classic step just before ransomware encrypts.'],
          truth: 'Inhibit System Recovery: a ransomware precursor. Encryption may be minutes away.',
          resp: [{label: 'Isolate every laptop the account touched, disable the account and revoke its sessions, check the offline backups, hunt for the tool', good: true},
                 {label: 'Restore the shadow copies and close', good: false, why: 'They are gone, and the attacker is still here.'},
                 {label: 'Wait to see whether files get encrypted', good: false, why: 'This is the warning. Act now.'}]},
    benign: {clues: ['The backup software rotated its own shadow copies on schedule.', 'Its service account, its usual time, its usual command.', 'New copies were created right after.'],
             truth: 'Benign: the backup tool managing its own snapshots.'},
    fp: {clues: ['The match was “vssadmin list shadows”, a read-only check by the help desk.', 'Nothing was deleted.', 'The rule matches the program name, not the delete command.'],
         truth: 'False positive: a read-only listing.'}
  }
});
Object.assign(ALERT_CHAINS, {
  quill: ['The script downloads a second file.', 'The new file starts and connects out.'],
  mimic: ['rundll32 starts a child process.', 'The child reads the browser’s saved passwords.'],
  cipher: ['The script lists the laptop’s users and shares.', 'It tries the same command on the next laptop.'],
  siphon: ['The .dmp file is copied to a share.', 'A stolen admin credential signs in to a second laptop.'],
  blinder: ['A new program runs while protection is off.', 'The same account turns off protection on a second laptop.'],
  shade: ['A second laptop loses its shadow copies.', 'Files start getting renamed with a new extension.']
});

/* ---------- Morning briefing items (Clerks' Row) ---------- */
const CR_BRIEFS = [
  {t: 'quill', text: 'Documents with macros are arriving as “remittance advice” attachments.', act: 'Check that no Trusted Location skips the internet-macro block'},
  {t: 'mimic', text: 'Attackers are running DLLs through rundll32 to hide behind a signed name.', act: 'Alert on rundll32 loading DLLs from user folders'},
  {t: 'cipher', text: 'Encoded PowerShell is being used to download and run code in memory.', act: 'Confirm script block logging reaches the collector'},
  {t: 'siphon', text: 'Intruders with admin rights are dumping LSASS memory to steal credentials.', act: 'Turn on the LSASS credential-theft protection rule'},
  {t: 'blinder', text: 'Ransomware crews switch off antivirus before they start.', act: 'Turn on tamper protection everywhere'},
  {t: 'shade', text: 'Shadow-copy deletion is showing up minutes before encryption.', act: 'Test a restore from the offline backups'}
];

/* ---------- Patch Tuesday triage (mini-game) ---------- */
// Advisory IDs, products and scores are invented (game). Never real CVE numbers.
// good: the bucket an analyst should pick. applies: the product is on our laptops. prio: lights a laptop when applied.
const CR_ADVISORIES = [
  {id: 'ADV-26-101', title: 'Windows file-sharing service: remote code execution', cvss: 9.8, kev: false, applies: true, prio: true, good: 'week',
   note: 'No user action needed; any laptop that can reach another on the office network can attack it. Exploit code went public this week.',
   why: 'Not on the KEV list yet, but a wormable flaw in a service every laptop exposes, with public exploit code, can’t wait. KEV is a floor, not a ceiling.'},
  {id: 'ADV-26-102', title: 'Browser: memory corruption', cvss: 8.8, kev: true, applies: true, prio: true, good: 'week',
   note: 'On CISA’s Known Exploited Vulnerabilities list: being used in attacks now.',
   why: 'Known exploited, and every laptop browses the web. This week.'},
  {id: 'ADV-26-103', title: 'PDF reader plug-in: code execution on opening a file', cvss: 7.8, kev: true, applies: true, prio: true, good: 'week',
   note: 'On the KEV list: used in phishing campaigns.',
   why: 'Known exploited, and clerks open PDFs all day. This week.'},
  {id: 'ADV-26-104', title: 'Database server engine: remote code execution', cvss: 9.8, kev: false, applies: false, good: 'later',
   note: 'Asset inventory: no laptop runs this database server.',
   why: 'A 9.8 on software we don’t run is not a risk to the laptops. CVSS rates severity, not your exposure. (Patch the servers that have it, through their own process.)'},
  {id: 'ADV-26-105', title: 'Windows kernel: elevation of privilege', cvss: 7.0, kev: true, applies: true, prio: true, good: 'week',
   note: 'On the KEV list: ransomware crews use it after getting in.',
   why: 'Only a 7.0, but known exploited. A lower score that attackers are using beats a higher one nobody is.'},
  {id: 'ADV-26-106', title: 'Office: code execution if a crafted file is opened', cvss: 7.8, kev: false, applies: true, good: 'next',
   note: 'No exploitation known. Needs a user to open a crafted file.',
   why: 'Real, but not exploited and needs a user to act. Next week, in the normal cycle.'},
  {id: 'ADV-26-107', title: 'Virtualization feature: guest escape', cvss: 8.4, kev: false, applies: false, good: 'later',
   note: 'The feature is turned off on all laptops.',
   why: 'High score, feature not enabled. Later, with the rest of the backlog.'},
  {id: 'ADV-26-108', title: 'VPN client: information disclosure', cvss: 6.5, kev: false, applies: true, good: 'next',
   note: 'No exploitation known. Fixed in the next client version.',
   why: 'Applies, low urgency. Next week.'}
];
const CR_BUCKETS = {week: 'This week', next: 'Next week', later: 'Later'};
const CR_OFFLINE = 'CR-LT-17';  // away at a conference during the roll-out (game)
const CR_DEFERRED = 'CR-LT-08'; // patch installed, restart postponed five times (game)
const CR_SPREAD = ['CR-LT-02', 'CR-LT-11', 'CR-LT-13', 'CR-LT-14']; // extra victims if ADV-26-101 wasn't patched this week (game)

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real-world kinds of evidence) ---------- */
const CR_DRILLS = {
  hash: {
    id: 'hash', title: 'The flagged download', budget: 2,
    intro: '<p>Threat intel flagged a file hash as a known-bad loader this morning (game). Sunita’s laptop, CR-LT-04, downloaded a file with that hash yesterday at 15:12. Before anyone reimages her laptop, leadership wants one answer.</p>',
    artefact: '<pre class="art">Threat-intel match · CR-LT-04 · user sunita.rao (game data)\n' +
      'File      C:\\Users\\sunita.rao\\Downloads\\Invoice_0412.pdf.exe\n' +
      'SHA-256   9f3c…e71a   (on the town’s block list since 08:00 today)\n' +
      'Stream    Zone.Identifier: ZoneId=3 (Internet)\n' +
      'Created   yesterday 15:12:40, written by the browser</pre>' +
      '<p class="small">Zone.Identifier is the Mark of the Web: Windows adds it to files from the internet (ZoneId 3 = Internet). It tells you where a file came from, not whether it ran.</p>',
    question: 'Did the file execute on CR-LT-04?',
    sources: [
      {id: 'proxy', name: 'Proxy log', qs: [
        {q: 'Did CR-LT-04 download Invoice_0412.pdf.exe yesterday?', kind: 'trap',
         res: ['15:12:39  GET  …/invoice/Invoice_0412.pdf.exe  200  bytes in 412,288', '(Yes, it was downloaded. You knew that from the alert: the question is whether it ran.)']},
        {q: 'All web traffic from CR-LT-04 this week', kind: 'broad', rows: 18220,
         wall: ['{t}  GET  intranet.townhall.example/records/{n}  200', '{t}  GET  mail.townhall.example/inbox  200', '{t}  GET  news.example/local  200', '{t}  GET  cdn.example/fonts/{n}.woff2  200']}]},
      {id: 'edr', name: 'EDR process creation (Sentry, Sysmon event 1)', qs: [
        {q: 'Any process started from a file with this SHA-256, at any path, since 15:12 yesterday?', kind: 'focus', key: true,
         res: ['No process creation event for SHA-256 9f3c…e71a on CR-LT-04, or on any other laptop.', 'Logging covered the whole period: 2,114 other process creation events on CR-LT-04 since 15:12.']},
        {q: 'Every process started on CR-LT-04 this week', kind: 'broad', rows: 9812,
         wall: ['{t}  chrome.exe  → chrome.exe --type=renderer', '{t}  explorer.exe → OUTLOOK.EXE', '{t}  svchost.exe  → taskhostw.exe', '{t}  explorer.exe → AcroRd32.exe C:\\Users\\sunita.rao\\Documents\\{n}.pdf']}]},
      {id: 'pf', name: 'Prefetch folder', qs: [
        {q: 'Is there a Prefetch file for INVOICE_0412.PDF.EXE?', kind: 'focus', key: true,
         res: ['No INVOICE_0412.PDF.EXE-*.pf in C:\\Windows\\Prefetch.', 'Prefetch is working here: 212 .pf files, the newest (CHROME.EXE-…pf) written nine minutes ago.', '(Prefetch is generally reliable evidence of execution, so its absence on a laptop where it clearly works means something.)']}]},
      {id: 'amc', name: 'Amcache.hve', qs: [
        {q: 'Does Amcache list Invoice_0412.pdf.exe?', kind: 'trap',
         res: ['Yes: an entry for C:\\Users\\sunita.rao\\Downloads\\Invoice_0412.pdf.exe, with a SHA-1.', '(Amcache records files that were present. Microsoft’s incident responders say it cannot be used to prove a binary executed.)']}]},
      {id: 'user', name: 'Ask Sunita (known number)', qs: [
        {q: 'Did you open the invoice file?', kind: 'focus',
         res: ['Sunita: “I clicked the link and something downloaded. I thought it was the PDF. Then a colleague emailed me the real invoice, so I used that one.”', '(Useful context, but memory isn’t evidence: the host decides.)']}]}
    ],
    ai: {everything: {text: 'Amcache contains an entry for Invoice_0412.pdf.exe with its SHA-1, which shows the file was executed. Recommend reimaging CR-LT-04.', wrong: true,
                      reveal: 'Tally was wrong in a very common way: it read an Amcache entry as proof of execution. Amcache records that a file was present; Microsoft’s incident responders say it cannot prove a binary ran. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'Is there any process creation event for SHA-256 9f3c…e71a on CR-LT-04 since 15:12 yesterday?', text: 'No. No process creation event matches that hash on CR-LT-04, or on any other laptop, since 15:12 yesterday, and process logging ran throughout.'}},
    verdicts: [
      {label: 'Downloaded, not executed: remove it, block the hash, no reimage needed', good: true, why: 'No process ever started from that hash, and Prefetch, which is working on this laptop, has no file for it.'},
      {label: 'Executed: Amcache lists it, so reimage the laptop', why: 'Amcache shows the file was present, not that it ran.'},
      {label: 'Executed: it was downloaded, so assume it ran', why: 'A download is not execution. Assuming the worst costs Sunita a day of work and teaches nothing.'}],
    reasons: [
      {label: 'No process creation for the hash in a complete log, and no Prefetch file on a laptop where Prefetch clearly works', good: true, why: 'Two independent execution artefacts agree, and you checked that both were working.'},
      {label: 'The Zone.Identifier says ZoneId=3', why: 'That shows where the file came from, not whether it ran.'},
      {label: 'Sunita says she didn’t open it', why: 'Worth hearing, but people misremember. The host evidence decides.'}],
    alts: [
      {label: 'It ran under a different name or from another folder', good: true, why: 'Ruled out: the search was by hash, not by name or path.'},
      {label: 'Prefetch is turned off on this laptop', good: true, why: 'Ruled out: 212 .pf files, the newest only minutes old.'},
      {label: 'The proxy blocked the download', why: 'The file is on disk.'},
      {label: 'Antivirus deleted it on arrival', why: 'It is still in Downloads.'}],
    path: '<p>Ask the execution question of execution evidence: <b>process creation for that hash</b> (EDR or Sysmon event 1, searched by hash so a rename can’t hide it) and <b>Prefetch</b> (check it is working: it is not enabled by default on Windows Server, for one). The proxy only proves the download you already knew about. Amcache and Shimcache show that a file was present; Microsoft’s incident response guide says neither proves execution on Windows 10 and later.</p>',
    response: ['Quarantine and delete the file; keep a copy and its hash as evidence', 'Block the hash on every laptop and search the fleet for it', 'Find how the link reached Sunita and purge the message', 'No reimage: nothing ran. Show Sunita, without blame, how a double extension (.pdf.exe) hides a program'],
    techs: ['T1204.002'], acts: ['hashhunt']
  },
  task: {
    id: 'task', title: 'The lunchtime task', budget: 2,
    intro: '<p>Mateo’s laptop, CR-LT-10, registered a new scheduled task at 12:41. Mateo badged out for lunch at 12:30 and back in at 13:15 (game). He says he didn’t make it.</p>',
    artefact: '<pre class="art">Task Scheduler · Operational log · CR-LT-10 · Day {D}\n' +
      '12:41:07  Event 106  The user "TOWNHALL\\mateo.f" registered the Task Scheduler task "\\Acrobat Update Helper".</pre>' +
      '<p class="small">Event 106 names the account the task was registered under. It doesn’t say who, or what, was at the keyboard.</p>',
    question: 'Who or what created the task, and what does it run?',
    sources: [
      {id: 'def', name: 'Task definition (Task Scheduler)', qs: [
        {q: 'What does “\\Acrobat Update Helper” run, and when?', kind: 'focus', key: true,
         res: ['Triggers: at sign-in, and every 60 minutes', 'Action: rundll32.exe C:\\Users\\mateo.f\\AppData\\Roaming\\AcroHelp\\ah.dll,Start', 'The DLL is unsigned. No Acrobat product installs to that folder.']}]},
      {id: 'edr', name: 'EDR process tree (Sentry)', qs: [
        {q: 'Which process created the task at 12:41, and what started it?', kind: 'focus', key: true,
         res: ['12:41:06  schtasks.exe /create /tn "Acrobat Update Helper" …', '  parent  powershell.exe -NoProfile -WindowStyle Hidden -EncodedCommand …', '  parent  wscript.exe C:\\Users\\mateo.f\\Downloads\\Statement_Oct.js', '  parent  explorer.exe: Mateo double-clicked Statement_Oct.js at 10:05; the script waited, then acted at 12:41']},
        {q: 'Every process on every laptop today', kind: 'broad', rows: 41730,
         wall: ['{t}  CR-LT-{n}  explorer.exe → OUTLOOK.EXE', '{t}  CR-LT-{n}  svchost.exe → taskhostw.exe', '{t}  CR-LT-{n}  chrome.exe → chrome.exe --type=gpu-process', '{t}  CR-LT-{n}  services.exe → MsiExec.exe'],
         buried: '12:41:06  CR-LT-10  powershell.exe → schtasks.exe /create /tn "Acrobat Update Helper"'}]},
      {id: 'sec', name: 'Security log', qs: [
        {q: 'Event 4698 (a scheduled task was created) on CR-LT-10 today', kind: 'focus',
         res: ['No 4698 events on CR-LT-10.', 'The audit subcategory that produces 4698, Audit Other Object Access Events, isn’t turned on for staff laptops. Check what a log collects before you trust its silence.']}]},
      {id: 'door', name: 'Door badge log', qs: [
        {q: 'Was Mateo at his desk at 12:41?', kind: 'trap',
         res: ['12:30 badge out, 13:15 badge in.', '(It doesn’t settle anything: a program running as his account doesn’t need him in the chair.)']}]},
      {id: 'dep', name: 'Deployment office log', qs: [
        {q: 'Did the deployment office push anything to CR-LT-10 today?', kind: 'focus',
         res: ['No deployments to CR-LT-10 since last Tuesday.', '(Our deployment agent runs its jobs as a system account, not as a user. game)']}]}
    ],
    verdicts: [
      {label: 'Malware running as Mateo’s account created it: persistence from a script he opened this morning', good: true, why: 'The process tree runs from his 10:05 script to schtasks at 12:41, and the task runs an unsigned DLL from his profile.'},
      {label: 'Mateo made it: the log names his account', why: 'Event 106 records the account, not the person. The creator was a script.'},
      {label: 'The deployment office pushed an Acrobat updater', why: 'No deployment went to this laptop, and deployments run as the agent, not as a user.'}],
    reasons: [
      {label: 'The process tree links the task to a script he opened at 10:05, and the task runs an unsigned DLL from his profile through rundll32', good: true, why: 'Creator and payload, both from the evidence.'},
      {label: 'He was at lunch, so it can’t be him', why: 'True but weak: it rules out him at the keyboard, not malware running as him.'},
      {label: 'The task name mentions Acrobat, so it’s legitimate', why: 'Names are free. Attackers pick names that blend in.'}],
    alts: [
      {label: 'A legitimate per-user updater', good: true, why: 'Ruled out: no Acrobat product installs there, and the DLL is unsigned.'},
      {label: 'Someone signed in remotely as Mateo at 12:41', good: true, why: 'Ruled out: the creator was a process running on the laptop since 10:05, not a new sign-in.'},
      {label: 'A Windows update created it', why: 'An update doesn’t start from wscript.exe and a downloaded script.'},
      {label: 'The clock is wrong', why: 'Process tree, task log and door log agree on the order.'}],
    path: '<p>Ask what made it and what it runs: the <b>process tree</b> at 12:41 (the creator and its parents) and the <b>task definition</b> (action and triggers). Event 106 says which account registered the task, not who sat at the keyboard. Security event 4698 would help too, but only where Audit Other Object Access Events is on: check what a log collects before you trust its silence.</p>',
    response: ['Isolate CR-LT-10: something is running on it, and this is what isolation is for', 'Collect triage (process list, task, DLL, logs) before cleaning anything', 'Delete the task and the DLL; search every laptop for the task name and the DLL’s hash', 'Reset Mateo’s password and revoke his sessions: the malware ran as him', 'Find the message that delivered Statement_Oct.js and purge it', 'Turn on Audit Other Object Access Events so 4698 is recorded next time'],
    techs: ['T1053.005', 'T1218.011', 'T1059.001'], acts: ['triage']
  },
  rtp: {
    id: 'rtp', title: 'Protection off, engine on', budget: 2,
    intro: '<p>Alert at 14:03: real-time protection is off on CR-LT-09. The antivirus engine’s service is still running and its definitions are current. Tampering, or an admin change?</p>',
    artefact: '<pre class="art">Microsoft Defender Antivirus · Operational log · CR-LT-09 · Day {D}\n' +
      '14:02:11  Event 5007  The antimalware platform configuration changed.\n' +
      '          Old value: …\\Real-Time Protection\\DisableRealtimeMonitoring = 0x0\n' +
      '          New value: …\\Real-Time Protection\\DisableRealtimeMonitoring = 0x1\n' +
      '14:02:11  Event 5001  Real-time protection is disabled.</pre>' +
      '<p class="small">Values shortened (game). Event 5007 shows the old and new setting. It doesn’t name who changed it.</p>',
    question: 'Did an attacker turn protection off (tampering), or an admin (a change)?',
    sources: [
      {id: 'ps', name: 'PowerShell script block log (4104)', qs: [
        {q: 'Script blocks on CR-LT-09 between 14:00 and 14:03', kind: 'focus', key: true,
         res: ['14:02:10  4104  Set-MpPreference -DisableRealtimeMonitoring $true', '          user TOWNHALL\\arlo.adm (IT’s separate admin account) · elevated session', '14:31:55  4104  msiexec /i PlotterSuite_v7.msi /qn']}]},
      {id: 'chg', name: 'Change tickets', qs: [
        {q: 'Any change ticket for CR-LT-09 today?', kind: 'focus', key: true,
         res: ['CHG-3318 (game): “Install PlotterSuite v7 on CR-LT-09. Vendor guide: turn off antivirus during install.” Assigned: Arlo Petrakis. Window 14:00–15:00.', 'Closed 14:40. Nothing about turning protection back on.']}]},
      {id: 'sign', name: 'Sign-in log', qs: [
        {q: 'Where did arlo.adm sign in from around 14:00?', kind: 'focus',
         res: ['13:58  arlo.adm  interactive sign-in at the CR-LT-09 console, on the deployment office bench. MFA: security key.']}]},
      {id: 'set', name: 'Defender settings', qs: [
        {q: 'Is tamper protection on for CR-LT-09?', kind: 'focus',
         res: ['Tamper protection: Off. This laptop is in a group excluded last year for an old plotter driver (game).', '(With tamper protection on, the change would have been blocked and recorded as event 5013.)']},
        {q: 'Every Defender event on every laptop this month', kind: 'broad', rows: 26405,
         wall: ['{t}  CR-LT-{n}  1000  An antimalware scan started.', '{t}  CR-LT-{n}  1001  An antimalware scan finished.', '{t}  CR-LT-{n}  2000  The security intelligence was updated.', '{t}  CR-LT-{n}  1150  The antimalware platform is healthy.']}]},
      {id: 'scan', name: 'Antivirus scan', qs: [
        {q: 'Run a full scan on CR-LT-09 now', kind: 'trap',
         res: ['Scan complete: no threats found.', '(A scan describes the files now. It can’t tell you who turned protection off, or what ran while it was off.)']}]}
    ],
    ai: {everything: {text: 'Defender on CR-LT-09 was disabled through PowerShell, a known attacker technique (T1685). Recommend isolating the laptop and treating it as compromised.', wrong: true,
                      reveal: 'Tally matched the technique, not the case. Attackers do turn protection off this way, and so do admins following a vendor guide. The ticket, the console sign-in and the admin account decide which this was.'},
         specific: {q: 'Is there a change ticket covering CR-LT-09 between 14:00 and 14:03?', text: 'Yes: CHG-3318, a PlotterSuite install assigned to Arlo Petrakis, window 14:00–15:00. Its notes say to turn off antivirus during the install.'}},
    verdicts: [
      {label: 'An admin change: Arlo turned it off for a ticketed install and never turned it back on', good: true, why: 'The command ran in his admin account’s console session, inside the ticket window, as the ticket told him to.'},
      {label: 'Tampering: an attacker turned it off', why: 'Everything points to a ticketed, on-site admin change. Still a problem, but not an intruder.'},
      {label: 'A Defender glitch: nobody turned it off', why: 'Event 5007 shows a deliberate setting change, and 4104 shows the command.'}],
    reasons: [
      {label: 'The command ran in arlo.adm’s elevated console session inside an open change ticket that tells him to do exactly this', good: true, why: 'Who, where, when and why line up.'},
      {label: 'The engine service is still running, so it can’t be an attacker', why: 'Attackers often switch a setting off and leave the service running.'},
      {label: 'It was done with PowerShell, so it must be an attacker', why: 'Admins use PowerShell all day.'}],
    alts: [
      {label: 'An attacker using Arlo’s admin account', good: true, why: 'Ruled out: a console sign-in on the bench with his security key, inside the ticket window, and Arlo confirms it on his known number.'},
      {label: 'Malware switched it off', good: true, why: 'Ruled out: the change came from a command in Arlo’s session, not from an unknown process.'},
      {label: 'The clerk turned it off', why: 'Clerks lost local admin this week; they can’t.'},
      {label: 'Group Policy turned it off', why: '4104 shows a command typed in a session.'}],
    path: '<p>The same events (5001, 5007) mean tampering or maintenance depending on <b>who ran the change</b> (script block log 4104: the command, the account, elevated or not) and <b>whether it was authorised</b> (the change ticket). A scan can answer neither. Tamper protection would have blocked this change, and logged event 5013, whoever made it: that is its job.</p>',
    response: ['Turn real-time protection back on now, and check what ran on CR-LT-09 while it was off', 'Talk to Arlo without blame: use an approved exclusion or a signed installer, never “antivirus off”', 'Turn tamper protection on for the excluded laptop group', 'Alert on 5001 and 5007 outside a change window', 'Add “protection back on” to the change checklist'],
    techs: ['T1685', 'T1059.001'], acts: ['tamperprot']
  }
};

/* ---------- Forensics Dojo (NCL-style): execution artefacts ---------- */
const CR_DOJO = [
  {title: 'Prefetch, and where it isn’t',
   art: 'FILESRV-01 runs Windows Server. A tool called sweep.exe was found on it. There is no SWEEP.EXE-*.pf in C:\\Windows\\Prefetch. (game)',
   q: 'What does the missing Prefetch file tell you?',
   opts: ['Almost nothing: Prefetch is not enabled by default on Windows Server, so look for other execution evidence', 'sweep.exe never ran on FILESRV-01', 'Someone deleted the Prefetch file to hide it'], good: 0,
   explain: 'On desktop Windows, Prefetch is generally reliable evidence of execution: Windows 8 and later record the last eight run times, and the folder keeps about 1,024 files, oldest out first. But Prefetch is not enabled by default on Windows Server, so its absence there proves nothing. Check process creation logs or EDR instead. (Source: Microsoft Incident Response, Guidance for Incident Responders.)'},
  {title: 'Present is not executed',
   art: 'On a Windows 11 laptop, Amcache.hve has an entry for tool.exe with a SHA-1, and Shimcache (AppCompatCache) lists tool.exe too. (game)',
   q: 'What can you say?',
   opts: ['tool.exe was on the system; neither artefact proves it ran, so confirm with execution evidence', 'tool.exe ran: two artefacts agree', 'Nothing: these artefacts are unreliable and should be ignored'], good: 0,
   explain: 'Microsoft’s incident responders say Amcache cannot prove a binary executed, and Shimcache can’t prove execution on Windows 10 or later. Both are good evidence that a file was present, and its path. Two more caveats: the Amcache SHA-1 is not always a hash of the whole file (for large files only the first 30 MB is hashed), and Shimcache is only written at shutdown or restart. Confirm execution with Prefetch, process creation events or EDR.'},
  {title: 'Build the timeline',
   art: 'One laptop, one program (local time, game):\n09:58:31  file created in Downloads, Zone.Identifier ZoneId=3\n10:02:00  process creation event for the program\n10:02:07  its Prefetch .pf file created\n16:40:12  the .pf file last modified',
   q: 'When did the program first run, and when did it last run?',
   opts: ['First at about 10:02, last at about 16:40', 'First at 09:58, last at 10:02', 'First at 10:02:07, and only once'], good: 0,
   explain: '09:58 is the download, not a run. A Prefetch file is created a few seconds after the first run (Microsoft’s guide puts the gap at 0 to 10 seconds), which fits the 10:02:00 process event, and its last-modified time generally marks the most recent run, here 16:40. Put every source on one clock and one time zone, and let independent artefacts confirm each other.'}
];

/* ---------- Endpoint Board (original) ---------- */
const CR_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'quill', tech: 'T1218.005', tags: ['host'], story: true, rate: 12, group: 'a',
   title: 'Round 1: Word starts mshta', host: 'CR-LT-06 · Clerks’ Row', enemy: {spr: 'quill', pal: 'quill'},
   clues: ['WINWORD.EXE started mshta.exe, which ran a script from an outside address.', 'The document arrived as an email attachment an hour ago and was opened from a Trusted Location folder.', 'mshta.exe saved a new program to the user’s temp folder and started it.'],
   truth: 'A macro document used mshta.exe, a signed Windows program, to run attacker script (System Binary Proxy Execution: Mshta).',
   resp: [{label: 'Isolate CR-LT-06, kill the tree, collect triage, purge the email, and move the “Office child processes” rule from audit to block', good: true},
          {label: 'Delete the document and close', good: false, why: 'The script already ran and dropped a program.'},
          {label: 'Block mshta.exe on every server in town', good: false, disrupt: 1, why: 'Wrong place and too broad: the problem is Office starting it on a laptop.'}],
   chain: [{at: 40, text: 'The new program connects out every 60 seconds.'}, {at: 75, text: 'It starts listing the laptop’s users.'}]},
  {kind: 'mal', threat: 'siphon', tech: 'T1003.001', tags: ['host'], story: true, rate: 12, group: 'a',
   title: 'Round 2: a dump of LSASS', host: 'CR-LT-15 · Clerks’ Row', enemy: {spr: 'siphon', pal: 'siphon'},
   clues: ['rundll32.exe ran comsvcs.dll’s MiniDump against LSASS on CR-LT-15.', 'The account was a help-desk admin account, signed in from CR-LT-06 ten minutes after Round 1.', 'The dump file was copied to a share before anyone noticed.'],
   truth: 'Credential dumping from LSASS memory, with an admin account the attacker took on CR-LT-06.',
   resp: [{label: 'Isolate CR-LT-15, reset and revoke every account that signed in there (the help-desk admin first), turn on the LSASS protection rule', good: true},
          {label: 'Delete the dump from the share and close', good: false, why: 'It has been copied; the credentials inside are what matter.'},
          {label: 'Reset only the clerk who uses CR-LT-15', good: false, why: 'The admin account is the prize. Every cached credential is exposed.'}],
   chain: [{at: 40, text: 'The help-desk admin account signs in to a third laptop.'}, {at: 75, text: 'It tries the domain controller.'}]},
  {kind: 'mal', threat: 'blinder', tech: 'T1685', tags: ['host'], story: true, rate: 11, group: 'a',
   title: 'Round 3: the lights go out', host: 'CR-LT-16 · Clerks’ Row', enemy: {spr: 'blinder', pal: 'blinder'},
   clues: ['Event 5001 on CR-LT-16 at 19:12: real-time protection disabled. No change ticket.', 'The command ran under the stolen help-desk admin account.', 'Tamper protection was off for that laptop group, so nothing blocked it.'],
   truth: 'Defense impairment: switching off protection before the next step (Disable or Modify Tools).',
   resp: [{label: 'Isolate CR-LT-16, turn protection and tamper protection on, disable the stolen admin account, hunt for what ran in the gap', good: true},
          {label: 'Turn protection back on and close', good: false, why: 'The account that did it is still active, and something ran in the gap.'},
          {label: 'Uninstall the antivirus and reinstall it everywhere', good: false, disrupt: 1}],
   chain: [{at: 40, text: 'A new service is created on CR-LT-16.'}, {at: 75, text: 'The same account turns off protection on CR-LT-14.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const CR_CARDS = [
  {id: 'segment', name: 'Isolate the laptop segment', csf: 'Respond', good: true, text: 'Cut the laptop network off from servers and other floors; keep the security tools connected.', fx: 'Stage 1: the worm spreads more slowly.'},
  {id: 'smb', name: 'Block SMB at the boundaries', csf: 'Protect', good: true, text: 'Block TCP 445 and 139 at every boundary device, as CISA advised during WannaCry, and between laptop segments.', fx: 'Stage 2: the worm moves more slowly.'},
  {id: 'pz', name: 'Find patient zero', csf: 'Respond', good: true, text: 'Work back from the first laptop that scanned port 445 to how the worm got in.', fx: 'Stage 1 starts with more evidence.'},
  {id: 'patch', name: 'Patch the flaw everywhere', csf: 'Protect', good: true, text: 'Push ADV-26-101 (game) to every laptop that missed it, and to offline laptops as soon as they reconnect.', fx: 'Stage 3 becomes much easier.'},
  {id: 'backup', name: 'Restore from offline backups', csf: 'Recover', good: true, text: 'Rebuild infected laptops and restore files from backups the worm could not reach.', fx: 'Recovery is faster; reputation up.'},
  {id: 'notify', name: 'Notify leadership', csf: 'Respond', good: true, text: 'Tell leadership what is happening, what you are doing and when you will update them.', fx: 'Reputation up.'},
  {id: 'ransom', name: 'Pay the ransom', csf: 'Respond', text: 'Pay for the decryption key.', fx: 'No guarantee of anything, and the worm is still spreading.'},
  {id: 'unplug', name: 'Shut down the whole town network', csf: 'Respond', text: 'Turn everything off until it’s over.', fx: 'Stops the worm and every service in town: uptime falls.'},
  {id: 'blockall', name: 'Block every domain the worm contacts', csf: 'Protect', text: 'Add everything in the worm’s code to the DNS block list.', fx: 'Includes its kill-switch domain: Stage 3 gets harder.'}
];

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  leastpriv: {name: 'Remove local admin rights', desc: 'Staff use standard accounts; IT uses separate admin accounts. Exceptions go through the help desk: the request is checked when it’s made, time-limited and logged.'},
  patchprio: {name: 'Patch by priority', desc: 'Known-exploited vulnerabilities first (CISA’s KEV list), then exposed, high-impact flaws, then the rest. A CVSS score rates severity; it doesn’t know whether anyone is exploiting the flaw or whether you even run the software.'},
  asr: {name: 'Attack surface reduction and application control', desc: 'Rules that block risky behaviour (Office starting other programs, credential theft from LSASS) and lists of what may run. Start in audit mode, review what would break, then block.'},
  pslog: {name: 'PowerShell script block logging', desc: 'Records the content of every PowerShell script block that runs, decoded, as event 4104 in Microsoft-Windows-PowerShell/Operational (PowerShell 7 writes to PowerShellCore/Operational). Forward it to the collector.'},
  hashhunt: {name: 'Hunt a hash fleetwide', desc: 'Search every host’s telemetry for a known-bad file hash, not just the one that alerted.'},
  triage: {name: 'Collect before you clean', desc: 'Take a triage package (logs, Prefetch, Amcache, tasks, processes) before deleting or reimaging, so the scope can still be answered later.'},
  tamperprot: {name: 'Tamper protection', desc: 'Keeps real-time protection, behaviour monitoring, cloud protection and exclusions from being switched off or changed, even through the registry or Group Policy.'},
  isolatemap: {name: 'Isolate only what’s affected', desc: 'Isolation stops spread and stops the user’s work. Isolate hosts with evidence of compromise; over-isolating clean hosts costs the town for nothing.'},
  smbblock: {name: 'Block SMB at boundaries', desc: 'Stop file-sharing traffic (TCP 445 and 139) crossing segment and network boundaries, so a worm can’t walk from one segment to the next.'},
  restore: {name: 'Restore from offline backups', desc: 'Backups the attacker can’t reach are what let you rebuild without paying. Test restores before you need them.'}
});
Object.assign(FACTS, {
  kev: {name: 'Known exploited first', desc: 'CISA’s Known Exploited Vulnerabilities (KEV) catalog lists flaws with a CVE ID, reliable evidence of active exploitation and a clear fix. Binding Operational Directive 22-01 makes US federal civilian agencies fix them on deadlines (two weeks by default; six months for CVEs assigned before 2021), and CISA strongly recommends that every organisation’s vulnerability management plan include a requirement to address KEV entries immediately. As CISA puts it, a CVSS base score “does not account for if the vulnerability is actually being used to attack systems.”', src: 'CISA KEV catalog; CISA BOD 22-01'},
  patchtue: {name: 'Patch Tuesday', desc: 'Microsoft publishes its monthly security update on the second Tuesday of each month (also called Update Tuesday), with out-of-band updates when a fix can’t wait.', src: 'Microsoft Learn, Windows update release cycle'},
  macros: {name: 'Internet macros blocked by default', desc: 'Microsoft changed Office on Windows to block VBA macros in files from the internet, using the Mark of the Web (ZoneId 3 in the file’s Zone.Identifier stream). Files saved to a Trusted Location skip that check, so audit your Trusted Locations.', src: 'Microsoft Learn, Macros from the internet are blocked by default in Office'},
  e8: {name: 'The Essential Eight', desc: 'Australia’s ASD lists eight mitigation strategies: patch applications, patch operating systems, multi-factor authentication, restrict administrative privileges, application control, restrict Microsoft Office macros, user application hardening and regular backups. Requests for privileged access are validated when first requested.', src: 'Australian Signals Directorate, Essential Eight'},
  asr_rules: {name: 'Attack surface reduction rules', desc: 'Microsoft Defender’s attack surface reduction rules include “Block all Office applications from creating child processes” and “Block credential stealing from the Windows local security authority subsystem”. Rules can run in audit mode first, then block.', src: 'Microsoft Learn, Attack surface reduction rules reference'},
  pslog4104: {name: 'Script block logging', desc: 'With script block logging on, Windows PowerShell 5.1 writes event 4104 to Microsoft-Windows-PowerShell/Operational with the content of every script block it processes. It is turned on by Group Policy (Administrative Templates > Windows Components > Windows PowerShell > Turn on PowerShell Script Block Logging). PowerShell 7 logs to PowerShellCore/Operational.', src: 'Microsoft Learn, about_Logging and about_Logging_Windows'},
  schtask_ev: {name: 'Scheduled task events', desc: 'Task Scheduler event 106 reads “The user "%2" registered the Task Scheduler task "%1"”. Security event 4698, “A scheduled task was created”, only appears where the Audit Other Object Access Events subcategory is enabled.', src: 'Microsoft Learn (event 106; Audit Other Object Access Events); CISA eviction strategies countermeasure CM0147'},
  defender_ev: {name: 'Defender events 5001, 5007, 5013', desc: 'In Windows Defender > Operational: 5001 “Real-time protection is disabled”, 5007 “The antimalware platform configuration changed” (with old and new values; Microsoft says to review it if unexpected, as it might be malware), and 5013 “Tamper protection blocked a change to Microsoft Defender Antivirus”. Tamper protection keeps real-time protection on and exclusions unchanged, even against registry or Group Policy changes.', src: 'Microsoft Learn, Defender Antivirus event IDs; Protect security settings with tamper protection'},
  sysmon: {name: 'Sysmon events', desc: 'Sysinternals Sysmon, installed separately, logs process creation with the full command line and file hash (event 1), processes opening other processes, such as LSASS (event 10), and file streams such as a browser’s Zone.Identifier “mark of the web” (event 15).', src: 'Microsoft Learn, Sysmon'},
  exec_art: {name: 'Execution artefacts', desc: 'Microsoft’s incident responders: Prefetch is generally reliable evidence of execution (last eight run times on Windows 8 and later) but is not enabled by default on Windows Server; Amcache cannot prove a binary executed, and its SHA-1 may cover only the first 30 MB; Shimcache can’t prove execution on Windows 10 or later and is written only at shutdown or restart.', src: 'Microsoft Incident Response, Guidance for Incident Responders'},
  wannacry: {name: 'WannaCry and the NHS (2017)', desc: 'WannaCry was released worldwide on Friday 12 May 2017. The UK National Audit Office found at least 81 of 236 NHS trusts in England affected, 603 primary care and other NHS organisations infected (595 of them GP practices), 6,912 appointments known cancelled and five A&E departments diverting patients. Infected organisations had unpatched or unsupported Windows. The NAO said it could have been prevented with basic IT security, and that a researcher activating a “kill switch” stopped it causing more disruption.', src: 'UK National Audit Office, Investigation: WannaCry cyber attack and the NHS (October 2017)'},
  ms17010: {name: 'MS17-010', desc: 'Microsoft’s bulletin MS17-010 (14 March 2017, rated Critical) fixed SMBv1 flaws that could allow remote code execution, two months before WannaCry. In guidance dated 13 May 2017, Microsoft also made the update available for Windows XP, Windows 8 and Windows Server 2003, platforms then in custom support only. CISA advised applying it, or else disabling SMBv1 and blocking TCP 445 and 139 at boundary devices, and asked admins not to block the kill-switch domain, because registering it had reduced the spread.', src: 'Microsoft Security Bulletin MS17-010; MSRC, Customer Guidance for WannaCrypt attacks; CISA alert TA17-132A'}
});
GAME_NOTES.push(
  'Clerks’ Row threats (Quill, Mimic, Cipher, Siphon, Blinder, Shade) join the alert mix with weights 5/3/4/3/3/2 once you reach Clerks’ Row; inside it they are three times as likely, and the Shield Badge halves Quill. Endpoint tools are strong against any threat that lives on a host. (game)',
  'Advisory IDs (ADV-26-xxx), their scores, the patch-triage weights (known-exploited items count double), laptop hostnames, tickets, hashes and the worm are invented. (game)',
  'Mean time to contain counts game seconds from the start of a real attack to your first containment (kill or isolate). Isolating a clean laptop costs uptime, reputation and two hours of someone’s work; isolating an infected one costs one hour. (game)',
  'All Clerks’ Row people, hosts, times and numbers are invented. The worm incident is retold in outline from WannaCry (2017); its details here are invented. (game)'
);
