/* ============================================================
   UPTIME · editions/town-hall/market-data.js
   Town Hall district 4, Market Square (the DMZ): the only district that faces
   the internet. Art, map, people, ATT&CK techniques met here, threats, alert
   templates, briefings, the internet-facing asset inventory, the WAF rule
   review (mini-game), payment page scripts, investigation drills, the Web
   Application Security Dojo, the Web Board and the skimming-incident cards,
   Field Manual text. It extends the earlier districts' tables; the only change
   to their data is a building on the plaza (marked).
   People, hosts, domains (.example), addresses (RFC 5737), tickets, advisories,
   vendor notices, times and numbers are invented (game). Real facts are cited
   in CREDITS.md, section "Market Square".
   ATT&CK IDs verified on attack.mitre.org on 28 October 2026 (ATT&CK v20).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
Object.assign(S, {
  slipquote: ["0000000000000000","0000011111100000","0000122222210000","0001224224221000","0001221221221000","0001222222221000","0001223333221000","0000122222210000","0000012222210000","0000001222210000","0000001222100000","0000012221000000","0000122100000000","0001110000000000","0000000000000000","0000000000000000"],
  climber: ["0000000000000000","0000000000110000","0000000001221000","0000000012421000","0001100012221000","0012210122210000","0012321222100000","0001122222100000","0000122222110000","0000122122121000","0001221012211000","0012210001210000","0111333301110000","0133333333331000","0111111111111000","0000000000000000"],
  stuffer: ["0000000000000000","0000001111000000","0000014334100000","0000001331000000","0000112222110000","0001222222221000","0012242222422100","0012222222222100","0012231221322100","0012231221322100","0012222222222100","0012332332332100","0001222222221000","0000111111110000","0000000000000000","0000000000000000"],
  shellback: ["0000000000000000","0000000000000000","0000001111100000","0000112222211000","0001223333322100","0012231111132100","0012314144413210","0012311111113210","0012233333332210","0112222222222110","1411111111111114","1221001221001221","0110000110000110","0000000000000000","0000000000000000","0000000000000000"],
  skimlet: ["0000000000000000","0000000000000000","0011111111111100","0013333333333100","0011111111111100","0012222222222100","0012442244222100","0012112211222100","0012222222222100","0012343434322100","0011212121211100","0001010101010000","0000000000000000","0000000000000000","0000000000000000","0000000000000000"],
  crawler: ["0000000000000000","0010000000000100","0001000110001000","0000101221010000","0011012222101100","0000124224210000","0111222222221110","0000122332210000","0011223333221100","0100122222210010","0001001221001000","0010001001000100","0000000000000000","0000000000000000","0000000000000000","0000000000000000"],
  stampede: ["0000000000000000","0110000000000110","0131000000001310","0013100000013100","0001211111121000","0001222222221000","0012242222422100","0012212222122100","0012222222222100","0001223333221000","0001231331321000","0001223333221000","0000122222210000","0000011111100000","0000000000000000","0000000000000000"],
  shroud: ["0000000000000000","0000001111000000","0000112222110000","0001222222221000","0001221111221000","0012214114122100","0012211111222210","0012222222222100","0012322222232100","0122322222232210","0122332222332210","0122233333322210","0122222222222210","0011111111111100","0000000000000000","0000000000000000"],
  mirrorcoat: ["0000004004000000","0000001111000000","0000112222110000","0001222222221000","0001221111221000","0012214114122100","0012211111122100","0012214444122100","0012314334132100","0122314444132210","0122311111132210","0122233333322210","0122222222222210","0011111111111100","0040000000000400","0000000000000000"],
  webpaths: ["3333333333333333","3331333333313333","3312133333121333","3122213331222133","3312133333121333","3331333323313333","3333333232333333","3333332333233333","3333323333323333","3333233333332333","3331333333333133","3312133333331213","3122213333312221","3312133333331213","3331333333333133","3333333333333333"],
  stall: ["1111111111111111","1424242424242421","1242424242424241","1111111111111111","0100000000000010","0100000000000010","0100000000000010","1111111111111111","1333333333333331","1322334433223331","1333333333333331","1111111111111111","1222222222222221","1222222222222221","1222222222222221","1111111111111111"]
});
Object.assign(PAL, {
  slipquote: ['#141414', '#2f74b5', '#9fc4f0', '#ffd96a'],
  climber: ['#141414', '#5b4a42', '#c98a54', '#ff4d6d'],
  stuffer: ['#141414', '#8a4b2f', '#e58a5c', '#ffd96a'],
  shellback: ['#141414', '#2f6e3e', '#a6d96a', '#ff4d6d'],
  skimlet: ['#141414', '#5a2a6e', '#c49ae0', '#ff4d6d'],
  crawler: ['#141414', '#3a4a6b', '#8b93a7', '#9ff0c8'],
  stampede: ['#141414', '#4a1414', '#b8432f', '#ffd96a'],
  shroud: ['#1b2233', '#3a4a6b', '#9fc4f0', '#ffd96a'],
  mirrorcoat: ['#1b2233', '#2f4f8a', '#d7dbe4', '#9ff0c8'],
  webpaths: ['#1f3d2b', '#5a6f8a', '#b9cce6', '#2f6e3e'],
  stall: ['#3b2418', '#d94f70', '#f2e3c6', '#c98a54'],
  marketDark: ['#2a2523', '#3a4a6b', '#5b4a42', '#6e7a8a'],
  marketBld: ['#1b2233', '#2f6e3e', '#a6d96a', '#ffd96a'],
  wafBox: ['#1b2233', '#4a1414', '#b8432f', '#e58a5c'],
  wafOn: ['#1b2233', '#2f4f8a', '#9fc4f0', '#9ff0c8'],
  webSrv: ['#1b2233', '#3a4a6b', '#7fa2d6', '#ffd96a'],
  payKiosk: ['#1b2233', '#5b4a42', '#2f74b5', '#ffd96a'],
  webDesk: ['#1b2233', '#5b3a26', '#a8703f', '#9fc4f0'],
  webDojo: ['#1b2233', '#0b2b33', '#7cc6c4', '#ff9f43'],
  wboard: ['#1b2233', '#5a2a6e', '#c49ae0', '#ffd96a'],
  testBox: ['#2a2523', '#5b4a42', '#8c7b70', '#b8432f'],
  dmzRack: ['#1b2233', '#3a4a6b', '#8b93a7', '#e58a5c'],
  paz: ['#1a1a2e', '#3b2418', '#c98a54', '#2f6e3e'],
  rafe: ['#1a1a2e', '#c0a040', '#f2c7a0', '#3a4a6b'],
  oona: ['#1a1a2e', '#8a4b2f', '#f0c8a0', '#c49ae0'],
  kit: ['#1a1a2e', '#141414', '#8a5a3c', '#ff9f43'],
  sol: ['#1a1a2e', '#2b1d16', '#7a4a2c', '#ffd96a'],
  bram: ['#1a1a2e', '#d7dbe4', '#f2c7a0', '#4a1414']
});
Object.assign(TILES, {
  'Q': {spr: 'B', pal: 'marketDark', solid: true},                   // Market Square building (hub); lit after the Lantern Badge
  'A': {spr: 'K', pal: 'wafBox', solid: true},                       // the WAF box: everything from the internet passes it
  'N': {spr: 'K', pal: 'webSrv', solid: true},                       // the town website server (CMS)
  'Z': {spr: 'kiosk', pal: 'payKiosk', solid: true, under: '.'},     // the payments portal
  'e': {spr: 'pc', pal: 'webDesk', solid: true, under: ','},         // web team desks
  'j': {spr: 'pc', pal: 'webDojo', solid: true, under: '.'},         // Web Application Security Dojo terminals
  'U': {spr: 'K', pal: 'wboard', solid: true},                       // Web Board racks
  'z': {spr: 'webpaths', pal: 'webpaths', grass: true},              // unmonitored web paths: trip alerts
  't': {spr: 'K', pal: 'testBox', solid: true},                      // the forgotten test site's box
  's': {spr: 'stall', pal: 'stall', solid: true},                    // market stalls
  'v': {spr: 'K', pal: 'dmzRack', solid: true}                       // DMZ firewall and log rack
});

/* ---------- Tools: the Shroud line (web application firewall) ---------- */
// Network tools are strong against threats aimed at public web services ('web' tag). (game)
CLASSES.network.strongTags = (CLASSES.network.strongTags || []).concat(['web']);
Object.assign(TOOLS, {
  shroud: {name: 'Shroud', cls: 'network', sub: 'WAF', spr: 'shroud', blurb: 'A cloaked doorkeeper between the plaza and the internet. Reads every request before the website does.',
           abil: ['reqlog', 'wafrule', 'ratelimit', 'flow']},
  mirrorcoat: {name: 'Mirrorcoat', cls: 'network', sub: 'WAF + page integrity', spr: 'mirrorcoat', blurb: 'Shroud with a mirror sewn in: it also sees the payment page the way residents’ browsers receive it.',
               abil: ['reqlog', 'wafrule', 'ratelimit', 'integrity']}
});
Object.assign(ABIL, {
  reqlog: {name: 'Request log', type: 'inv', cost: 2, ev: 22, desc: 'Read the web server and WAF logs for the requests in the alert: method, path, status code and response size.'},
  wafrule: {name: 'Virtual patch', type: 'con', cost: 2, dw: 22, ev: 6, disrupt: 1, desc: 'Add a narrow WAF rule that blocks this exact attack pattern while the code is fixed. A patch on the WAF is not a fix in the code.'},
  ratelimit: {name: 'Rate limit', type: 'con', cost: 2, dw: 20, ev: 4, disrupt: 1, desc: 'Slow requests per address or per account (HTTP 429, Too Many Requests) so automated attacks stall. Set it too low and residents get locked out.'},
  integrity: {name: 'Page integrity check', type: 'inv', cost: 2, ev: 26, desc: 'Compare the payment page and its scripts, as a browser receives them, with the approved inventory.'}
});

/* ---------- Map: Market Square, the Web Board, and a building on the plaza ---------- */
// Row 0 is the internet. Every request reaches the plaza through the WAF box (row 1) and down the road.
Object.assign(MAPS, {
  market: {
    name: 'Market Square',
    rows: [
      "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW",
      "hhhhhhhhhhhhhhAAhhhhhhhhhhhhhh",
      "hzzzz.........==........zzzzzh",
      "hzzzz..NNN....==...ZZ...zzzzzh",
      "h.zz...NNN....==...ZZ.....zzzh",
      "h......v......==.............h",
      "h============================D",
      "h.............==.............h",
      "hwwwwwww,wwww.==..t..........h",
      "hw,e,e,,,,,,w.==.............h",
      "hw,,,,,,,,,,w.==....j.j.j....h",
      "hw,,,,,,Y,,,w.==.............h",
      "hwwwwwwwwwwww.==.............h",
      "h.............==.....ss.ss...h",
      "h.............==.............h",
      "hhhhhhhhhhhhhhEhhhhhhhhhhhhhhh"
    ],
    doors: {'14,15': {to: 'hub', x: 26, y: 7, dir: 'down'}, '29,6': {to: 'wboard', x: 9, y: 9, dir: 'up'}},
    outdoor: true
  },
  wboard: {
    name: 'Web Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "wUU,,,,,,,,,,,,,,UUw",
      "wUU,,,,,,,,,,,,,,UUw",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'market', x: 28, y: 6, dir: 'left'}}
  }
});
// The one change to earlier data: a Market Square building by the firewall, north-east of the plaza.
// Its door opens with the Shield Badge.
MAPS.hub.rows[4] = "h1aaaa..bbbb..==..dddd..QQQQKh";
MAPS.hub.rows[5] = "h1aaaa..bbbb..==..dddd..QQQQKh";
MAPS.hub.rows[6] = "h.aaDa..bbDb..==..ddDd..QQDQ.h";
MAPS.hub.doors['26,6'] = {to: 'market', x: 14, y: 14, dir: 'up',
  get locked() { return (typeof G !== 'undefined' && G && G.f.crShield) ? undefined : 'Market Square. A note on the door: “Staff with a Shield Badge only.”'; }};

const MK_MAPS = ['market', 'wboard'];
const MK_HOSTS = ['WEB-01 · www.townhall.example', 'PAY-01 · pay.townhall.example', 'PORTAL-01 · portal.townhall.example'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'paz', name: 'Paz Delgado', role: 'digital services lead', map: 'market', x: 17, y: 7, dir: 'down', pal: 'paz'},
  {id: 'rafe', name: 'Rafe Lindgren', role: 'web developer', map: 'market', x: 4, y: 10, dir: 'down', pal: 'rafe'},
  {id: 'oona', name: 'Oona Quist', role: 'payments officer', map: 'market', x: 21, y: 4, dir: 'left', pal: 'oona'},
  {id: 'kit', name: 'Kit Moreau', role: 'web security coach', map: 'market', x: 26, y: 10, dir: 'left', pal: 'kit'},
  {id: 'bram', name: 'Councillor Bram Whitlock', role: 'town council', map: 'market', x: 20, y: 14, dir: 'up', pal: 'bram', cond: G => !!(G.f.mkWafBlock)},
  {id: 'sol', name: 'Sol Achebe', role: 'web security lead', map: 'wboard', x: 9, y: 2, dir: 'down', pal: 'sol'}
);
const MK_NPC_IDS = ['paz', 'rafe', 'oona', 'kit', 'bram', 'sol'];

/* ---------- ATT&CK techniques met in Market Square (verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20) ---------- */
Object.assign(TECH, {
  'T1110.004': {name: 'Brute Force: Credential Stuffing', tactic: ['Credential Access'], desc: 'Trying username and password pairs leaked from other sites’ breaches, betting that people reuse passwords.'},
  'T1505.003': {name: 'Server Software Component: Web Shell', tactic: ['Persistence'], desc: 'A script planted on a public web server that runs the attacker’s commands, giving a way back into the network.'},
  'T1059.007': {name: 'Command and Scripting Interpreter: JavaScript', tactic: ['Execution'], desc: 'Running attacker JavaScript, often in web pages. ATT&CK lists FIN6 using malicious JavaScript to steal payment card data from e-commerce sites: a skimmer.'},
  'T1595.002': {name: 'Active Scanning: Vulnerability Scanning', tactic: ['Reconnaissance'], desc: 'Probing internet-facing services for software versions and known weaknesses. Reconnaissance: it looks, it doesn’t get in.'},
  'T1499.002': {name: 'Endpoint Denial of Service: Service Exhaustion Flood', tactic: ['Impact'], desc: 'Flooding a service, such as a website with HTTP requests, until it can’t answer real users. Floods that fill the network link instead are T1498, Network Denial of Service.'},
  'T1550.004': {name: 'Use Alternate Authentication Material: Web Session Cookie', tactic: ['Lateral Movement'], desc: 'Reusing a stolen web session cookie to act as a signed-in user, with no password and no new MFA prompt.'}
});

/* ---------- Threats (wild alerts) ---------- */
// Scanning (Crawler) is reconnaissance, not an incident: it is only malicious when exploitation attempts follow it.
Object.assign(THREATS, {
  slipquote: {name: 'Slipquote', tech: 'T1190', spr: 'slipquote', pal: 'slipquote', tags: ['web'], bucket: 'vuln', district: 'market'},
  climber: {name: 'Climber', tech: 'T1190', spr: 'climber', pal: 'climber', tags: ['web'], bucket: 'vuln', district: 'market'},
  stuffer: {name: 'Stuffer', tech: 'T1110.004', spr: 'stuffer', pal: 'stuffer', tags: ['web', 'identity'], bucket: 'cred', district: 'market'},
  shellback: {name: 'Shellback', tech: 'T1505.003', spr: 'shellback', pal: 'shellback', tags: ['web', 'host'], bucket: 'vuln', district: 'market'},
  skimlet: {name: 'Skimlet', tech: 'T1059.007', spr: 'skimlet', pal: 'skimlet', tags: ['web'], bucket: 'other', district: 'market'},
  crawler: {name: 'Crawler', tech: 'T1595.002', spr: 'crawler', pal: 'crawler', tags: ['web', 'recon'], bucket: 'other', district: 'market'},
  stampede: {name: 'Stampede', tech: 'T1499.002', spr: 'stampede', pal: 'stampede', tags: ['web'], bucket: 'other', district: 'market'}
});
// (game) base weights for the Market Square threats; they only enter the mix once you reach Market Square.
MAL_WEIGHTS.push({t: 'slipquote', w: 4}, {t: 'climber', w: 3}, {t: 'stuffer', w: 4}, {t: 'shellback', w: 2}, {t: 'skimlet', w: 2}, {t: 'crawler', w: 3}, {t: 'stampede', w: 2});
const MK_HOME = ['slipquote', 'climber', 'stuffer', 'shellback', 'skimlet', 'crawler', 'stampede'];

Object.assign(ALERTS, {
  slipquote: {
    rule: 'SQL injection pattern in a request',
    mal: {clues: ['Requests to /portal/search carry “UNION SELECT” in the search box.', 'Hundreds of 500 errors, then one 200 response forty times bigger than a normal search page.', 'The database log shows that one query returned rows from the residents table.'],
          truth: 'Exploit Public-Facing Application: SQL injection that worked once, and data left.',
          resp: [{label: 'Block the pattern at the WAF, fix the query with parameters, preserve the logs, and scope exactly which rows left', good: true},
                 {label: 'Block the source address and close', good: false, why: 'The flaw is still in the code, and the next request comes from a new address.'},
                 {label: 'Take every town website offline', good: false, disrupt: 2}]},
    benign: {clues: ['The source is the penetration tester the town hired this month.', 'The test is in a ticket, with this address and this week’s dates agreed.', 'Every response was a normal error page; the tester reports the field as safe.'],
             truth: 'Benign: an authorised penetration test, inside its agreed scope.'},
    fp: {clues: ['The match is a permit description: “please select a date for the inspection”.', 'The words “select” and “date” tripped a keyword rule.', 'A normal 200 response of the usual size.'],
         truth: 'False positive: a keyword rule matched ordinary English.'}
  },
  climber: {
    rule: 'Path traversal (../) in a request',
    mal: {clues: ['GET /docs/view?file=../../../../etc/passwd from an outside address.', 'The response is a 200 of 1,843 bytes. A normal agenda PDF is 200 KB or more.', 'The document viewer opens any file name it is given, relative to its folder.'],
          truth: 'Exploit Public-Facing Application: path traversal read a system file through the document viewer.',
          resp: [{label: 'Block ../ and its encodings at the WAF, fix the viewer to open only files on its list, check what else was read', good: true},
                 {label: 'Rename the agenda folder', good: false, why: 'The viewer will still open whatever path it is handed.'},
                 {label: 'Shut down the document viewer for a month', good: false, disrupt: 1}]},
    benign: {clues: ['The source is the town’s own vulnerability scanner, on its weekly schedule from the IT network.', 'It tries ../ against every parameter, as it does every week.', 'Every response was a 404 or the WAF’s 403: nothing was read.'],
             truth: 'Benign: our own authorised scan. Nothing was read.'},
    fp: {clues: ['The match is a file called “minutes..final.pdf”.', 'Two dots in a file name tripped the rule.', 'A normal 200 response with the minutes PDF.'],
         truth: 'False positive: two dots in a file name, not a path.'}
  },
  stuffer: {
    rule: 'Many sign-in failures on the resident portal',
    mal: {clues: ['3,900 sign-ins in 15 minutes from 1,700 addresses, two or three each.', 'The usernames and passwords match a breach of another site, not ours.', '61 accounts got in: residents who reused that password.'],
          truth: 'Credential stuffing: passwords leaked elsewhere, tried here.',
          resp: [{label: 'Reset and sign out the accounts that got in, tell those residents, turn on MFA and breached-password checks, limit attempts per account', good: true},
                 {label: 'Block the 1,700 addresses', good: false, why: 'Rented proxy networks rotate addresses. Block lists alone are easy to get around.'},
                 {label: 'Lock every resident account', good: false, disrupt: 2}]},
    benign: {clues: ['The portal forced a password change last night.', 'Failures come from residents’ usual addresses, a few each.', 'Nearly every one succeeds within three tries.'],
             truth: 'Benign: residents mistyping new passwords after a forced change.'},
    fp: {clues: ['Every failure is the same test account, once a minute.', 'It is the uptime monitor’s synthetic sign-in check.', 'Its password expired at midnight.'],
         truth: 'False positive: the monitor’s test account, failing on schedule.'}
  },
  shellback: {
    rule: 'New script file in a web folder',
    mal: {clues: ['A new file, avatar.php, appeared in the portal’s uploads folder.', 'The web server process started /bin/sh, then a download tool, to an outside address.', 'Requests to avatar.php carry commands in a parameter.'],
          truth: 'Server Software Component: Web Shell. Someone can run commands on the web server.',
          resp: [{label: 'Cut the server off from the internal network, preserve the shell and logs, remove it, compare files with the release list, revoke sessions, rotate secrets', good: true},
                 {label: 'Delete avatar.php and close', good: false, why: 'Preserve it first, find how it got there, and look for others.'},
                 {label: 'Rebuild every server in town', good: false, disrupt: 2}]},
    benign: {clues: ['Rafe deployed this month’s CMS update at 14:00 under a change ticket.', 'The new .php files are in the plugins folder, not uploads.', 'Their hashes match the vendor’s release list.'],
             truth: 'Benign: a ticketed CMS update.'},
    fp: {clues: ['The match is “seashell.php.txt”, a theme designer’s notes.', 'It isn’t executable and nothing ran.', 'The rule matches “shell” anywhere in a file name.'],
         truth: 'False positive: a word in a file name.'}
  },
  skimlet: {
    rule: 'Payment page changed (tamper check)',
    mal: {clues: ['The payment page as browsers receive it now loads an extra script from metrics-cdn.example.', 'No change ticket; the town has never used that domain.', 'The script reads the card fields and sends them to that domain as residents type.'],
          truth: 'A skimmer: malicious JavaScript stealing card details from the payment page.',
          resp: [{label: 'Switch card entry to the processor’s hosted page, preserve the script and logs, remove it, establish the exposure window, tell the processor', good: true},
                 {label: 'Delete the script and carry on', good: false, why: 'Without evidence you can’t say who was affected, and you haven’t found how it got there.'},
                 {label: 'Block the domain at the WAF and keep the page up', good: false, why: 'The skimmer runs in residents’ browsers and sends straight to the attacker. That traffic never passes the WAF.'}]},
    benign: {clues: ['The new script comes from the processor’s new address.', 'A change ticket, approved yesterday, cites the processor’s notice.', 'The notice on the processor’s portal names the same address.'],
             truth: 'Benign: an approved vendor change. Update the script inventory.'},
    fp: {clues: ['The only difference is the nonce value in the script tags and the CSP header.', 'A CSP nonce is meant to be fresh every time the page is sent.', 'The check was set up to compare it.'],
         truth: 'False positive: the check compared a value that changes on every load by design.'}
  },
  crawler: {
    rule: 'Vulnerability scan against public sites',
    mal: {clues: ['One source checks every public site for old CMS versions and known admin paths.', 'It finds an admin login page someone left reachable, and goes straight to it.', 'It starts trying the CMS’s default password there: the scan has become an attempt to get in.'],
          truth: 'Scanning followed by an attempt to get in. The scan alone is reconnaissance; the default-password attempts are the attack.',
          resp: [{label: 'Take the exposed site off the internet, check the login attempts, confirm nothing else is exposed, watch for follow-up', good: true},
                 {label: 'Block the scanner’s address and close', good: false, why: 'It can switch addresses; the exposed login page is still there.'},
                 {label: 'Ignore: scanning is just noise', good: false, why: 'The scan was noise; the login attempts after it are not.'}]},
    benign: {clues: ['The source is a well-known internet-wide research scanner.', 'It touched each public site once, read the banners, and moved on.', 'No login attempts followed.'],
             truth: 'Benign: routine internet-wide scanning. Reconnaissance, not an incident: confirm nothing unexpected is exposed.'},
    fp: {clues: ['The “scan” is the town’s own uptime monitor.', 'It checks the same five pages every minute.', 'The rule’s threshold is too low.'],
         truth: 'False positive: our own monitor.'}
  },
  stampede: {
    rule: 'Traffic spike on the payments site',
    mal: {clues: ['600 requests a second to pay.townhall.example from 3,000 addresses.', 'Each asks for the same page with a random query string, so the cache can’t help.', 'No browser behaviour: no images, no scripts, one identical header set.'],
          truth: 'Endpoint Denial of Service: an HTTP flood exhausting the payments site.',
          resp: [{label: 'Turn on the provider’s DDoS protection, rate-limit the flood pattern, keep a way for residents to pay, tell residents', good: true},
                 {label: 'Block every address outside the country', good: false, disrupt: 1, why: 'Floods come from everywhere, including next door, and residents abroad can’t pay.'},
                 {label: 'Wait for it to stop', good: false}]},
    benign: {clues: ['The council-tax reminder email went out at 09:00.', 'Real browsers: pages, images, scripts, payments completing.', 'The curve drops off by 11:00.'],
             truth: 'Benign: a flash crowd. Residents paying after the reminder. Scale up; don’t block them.'},
    fp: {clues: ['The “spike” is the web team’s load test.', 'It is in a change ticket for 07:00–07:30.', 'It ran from the test network, as booked.'],
         truth: 'False positive: a booked load test.'}
  }
});
Object.assign(ALERT_CHAINS, {
  slipquote: ['The injection tries another table.', 'A second large response leaves the server.'],
  climber: ['The requests reach the web server’s configuration file.', 'A database password from that file is tried.'],
  stuffer: ['More accounts fall.', 'A taken-over account changes its bank details for refunds.'],
  shellback: ['The shell lists the internal network.', 'It tries the database server.'],
  skimlet: ['More residents pay through the page.', 'The skimmer’s domain receives another batch of cards.'],
  crawler: ['The scan narrows to the old test site.', 'Default-password attempts begin on its login page.'],
  stampede: ['The payments site slows to 20 seconds a page.', 'Residents start phoning the payments office.']
});

/* ---------- Morning briefing items (Market Square) ---------- */
const MK_BRIEFS = [
  {t: 'slipquote', text: 'Automated SQL injection tools are hitting search boxes on local government sites.', act: 'Check every search box uses parameterised queries'},
  {t: 'climber', text: 'Document viewers that open any path they are given are being abused to read system files.', act: 'Make the document viewer open only files on its list'},
  {t: 'stuffer', text: 'A large shopping-site breach is being replayed against other sites’ logins.', act: 'Turn on breached-password checks for the resident portal'},
  {t: 'shellback', text: 'CMS upload flaws are being used to drop web shells.', act: 'Stop the uploads folder from running scripts'},
  {t: 'skimlet', text: 'Skimmers are being injected into payment pages through compromised scripts and accounts.', act: 'Review the payment page script inventory'},
  {t: 'crawler', text: 'Internet-wide scans for forgotten admin pages are routine.', act: 'Review the internet-facing asset inventory'},
  {t: 'stampede', text: 'HTTP floods are being aimed at public payment sites.', act: 'Confirm the provider’s DDoS protection is ready to switch on'}
];

/* ---------- Fieldwork: the internet-facing asset inventory ---------- */
// What the town exposes to the internet (game). No single source lists all seven.
const MK_ASSETS = [
  {id: 'www', name: 'www.townhall.example (the town website, CMS)'},
  {id: 'pay', name: 'pay.townhall.example (the payments portal)'},
  {id: 'portal', name: 'portal.townhall.example (the resident portal)'},
  {id: 'mail', name: 'mail.townhall.example (the mail gateway)'},
  {id: 'vpn', name: 'vpn.townhall.example (the contractor VPN from the Front Desk)'},
  {id: 'test', name: 'test.townhall.example (an old test copy of the website, at an outside hosting company)'},
  {id: 'wafadmin', name: '198.51.100.44 port 8443 (the WAF’s own admin page, no DNS name)'}
];
const MK_SOURCES = [
  {id: 'sheet', name: 'IT’s asset spreadsheet', finds: ['www', 'pay', 'portal', 'mail'], note: 'Last updated two years ago (game).'},
  {id: 'dns', name: 'DNS zone for townhall.example', good: true, finds: ['www', 'pay', 'portal', 'mail', 'vpn', 'test'], note: 'Every name the town publishes, wherever it is hosted.'},
  {id: 'ct', name: 'Certificate Transparency logs', finds: ['www', 'pay', 'portal', 'vpn', 'test'], note: 'Public logs of the TLS certificates issued for our names.'},
  {id: 'scan', name: 'An authorised scan of the town’s own public addresses', good: true, finds: ['www', 'pay', 'portal', 'mail', 'vpn', 'wafadmin'], note: 'Finds what answers on our addresses, named or not. It can’t see a site hosted elsewhere.'},
  {id: 'nat', name: 'Firewall rules that let the internet in', finds: ['www', 'pay', 'portal', 'mail', 'vpn', 'wafadmin'], note: 'Every opening in our own firewall.'}
];

/* ---------- Fieldwork: payment page scripts (PCI DSS 6.4.3) ---------- */
const MK_SCRIPTS = [
  {id: 'pay', name: '/js/pay.js (ours)', what: 'Draws the card form and sends it to the processor.', good: 'keep', why: 'Needed: it is the payment form. Ours, so it is covered by our own change control and the tamper check.'},
  {id: 'tok', name: 'js.northgate-pay.example/v3/tokenize.js (the processor, game)', what: 'Turns the card number into a token before it leaves the browser.', good: 'keep', why: 'Needed: the processor requires it. It changes when they release a new version, so it needs their change notices, not a pinned hash.'},
  {id: 'ana', name: 'tags.analytics.example/site.js (analytics)', what: 'Counts page views for the communications team.', good: 'remove', why: 'Not needed on the payment page. Every script that can run there can read the card fields. Count visits on the other pages.'},
  {id: 'chat', name: 'widget.chathelp.example/loader.js (chat widget)', what: 'The “Need help?” bubble.', good: 'remove', why: 'Not needed while a card number is being typed. Put a help link to the contact page instead.'}
];
const MK_CHECKS = {
  q15: {label: 'Every 15 minutes, alerting the web team (the payment page is our highest-value target)', hours: 0.25, good: true},
  week: {label: 'Weekly, the minimum the standard allows without a targeted risk analysis', hours: 72},
  month: {label: 'Monthly, with the other web checks', hours: 72}
};
// Hours until a skimmer injected at 01:12 is noticed (game): the next tamper check, or the processor’s fraud call after three days.

/* ---------- WAF rule review (mini-game) ---------- */
// After a day in detection mode, each candidate rule shows what it matched. Block, log only, or switch off.
// cat: what kind of attack it stops. atk / res: requests a day it would block, attacks / residents (game).
// payFail: residents' bill payments that would fail each day.
const MK_WAF = [
  {id: 'admin', rule: 'Block /cms/admin from anywhere outside the town office network', cat: 'admin', atk: 340, res: 0, good: 'block',
   seen: ['203.0.113.21  GET  /cms/admin/login  200', '203.0.113.90  POST /cms/admin/login  200  (wrong password)', '192.0.2.14   GET  /cms/admin/  302'],
   why: 'Only the web team needs the admin pages, and they work from the office. Nothing a resident does goes there.'},
  {id: 'quote', rule: 'Block any request containing an apostrophe (\')', cat: 'sqli', atk: 25, res: 180, payFail: 60, good: 'off',
   seen: ['192.0.2.31     GET  /pay/lookup?name=O%27Neill  200', '192.0.2.52     POST /portal/profile  street=Hunter%27s+Way  200', '203.0.113.50  GET  /news?id=7%27+OR+%271%27=%271  404'],
   why: 'Residents are called O’Neill and live on Hunter’s Way. OWASP: blocking apostrophes rejects legitimate names without making a database query safe. The managed injection rules and parameterised queries do the real work.'},
  {id: 'sqli', rule: 'Managed SQL injection rule set (anomaly scoring, paranoia level 1), with the exclusion written yesterday', cat: 'sqli', atk: 410, res: 2, good: 'block',
   seen: ['203.0.113.50  GET  /portal/search?q=x%27+UNION+SELECT…  500', '203.0.113.50  GET  /portal/search?q=…%27+AND+SLEEP(5)…  500', '192.0.2.45     POST /portal/feedback  “I’d like to select…”  (matched yesterday; the exclusion now covers it)'],
   why: 'In detection mode a few residents’ requests matched, and an exclusion now covers most of them. That is what detecting before blocking is for. (Real deployments usually watch for longer: game.)'},
  {id: 'trav', rule: 'Block ../ and its encodings (%2e%2e%2f) in request paths and parameters', cat: 'trav', atk: 120, res: 0, good: 'block',
   seen: ['203.0.113.33  GET  /docs/view?file=../../../../etc/passwd  200', '203.0.113.33  GET  /docs/view?file=%2e%2e%2f%2e%2e%2fconfig.php  200', '203.0.113.71  GET  /images/..%2f..%2f  404'],
   why: 'No real link on our sites climbs folders. Every match is an attack.'},
  {id: 'rate10', rule: 'Rate limit /portal/login: more than 10 failed sign-ins a minute from one address gets a 429', cat: 'stuff', atk: 900, res: 0, good: 'block',
   seen: ['203.0.113.9   POST /portal/login  ×600 in 10 min  401', '192.0.2.77     POST /portal/login  ×6 in 1 min  (the library: many residents behind one address)', '192.0.2.66     POST /portal/login  ×2  401, then 302'],
   why: 'Stops the noisy tools without touching the library, where many residents share one address. Stuffing from many addresses gets past any per-address limit, so MFA and breached-password checks still matter.'},
  {id: 'rate3', rule: 'Rate limit /portal/login: more than 3 failed sign-ins an hour from one address', cat: 'stuff', atk: 950, res: 140, payFail: 40, good: 'off',
   seen: ['192.0.2.77     POST /portal/login  ×14 in 1 h  (the library)', '192.0.2.120    POST /portal/login  ×4 in 1 h  (a resident who forgot her password)', '203.0.113.9   POST /portal/login  ×600  401'],
   why: 'Too tight: the library locks out every resident behind its address, and so does anyone who forgets a password. The 10-a-minute rule stops almost the same attacks.'},
  {id: 'getonly', rule: 'Allow only GET on /pay/ (block POST and PUT)', cat: 'misc', atk: 5, res: 2400, payFail: 800, good: 'off',
   seen: ['192.0.2.140    POST /pay/submit  302  (a water bill paid)', '192.0.2.66     POST /pay/submit  302  (a parking fine paid)', '203.0.113.12  PUT  /pay/  405'],
   why: 'Paying a bill is a POST. This rule would stop every payment in town.'},
  {id: 'upload', rule: 'Block uploads of script files (.php and similar) to /cms/uploads/', cat: 'shell', atk: 30, res: 0, good: 'block',
   seen: ['203.0.113.61  POST /cms/media/upload  thumb.php  200', '203.0.113.61  POST /cms/media/upload  x.phtml  200', '198.51.100.20  POST /cms/media/upload  agenda.pdf  200  (the comms team, from the office: not matched)'],
   why: 'Staff upload images and PDFs. A script in the uploads folder is how a web shell gets in.'},
  {id: 'geo', rule: 'Block every address outside the country (GeoIP)', cat: 'geo', atk: 300, res: 90, payFail: 30, good: 'off',
   seen: ['192.0.2.88    POST /pay/submit  302  (a resident on holiday paying a bill)', '203.0.113.50  GET  /portal/search?q=…  (would be blocked)', '192.0.2.209   GET  /portal/search?q=…UNION…  (an attacker on a rented server in the country: not blocked)'],
   why: 'Attackers rent servers in any country, including ours. Residents travel. Geography is not a security boundary.'}
];
const MK_WAF_ACTS = {block: 'Block', log: 'Log only', off: 'Switch off'};

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real-world kinds of evidence) ---------- */
const MK_DRILLS = {
  sqli: {
    id: 'sqli', title: 'Did the injection work?', budget: 2,
    intro: '<p>Overnight, with the WAF in detection mode (logging, not blocking), it matched 1,412 requests from 203.0.113.50 against its SQL injection rules (game). Paz has the council briefing at nine. One question first.</p>',
    artefact: '<pre class="art">WAF · detection mode · Day {D-1} 02:00–03:00 (game data)\n' +
      'Source        203.0.113.50 · 1,412 requests matched SQL injection rules\n' +
      'Top targets   /portal/search?q=   1,180      /news?id=   232\n' +
      'Action        logged only (detection mode: nothing was blocked)</pre>' +
      '<p class="small">In detection mode a WAF records what it would have blocked and lets everything through. A match says a request looked like an attack, not that it worked.</p>',
    question: 'Did any of the injection attempts succeed?',
    sources: [
      {id: 'waf', name: 'WAF log', qs: [
        {q: 'How many requests matched, and how many were blocked?', kind: 'trap',
         res: ['1,412 matched · 0 blocked (detection mode)', '(A count says how hard they tried, not whether it worked.)']},
        {q: 'Every WAF event tonight, from every source', kind: 'broad', rows: 9840,
         wall: ['{t}  203.0.113.50   SQL injection rule      /portal/search  logged', '{t}  192.0.2.14     protocol rule           /               logged', '{t}  203.0.113.50   SQL injection rule      /news           logged', '{t}  192.0.2.66     no match                /pay/submit']}]},
      {id: 'access', name: 'Web server access log (Combined Log Format)', qs: [
        {q: 'For 203.0.113.50: status codes and response sizes, by path', kind: 'focus', key: true,
         res: ['/news?id=…           232 requests: all 404, 1,204–1,212 bytes (the “no such article” page)', '/portal/search?q=…   1,168 × 500, 312 bytes (the server error page)', '                        11 × 200, 2,140–6,180 bytes (the size of a normal search page)', '                         1 × 200, 96,880 bytes at 02:44:07   ← a normal search page is 2–6 KB', '(In the Combined Log Format the status is %>s and the size is %b: the body sent, not counting headers.)']},
        {q: 'Every request to every town site last night', kind: 'broad', rows: 61302,
         wall: ['192.0.2.52 - - [Day {D-1} 02:{t}] "GET /news?id={n} HTTP/1.1" 200 5120', '192.0.2.14 - - [Day {D-1} 02:{t}] "GET / HTTP/1.1" 200 18342', '192.0.2.77 - - [Day {D-1} 02:{t}] "POST /pay/submit HTTP/1.1" 302 -', '203.0.113.50 - - [Day {D-1} 02:{t}] "GET /portal/search?q=… HTTP/1.1" 500 312'],
         buried: '203.0.113.50 - - [Day {D-1} 02:44:07] "GET /portal/search?q=x%27%20UNION%20SELECT… HTTP/1.1" 200 96880'}]},
      {id: 'db', name: 'Application and database error log', qs: [
        {q: 'Errors and unusual queries from /portal/search, 02:00–03:00', kind: 'focus', key: true,
         res: ['02:31:02–02:43:55  1,168 × ERROR  SQL syntax error near “UNION” (search query)   (each one a 500 in the access log)', '02:44:07  no error · the search query returned 1,204 rows from the residents table (name, email, street)   normal maximum: 50 rows', '(The errors stop when the attacker finds a query shape that works. The big answer is the one that worked.)']}]},
      {id: 'geo', name: 'GeoIP lookup', qs: [
        {q: 'Where is 203.0.113.50?', kind: 'trap',
         res: ['A hosting provider abroad (game data).', '(Where a request comes from doesn’t tell you whether it worked. Attackers rent servers anywhere, including next door.)']}]},
      {id: 'dev', name: 'Ask Rafe (web developer)', qs: [
        {q: 'Is /portal/search safe from injection?', kind: 'focus',
         res: ['Rafe: “The news page turns the ID into a number before it asks the database, so that one’s fine. Search… builds its query from the text box. It’s on my list.”', '(Useful: it tells you where to look. The logs decide what happened.)']}]}
    ],
    ai: {everything: {text: '1,412 SQL injection attempts were detected and handled by the WAF. No further action needed.', wrong: true,
                      reveal: 'Tally mixed up “matched” with “blocked”, and “blocked” with “failed”. In detection mode nothing was blocked, and a match never says whether a request worked: the status codes, the response sizes and the database log do. Ask specific questions, and check the answer against the evidence.'},
         specific: {q: 'Did any request from 203.0.113.50 get a 200 response larger than a normal search page?', text: 'Yes, one: 02:44:07, /portal/search, status 200, 96,880 bytes. Normal search pages here are 2–6 KB.'}},
    verdicts: [
      {label: 'Yes: one request at 02:44:07 returned 1,204 resident records', good: true, why: 'A 200 of 96,880 bytes where normal is 2–6 KB, right after the database errors stopped, and the database log shows 1,204 rows from the residents table.'},
      {label: 'No: the WAF caught all 1,412', why: 'Detection mode logs; it doesn’t block. And a match isn’t a stop.'},
      {label: 'No: every attempt caused a server error', why: '1,168 did. One didn’t, and that is the one that matters.'}],
    reasons: [
      {label: 'Their requests failed with 500s until 02:44, then one got a 200 fifteen times bigger than the biggest normal search, matching a 1,204-row query in the database log', good: true, why: 'What the server answered, and what the database did, from two independent logs.'},
      {label: '1,412 matches is far too many to be harmless', why: 'Volume is effort, not success.'},
      {label: 'The source is a hosting provider abroad', why: 'Location says nothing about whether it worked.'}],
    alts: [
      {label: 'The big response was an ordinary search with lots of results', good: true, why: 'Ruled out: no normal search returns more than 50 rows, and the 1,204 rows came from the residents table, which search never reads.'},
      {label: 'The WAF blocked the dangerous ones', good: true, why: 'Ruled out: detection mode blocks nothing, and the access log shows every request reached the site and got an answer.'},
      {label: 'The attacker only probed /news', why: 'All 232 /news requests got 404s; search is the page that answered.'},
      {label: 'The log clock is wrong', why: 'The access log and the database log agree to the second.'}],
    path: '<p>Success shows in the <b>answers</b>, not in the attack: the <b>access log’s status codes and response sizes</b> for the attacking address (one 200 far bigger than normal among hundreds of 500s), and the <b>application and database error log</b> (the errors stop when the injection works, and the query that worked returned rows it never should). The WAF’s match count only says how hard they tried, and in detection mode nothing was blocked. Where the address is tells you nothing about success.</p>',
    response: ['Fix /portal/search with a parameterised query; until it ships, block the pattern at the WAF (a virtual patch) and switch the injection rule set to blocking', 'Preserve the access, WAF and database logs for 02:00–03:00', 'Work out exactly what the 1,204-row answer held (names, emails, streets), and decide with legal whether the law requires telling the people affected and the regulator; the clock starts when you became aware', 'Check everything else 203.0.113.50 touched, and look for a web shell or new accounts', 'Give the database account behind search only what search needs: it should never have been able to read the residents table'],
    techs: ['T1190'], acts: ['paramq']
  },
  script: {
    id: 'script', title: 'A new script on the payment page', budget: 2,
    intro: '<p>The payment page’s tamper check fired at 10:05 (game): pay.townhall.example/checkout now loads its tokenising script from static.northgate-pay.example. Yesterday it came from js.northgate-pay.example. Northgate Payments is the town’s card processor (game). A skimmer, or the vendor?</p>',
    artefact: '<pre class="art">Payment page change detected · pay.townhall.example/checkout · Day {D} 10:05 (game data)\n' +
      'Script removed   js.northgate-pay.example/v3/tokenize.js\n' +
      'Script added     static.northgate-pay.example/v4/tokenize.js\n' +
      'Other scripts    /js/pay.js (ours) unchanged · security headers unchanged</pre>' +
      '<p class="small">The check compares the page as a browser receives it with the last approved copy, which is what PCI DSS requirement 11.6.1 asks for. It tells you something changed, not who changed it or why.</p>',
    question: 'Is the new script a skimmer, or a legitimate vendor change?',
    sources: [
      {id: 'chg', name: 'Change records and file-integrity log', qs: [
        {q: 'What changed in checkout.html, when, and under which change?', kind: 'focus', key: true,
         res: ['10:02:41  checkout.html changed: one line, the tokenize.js address (old → new). Nothing else in the page.', 'Deployed by the release pipeline under CHG-4410 (game), raised by Rafe, approved by Oona yesterday', 'CHG-4410 cites the processor’s change notice VN-26-14 (game) and gives the new address exactly']}]},
      {id: 'vend', name: 'Vendor change notice', qs: [
        {q: 'Does the processor’s notice name this exact address? (Check on their support portal, not in the email.)', kind: 'focus', key: true,
         res: ['Northgate support portal, notice VN-26-14 (game): “From Day {D}, tokenize.js moves to static.northgate-pay.example/v4/. The old address stops working next month.”', 'Same domain, same path, same day as the change. The new script still sends card data only to api.northgate-pay.example, as the old one did.', '(You checked the notice where you already have an account, not by following the email: the same rule as calling back on a known number.)']}]},
      {id: 'look', name: 'Read the script itself', qs: [
        {q: 'Is the new script minified and hard to read?', kind: 'trap',
         res: ['Yes: one long line of minified JavaScript.', '(So is almost every vendor script, and plenty of malware. It decides nothing.)']}]},
      {id: 'csp', name: 'Content Security Policy reports', qs: [
        {q: 'Every CSP report from every browser today', kind: 'broad', rows: 12904,
         wall: ['{t}  script-src   blocked  an extension script (a browser add-on)', '{t}  img-src      tracker.example/{n}.gif  (report-only)', '{t}  script-src   static.northgate-pay.example/v4/tokenize.js  (report-only)', '{t}  connect-src  api.northgate-pay.example/tokens  allowed']}]},
      {id: 'oona', name: 'Ask Oona (payments officer)', qs: [
        {q: 'Were you expecting a change from Northgate?', kind: 'focus',
         res: ['Oona: “They emailed about a new address last week. I approved Rafe’s change yesterday.”', '(A good sign. Memory isn’t a record: the ticket and the notice are.)']}]}
    ],
    verdicts: [
      {label: 'A legitimate vendor change: approved, deployed under a ticket, and named in the processor’s own notice', good: true, why: 'One line changed, through the pipeline, under CHG-4410, and the processor’s portal names the same address and day.'},
      {label: 'A skimmer: an unknown script appeared on the payment page', why: 'It is new, not unknown: the ticket, the pipeline and the processor’s notice all name it.'},
      {label: 'A skimmer: the script is minified', why: 'Vendors minify their code too.'}],
    reasons: [
      {label: 'The page changed by exactly one line, through the pipeline, under an approved ticket that cites a vendor notice, and the notice on the processor’s portal names the same address', good: true, why: 'What changed, how, under whose approval, and the vendor’s own word, checked where you already have an account.'},
      {label: 'The domain has the processor’s name in it', why: 'Look-alike domains do too. The notice, checked on the portal, is what confirms it.'},
      {label: 'Oona said a change was coming', why: 'Memory isn’t a record. The ticket and the notice are.'}],
    alts: [
      {label: 'An attacker changed the page and timed it with the vendor’s notice', good: true, why: 'Ruled out: the file-integrity log shows a single one-line change, made by the pipeline under CHG-4410; nothing else in the page or its headers changed.'},
      {label: 'A look-alike domain, one character off the processor’s', good: true, why: 'Ruled out: the address matches the notice on the processor’s portal character for character.'},
      {label: 'A resident’s browser add-on injected it', why: 'Add-ons do cause CSP reports, but this change is in our own page file.'},
      {label: 'The tamper check is broken', why: 'It caught a real change within three minutes.'}],
    path: '<p>A new script on a payment page is a question for <b>change records</b> (what changed in the page, when, through which process, approved by whom) and for the <b>script’s address checked against the vendor’s notice</b>, confirmed where you already have an account rather than from the email. Minified code proves nothing either way. The tamper check did its job: it told you something changed. Your records tell you whether it was meant to.</p>',
    response: ['Close it as an approved vendor change, and record why', 'Update the payment page script inventory: the new address and the written business justification for it (PCI DSS 6.4.3)', 'Update the Content Security Policy to allow the new address and drop the old one', 'Make vendor change notices part of the change process, so the next one is expected', 'Leave the tamper check exactly as sensitive as it is: it caught this in three minutes'],
    techs: ['T1059.007'], acts: ['scriptinv']
  },
  admin: {
    id: 'admin', title: 'The admin nobody made', budget: 3,
    intro: '<p>The CMS’s weekly admin report came in this morning (game): a new administrator, webmaint2, created at 02:51. The log says rafe.l created it. Rafe was asleep.</p>',
    artefact: '<pre class="art">CMS audit log · www.townhall.example · Day {D} (game data)\n' +
      '02:51:13  user.create  webmaint2  role=Administrator  actor=rafe.l</pre>' +
      '<p class="small">The actor field names the account whose session made the change. It doesn’t say who was holding that session.</p>',
    question: 'Who created webmaint2, and how?',
    sources: [
      {id: 'audit', name: 'CMS audit log (full entry)', qs: [
        {q: 'Full details of the 02:51:13 entry: session, address, sign-in', kind: 'focus', key: true,
         res: ['02:51:13  user.create webmaint2  actor=rafe.l  session=7f2c…  from 203.0.113.61', 'Session 7f2c… was issued yesterday at 16:05 to rafe.l at the office (198.51.100.20), after password and MFA', 'No sign-in at 02:51: the session was reused. The CMS never expires idle sessions (game).']},
        {q: 'Every CMS audit event this month', kind: 'broad', rows: 3108,
         wall: ['{t}  page.update  /news/{n}  actor=rafe.l  198.51.100.20', '{t}  media.upload  agenda-{n}.pdf  actor=comms.team  198.51.100.20', '{t}  login.success  rafe.l  198.51.100.20  MFA', '{t}  page.update  /events  actor=comms.team  198.51.100.20']}]},
      {id: 'access', name: 'Web server access log', qs: [
        {q: 'Every request from 203.0.113.61 in the last 30 days', kind: 'focus', key: true,
         res: ['Day {U} 14:20  POST /cms/media/upload  (a file called thumb.php, sent as an image)  200   ← before you patched the upload flaw on Day {P}', 'Day {D} 02:44:02  GET /cms/uploads/2026/10/thumb.php?c=…  200', 'Day {D} 02:44:30–02:50:55  GET /cms/uploads/2026/10/thumb.php?c=…  200  ×14', 'Day {D} 02:51:13  POST /cms/admin/users/new  302  carrying session 7f2c…']}]},
      {id: 'files', name: 'Files in the CMS uploads folder', qs: [
        {q: 'Any script files in /cms/uploads, and what do they do?', kind: 'focus', key: true,
         res: ['/cms/uploads/2026/10/thumb.php  created Day {U} 14:20  1,904 bytes', 'It runs whatever command arrives in its c= parameter, as the web server’s account: a web shell.', 'The web server’s account can read the CMS session store. That is where rafe.l’s live session came from.', 'No other script files in uploads; the rest of the web root matches the CMS release’s file list.']}]},
      {id: 'rafe', name: 'Ask Rafe', qs: [
        {q: 'Did you create webmaint2?', kind: 'focus',
         res: ['Rafe: “No. I was asleep. I did leave the CMS open in a browser tab when I went home…”', '(Useful context: an open session. The logs still decide.)']}]},
      {id: 'scan', name: 'Antivirus scan of the web server', qs: [
        {q: 'Run a full scan now', kind: 'trap',
         res: ['Scan complete: no threats found.', '(A scan describes the files as they are now, against what it already knows. It can’t tell you who created webmaint2, or what ran last night.)']}]}
    ],
    ai: {everything: {text: 'The audit log shows rafe.l created webmaint2 at 02:51. Recommend asking Rafe to confirm the account is needed, then closing.', wrong: true,
                      reveal: 'Tally read the actor field as a person. It names the account whose session made the change. The session, the address and the requests just before it decide who was really there.'},
         specific: {q: 'Was session 7f2c… used from more than one address?', text: 'Yes. Issued at 16:05 yesterday to 198.51.100.20 (the office), then used at 02:51:13 from 203.0.113.61.'}},
    verdicts: [
      {label: 'An intruder: a web shell, uploaded before the patch, read Rafe’s still-open session and used it to create the admin', good: true, why: 'Rafe’s office session was reused from 203.0.113.61 straight after fourteen commands through thumb.php, a script uploaded through the flaw before you patched it.'},
      {label: 'Rafe made it from home and forgot', why: 'His session was issued at the office; the 02:51 request came from 203.0.113.61 through a web shell.'},
      {label: 'A CMS plugin created a maintenance account', why: 'Plugins don’t send requests from 203.0.113.61 through thumb.php.'}],
    reasons: [
      {label: 'Rafe’s office session was reused from an outside address minutes after that address ran commands through a script uploaded before the patch', good: true, why: 'Who, how and how they got in, each from its own log.'},
      {label: 'The log says rafe.l, so it was Rafe', why: 'The actor is the session’s account, not the person.'},
      {label: 'Patching the CMS fixed this', why: 'The patch closed the upload flaw. The web shell came through before it, and a patch doesn’t remove a shell already planted.'}],
    alts: [
      {label: 'Rafe signed in from home through the VPN', good: true, why: 'Ruled out: there was no sign-in at 02:51 at all; an existing session was reused, from 203.0.113.61.'},
      {label: 'Another web shell or admin account is still there', good: true, why: 'Check before you close: compare the web root with the release’s file list and list every admin. Here: no other script files, and webmaint2 is the only new admin.'},
      {label: 'A password spray guessed Rafe’s password', why: 'No password was used: the session was reused.'},
      {label: 'The CMS clock is wrong', why: 'The audit log and the access log agree to the second.'}],
    path: '<p>The <b>audit log’s full entry</b> gives the session and the address behind the account; the <b>web server log for that address</b> shows what came before (a script in the uploads folder answering commands, then the admin request carrying Rafe’s session); and <b>checking the uploads folder for scripts</b> finds the web shell. The actor field names an account, not a person. Patching closes the hole a shell came through; it doesn’t remove one already planted.</p>',
    response: ['Put the CMS admin pages into maintenance; preserve the web shell, the logs and a disk image before cleaning', 'Remove webmaint2, revoke every CMS session and reset every CMS admin password: a stolen session works without one', 'Remove the web shell, compare every file with the release’s list, and stop the uploads folder from running scripts', 'Give CMS sessions idle and absolute timeouts', 'Scope what the shell did: database reads, outbound connections, and any change to the payment page', 'Change the database password and other secrets in the CMS configuration: the shell could read them'],
    techs: ['T1505.003', 'T1550.004'], acts: ['revokeweb']
  }
};

/* ---------- Web Application Security Dojo (NCL-style) ---------- */
const MK_DOJO = [
  {title: 'Code or data?',
   art: 'The permits page builds its query by joining strings (game):\n  sql = "SELECT * FROM permits WHERE owner = \'" + name + "\'"\nSomeone types this as the owner’s name:\n  x\' OR \'1\'=\'1',
   q: 'What does the database run, and what fixes it?',
   opts: ['WHERE owner = \'x\' OR \'1\'=\'1\': every permit. Fix: a parameterised query, so the name is always data, never code', 'Nothing unusual: the quotes are just characters in a name', 'Fix: strip apostrophes from every name'], good: 0,
   explain: 'The typed quote ends the string and the rest becomes part of the query, so the condition is always true. OWASP’s Top 10:2025 lists Injection as A05, and its preferred fix is a safe API that provides a parameterised interface: the database is told which part is the query and which part is the value. Stripping apostrophes breaks real names (O’Neill) and still isn’t safe.'},
  {title: 'Change the number',
   art: 'Signed in as yourself on the resident portal (game):\n  GET /portal/bills/10442  → your water bill\n  GET /portal/bills/10443  → your neighbour’s water bill',
   q: 'What is wrong, and what fixes it?',
   opts: ['The server never checks that the bill belongs to whoever is signed in: check ownership on every request', 'Use long random bill numbers instead', 'Hide the number from the address bar'], good: 0,
   explain: 'An insecure direct object reference: the request names an object, and the server never checks you may see it. OWASP’s cheat sheet: implement access control checks for each object a user tries to access; even with complex identifiers, those checks are essential. Broken Access Control is first (A01) in the OWASP Top 10:2025.'},
  {title: 'Validated, and still vulnerable',
   art: 'The search box allows letters, digits, spaces and . , \' - because residents search for “O’Neill” and “Hunter’s Way”. Every search passes validation. The search query is still built by joining strings. (game)',
   q: 'Validation passed. Is the search safe?',
   opts: ['No: the apostrophe has to be allowed, so a string-built query can still break. Validation narrows input; parameterised queries make it safe', 'Yes: every input was validated', 'Yes, as long as the WAF is on'], good: 0,
   explain: 'OWASP’s Top 10:2025 (A05) says positive server-side input validation is not a complete defense, because many applications require special characters. Validation is still worth doing; it just isn’t the thing that stops injection. A WAF helps while the code is fixed, but it is a filter in front of the flaw, not a fix in it.'}
];

/* ---------- Web Board (original) ---------- */
const MK_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'slipquote', tech: 'T1190', tags: ['web'], story: true, rate: 12, group: 'a',
   title: 'Round 1: the encoded UNION', host: 'PORTAL-01 · portal.townhall.example', enemy: {spr: 'slipquote', pal: 'slipquote'},
   clues: ['Requests to /permits/lookup carry UNION SELECT, URL-encoded twice.', 'The WAF blocks the plain form; this double-encoded one gets a 200 of 38 KB, where a normal answer is 3 KB.', 'The database log shows rows from the permit applicants table going out.'],
   truth: 'Exploit Public-Facing Application: SQL injection slipping past the WAF in a double-encoded form.',
   resp: [{label: 'Block the variant at the WAF now, fix the lookup with a parameterised query, and scope which rows left', good: true},
          {label: 'Add the attacker’s address to the block list and close', good: false, why: 'One address, endless variants, and the flaw is still in the code.'},
          {label: 'Take every town website offline for a week', good: false, disrupt: 2}],
   chain: [{at: 40, text: 'The injection reaches a second table.'}, {at: 75, text: 'Another large answer leaves the server.'}]},
  {kind: 'mal', threat: 'shellback', tech: 'T1505.003', tags: ['web', 'host'], story: true, rate: 12, group: 'a',
   title: 'Round 2: a script in the uploads', host: 'PORTAL-01 · portal.townhall.example', enemy: {spr: 'shellback', pal: 'shellback'},
   clues: ['A new file, avatar.php, appeared in the portal’s uploads folder.', 'The web server process started /bin/sh, then a download tool, to an outside address.', 'Requests to avatar.php carry commands in a parameter.'],
   truth: 'Server Software Component: Web Shell.',
   resp: [{label: 'Cut the server off from the internal network, preserve the shell and logs, remove it, compare files with the release list, revoke sessions, rotate secrets', good: true},
          {label: 'Delete avatar.php and close', good: false, why: 'Preserve it first, find how it got there, and look for others.'},
          {label: 'Rebuild every server in town', good: false, disrupt: 2}],
   chain: [{at: 40, text: 'The shell lists the internal network.'}, {at: 75, text: 'It tries the database server.'}]},
  {kind: 'mal', threat: 'stuffer', tech: 'T1110.004', tags: ['web', 'identity'], story: true, rate: 11, group: 'a',
   title: 'Round 3: a thousand residents at once', host: 'PORTAL-01 · resident sign-in', enemy: {spr: 'stuffer', pal: 'stuffer'},
   clues: ['4,210 sign-ins to the resident portal in 20 minutes, from 1,900 addresses: two or three each.', 'The usernames and passwords match last month’s breach of a shopping site, not ours.', '86 accounts got in: residents who reused that password.'],
   truth: 'Credential Stuffing: passwords from another site’s breach, tried against ours.',
   resp: [{label: 'Reset and sign out the 86 accounts, tell those residents, turn on MFA and breached-password checks, limit attempts per account as well as per address', good: true},
          {label: 'Block the 1,900 addresses', good: false, why: 'Rented proxy networks rotate addresses: block lists alone are easy to get around.'},
          {label: 'Lock every resident account', good: false, disrupt: 2}],
   chain: [{at: 40, text: 'More accounts fall.'}, {at: 75, text: 'A taken-over account changes its refund bank details.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const MK_CARDS = [
  {id: 'hosted', name: 'Card entry to the hosted checkout', csf: 'Respond', good: true, text: 'Turn off our own card form and send residents to the processor’s hosted payment page, which Northgate can switch on today (game).', fx: 'Stage 1: card entry is contained the moment you act.'},
  {id: 'preserve', name: 'Preserve the evidence', csf: 'Respond', good: true, text: 'Copy the changed script, the deploy and access logs, and the tamper and CSP reports before anything is cleaned.', fx: 'Every stage starts with more evidence, and the exposure window can be proved.'},
  {id: 'csp', name: 'Enforce the Content Security Policy', csf: 'Protect', good: true, text: 'Switch the policy from report-only to enforce: scripts only from us and the processor, data sent only to the processor.', fx: 'Stage 3: a re-injected skimmer can’t send anything from browsers that enforce it.'},
  {id: 'mfa3p', name: 'MFA on every account that can change the site', csf: 'Protect', good: true, text: 'Staff and third parties alike, including the web agency’s deploy account.', fx: 'Stage 2 becomes much easier.'},
  {id: 'restore', name: 'Our own page back within the hour', csf: 'Govern', text: 'Bring our own payment page straight back, as the councillor asked.', fx: 'Payments resume on a page nobody has proved clean.'},
  {id: 'wafonly', name: 'Block the skimmer’s domain at the WAF', csf: 'Protect', text: 'Add the attacker’s domain to the WAF and keep the page up.', fx: 'Does nothing: the skimmer runs in residents’ browsers and sends straight to the attacker. That traffic never passes the WAF.'},
  {id: 'quiet', name: 'Delete the bad code and say nothing yet', csf: 'Respond', text: 'Fix it quietly and see whether anyone notices.', fx: 'The evidence is gone, and nobody who needed to know was told.'},
  {id: 'shutall', name: 'Shut down every town website', csf: 'Respond', text: 'News, permits, the portal, everything, until it’s over.', fx: 'Stops the skimmer and every online service in town: uptime falls.'}
];
const MK_INJECT = '01:12';     // when the skimmer went into pay.js (game)
const MK_PAY_RATE = 30;        // card payments an hour on the page, averaged over day and night (game)

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  extinv: {name: 'Internet-facing asset inventory', desc: 'List everything the internet can reach, from more than one kind of source: names (DNS, Certificate Transparency logs) find what is hosted elsewhere; scanning your own addresses and reading your firewall rules find what has no name. A spreadsheet is a starting point, not an inventory.'},
  wafmode: {name: 'WAF: detect, tune, then block', desc: 'Run new WAF rules in detection mode first, read what they would have blocked, write exclusions for real users, and only then block. A false positive is a resident who can’t pay a bill.'},
  csp: {name: 'Content Security Policy', desc: 'A response header that tells browsers which origins may supply scripts, and where scripts may send data (connect-src). Start with Content-Security-Policy-Report-Only to see what would break, then enforce: report-only tells you, it doesn’t stop anything.'},
  sri: {name: 'Subresource Integrity', desc: 'An integrity attribute with the script’s hash: the browser refuses a file that doesn’t match. Good for third-party files that never change; a vendor script updated in place would be refused at its next release, so use change notices and the tamper check for those. Cross-origin files need CORS.'},
  tamper: {name: 'Payment page tamper detection', desc: 'Compare the payment page’s security headers and scripts, as a browser receives them, with the approved copy, and alert people when they change. PCI DSS asks for at least weekly; how much faster depends on what the page is worth to an attacker.'},
  scriptinv: {name: 'Payment page script inventory', desc: 'Every script that runs on the payment page is authorised, its integrity assured, and listed with a written reason it is needed (PCI DSS 6.4.3). Fewer scripts, fewer things that can read the card fields.'},
  patchweb: {name: 'Patch internet-facing software first', desc: 'Anything the internet can reach and attackers are already exploiting goes first: back up, test on staging, then production, the same day. A WAF rule can cover the gap; it doesn’t replace the patch.'},
  decom: {name: 'Retire a site in the right order', desc: 'Check its logs and keep a copy first. Then put up a maintenance page, update or remove the DNS record, wait out the DNS cache time, and only then cancel the hosting: a name left pointing at a cancelled service can be claimed by someone else (subdomain takeover).'},
  paramq: {name: 'Parameterised queries', desc: 'The query and the values travel separately, so input is always data, never code. Input validation narrows what comes in; it doesn’t make a string-built query safe.'},
  objauthz: {name: 'Check ownership on every object', desc: 'Every request for a record checks that the signed-in person may see it. Hard-to-guess IDs help; they are not access control.'},
  revokeweb: {name: 'Revoke web sessions, not just passwords', desc: 'A stolen session cookie works without the password and without MFA. After a compromise, revoke every session and token, and give sessions idle and absolute timeouts.'},
  hostedpay: {name: 'Hosted payment page', desc: 'Let the processor’s own page take the card details (a redirect, or an iframe whose every element comes from a PCI DSS validated provider). None of our code runs where the card is typed, and the PCI self-assessment shrinks (SAQ A rather than A-EP). The page that embeds an iframe still has to be protected from scripts.'},
  mfa3p: {name: 'MFA for third parties too', desc: 'Every account that can change the website or deploy code needs MFA, including contractors’ and agencies’ accounts, and their deploy tokens need owners and expiry dates.'},
  exposurewin: {name: 'Establish the exposure window', desc: 'From the evidence of the first malicious change to the moment card entry was contained. Everyone who paid inside it is affected; nobody outside it is. Prove both ends before anyone is told.'}
});
Object.assign(FACTS, {
  owasp10: {name: 'OWASP Top 10:2025', desc: 'The most current OWASP Top 10 is the 2025 edition (its eighth): A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection (cross-site scripting included), A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions. For injection, its preferred option is a safe API with a parameterised interface; positive server-side input validation “is not a complete defense”.', src: 'OWASP Top 10:2025'},
  owaspcs: {name: 'OWASP cheat sheets', desc: 'Query Parameterization: SQL injection is best prevented through the use of parameterized queries. Input Validation: blocking apostrophes, for example, rejects legitimate names without making a database query safe. Insecure Direct Object Reference Prevention: implement access control checks for each object; even with complex identifiers, those checks are essential.', src: 'OWASP Cheat Sheet Series'},
  pci643: {name: 'PCI DSS 6.4.3: payment page scripts', desc: 'All payment page scripts loaded and executed in the consumer’s browser are managed: a method confirms each is authorised, a method assures the integrity of each, and an inventory of all scripts is kept with written business or technical justification for each.', src: 'PCI DSS v4.0.1 (PCI Security Standards Council)'},
  pci1161: {name: 'PCI DSS 11.6.1: change and tamper detection', desc: 'A change- and tamper-detection mechanism alerts personnel to unauthorised modification of the security-impacting HTTP headers and the script contents of payment pages as received by the consumer browser, at least weekly or at the frequency set by the entity’s targeted risk analysis. 6.4.3 and 11.6.1 were best practices until 31 March 2025 and have been in effect since.', src: 'PCI DSS v4.0.1; PCI SSC blog, January and March 2025'},
  saqa: {name: 'Hosted checkout and PCI scope', desc: 'PCI SSC: with a redirect or iframe, the processor produces the page that accepts payment data (SAQ A, if all its elements come from a PCI DSS validated provider); with Direct Post the merchant’s website produces part of the page (SAQ A-EP). From 31 March 2025 SAQ A dropped 6.4.3 and 11.6.1 and added a criterion: a merchant whose page embeds the processor’s form must confirm the site is not susceptible to attacks from scripts. It does not apply to a redirect.', src: 'PCI SSC FAQs 1291, 1438 and 1588; PCI SSC blog, 30 January 2025'},
  sri_csp: {name: 'SRI and CSP', desc: 'W3C Subresource Integrity lets browsers check that a fetched file arrived without unexpected manipulation, and refuse to execute one that fails (SHA-256, SHA-384 and SHA-512; cross-origin files need CORS). W3C Content Security Policy restricts where a page’s scripts load from; connect-src restricts the URLs it can load using script interfaces such as XMLHttpRequest, WebSocket and sendBeacon; the Report-Only header monitors a policy rather than enforcing it.', src: 'W3C Subresource Integrity; W3C Content Security Policy Level 2 (Recommendation, 2016) and Level 3'},
  ct_log: {name: 'Certificate Transparency', desc: 'RFC 6962 (2013, Experimental) describes publicly logging TLS certificates as they are issued, so anyone can audit what certificate authorities issued. For a defender, that means a public list of your own names, including ones nobody remembered.', src: 'IETF RFC 6962'},
  clf: {name: 'Web server access logs', desc: 'Apache’s Combined Log Format: "%h %l %u %t \\"%r\\" %>s %b \\"%{Referer}i\\" \\"%{User-agent}i\\"". %>s is the status code (2xx success, 3xx redirection, 4xx client error, 5xx server error); %b is the size of the response body, without headers. The error log is where the server records errors it meets processing requests. HTTP 429 means too many requests in a given time (rate limiting).', src: 'Apache HTTP Server 2.4, Log Files; IETF RFC 6585'},
  waf_detect: {name: 'WAF detection mode', desc: 'ModSecurity’s recommended configuration ships with SecRuleEngine DetectionOnly: “Use detection only to start with, because that minimises the chances of post-installation disruption.” OWASP CRS: a false positive is a genuine transaction a rule matches in error; they are tuned away with rule exclusions; a higher paranoia level catches more attacks and gives more false positives.', src: 'ModSecurity modsecurity.conf-recommended; OWASP CRS documentation'},
  takeover: {name: 'Subdomain takeover', desc: 'OWASP: it happens when a DNS record (typically a CNAME) points to a cloud resource or third-party service that has been deprovisioned. Decommission in order: maintenance page, update or remove the DNS record, wait for propagation, then decommission the resource.', src: 'OWASP Subdomain Takeover Prevention Cheat Sheet'},
  credstuff: {name: 'Stopping credential stuffing', desc: 'OWASP: MFA is by far the best defence against most password-related attacks; IP block lists should not be the sole or primary defence, because they are easy to get around; check new passwords against breached-password datasets.', src: 'OWASP Credential Stuffing Prevention Cheat Sheet'},
  webshell: {name: 'Web shells', desc: 'NSA and the Australian Signals Directorate published joint guidance on detecting and preventing web shell malware on 22 April 2020. ATT&CK’s web shell detection looks for unexpected script files in web folders followed by the web server starting command shells or system tools, and recommends least privilege so only authorised accounts can modify the web directory.', src: 'NSA press release, 22 April 2020; MITRE ATT&CK T1505.003'},
  ddos: {name: 'Kinds of DDoS', desc: 'CISA, the FBI and MS-ISAC describe three: volumetric (consuming bandwidth), protocol (exploiting network protocols) and application (targeting specific applications or services).', src: 'CISA, FBI and MS-ISAC, Understanding and Responding to Distributed Denial-of-Service Attacks'},
  ba2018: {name: 'British Airways, 2018', desc: 'The ICO fined British Airways £20m in October 2020. An attack it did not detect itself, which began on 22 June 2018, potentially exposed data of about 429,612 customers and staff, including names, addresses and the card numbers and CVV numbers of 244,000 customers. A third party alerted BA on 5 September 2018, more than two months later. The ICO said measures such as limiting access, testing and MFA for employee and third-party accounts were available. Its 2019 notice of intent (£183.39m) said user traffic to BA’s website was diverted to a fraudulent site where details were harvested.', src: 'ICO statement on the notice of intent (July 2019) and press release on the penalty (October 2020)'},
  ico72: {name: 'Reporting a personal data breach (UK)', desc: 'ICO: a notifiable breach must be reported to the ICO without undue delay and not later than 72 hours after becoming aware of it; if it is likely to result in a high risk to people, you must inform those concerned directly and without undue delay.', src: 'ICO, Personal data breaches: a guide'}
});
GAME_NOTES.push(
  'Market Square threats (Slipquote, Climber, Stuffer, Shellback, Skimlet, Crawler, Stampede) join the alert mix with weights 4/3/4/2/2/3/2 once you reach Market Square; inside it they are three times as likely, and the Lantern Badge halves Slipquote. Network tools are strong against threats aimed at public web services. (game)',
  'Hostnames, addresses, the processor (Northgate Payments), its notices, tickets, the WAF rule counts (attacks and residents a day), the payment rate (30 an hour) and the skimmer’s timings are invented. (game)',
  'WAF false-positive rate counts residents’ requests among everything the WAF blocks in a day. Exposure window counts game hours from the skimmer’s first change to containment. Mean time to contain counts game seconds from the start of a real attack to your first containment action. (game)',
  'All Market Square people, sites and numbers are invented. The skimming incident is retold in outline from the 2018 British Airways breach; its details here are invented. (game)'
);
