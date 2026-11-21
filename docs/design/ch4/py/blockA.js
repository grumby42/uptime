
  // ======== District 4: the Board report (this run: the override path, Inkmere C1 left out, EX-04 the Board's) ========
  await A.follow(p => p.f.chRepStart, []);
  const rD = await A.page.evaluate(() => ({ day: G.day, wd: CH_DAY[G.day], m: metricVals(), sc: editionScorecard(), obj: objective().text, fm: G.fm, fov: FACTS.chcsfov.desc, badges: EDITION.badgeFlags }));
  check('Report week opens on Day 85, a Monday; the report metrics show “—” until a report is sent; the scorecard names the Rolling Hitch Badge as not yet; GV.OV-01 with its Ex1 and GV.OV-03 with its Ex3, word for word; the objective is Beatriz at the identity desk',
    rD.day === 85 && rD.wd === 'Monday' && (85 - 1) % 7 === 0 && rD.m.chRepClaims === null && rD.m.chRepRequired === null && rD.m.chRepDecide === null && /Claims supported \(your report as sent\)/.test(rD.sc) && /Rolling Hitch Badge: not yet/.test(rD.sc) && rD.badges.includes('chRollingHitch') && rD.fm['fact:chcsfov'] &&
    rD.fov.includes('GV.OV-01: “Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction”') && rD.fov.includes('“Measure how well the risk management strategy and risk results have helped leaders make decisions and achieve organizational objectives”') &&
    rD.fov.includes('GV.OV-03: “Organizational cybersecurity risk management performance is measured and reviewed for adjustments needed”') && rD.fov.includes('“Collect and communicate metrics on cybersecurity risk management with senior leadership”') && !/evaluated and reviewed/.test(rD.fov) && /Beatriz/.test(rD.obj), { m: rD.m, obj: rD.obj });
  await A.goTo('choffice', 12, 2);
  await A.settle([], /Investigation drill · Can the report say “MFA on every sign-in”\?/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/^Query: The exception register and MFA-Exempt/);
  await A.pickLabel(/^Which accounts are excepted from MFA/);
  await A.settle([], /^Drill ·/);
  await A.pickLabel(/I have enough: decide/);
  await A.settle([]);
  const rA = await A.page.evaluate(() => G.ch.rep.drills.repmfa);
  check('Report drill 1 (can the report say “MFA on every sign-in”?): the right verdict read from the exception register alone is unsupported (needs: the register and the sign-in records)', rA.verdictOk && !rA.supported, rA);
  await A.follow(p => p.f.chRepDrillC, []);
  const rC = await A.page.evaluate(() => ({ dr: G.ch.rep.drills, key: chRepWhoKey(), d: chRepDrillFill(CH_REP_DRILLS.repwho), said: chBudgetMinuteParts(G.ch) }));
  const rCmin = rC.d.sources.find(x => x.id === 'minute').qs[0].res[0], rCacc = rC.d.sources.find(x => x.id === 'acc').qs[0].res[0];
  check('Report drills 2 and 3 supported; drill 3 on this path is “who accepted R2 and R3” with the Board’s decision: its records are the game’s own Day 67 minute (the sentence said at 15:00) and the acceptances (decided by the Compact Board, against the CISO’s advice; signed by Edda for the interim measures); the right verdict names the Board and Edda’s signature',
    rC.dr.repsup.verdictOk && rC.dr.repsup.supported && rC.key === 'repwho' && rC.dr.repwho.verdictOk && rC.dr.repwho.supported &&
    /The minute records the Board’s decision to carry R2, R3 and R4 above appetite until Day 428, with the CISO’s advice against it and the objection noted, and its acceptance of the residual risk, approved by the Board\./.test(rCmin) && rCmin === rC.said.head + rC.said.minute &&
    /R2: decided by the Compact Board \(minute, Day 67\), against the CISO’s advice, the residual approved by the Compact Board, signed by Edda Thornquist, its owner, for the interim measures and the treatment plan/.test(rCacc) && /\. R3: /.test(rCacc), { min: rCmin, acc: rCacc });
  await A.follow(p => p.f.chRepRecords, []);
  const rRec = await A.page.evaluate(() => ({ m: metricVals() }));
  check('Report Tuesday 09:00: the quarter’s records are the player’s own results as recorded (on this run: risks within appetite 100%, must-haves in the plan 95%, the write-ups 50%, the library 83%)',
    rRec.m.chWithin === 100 && rRec.m.chSupMust === 95 && rRec.m.chPolExc === 50 && rRec.m.chPolRev === 83, rRec.m);
  const rDir = await A.follow(p => p.f.chRepDirective, [], /Edda’s request: what do you tell her/);
  await A.pickLabel(/^Leave it out: the Board minuted it/);
  await A.follow(p => p.f.chRepDirective, []);
  const rSayD = await sayLog();
  const rDd = await A.page.evaluate(() => G.ch.rep.directive);
  check('Report directive, played: Edda asks for R2 and R3 to stay out of the summary (this path); “leave it out” is explained and retried; the right answer keeps it in one line with the minute’s reference; the false start recorded',
    !!rDir && rDd.first === false && rDd.item === 'R2 and R3' && rSayD.some(x => /^Edda Thornquist\|Leave R2 and R3 out of the summary, would you\? The Board decided them itself on Day 67\. It already knows\./.test(x)) && rSayD.some(x => /A member who reads only this page must see it/.test(x)) && rSayD.some(x => /One line, with the minute’s reference/.test(x)), rDd);
  await A.follow(p => false, [], /The report · the page/);
  // Exercise the editor once by hand: a row cycles from "left out" through its wordings in the seeded order, and back.
  await A.pickLabel(/^Risks against appetite/);
  await A.settle([], /The report · Risks against appetite/);
  const rCy0 = await A.page.evaluate(() => ({ u: UI.modal.items.map(o => o.label), cy: chRepCycle(chRepRows().find(r => r.id === 'A1')), p: G.ch.rep.picks.A1 }));
  await A.press('right'); await sleep(200);
  const rCy1 = await A.page.evaluate(() => ({ p: G.ch.rep.picks.A1, u: UI.modal.items.map(o => o.label), want: chRepFill(CH_REP_ROWS[0].variants[G.ch.rep.picks.A1 - 1].label, chRepFacts()) }));
  await A.press('left'); await sleep(200);
  const rCy2 = await A.page.evaluate(() => G.ch.rep.picks.A1);
  check('Report editor: a row starts left out, right moves it to the next wording in its seeded order (the label shows the filled line), left moves it back',
    rCy0.p === 0 && /^Left out: Above appetite, on its owner’s acceptance$/.test(rCy0.u[0]) && rCy1.p === rCy0.cy[1] && rCy1.u[0] === rCy1.want && rCy2 === 0, { cy0: rCy0, cy1: rCy1, cy2: rCy2 });
  await A.pickLabel(/^Back to the sections$/);
  // The report sent: deliberately weak lines (A2 and E2 misplaced, B1 and B3 overstated, C2 unsupported) and an omission (D1).
  await A.settle([], /The report · the page/);
  await A.page.evaluate(() => { const P = chRepPicks(), g = (id, gr) => chRepRow(id).variants.findIndex(v => v.grade === gr) + 1;
    Object.assign(P, {A1: g('A1', 'supported'), A2: g('A2', 'misplaced'), A3: 0, B1: g('B1', 'overstated'), B2: 0, B3: g('B3', 'overstated'), B4: 0, C1: g('C1', 'supported'), C2: g('C2', 'unsupported'), C3: g('C3', 'supported'), D1: 0, E1: g('E1', 'supported'), E2: g('E2', 'misplaced'), F1: 0}); });
  await A.pickLabel(/^Send it to Marit for the papers$/);
  await A.settle([], /Send the report\?/);
  const rSend = await A.modalText();
  await A.pickLabel(/^Send it$/);
  await A.settle([], /The report you sent/);
  const rDeb = await A.modalText();
  await A.follow(p => p.f.chRepSent, []);
  const rS = await A.page.evaluate(() => ({ g: G.ch.rep.grade, m: metricVals(), sent: G.ch.rep.sent, rows: chRepRows().map(r => r.id + (r.required ? '*' : '')), page: chRepPageHtml(G.ch.rep.sent.picks), oi: chRepOpenItem(), F: chRepFacts(), aud: chRepAuditNow(), recs: CH_REP_RECORDS }));
  check('Report as sent reflects this run’s results: A2 names R2 and R3 (the Board’s decision, Edda signing; R4 within since the call-back), E2 names Inkmere C1 (left out on the plan), A1 the airport’s trust (Joanna) and cp-xfer’s return (Marit), C2’s deciders the chair for EX-02 and this Board for EX-04 (6.3, R4 trimmed), C3 R2 and R3 back at the next budget cycle, E1 every must-have sought in both tier-1 contracts; the required rows are A1, A2, C1, C2, C3, D1, E1 and E2; rules and records agree',
    rS.F.boardLines === 'R2 and R3' && rS.F.boardSigners === 'Edda' && rS.F.mhList === 'Inkmere C1' && rS.F.ownerAcc === 'The airport’s directory trust (Joanna) and cp-xfer’s return (Marit)' && rS.F.renewDecide === 'the chair decides EX-02 and this Board, in its minute, EX-04' &&
    rS.F.cycleWhat === 'R2 and R3, deferred by this Board, come back for funding' && rS.F.sought === 'every must-have sought in both' && rS.rows.join() === 'A1*,A2*,A3,B1,B2,B3,B4,C1*,C2*,C3*,D1*,E1*,E2*,F1' && !rS.aud.length &&
    /R2 and R3: above appetite to Day 428 on the owner’s acceptance alone, Edda signing it as the line’s owner on Day 67/.test(rSend) && /Inkmere C1: left out by its owner’s own choice/.test(rSend), { F: rS.F, rows: rS.rows, aud: rS.aud });
  check('Report graded on the report as sent: 9 lines, 4 supported, 5 weak (A2 and E2 misplaced, B1 and B3 overstated, C2 unsupported), D1 left out though required; claims supported 44%, required items present 88%, decisions with a decider and your recommendation 67% (C2 has neither); report score 6 (20 a supported line, −10 a weak one, −20 a required row left out); the send confirmation named D1; the debrief names each grade and why',
    rS.g.lines === 9 && rS.g.supported === 4 && rS.g.weak.join() === 'A2,B1,B3,C2,E2' && rS.g.omitted.join() === 'D1' && rS.m.chRepClaims === 44 && rS.m.chRepRequired === 88 && rS.m.chRepDecide === 67 && rS.g.score === 6 &&
    /Left out, though Ivor’s note asks for it: Expired this quarter/.test(rSend) && /A2, misplaced: /.test(rDeb) && /B1, overstated: /.test(rDeb) && /C2, unsupported: /.test(rDeb) && /D1 left out: Ivor’s note asks for the exceptions that expired this quarter/.test(rDeb) && /report score 6 \/ 100/.test(rDeb), { g: rS.g, m: rS.m });
  check('Report times: the report is sent on Day 87 at 12:00; every record in the annex is dated Day 86 17:00 or earlier; the page says nothing of Thursday (no Day 88, no badge, no question); the open item is the suspicion file (7 notes), one observation consistent with the recorded notes (FD-STAFF-11’s address, 03:11 to 03:22) and no conclusion',
    rS.sent.at.join() === '87,12:00' && Object.values(rS.recs).every(r => r.at[0] < 86 || (r.at[0] === 86 && r.at[1] <= '17:00')) && !/Day 88|Rolling Hitch|Thursday/.test(rS.page) &&
    /^Open item \(not a claim\): the suspicion file, 7 notes, with Rae Okafor’s team and counsel\. Every Crossroads note in it comes from FD-STAFF-11’s address between 03:11 and 03:22\. Who, and why: not known\. This report draws no conclusion\.$/.test(rS.oi) && /This report draws no conclusion/.test(rS.page), { oi: rS.oi });
  await A.follow(p => p.f.chRepDay87, []);
  const rQ = await A.follow(p => p.f.chRepBoard, [], /A member’s question/);
  const rQask = await A.page.evaluate(() => chRepBoardQs().map(q => q.row + '|' + q.ask));
  const rQ1 = rQ.ui.options.findIndex(o => !(o.meta && o.meta.good));
  await A.pickLabel(new RegExp('^' + esc(rQ.ui.options[rQ1].label) + '$'));
  await A.follow(p => p.f.chRepBoard, []);
  const rSayB = await sayLog();
  const rB = await A.page.evaluate(() => ({ b: G.ch.rep.board, min: G.ch.rep.minute, f: G.f, fm: G.focusMax, sc: editionScorecard(), m: metricVals(), aud: G.ch.audit }));
  check('Report round, played: the members’ questions are keyed to the report as sent (the omission first, D1, then the misplaced lines, A2 and E2), each quoting the player’s own line or naming what is missing; a wrong first answer recorded; the minute records the report as received (9 lines), corrects D1, A2 and E2 in their supported wording, asks for B1, B3 and C2 to be read again before Day 155, lists the decisions with their deciders and notes the open item with no conclusion; the scorecard still reads the report as sent (44/88/67); the Rolling Hitch Badge, Focus +4',
    rB.b.asked.join() === 'D1,A2,E2' && rB.b.first[0] === false && /says nothing about the exceptions that expired this quarter/.test(rQask[0]) && rQask[1].includes('Your page says: R2 and R3: above appetite to Day 428 on the owner’s acceptance alone') && rQask[2].includes('Inkmere C1: left out by its owner’s own choice') &&
    /The minute records the report as received \(Day 87 12:00\): 9 lines/.test(rB.min) && /Corrected in this minute, at the members’ questions: D1, “Expired: EX-01 and EX-03 on Day 75, closed by Edda on Day 78/.test(rB.min) && /A2, “R2 and R3: above appetite to Day 428, this Board’s Day 67 decision, Edda signing for interim measures”/.test(rB.min) && /E2, “Inkmere C1: left out on my recommendation/.test(rB.min) &&
    /The chair asks for B1, B3, C2 to be read again against the records before Day 155/.test(rB.min) && /C1 \(this Board\), C2 \(the chair and this Board, in its minute\), C3 \(this Board\)/.test(rB.min) && /The suspicion file noted as an open item, with no conclusion/.test(rB.min) &&
    rB.m.chRepClaims === 44 && rB.m.chRepRequired === 88 && rB.m.chRepDecide === 67 && rB.f.chRollingHitch && /Rolling Hitch Badge: yes/.test(rB.sc) && rSayB.some(x => /Rolling Hitch Badge \(game\)/.test(x)) && rSayB.some(x => /every line in a report to this Board arrives with its record’s reference and time/.test(x)), { asked: rB.b.asked, ask: rQask, min: rB.min });
  await A.follow(() => false, [], /End of the Board report/);
  const rSum = await A.modalText();
  const rE = await A.page.evaluate(() => ({ obj: objective(), ser: Series.load().editions.charter, keep: { th: localStorage.getItem('uptime.slice1.save'), cr: localStorage.getItem('uptime.crossroads.save'), ng: localStorage.getItem('uptime.crossroads.ngplus.save') } }));
  check('the Board report summary: “Next: The finale”, the drills, the report as sent with its grades, the minute, the lesson (every line against its record, a trend needs two measures, every risk above appetite on the page even when the board knows, one decider and your recommendation, an omission worse than a dull line), the scorecard on the report as sent; the series records the report; the objective done; the earlier saves byte-for-byte as seeded',
    /Next: The finale\./.test(rSum) && /Who accepted R2 and R3\?/.test(rSum) && /D1 left out/.test(rSum) && /a trend only where there are two measures/.test(rSum) && /even when the board already knows/.test(rSum) && /An omission is worse than a dull line/.test(rSum) && /Claims supported \(your report as sent\)/.test(rSum) &&
    rE.ser.report === true && rE.obj.done && /^The Board report done\. Next: The finale\.$/.test(rE.obj.text) && rE.keep.th === TH_SAVE && rE.keep.cr === CR_SAVE && rE.keep.ng === NG_SAVE, { obj: rE.obj, sum: rSum.slice(0, 900) });
  await A.settle([/^Keep exploring/]);
  const rFm = await A.page.evaluate(() => fmHtml());
  check('Field Manual (the Board report): GV.OV-01 and GV.OV-03 quoted, and the reporting practices (a line checked like a finding, a trend needs two measures, who decided as minuted, what the board knows still goes in, one page and an annex, answering from the records)',
    /GV\.OV-01: “Cybersecurity risk management strategy outcomes/.test(rFm) && /GV\.OV-03/.test(rFm) && /A line checked like a finding/.test(rFm) && /A trend needs two measures/.test(rFm) && /Who decided, as minuted/.test(rFm) && /What the board knows still goes in/.test(rFm) && /One page and an annex/.test(rFm) && /Answering the board from the records/.test(rFm), null);
  // The primitive, on synthetic picks: grade classes, the omission and length penalties, and rules and records agree.
  const rP = await A.page.evaluate(() => {
    const F = chRepFacts(), rows = chRepRows(F), set = f => Object.fromEntries(rows.map(r => [r.id, f(r)]));
    const sup = r => chRepGood(r);
    const dull = chRepGrade(set(r => r.required ? sup(r) : 0), F);
    const flashy = chRepGrade(set(r => r.id === 'D1' ? 0 : r.required ? sup(r) : r.variants.findIndex(v => v.grade !== 'supported') + 1), F);
    const long = chRepGrade(set(r => sup(r)), F);
    const grades = CH_REP_ROWS.map(r => r.variants.map(v => v.grade));
    const refsOk = CH_REP_ROWS.every(r => r.variants.every(v => v.refs.every(k => CH_REP_RECORDS[k])));
    const keep = JSON.stringify({accept: G.ch.accept, pol: G.ch.pol}), restore = () => { const k = JSON.parse(keep); G.ch.accept = k.accept; G.ch.pol = k.pol; };
    const out = {dull, flashy, long, grades, refsOk};
    G.ch.accept = G.ch.accept.filter(a => a.line !== 'R2'); out.noR2 = chAuditNow(); restore();
    chExc('EX-01').closedBy = 'the CISO'; out.d1 = chAuditNow(); restore();
    G.ch.sup.accept[0].closed = true; out.mh = chAuditNow(); G.ch.sup.accept[0].closed = false;
    out.clean = chAuditNow();
    return out;
  });
  check('Report grading classes: every row has exactly one supported wording; every weak wording is unsupported, overstated or misplaced, and all three classes appear; every wording cites only records in the annex list',
    rP.grades.every(g => g.filter(x => x === 'supported').length === 1 && g.every(x => ['supported', 'unsupported', 'overstated', 'misplaced'].includes(x))) && ['unsupported', 'overstated', 'misplaced'].every(c => rP.grades.some(g => g.includes(c))) && rP.refsOk, rP.grades);
  check('Report penalties: a dull report (the required rows only, each supported) scores 100; the same with every optional row in a weak wording and one required row left out scores far less (an omission is worse than a dull report); every row in, all supported, over the page, loses 10 a line over',
    rP.dull.score === 100 && rP.dull.claims === 100 && rP.dull.required === 100 && rP.dull.decide === 100 && rP.flashy.score < 50 && rP.flashy.required < 100 && rP.long.over === rP.long.lines - 10 && rP.long.over > 0 && rP.long.claims === 100, { dull: rP.dull.score, flashy: rP.flashy.score, long: [rP.long.lines, rP.long.over, rP.long.score] });
  check('Report invariant (rules and records agree): this run clean; an acceptance removed from the register (R2), a D1 record changed (EX-01 closed by the CISO) and a must-have’s acceptance closed are each caught as the report’s rows no longer matching the records',
    !rP.clean.length && rP.noR2.some(x => /^report: the Board’s lines above appetite are R2, R3, the report names R3/.test(x)) && rP.d1.some(x => /^report: D1’s wording no longer matches/.test(x)) && rP.mh.some(x => /^report: the must-haves left out are MH Inkmere C1, the report names none/.test(x)), { noR2: rP.noR2, d1: rP.d1, mh: rP.mh });
  const rSrc = await A.page.evaluate(() => ({ all: JSON.stringify([CH_REP_ROWS, CH_REP_DRILLS, CH_REP_DIRECTIVE, CH_REP_DOJO, CH_REP_BOARD_SPECS()]), good: JSON.stringify(CH_REP_ROWS.map(r => r.variants.find(v => v.good).label)) }));
  check('Report content: defender side only (no ATT&CK ID, no attack verb); the Quiet Thread is in no row, drill, question or option (only the open item, built from the series record); business terms on the page (no group or tool name in a supported row)',
    !/\bT1\d{3}\b|phish|malware|exploit|ransom|spray|brute/i.test(rSrc.all) && !/svc-print|FD-STAFF|suspicion|Quiet Thread/i.test(rSrc.all) && !/MFA-Exempt|FIN-STAFF|location rule/.test(rSrc.good), null);
