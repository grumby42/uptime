    // The report week on the recommended path: the bot's report, the persuaded-path drill and directive, no weak line.
    await R.follow(p => p.f.chRepDrillB, []);
    const rrC = await R.page.evaluate(() => ({ key: chRepWhoKey(), d: chRepDrillFill(CH_REP_DRILLS.repwho2) }));
    await R.follow(() => false, [], /End of the Board report/);
    const rrE = await R.page.evaluate(() => ({ aud: G.ch.audit, m: metricVals(), rep: G.ch.rep, rows: chRepRows().map(r => r.id + (r.required ? '*' : '')), F: chRepFacts(), page: chRepPageHtml(G.ch.rep.sent.picks), oi: chRepOpenItem() }));
    await R.settle([/^Keep exploring/]);
    check('recommended path, the report week: drill 3 is “nobody accepted R2 and R3” (the Board funded both; the minute and the register, none for R2 or R3), supported; Edda’s request is about cp-xfer’s return (minuted on Day 74)',
      rrC.key === 'repwho2' && /^The Board approved your allocation as sent, the extension carrying the platform\. The minute records the decision\. No line is left above appetite once its line delivers\.$/.test(rrC.d.sources.find(x => x.id === 'minute').qs[0].res[0]) &&
      rrE.rep.drills.repwho2.verdictOk && rrE.rep.drills.repwho2.supported && rrE.rep.directive.item === 'cp-xfer’s return', { key: rrC.key, dir: rrE.rep.directive });
    check('recommended path, the report as sent: built from this run’s records (no Board line above appetite, no must-have left out, the upgrade back at the next budget cycle, the chair deciding EX-02 and EX-04); the required rows A1, C1, C2, C3, D1, E1; 8 lines, every one supported; 100/100/100 and a report score of 100; the members ask the Board’s three standing questions; the minute corrects nothing; no open item (no note in this browser’s file)',
      rrE.rows.join() === 'A1*,A3,B1,B2,B3,B4,C1*,C2*,C3*,D1*,E1*,F1' && !rrE.F.boardIds.length && !rrE.F.mhIds.length && rrE.F.cycleWhat === 'the upgrade, R6, comes back as the extension ends' && rrE.F.renewDecide === 'the chair decides each' &&
      rrE.rep.grade.lines === 8 && rrE.rep.grade.supported === 8 && rrE.rep.grade.score === 100 && rrE.m.chRepClaims === 100 && rrE.m.chRepRequired === 100 && rrE.m.chRepDecide === 100 &&
      rrE.rep.board.asked.join() === 'The annex,Whose report,Better or worse' && /No correction asked/.test(rrE.rep.minute) && rrE.oi === '' && !/suspicion file/.test(rrE.page), { rows: rrE.rows, g: rrE.rep.grade, asked: rrE.rep.board.asked });
    check('recommended path: the invariant clean at all eight checkpoints (Days 67, 74, 81 and 88)', rrE.aud.length === 8 && rrE.aud.every(a => !a.bad.length) && rrE.aud.map(a => a.day).join() === '67,67,74,74,81,81,88,88', rrE.aud);
