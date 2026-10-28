/* ============================================================
   UPTIME · editions/town-hall/quiet.js
   The Quiet Thread, first seeds (Town Hall). The intruder came in through the
   old small-office router in the Front Desk network closet and lives off the
   land: a valid service account, built-in tools, a cleared log, a scheduled
   task. It never raises an alert and has no wild encounter. Five faint clues,
   each visible only with the right capability, from Day 2 on.
   The clue situations are invented (game); the technique IDs are real (see QT_TECH).
   ============================================================ */
'use strict';

const QT_CLUES = {
  'th-signin':   {tech: 'T1078', where: 'your desk (Ledger console)',
                  seen: 'svc-print, the printer’s service account, signed in to FD-STAFF-11 at 03:12 on Day 2, right password on the first try.'},
  'th-router':   {tech: 'T1090', where: 'network closet (Lanternkeep)',
                  seen: 'Once a night, just after 03:00, the closet’s small-office router opened a short encrypted connection to an address no vendor of ours uses.'},
  'th-logclear': {tech: 'T1685.005', where: 'FD-STAFF-14 (Ledger)',
                  seen: 'FD-STAFF-14’s security log starts at 03:40 on Day 2 with a “log cleared” entry; the other PCs go back to Day 1.'},
  'th-schtask':  {tech: 'T1053.005', where: 'FD-STAFF-11 (Sentry)',
                  seen: 'A scheduled task called PrinterHealthCheck starts a built-in Windows command-line tool on FD-STAFF-11 at 03:10 each night. Nobody made it.'},
  'th-reboot':   {tech: 'T1584.008', where: 'Hal, facilities (hallway)',
                  seen: 'The old closet router keeps rebooting itself around 03:00. Its maker stopped releasing updates for it years ago.'}
};
// Staff PC hostnames by map column (the three desks in the Front Desk office).
const PC_HOSTS = {11: 'FD-STAFF-11', 14: 'FD-STAFF-14', 17: 'FD-STAFF-17'};

async function qtAfterNote(fresh) {
  if (!fresh) return;
  await say('(It doesn’t match any alert. You make a note in the Field Manual, under Unexplained.)');
  if (qtCount() === QT_SUSPECT) await say('(That’s ' + QT_SUSPECT + ' things that don’t fit. Maybe they’re one thing.)');
}

/* (a) Your desk: with logging on, Ledger shows the overnight sign-ins from Day 2. */
function qtDeskReady() { return G.f.logs && G.day >= 2 && hasTool('ledger'); }
async function qtDeskConsole() {
  await say('Ledger console, overnight sign-ins: svc-print, the printer’s service account, signed in to FD-STAFF-11 at 03:12. Right password, first try.');
  await say('Service accounts run programs, not people, and this one normally only talks to the print server. No rule fired: nothing failed.');
  await qtAfterNote(qtNote('th-signin'));
}

/* (b) Network closet, after the firewall fix: Lanternkeep can read the router's connection table. */
async function qtCloset() {
  if (!G.f.portDone || G.day < 2) return;
  if (!hasTool('lantern')) { await say('The old small-office router’s lights blink. Reading its connection table would take a network tool.'); return; }
  const i = await choose('The old small-office router hums on the shelf.', [{label: 'Lanternkeep: inspect its connections'}, {label: 'Leave it'}]);
  if (i !== 0) return;
  await say('Lanternkeep: once a night, just after 03:00, the router opens a short encrypted connection to an address that isn’t any vendor or service you use. Small, regular, and under every threshold.');
  await qtAfterNote(qtNote('th-router'));
}

/* (c) and (d) Staff PCs from Day 2: Ledger compares log lengths, Sentry reads the process tree. */
async function qtPc(x) {
  if (G.day < 2) return;
  const host = PC_HOSTS[x];
  const opts = [];
  if (hasTool('ledger')) opts.push({label: 'Ledger: check this PC’s security log', meta: {k: 'log'}});
  if (hasTool('sentry')) opts.push({label: 'Sentry: look at the process tree', meta: {k: 'tree'}});
  if (!opts.length) return;
  opts.push({label: 'Leave it', meta: {k: 'leave'}});
  const i = await choose(host + '.', opts);
  const k = opts[i].meta.k;
  if (k === 'log') {
    if (x !== 14) { await say('Ledger: ' + host + '’s security log runs back to Day 1, when you switched logging on. Steady and ordinary.'); return; }
    await say('Ledger: ' + host + '’s security log starts at 03:40 on Day 2. The other PCs go back to Day 1. Its first entry is Windows event 1102: the audit log was cleared.');
    await say('Nobody on staff remembers clearing it. The copy forwarded to the collector before 03:40 is still there.');
    await qtAfterNote(qtNote('th-logclear'));
  } else if (k === 'tree') {
    if (x !== 11) { await say('Sentry, process tree on ' + host + ': the browser, the mail app, the update service. Ordinary.'); return; }
    await say('Sentry, process tree on ' + host + ': at 03:10 each night the Task Scheduler starts a built-in Windows command-line tool. The task is called PrinterHealthCheck.');
    await say('Nobody in IT made it, and the printer has its own health checks.');
    await qtAfterNote(qtNote('th-schtask'));
  }
}

/* (e) Hallway remark from facilities, Day 2 on. */
async function qtHal(who) {
  if (G.day < 2 || !G.f.portDone) return;
  if (qtFound('th-reboot')) { await say('That closet router? Still rebooting itself now and then.', who); return; }
  await say('Funny thing: the little router in the Front Desk closet rebooted itself again last night. Third time this month.', who);
  const i = await choose('Hal shrugs.', [{label: 'Ask about the router'}, {label: '“Probably the heat.”'}]);
  if (i !== 0) return;
  await say('Lights went dark around three and came back on their own. It’s an old model; the maker stopped putting out updates for it years ago. Tomas keeps meaning to replace it.', who);
  await qtAfterNote(qtNote('th-reboot'));
}

/* End-of-slice line: explicit only with 3+ clues; otherwise one subtle line. */
function qtSummaryHtml() {
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">Note: Hunt mode opens later. Your Unexplained notes carry over.</p>';
  return '<p class="small">Overnight, the closet router blinked, went dark, and came back.</p>';
}
