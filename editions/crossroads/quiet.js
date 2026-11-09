/* ============================================================
   UPTIME · editions/crossroads/quiet.js
   The Quiet Thread in Crossroads. It advances, it is not resolved (only the
   series' last edition resolves it). One new clue in each district. The Public Library:
   svc-print signing in to CIRC-01, the Library's patron-records server, over
   remote desktop at 03:12 (ATT&CK T1021.001, verified on attack.mitre.org,
   ATT&CK content v20.1). The DFIR track sees it in evidence (E-04, the server's
   Security log); the IR manager sees it in the firm's status report. Either
   way it goes to counsel first, then to Rae's suspicion-file team: nothing
   changes on svc-print without a plan.
   The School District: pings from FD-STAFF-11's address to eleven district
   addresses at 03:21, all dropped (ATT&CK T1018), seen in FW-SD's log (DFIR, S-07)
   or in the firm's status report (manager); counsel first, then Rae.
   The clue situations are invented (game); the technique IDs are real (QT_TECH).
   ============================================================ */
'use strict';

const QT_CLUES = {
  'lb-rdp': {tech: 'T1021.001', where: 'CIRC-01’s Security log (the Public Library)',
             seen: 'svc-print signed in to CIRC-01, the Library’s Shelfwright server, over remote desktop (logon type 10) from FD-STAFF-11’s address at 03:12 on Day 2, and signed out at 03:16. CIRC-01 audits sign-ins, not process starts, so what it did is unknown.'},
  // The School District (slice 2): T1018 Remote System Discovery (verified on attack.mitre.org, 9 Nov 2026, ATT&CK content v20.1).
  'sd-probe': {tech: 'T1018', where: 'FW-SD’s log, Night 8 (the School District)',
             seen: 'At 03:21–03:22 on Night 8 the district firewall dropped pings from FD-STAFF-11’s address, arriving over the Compact’s link, to eleven district addresses in turn, SIS-01’s among them: which hosts answer, not which services. The link lets only logs out of the district. What sent them is unknown.'}
};

// One line per Town Hall clue, for the suspicion file you carry (written from the Town Hall clue text; game).
const CR_QT_PRIOR = {
  'th-signin': 'Front Desk: svc-print signed in to FD-STAFF-11 at 03:12, right password first try.',
  'th-router': 'Front Desk: the closet router relayed a short encrypted connection each night around 03:10.',
  'th-logclear': 'Front Desk: FD-STAFF-14’s security log was cleared at 03:40.',
  'th-schtask': 'Front Desk: a task called PrinterHealthCheck runs a built-in tool on FD-STAFF-11 at 03:10.',
  'th-reboot': 'Front Desk: the out-of-support closet router reboots itself around 03:00.',
  'mr-fwdrule': 'Mail Room: a forwarding rule on facilities-bms@, set at 03:17.',
  'mr-legacy': 'Mail Room: facilities-bms@ signed in at 03:16 over an old password-only protocol.',
  'cr-netconfig': 'Clerks’ Row: svc-print ran discovery commands on CR-LT-12 at 03:05.',
  'cr-portproxy': 'Clerks’ Row: svc-print added a port proxy on CR-LT-12 at 03:07, forwarding to FD-STAFF-11.',
  'mk-dmzhop': 'Market Square: the closet router signed in to WEB-01’s admin service as svc-print at 03:09.',
  'rh-vault': 'Records Hall: svc-print exported the backup server’s stored credentials at 03:14.',
  'bm-anyany': 'IT Basement: the any-to-any rule’s hit log, the closet router at 03:09 night after night.',
  'sv-nesting': 'Server Room: svc-print nested into local admin on every member server (2019, a.kerr-adm).',
  'wt-vendorbox': 'Water Plant: svc-print has an account on RA-01, created 14 March 2019 by a.kerr-adm.'
};
function crQtPriorLines() { return Series.qt().cluesFound.filter(id => CR_QT_PRIOR[id]).map(id => CR_QT_PRIOR[id]); }

async function crQtAfterNote(fresh) {
  if (!fresh) return;
  await say('(No alert fired for it. You note it in the Field Manual, under Unexplained, and it goes in the suspicion file.)');
}
