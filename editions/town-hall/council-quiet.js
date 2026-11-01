/* ============================================================
   UPTIME · editions/town-hall/council-quiet.js
   The Quiet Thread in Council Chambers: no new clue and no new technique. The
   suspicion file (the Basement's timeline, then the Server Room's nested group
   and the Water Plant's account on the vendor box) is formally handed to the
   town attorney, to the council's risk committee, in closed session, and to an
   outside incident-response firm (game). Rae's rule stays: nothing changes on svc-print without
   a plan. The edition ends with the file still open: the thread continues
   across editions (engine/series.js).
   ============================================================ */
'use strict';

// What the file holds, from what this player actually found (never more).
function ccQtFileLines() {
  const L = [];
  const n = typeof bmQtTimeline === 'function' ? bmQtTimeline().length : 0;
  if (n) L.push(n + ' Unexplained note' + (n === 1 ? '' : 's') + ' on the Basement’s one timeline, every one between 03:00 and 03:40');
  if (qtFound('sv-nesting')) L.push('svc-print nested in a group with local admin on every member server and every 2019 laptop, added in 2019 by a.kerr-adm');
  if (qtFound('wt-vendorbox')) L.push('svc-print’s account on RA-01, the plant’s vendor box, created 14 March 2019 by a.kerr-adm');
  return L;
}

async function ccQtHandOff() {
  const who = 'Rae Okafor';
  const lines = ccQtFileLines();
  await say('One last thing before you sign off the week. The suspicion file. It has been mine since the Basement; it shouldn’t be only mine.', who);
  const body = '<p>The suspicion file, as it stands (' + qtCount() + ' clue' + (qtCount() === 1 ? '' : 's') + ' noted):</p><ul>' +
    (lines.length ? lines.map(x => '<li>' + esc(x) + '</li>').join('') : '<li>' + esc('Rae’s notes on svc-print and the closet router') + '</li>') +
    '</ul><p class="small">Nobody knows who, or why, or whether it is still moving. (game)</p>';
  while (true) {
    const i = await UI.openModal('The suspicion file', body, [
      {label: 'Hand it over formally: Noor, Bram’s committee in private, and the outside firm; Rae’s rule stays', meta: {good: true, k: 'hand'}},
      {label: 'Present it to the full council in open session, so residents can see the town is being open about it', meta: {k: 'open'}},
      {label: 'Keep it inside the team: Noor, the council and any outsider would only slow Rae down for now', meta: {k: 'keep'}},
      {label: 'Close the file: RA-01 shows no sign-in by svc-print in ninety days, so whatever it was has stopped', meta: {k: 'shut'}}], {shuffle: true, closable: false, cls: 'drill'});
    if (i === 0) break;
    if (i === 1) await say('An open session is public. Whoever is behind svc-print can read the minutes too. The risk committee, in closed session where Noor says the law allows it, on a need-to-know basis.', who);
    else if (i === 2) await say('A suspicion this old, in this many districts, needs people who do nothing else, and the council has to know it owns the risk. That’s what the firm and the committee are for, and Noor decides what the insurer and anyone else must hear.', who);
    else await say('Ninety days on one box. The file shows svc-print and the closet router in the small hours, district after district, and nobody has explained any of it. You don’t close what you can’t explain.', who);
  }
  G.cc.file = {handed: G.day, clues: qtCount()};
  G.f.ccFile = true; touchCSF('Govern');
  Series.markEdition(EDITION.id, {suspicionFileHandedOver: true});
  await say('Noor has it, and decides what the insurer and anyone else must hear. Bram took it into closed session this afternoon. The outside firm starts on Monday, with me. My rule stays: nothing changes on svc-print without a plan. (game)', who);
  await say('We still don’t know who, or why, or whether it is moving. It goes with us to whatever the town asks of us next.', who);
  await say('(The Quiet Thread is still open. It continues.)');
}

function ccQtSummaryHtml() {
  if (Series.qt().evicted) return '';
  if (G.f.ccFile) return '<p class="big">The Quiet Thread is still open.</p><p class="small">The suspicion file went to the town attorney, to the council’s risk committee in closed session and to an outside firm. svc-print, the 2019 admin account, the router in the closet: nobody knows who, or why. It continues.</p>';
  if (qtCount() >= QT_SUSPECT) return '<p class="small">Something quiet is still moving: the same service account, the same patient pattern.</p>';
  return '';
}
