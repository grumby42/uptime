/* ============================================================
   UPTIME · editions/town-hall/mailroom-quiet.js
   The Quiet Thread in the Mail Room: two more faint clues, consistent with the
   Front Desk ones (03:00-ish activity, living off the land, interest in
   building systems). Both sit on an old shared mailbox console in the gateway
   room and need the right capability: Ledger with logging on, or the Sieve line.
   They are recorded in the series save exactly like the Town Hall clues.
   The situations are invented (game); the technique IDs are real (QT_TECH).
   ============================================================ */
'use strict';

// Verified on attack.mitre.org, Oct 2026 (ATT&CK v20): T1114.003, Collection. Never in the alert mix.
QT_TECH['T1114.003'] = {name: 'Email Collection: Email Forwarding Rule', tactic: ['Collection'],
  plain: 'A mailbox rule that quietly forwards copies of mail somewhere else. It can keep working after the account’s password is reset.'};

Object.assign(QT_CLUES, {
  'mr-fwdrule': {tech: 'T1114.003', where: 'old shared mailbox console (Sieve)',
                 seen: 'facilities-bms@, a shared mailbox nobody has opened in two years, got a forwarding rule at 03:17 two nights ago: copies of anything mentioning “HVAC”, “controller” or “building management” go to an outside address.'},
  'mr-legacy':  {tech: 'T1078', where: 'old shared mailbox console (Ledger)',
                 seen: 'facilities-bms@ signed in at 03:16 two nights ago, right password first time, over an old mail protocol that only asks for a password, from an address inside the Front Desk network.'}
});

async function mrOldBox() {
  if (!G.f.mrMet) { await say('A dusty console for the old shared mailboxes. Bea should show you around first.'); return; }
  const opts = [];
  if (hasTool('ledger') && G.f.logs) opts.push({label: 'Ledger: sign-in audit for the old shared mailboxes', meta: {k: 'log'}});
  if (hasTool('sieve') || hasTool('sifter')) opts.push({label: (hasTool('sifter') ? 'Sifter' : 'Sieve') + ': rules on the old shared mailboxes', meta: {k: 'rules'}});
  if (!opts.length) { await say('The console for the old shared mailboxes: facilities-bms@, permits-old@, scans@. Reading their settings would take a log tool or a mail tool.'); return; }
  opts.push({label: 'Leave it', meta: {k: 'leave'}});
  const i = await choose('Old shared mailboxes: facilities-bms@, permits-old@, scans@.', opts);
  const k = opts[i].meta.k;
  if (k === 'log') {
    await say('Ledger: permits-old@ and scans@ have had no sign-ins for over a year. facilities-bms@ signed in at 03:16 two nights ago. Right password, first try.');
    await say('It used an old mail protocol that only asks for a password, and the address is inside the Front Desk network. Nobody in facilities was in at three.');
    await qtAfterNote(qtNote('mr-legacy'));
  } else if (k === 'rules') {
    await say('Rules on facilities-bms@: one, created at 03:17 two nights ago. Forward a copy of anything that mentions “HVAC”, “controller” or “building management” to an outside address.');
    await say('No alert fired: nobody set one up for rules that forward outside, and this old mailbox was never covered by the policy that blocks outside forwarding. And a rule keeps forwarding even if the password changes.');
    await qtAfterNote(qtNote('mr-fwdrule'));
  }
}

function mrQtSummaryHtml() {
  const mine = ['mr-fwdrule', 'mr-legacy'].filter(qtFound).length;
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">' + (mine ? 'It reads about building systems, and it has been doing it for a while. ' : '') + 'Hunt mode opens later. Your Unexplained notes carry over.</p>';
  if (mine) return '<p class="small">An old shared mailbox nobody uses has a new rule. Probably nothing.</p>';
  return '<p class="small">In the gateway room, an old console blinks at three in the morning.</p>';
}
