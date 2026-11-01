/* ============================================================
   UPTIME · editions/town-hall/water-data.js
   Town Hall district 8, the Water Plant (operational technology / industrial
   control): art, map, people, ATT&CK for ICS techniques met here, threats,
   alert templates, briefings, the fieldwork (OT asset inventory, internet
   exposure and default passwords, offline PLC logic backups and manual
   operation, passive monitoring), the zones and conduits mini-game, three
   investigation drills, the Network Traffic Analysis dojo, the Plant Board and
   the boss incident's cards, Field Manual text. It extends the earlier
   districts' tables; the only change to their data is the Server Room's west
   wall in the lower room, which becomes the Water Plant door (marked), opened
   by the Crown Badge.
   Safety first: in a plant, the operators own the process and have the final
   say on anything that touches it. Over-reaction (power off a controller
   mid-process, shut the pumps, unplug everything) is graded as wrong as often
   as under-reaction. The player never operates the process or the chemical
   dosing skid. Everything is written from the defender's side: records,
   alerts, ownership and remediation; no protocol commands, no tool syntax.
   People, hosts, domains (.example), addresses (RFC 5737 only), tickets,
   counts and timings are invented (game). Real facts are cited in CREDITS.md,
   section "Water Plant". ATT&CK for ICS IDs verified on attack.mitre.org on
   1 November 2026 (ATT&CK v20.0; in v20 the old T0812 Default Credentials page
   redirects to T1694.001). Timeline: scratchpad water-timeline.md.
   ============================================================ */
'use strict';

/* ---------- Art (original) ---------- */
// Threat sprites reuse earlier original grids under new palettes (an engine convenience); the Tidewatch tool and the dosing skid are new.
Object.assign(S, {
  tidewatch: ["0000000110000000","0000001441000000","0000012332100000","0000013443100000","0000012332100000","0000001221000000","0000001331000000","0000001231000000","0000001331000000","0000012332100000","0000123333210000","0001233333321000","0012222222222100","0122112211221110","1221221122112211","0111111111111110"],
  skid: ["0000000000000000","0001111111110000","0012333333321000","0123444444432100","0123333333332100","0123444444432100","0123333333332100","0123444444432111","0123333333332121","0012222222221121","0001111111110121","0001200000210121","0001200000211121","0001200000210000","0011110001111000","0000000000000000"]
});
Object.assign(PAL, {
  wtHmi: ['#1b2233', '#24402f', '#2f6e3e', '#a6d96a'],
  wtHmiOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  wtPlc: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  wtPlcOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  wtFw: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  wtFwOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  wtVend: ['#1b2233', '#2a3550', '#5a6fa0', '#9ff0c8'],
  wtVendOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  wtNet: ['#1b2233', '#24402f', '#2f6e3e', '#a6d96a'],
  wtNetOk: ['#1b2233', '#24402f', '#2f6e3e', '#9ff0c8'],
  wtHist: ['#2a2523', '#5b4a42', '#8c7b70', '#7cc6c4'],
  wtSkid: ['#1b2233', '#3a4a6b', '#7fa2d6', '#dbeaf7'],
  wtDojo: ['#1b2233', '#1f5a8a', '#7fa2d6', '#ffd96a'],
  wtBoard2: ['#1b2233', '#1f5a8a', '#7cc6c4', '#ffd96a'],
  wtTray: ['#1b2233', '#2b2f3a', '#4a5163', '#7cc6c4'],
  // threat palettes
  wtPreset: ['#141414', '#1f5a8a', '#7cc6c4', '#ffd96a'],
  wtRewrite: ['#141414', '#4a1414', '#b8432f', '#7cc6c4'],
  wtNudge: ['#141414', '#5b3a26', '#c98a54', '#7cc6c4'],
  wtBlind: ['#141414', '#2b2f3a', '#4a5163', '#ff9f43'],
  wtCross: ['#141414', '#3a1d10', '#a8703f', '#9ff0c8'],
  // tool
  tidewatch: ['#1b2233', '#1f5a8a', '#7cc6c4', '#ffd96a'],
  // people
  mae: ['#1a1a2e', '#2b1d16', '#8a5a3c', '#1f5a8a'],
  joss: ['#1a1a2e', '#5b4a42', '#e0b090', '#2f6e3e'],
  gil: ['#1a1a2e', '#3a4a6b', '#c98a54', '#5b3a26'],
  calla: ['#1a1a2e', '#141414', '#a8703f', '#7cc6c4'],
  hanne: ['#1a1a2e', '#5b4a42', '#e0b090', '#1f5a8a']
});
Object.assign(TILES, {
  '[': {spr: 'pc', pal: 'wtHmi', solid: true, under: ','},        // HMI consoles in the control room
  ']': {spr: 'K', pal: 'wtPlc', solid: true},                      // PLC cabinets (and the engineering workstation beside them)
  '{': {spr: 'K', pal: 'wtHist', solid: true},                     // the control historian, HIST-01
  '}': {spr: 'K', pal: 'wtFw', solid: true},                       // FW-OT, the IT/OT boundary firewall
  '<': {spr: 'pc', pal: 'wtVend', solid: true, under: ','},       // RA-01, the vendor remote-access box
  '-': {spr: 'K', pal: 'wtNet', solid: true},                      // the control network rack (mirror ports, the sensor)
  '>': {spr: 'skid', pal: 'wtSkid', solid: true, under: ','},     // the chemical dosing skid (shown, never touched)
  '`': {spr: 'pc', pal: 'wtDojo', solid: true, under: ','},       // Network Traffic Analysis dojo terminals
  '?': {spr: 'K', pal: 'wtBoard2', solid: true},                   // Plant Board racks
  '|': {spr: 'trays', pal: 'wtTray', grass: true}                  // field cabling nobody watches: trips alerts
});

/* ---------- Tools: Lanternkeep's next form (network, passive monitoring) ---------- */
Object.assign(TOOLS, {
  tidewatch: {name: 'Tidewatch', cls: 'network', sub: 'OT traffic monitor', spr: 'tidewatch', blurb: 'Lanternkeep, gone quiet. Listens to a copy of the plant’s traffic and never sends a packet of its own.',
              abil: ['flow', 'listen', 'egress', 'closeport']}
});
EVOLVED_FROM.tidewatch = 'lantern';
Object.assign(ABIL, {
  listen: {name: 'Passive listen', type: 'inv', cost: 2, ev: 26, desc: 'Read a copy of the plant network’s traffic from a mirror port and compare it with its baseline: who talks to which controller, how often, and with what kind of request. It never sends anything to the devices themselves.'}
});

/* ---------- Map: the Water Plant and the Plant Board ---------- */
// North-west: the control room (HMI consoles). North: the PLC cabinets and the engineering workstation. North-east: the
// historian and the chemical dosing skid. Middle: the IT/OT boundary (FW-OT, the vendor box, the network rack); the west
// wall door leads to the Plant Board. South: the Network Traffic Analysis dojo, your desk, and the door back to the Server Room (east wall).
Object.assign(MAPS, {
  water: {
    name: 'Water Plant',
    rows: [
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwww",
      "w,[,[,[,,w,],],],],,w,{,,>>,w",
      "w,,,,,,,,w,,,,,,,,,,w,,,,>>,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,w,,,,,,,,,,w,,,,,,,w",
      "wwwwwwww,,wwwwwwwwwwww,,wwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "D,,,,,,,,,,,,},,<,,-,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "wwwwww,wwwwwwwwwwwwwww,wwwwww",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,w",
      "w,,`,`,`,,,,,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,,,,,,,,,,,,D",
      "w|||,,,,,,,,Y,,,,,,,,,,,|||,w",
      "w|||,,,,,,,,,,,,,,,,,,,,|||,w",
      "wwwwwwwwwwwwwwwwwwwwwwwwwwwww"
    ],
    doors: {'28,12': {to: 'server', x: 1, y: 12, dir: 'right'},
      '0,7': {to: 'ptboard', x: 16, y: 5, dir: 'left'}}
  },
  ptboard: {
    name: 'Plant Board',
    rows: [
      "wwwwwwwwwwwwwwwwww",
      "w??,,,,,,,,,,,,??w",
      "w??,,,,,,,,,,,,??w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,E",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "w,,,,,,,,,,,,,,,,w",
      "wwwwwwwwwwwwwwwwww"
    ],
    doors: {'17,5': {to: 'water', x: 1, y: 7, dir: 'right'}}
  }
});
// The one change to earlier data: the Server Room's west wall (lower room) becomes the door to the Water Plant (Crown Badge opens it).
MAPS.server.rows[12] = 'D' + MAPS.server.rows[12].slice(1);
MAPS.server.doors['0,12'] = {to: 'water', x: 27, y: 12, dir: 'left',
  get locked() { return (typeof G !== 'undefined' && G && G.f.svCrown) ? undefined : 'A door in the west wall. A card reader: “Water Plant. Crown Badge required.”'; }};

const WT_MAPS = ['water', 'ptboard'];
const WT_HOSTS = ['HMI-01 · control room', 'EWS-01 · engineering', 'PLC-FLT-01 · filters', 'PLC-HSP-01 · high-service pumps', 'HIST-01 · historian', 'FW-OT · IT/OT boundary'];

/* ---------- People ---------- */
NPCS.push(
  {id: 'mae', name: 'Mae Arroyo', role: 'control-room shift lead', map: 'water', x: 4, y: 3, dir: 'down', pal: 'mae'},
  {id: 'joss', name: 'Joss Kettering', role: 'controls engineer', map: 'water', x: 14, y: 3, dir: 'down', pal: 'joss'},
  {id: 'gil', name: 'Gil Hartley', role: 'plant manager', map: 'water', x: 7, y: 7, dir: 'right', pal: 'gil', cond: G => !!G.f.wtDrill2 && !G.f.wtDirective},
  {id: 'calla', name: 'Calla Brandt', role: 'traffic analysis coach', map: 'water', x: 10, y: 11, dir: 'left', pal: 'calla'},
  {id: 'hanne', name: 'Hanne Sorvik', role: 'plant board lead', map: 'ptboard', x: 8, y: 2, dir: 'down', pal: 'hanne'},
  {id: 'raewt', name: 'Rae Okafor', role: 'SOC lead', map: 'water', x: 16, y: 8, dir: 'left', pal: 'rae', cond: G => !!G.f.wtBoss}
);
const WT_NPC_IDS = ['mae', 'joss', 'gil', 'calla', 'hanne', 'raewt'];

/* ---------- ATT&CK for ICS techniques met in the Water Plant (verified on attack.mitre.org, 1 Nov 2026, ATT&CK v20.0) ---------- */
Object.assign(TECH, {
  'T1694.001': {name: 'Insecure Credentials: Default Credentials', tactic: ['Persistence', 'Lateral Movement'], desc: '(ATT&CK for ICS) Signing in to a control device with the user name and password its maker shipped it with. Those defaults are printed in manuals and online, often carry full rights, and some devices can’t change them at all. Before ATT&CK v20 this was T0812.'},
  'T0883': {name: 'Internet Accessible Device', tactic: ['Initial Access'], desc: '(ATT&CK for ICS) Getting into a plant through a device that answers from the internet, on purpose or by accident, with weak protection or none. No exploit is needed: online scanners find such devices for anyone.'},
  'T0843': {name: 'Program Download', tactic: ['Lateral Movement'], desc: '(ATT&CK for ICS) Sending a new program to a controller. A full download may need the controller stopped first; online edits keep it running. Defenders watch for downloads outside change windows and compare the running logic with a known-good copy.'},
  'T0836': {name: 'Modify Parameter', tactic: ['Impair Process Control'], desc: '(ATT&CK for ICS) Changing the values that tell a controller how and when to act (set points, limits, run times), to high, low or impossible values that can damage equipment or upset the process.'},
  'T0829': {name: 'Loss of View', tactic: ['Impact'], desc: '(ATT&CK for ICS) Taking away the operators’ view of the process for a long time or for good, so recovery needs someone at the device to restart it or run it by hand. The process may keep running while nobody can see it.'},
  'T0886': {name: 'Remote Services', tactic: ['Initial Access', 'Lateral Movement'], desc: '(ATT&CK for ICS) Using ordinary remote services (remote desktop, file sharing, secure shell) to move between networks, for example from an office network onto an engineering workstation or an HMI.'},
  'T0888': {name: 'Remote System Information Discovery', tactic: ['Discovery'], desc: '(ATT&CK for ICS) Asking remote devices about themselves (their role, model and configuration), usually over the plant’s own automation protocols, to choose targets and plan next steps.'}
});

/* ---------- Threats (wild alerts) ---------- */
Object.assign(THREATS, {
  preset: {name: 'Preset', tech: 'T1694.001', spr: 'hinge', pal: 'wtPreset', tags: ['exposed', 'ot'], bucket: 'cred', district: 'water'},
  rewrite: {name: 'Rewrite', tech: 'T0843', spr: 'quill', pal: 'wtRewrite', tags: ['ot'], bucket: 'other', district: 'water'},
  nudge: {name: 'Nudge', tech: 'T0836', spr: 'climber', pal: 'wtNudge', tags: ['ot'], bucket: 'other', district: 'water'},
  blindside: {name: 'Blindside', tech: 'T0829', spr: 'shade', pal: 'wtBlind', tags: ['ot'], bucket: 'other', district: 'water'},
  crossing: {name: 'Crossing', tech: 'T0886', spr: 'sweep', pal: 'wtCross', tags: ['lateral', 'ot'], bucket: 'other', district: 'water'}
});
// (game) base weights for the Water Plant threats; they only enter the mix once you reach the Water Plant.
MAL_WEIGHTS.push({t: 'preset', w: 3}, {t: 'rewrite', w: 2}, {t: 'nudge', w: 2}, {t: 'blindside', w: 2}, {t: 'crossing', w: 2});
const WT_HOME = ['preset', 'rewrite', 'nudge', 'blindside', 'crossing'];
// Network tools gain the 'ot' tag: plant traffic is read from the network, never by putting software on the controllers.
CLASSES.network.strongTags = (CLASSES.network.strongTags || []).concat(['ot']);

// A response marked shutdown: true is the over-reaction (power off, shut the pumps, unplug the plant). The Tide Badge
// puts the operators' sign-off in front of it: it is still the wrong answer, but nothing gets shut down.
Object.assign(ALERTS, {
  preset: {
    rule: 'Sign-in to a plant device with its factory password',
    mal: {clues: ['A booster-station panel accepted a sign-in with its factory user name and password from 203.0.113.19, an address abroad.', 'The panel answers from the internet through a cellular router that isn’t on the inventory.', 'The session opened the set-point screen and stayed there for four minutes; the operator on shift sees nothing odd yet.'],
          truth: 'Default credentials on a device reachable from the internet. The factory password and the exposure decide it.',
          resp: [{label: 'Take the panel off the internet and change its password with the engineer: the operators decide on manual', good: true},
                 {label: 'Shut down the booster station and run its zone from the gravity tank until the vendor has rebuilt the panel', good: false, disrupt: 2, shutdown: true, why: 'The pumps are running safely; shutting them costs the whole zone its pressure. Take the exposure away instead.'},
                 {label: 'Change the panel’s password from the control room: with the factory one gone, the same sign-in can’t happen again', good: false, why: 'The panel is still on the internet, and nobody has read out what that four-minute session looked at or changed.'}]},
    benign: {clues: ['The filter-controls vendor’s named account signed in through RA-01 at 10:00.', 'Ticket CHG-8240 (game) covers it: approved by the engineer, a two-hour window, MFA, the session recorded.', 'The sign-in landed on EWS-01, as the conduit allows, and the operators were told beforehand.'],
             truth: 'Benign: a scheduled vendor maintenance session under an approved ticket, through the on-demand box.'},
    fp: {clues: ['The account name is a factory default, “operator”, on HMI-01.', 'Its password was changed in the fieldwork; the sign-in came from the control-room console during Mae’s shift.', 'The rule matches the account name, not whether the password is still the default.'],
         truth: 'False positive: a default account name with a new password. Tune the rule to the device’s default-password status, or rename the account.'}
  },
  rewrite: {
    rule: 'Program download outside a change window',
    mal: {clues: ['A full program download to PLC-FLT-02 at 23:47; no change window was open.', 'It came from an office address, not from the engineering workstation.', 'The controller went to program mode first, then back to run.'],
          truth: 'A program download nobody planned, from somewhere that should never send one. The source and the missing change decide it.',
          resp: [{label: 'Block the source at FW-OT and compare the logic with the backup, so the operators can decide on running the filters by hand', good: true},
                 {label: 'Power the filter PLC off now and keep it off until the engineer rebuilds it in the morning, so the new program can’t run', good: false, disrupt: 2, shutdown: true, why: 'Powering a controller off mid-process stops the filters and destroys what it holds in memory. Contain at the boundary.'},
                 {label: 'Load the offline backup straight away and get the known-good logic back before the new program can touch the filters', good: false, why: 'A blind restore mid-process can upset the filters, and the source that downloaded can do it again. Compare first, with the operators.'}]},
    benign: {clues: ['Joss Kettering downloaded rev 4.3 to PLC-FLT-02 from EWS-01 at 15:20.', 'Ticket CHG-8213 (game) is approved, and the window opened at 15:00.', 'Mae was told, and the filters were on manual for the ten minutes it took.'],
             truth: 'Benign: an approved engineering change, from the engineering workstation, in its window, with the operators told.'},
    fp: {clues: ['The “download” is the nightly compare job reading each controller’s logic out.', 'It runs from EWS-01 at 06:00 and writes nothing to the controller.', 'The sensor’s rule reads an upload as a download.'],
         truth: 'False positive: the compare job uploading logic to check it. Tune the rule to the direction of the transfer.'}
  },
  nudge: {
    rule: 'Set point changed by a source other than an HMI',
    mal: {clues: ['The high-service pumps’ discharge-pressure set point jumped to its maximum at 03:20.', 'HMI-01’s audit log shows no operator made it; the change came from a session on RA-01 with no ticket.', 'The operator on shift put the value back by hand at 03:24.'],
          truth: 'A set point changed from outside the control room. The source of the change and the missing ticket decide it.',
          resp: [{label: 'Cut the RA-01 session and disable that account, so it can’t happen again; the operators keep watch on the pumps', good: true},
                 {label: 'Shut the high-service pumps and the plant, since every controller must be checked by hand first', good: false, disrupt: 2, shutdown: true, why: 'The operator has the pumps back in range. Shutting the plant drops pressure across town; cut the session instead.'},
                 {label: 'Note that the operator put the value back at 03:24 and pick up the rest with Joss in the morning, when the engineers are in', good: false, why: 'The session and the account are still open; whoever changed it can do it again before the morning.'}]},
    benign: {clues: ['During the storm, at 18:40, Mae raised the clearwell draw set point at HMI-01.', 'Her own account, at her own console; she wrote the reason in the shift log at 18:42.', 'Storm inflow was high; the change follows the plant’s storm procedure (game).'],
             truth: 'Benign: an operator’s legitimate change during a storm, made and logged by the shift lead.'},
    fp: {clues: ['The “change” is the evening pressure profile the PLC applies itself at 22:00.', 'It is in the logic and runs every night; nobody sent anything.', 'The rule compares against one fixed value all day.'],
         truth: 'False positive: a scheduled profile built into the logic. Tune the rule to the profile’s times.'}
  },
  blindside: {
    rule: 'Operators lost view of the process',
    mal: {clues: ['HMI-01 and HMI-02 both stopped updating at 04:05; the PLCs still run the process.', 'The HMI service on both was stopped by an account that is not an operator’s.', 'Mae can see the filters and pumps only from the local panels.'],
          truth: 'Loss of view: the operators can’t see the process. Who stopped the HMIs, and how, decides what comes next.',
          resp: [{label: 'Operators run the plant from the local panels, so nothing is lost; learn what stopped the HMIs before anyone restarts them', good: true},
                 {label: 'Power down the PLCs as well until the operators can see the process again', good: false, disrupt: 2, shutdown: true, why: 'The PLCs are running the process safely. Stopping them turns a view problem into a water problem.'},
                 {label: 'Restart the HMI service on both consoles now, so the operators can see again; look into the cause with the day shift later on', good: false, why: 'The account that stopped them can do it again, and the restart overwrites what happened.'}]},
    benign: {clues: ['HMI-02 restarts for the HMI vendor’s patch at 14:00, under CHG-8231 (game).', 'HMI-01 stays up the whole time; the operators were told.', 'The window and the account match the ticket.'],
             truth: 'Benign: a planned restart of one console while the other keeps the view.'},
    fp: {clues: ['The sensor stopped seeing HMI polling for six minutes.', 'The sensor itself was restarting after its own update (game).', 'The operators never lost the view.'],
         truth: 'False positive: the sensor went blind, not the operators. Tune the rule to check the sensor’s own health first.'}
  },
  crossing: {
    rule: 'Remote session from the office side into the control zone',
    mal: {clues: ['An office PC opened a remote-desktop session to EWS-01 through FW-OT.', 'The account is an office user’s, not on the plant’s access list; the rule that allowed it has no owner.', 'The session opened the engineering software’s project list.'],
          truth: 'Remote services from IT into OT: an office account on the engineering workstation. The account, the source and the rule decide it.',
          resp: [{label: 'End the session at FW-OT and remove the rule; take the office PC off the network on the IT side; Joss compares the project files with the backup', good: true},
                 {label: 'Disconnect the plant from every network and run it all by hand until the engineers have checked each controller', good: false, disrupt: 2, shutdown: true, why: 'One office PC reached one workstation. Stop it at the boundary; the plant can keep running.'},
                 {label: 'Disable the office user’s account: without a valid sign-in, nothing can get from the office to EWS-01', good: false, why: 'The office PC is still compromised, the rule is still open, and EWS-01 may already be touched.'}]},
    benign: {clues: ['HIST-DMZ is catching up with HIST-01 after its patch reboot (CHG-8235, game).', 'It is the historian’s own copy job, on the one conduit allowed from control to the DMZ.', 'The burst stops when the copy is current, twelve minutes later.'],
             truth: 'Benign: the historian copy catching up after a reboot, on its documented conduit.'},
    fp: {clues: ['The “session” is the vendor box’s approved connection to EWS-01 under CHG-8240.', 'RA-01 sits in the DMZ; the rule counts the DMZ as the office side.', 'Window, account and ticket all match.'],
         truth: 'False positive: an approved vendor session counted as office traffic. Tune the rule to the zone map.'}
  }
});
Object.assign(ALERT_CHAINS, {
  preset: ['The session opens a second screen.', 'A set point on the panel changes.'],
  rewrite: ['The controller drops to program mode again.', 'A second controller is contacted.'],
  nudge: ['Another set point moves.', 'An alarm limit is widened.'],
  blindside: ['The local panel at the filters freezes too.', 'Alarms stop reaching the console.'],
  crossing: ['The session opens a project file.', 'A second office PC tries the same path.']
});

/* ---------- Morning briefing items (Water Plant) ---------- */
const WT_BRIEFS = [
  {t: 'preset', text: 'Plant controllers and HMIs that answer from the internet with their factory passwords are being found and defaced.', act: 'Check the town’s addresses for exposed plant devices'},
  {t: 'rewrite', text: 'Intruders send new programs to controllers outside change windows.', act: 'Compare each controller’s running logic with its offline backup daily'},
  {t: 'nudge', text: 'Exposed HMIs have had set points maxed out and alarms switched off.', act: 'Alert on set-point changes from anything but an operator’s console'},
  {t: 'blindside', text: 'Attacks on HMIs can leave operators without a view of the process.', act: 'Practise running the plant by hand from the local panels'},
  {t: 'crossing', text: 'Office compromises are reaching engineering workstations over remote desktop.', act: 'Deny remote desktop from the office into the control zone'}
];

/* ---------- Fieldwork figures (game) ---------- */
const WT_ASSETS = 41, WT_ASSETS_BEFORE = 12;          // OT assets; the 2019 spreadsheet listed 12 (29%)
const WT_EXPOSED0 = 2, WT_DEFAULT0 = 9;               // PLC-PMP-02 and RA-01; nine devices on factory passwords
const WT_PLCS = 7;                                    // controllers whose logic is backed up
const WT_VEND_HIST = {total: 14, ok: 3};              // RA-01 sessions in the last 30 days, and how many had a ticket

/* ---------- Zones and conduits (game; concept from ISA-62443-3-2's zones and conduits and SP 800-82's DMZ) ---------- */
const WT_ZONES = [
  {k: 'enterprise', label: 'Enterprise: the office network'},
  {k: 'dmz', label: 'DMZ: between the office and the plant'},
  {k: 'control', label: 'Control: operators, engineers, historian'},
  {k: 'field', label: 'Field: the controllers and their I/O'}
];
const WT_ZONE_ASSETS = [
  {id: 'RPT-01', what: 'finance’s reporting server, which reads plant totals', zone: 'enterprise'},
  {id: 'HIST-DMZ', what: 'a read-only copy of the historian, for the office to read', zone: 'dmz'},
  {id: 'RA-01', what: 'the vendor remote-access box', zone: 'dmz'},
  {id: 'HMI-01', what: 'the operators’ console', zone: 'control'},
  {id: 'EWS-01', what: 'the engineering workstation, which can change every PLC', zone: 'control'},
  {id: 'HIST-01', what: 'the control historian, which collects from the PLCs', zone: 'control'},
  {id: 'PLC-FLT-01', what: 'a filter controller', zone: 'field'}
];
// need: the plant needs it (denying it breaks operations); otherwise it is exposure (allowing it leaves a way in).
const WT_CONDUITS = [
  {id: 'hmiplc', text: 'HMI-01 ↔ the PLCs', why: 'how the operators see and run the process', need: true, broke: 'Operators lose view and control of the plant from the console.'},
  {id: 'histplc', text: 'HIST-01 → the PLCs', why: 'the historian polling values', need: true, broke: 'The historian stops recording: no trends, no compliance records.'},
  {id: 'histdmz', text: 'HIST-01 → HIST-DMZ', why: 'copying data out to the DMZ', need: true, broke: 'The office copy goes stale and finance’s reports stop.'},
  {id: 'rptdmz', text: 'RPT-01 → HIST-DMZ', why: 'the office reading the copy', need: true, broke: 'Finance can’t read plant totals at all.'},
  {id: 'raews', text: 'RA-01 → EWS-01', why: 'vendor sessions, when one is approved', need: true, broke: 'Vendors can’t support the plant even when you ask them to.'},
  {id: 'officeplc', text: 'Any office PC → the PLCs, directly', why: 'how the network was built', need: false, exp: 'Every office PC can talk straight to a controller.'},
  {id: 'officehmi', text: 'Office PCs → HMI-01, remote desktop', why: 'convenient for managers', need: false, exp: 'A compromised office PC lands on the operators’ console.'},
  {id: 'ewsnet', text: 'EWS-01 → the internet', why: 'software updates', need: false, exp: 'The machine that can change every PLC browses the internet.'},
  {id: 'rapl', text: 'RA-01 → the PLCs, directly', why: 'faster for the vendor', need: false, exp: 'A vendor session reaches the controllers without the engineering workstation and its records.'}
];

/* ---------- Investigation drills (all cases original; artefacts are invented, fields are real kinds of evidence) ---------- */
const WT_DRILLS = {
  setpoint: {
    id: 'setpoint', title: 'A set point at ten past two', budget: 2,
    intro: '<p>The night set-point rule fired (game): at 02:10 the clearwell’s low-level set point dropped from 3.2 m to 2.4 m. An intruder at a console looks like that. So does a night operator doing planned work.</p>',
    artefact: '<pre class="art">Sensor · set-point change · Day {D} 02:10 (game data)\n' +
      'Tag            CLW-LL-SP (clearwell low level)\n' +
      'Old → new      3.2 m → 2.4 m\n' +
      'Sent by        HMI-02 (control room)\n' +
      'Rule           set-point change at night</pre>' +
      '<p class="small">The sensor sees which device sent the change, not which person. The HMI’s own audit log names the account and console; the shift log says who was on duty and why.</p>',
    question: 'An operator’s planned change, or an intruder at the console?',
    sources: [
      {id: 'trend', name: 'Historian trend for the clearwell', qs: [
        {q: 'What does the clearwell trend look like overnight?', kind: 'trap',
         res: ['A sharp step in the set point at 02:10, then the level falls steadily to 2.4 m by 04:30.', '(Any set-point change is a step. The shape fits a planned change and an intruder alike.)']}]},
      {id: 'alarms', name: 'Alarm summary', qs: [
        {q: 'How many alarms fired overnight?', kind: 'trap',
         res: ['14 alarms overnight; a typical night has about 11.', '(Three level-deviation alarms as the tank drew down. The count fits both stories.)']}]},
      {id: 'audit', name: 'HMI-02 audit log', qs: [
        {q: 'Which account and console made the change?', kind: 'focus', key: true,
         res: ['02:10:14 HMI-02, account t.boateng (Tunde Boateng, night operator), CLW-LL-SP 3.2 → 2.4 m', 't.boateng was signed in at HMI-02 from 19:02; no other sign-in on either console overnight', 'RA-01 shows no session that night; the sensor saw the change come from HMI-02 alone']}]},
      {id: 'shift', name: 'Shift log and roster', qs: [
        {q: 'Who was on duty, and did they log a reason?', kind: 'focus', key: true,
         res: ['Roster: Tunde Boateng, night operator, 19:00–07:00', 'Shift log 02:12: “Lowered clearwell to 2.4 m for the 08:00 tank inspection, per plan WQ-14” (game)', 'Plan WQ-14 asks for the clearwell at 2.4 m by 06:00 on inspection days']},
        {q: 'Every HMI event overnight', kind: 'broad', rows: 8600,
         wall: ['{t}  HMI-01  alarm ack   FLT-02 dP high', '{t}  HMI-02  screen      pumps overview', '{t}  HMI-02  t.boateng   CLW-LL-SP 2.4', '{t}  HMI-01  trend       raw water turbidity']}]}
    ],
    ai: {everything: {text: 'A set point changed at 02:10, outside business hours, followed by more alarms than usual, consistent with Modify Parameter (T0836). Recommend restoring 3.2 m and taking HMI-02 off the network.', wrong: true,
                      reveal: 'Tally matched the hour and the alarm count and recommended undoing a planned change halfway through an inspection drawdown, then cutting off a console the operators need. It never read the HMI’s audit log or the shift log, which name Tunde and his reason.'},
         specific: {q: 'Which account and console changed CLW-LL-SP?', text: 't.boateng at HMI-02, at 02:10:14.'}},
    verdicts: [
      {label: 'The night operator’s planned change: Tunde, at HMI-02 under his own account, lowered it for the tank inspection', good: true, needs: 'audit',
       needsWhy: 'the shift log says what Tunde meant to do; only HMI-02’s audit log shows that his account, at his console, made the change.',
       why: 'The audit log names the account and console, and the shift log, roster and plan give the reason.'},
      {label: 'An intruder at the console: the set point dropped in one step at two in the morning and the alarms ran above a normal night', why: 'The step and the alarms fit a planned drawdown too. The audit log names Tunde at HMI-02, and he logged the reason.'},
      {label: 'A remote change through the vendor box: nobody works at HMI-02 overnight, so a session from outside must have pushed the new value', why: 'Tunde was signed in at HMI-02 all night, and RA-01 shows no session at all.'}],
    reasons: [
      {label: 'HMI-02’s audit log names t.boateng at that console, and his shift-log entry gives the reason: the tank inspection plan', good: true, why: 'Who made it, where, and why, each from its own record.'},
      {label: 'The level fell smoothly afterwards with no swings, which is not what someone trying to damage the plant would do at night', why: 'The trend’s shape decides nothing; an intruder can move a value smoothly too.'},
      {label: 'Only three alarms above a normal night is too few for an attack; an attacker’s change would trip far more', why: 'The alarm count fits both stories.'}],
    alts: [
      {label: 'Someone else using Tunde’s account at HMI-02', good: true, why: 'Ruled out: Tunde was at the console all night and wrote the reason himself at 02:12.'},
      {label: 'A change pushed from outside, through the vendor box or the office', good: true, why: 'Ruled out: no RA-01 session, and the sensor saw the change come from HMI-02 alone.'},
      {label: 'The PLC changing its own set point on a schedule', why: 'This tag has no schedule in the logic; the audit log records a person’s change.'},
      {label: 'The historian showing an old value by mistake', why: 'The controller’s own value and the HMI log both show 2.4 m.'}],
    path: '<p>A set-point change is decided by <b>the HMI’s audit log</b> (which account, at which console) and by <b>the shift log and roster</b> (who was on duty, and why). The trend’s shape and the alarm count fit a planned change and an intruder alike, so they decide nothing.</p>',
    response: ['Benign: the night operator’s planned change; keep the night set-point rule', 'Ask the operators to type the plan number in the HMI’s change-reason field, so the next alert carries its own reason', 'Nothing to undo: WQ-14’s inspection runs at 08:00 as planned'],
    techs: ['T0836'], acts: ['spaudit']
  },
  checksum: {
    id: 'checksum', title: 'A checksum that moved overnight', budget: 2,
    intro: '<p>The 06:00 compare job flagged it (game): PLC-HSP-01, the high-service pumps’ controller, is running logic whose checksum differs from the offline backup taken yesterday at 14:00. At 21:24 last night the sensor’s rule also fired: a program download outside any change window. Tampering looks like that. So does an engineering change.</p>',
    artefact: '<pre class="art">Compare job · Day {D} 06:00 (game data)\n' +
      'PLC          Backup (Day {D-1} 14:00)   Running now\n' +
      'PLC-HSP-01   rev 4.2, checksum 7C1A…    checksum 92E4…\n' +
      'others (6)   match                      match\n' +
      'Sensor · Day {D-1} 21:24 · program download to PLC-HSP-01 from EWS-01 · no change window open</pre>' +
      '<p class="small">A checksum says the logic changed, not who changed it or whether anyone approved it. The engineering record and the change tickets say that.</p>',
    question: 'Tampering, or an approved engineering change?',
    sources: [
      {id: 'uptime', name: 'Controller status', qs: [
        {q: 'How long has PLC-HSP-01 been running?', kind: 'trap',
         res: ['Uptime 9 h 30 min: it went to program mode at 21:22 and back to run at 21:31.', '(Any full download restarts the logic. The restart fits tampering and an approved change alike.)']}]},
      {id: 'vendor', name: 'Vendor record', qs: [
        {q: 'Who supplied the pump logic, and can they be trusted?', kind: 'trap',
         res: ['A large, long-established pump vendor with a good security record, under contract since 2018 (game).', '(A vendor’s reputation says nothing about who changed this logic last night, or whether anyone approved it.)']}]},
      {id: 'ews', name: 'EWS-01 project history and change tickets', qs: [
        {q: 'Is there a revision in the engineering record, and a ticket?', kind: 'focus', key: true,
         res: ['The managed project archive’s last revision for PLC-HSP-01 is 4.2, saved yesterday at 14:00 with the backup; no 4.3', 'The engineering software’s own log on EWS-01: a download to PLC-HSP-01 at 21:24, from a project file in a temp folder, not from the archive', 'Change tickets: none for PLC-HSP-01 this month; the only open plant ticket is CHG-8240, a scheduled filter-vendor session']}]},
      {id: 'ra', name: 'RA-01 session log, and a call to the vendor', qs: [
        {q: 'Whose session was on EWS-01 at 21:24?', kind: 'focus', key: true,
         res: ['RA-01: account pv-ksato (Kenji Sato, the pump vendor’s technician) from 198.51.100.24, the vendor’s known address, 21:05–21:40; no ticket, and RA-01 has no MFA', 'Called back on the number in the contract: the vendor confirms work order WO-5521, “fix the pump alternation timer”, requested by Gil Hartley by email on Day {D-3}', 'Nobody told the control room']},
        {q: 'Every RA-01 and EWS-01 event this week', kind: 'broad', rows: 5200,
         wall: ['{t}  RA-01   session   fc-support   CHG-8240 pending', '{t}  EWS-01  app       project archive opened', '{t}  RA-01   session   pv-ksato     21:05', '{t}  EWS-01  app       compare job   06:00']}]}
    ],
    ai: {everything: {text: 'A program download outside a change window changed PLC-HSP-01’s logic, consistent with Program Download (T0843). Recommend loading the backup now and shutting down the high-service pumps until the logic is verified.', wrong: true,
                      reveal: 'Tally matched the download and jumped to restore-and-shut-down: a blind rollback in the middle of the day and a pressure drop across town. It never asked whose session it was or whether anything in the engineering record matched.'},
         specific: {q: 'Whose session was on EWS-01 at 21:24?', text: 'pv-ksato, the pump vendor’s technician, through RA-01, 21:05–21:40.'}},
    verdicts: [
      {label: 'An unapproved change: the pump vendor, through the always-on box at Gil’s request, with no ticket and no archived revision', good: true, needs: 'ews',
       needsWhy: 'the vendor’s session shows whose hands were on it; only the engineering record and the tickets show that no approved change matches.',
       why: 'No archived revision, no ticket, and the vendor’s own session at Gil’s request.'},
      {label: 'Tampering by an intruder: a download at night, outside any change window, from a temp-folder copy, then a controller restart at 21:31', why: 'The session was the vendor’s named account from its known address, and the vendor confirmed the work order on a call-back. Unapproved, not an intruder.'},
      {label: 'An approved engineering change: the vendor maintains this logic under contract, and it worked through the plant’s own engineering workstation', why: 'A contract is not an approval: no ticket, no revision in the archive, and the control room was never told.'}],
    reasons: [
      {label: 'The archive stops at 4.2 with no ticket, and the 21:24 download came from a temp-folder copy in pv-ksato’s session', good: true, why: 'The engineering record, the tickets and the session, each from its own source.'},
      {label: 'The controller restarted at 21:31, which a daytime change in a window would not need, so the change was hidden at night on purpose', why: 'Every full download restarts the logic, and the hour fits an unapproved vendor fix too.'},
      {label: 'The pump vendor is a large, reputable firm with a long contract, which rules out anyone outside the vendor', why: 'Reputation decides nothing; the session log and the call-back do.'}],
    alts: [
      {label: 'An intruder using the vendor’s account', good: true, why: 'Ruled out: the vendor’s known address, and the vendor confirmed WO-5521 on a call-back to the contract number.'},
      {label: 'An approved change made in a hurry', good: true, why: 'Ruled out: no ticket, no archived revision, and the operators weren’t told.'},
      {label: 'A memory fault that altered the checksum', why: 'The engineering software logged a download at 21:24.'},
      {label: 'A faulty backup taken yesterday', why: 'Six other PLCs match their backups; this one has a download behind its change.'}],
    path: '<p>A changed logic checksum is decided by <b>the engineering record and the change tickets</b> (does an approved revision match?) and by <b>whose session made the download</b> (the remote-access log, and a call-back on a known number). The controller’s uptime and the vendor’s reputation fit every story, so they decide nothing.</p>',
    response: ['Joss diffs the running logic against the backup: only the alternation timer changed; Mae says the pumps run normally', 'Keep it running and put it through an emergency-change review today: if accepted, archive it as rev 4.3 and back it up; if not, roll back in a window the operators choose', 'Never power-cycle or roll back blind in the middle of the day', 'Tell the vendor: changes only under a ticket. Raise the always-on box with Gil'],
    techs: ['T0843'], acts: ['logicaudit']
  },
  officeplc: {
    id: 'officeplc', title: 'An office address at the filters', budget: 2,
    intro: '<p>The sensor’s new-talker rule fired at 09:12 (game): an office address is talking to PLC-FLT-01 on its industrial protocol port, through FW-OT. An intruder exploring the plant from an office PC looks like that. So does finance’s reporting job, which reads that controller every morning.</p>',
    artefact: '<pre class="art">Sensor · new talker into the field zone · Day {D} (game data)\n' +
      'Time         Source        Destination   Port                Packets\n' +
      '07:00–07:01  192.0.2.40    PLC-FLT-01    industrial protocol 230\n' +
      '09:12–09:31  192.0.2.57    PLC-FLT-01    industrial protocol 214</pre>' +
      '<p class="small">The sensor shows addresses, ports and the kind of request, not which program sent it. The office side’s endpoint telemetry shows the host and process; the firewall shows the rule that let it through.</p>',
    question: 'An intruder reaching into the plant, or the reporting job misbehaving?',
    sources: [
      {id: 'packets', name: 'Packet counts', qs: [
        {q: 'How much traffic was there?', kind: 'trap',
         res: ['214 packets in 19 minutes at 09:12; the 07:00 run was 230.', '(The two look alike in size. Count decides nothing.)']}]},
      {id: 'port', name: 'Port and protocol', qs: [
        {q: 'Which port and protocol?', kind: 'trap',
         res: ['Both use PLC-FLT-01’s industrial protocol port, the one finance’s job uses.', '(The port says what kind of traffic it is, not who sent it or why.)']}]},
      {id: 'host', name: 'Endpoint telemetry on the office side', qs: [
        {q: 'Which hosts and processes sent it?', kind: 'focus', key: true,
         res: ['07:00: 192.0.2.40 is RPT-01, its reporting service, as every morning', '09:12: 192.0.2.57 is OF-WS-22, l.marsh’s planning PC; the process is an unsigned program in her Downloads folder, started 09:11', 'It came from an email attachment l.marsh opened at 09:08; the sensor shows identification and read requests only, nothing written']}]},
      {id: 'rule', name: 'The FW-OT rule that allowed it', qs: [
        {q: 'Which firewall rule allowed it, and who owns it?', kind: 'focus', key: true,
         res: ['R-114, the temporary exception from the zones work: owner finance reporting, expires Friday', 'Approved source: RPT-01 only. As implemented: the whole office subnet, copied from the old router rule', 'No other rule lets an office address reach the field zone']},
        {q: 'Every connection across FW-OT today', kind: 'broad', rows: 31000,
         wall: ['{t}  HIST-01   → HIST-DMZ   copy      ok', '{t}  RPT-01    → HIST-DMZ   read      ok', '{t}  OF-WS-22  → PLC-FLT-01 R-114     ok', '{t}  OF-WS-31  → HMI-01     denied    default']}]}
    ],
    ai: {everything: {text: 'Traffic from the office to PLC-FLT-01 matches the reporting job: the same port and a similar packet count. Likely the job running twice; no action needed.', wrong: true,
                      reveal: 'Tally matched the port and the packet count to the 07:00 job and waved it through. It never asked which host or program sent the 09:12 traffic, or why a rule meant for RPT-01 let a planning PC through.'},
         specific: {q: 'Which host and process sent the 09:12 traffic?', text: 'OF-WS-22, an unsigned program in l.marsh’s Downloads folder.'}},
    verdicts: [
      {label: 'An infected office PC: OF-WS-22’s unsigned program read PLC-FLT-01 through an exception meant for RPT-01 alone', good: true, needs: 'host',
       needsWhy: 'the rule shows the door was open; only the endpoint telemetry shows which host and program walked through it.',
       why: 'The host and process from the office side, the open door from the rule as implemented.'},
      {label: 'Finance’s reporting job misbehaving: the same port, the same controller and nearly the same packet count as the 07:00 run', why: 'RPT-01 ran at 07:00. The 09:12 traffic came from OF-WS-22 and an unsigned program, not the reporting service.'},
      {label: 'An attack on the filters’ logic: an office host reaching a filter PLC on its industrial port is how a new program would be sent', why: 'The sensor shows identification and read requests only, nothing written and no download.'}],
    reasons: [
      {label: 'OF-WS-22 ran an unsigned program from an email attachment, and R-114 let it through because its source is the whole office subnet, not RPT-01', good: true, why: 'The host and process from the endpoint, and the open door from the rule as implemented.'},
      {label: 'The 09:12 traffic was 214 packets, fewer than the 230 the reporting job sends, so it cannot be the same job', why: 'The job’s size varies day to day; packet counts decide nothing.'},
      {label: 'Nothing in the office should ever use the PLC’s industrial port, which makes any office traffic on it an attacker’s', why: 'Finance’s job uses that port legitimately under R-114; the port alone decides nothing.'}],
    alts: [
      {label: 'The reporting job running a second time', good: true, why: 'Ruled out: RPT-01 is 192.0.2.40; the 09:12 source is OF-WS-22, running an unsigned program.'},
      {label: 'An engineer testing from the office', good: true, why: 'Ruled out: OF-WS-22 is a planning PC, and the program came from an email attachment.'},
      {label: 'The sensor counting the 07:00 run twice', why: 'Different source address, different time, different host.'},
      {label: 'The PLC reaching out to the office', why: 'The requests came from OF-WS-22 to the controller.'}],
    path: '<p>New traffic from the office into the plant is decided by <b>which host and process sent it</b> (endpoint telemetry on the IT side) and by <b>the firewall rule that allowed it, and its owner</b>. The packet count and the port number fit the reporting job and an intruder alike, so they decide nothing.</p>',
    response: ['Narrow R-114 to RPT-01 now; remove it on Friday, when finance reads from HIST-DMZ', 'Take OF-WS-22 off the network on the IT side and keep its disk and memory for the investigation', 'Mae confirms the filters run normally; Joss compares PLC-FLT-01’s logic and set points with the backup: unchanged', 'Search the other office PCs for the email and the program; compare every FW-OT rule as implemented with what was approved', 'No plant shutdown: the reads stopped at the boundary'],
    techs: ['T0888'], acts: ['crossaudit']
  }
};

/* ---------- Network Traffic Analysis dojo (NCL area; concepts only, no tool syntax) ---------- */
const WT_DOJO = [
  {q: 'A flow record: HIST-01 → PLC-FLT-01, started 09:00:00, lasted 59 min 58 s, 4,212 packets, 0.3 MB. What does it tell you?',
   opts: ['HIST-01 held one long, light connection to the PLC for an hour: steady polling',
          'The PLC sent 0.3 MB to the historian in a single burst at nine o’clock, then went quiet',
          'Which values the historian read: a flow record lists each reading and whether it was out of range'], good: 0,
   explain: 'A flow record is metadata: who started the conversation, with whom, when, for how long, and how much. It never holds the content. Long and light, from the historian, is what polling looks like.'},
  {q: 'HMI-01 polls PLC-FLT-01 once a second, all day, every day. At 02:13 a second source polls it every fifth of a second for 40 seconds. Which is the anomaly?',
   opts: ['The new source and its new rhythm at 02:13: nothing else has ever polled that PLC like that',
          'HMI-01’s polling: once a second all day is far more traffic than anything else on the plant network',
          'Neither of them: a PLC answering requests is normal, so any polling it receives is part of the baseline'], good: 0,
   explain: 'OT traffic is regular: the same talkers, the same rhythm, every day. That is what makes a baseline useful. Busy is normal here; new is not: a new talker, a new rate, a new kind of request.'},
  {q: 'HMI-02, in the control zone, asks DNS for telemetry.panelmaker.example every hour. FW-OT denies it each time. What does it mean, and what do you do?',
   opts: ['Something on the panel calls out: keep the deny, switch the feature off with the vendor, and look for any other way out',
          'It is the panel maker’s own domain, so it is safe: allow it through FW-OT, so the panel gets its updates on time',
          'Nothing to do: the firewall denies every request, so the panel can’t reach anything, whatever it asks for or how often'], good: 0,
   explain: 'A device in the control zone should never talk to the internet. A denied request is still a finding: something on the device is configured to call out. Turn it off at the source, and check that nothing found another way out.'}
];

/* ---------- Plant Board (original) ---------- */
const WT_BOARD_SPECS = () => [
  {kind: 'mal', threat: 'preset', tech: 'T1694.001', tags: ['exposed', 'ot'], story: true, rate: 12, group: 'c',
   title: 'Round 1: a factory password from the internet', host: 'booster panel · practice rig', enemy: {spr: 'hinge', pal: 'wtPreset'},
   clues: ['A booster-station panel accepted a sign-in with its factory user name and password, from an address abroad.', 'It answers on a public address through a cellular router nobody listed.', 'The set points haven’t moved; the operator on shift sees nothing odd yet.'],
   truth: 'Default credentials on a device reachable from the internet.',
   resp: [{label: 'Take the panel off the internet, change its password with the engineer, and read out what changed; the operators decide', good: true},
          {label: 'Shut the booster station down and run its zone from the gravity tank until the panel is rebuilt', good: false, disrupt: 1, shutdown: true, why: 'The pumps are safe; shutting them costs the zone its pressure. Remove the exposure.'},
          {label: 'Change the panel’s password from the control room, so the same factory sign-in can’t work again from anywhere', good: false, why: 'It is still on the internet, and nobody knows what the session did.'}],
   chain: [{at: 40, text: 'The session opens the set-point screen.'}, {at: 75, text: 'A second address tries the same password.'}]},
  {kind: 'mal', threat: 'rewrite', tech: 'T0843', tags: ['ot'], story: true, rate: 12, group: 'c',
   title: 'Round 2: a download nobody planned', host: 'PLC-FLT-02 · practice rig', enemy: {spr: 'quill', pal: 'wtRewrite'},
   clues: ['A full program download to a filter PLC at 23:47, outside any change window.', 'It came from an office address, not the engineering workstation.', 'The controller went to program mode first, then back to run.'],
   truth: 'A program download nobody approved, from a source that should never send one.',
   resp: [{label: 'Block the source at the boundary and compare the logic with the backup, so the operators can choose to run by hand', good: true},
          {label: 'Power the filter PLC off and keep it off until the engineer rebuilds it in the morning and nothing more can be sent to it', good: false, disrupt: 1, shutdown: true, why: 'Powering off mid-process stops the filters and wipes what the controller holds. Contain at the boundary.'},
          {label: 'Load the offline backup at once: the known-good logic runs again before the new program can do any harm', good: false, why: 'A blind restore mid-process can upset the filters, and the source can send again.'}],
   chain: [{at: 40, text: 'The controller drops to program mode again.'}, {at: 75, text: 'A second controller is contacted.'}]},
  {kind: 'mal', threat: 'nudge', tech: 'T0836', tags: ['ot'], story: true, rate: 11, group: 'c',
   title: 'Round 3: a set point from nowhere', host: 'PLC-HSP-01 · practice rig', enemy: {spr: 'climber', pal: 'wtNudge'},
   clues: ['The pumps’ discharge-pressure set point jumped to its maximum at 03:20.', 'No operator made it: the change came from a vendor-box session with no ticket.', 'The operator on shift put the value back by hand at 03:24.'],
   truth: 'A set point pushed from outside the control room.',
   resp: [{label: 'Cut the vendor-box session and disable that account; the operators watch the pumps while every set point is compared', good: true},
          {label: 'Shut the high-service pumps and the plant until every controller has been looked at by hand', good: false, disrupt: 1, shutdown: true, why: 'The operator has it in range; a shutdown drops pressure across town.'},
          {label: 'Log that the operator put the value back at 03:24, and pick it up with the engineer after the weekend', good: false, why: 'The session and the account are still open.'}],
   chain: [{at: 40, text: 'Another set point moves.'}, {at: 75, text: 'An alarm limit is widened.'}]}
];

/* ---------- Boss tabletop cards (our own) ---------- */
const WT_CARDS = [
  {id: 'safe', name: 'Safety first: the operators decide', csf: 'Respond', good: true, text: 'Before anything else, the operators make sure the process is safe and choose whether to run by hand; nothing touches the process without them.', fx: 'Every stage starts with the water safe and the operators in charge of the process.'},
  {id: 'asis', name: 'Leave the controller as it is', csf: 'Respond', good: true, text: 'Photograph the screen tonight and leave the controller and its panel untouched until the vendor and the engineer can read out its program and event list.', fx: 'Stage 2 is easier: the controller still holds what happened.'},
  {id: 'offnet', name: 'Off the internet, new credentials', csf: 'Protect', good: true, text: 'Take the device off the internet tonight (unplug the vendor’s cellular modem; the process doesn’t need it) and change its factory password with the vendor.', fx: 'The door they came in by is shut.'},
  {id: 'restore', name: 'Restore from the offline backup, then test', csf: 'Recover', good: true, text: 'Put back the known-good logic and screens from the offline backup, match the checksums, and go back to automatic only after the operators test it.', fx: 'Stage 3 becomes much easier: a known-good controller, tested by the people who run it.'},
  {id: 'poweroff', name: 'Power everything off', csf: 'Respond', text: 'Shut down the high-service pumps and every booster station until the investigation is done, so nothing runs while an intruder might still be inside.', fx: 'Zone 3 was safe on the tank and in hand control; shutting the pumps drops pressure across town. Over-reaction is a failure too.'},
  {id: 'reboot', name: 'Reboot and clear the screen', csf: 'Recover', text: 'Power-cycle the controller and factory-reset its panel straight away, so the message is gone and the station is back in automatic before the morning shift.', fx: 'The reboot wipes what the controller held about the intrusion, and nobody has checked the logic it returns to.'},
  {id: 'newport', name: 'Move it to a new port', csf: 'Protect', text: 'Keep the modem so the vendor can still support the station, but move the panel to a non-default port with a new password, so scanners stop seeing it.', fx: 'A new port is a smaller target, not a closed door: the device still answers from the internet.'},
  {id: 'later', name: 'Put it off for the vendor', csf: 'Detect', text: 'Run the station by hand through the weekend and let the pump vendor look at the panel when its engineer is next in town, as the contract allows.', fx: 'Nobody reads out the controller, the exposure stays open, and the operators run by hand for days.'}
];

/* ---------- Field Manual additions ---------- */
Object.assign(EXTRA_ACTIONS, {
  otinv: {name: 'OT asset inventory', desc: 'Keep an organised, regularly updated list of every plant device (controllers, HMIs, workstations, network gear, radios, drives) with what it does, where it is, who supports it and how it connects. Build it from a walkdown with the operators, the engineering project files, switch tables and passive listening, never from an active scan of a running plant.'},
  otexpose: {name: 'Remove internet exposure and default passwords', desc: 'Find every plant device that answers from the internet (check the organisation’s own addresses from outside, and ask every vendor about devices they connect), take it off the internet, and change every factory password, one device at a time with the operators watching. Vendor-supplied equipment counts too.'},
  zones: {name: 'Zones and conduits', desc: 'Group plant assets into zones (enterprise, DMZ, control, field) and allow only the conduits the plant needs between them. Office users read plant data from a copy in the DMZ, never from the controllers; vendors come in through the DMZ to the engineering workstation, never straight to a PLC.'},
  plcbackup: {name: 'Offline PLC logic backups and manual operation', desc: 'Back up every controller’s logic and configuration offline, at least two copies, one off site, each checked against the running controller; compare the running logic with the backup regularly. Practise running the plant by hand, so a lost controller or HMI is a nuisance, not an outage.'},
  passivemon: {name: 'Passive OT monitoring', desc: 'Read a copy of the plant network’s traffic from mirror ports and learn its regular rhythm; alert on downloads outside change windows, set-point changes from anything but an operator’s console, new talkers into the field zone, and any device calling out to the internet. Never scan a running plant actively without the operators and the engineer.'},
  vendorod: {name: 'Vendor remote access on demand', desc: 'A vendor’s remote access is off until someone asks: an approved ticket and a time window, MFA, the session recorded, the box switched off when the window ends, and an emergency path through the on-call engineer. The business owns the risk of that path in writing.'},
  spaudit: {name: 'Read a set-point change by account and shift', desc: 'For a set-point change: the HMI’s audit log (which account, at which console) and the shift log and roster (who was on duty, and why). A trend’s step and the alarm count fit planned work and an intruder alike.'},
  logicaudit: {name: 'Read a logic change by record and session', desc: 'For a controller whose logic no longer matches its backup: the engineering record and change tickets (does an approved revision match?), and whose session made the download (the remote-access log, confirmed by a call-back on a known number). Uptime and reputation decide nothing.'},
  crossaudit: {name: 'Read IT-to-OT traffic by host and rule', desc: 'For new traffic from the office into the plant: which host and process sent it (endpoint telemetry on the IT side), and which firewall rule let it through, as implemented, with its owner. Packet counts and port numbers fit legitimate jobs too.'},
  otrespond: {name: 'Safety-first OT incident response', desc: 'The operators confirm the process is safe and decide on manual operation; the device is left as it is for the vendor and engineer to read out; it comes off the internet and gets new credentials; known-good logic is restored from the offline backup and tested before automatic; the incident is reported, and the device watched. Powering things off is a decision for the operators, not a reflex.'}
});
Object.assign(FACTS, {
  wtcase: {name: 'A real case like this: internet-exposed PLCs at US water facilities (2023)', desc: 'On 28 November 2023 CISA reported active exploitation of a Unitronics PLC at a US water facility; the affected municipal water authority took the system offline and switched to manual operations, with no known risk to drinking water or supply. Joint advisory AA23-335A (1 December 2023, updated 14 December; FBI, CISA, NSA, EPA and Israel’s National Cyber Directorate) attributes the activity to IRGC-affiliated cyber actors using the persona “CyberAv3ngers”: from at least 22 November 2023 they reached Unitronics Vision Series PLCs with built-in HMIs that were publicly exposed to the internet with default passwords, in several US states, and defaced the display. The advisory says it is not known whether more was intended or achieved.', src: 'CISA alert, 28 November 2023; joint advisory AA23-335A'},
  wtaa23: {name: 'What AA23-335A asks plant owners to do', desc: 'Change default passwords and use strong ones; disconnect PLCs from the public internet; use MFA for access to the OT network; if remote access is needed, put a firewall or VPN in front of the controller; keep strong backups of PLC logic and configuration and know how to restore them; keep controllers updated; and confirm that third-party vendors apply the same measures. It lists CISA, the FBI and WaterISAC among the places to report.', src: 'Joint advisory AA23-335A (FBI, CISA, NSA, EPA, INCD), December 2023'},
  wtprimary: {name: 'Primary mitigations for OT (May 2025)', desc: 'CISA, the FBI, the EPA and the DOE list five: remove OT connections to the public internet; change default passwords; secure remote access (a private connection or VPN, strong passwords, phishing-resistant MFA, least privilege, dormant accounts disabled); segment IT and OT, with a demilitarized zone for passing control data to the enterprise; and practise and maintain the ability to operate OT systems manually.', src: 'CISA, FBI, EPA and DOE, Primary Mitigations to Reduce Cyber Threats to Operational Technology (6 May 2025)'},
  wtinvguide: {name: 'OT asset inventory guidance (August 2025)', desc: 'A joint guide by CISA, the EPA, the NSA, the FBI and partners in Australia, Canada, Germany, the Netherlands and New Zealand defines an asset inventory as an organised, regularly updated list of an organisation’s systems, hardware and software, and sets out five stages: define scope and objectives, identify assets and collect their attributes, build a taxonomy, manage and collect the data, and manage the life cycle. It includes a conceptual taxonomy for water and wastewater.', src: 'Foundations for OT Cybersecurity: Asset Inventory Guidance for Owners and Operators (13 August 2025)'},
  wt80082: {name: 'NIST SP 800-82 Rev. 3', desc: 'NIST’s Guide to Operational Technology (OT) Security (September 2023) says OT security objectives typically put integrity and availability before confidentiality, with safety above all; recommends a DMZ architecture that prevents direct traffic between the corporate and OT networks, and MFA for remote access to the OT system; and says an OT system should degrade gracefully, from full automation down to manual operation.', src: 'NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security (September 2023)'},
  wtpassive: {name: 'Active scanning in a running plant', desc: 'Joint guidance from CISA, the DOE, the FBI and partners (April 2026) warns that typical active scanning should not be attempted without a deep awareness of the system, because it can disrupt fragile devices, and notes that OT discovery tools generally rely on passive monitoring, which avoids that risk. It also says to restrict vendor remote connections to narrowly specified maintenance windows, to grant third-party access only with authorisation and oversight, and to log every privileged session.', src: 'CISA, DOE, FBI and partners, Adapting Zero Trust Principles to Operational Technology (29 April 2026)'},
  wthmi: {name: 'Internet-exposed HMIs at water systems (2024)', desc: 'The EPA and CISA warned that anyone can view an internet-exposed HMI, and an attacker can change settings that disrupt treatment. In 2024, hacktivists at water systems maxed out set points, altered settings and turned off alarms, and changed administrative passwords to lock operators out, which forced them back to manual operation. The fact sheet asks for an inventory of internet-exposed devices, disconnection from the internet, strong passwords and MFA, a DMZ or bastion host at the OT boundary, an address allowlist, and logging of remote sign-ins.', src: 'EPA and CISA, Internet-Exposed HMIs Pose Cybersecurity Risks to Water and Wastewater Systems (13 December 2024)'},
  wtzones: {name: 'Zones and conduits (ISA/IEC 62443)', desc: 'ANSI/ISA-62443-3-2 (2020) asks for the system under consideration to be partitioned into zones and conduits, with risk assessed and a target security level set for each. A conduit is a logical grouping of communication channels, sharing security requirements, that connects two or more zones. (This game uses the idea only; the standard itself is paid.)', src: 'ISA, ANSI/ISA-62443-3-2-2020 public preview'}
});
GAME_NOTES.push(
  'Water Plant threats (Preset, Rewrite, Nudge, Blindside, Crossing) join the alert mix with weights 3/2/2/2/2 once you reach the Water Plant; inside it they are three times as likely. Network tools are strong against plant (OT) threats. The Tide Badge halves internet-exposed-device encounters (Preset) and puts the operators’ sign-off in front of any “shut it all down” response: picking one is still wrong, but nothing is shut down. (game)',
  'Water Plant scorecard: internet-exposed OT devices, default credentials remaining (known), OT assets inventoried, PLC logic backups current, and vendor sessions approved. The vendor figure counts the last 30 days (3 of 14) until on-demand access starts, and the sessions since then afterwards. (game)',
  'Hostnames, accounts, tickets, plans, counts, timings, addresses and every person at the Water Plant are invented. The incident is the town’s own, modelled on a real case (see Facts: a real case like this); it is not a retelling of any one utility’s story. (game)'
);
