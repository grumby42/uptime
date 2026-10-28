/* ============================================================
   UPTIME · editions/town-hall/server-quiet.js
   The Quiet Thread in the Server Room. One more faint clue, found while the
   player builds the service-account registry: svc-print is a member of a long
   nested chain of groups that grants it local-administrator rights on servers
   and laptops all over town, added years ago by an admin account that no longer
   exists. It ties to every earlier clue (svc-print, the old router, the rights
   it should never have had) and to the Basement suspicion file. It is not
   resolved: the thread continues.
   The situation is invented (game); the technique ID is real (QT_TECH:
   T1078.002 Valid Accounts: Domain Accounts, verified on attack.mitre.org,
   28 Oct 2026, ATT&CK v20). Never in the alert mix. This clue is NOT part of
   the Basement suspicion file's timeline (it is found after that file is handed
   over), so the Basement's 12-note timeline is unchanged.
   ============================================================ */
'use strict';

Object.assign(QT_CLUES, {
  'sv-nesting': {tech: 'T1078.002', where: 'the service-account registry in the Server Room (Tessera, tracing the rights)',
                 seen: 'Building the registry, you trace svc-print’s rights: it sits in PRN-Mgmt, which is nested in SRV-Ops-Legacy, which group policy puts in the local Administrators group of every member server and of the 2019 laptops. A printer’s service account has had local admin everywhere for years. The nesting was added in 2019 by a.kerr-adm, an admin account deleted when Alan Kerr left in 2021; the group-change record from then is long gone, and the only trace is the change ticket. Rae’s rule from the Basement still holds: nothing changes on svc-print without her. Added to the suspicion file. Not resolved.'}
});

// Found while registering svc-print: Tessera (or Keyling) traces the nested groups. Returns true when the clue is new.
async function svQtNesting() {
  await say('Registering svc-print (owner: facilities). Trace its rights, and the chain runs deep: PRN-Mgmt → SRV-Ops-Legacy → local administrator on every member server and every 2019 laptop. (game)', 'Tamsin Fry');
  await say('A printer’s service account, local admin across the town, for years. The nesting was added in 2019 by a.kerr-adm, an admin account deleted when Alan Kerr left in 2021. The only record of who did it is the change ticket: the group-change event is long gone.', 'Tamsin Fry');
  const fresh = qtNote('sv-nesting');
  await qtAfterNote(fresh);
  if (fresh) await say('This is the account from Rae’s suspicion file. Her rule still stands: nothing changes on svc-print without her. It goes in the file. Not touched, not resolved.', 'Beatriz Solano');
  return fresh;
}

function svQtSummaryHtml() {
  const found = qtFound('sv-nesting');
  if (Series.qt().evicted) return '';
  if (found) return '<p class="big">The Quiet Thread is still on file.</p><p class="small">Now you can see how svc-print held rights everywhere: a nested group added in 2019 by an account long gone. Added to the suspicion file. Still not resolved. It continues.</p>';
  if (qtCount() >= QT_SUSPECT) return '<p class="small">Something quiet is still moving: the same service account, the same patient pattern, carried over from the Basement’s suspicion file.</p>';
  return '';
}
