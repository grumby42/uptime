/* ============================================================
   UPTIME · editions/town-hall/data.js
   Town Hall edition data: maps, buildings, people, ATT&CK techniques met here,
   threats, alert templates, briefings, dojo puzzles, tabletop cards, Field Manual text.
   ============================================================ */
'use strict';

/* ---------- Maps ---------- */
// Hub: Town Hall plaza, the Front Desk building (a), guest lounge (b), records office (c), annex (d),
// the firewall with the contractor's open port (O), the cabling route south to the Identity Board (I) and the Dojo (J).
const MAPS = {
  hub: {
    name: 'Town Hall · Front Desk district',
    rows: [
      "WWWWWWWWWWWWWW==WWWWWWWWWWWWWW",
      "WWWWWWWWWWWWWW==WWWWWWWWWWWWWW",
      "FFFFFFFFFFFFFFOOFFFFFFFFFFFFFF",
      "h111..........==........222KKh",
      "h1aaaa..bbbb..==..dddd..222KKh",
      "h1aaaa..bbbb..==..dddd...2KKKh",
      "h.aaDa..bbDb..==..ddDd.......h",
      "h.............==.............h",
      "h============================h",
      "h.S.cccc......==.............h",
      "h.X.ccDc......==......3333GGGh",
      "hhhhhhhhhhhhh.==.hhhhh3333GGGh",
      "hGGGGGGGGGGGG.==.GGGGGGGGGGGGh",
      "hGGGGGGGGGGGGGGGGGGGGGGGGGGGGh",
      "hGG..........GGGG.......GGGGGh",
      "hGG.IIII.GGGGGGGGGGGG.JJJJ..Gh",
      "hGG.IIII.GGGGGGGGGGGG.JJJJ..Gh",
      "hGG.IIDI.GGGGGGGGGGGG.JJDJ..Gh",
      "hGG......GGGGGGGGGGG.........h",
      "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
    ],
    doors: {'4,6':{to:'desk', x:9, y:9, dir:'up'}, '6,17':{to:'board', x:9, y:9, dir:'up'}, '24,17':{to:'dojo', x:9, y:9, dir:'up'},
            '10,6':{locked:'Guest lounge. Visitors wait here for their badges.'}, '20,6':{locked:'The Annex. The HVAC contractor works from here.'}, '6,10':{locked:'Records office. Owen keeps the archive here.'}},
    outdoor: true
  },
  desk: {
    name: 'Front Desk',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "wn,,,,,,,w,,,,,,,,,w",
      "w,,,,,,,,w,p,,p,,p,w",
      "w,,,,,,,,w,,,,,,,,,w",
      "w,,k,,,,,,,,,,,,,,,w",
      "wCCC,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,Y,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10':{to:'hub', x:4, y:7, dir:'down'}}
  },
  board: {
    name: 'Identity Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "wKK,,,,,,,,,,,,,,KKw",
      "wKK,,,,,,,,,,,,,,KKw",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10':{to:'hub', x:6, y:18, dir:'down'}}
  },
  dojo: {
    name: 'Password Cracking Dojo',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,q,,,q,,,q,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10':{to:'hub', x:24, y:18, dir:'down'}}
  }
};

/* ---------- Building groups (patch state) ---------- */
const GROUPS = {
  a: {name:'Front Desk', fix:'kiosk'},
  b: {name:'Guest lounge', fix:'wifi'},
  c: {name:'Records office', fix:'logs'},
  d: {name:'Annex', fix:'portDone'}
};

/* ---------- NPCs ---------- */
// cond(G) decides whether the NPC is present.
const NPCS = [
  {id:'rae', name:'Rae Okafor', role:'SOC lead', map:'desk', x:16, y:6, dir:'down', pal:'rae', acct:true},
  {id:'dee', name:'Dee Marsh', role:'reception', map:'desk', x:1, y:6, dir:'down', pal:'dee', acct:true},
  {id:'tomas', name:'Tomas Reyes', role:'IT technician', map:'desk', x:3, y:1, dir:'down', pal:'tomas', acct:true},
  {id:'lin', name:'Lin Zhao', role:'accounts', map:'desk', x:12, y:3, dir:'down', pal:'lin', acct:true},
  {id:'hal', name:'Hal Benning', role:'facilities', map:'hub', x:17, y:7, dir:'down', pal:'hal', acct:true},
  {id:'sam', name:'Sam Ortiz', role:'visitor', map:'hub', x:9, y:7, dir:'down', pal:'sam'},
  {id:'owen', name:'Owen Pike', role:'records clerk', map:'hub', x:8, y:10, dir:'left', pal:'owen', acct:true, cond:G=>G.day>=2},
  {id:'grace', name:'Grace Kim', role:'HR partner', map:'hub', x:12, y:9, dir:'down', pal:'grace', acct:true, cond:G=>G.day>=2},
  {id:'vex', name:'Vex', role:'red teamer', map:'hub', x:15, y:12, dir:'up', spr:'actor', pal:'actor', cond:G=>G.f.vexMet && !G.f.vexDone},
  {id:'marisol', name:'Marisol Diaz', role:'identity lead', map:'board', x:9, y:2, dir:'down', pal:'marisol', acct:true},
  {id:'imani', name:'Imani Brooks', role:'NCL coach', map:'dojo', x:9, y:5, dir:'down', pal:'imani', acct:true}
];
const ACCOUNTS_TOTAL = 12; // (game) staff accounts in the district, including the front-desk admin account

/* ---------- ATT&CK techniques (verified against attack.mitre.org, Oct 2026) ---------- */
const TECH = {
  'T1110.003': {name:'Brute Force: Password Spraying', tactic:['Credential Access'], desc:'Trying one or a few common passwords against many accounts, to stay under lockout limits.'},
  'T1566.004': {name:'Phishing: Spearphishing Voice', tactic:['Initial Access'], desc:'Phone calls, often posing as IT or a trusted company, that talk someone into giving access or running something.'},
  'T1566.002': {name:'Phishing: Spearphishing Link', tactic:['Initial Access'], desc:'A message with a link to a fake sign-in page or a malicious download.'},
  'T1595':     {name:'Active Scanning', tactic:['Reconnaissance'], desc:'Probing an organisation’s internet-facing addresses to learn what services are exposed.'},
  'T1133':     {name:'External Remote Services', tactic:['Initial Access','Persistence'], desc:'Using remote-access services reachable from the internet (remote desktop, VPN) to get in or stay in.'},
  'T1190':     {name:'Exploit Public-Facing Application', tactic:['Initial Access'], desc:'Abusing a flaw in an internet-facing app or device to get into the network.'},
  'T1621':     {name:'Multi-Factor Authentication Request Generation', tactic:['Credential Access'], desc:'Flooding a user with MFA approval prompts, hoping one gets approved.'},
  'T1684.001': {name:'Social Engineering: Impersonation', tactic:['Stealth'], desc:'Posing as a trusted person (an executive, a colleague, a help-desk agent) to get someone to act. The older ID T1656 now redirects here.'},
  'T1078':     {name:'Valid Accounts', tactic:['Initial Access','Persistence','Privilege Escalation','Stealth'], desc:'Signing in with real credentials that were stolen or guessed, so the activity looks legitimate.'},
  'T1078.001': {name:'Valid Accounts: Default Accounts', tactic:['Initial Access','Persistence','Privilege Escalation','Stealth'], desc:'Using built-in accounts and factory-default passwords that nobody changed.'},
  'T1098.005': {name:'Account Manipulation: Device Registration', tactic:['Persistence','Privilege Escalation'], desc:'Enrolling an attacker-controlled device (for example as an MFA device) on a compromised account to keep access.'}
};

/* ---------- Threats (wild alerts) ---------- */
const THREATS = {
  sprayer: {name:'Sprayer', tech:'T1110.003', spr:'sprayer', pal:'sprayer', tags:['identity'], bucket:'cred'},
  caller:  {name:'Caller', tech:'T1566.004', spr:'caller', pal:'caller', tags:['voice'], bucket:'phish'},
  lure:    {name:'Lure', tech:'T1566.002', spr:'lure', pal:'lure', tags:[], bucket:'phish'},
  prober:  {name:'Prober', tech:'T1595', spr:'prober', pal:'prober', tags:['recon'], bucket:'other'},
  pry:     {name:'Pry', tech:'T1190', spr:'pry', pal:'pry', tags:[], bucket:'vuln'},
  jamb:    {name:'Jamb', tech:'T1133', spr:'jamb', pal:'jamb', tags:['remote'], bucket:'story'}
};
// (game) malicious entry weights, from the 2025 Verizon DBIR initial-access shares: credentials 22, exploited vulnerability 20, phishing 16, other 42.
const MAL_WEIGHTS = [
  {t:'sprayer', w:22}, {t:'pry', w:20}, {t:'lure', w:10}, {t:'caller', w:6}, {t:'prober', w:42}
];

/* Alert templates: per threat, three possible truths. Clues are revealed by investigation. */
const HOSTS = ['FD-RECEPTION-02','FD-KIOSK-01','FD-STAFF-07','FD-STAFF-11','ANNEX-PC-03','FD-LAPTOP-14'];
const ALERTS = {
  sprayer: {
    rule:'Many failed sign-ins across accounts',
    mal:{clues:['Failures hit 40 different accounts in six minutes, two tries each: just under the lockout limit.','Every attempt comes from one hosting-provider address range never seen here before.','After the burst, one account (reception-02) signed in successfully from that range.'],
         truth:'Password spraying: one common password tried against many accounts. One account fell.',
         resp:[{label:'Reset reception-02, revoke its sessions, block the source range',good:true},{label:'Isolate every reception PC',good:false,disrupt:2},{label:'Lock all 40 accounts for a day',good:false,disrupt:1}]},
    benign:{clues:['Failures come from the office’s own network, spread over an hour.','Each account succeeded within a few tries, from its usual PC.','Passwords expired over the weekend; Monday morning staff are mistyping new ones.'],
         truth:'Benign: staff mistyping new passwords after a scheduled expiry.'},
    fp:{clues:['Every “failure” comes from the visitor kiosk, exactly every 15 minutes.','The event code is a session timeout, not a wrong password.','Nobody typed anything: it’s the kiosk’s scheduled auto-logout.'],
         truth:'False positive: the rule counted the kiosk’s auto-logout as failed passwords.'}
  },
  caller: {
    rule:'Staff report: suspicious “IT” phone call',
    mal:{clues:['Caller ID showed an outside number labelled with our company name.','The caller asked Dee to read back the sign-in code just texted to her.','The real help desk made no outbound calls today.'],
         truth:'Voice phishing: someone posing as IT tried to get a sign-in code over the phone.',
         resp:[{label:'Reset Dee’s password, check her sign-ins, warn staff',good:true},{label:'Isolate Dee’s PC',good:false,disrupt:2},{label:'Block all outside calls',good:false,disrupt:1}]},
    benign:{clues:['A help-desk ticket shows Lin asked a software vendor to call her back.','The number matches the vendor’s published support line.','The caller asked for nothing sensitive.'],
         truth:'Benign: a vendor support callback the user had requested.'},
    fp:{clues:['The alert came from a keyword rule on voicemail transcripts.','The trigger word was “urgent”.','The voicemail is a dentist’s appointment reminder.'],
         truth:'False positive: a keyword rule fired on an appointment reminder.'}
  },
  lure: {
    rule:'Link to a sign-in page clicked from email',
    mal:{clues:['The link’s domain is one letter off from ours and was registered two days ago.','The page asks for the password, then the MFA code.','Three other people received the same email.'],
         truth:'Spearphishing link: a look-alike sign-in page harvesting passwords and codes.',
         resp:[{label:'Reset the clicker’s password, purge the email, block the domain',good:true},{label:'Isolate the clicker’s laptop for a week',good:false,disrupt:2},{label:'Ban all links in email',good:false,disrupt:1}]},
    benign:{clues:['The email came from HR’s survey platform, announced last week.','The link’s domain is the platform’s real one.','It asks no passwords; sign-in goes through our own login page.'],
         truth:'Benign: a legitimate staff survey with tracking links.'},
    fp:{clues:['The rule fires on any URL containing the word “login”.','The URL is our own company sign-in page.','Every staff member hits this page daily.'],
         truth:'False positive: the rule matched our own login page.'}
  },
  prober: {
    rule:'Port sweep against public addresses',
    mal:{clues:['One source hits ports 22, 443 and 3389 on every public address, in sequence.','It then repeats only against the address that answered.','Requests look for a known remote-access login page.'],
         truth:'Active scanning: an outsider mapping what we expose, looking for a way in.',
         resp:[{label:'Block the source, confirm what is exposed, watch for follow-up',good:true},{label:'Take the website offline',good:false,disrupt:2},{label:'Ignore: scanning is just noise',good:false}]},
    benign:{clues:['The source is the address of our own vulnerability scanner.','A scan was scheduled for tonight in the change calendar.','It ran on time and stopped on time.'],
         truth:'Benign: our own scheduled vulnerability scan.'},
    fp:{clues:['The “scan” is many short DNS lookups.','They come from the guest Wi-Fi when a phone joins.','It’s normal phone behaviour; the rule threshold is too low.'],
         truth:'False positive: the rule mistook normal DNS lookups for a port scan.'}
  },
  pry: {
    rule:'Odd requests to the visitor kiosk web app',
    mal:{clues:['Requests put database commands into the visitor-name field.','The app version has a publicly known flaw that is not yet patched.','One request returned far more data than a normal page.'],
         truth:'Exploiting a public-facing app: injecting commands through a known flaw.',
         resp:[{label:'Block the source, patch the app, check what data was returned',good:true},{label:'Isolate the reception PCs',good:false,disrupt:2},{label:'Restart the kiosk and close it',good:false}]},
    benign:{clues:['Errors began right after an app update.','They come from visitors’ normal sign-in attempts.','The vendor confirmed a display bug in the new version.'],
         truth:'Benign: a buggy update causing harmless errors.'},
    fp:{clues:['The rule looks for the word “select” in requests.','The match is a menu label: “Select your host”.','Nothing unusual reached the database.'],
         truth:'False positive: a keyword rule matched a menu label.'}
  }
};
// Attacker progress lines for each wild threat's alerts (two steps along the chain).
const ALERT_CHAINS = {sprayer: ['More failures roll in across accounts.', 'A sprayed account signs in successfully.'],
    caller: ['A second employee reports the same call.', 'Someone read a code out loud; a new sign-in follows.'],
    lure: ['Two more people click the link.', 'A harvested password is used to sign in.'],
    prober: ['The scan narrows to one address.', 'Login attempts begin on the exposed service.'],
    pry: ['Requests start returning database rows.', 'A new file appears in the kiosk app folder.']};

/* ---------- Morning briefing items (retold, generic but accurate) ---------- */
const BRIEFS = [
  {t:'sprayer', text:'Attackers are spraying common passwords against remote email logins.', act:'Ban common passwords and check the lockout policy'},
  {t:'caller', text:'Callers posing as IT support are phoning staff and asking for sign-in codes.', act:'Remind staff: IT will never ask for your code'},
  {t:'lure', text:'Emails linking to look-alike sign-in pages are circulating.', act:'Warn staff and show the report-phishing button'},
  {t:'prober', text:'Internet-wide scans for exposed remote-access services are routine.', act:'Review which services face the internet'},
  {t:'pry', text:'Newly disclosed flaws in internet-facing apps are exploited quickly.', act:'Patch internet-facing apps first'}
];

/* ---------- Dojo puzzles ---------- */
const DOJO = [
  {q:'Which password space is biggest? (Each character chosen at random.)',
   opts:['8 characters from all 95 printable symbols','16 lowercase letters','10 letters and digits'], good:1,
   explain:'95^8 ≈ 6.6×10^15. 26^16 ≈ 4.4×10^22. 62^10 ≈ 8.4×10^17. Every extra character multiplies the space, so length wins. Current NIST guidance (SP 800-63B) favours longer passwords over composition rules.'},
  {q:'A site stores password hashes. When you sign in, how does it check your password?',
   opts:['It decrypts the stored hash and compares','It hashes what you typed and compares the two hashes','It emails your password to an admin'], good:1,
   explain:'A hash is a one-way fingerprint: the same input always gives the same output, and you can’t run it backwards. So the site hashes your attempt and compares fingerprints. Password storage uses deliberately slow hash functions.'},
  {q:'Two users both chose “sunshine1”. What does a unique random salt per user do?',
   opts:['Makes their stored hashes different, so precomputed tables and look-alike matches fail','Encrypts the password so it can be recovered','Turns a weak password into a strong one'], good:0,
   explain:'The salt is mixed in before hashing, so identical passwords produce different hashes and precomputed (rainbow) tables are useless. It does not make a guessable password hard to guess.'}
];

/* ---------- Boss tabletop cards (our own, written from ATT&CK/D3FEND-style actions) ---------- */
const CARDS = [
  {id:'reset', name:'Reset credentials', csf:'Respond', text:'Give the admin account a new long password now.', fx:'Stage 2 starts with less attacker progress.'},
  {id:'revoke', name:'Revoke sessions', csf:'Respond', text:'Sign the account out everywhere, killing any session the attacker holds.', fx:'Stage 2 attacker moves slower.'},
  {id:'mfa', name:'Enforce MFA', csf:'Protect', text:'Require a second factor for the admin account.', fx:'Stage 3 becomes much easier.'},
  {id:'logs', name:'Review sign-in logs', csf:'Detect', text:'Pull every sign-in for the account in the last 30 days.', fx:'Every stage starts with more evidence.'},
  {id:'isolate', name:'Isolate host', csf:'Respond', text:'Cut the admin’s workstation off the network.', fx:'Does not help: the attacker is using the account, not that PC.'},
  {id:'notify', name:'Notify leadership', csf:'Govern', text:'Tell leadership what happened, what you are doing, and when you’ll update them.', fx:'Reputation up; leadership is ready if it gets worse.'}
];

/* ---------- Field Manual ---------- */
const EXTRA_ACTIONS = {
  passphrase:{name:'Replace default credentials', desc:'Change factory-default passwords to long, unique ones kept in a password vault.'},
  segment:{name:'Network segmentation', desc:'Put guest devices on their own network that can reach the internet but not staff systems.'},
  logging:{name:'Enable security logging', desc:'Turn on event logs and forward them to a central collector so investigations have evidence.'},
  numbermatch:{name:'Number-matching MFA prompts', desc:'The user must type a number shown on the sign-in screen, so blindly approving a push does not work.'},
  callback:{name:'Call-back verification', desc:'Verify a caller by hanging up and calling the number on file, never one they give you.'},
  insider:{name:'Insider-risk referral', desc:'Report concerning behaviour factually to the insider-risk process (HR, legal, security). One sign proves nothing; don’t investigate on your own.'}
};
const FACTS = {
  dbir_ia:{name:'How breaches start (2025)', desc:'In the 2025 Verizon Data Breach Investigations Report, the top known initial access vectors were credential abuse (22%), exploitation of vulnerabilities (20%) and phishing (16%).', src:'Verizon 2025 DBIR'},
  dbir_rw:{name:'Ransomware and smaller organisations (2025)', desc:'The 2025 Verizon DBIR found ransomware in 88% of breaches at small and medium-sized organisations, compared with 39% at large ones.', src:'Verizon 2025 DBIR'},
  fp:{name:'Alert fatigue (2021)', desc:'In Critical Start’s 2021 survey of 100 SOC professionals, 68% said 25–75% of the alerts they investigate each day are false positives.', src:'Critical Start, 2021 SOC survey'},
  nist:{name:'Length beats complexity', desc:'NIST SP 800-63B (digital identity guidelines) favours longer passwords and tells verifiers not to impose composition rules such as “one symbol, one digit”.', src:'NIST SP 800-63B'}
};
const GAME_NOTES = [
  'Alert mix before tuning: 50% false positive, 30% benign but real, 20% malicious. (game)',
  'Malicious alerts are weighted 22 credentials / 20 exploited vulnerability / 16 phishing / 42 other, borrowing the DBIR shares. (game)',
  'Class strengths: Endpoint vs Execution/Persistence/Privilege Escalation; Network vs C2/Lateral Movement/Exfiltration/remote services/scanning; Logging vs Discovery/Credential Access once logs are on; Identity vs Credential Access and account abuse. Strong ×2, weak ×0.5. (game)',
  'District uptime, reputation, building health, MFA coverage (12 accounts) and all character names are invented. (game)',
  'Automation risk “about 1 in 50 auto-closed alerts may be real” is an invented number. (game)'
];

/* ---------- Debriefs ---------- */
const VEX_EXPLAIN = [
  ['T1595','First I scanned your public addresses (Active Scanning, T1595). The Annex was answering on remote desktop until you closed it, so I went to people instead.'],
  ['T1566.002','Then I emailed Lin a link to a sign-in page one letter off from yours (Spearphishing Link, T1566.002).'],
  ['T1078','With her password I signed in like a normal user (Valid Accounts, T1078). That is why it looked quiet: real credentials make real-looking logs.']
];
