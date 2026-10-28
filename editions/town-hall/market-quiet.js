/* ============================================================
   UPTIME · editions/town-hall/market-quiet.js
   The Quiet Thread in Market Square: one faint clue, consistent with the
   earlier ones (svc-print, activity just after 03:00, relaying through the old
   router in the Front Desk closet). It sits in the DMZ firewall log and needs
   the right capability: Lanternkeep (network), or Ledger with logging on. It is
   recorded in the series save exactly like the earlier clues. The situation is
   invented (game); the technique ID is real (QT_TECH: T1090 Proxy, verified on
   attack.mitre.org, 28 Oct 2026, ATT&CK v20). Never in the alert mix.
   ============================================================ */
'use strict';

Object.assign(QT_CLUES, {
  'mk-dmzhop': {tech: 'T1090', where: 'DMZ firewall log rack (Lanternkeep or Ledger)',
                seen: 'At 03:09, WEB-01, the town website server, opened a short connection to the old router in the Front Desk closet, and the session signed in as svc-print. Nothing in the web tier ever talks to that network, and the printer’s service account has no business in the DMZ.'}
});

async function mkQtRack() {
  const f = G.f;
  if (!f.mkNight1) { await say('The DMZ firewall and its log store. Every connection in or out of Market Square is written here.'); return; }
  const opts = [];
  if (hasTool('lantern')) opts.push({label: 'Lanternkeep: DMZ connections overnight', meta: {k: 'net'}});
  if (hasTool('ledger') && f.logs) opts.push({label: 'Ledger: DMZ sign-ins overnight', meta: {k: 'log'}});
  if (!opts.length) { await say('The DMZ log store. Reading it would take a network tool or a log tool.'); return; }
  opts.push({label: 'Leave it', meta: {k: 'leave'}});
  const i = await choose('The DMZ firewall log. Last night, 00:00 to 06:00.', opts);
  const k = opts[i].meta.k;
  if (k === 'leave') return;
  if (k === 'net') await say('Lanternkeep: at 03:09 WEB-01 opened a short connection inward, to the old small-office router in the Front Desk closet. An “any to any” rule from the router’s install years ago lets it through. (game) Nothing else in the web tier talks to that network.');
  else await say('Ledger: at 03:09 a session from the Front Desk closet router’s address signed in to WEB-01’s admin service as svc-print. Right password, first try. (game)');
  await say('The printer’s service account has no reason to be in the DMZ at three in the morning, and the web server has no reason to talk to a closet router. No rule fired: nothing was blocked, nothing failed.');
  await qtAfterNote(qtNote('mk-dmzhop'));
}

function mkQtSummaryHtml() {
  const mine = qtFound('mk-dmzhop');
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">' + (mine ? 'It reaches the internet-facing servers now, through the same old router, as the same service account. ' : '') + 'Hunt mode opens later. Your Unexplained notes carry over.</p>';
  if (mine) return '<p class="small">A web server talked to a closet router at three in the morning. Probably nothing.</p>';
  return '<p class="small">In the DMZ log, one short connection at 03:09 points back toward the Front Desk.</p>';
}
