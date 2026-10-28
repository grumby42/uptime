/* ============================================================
   UPTIME · editions/town-hall/basement-quiet.js
   The Quiet Thread in the IT Basement. One more faint clue, in the hit log of
   the old "any to any" firewall rule (the same rule Lanternkeep noticed in
   Market Square): the Front Desk closet router reaching WEB-01's admin service
   just after 03:00, night after night. Then, with clocks fixed and logs kept,
   the thread becomes visible for the first time: the player lines up every
   Unexplained note they have into one timeline, a suspicion file handed to
   Rae. It is not resolved: it continues across editions.
   The situations are invented (game); the technique ID is real (QT_TECH: T1090
   Proxy, verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20). Never in the alert mix.
   ============================================================ */
'use strict';

Object.assign(QT_CLUES, {
  'bm-anyany': {tech: 'T1090', where: 'the firewall rule binder in the IT Basement (the any-to-any rule’s hit log)',
                seen: 'The old “any to any” rule’s hit log: night after night, around 03:09, the router in the Front Desk closet opened a short connection to WEB-01’s admin service, and once, at 03:14, to the backup console. Nothing else used the rule at night. With the rule gone, the default deny now drops and logs those connections.'}
});

// Where each Unexplained note sits in the timeline: the clock time as the host recorded it (it appears in the note
// itself), where, and which account or device. Before the IT Basement's NTP fix, those clocks were not synchronised.
const BM_QT_LINE = {
  'th-reboot':    {t: '03:00', where: 'Front Desk closet router', who: 'the router itself (reboots)', district: 'Front Desk'},
  'mr-legacy':    {t: '03:16', where: 'old shared mailbox console', who: 'facilities-bms@, from inside the Front Desk network', district: 'Mail Room'},
  'mr-fwdrule':   {t: '03:17', where: 'old shared mailbox console', who: 'facilities-bms@ (a forwarding rule)', district: 'Mail Room'},
  'cr-netconfig': {t: '03:05', where: 'CR-LT-12', who: 'svc-print', district: 'Clerks’ Row'},
  'cr-portproxy': {t: '03:07', where: 'CR-LT-12', who: 'svc-print (a port proxy to FD-STAFF-11)', district: 'Clerks’ Row'},
  'th-router':    {t: '03:10', where: 'Front Desk closet router', who: 'FD-STAFF-11 ↔ an outside address', district: 'Front Desk'},
  'th-schtask':   {t: '03:10', where: 'FD-STAFF-11', who: 'a task called PrinterHealthCheck', district: 'Front Desk'},
  'th-signin':    {t: '03:12', where: 'FD-STAFF-11', who: 'svc-print', district: 'Front Desk'},
  'th-logclear':  {t: '03:40', where: 'FD-STAFF-14', who: 'unknown (event 1102)', district: 'Front Desk'},
  'mk-dmzhop':    {t: '03:09', where: 'WEB-01 (DMZ)', who: 'svc-print, from the closet router', district: 'Market Square'},
  'rh-vault':     {t: '03:14', where: 'backup console', who: 'svc-print, from the closet router', district: 'Records Hall'},
  'bm-anyany':    {t: '03:09', where: 'edge firewall (any-to-any rule)', who: 'the closet router', district: 'IT Basement'}
};
// The clues the player holds, in clock order (a string sort works: every time is 03:mm).
function bmQtTimeline() {
  return Series.qt().cluesFound.filter(id => BM_QT_LINE[id]).map(id => Object.assign({id: id}, BM_QT_LINE[id], {tech: QT_CLUES[id] ? QT_CLUES[id].tech : ''}))
    .sort((a, b) => a.t.localeCompare(b.t) || a.id.localeCompare(b.id));
}

// The any-to-any rule's hit log: read during the firewall review (the logs reach the SIEM now). Returns true when new.
async function bmQtAnyAny() {
  await say('Hit log for R3, last 90 days: 412 hits. Printers to the print server on TCP 9100 (most of them). The old badge reader to the directory. And, night after night around 03:09, the router in the Front Desk closet to WEB-01’s admin service; once, at 03:14, to the backup console. (game)');
  await say('A closet router has no business on the web server’s admin port, or the backup console’s. Nothing fired: the rule allowed it.', 'Devraj Sood');
  const fresh = qtNote('bm-anyany');
  await qtAfterNote(fresh);
  return fresh;
}

function bmQtSummaryHtml() {
  const n = bmQtTimeline().length;
  if (G.bm && G.bm.file) return '<p class="big">The Quiet Thread is on file.</p><p class="small">' + n + ' notes, one timeline, handed to Rae as a suspicion file. Not solved. It continues.</p>';
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">Hunt mode opens later. Your Unexplained notes carry over.</p>';
  return '<p class="small">Every night, just after three, a closet router knocks on doors it has no reason to know.</p>';
}
