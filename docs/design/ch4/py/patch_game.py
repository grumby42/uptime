import json
R='/home/claude/uptime/editions/charter/'
def patch(fn, pairs):
    s=open(R+fn,encoding='utf-8').read()
    for a,b in pairs:
        assert s.count(a)==1, (fn, a[:90], s.count(a))
        s=s.replace(a,b)
    open(R+fn,'w',encoding='utf-8').write(s)
patch('risk.js', [
("function chAboveAppetite(alloc) { return CH_LINES.filter(l => !chOptWithin(l, chOpt(alloc, l))); }",
"""function chAboveAppetite(alloc) { return CH_LINES.filter(l => !chOptWithin(l, chOpt(alloc, l))); }
// The Day 67 minute's head and its sentence, from the Board's decision as recorded (G.ch.decision, G.ch.final, G.ch.sent):
// said at 15:00 in the budget round, and read again as a record in the Board report's drill.
function chBudgetMinuteParts(c) {
  const d = c.decision || {}, up = chLine('R6').opts.length - 1, cut = d.cut || [];
  const above = c.final ? chAboveAppetite(c.final) : [], ids = above.map(l => l.id), list = ids.length > 1 ? ids.slice(0, -1).join(', ') + ' and ' + ids[ids.length - 1] : ids[0];
  const head = d.override ? 'The Board overrode your allocation: the upgrade in full' + (cut.length ? ', paid for by deferring ' + cut.join(', ') : '') + '. ' : 'The Board approved your allocation' + (cut.length ? ', less ' + cut.join(', ') : d.persuaded && c.sent && c.sent.R6 !== up ? ' as sent, the extension carrying the platform' : ' as sent') + '. ';
  const minute = above.length ? 'The minute records the Board’s decision to carry ' + list + ' above appetite until Day ' + CH_EXPIRY_DAY + (d.override ? ', with the CISO’s advice against it and the objection noted' : '') + ', and its acceptance of the residual risk, approved by the Board. Each owner signs for the interim measures and owns the treatment plan.'
    : 'The minute records the decision. No line is left above appetite once its line delivers.';
  return {head, minute, above};
}"""),
("""    if (chExcClass(e).cls !== 'escalated' || !/^6\\.7: /.test(chExcTolerance(e).text)) bad.push(e.id + ': inside ' + e.boardLine + ', which ' + (r.breaks.length ? 'breaks a tolerance' : 'is above appetite') + ', but not escalated with 6.7 shown');
  }
  return bad;""",
"""    if (chExcClass(e).cls !== 'escalated' || !/^6\\.7: /.test(chExcTolerance(e).text)) bad.push(e.id + ': inside ' + e.boardLine + ', which ' + (r.breaks.length ? 'breaks a tolerance' : 'is above appetite') + ', but not escalated with 6.7 shown');
  }
  // The Board report (District 4): once a report is sent, its required rows are what the records say (report.js).
  if (c.rep && c.rep.sent && typeof chRepAuditNow === 'function') for (const x of chRepAuditNow()) bad.push(x);
  return bad;"""),
])
patch('budget-story.js', [
("""  const ids = above.map(l => l.id), list = ids.length > 1 ? ids.slice(0, -1).join(', ') + ' and ' + ids[ids.length - 1] : ids[0];
  const gapTxt""", "  const gapTxt"),
("""  const head = d.override ? 'The Board overrode your allocation: the upgrade in full' + (d.cut.length ? ', paid for by deferring ' + d.cut.join(', ') : '') + '. ' : 'The Board approved your allocation' + (d.cut.length ? ', less ' + d.cut.join(', ') : d.persuaded && c.sent.R6 !== up ? ' as sent, the extension carrying the platform' : ' as sent') + '. ';
  const minute = above.length ? 'The minute records the Board’s decision to carry ' + list + ' above appetite until Day ' + CH_EXPIRY_DAY + (d.override ? ', with the CISO’s advice against it and the objection noted' : '') + ', and its acceptance of the residual risk, approved by the Board. Each owner signs for the interim measures and owns the treatment plan.'
    : 'The minute records the decision. No line is left above appetite once its line delivers.';""",
"""  // The head and the minute's sentence (risk.js, chBudgetMinuteParts): the same text the Board report reads as a record.
  const {head, minute} = chBudgetMinuteParts(c);"""),
])
P=[]
def rep(a,b): P.append((a,b))
rep("   Suppliers, in suppliers-*.js; District 3, Policy, in policy-*.js; the\n   primitives are in risk.js, supplier.js and policy.js.",
    "   Suppliers, in suppliers-*.js; District 3, Policy, in policy-*.js; District 4,\n   The Board report, in report-*.js; the primitives are in risk.js, supplier.js,\n   policy.js and report.js.")
rep("badgeFlags: ['chBallast', 'chHawser', 'chSheetBend'],", "badgeFlags: ['chBallast', 'chHawser', 'chSheetBend', 'chRollingHitch'],")
rep("Then policy: an exception register with owners, expiries and reviews, and a policy the Board approves.',",
    "Then policy: an exception register with owners, expiries and reviews, and a policy the Board approves. Then the Board report: one page from your own records, every line checked against them.',")
rep("creditsFacts: 'Charter (the prologue, Budget, Suppliers and Policy):", "creditsFacts: 'Charter (the prologue, Budget, Suppliers, Policy and the Board report):")
rep("and GV.PO-01 with two examples and GV.PO-02, from NIST’s CSF 2.0 Implementation Examples (26 February 2024).",
    "GV.PO-01 with two examples and GV.PO-02, and GV.OV-01 and GV.OV-03 with one example each, from NIST’s CSF 2.0 Implementation Examples (26 February 2024).")
rep("78: 'Monday', 79: 'Tuesday', 80: 'Wednesday', 81: 'Thursday'};", "78: 'Monday', 79: 'Tuesday', 80: 'Wednesday', 81: 'Thursday', 85: 'Monday', 86: 'Tuesday', 87: 'Wednesday', 88: 'Thursday'};")
rep("chPolExc: 100, chPolExp: 100, chPolRev: 100},\n    mfaSet", "chPolExc: 100, chPolExp: 100, chPolRev: 100, chRepClaims: 100, chRepRequired: 100, chRepDecide: 100},\n    mfaSet")
rep("dojo: [false, false, false], sup: null, pol: null}", "dojo: [false, false, false], sup: null, pol: null, rep: null}")
rep("ps = G.ch && G.ch.pol ? chPolStats() : null;", "ps = G.ch && G.ch.pol ? chPolStats() : null, rs = G.ch && G.ch.rep ? chRepStats() : null;")
rep("chPolExc: ps ? ps.exc : null, chPolExp: ps ? ps.exp : null, chPolRev: ps ? ps.rev : null};",
    "chPolExc: ps ? ps.exc : null, chPolExp: ps ? ps.exp : null, chPolRev: ps ? ps.rev : null,\n    chRepClaims: rs ? rs.claims : null, chRepRequired: rs ? rs.required : null, chRepDecide: rs ? rs.decide : null};")
rep("  {k: 'chPolRev', label: 'Policies with a review date (your advice)', unit: '%', higher: true, when: () => !!G.f.chPolStart}\n];",
    "  {k: 'chPolRev', label: 'Policies with a review date (your advice)', unit: '%', higher: true, when: () => !!G.f.chPolStart},\n"
    "  // The Board report (slice 4): CAREER_LADDER §3 \"governing-body reports on time and with no unsupported claim\", widened\n"
    "  // and labelled (game): the report as sent, read line by line against its records.\n"
    "  {k: 'chRepClaims', label: 'Claims supported (your report as sent)', unit: '%', higher: true, when: () => !!G.f.chRepStart},\n"
    "  {k: 'chRepRequired', label: 'Required items present (your report as sent)', unit: '%', higher: true, when: () => !!G.f.chRepStart},\n"
    "  {k: 'chRepDecide', label: 'Decisions with a named decider and your recommendation (your report as sent)', unit: '%', higher: true, when: () => !!G.f.chRepStart}\n];")
rep("const ss = G.f.chSupStart ? chSupStats() : null, sup = G.ch && G.ch.sup, pol = G.f.chPolStart ? chPol() : null;",
    "const ss = G.f.chSupStart ? chSupStats() : null, sup = G.ch && G.ch.sup, pol = G.f.chPolStart ? chPol() : null, rep = G.f.chRepStart ? chRep() : null;")
rep("Policy drills with every needs met: <b>' + pol.needs.met + ' of ' + pol.needs.total + '</b>.</p>' : '') +",
    "Policy drills with every needs met: <b>' + pol.needs.met + ' of ' + pol.needs.total + '</b>.</p>' : '') +\n"
    "    (rep ? '<p>The Board report: scored on your report as sent' + (rep.grade ? ', ' + rep.grade.lines + ' lines of ' + CH_REP_PAGE + ', report score ' + rep.grade.score + ' / 100' : ', not sent yet') + '. Report drills with every needs met: <b>' + rep.needs.met + ' of ' + rep.needs.total + '</b>.</p>' : '') +")
rep("(G.f.chPolStart ? ' · Sheet Bend Badge: ' + (G.f.chSheetBend ? 'yes' : 'not yet') : '') + '</p>' +",
    "(G.f.chPolStart ? ' · Sheet Bend Badge: ' + (G.f.chSheetBend ? 'yes' : 'not yet') : '') + (G.f.chRepStart ? ' · Rolling Hitch Badge: ' + (G.f.chRollingHitch ? 'yes' : 'not yet') : '') + '</p>' +")
rep("chPolSummary: !!(G.f && G.f.chPolSummary), ch:", "chPolSummary: !!(G.f && G.f.chPolSummary), chRepSummary: !!(G.f && G.f.chRepSummary), ch:")
rep("  if (!f.chPolSummary) return at('16:00: your desk: close the week.', 'choffice', 26, 9);\n  return {text: 'Policy done. Next: The Board report.', done: true};\n}",
    "  if (!f.chPolSummary) return at('16:00: your desk: close the week.', 'choffice', 26, 9);\n  return repObjective(at);\n}\n"
    "// District 4, The Board report (Days 85 to 88).\n"
    "function repObjective(at) {\n"
    "  const f = G.f, rep = G.ch.rep;\n"
    "  if (!f.chRepStart) return at('Next week, Monday: your desk.', 'choffice', 26, 9);\n"
    "  if (!f.chRepDrillA) return at('Monday 09:00: Beatriz, at the identity desk: a line about MFA.', 'choffice', 12, 2);\n"
    "  if (!f.chRepDrillB) return at('11:00: Marit’s desk: a line about the suppliers.', 'choffice', 24, 2);\n"
    "  if (!f.chRepDrillC) return at('14:00: Edda’s desk: who accepted R2 and R3.', 'choffice', 18, 2);\n"
    "  if (!f.chRepDay85) return at('End the day at your desk.', 'choffice', 26, 9);\n"
    "  if (!f.chRepRecords) return at('Tuesday 09:00: your desk: the quarter’s records.', 'choffice', 26, 9);\n"
    "  if (!f.chRepDirective) return at('11:00: Edda’s desk: a request about the summary.', 'choffice', 18, 2);\n"
    "  if (!f.chRepDojoMet) return at('14:00: Beatriz has three terminals for you. Talk to her first.', 'choffice', 12, 2);\n"
    "  if (!f.chRepDojoDone) return at('The Reporting terminals, south-west: ' + (3 - rep.dojo.filter(Boolean).length) + ' left.', 'choffice', 3 + 2 * Math.max(0, rep.dojo.findIndex(x => !x)), 9);\n"
    "  if (!f.chRepDay86) return at('End the day at your desk.', 'choffice', 26, 9);\n"
    "  if (!f.chRepSent) return at('Wednesday 09:00: your desk: the report, due with Marit for the papers.', 'choffice', 26, 9);\n"
    "  if (!f.chRepDay87) return at('End the day at your desk.', 'choffice', 26, 9);\n"
    "  if (!f.chRepBoard) return at('Thursday 14:00: the Compact Board room: your report.', 'chboard', 8, 3);\n"
    "  if (!f.chRepSummary) return at('16:00: your desk: close the week.', 'choffice', 26, 9);\n"
    "  return {text: 'The Board report done. Next: The finale.', done: true};\n}")
rep("else if (ch === '¤') run(() => f.chPolStart ?", "else if (ch === '¤') run(() => f.chRepStart ? chRepDojoPuzzle([3, 5, 7].indexOf(tx)) : f.chPolStart ?")
rep("      if (f.chPolCheck && !f.chPolBoard) { await chPolBoardRound(); return; }\n      if (f.chPolBoard) {",
    "      if (f.chPolCheck && !f.chPolBoard) { await chPolBoardRound(); return; }\n      if (f.chRepDay87 && !f.chRepBoard) { await chRepBoardRound(); return; }\n"
    "      if (f.chRepBoard) { await say('The Rolling Hitch Badge: every line you bring us arrives with its record. Keep it that way.', who); return; }\n"
    "      if (f.chRepStart) { await say(f.chRepDay87 ? 'Thursday at 14:00. The members have your page.' : 'Thursday at 14:00, your first report. One page, and the records behind it.', who); return; }\n"
    "      if (f.chPolBoard) {")
rep("      if (f.chPolDay78 && !f.chPolDrillB) { await chPolDrillB(); return; }\n",
    "      if (f.chPolDay78 && !f.chPolDrillB) { await chPolDrillB(); return; }\n"
    "      if (f.chRepStart && !f.chRepDrillA) { await chRepDrillA(); return; }\n"
    "      if (f.chRepDirective && !f.chRepDojoMet) { await chRepDojoIntro(); return; }\n"
    "      if (f.chRepStart) { await say(f.chRepDojoMet && !f.chRepDojoDone ? 'The three terminals, south-west: a line against its record, a trend from one point, and who decided.' : f.chRepDrillA ? 'Six accounts on open, dated exceptions: that is what the records say, so that is the line.' : 'MFA-Exempt and the sign-in records, when you’re ready.', who); return; }\n")
rep("      if (f.chPolDay80 && !f.chPolCheck) { await chPolCheck(); return; }\n",
    "      if (f.chPolDay80 && !f.chPolCheck) { await chPolCheck(); return; }\n"
    "      if (f.chRepDrillB && !f.chRepDrillC) { await chRepDrillC(); return; }\n"
    "      if (f.chRepRecords && !f.chRepDirective) { await chRepDirective(); return; }\n"
    "      if (f.chRepStart) { await say(f.chRepDirective ? 'One line, with the minute’s reference. Your page.' : f.chRepDrillC ? 'My draft line is changed. The rest of the page is yours.' : 'R2, R3 and the platform are mine. Bring the records when you want them.', who); return; }\n")
rep("      if (f.chSupDay73 && !f.chSupThu) { await chSupThursday(); return; }\n",
    "      if (f.chSupDay73 && !f.chSupThu) { await chSupThursday(); return; }\n"
    "      if (f.chRepDrillA && !f.chRepDrillB) { await chRepDrillB(); return; }\n"
    "      if (f.chRepStart) { await say(f.chRepSent ? 'Your report is in the papers as you sent it.' : f.chRepDrillB ? 'My supplier line is changed: one measure, where it stands. Your page is due by Wednesday.' : f.chRepDrillA ? 'My MFA line is corrected. Next, the suppliers.' : 'The papers for Thursday go out on Wednesday at 17:00.', who); return; }\n")
rep("  if (f.chPolBoard) { await chPolSummary(); return; }\n  if (f.chPolStart) {",
    "  if (f.chPolBoard && !f.chPolSummary) { await chPolSummary(); return; }\n"
    "  if (f.chPolSummary && !f.chRepStart) { await chRepStart(); return; }\n"
    "  if (f.chRepDrillC && !f.chRepDay85) {\n"
    "    await UI.openModal('Monday, done', '<p>Three draft lines read against their records: MFA, the suppliers, and who accepted R2 and R3. (game)</p>', [{label: 'Tuesday', meta: {good: true}}], {closable: false, cls: 'summary'});\n"
    "    f.chRepDay85 = true; G.day = 86; G.focus = G.focusMax; track();\n"
    "    await say('Day 86, Tuesday, 09:00. The quarter’s records are on your desk.'); return;\n  }\n"
    "  if (f.chRepDay85 && !f.chRepRecords) { await chRepRecords(); return; }\n"
    "  if (f.chRepDojoDone && !f.chRepDay86) {\n"
    "    await UI.openModal('Tuesday, done', '<p>The quarter’s records read, Edda’s request answered, and the Reporting terminals. Tomorrow, the page. (game)</p>', [{label: 'Wednesday', meta: {good: true}}], {closable: false, cls: 'summary'});\n"
    "    f.chRepDay86 = true; G.day = 87; G.focus = G.focusMax; track();\n"
    "    await say('Day 87, Wednesday, 09:00. The report is due with Marit for the papers. Your desk.'); return;\n  }\n"
    "  if (f.chRepDay86 && !f.chRepSent) { await chRepEditTask(); return; }\n"
    "  if (f.chRepSent && !f.chRepDay87) {\n"
    "    await UI.openModal('Wednesday, done', '<p>17:00: the papers go out, with your report as you sent it. (game)</p>', [{label: 'Thursday', meta: {good: true}}], {closable: false, cls: 'summary'});\n"
    "    f.chRepDay87 = true; G.day = 88; G.focus = G.focusMax; track();\n"
    "    await say('Day 88, Thursday. 14:00: the Compact Board room, your report.'); return;\n  }\n"
    "  if (f.chRepBoard) { await chRepSummary(); return; }\n"
    "  if (f.chRepStart) { await say('Your desk: the register on one screen, the Board papers on the other.'); return; }\n"
    "  if (f.chPolBoard) { await chPolSummary(); return; }\n  if (f.chPolStart) {")
patch('story.js', P)
patch('data.js', [
("register, and (District 3) the exception register and the policy library.", "register, (District 3) the exception register and the policy library, and\n   (District 4) the Board report."),
("|| (!!G.f.chPolCheck && !G.f.chPolBoard)},", "|| (!!G.f.chPolCheck && !G.f.chPolBoard) || (!!G.f.chRepDay87 && !G.f.chRepBoard)},"),
("  chpolboard: {name: 'The register in the board’s language', desc: 'Tell the board what the register shows: each exception’s owner, dates and control, and any past its expiry. A policy that says “all” needs a register that is read.'}\n};",
 "  chpolboard: {name: 'The register in the board’s language', desc: 'Tell the board what the register shows: each exception’s owner, dates and control, and any past its expiry. A policy that says “all” needs a register that is read.'},\n"
 "  // The Board report (slice 4)\n"
 "  chrepmfa: {name: 'A line checked like a finding', desc: 'Before a line goes into a report, read it against the records it stands on. “Every” is said only where the record says every: name the exceptions, briefly.'},\n"
 "  chrepsup: {name: 'A trend needs two measures', desc: 'A first measure is a baseline, not a fall or a rise. A plan or a request is what is sought; a signed contract is what is in place.'},\n"
 "  chrepwho: {name: 'Who decided, as minuted', desc: 'The minute says who decided; the acceptance says who signed, and for what. A report names both, from the records, and never moves a decision to the person who signed for the checks.'},\n"
 "  chrepdir: {name: 'What the board knows still goes in', desc: 'Every risk the board carries above appetite goes on the page each time, in one line with the minute’s reference. The report states it; it doesn’t argue it.'},\n"
 "  chrepbuild: {name: 'One page and an annex', desc: 'A report to the board is one page in its terms, every line tied to a dated record in the annex: risks against appetite and who accepted them, what changed, the decisions it must take with one decider each and your recommendation, exceptions due and expired, supplier gaps and asks. Leaving out a required item is worse than a dull line.'},\n"
 "  chrepboard: {name: 'Answering the board from the records', desc: 'When a member questions a line, answer from its record. A line the record does not support is corrected in the minute, in the wording the record supports.'}\n};"),
("  chcsf: {name: 'Risk appetite and resources in CSF 2.0 Govern',",
 "  chcsfov: {name: 'Oversight in CSF 2.0 Govern', desc: 'GV.OV-01: “Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction”, with NIST’s example “Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives”. GV.OV-03: “Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed”, with the example “Collect and communicate metrics on cybersecurity risk management with senior leadership”.', src: 'NIST, CSF 2.0 Implementation Examples (26 February 2024)'},\n"
 "  chcsf: {name: 'Risk appetite and resources in CSF 2.0 Govern',"),
("  'The register’s first entry, the town’s fd-admin exception, is quoted from the town’s own records (Town Hall) and nothing is added to it: what they do not state is shown as not stated. (game)'\n];",
 "  'The register’s first entry, the town’s fd-admin exception, is quoted from the town’s own records (Town Hall) and nothing is added to it: what they do not state is shown as not stated. (game)',\n"
 "  'The Board report: the one-page summary and its ten-line limit, every row and wording, the annex’s records and their times, the grading and the report score, the members’ questions, the contracts status, and the Rolling Hitch Badge’s effects (every line in a report to the Board arriving with its record’s reference and time; Focus +4) are invented. Each line is filled from your own records. The suspicion file appears on the page as one open item, with no conclusion. (game)'\n];"),
])
p=R+'edition.json'; d=json.load(open(p,encoding='utf-8'))
d['district']='Prologue (the appointment and the risk-appetite statement), Budget, Suppliers, Policy, and the Board report'
d['slice']=4
d['blurb']=d['blurb'].replace(' Next: The Board report.',' Then the Board report: one page to the Compact Board, built from your own records and read line by line against them. Next: The finale.')
fl=d['files']; fl.insert(fl.index('policy.js')+1,'report.js'); fl+=['report-data.js','report-story.js']
open(p,'w',encoding='utf-8').write(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
print('game patched')
