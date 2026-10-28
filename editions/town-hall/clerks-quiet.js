/* ============================================================
   UPTIME · editions/town-hall/clerks-quiet.js
   The Quiet Thread in Clerks' Row: two more faint clues, consistent with the
   earlier ones (svc-print, activity just after 03:00, built-in tools, relaying
   through FD-STAFF-11). Both sit on one laptop, CR-LT-12, and need the right
   capability: an endpoint tool (Watchling, Sentry or Overwatch), or Ledger once
   PowerShell script block logging is on. They are recorded in the series save
   exactly like the Town Hall and Mail Room clues. The situations are invented
   (game); the technique IDs are real (QT_TECH). ATT&CK's Volt Typhoon page
   (G1017) lists netsh port proxies (T1090.001) and ipconfig / netsh portproxy
   discovery (T1016) among that group's living-off-the-land habits.
   ============================================================ */
'use strict';

// Verified on attack.mitre.org, 28 Oct 2026 (ATT&CK v20). Never in the alert mix.
QT_TECH['T1090.001'] = {name: 'Proxy: Internal Proxy', tactic: ['Command and Control'],
  plain: 'Turning one machine inside the network into a relay for another, for example with Windows’ built-in netsh port proxy, so traffic seems to come from somewhere ordinary.'};
QT_TECH['T1016'] = {name: 'System Network Configuration Discovery', tactic: ['Discovery'],
  plain: 'Asking a machine about its network: addresses, firewall settings, existing port proxies. Built-in commands like ipconfig and netsh do it, and admins run them too.'};

const CR_QT_HOST = 'CR-LT-12';
Object.assign(QT_CLUES, {
  'cr-portproxy': {tech: 'T1090.001', where: 'CR-LT-12 (endpoint tool)',
                   seen: 'At 03:07 svc-print, the printer’s service account, ran Windows’ built-in netsh on CR-LT-12 and added a port proxy: a local port now forwards to FD-STAFF-11.'},
  'cr-netconfig': {tech: 'T1016', where: 'CR-LT-12 (Ledger, script block log)',
                   seen: 'At 03:05 svc-print ran a short PowerShell block on CR-LT-12: ipconfig /all, then netsh interface portproxy show all. Two minutes before the port proxy appeared.'}
});

function crEndpointTool() { return ['overwatch', 'sentry', 'watchling'].find(hasTool) || null; }
async function crQtLaptop() {
  if (G.day < 2) return;
  const opts = [];
  const ep = crEndpointTool();
  if (ep) opts.push({label: TOOLS[ep].name + ': process history overnight', meta: {k: 'proc'}});
  if (hasTool('ledger') && G.f.crPslog) opts.push({label: 'Ledger: script block log (4104) overnight', meta: {k: 'log'}});
  if (!opts.length) return;
  opts.push({label: 'Leave it', meta: {k: 'leave'}});
  const i = await choose(CR_QT_HOST + ', the spare laptop at the end of the row.', opts);
  const k = opts[i].meta.k;
  if (k === 'proc') {
    await say(TOOLS[ep].name + ': at 03:07, svc-print ran netsh.exe on ' + CR_QT_HOST + '. It added a port proxy: a local port now forwards to FD-STAFF-11.');
    await say('netsh is a built-in Windows tool. The printer’s service account has no reason to be on a clerk’s laptop at three in the morning, and it is still in this laptop’s Administrators group: the local admin clean-up only counted staff. (game) No rule fired: nothing was blocked, nothing failed.');
    await qtAfterNote(qtNote('cr-portproxy'));
  } else if (k === 'log') {
    await say('Ledger, event 4104 on ' + CR_QT_HOST + ' at 03:05: svc-print ran a short PowerShell block. ipconfig /all. netsh interface portproxy show all.');
    await say('Two built-in commands, the kind admins type every day. Asking which port proxies already exist, two minutes before one appeared.');
    await qtAfterNote(qtNote('cr-netconfig'));
  }
}

function crQtSummaryHtml() {
  const mine = ['cr-portproxy', 'cr-netconfig'].filter(qtFound).length;
  if (qtCount() >= QT_SUSPECT) return '<p class="big">Something quiet is moving in the network.</p><p class="small">' + (mine ? 'It hops between machines with tools that ship with Windows, and it always comes back to FD-STAFF-11. ' : '') + 'Hunt mode opens later. Your Unexplained notes carry over.</p>';
  if (mine) return '<p class="small">A spare laptop forwards a port nobody asked for. Probably nothing.</p>';
  return '<p class="small">At the end of the row, a spare laptop wakes at three in the morning.</p>';
}
