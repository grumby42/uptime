/* ============================================================
   UPTIME · engine/series.js
   Series-level save (localStorage key 'uptime.series'), separate from each
   edition's own save, so later editions can read what happened earlier.
   Also the core of the Quiet Thread: a hidden, series-long intruder that lives
   off the land and never raises a normal alert. It is never part of the alert
   mix: there are no wild encounters for it, only clues an analyst may notice.
   ============================================================ */
'use strict';

const SERIES_KEY = 'uptime.series';
// Quiet Thread stages: 0 unseen · 1 noticed (a clue or two) · 2 suspected (3+ clues; hunt mode opens later)
const QT_SUSPECT = 3;

const Series = {
  data: null,
  blankQT() { return {stage: 0, cluesFound: [], evicted: false}; },
  blank() { return {v: 1, quietThread: this.blankQT(), editions: {}}; },
  normQT(q) {
    const b = this.blankQT();
    if (!q || typeof q !== 'object') return b;
    b.cluesFound = Array.isArray(q.cluesFound) ? q.cluesFound.filter(x => typeof x === 'string').filter((x, i, a) => a.indexOf(x) === i) : [];
    b.stage = Math.max(+q.stage || 0, qtStageFor(b.cluesFound.length));
    b.evicted = q.evicted === true;
    return b;
  },
  load() {
    let d = null;
    try { const raw = localStorage.getItem(SERIES_KEY); if (raw) d = JSON.parse(raw); } catch (e) { d = null; }
    const out = this.blank();
    if (d && typeof d === 'object') {
      out.quietThread = this.normQT(d.quietThread);
      if (d.editions && typeof d.editions === 'object') out.editions = d.editions;
    }
    this.data = out;
    return out;
  },
  save() { try { localStorage.setItem(SERIES_KEY, JSON.stringify(this.data)); return true; } catch (e) { return false; } },
  qt() { if (!this.data) this.load(); return this.data.quietThread; },
  // Merge a copy carried in an edition save (e.g. an imported save code) into the series record.
  merge(q) {
    const cur = this.qt(), inc = this.normQT(q);
    inc.cluesFound.forEach(c => { if (!cur.cluesFound.includes(c)) cur.cluesFound.push(c); });
    cur.stage = Math.max(cur.stage, inc.stage, qtStageFor(cur.cluesFound.length));
    cur.evicted = cur.evicted || inc.evicted;
    this.save();
  },
  markEdition(id, info) { if (!this.data) this.load(); this.data.editions[id] = Object.assign({}, this.data.editions[id] || {}, info); this.save(); }
};
function qtStageFor(n) { return n >= QT_SUSPECT ? 2 : n >= 1 ? 1 : 0; }

/* ATT&CK techniques behind the Quiet Thread clues (verified on attack.mitre.org, Oct 2026; re-checked against ATT&CK v20.0 on 28 Oct 2026).
   Kept apart from each edition's TECH table: they never appear in alerts, and they are not counted in Field Manual %. */
const QT_TECH = {
  'T1078':     {name: 'Valid Accounts', tactic: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Stealth'],
                plain: 'Signing in with a real account’s real password. Nothing fails, so nothing alerts.'},
  'T1078.002': {name: 'Valid Accounts: Domain Accounts', tactic: ['Initial Access', 'Persistence', 'Privilege Escalation', 'Stealth'],
                plain: 'Using a real domain account, and the rights it quietly holds, to blend in. A service account over-privileged years ago still looks ordinary: nothing fails, so nothing alerts.'},
  'T1090':     {name: 'Proxy', tactic: ['Command and Control'],
                plain: 'Relaying traffic through another device so neither end shows where it really comes from or goes.'},
  'T1685.005': {name: 'Disable or Modify Tools: Clear Windows Event Logs', tactic: ['Defense Impairment'],
                plain: 'Wiping a computer’s event logs so the record of what happened is gone. Before ATT&CK v19 this was T1070.001.'},
  'T1053.005': {name: 'Scheduled Task/Job: Scheduled Task', tactic: ['Execution', 'Persistence', 'Privilege Escalation'],
                plain: 'Using the Windows Task Scheduler to run a program at set times, so it keeps coming back without anyone starting it.'},
  'T1584.008': {name: 'Compromise Infrastructure: Network Devices', tactic: ['Resource Development'],
                plain: 'Taking over routers and similar network gear, often old small-office models, to use as infrastructure such as relays.'},
  'T1555':     {name: 'Credentials from Password Stores', tactic: ['Credential Access'],
                plain: 'Reading passwords from the places software keeps them (credential vaults, password managers, saved logins) instead of guessing them.'},
  // Crossroads (verified on attack.mitre.org, 7 Nov 2026, ATT&CK content v20.1).
  'T1021.001': {name: 'Remote Services: Remote Desktop Protocol', tactic: ['Lateral Movement'],
                plain: 'Signing in to another computer over remote desktop with a valid account, then acting as that user. A real account’s sign-in looks like ordinary admin work.'},
  // Crossroads, School District (verified on attack.mitre.org, 9 Nov 2026, ATT&CK content v20.1).
  'T1018':     {name: 'Remote System Discovery', tactic: ['Discovery'],
                plain: 'Finding out which other computers are on a network and which of them answer, by name or address. Even refused attempts leave a line in a firewall’s log.'},
  // Crossroads, Community Clinic (verified on attack.mitre.org, 9 Nov 2026, ATT&CK content v20.1).
  'T1083':     {name: 'File and Directory Discovery', tactic: ['Discovery'],
                plain: 'Listing the files and folders on a computer or a network share to see what is there worth taking. A listing opens no file, so file-change alerts don’t see it.'},
  // ATT&CK for ICS (verified on attack.mitre.org, 1 Nov 2026, ATT&CK v20.0).
  'T0859':     {name: 'Valid Accounts', tactic: ['Persistence', 'Lateral Movement'],
                plain: '(ATT&CK for ICS) Using a real account on a plant system, such as a remote-access box or an engineering workstation, to get in and come back. A legitimate account raises no alarm when it is used.'}
};
const QT_FIELD_NOTES = 'Field notes: the Quiet Thread is a composite (game). Its real-world basis is joint Cybersecurity Advisory AA24-038A ' +
  '(CISA, NSA and FBI with partner agencies, February 2024) on Volt Typhoon, a PRC state-sponsored group. The advisory reports access to some US ' +
  'critical-infrastructure IT networks for at least five years, using valid accounts, built-in tools, selective clearing of logs and compromised ' +
  'small-office routers, and pre-positioning to move toward operational technology (OT) and disrupt it.';

function qtCount() { return Series.qt().cluesFound.length; }
function qtFound(id) { return Series.qt().cluesFound.includes(id); }
// Keep a copy inside the edition save so export codes carry it to another device.
function qtMirror() { if (G) G.qt = JSON.parse(JSON.stringify(Series.qt())); }
// After Continue/Import: fold the save's copy into the series record, then mirror back.
function qtAdopt() { if (G && G.qt) Series.merge(G.qt); qtMirror(); }
// Record a clue (QT_CLUES is edition data). Returns true when it is new.
function qtNote(id) {
  const c = QT_CLUES[id]; if (!c) return false;
  const q = Series.qt();
  if (q.cluesFound.includes(id)) return false;
  q.cluesFound.push(id);
  q.stage = Math.max(q.stage, qtStageFor(q.cluesFound.length));
  Series.save(); qtMirror();
  toast('Field Manual: something unexplained, noted');
  return true;
}
function qtFmHtml() {
  const found = Series.qt().cluesFound.filter(id => QT_CLUES[id]);
  const others = Series.qt().cluesFound.length - found.length;
  if (!found.length && !others) return '';
  let h = '<h3>Unexplained</h3><p class="small">No alert fired for any of these. They may be nothing. (' + Series.qt().cluesFound.length + ' noted)</p>';
  for (const id of found) {
    const c = QT_CLUES[id], t = QT_TECH[c.tech];
    h += '<div class="fm"><b>' + esc(c.tech + ' ' + t.name) + '</b> <span class="tag">long campaign</span><br>' + esc(t.plain) +
      ' Tactic: ' + esc(t.tactic.join(', ')) + '.<br><small>What you noticed: ' + esc(c.seen) + ' (game)</small></div>';
  }
  if (others) h += '<div class="fm small">' + others + ' more noted in another edition.</div>';
  h += '<div class="fm small">' + esc(QT_FIELD_NOTES) + '</div>';
  return h;
}
