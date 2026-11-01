/* ============================================================
   UPTIME · editions/town-hall/water-quiet.js
   The Quiet Thread at the Water Plant. One more faint clue, found while the
   player reviews the vendor remote-access box (RA-01) for the plant manager's
   directive: its local account list holds svc-print, created on 14 March 2019
   by a.kerr-adm, the admin account deleted in 2021 that nested svc-print in the
   Server Room's groups the same month (CHG-1907, the printer rollout and the
   closet router). RA-01's 90 days of sign-in logs show no use of it. It ties to
   the Server Room clue and the Basement suspicion file. It is not resolved: the
   thread continues.
   The situation is invented (game); the technique ID is real (QT_TECH: T0859
   Valid Accounts, ATT&CK for ICS, verified on attack.mitre.org, 1 Nov 2026,
   ATT&CK v20). Never in the alert mix. Not part of the Basement suspicion
   file's 12-note timeline (found after it was handed over).
   ============================================================ */
'use strict';

Object.assign(QT_CLUES, {
  'wt-vendorbox': {tech: 'T0859', where: 'the vendor remote-access box at the Water Plant (RA-01’s account list)',
                   seen: 'Reviewing RA-01 for the on-demand change, you list its local accounts: the filter vendor’s, the pump vendor’s, Joss’s, and svc-print. Created 14 March 2019 by a.kerr-adm, the admin account deleted in 2021, with the comment “temp - printer vendor”, the same month a.kerr-adm nested svc-print in the Server Room’s groups. RA-01 keeps 90 days of sign-ins and shows none for it. A printer account on the box that reaches the plant’s engineering workstation. Left in place on Rae’s rule; the box is off between approved windows now. Added to the suspicion file. Not resolved.'}
});

// Found during the directive, reviewing RA-01's accounts. Returns true when the clue is new.
async function wtQtVendorBox() {
  await say('RA-01’s local accounts: fc-support (the filter vendor), pv-ksato (the pump vendor), j.kettering (me), and… svc-print. Created 14 March 2019 by a.kerr-adm. Comment: “temp - printer vendor”. (game)', 'Joss Kettering');
  await say('A printer account, on the box that reaches my engineering workstation. RA-01 keeps ninety days of sign-ins; it shows nothing for svc-print. Before that, nobody can say.', 'Joss Kettering');
  const fresh = qtNote('wt-vendorbox');
  await qtAfterNote(fresh);
  if (fresh) await say('That’s the account from Rae’s file, and the same admin account and month as the Server Room nesting. Her rule holds: nothing changes on svc-print without her. It stays as it is; the box is off between approved windows from today, and I’ll tell her tonight.', 'Joss Kettering');
  return fresh;
}

function wtQtSummaryHtml() {
  const found = qtFound('wt-vendorbox');
  if (Series.qt().evicted) return '';
  if (found) return '<p class="big">The Quiet Thread is still on file.</p><p class="small">svc-print has an account on the box that reaches the plant’s engineering workstation, made in 2019 by the same long-gone admin account. Added to the suspicion file. Still not resolved. It continues.</p>';
  if (qtCount() >= QT_SUSPECT) return '<p class="small">Something quiet is still moving: the same service account, the same patient pattern, carried over from the suspicion file.</p>';
  return '';
}
