/* ============================================================
   UPTIME · editions/town-hall/mailroom-data.js
   Town Hall district 2, the Mail Room: art, map, people, ATT&CK techniques met
   here, threats, alert templates, briefings, the inbox room, the text stream,
   the phone booth, OSINT puzzles, investigation drills, tabletop cards, Field
   Manual text. Everything here extends the Front Desk tables; nothing in them
   is rewritten (the one exception, marked below, opens a door on the plaza).
   People, companies, domains, numbers and times are invented (game). Domains
   use the reserved .example top-level domain (RFC 2606) and IP addresses come
   from the documentation ranges (RFC 5737).
   ATT&CK IDs verified on attack.mitre.org in October 2026 (ATT&CK v20).
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
Object.assign(S, {
  attach: ["0000000000002220","0000000000020002","0000000000020202","0111111111111110","0134444444444310","0143444444443410","0144344444434410","0144434444344410","0144443443444410","0144444334444410","0144444444444410","0144444444444410","0111111111111110","0000000000000000","0000000000000000","0000000000000000"],
  smish: ["0000000000000000","0001111111000000","0012222222100000","0012444442103333","0012444442134443","0012444442134443","0012444442103333","0012444442100300","0012444442100000","0012444442100000","0012444442100000","0012222222100000","0012223222100000","0012222222100000","0001111111000000","0000000000000000"],
  invoice: ["0000000000000000","0011111111110000","0014444444441000","0014111144441100","0014444444444100","0014441444444100","0014413314444100","0014441444444100","0014413344444100","0014441444444100","0014444444444100","0014222222224100","0014444444444100","0014222224444100","0011111111111100","0000000000000000"],
  consent: ["0000000000000000","0111111111111110","0122222222222210","0123333333333210","0123344333333210","0123400433333210","0123344444444210","0123333333434210","0123333333333210","0123333333333210","0122222222222210","0111111111111110","0000001441000000","0000014444100000","0000001441000000","0000000000000000"],
  sieve: ["0000000000000000","0111111111111110","1222222222222221","1243343343343421","0124334334334210","0122222222222210","0012411221142100","0012411221142100","0001222222221000","0001233333321000","0000122222210000","0000012332100000","0000001221000000","0000001331000000","0000011001100000","0000110000110000"],
  sifter: ["0100000000000010","1211111111111121","1222222222222221","1243343343343421","1234334334334321","0122222222222210","0124343434343210","0012411221142100","0012411221142100","0001222222221000","0001234444321000","0000123333210000","0000012442100000","0000001331000000","0000011001100000","0000110000110000"],
  drillbit: ["0000000000000000","0000011111000000","0000122222100000","0001222222210000","0001241222213333","0001222222213300","0000122222210000","0001222222221000","0012233333322100","0122333333332210","0122333333332210","0012233333322100","0001222222221000","0000011001100000","0000010000100000","0000110001100000"],
  reportbird: ["0000000000004440","0000011111004440","0000122222104000","0001222222214000","0001241222213333","0001222222213300","0000122222214000","0001222222221000","0012233333322100","0122333443332210","0122334114332210","0012233443322100","0001222222221000","0000011001100000","0000010000100000","0000110001100000"],
  mailpile: ["0000000000000000","0111111000000000","0143341000111111","0144441000143341","0111111000144441","0000000000111111","0000111111000000","0000143341000000","0000144441011111","0000111111014334","0111111000014444","0143341000011111","0144441000000000","0111111011111100","0000000014334100","0000000011111100"],
  booth: ["1111111111111111","1222222222222221","1244444444444421","1241111111111421","1241333333331421","1241311113331421","1241314413331421","1241311113331421","1241333333331421","1241333332231421","1241333332231421","1241333333331421","1241111111111421","1244444444444421","1222222222222221","1111111111111111"]
});
Object.assign(PAL, {
  attach: ['#141414', '#b8432f', '#e58a5c', '#f2e3c6'],
  smish: ['#141414', '#3a4a6b', '#ff4d6d', '#9ff0c8'],
  invoice: ['#141414', '#8a4b2f', '#2f6e3e', '#f2e3c6'],
  consent: ['#141414', '#5a2a6e', '#c49ae0', '#ffd96a'],
  sieve: ['#1b2233', '#1f6f78', '#7cc6c4', '#ffd96a'],
  sifter: ['#1b2233', '#0b2b33', '#7cc6c4', '#ffd96a'],
  drillbit: ['#1b2233', '#b8432f', '#f2e3c6', '#ffd96a'],
  reportbird: ['#1b2233', '#b8432f', '#f2e3c6', '#5aa64b'],
  mailpile: ['#5b4a42', '#8c7b70', '#b8432f', '#f2e3c6'],
  booth: ['#4a1414', '#b8432f', '#dbeaf7', '#ffd96a'],
  mailBld: ['#0b2b33', '#1f6f78', '#7cc6c4', '#ffd96a'],
  mailDark: ['#2a2523', '#3a4a6b', '#5b4a42', '#6e7a8a'],
  gateway: ['#1b2233', '#3a4a6b', '#7cc6c4', '#ffd96a'],
  helpdesk: ['#1b2233', '#1f6f78', '#7cc6c4', '#f2e3c6'],
  osint: ['#1b2233', '#0b2b33', '#7cc6c4', '#ffd96a'],
  oldbox: ['#1b2233', '#5b4a42', '#8c7b70', '#6e7a8a'],
  bea: ['#1a1a2e', '#c0a040', '#f0c8a0', '#1f6f78'],
  priya: ['#1a1a2e', '#141414', '#b07850', '#ff9f43'],
  jonah: ['#1a1a2e', '#2b1d16', '#7a4a2c', '#3f8fd0'],
  kofi: ['#1a1a2e', '#141414', '#6b4430', '#a6d96a'],
  wren: ['#1a1a2e', '#3b2418', '#f2c7a0', '#c49ae0'],
  ines: ['#1a1a2e', '#5a3a7a', '#e0b090', '#ffd96a']
});
Object.assign(TILES, {
  'M': {spr: 'B', pal: 'mailDark', solid: true},                  // Mail Room building (hub); lit after the Seal Badge
  'g': {spr: 'K', pal: 'gateway', solid: true},                   // mail gateway racks
  'r': {spr: 'pc', pal: 'oldbox', solid: true, under: ','},       // old shared-mailbox console
  'i': {spr: 'pc', pal: 'pcOn', solid: true, under: ','},         // staff inbox desks
  'o': {spr: 'pc', pal: 'osint', solid: true, under: ','},        // OSINT dojo terminals
  'H': {spr: 'counter', pal: 'helpdesk', solid: true, under: ','},// help desk window
  'B': {spr: 'booth', pal: 'booth', solid: true},                 // phone booth
  'u': {spr: 'mailpile', pal: 'mailpile', grass: true, under: ','} // unsorted mail: unfiltered, so it trips alerts
});

/* ---------- Tools: the Sieve line (mail gateway) and the Drillbit line (people) ---------- */
Object.assign(CLASSES, {
  email: {label: 'Email', strong: [], strongTags: ['mail'], weakTags: ['voice', 'sms', 'recon'], strongLabel: 'email-borne threats (links, attachments, BEC, app consent)'},
  people: {label: 'People', strong: [], strongTags: ['voice', 'sms', 'mail'], weakTags: ['recon'], strongLabel: 'social engineering by email, text or voice'}
});
Object.assign(TOOLS, {
  sieve: {name: 'Sieve', cls: 'email', sub: 'mail gateway', spr: 'sieve', blurb: 'A patient strainer that reads every envelope before it reaches a desk.',
          abil: ['headers', 'detonate', 'blocksender', 'quarantine']},
  sifter: {name: 'Sifter', cls: 'email', sub: 'mail gateway', spr: 'sifter', blurb: 'Sieve, grown up: finds every copy of a bad message and lifts it out of every inbox.',
           abil: ['headers', 'detonate', 'quarantine', 'purge']},
  drillbit: {name: 'Drillbit', cls: 'people', sub: 'awareness training', spr: 'drillbit', blurb: 'A cheerful bird that runs short drills, so people learn the cues by doing.',
             abil: ['askuser', 'callknown', 'spotcue', 'warnstaff']},
  reportbird: {name: 'Reportbird', cls: 'people', sub: 'one-click reporting', spr: 'reportbird', blurb: 'Drillbit with a flag: one tap and a suspicious message lands with security.',
               abil: ['userreports', 'callknown', 'askuser', 'warnstaff']}
});
Object.assign(ABIL, {
  headers: {name: 'Read headers', type: 'inv', cost: 2, ev: 22, desc: 'Read the Received chain from the bottom up and the Authentication-Results line your own gateway added.'},
  detonate: {name: 'Sandbox it', type: 'inv', cost: 3, ev: 32, desc: 'Open an attachment or link in an isolated sandbox and watch what it does.'},
  blocksender: {name: 'Block sender', type: 'con', cost: 2, dw: 20, ev: 6, disrupt: 1, desc: 'Block a sending address or domain at the mail gateway.'},
  quarantine: {name: 'Quarantine', type: 'con', cost: 2, dw: 25, ev: 6, disrupt: 1, desc: 'Move a message out of inboxes into quarantine, where it can be reviewed and released if it was safe.'},
  purge: {name: 'Search and purge', type: 'con', cost: 3, dw: 40, ev: 4, disrupt: 1, desc: 'Find every copy of a message across all mailboxes and remove it.'},
  callknown: {name: 'Call back', type: 'inv', cost: 1, ev: 14, social: true, desc: 'Hang up and call the person or vendor on a number you already had, never one the message or caller gave you.'},
  spotcue: {name: 'Spot the cue', type: 'inv', cost: 1, ev: 14, desc: 'Look for the tell: a look-alike domain, a display name that hides the address, a link whose target differs from its text, pressure.'},
  warnstaff: {name: 'Warn staff', type: 'con', cost: 1, dw: 10, ev: 4, disrupt: 0, desc: 'Tell staff what is circulating and how to report it.'},
  userreports: {name: 'User reports', type: 'inv', cost: 1, ev: 18, fpBonus: true, desc: 'Read what staff reported with the one-click button: who else got it and what they noticed.'}
});

/* ---------- Map: the Mail Room interior, the Mail Board, and a door on the plaza ---------- */
Object.assign(MAPS, {
  mail: {
    name: 'Mail Room',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "wggggg,,r,w,,,,,,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,i,,i,,i,,w,o,o,o,w",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "w,,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "wwwww,wwwwwwwww,wwwwwwwww,wwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,HHH,,,B,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,Y,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w,,,,,,,,,,,,,,,,uuuuu,,,,,,,w",
      "w,,,,,,,,,,,,,,,,uuuuu,,,,,,,w",
      "w,,,,,,,,,,,,,,,,uuuuu,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwEwwwwwwwwwwwwwww"
    ],
    doors: {'14,15': {to: 'hub', x: 19, y: 11, dir: 'down'}, '29,10': {to: 'mboard', x: 9, y: 9, dir: 'up'}}
  },
  mboard: {
    name: 'Mail Board',
    rows: [
      "wwwwwwwwwwwwwwwwwwww",
      "wgg,,,,,,,,,,,,,,ggw",
      "wgg,,,,,,,,,,,,,,ggw",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwEwwwwwwwwww"
    ],
    doors: {'9,10': {to: 'mail', x: 28, y: 10, dir: 'left'}}
  }
});
// The one change to Front Desk data: a Mail Room building east of the records office on the plaza,
// with a gap in the hedge so its door can be reached from the cabling. The door opens with the Key Badge.
MAPS.hub.rows[9] = "h.S.cccc......==.MMMM........h";
MAPS.hub.rows[10] = "h.X.ccDc......==.MMDM.3333GGGh";
MAPS.hub.rows[11] = "hhhhhhhhhhhhh.==.hh.hh3333GGGh";
MAPS.hub.doors['19,10'] = {to: 'mail', x: 14, y: 14, dir: 'up',
  get locked() { return (typeof G !== 'undefined' && G && G.f.boardDone) ? undefined : 'The Mail Room. A note on the door: “Staff with a Key Badge only.”'; }};

/* ---------- People ---------- */
NPCS.push(
  {id: 'bea', name: 'Bea Lindqvist', role: 'Mail Room lead', map: 'mail', x: 14, y: 9, dir: 'down', pal: 'bea'},
  {id: 'priya', name: 'Priya Natarajan', role: 'permits clerk', map: 'mail', x: 13, y: 4, dir: 'down', pal: 'priya'},
  {id: 'jonah', name: 'Jonah Abara', role: 'accounts payable', map: 'mail', x: 18, y: 4, dir: 'down', pal: 'jonah'},
  {id: 'kofi', name: 'Kofi Mensah', role: 'help desk', map: 'mail', x: 3, y: 7, dir: 'down', pal: 'kofi'},
  {id: 'wren', name: 'Wren Takahashi', role: 'OSINT coach', map: 'mail', x: 25, y: 4, dir: 'down', pal: 'wren'},
  {id: 'ines', name: 'Ines Calloway', role: 'messaging security lead', map: 'mboard', x: 9, y: 2, dir: 'down', pal: 'ines'}
);
const MR_MAPS = ['mail', 'mboard'];

/* ---------- ATT&CK techniques met in the Mail Room (verified on attack.mitre.org, Oct 2026, ATT&CK v20) ---------- */
Object.assign(TECH, {
  'T1566.001': {name: 'Phishing: Spearphishing Attachment', tactic: ['Initial Access'], desc: 'A message with a malicious file attached: a document, an archive, or an HTML file that draws a fake sign-in page.'},
  'T1586.002': {name: 'Compromise Accounts: Email Accounts', tactic: ['Resource Development'], desc: 'Taking over a real mailbox (a supplier’s, say) to send from it. The trust that address has built does the persuading; attackers can even reply inside existing threads.'},
  'T1657': {name: 'Financial Theft', tactic: ['Impact'], desc: 'Stealing money directly, for example by talking a victim into paying an attacker-controlled account. Business email compromise is the textbook case.'},
  'T1528': {name: 'Steal Application Access Token', tactic: ['Credential Access'], desc: 'Tricking a user into approving a malicious app, which then holds a token to their mailbox or files. The access can outlast a password change.'},
  'T1660': {name: 'Phishing (ATT&CK for Mobile)', tactic: ['Initial Access'], desc: 'Phishing aimed at phones: text messages (smishing), QR codes and similar, steering the victim to a site, an app or a setting.'},
  'T1564.008': {name: 'Hide Artifacts: Email Hiding Rules', tactic: ['Stealth'], desc: 'Inbox rules in a compromised mailbox that move, mark read or delete messages, so the owner never sees replies or warnings.'},
  'T1589.002': {name: 'Gather Victim Identity Information: Email Addresses', tactic: ['Reconnaissance'], desc: 'Collecting staff email addresses, often from public pages and social media, to target phishing or password guessing.'},
  'T1592.002': {name: 'Gather Victim Host Information: Software', tactic: ['Reconnaissance'], desc: 'Learning what software an organisation runs, for example from job postings, to choose exploits and lures that fit.'},
  'T1593.001': {name: 'Search Open Websites/Domains: Social Media', tactic: ['Reconnaissance'], desc: 'Reading public social media for roles, schedules and relationships that make a pretext believable.'}
});

/* ---------- Threats (wild alerts) ---------- */
// Lure (links) and Caller (voice) are already in the Front Desk mix; in the Mail Room they count as home threats too.
// The email-class tools need to see links as email-borne, so Lure gets a 'mail' tag (no effect on the Front Desk tools).
THREATS.lure.tags.push('mail');
Object.assign(THREATS, {
  clasp: {name: 'Clasp', tech: 'T1566.001', spr: 'attach', pal: 'attach', tags: ['mail'], bucket: 'phish', district: 'mail'},
  chirp: {name: 'Chirp', tech: 'T1660', spr: 'smish', pal: 'smish', tags: ['sms'], bucket: 'phish', district: 'mail'},
  buzzer: {name: 'Buzzer', tech: 'T1621', spr: 'buzzer', pal: 'buzzer', tags: ['identity'], bucket: 'cred', district: 'mail'},
  grant: {name: 'Grant', tech: 'T1528', spr: 'consent', pal: 'consent', tags: ['identity', 'mail'], bucket: 'cred', district: 'mail'},
  payee: {name: 'Payee', tech: 'T1586.002', spr: 'invoice', pal: 'invoice', tags: ['mail'], bucket: 'phish', district: 'mail'}
});
// (game) base weights for the Mail Room threats; they only enter the mix once you reach the Mail Room.
MAL_WEIGHTS.push({t: 'clasp', w: 6}, {t: 'chirp', w: 3}, {t: 'buzzer', w: 5}, {t: 'grant', w: 3}, {t: 'payee', w: 3});
const MR_HOME = ['lure', 'caller', 'clasp', 'chirp', 'buzzer', 'grant', 'payee'];
const MR_HOSTS = ['MR-INBOX-03', 'MR-PERMITS-01', 'MR-AP-02', 'MR-HELPDESK-01', 'MR-GATEWAY-01', 'MR-LAPTOP-07'];
const MR_PHISH = ['lure', 'caller', 'clasp', 'chirp', 'grant', 'payee'];

Object.assign(ALERTS, {
  clasp: {
    rule: 'Suspicious email attachment opened',
    mal: {clues: ['“Remittance_0927.html” came from an outside address that has never written to us before.', 'In the sandbox, the file draws a copy of our sign-in page and sends whatever you type to another site.', 'Two more staff received it; one of them opened it.'],
          truth: 'Spearphishing attachment: an HTML file that opens a fake sign-in page.',
          resp: [{label: 'Quarantine every copy, reset the opener’s password, revoke sessions, block the sender', good: true}, {label: 'Isolate every PC that received it', good: false, disrupt: 2}, {label: 'Delete it from one inbox and move on', good: false}]},
    benign: {clues: ['It came from the town’s payroll provider, which sends a statement every month.', 'The sandbox shows a plain PDF: no script, no links out.', 'Sender, domain and timing match the previous twelve months.'],
             truth: 'Benign: the monthly payroll statement.'},
    fp: {clues: ['The rule fires on any attachment with “invoice” in its name.', 'These are our own accounts team sending invoices to residents.', 'The billing system generates them every night.'],
         truth: 'False positive: a keyword rule matched our own outgoing invoices.'}
  },
  chirp: {
    rule: 'Staff report: suspicious text message',
    mal: {clues: ['The text says a toll is unpaid and links to a page asking for card details.', 'The link’s domain was registered last week and does not belong to any toll agency.', 'Four staff got the same text on their work phones today.'],
          truth: 'Smishing: texts steering people to a payment-harvesting site.',
          resp: [{label: 'Warn staff, block the domain on work phones, report the texts', good: true}, {label: 'Wipe every work phone', good: false, disrupt: 2}, {label: 'Ignore it: texts aren’t email', good: false}]},
    benign: {clues: ['It is the town’s emergency alert service: a road closure.', 'It asks for nothing and matches the notice on the town website.', 'Staff signed up for these alerts last year.'],
             truth: 'Benign: a real community alert.'},
    fp: {clues: ['The rule flags any text with a short link.', 'The link belongs to the staff scheduling app.', 'It is the weekly shift reminder.'],
         truth: 'False positive: the rule flagged the scheduling app’s reminder.'}
  },
  buzzer: {
    rule: 'Many MFA prompts denied for one user',
    mal: {clues: ['Twelve push prompts in ten minutes at 01:30, each one after a correct password.', 'The sign-in attempts come from a hosting provider abroad.', 'The user says the buzzing woke them and they denied every prompt.'],
          truth: 'MFA request generation: the attacker has the password and hopes for one tap.',
          resp: [{label: 'Reset the password, revoke sessions, turn on number matching', good: true}, {label: 'Turn MFA off for the user until it stops', good: false}, {label: 'Lock the user’s phone remotely', good: false, disrupt: 1}]},
    benign: {clues: ['The user got a new phone and was re-enrolling MFA.', 'Every prompt came from the office network and the user’s own laptop.', 'A help-desk ticket shows the re-enrolment.'],
             truth: 'Benign: a user re-enrolling MFA on a new phone.'},
    fp: {clues: ['The “prompts” belong to a help-desk test account.', 'A nightly test signs in and denies by design.', 'The rule was never told to exclude it.'],
         truth: 'False positive: the help desk’s nightly MFA test.'}
  },
  grant: {
    rule: 'User granted a new app access to their mailbox',
    mal: {clues: ['A user approved “Docu Viewer”, which asked to read and send mail and to keep access.', 'The app was registered last week by an unknown publisher outside the organisation.', 'Since the approval it has read 2,300 messages from that mailbox.'],
          truth: 'Consent phishing: a malicious app talked a user into granting it a token to the mailbox.',
          resp: [{label: 'Revoke the app’s consent and tokens, remove it, review what it read, require admin approval for new apps', good: true}, {label: 'Reset the user’s password and close', good: false, why: 'The app holds its own token; a password reset may not cut it off.'}, {label: 'Block every third-party app', good: false, disrupt: 2}]},
    benign: {clues: ['The app is the town’s new meeting scheduler, approved by IT.', 'It asks only to read calendars.', 'Its publisher is verified and listed in the IT catalogue.'],
             truth: 'Benign: an approved app with narrow permissions.'},
    fp: {clues: ['The alert fired on the security team’s own mailbox-scanning app.', 'An admin granted it during setup.', 'The rule does not exclude admin grants.'],
         truth: 'False positive: our own security app.'}
  },
  payee: {
    rule: 'Payment detail change requested by email',
    mal: {clues: ['A supplier’s real address asks Accounts to send this month’s payment to a new bank account.', 'SPF, DKIM and DMARC all pass: it really came from the supplier’s mailbox.', 'Called on the number in our vendor file, the supplier says they changed nothing.'],
          truth: 'Business email compromise from a hijacked supplier mailbox: real account, fake request.',
          resp: [{label: 'Hold the payment, keep the old details, tell the supplier their mailbox is compromised', good: true}, {label: 'Pay: authentication passed', good: false}, {label: 'Reply to the email and ask if it’s genuine', good: false, why: 'The attacker controls that mailbox and will say yes.'}]},
    benign: {clues: ['The supplier announced a bank change by signed letter last month.', 'Finance already verified it by phone on the number on file.', 'This email is a reminder of the same change.'],
             truth: 'Benign: an already-verified bank change.'},
    fp: {clues: ['The rule fires on the words “bank details”.', 'It is our own bank’s fraud-awareness newsletter.', 'Nothing asks for a payment.'],
         truth: 'False positive: a newsletter about fraud.'}
  }
});
Object.assign(ALERT_CHAINS, {
  clasp: ['A second person opens the attachment.', 'A password typed into the fake page is used to sign in.'],
  chirp: ['More staff receive the text.', 'Someone enters card details on the page.'],
  buzzer: ['The prompts keep coming, one a minute.', 'A prompt is approved.'],
  grant: ['The app starts reading the mailbox.', 'The app sends mail as the user.'],
  payee: ['Accounts prepares the payment run.', 'The transfer is approved.']
});

/* ---------- Morning briefing items (Mail Room) ---------- */
const MR_BRIEFS = [
  {t: 'clasp', text: 'Emails with HTML attachments that open fake sign-in pages are circulating.', act: 'Hold HTML attachments from outside senders at the gateway'},
  {t: 'chirp', text: 'Texts about unpaid tolls and held parcels, with payment links, are widespread.', act: 'Tell staff how to report suspicious texts'},
  {t: 'buzzer', text: 'Attackers with stolen passwords are flooding staff with MFA prompts at night.', act: 'Turn on number matching for push MFA'},
  {t: 'grant', text: 'Phishing emails are asking staff to approve look-alike apps that want mailbox access.', act: 'Require admin approval before users consent to new apps'},
  {t: 'payee', text: 'Payment-change requests from real, hijacked supplier mailboxes are redirecting invoices.', act: 'Require a call-back on a known number for every bank change'}
];

/* ---------- Inbox room (escape-room framing): trust or report ---------- */
// auth: our gateway's Authentication-Results, summarised. Domains are invented (.example).
const MR_INBOX = [
  {display: 'Rae Okafor', addr: 'rae.okafor.townhall@freemail.example', subject: 'Quick favour?',
   body: 'Are you at your desk? I need four gift cards for a staff thank-you. I’m in meetings all day, so just reply here.',
   auth: 'spf=pass · dkim=pass (freemail.example) · dmarc=pass (freemail.example)', good: 'report',
   cues: {sender: 'The name says Rae; the address is a free webmail account, not townhall.example. Mail apps show the display name first, and anyone can type any name.',
          link: 'No link. The ask is the payload: buy gift cards, send the codes.',
          tone: 'Urgent, slightly secret, gift cards, “reply here” instead of a call.',
          auth: 'Everything passes, for freemail.example. Authentication tells you which domain sent it, not whose name is on it.'}},
  {display: 'IT Service Desk', addr: 'helpdesk@townhaII.example', subject: 'Mailbox 98% full: action needed today',
   body: 'Your mailbox will stop receiving mail in 24 hours. Sign in to keep your messages.', linkText: 'townhall.example/mail/keep', linkHref: 'townhaII-mail.example/login',
   auth: 'spf=pass · dkim=pass (townhaII.example) · dmarc=pass (townhaII.example)', good: 'report',
   cues: {sender: 'townhaII.example has two capital I’s where the l’s should be: a look-alike domain someone else registered.',
          link: 'The link text shows our address; hovering shows the real target, a different domain (on a phone, press and hold to preview). Link text can say anything.',
          tone: 'A deadline and a threat: “stop receiving mail”.',
          auth: 'All pass, for the look-alike domain. DMARC checks that the From domain lines up with what SPF or DKIM verified, and the attacker owns that domain.'}},
  {display: 'Town Hall HR', addr: 'hr@townhall.example', subject: 'Benefits enrolment opens Monday',
   body: 'Enrolment runs for two weeks from Monday. Use the Benefits tile on the staff intranet; nothing to do today. Questions: extension 2210.', linkText: 'intranet.townhall.example/benefits', linkHref: 'intranet.townhall.example/benefits',
   auth: 'spf=pass · dkim=pass (townhall.example) · dmarc=pass (townhall.example)', good: 'trust',
   cues: {sender: 'Our own domain and the address HR always uses.',
          link: 'Text and target match, and both go to our intranet.',
          tone: 'No pressure, no secrecy, and a phone extension you can check in the directory.',
          auth: 'An aligned pass for townhall.example, consistent with our own mail system. With the other cues, this one is fine.'}},
  {display: 'Harrow & Finch Paving', addr: 'billing@harrowfinch.example', replyTo: 'billing@harrowfinch-payments.example', subject: 'Updated remittance details: please confirm today',
   body: 'Our bank details have changed. Reply to confirm that future payments will go to the new account below.',
   auth: 'spf=softfail · dkim=none · dmarc=fail (policy p=none)', good: 'report',
   cues: {sender: 'The From shows the supplier, but replies would go to a different domain: harrowfinch-payments.example.',
          link: 'No link. The ask is a reply, which lands with whoever owns the Reply-To domain.',
          tone: 'A bank change plus “confirm today”.',
          auth: 'DMARC fails: no aligned SPF or DKIM pass for harrowfinch.example. The supplier publishes p=none (monitor only), so our gateway delivered it anyway.'}},
  {display: 'ShareBox', addr: 'no-reply@sharebox.example', subject: 'Lin Zhao shared “Q3 budget.xlsx” with you',
   body: 'Lin Zhao shared a file with you.', linkText: 'Open in ShareBox', linkHref: 'files.sharebox.example/s/q3-budget',
   auth: 'spf=pass · dkim=pass (sharebox.example) · dmarc=pass (sharebox.example)', good: 'trust',
   cues: {sender: 'The file-sharing service’s real domain.',
          link: 'It goes to the service’s own domain.',
          tone: 'Lin said at this morning’s stand-up she would share the budget. You expected it.',
          auth: 'An aligned pass for the service. Real services can carry bad files too, so the deciding cue is that you expected it and can ask Lin.'}},
  {display: 'Scan to Email', addr: 'scanner@townhall-scans.example', subject: 'Scanned document from MFP-2F', attachment: 'Scan_0921.html',
   body: 'You have a new scanned document. Open the attachment to view it.',
   auth: 'spf=pass · dkim=pass (townhall-scans.example) · dmarc=pass (townhall-scans.example)', good: 'report',
   cues: {sender: 'Our copiers send from townhall.example, not townhall-scans.example.',
          link: 'The “scan” is an .html file. Copiers send PDFs or images; an HTML attachment can draw a fake sign-in page in your browser.',
          tone: 'Bland and routine on purpose. Not every phish shouts.',
          auth: 'A pass, for a domain we don’t own.'}}
];
const MR_DOORCODE = '730914'; // (game)

/* ---------- Text stream (smishing) ---------- */
const MR_SMS = [
  {from: 'Unknown sender', text: 'TOLL NOTICE: You have an unpaid toll of $4.15. Avoid a late fee today: tollpay-notice.example', good: 'report',
   why: 'Unpaid-toll texts with payment links are one of the most common text scams. A toll agency’s real site is one you look up yourself.'},
  {from: 'Town Hall sign-in', text: 'Your Town Hall sign-in code is 482913. Do not share it with anyone.', good: 'report',
   why: 'You didn’t just sign in, so someone else is trying to. If the code is your second step, they probably have your password. Don’t share the code; report it and change your password from a device you trust.'},
  {from: 'Unknown number', text: 'Hi, it’s Bea. New number! Stuck in a meeting. Can you grab 3 gift cards for the team and text me the codes?', good: 'report',
   why: 'A “new number” plus gift cards is a pretext. Check with Bea on the number you already have for her.'},
  {from: 'Town Alerts', text: 'Elm St closed 9–11 am today for a water main repair. No reply needed.', good: 'none',
   why: 'The alert service you signed up for, no link, nothing asked, and it matches the notice on the town website.'},
  {from: 'Unknown sender', text: 'Your parcel is held at the depot. Confirm your address and pay a $1.99 redelivery fee: parcel-redeliver.example', good: 'report',
   why: 'Fake delivery problems with a small fee are a classic: the real goal is your card details.'}
];

/* ---------- Phone booth (vishing): two practice calls ---------- */
const MR_CALLS = [
  {caller: '“Kofi from the help desk”', open: 'Hi, Kofi from the help desk. Your account is being attacked and I need to lock it. I’ve just sent a code to your phone. Read it back to me so I can verify you.',
   opts: [{label: 'Read him the code', why: 'That code is the second factor for a sign-in happening right now. Reading it out hands over the account.'},
          {label: 'Ask for his employee number to prove who he is', why: 'A caller proving himself with details he controls proves nothing. Those numbers leak or get invented.'},
          {label: 'Say you’ll call the help desk back on the directory number, and hang up', good: true}],
   result: 'You dial the help-desk number from the staff directory. The real Kofi answers: “We didn’t call you. Thanks for checking: I’m logging it and warning the team.”'},
  {caller: '“Mara Finch, Harrow & Finch Paving”', open: 'Hello, Mara from Harrow & Finch. Our bank has changed and I’m emailing the new details now. Can you update them before today’s payment run? Call me back on this number if you need to.',
   opts: [{label: 'Update the details now: she sounds legitimate', why: 'Voices, names and invoice numbers can all be faked or stolen. A bank change is exactly what this pretext is for.'},
          {label: 'Call back the number she just gave you', why: 'That number belongs to whoever is calling. A call-back only proves something if you dial a number you already had.'},
          {label: 'Call Harrow & Finch on the number in the vendor master file', good: true}],
   result: 'You call the number in the vendor file. The real Mara Finch: “We haven’t changed banks. Please don’t pay anything new.”'}
];

/* ---------- OSINT dojo (defensive: our own town’s public footprint only) ---------- */
const MR_OSINT = [
  {title: 'The job posting', tech: 'T1592.002',
   art: 'Town Hall is hiring a Systems Administrator. Must have 3+ years with Mailwright Server 9.4, Bastion EDR and GateKeep VPN 7.2 (firmware updates). (game: invented products)',
   q: 'What does this posting give an attacker?',
   opts: ['Which mail server, endpoint tool and VPN version we run, so they can pick exploits and lures that fit', 'Nothing: job ads are meant to be public', 'The current sysadmin’s password'], good: 0,
   explain: 'ATT&CK lists job postings as a source of host-software details (T1592.002). Defence: describe skills by category (“enterprise email, endpoint protection, remote access”), not products and versions, and keep patching as if the versions were known.'},
  {title: 'The address format', tech: 'T1589.002',
   art: 'The town website lists two contacts: dee.marsh@townhall.example and tomas.reyes@townhall.example. A public staff page lists 40 names. (game)',
   q: 'What can an attacker do with this?',
   opts: ['Work out the format (first.last) and build an address for every name on the staff page', 'Read those two people’s mail', 'Nothing until they guess a password'], good: 0,
   explain: 'Public pages and social media are a common source of email addresses (T1589.002). A format is hard to hide, so assume addresses are known: use role mailboxes such as permits@ on public pages, and keep MFA and the report button strong.'},
  {title: 'The holiday post', tech: 'T1593.001',
   art: 'A public post from a finance staffer: “Two weeks off-grid in the mountains! Jonah’s approving payments alone, good luck 😄” (game)',
   q: 'What does an attacker learn?',
   opts: ['When an approver is away and who is covering: perfect timing for a fake urgent invoice', 'Only where the staffer is going on holiday', 'Nothing about work'], good: 0,
   explain: 'Social media gives attackers roles, schedules and relationships for a believable pretext (T1593.001). Defence: a short staff guide on what not to post about work, and a payment rule that holds no matter who is away: every bank change is verified by call-back, and no one person approves payments alone.'}
];

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real-world kinds of evidence) ---------- */
const MR_DRILLS = {
  link: {
    id: 'link', title: 'The shared-file link', budget: 2,
    intro: '<p>Priya clicked a link in an email that looked like a ShareBox share. Her browser went somewhere else. She has push MFA. Her browser history is the one artefact you start with.</p>',
    artefact: '<pre class="art">Browser history · MR-PERMITS-01 · user priya.natarajan · Day {D} (local time)\n' +
      '09:41:07  files.sharebox.example/s/7Qk2      “Permit_Fees.pdf · ShareBox”   LINK (chain start, chain end)\n' +
      '09:41:31  files.sharebox.example/v/7Qk2/open  “Opening…”                    LINK (chain start)\n' +
      '09:41:32  townhall-sso.example/login         “Town Hall Sign In”            LINK, server redirect (chain end)\n' +
      '09:42:30  townhall-sso.example/login/verify  “Verifying…”                   FORM_SUBMIT\n' +
      '09:42:41  login.townhall.example/            “Town Hall Sign In”            client redirect</pre>' +
      '<p class="small">Transition names follow Chromium’s history types: LINK = followed a link; server redirect = an HTTP redirect; client redirect = script or meta refresh; FORM_SUBMIT = a form was submitted (Chromium notes this is not always recorded). History doesn’t record what was typed into a POST form (a GET form puts its fields in the URL; saved passwords and autofill live in other browser files).</p>',
    question: 'Did Priya submit her credentials, and were they used?',
    sources: [
      {id: 'hist', name: 'Browser history', qs: [
        {q: 'Every page this browser visited in the last 30 days', kind: 'broad', rows: 4812,
         wall: ['{t}  intranet.townhall.example/permits/queue   LINK', '{t}  mail.townhall.example/inbox             TYPED', '{t}  news.example/local                       LINK', '{t}  maps.example/?q=elm+st                   LINK']},
        {q: 'What did the browser do after the FORM_SUBMIT at 09:42:30?', kind: 'focus',
         res: ['09:42:41  login.townhall.example/  client redirect (11 seconds after the submit, while the page said “Verifying…”)', '09:43:10  intranet.townhall.example/permits  LINK', '(Relay kits hold the victim on a “verifying” page while they use her sign-in, then send her to the real site so nothing looks wrong.)']}]},
      {id: 'proxy', name: 'Proxy and DNS logs', qs: [
        {q: 'All DNS lookups from the office today', kind: 'broad', rows: 8930,
         wall: ['{t}  MR-AP-02         A     update.vendor.example', '{t}  MR-INBOX-03      A     mail.townhall.example', '{t}  FD-STAFF-11      AAAA  cdn.example', '{t}  MR-LAPTOP-07     A     time.example'],
         buried: '09:41:32  MR-PERMITS-01  A  townhall-sso.example'},
        {q: 'Did MR-PERMITS-01 send anything to townhall-sso.example after 09:41?', kind: 'focus',
         res: ['09:41:32  GET   townhall-sso.example/login          200  bytes out 610', '09:42:30  POST  townhall-sso.example/login/verify   200  bytes out 1,184', '09:42:31–09:42:40  GET  townhall-sso.example/login/status   200  ×5 (the “Verifying…” page checking in every two seconds)', '09:42:41  GET   login.townhall.example/   200  (no 3xx answer before it: the page’s own script sent her there, matching the history’s client redirect)', '(Our proxy inspects TLS, so it sees the method and path; without that you would only see a connection and byte counts. A POST went out: data was sent, but the log doesn’t show what.)']}]},
      {id: 'idp', name: 'Identity provider sign-in log', qs: [
        {q: 'Every sign-in for every account this week', kind: 'broad', rows: 21406,
         wall: ['{t}  dee.marsh        success  198.51.100.20 (office)  MFA: push approved', '{t}  tomas.reyes      success  198.51.100.20 (office)  MFA: push approved', '{t}  svc-backup       success  192.0.2.40 (data centre)  MFA: n/a (service)', '{t}  lin.zhao         failure  198.51.100.20 (office)  bad password']},
        {q: 'Sign-ins and MFA changes for priya.natarajan after 09:41', kind: 'focus', key: true,
         res: ['09:15:02  success  198.51.100.20 (office)  MR-PERMITS-01  MFA: push approved   ← her normal', '09:42:31  password correct  203.0.113.77 (hosting provider, another country)  MFA: push sent to her phone', '09:42:39  success  203.0.113.77  MFA: push approved (she approved the prompt the phishing page’s sign-in triggered)  session issued', '09:44:52  session reused  203.0.113.77  a different browser  no MFA prompt (the 09:42:39 session already satisfied it)', '09:47:10  security info changed: new authenticator app registered (device “Pixel-7a”)  from 203.0.113.77']}]},
      {id: 'mbx', name: 'Mailbox audit (rules and forwarding)', qs: [
        {q: 'Export everything in Priya’s mailbox', kind: 'broad', rows: 3377,
         wall: ['{t}  Inbox      “Permit #{n} approved”', '{t}  Inbox      “Re: fee schedule”', '{t}  Sent       “Re: site visit Tuesday”', '{t}  Archive    “Newsletter #{n}”']},
        {q: 'New inbox rules or forwarding on Priya’s mailbox after 09:41', kind: 'focus', key: true,
         res: ['09:49:31  New inbox rule “.”  created from 203.0.113.77', '          if subject or body contains “invoice” or “payment” or “password”', '          → move to folder “RSS Subscriptions”, mark as read', '          external forwarding: none']}]}
    ],
    ai: {everything: {text: 'Priya visited a phishing page and submitted a form at 09:42:30. Recommend a password reset. Nothing else of note.', wrong: false,
                      reveal: 'Tally was not wrong, just shallow: it summarised the artefact you already had. It never asked whether the sign-in was used, or why MFA didn’t stop it, so a reset alone would leave the attacker’s session, authenticator and inbox rule in place.'},
         specific: {q: 'Did priya.natarajan sign in from a new IP after 09:41, and did anything change on her account?', text: 'Yes. A sign-in from 203.0.113.77 (hosting provider) started at 09:42:31; the push she approved at 09:42:39 was for that sign-in. The session was reused at 09:44:52 with no new prompt, and a new authenticator app was registered at 09:47:10. Check her mailbox rules next.'}},
    verdicts: [
      {label: 'Credentials were submitted and used: account takeover in progress', good: true, why: 'A sign-in from an unfamiliar hosting address one second after the form, approved with her own push, then a new authenticator and a hiding inbox rule from the same address.'},
      {label: 'She clicked, but nothing was submitted: close it', why: 'The sign-in log shows the account used from 203.0.113.77 seconds later.'},
      {label: 'Submitted but not used yet: a password reset is enough', why: 'It was used, and the attacker added their own authenticator and an inbox rule; a reset alone leaves both.'}],
    reasons: [
      {label: 'A sign-in from an unfamiliar hosting IP one second after her form, approved by her own push, then a new MFA method and a hiding rule from the same IP', good: true, why: 'Each fact is independent evidence that her password, and her MFA approval, were relayed to someone else.'},
      {label: 'The history shows FORM_SUBMIT, which proves she typed her password', why: 'History records that a form was submitted, not what was in it. Use proves compromise; the form only suggests it.'},
      {label: 'The page was on a look-alike domain, so the account must be compromised', why: 'Visiting a phishing page is not compromise. You need evidence that something was entered and used.'}],
    alts: [
      {label: 'Priya signed in herself through a VPN or a hotspot', good: true, why: 'Ruled out: her own session stayed on the office address, and she made no sign-in from 203.0.113.77.'},
      {label: 'The help desk re-enrolled her authenticator', good: true, why: 'Ruled out: no help-desk ticket, and the change came from 203.0.113.77.'},
      {label: 'ShareBox itself was hacked', why: 'The share link was abused, but that doesn’t explain the sign-in from 203.0.113.77.'},
      {label: 'The sign-in log’s clock is wrong', why: 'The proxy and the sign-in log agree on the sequence.'}],
    path: '<p>This is adversary-in-the-middle phishing: the page relayed her password to the real sign-in page as she signed in, her push approval completed the attacker’s sign-in, and the kit kept the session. Two focused queries answer it: the identity provider’s sign-ins for <b>that account after the visit time</b> (new address, MFA result, a new MFA method), then the <b>mailbox rules and forwarding</b> check. Proxy logs could confirm a POST went out (half the question), but not what it held. The sign-in log answers both halves at once, because use proves submission, which frees your second query for what the attacker did next.</p>',
    response: ['Revoke Priya’s sessions first: the session the kit stole works without her password. Then reset her password', 'Remove the rogue authenticator and the inbox rule, then re-enrol MFA with her in person', 'Check her Sent items for phishing sent as her', 'Block townhall-sso.example and purge the email from other inboxes', 'Plan phishing-resistant MFA (passkeys / FIDO2): they are bound to the real site, so a look-alike page can’t relay them'],
    techs: ['T1566.002', 'T1078', 'T1098.005', 'T1564.008'], acts: ['mailrules']
  },
  bec: {
    id: 'bec', title: 'The changed bank details', budget: 2,
    intro: '<p>Jonah in accounts payable got an invoice from Harrow & Finch Paving, a supplier the town has paid for years. The payment run is at 16:00.</p>',
    artefact: '<pre class="art">Received: from mx.townhall.example (10.20.0.5) by mbx01.townhall.example; Day {D} 14:06:12\n' +
      'Received: from mail.mailhost.example (192.0.2.25) by mx.townhall.example; Day {D} 14:06:11\n' +
      'Received: from [203.0.113.140] by mail.mailhost.example (authenticated as mara@harrowfinch.example); Day {D} 14:06:09\n' +
      'Authentication-Results: mx.townhall.example; spf=pass smtp.mailfrom=harrowfinch.example;\n' +
      '  dkim=pass header.d=harrowfinch.example; dmarc=pass header.from=harrowfinch.example\n' +
      'From: "Mara Finch" &lt;mara@harrowfinch.example&gt;\n' +
      'To: jonah.abara@townhall.example\n' +
      'Subject: RE: Inv 2291 · Main St resurfacing\n\n' +
      'Hi Jonah, following an audit our bank has changed. Please use the new account below for\n' +
      'invoice 2291 ($48,600) and any open balance. Kindly process today, our old account closes Friday.\n' +
      '— Mara</pre><p class="small">Received lines are added at the top by each server, so read them bottom-up. Only the lines your own servers added (mx and mbx01) are yours to trust.</p>',
    question: 'Is this a genuine change of bank details? What happens before the 16:00 payment run?',
    sources: [
      {id: 'hdr', name: 'Message headers', qs: [
        {q: 'Every header of every message from harrowfinch.example this year', kind: 'broad', rows: 2214,
         wall: ['{t}  Received: from mail.mailhost.example (192.0.2.25) by mx.townhall.example', '{t}  Authentication-Results: mx.townhall.example; spf=pass …', '{t}  DKIM-Signature: v=1; a=rsa-sha256; d=harrowfinch.example; …', '{t}  Message-ID: <{n}@harrowfinch.example>']},
        {q: 'Read this message’s Received chain bottom-up and its Authentication-Results', kind: 'focus',
         res: ['Our mx received it from Harrow & Finch’s own mail provider (192.0.2.25, which their SPF allows). The provider’s line below says an authenticated user, mara@harrowfinch.example, sent it from 203.0.113.140. We can’t verify a line we didn’t add, but it is a lead for their IT.', 'SPF, DKIM and DMARC pass and align with harrowfinch.example.', 'So it really came from that mailbox. That doesn’t say who was using it.']}]},
      {id: 'thread', name: 'Thread history', qs: [
        {q: 'Compare this message with the earlier messages in the Inv 2291 thread', kind: 'focus', key: true,
         res: ['Earlier messages: signed “Mara Finch, Accounts”, plain wording, never urgent.', 'Last Monday Mara wrote: “I’m on leave from Wednesday; Sam covers billing.”', 'This message (Wednesday): “Kindly process today”, a bank change, “any open balance”, and no mention of Sam.']},
        {q: 'Reply on the thread: “Mara, can you confirm the new account?”', kind: 'trap',
         res: ['14:19  Reply from mara@harrowfinch.example: “Yes, confirmed. Please proceed today, it’s urgent.”', '(Of course: whoever is in the mailbox answers the mailbox.)']}]},
      {id: 'call', name: 'Call-back verification', qs: [
        {q: 'Call Harrow & Finch on the number in our vendor master file', kind: 'focus', key: true,
         res: ['Sam (billing, covering for Mara): “We haven’t changed banks. Mara’s on leave. Let me check… her sent folder has that email. She didn’t write it.”', 'Their IT finds sign-ins to Mara’s mailbox from 203.0.113.140 since Monday.']},
        {q: 'Call every supplier to ask whether they changed banks', kind: 'broad', rows: 186,
         wall: ['Supplier #{n}: “No change.”', 'Supplier #{n}: voicemail', 'Supplier #{n}: “Who is this?”', 'Supplier #{n}: “No change.”']}]}
    ],
    ai: {everything: {text: 'SPF, DKIM and DMARC pass and are aligned for harrowfinch.example. The sender is authenticated. Bank-detail changes should still be confirmed by phone before paying.', wrong: false,
                      reveal: 'Tally was right this time, but notice what it led with: “authenticated”. It cannot know the mailbox was hijacked. That fact only came from a phone call.'},
         specific: {q: 'Does a DMARC pass prove this request is legitimate?', text: 'No. A DMARC pass shows the message came from a source authorised for harrowfinch.example. If their mailbox is compromised, attacker mail passes too. Verify out of band on a known number.'}},
    verdicts: [
      {label: 'BEC from a compromised supplier mailbox: hold the payment and keep the old details', good: true, why: 'The real mailbox sent it, the real supplier says they didn’t, and the mailbox shows foreign sign-ins.'},
      {label: 'Genuine: every authentication check passed', why: 'Authentication passing proves the domain, not the request. A hijacked mailbox passes everything.'},
      {label: 'Spoofed: someone forged the From address', why: 'Not forged: SPF and DKIM pass, aligned. That is exactly why compromised mailboxes are dangerous.'}],
    reasons: [
      {label: 'Authentication proves which domain sent it, not that the request is genuine; the supplier, called on a known number, denied it', good: true, why: 'Out-of-band verification is the only thing here the attacker cannot control.'},
      {label: 'DMARC passed, so the email is safe to act on', why: 'RFC 9989: a DMARC pass by itself doesn’t make a message safe or desirable.'},
      {label: 'The reply on the thread confirmed it', why: 'The attacker answered: they hold the mailbox.'}],
    alts: [
      {label: 'Harrow & Finch really changed banks and Mara forgot to mention it', good: true, why: 'Ruled out: Sam, called on the known number, says no change.'},
      {label: 'Jonah’s own mailbox is compromised and the attacker edited the email inside our side', good: true, why: 'Ruled out: the message arrived through our gateway from their provider, and Jonah’s sign-ins are normal. Worth checking every time.'},
      {label: 'Our SPF record is misconfigured', why: 'Irrelevant: SPF checked their domain, and passed.'},
      {label: 'It’s a newsletter', why: 'It asks for a specific payment change.'}],
    path: '<p>The focused path is the <b>thread history</b> (what changed in tone and timing, and the note that Mara is on leave) and a <b>call-back on a number you already had</b>. Headers are worth reading, but they can only tell you the mailbox was real, which in a hijack it is. Replying on the thread asks the attacker.</p>',
    response: ['Hold the payment and keep the old bank details', 'Tell Harrow & Finch, on the known number, that their mailbox is compromised', 'Preserve the message with full headers', 'Search every inbox for mail from harrowfinch.example since Monday', 'Check whether any earlier payment already went to new details; if so, call our bank now to request a recall and file at ic3.gov', 'Make call-back verification mandatory for every bank change'],
    techs: ['T1586.002', 'T1684.001', 'T1657'], acts: ['outofband']
  },
  push: {
    id: 'push', title: 'Twenty-six no’s and a yes', budget: 2,
    intro: '<p>Overnight alert. Kofi’s phone got push prompts for over twenty minutes. Then one was approved.</p>',
    artefact: '<pre class="art">Identity provider · MFA push log · kofi.mensah · Day {D} (local time)\n' +
      '01:51:02  push sent   result: denied\n' +
      '01:53:40  push sent   result: denied\n' +
      '01:55:12  push sent   result: timed out\n' +
      '…          (23 more prompts, denied or timed out)\n' +
      '02:14:07  push sent   result: APPROVED\n' +
      'Total prompts 01:51–02:14: 27 · denied or timed out 26 · approved 1</pre>',
    question: 'Was the 02:14 approval Kofi, or the attacker? What now?',
    sources: [
      {id: 'idp', name: 'Identity provider sign-in log', qs: [
        {q: 'Every sign-in tonight, all users', kind: 'broad', rows: 6120,
         wall: ['{t}  svc-backup   success  192.0.2.40 (data centre)  MFA: n/a (service)', '{t}  svc-print    success  198.51.100.31 (office)   MFA: n/a (service)', '{t}  kofi.mensah  failure  203.0.113.143           MFA: denied', '{t}  night-ops    success  198.51.100.20 (office)   MFA: push approved'],
         buried: '02:14:07  kofi.mensah  success  203.0.113.143  MFA: push approved'},
        {q: 'Sign-in attempts for kofi.mensah 01:45–02:30: address, location, device, MFA result', kind: 'focus', key: true,
         res: ['27 attempts from 203.0.113.143 (a hosting provider in another country), browser on an unregistered Windows device', 'Password correct every time · MFA: denied ×26 · approved 02:14:07', '02:14:09 session and refresh token issued to 203.0.113.143']}]},
      {id: 'reg', name: 'MFA and device registrations', qs: [
        {q: 'New MFA methods or devices on kofi.mensah after 02:14', kind: 'focus', key: true,
         res: ['02:16:40  new authenticator app registered (“iPhone 15”, not Kofi’s phone)', '02:18:02  new device registered in the directory: DESKTOP-7QK2', 'Both from 203.0.113.143']}]},
      {id: 'sess', name: 'Session and token activity', qs: [
        {q: 'Everything every session did tonight', kind: 'broad', rows: 18044,
         wall: ['{t}  night-ops    mailbox read   “Shift handover”', '{t}  svc-backup   file read      /backups/{n}', '{t}  night-ops    calendar read', '{t}  svc-print    printer status']},
        {q: 'What did the 02:14 session do?', kind: 'focus',
         res: ['02:15–02:40 web mail: searched “password”, “VPN”, “reset”', 'Downloaded “Helpdesk runbook.docx”', 'Refresh token still valid']}]},
      {id: 'user', name: 'Ask the user (known number)', qs: [
        {q: 'Call Kofi on his number in the directory: did he approve a prompt at 02:14?', kind: 'focus',
         res: ['Kofi: “My phone wouldn’t stop buzzing at two in the morning. I hit Approve to make it stop. I thought it was a glitch.”']}]}
    ],
    ai: {everything: {text: 'I reviewed the full MFA log. All 26 prompts were denied or timed out. No successful sign-in. The controls worked; suggest closing this as a blocked attack.', wrong: true,
                      reveal: 'Tally was wrong, and it didn’t say why. Kofi pasted the night’s full sign-in export: 214 lines, one verbose JSON record per line, a few thousand tokens each. That is more than Tally’s context limit, so the console kept the first 60 lines, dropped the rest without a warning, and Tally answered as if that was everything. The approval at 02:14:07 was line 187. (game: the sizes are invented) Real assistants fail quietly in similar ways: input cut by a tool or a token limit, long logs skimmed, a confident summary of the wrong part. Ask specific questions and check the answer against the evidence.'},
         specific: {q: 'Was any MFA prompt for kofi.mensah approved between 01:45 and 02:30? If so, from which address?', text: 'Yes, one: 02:14:07, for a sign-in from 203.0.113.143. A new authenticator was registered on the account at 02:16:40.'}},
    verdicts: [
      {label: 'MFA fatigue worked: the attacker had Kofi’s password and got one approval. Account compromised.', good: true, why: 'The approved prompt matches the attacker’s sign-in from 203.0.113.143, and an attacker authenticator followed.'},
      {label: 'Blocked attack: 26 of 27 prompts were denied', why: 'It only takes one. The 27th was approved and a session was issued.'},
      {label: 'Benign: the approval came from Kofi’s real phone, so it was Kofi', why: 'Kofi’s finger, the attacker’s sign-in. That’s how fatigue works.'}],
    reasons: [
      {label: 'Prompts followed correct passwords from an unfamiliar host abroad; the approval matched that sign-in; a new authenticator appeared right after', good: true, why: 'Address, timing and the follow-on registration tell one story.'},
      {label: 'Twenty-six denials prove the controls held', why: 'Denials show the user resisted for a while. They say nothing about the 27th.'},
      {label: 'The approval came from Kofi’s phone, so it’s fine', why: 'Push approves whatever sign-in is waiting. Number matching exists to stop exactly this.'}],
    alts: [
      {label: 'Kofi was signing in himself on a new laptop late at night', good: true, why: 'Ruled out: the attempts came from a hosting provider abroad, and Kofi says he wasn’t.'},
      {label: 'A phone or mail app with his saved password kept signing in', good: true, why: 'Plausible for repeated prompts, ruled out by the foreign address, the interactive browser and the new authenticator.'},
      {label: 'The identity provider double-logged the prompts', why: 'Doesn’t explain the issued session or the new device.'},
      {label: 'A daylight-saving change shifted the times', why: 'No clock change tonight, and order matters more than the hour.'}],
    path: '<p>Focused: the <b>sign-in attempts for that account in that window</b> (address, device, MFA result), then <b>new MFA methods or devices</b> registered after the approval (ATT&amp;CK T1098.005). Asking Kofi on his known number confirms it. The broad sign-in query does contain the approval, on row 16 of 6,120.</p>',
    response: ['Revoke all of Kofi’s sessions and refresh tokens; reset his password', 'Remove the rogue authenticator and the DESKTOP-7QK2 device registration', 'Turn on number matching for push (CISA calls it a good interim step), and plan phishing-resistant MFA', 'Find what the session read (“Helpdesk runbook.docx”) and treat its contents as exposed: warn the help desk to expect calls that use it', 'Check his mailbox for new rules or forwarding', 'Find out how the attacker had his password (a phish, reuse from a breach, or malware on his devices), or the next reset will leak too'],
    techs: ['T1621', 'T1078', 'T1098.005'], acts: ['numbermatch']
  }
};

/* ---------- Mail Board (rounds 2 and 3; round 1 is the triage gauntlet) ---------- */
const MR_GAUNTLET = [
  {line: '“Payroll” <payroll@townhall-hr.example> · “Update your direct deposit before Friday” · link to townhall-hr.example/deposit', good: 'report', why: 'A look-alike HR domain asking about pay details.'},
  {line: '“Lin Zhao” <lin.zhao@townhall.example> · “Agenda for Thursday” · no link, no attachment, aligned DMARC pass', good: 'trust', why: 'Our domain, an expected topic, nothing asked.'},
  {line: '“DocuSafe” <sign@docusafe-review.example> · “Contract awaiting your signature” · attachment Contract.htm', good: 'report', why: 'An HTML “contract” from a domain we’ve never dealt with.'},
  {line: '“Town Hall IT” <it@townhall.example> · Reply-To: it-support@quickhelp.example · “Confirm your password” · dmarc=fail (townhall.example, p=none)', good: 'report', why: 'Replies go elsewhere, IT never asks for passwords, and DMARC fails for our own domain. At p=reject (our policy is still p=none) it would never have arrived.'},
  {line: '“Library Services” <events@library.townhall.example> · “Book sale this Saturday” · link to library.townhall.example/sale', good: 'trust', why: 'Our own subdomain, link text and target match, nothing asked.'},
  {line: 'A link in an email opens our real sign-in page, then: “Docu Viewer (unverified publisher) wants to: read and send your mail, read your files, keep access to data you’ve given it access to” · Accept / Cancel', good: 'report', why: 'Consent phishing (T1528): the app never needs your password; one Accept gives it a token to your mail that a password reset may not cut off. An unknown app asking to read and send mail gets reported, never accepted.'}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const MR_CARDS = [
  {id: 'callback', name: 'Call the vendor back', csf: 'Respond', good: true, text: 'Phone Harrow & Finch on the number in the vendor master file, not the one in the email.', fx: 'Stage 1 starts with the truth: the vendor never asked.'},
  {id: 'hold', name: 'Hold the payment', csf: 'Respond', good: true, text: 'Stop today’s transfer and keep the old bank details.', fx: 'Stage 2 starts with less attacker progress.'},
  {id: 'bank', name: 'Call our bank now', csf: 'Respond', good: true, text: 'Ask our bank to recall last week’s transfer and alert the receiving bank. Hours matter.', fx: 'Stage 2: the money trail moves slower.'},
  {id: 'preserve', name: 'Preserve mail evidence', csf: 'Respond', good: true, text: 'Keep the original messages with full headers, the invoices and the payment records. Delete nothing.', fx: 'Every stage starts with more evidence.'},
  {id: 'search', name: 'Search every inbox', csf: 'Detect', good: true, text: 'Find every message from the vendor’s address in the last 30 days, in every mailbox.', fx: 'Stage 3 becomes much easier.'},
  {id: 'twoapprove', name: 'Two approvers for bank changes', csf: 'Govern', good: true, text: 'From now on no one person approves a payment or a bank-detail change alone, whoever is on leave.', fx: 'A single hijacked request can no longer move money on one person’s say-so.'},
  {id: 'ic3', name: 'Report to FBI IC3', csf: 'Respond', good: true, text: 'File a complaint at ic3.gov with the transaction details, and tell leadership.', fx: 'Reputation up; the report supports the recovery effort.'},
  {id: 'reply', name: 'Reply to the vendor email', csf: 'Respond', text: 'Ask them by email whether the new details are real.', fx: 'Doesn’t help: the attacker controls that mailbox and answers yes.'},
  {id: 'delete', name: 'Delete the email', csf: 'Respond', text: 'Get rid of it so nobody else pays.', fx: 'Destroys evidence, and copies in other inboxes stay.'}
];

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  drill: {name: 'Investigation drill: focused queries', desc: 'Pick the evidence source and the exact question that would change your answer. A wall of rows costs time and hides the one that matters.'},
  reportbtn: {name: 'One-click reporting', desc: 'A report button in the mail app sends a suspicious message, with its headers, straight to security. Easy reporting means more reports, sooner.'},
  outofband: {name: 'Out-of-band verification', desc: 'Confirm a request through a different channel you already trust, such as the phone number on file. Never use contact details from the request itself.'},
  mailrules: {name: 'Review inbox rules and forwarding', desc: 'After an account takeover, look for new rules that move, hide or forward mail; they can outlast a password reset.'},
  appconsent: {name: 'Admin approval for new apps', desc: 'Require an administrator to approve apps that ask for access to mail or files, and revoke consent for apps nobody recognises.'},
  paymenthold: {name: 'Payment hold and recall', desc: 'Stop a suspicious payment before it leaves, and ask the bank to recall one that already did, as fast as possible.'},
  exposure: {name: 'Reduce public exposure', desc: 'Review what the organisation publishes (job ads, staff pages, social posts) and remove details that only help an attacker.'}
});
Object.assign(FACTS, {
  ic3_bec: {name: 'Business email compromise (2025)', desc: 'The FBI’s Internet Crime Complaint Center (IC3) received 24,768 business email compromise complaints in 2025, with reported losses of $3,046,598,558.', src: 'FBI IC3, 2025 Internet Crime Report'},
  ic3_ffkc: {name: 'Speed matters (2025)', desc: 'In 2025 IC3’s Financial Fraud Kill Chain handled 3,900 incidents with $1.16 billion in attempted theft and froze $679 million, a 58% success rate. IC3 advises victims to contact their financial institution immediately to request a recall, and to file a complaint at ic3.gov regardless of the amount lost.', src: 'FBI IC3, 2025 Internet Crime Report'},
  dmarc: {name: 'What a DMARC pass proves', desc: 'A message passes DMARC when SPF (which checks the envelope sender, MAIL FROM) or DKIM (a signature by the d= domain) passes for a domain aligned with the visible From domain: relaxed alignment means the same organisational domain, strict means identical. DMARC does not check the display name or look-alike domains, and a pass by itself does not make a message safe. A failure does not prove abuse either. RFC 9989 (May 2026) replaced RFC 7489.', src: 'IETF RFC 9989 (DMARC), RFC 7208 (SPF), RFC 6376 (DKIM)'},
  headers: {name: 'Reading mail headers', desc: 'Every mail server that accepts a message adds a Received line at the top, so the chain reads newest first: read it bottom-up. Authentication-Results (RFC 8601) is added by the receiving server that ran the checks; a copy claiming to be yours from outside your own servers can be forged and should be ignored.', src: 'IETF RFC 5321 (SMTP), RFC 8601 (Authentication-Results)'},
  cisa_nm: {name: 'Number matching', desc: 'CISA (October 2022) recommends number matching in push MFA as one of the best interim mitigations against MFA fatigue for organisations that cannot yet use phishing-resistant MFA: the user must type the number shown on the sign-in screen, so a blind tap does nothing.', src: 'CISA fact sheet, Implementing Number Matching in MFA Applications (October 2022)'},
  ftc_text: {name: 'Text scams (2024)', desc: 'People told the US Federal Trade Commission they lost $470 million to scams that started with a text message in 2024. The top lures: fake package delivery problems, bogus job offers, fake fraud alerts, unpaid tolls and “wrong number” texts. In the US you can forward spam texts to 7726 (SPAM).', src: 'FTC press release, April 2025'}
});
GAME_NOTES.push(
  'Mail Room threats (Clasp, Chirp, Buzzer, Grant, Payee) join the alert mix with weights 6/3/5/3/3 once you reach the Mail Room; inside it, its home threats (these plus Lure and Caller) are three times as likely. (game)',
  'Phishing report rate starts from a simulated quarterly test (3 of 30 staff reported). Report rate, time to quarantine, drill scores and the Seal Badge are game models. (game)',
  'Tally, the AI assistant, the size of Kofi’s export, the point where the console cut it (60 lines) and Tally’s mistakes are invented to make a real point: when input runs past a token or context limit, tools and assistants can drop it without saying so. (game)',
  'All Mail Room people, companies, products, domains (.example), IP addresses (documentation ranges) and times are invented. (game)'
);
