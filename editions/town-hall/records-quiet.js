/* ============================================================
   UPTIME · editions/town-hall/records-quiet.js
   The Quiet Thread in Records Hall: one faint clue, consistent with the earlier
   ones (svc-print, activity just after 03:00, relaying through the old router
   in the Front Desk closet). It sits in the backup console's audit log and in
   the backup server's process history, and needs the right capability: Ledger
   with logging on, or an endpoint tool. It is recorded in the series save
   exactly like the earlier clues. The situation is invented (game); the
   technique ID is real (QT_TECH: T1555 Credentials from Password Stores,
   verified on attack.mitre.org, 28 Oct 2026, ATT&CK v20.0). Never in the alert mix.
   ============================================================ */
'use strict';

Object.assign(QT_CLUES, {
  'rh-vault': {tech: 'T1555', where: 'the backup console in the Records Hall vault (Ledger or an endpoint tool)',
               seen: 'At 03:14 on the day you arrived in Records Hall, before the backup accounts were separated, svc-print signed in to the backup console from the address of the old router in the Front Desk closet and exported the stored credentials the backup server uses to reach every server it copies. The console still accepted domain accounts then, and nothing alerted.'}
});

function rhQtReady() { return !!(G.f.rhCreds && G.f.rhNight1); }
async function rhQtVault() {
  const opts = [];
  if (hasTool('ledger') && G.f.logs) opts.push({label: 'Ledger: the backup console’s audit log, before the separation', meta: {k: 'log'}});
  if (G.party.some(t => TOOLS[t.id].cls === 'endpoint')) opts.push({label: 'Endpoint tool: BKP-01’s process history', meta: {k: 'proc'}});
  if (!opts.length) { await say('The backup console’s old audit log. Reading it would take a log tool or an endpoint tool.'); return; }
  opts.push({label: 'Leave it', meta: {k: 'leave'}});
  const i = await choose('The backup console. Its audit log goes back a year.', opts);
  const k = opts[i].meta.k;
  if (k === 'leave') return;
  const day = RH().day0;
  if (k === 'log') await say('Ledger: Day ' + day + ', 03:14. svc-print signs in to the backup console, from the address of the Front Desk closet router, and exports the stored credentials. Right password, first try. svc-print was in the old domain group the console trusted. (game)');
  else await say('Endpoint history on BKP-01: Day ' + day + ', 03:14. The console’s export runs under svc-print and writes the stored-credentials file to a temp folder; at 03:15 the file is read over the network from the Front Desk closet router’s address, then deleted. (game)');
  await say('A printer’s service account has no reason to read the passwords the backup server uses. It happened before you separated the accounts, and Nico rotated every one of those passwords when you did. No rule fired: the account had the rights.');
  await qtAfterNote(qtNote('rh-vault'));
}

function rhQtSummaryHtml() {
  const mine = qtFound('rh-vault');
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">' + (mine ? 'It went for the keys to the backups, through the same old router, as the same service account. ' : '') + 'Hunt mode opens later. Your Unexplained notes carry over.</p>';
  if (mine) return '<p class="small">A printer account read the backup server’s passwords at three in the morning. Probably nothing.</p>';
  return '<p class="small">In the backup console’s old audit log, one sign-in at 03:14 points back toward the Front Desk.</p>';
}
