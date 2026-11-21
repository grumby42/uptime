p='/home/claude/uptime/tests/layout.js'; s=open(p,encoding='utf-8').read()
anchor = "    check('Charter ' + name + ': the library’s debrief table fits, cells on one line', fits(ld) && !ld.wrapped.length, ld);\n"
assert s.count(anchor)==1
add = anchor + r'''    // The Board report (slice 4): the scorecard with its three report rows, the editor's page, the longest section (every
    // row in, filled from the records), the page as it stands with every line and the annex, and the debrief's table.
    await shut(); await sleep(100);
    await p.evaluate(() => { G.f.chRepStart = true; if (!G.ch.final) { G.ch.final = Object.fromEntries(CH_LINES.map(l => [l.id, 0])); G.ch.decision = {override: true, cut: ['R2', 'R3'], restored: [], persuaded: false}; }
      const sp = chSup(); if (!sp.planSent) sp.planSent = chPlanAll(); const r = chRep(); r.picks = Object.fromEntries(chRepRows().map(x => [x.id, chRepGood(x)])); r.sent = {picks: Object.assign({}, r.picks), at: CH_REP_SENT_AT.slice()}; r.grade = chRepGrade(r.sent.picks); track(); UI.openModal('Scorecard', scorecardHtml(), [{ label: 'Back' }]); }); await sleep(250);
    const sc4 = await modalFit();
    check('Charter ' + name + ': the scorecard with the three report rows fits, table numbers and targets on one line', fits(sc4) && !sc4.wrapped.length, sc4);
    await shut(); await sleep(100);
    await p.evaluate(() => { run(() => chRepEdit()); }); await sleep(300);
    const re = await modalFit();
    check('Charter ' + name + ': the report’s page (six sections, Read, Send) fits above the controls, no overflow', fits(re), re);
    await p.screenshot({ path: OUT + '/layout-charter-' + name + '-report.png' });
    await shut(); await sleep(100);
    await p.evaluate(() => { const secs = CH_REP_SECTIONS.map(s => [s, chRepRows().filter(r => r.sec === s.id).reduce((n, r) => n + chRepLineText(r, chRepGood(r), chRepFacts()).length, 0)]); secs.sort((a, b) => b[1] - a[1]); run(() => chRepSection(secs[0][0])); }); await sleep(300);
    const rs = await modalFit();
    check('Charter ' + name + ': the report’s longest section (every line in, filled from the records) fits above the controls, no overflow', fits(rs), rs);
    await p.screenshot({ path: OUT + '/layout-charter-' + name + '-report-section.png' });
    await shut(); await sleep(100);
    await p.evaluate(() => { UI.openModal('The page as it stands', chRepPageHtml(G.ch.rep.picks), [{ label: 'Back to the sections', meta: { back: true } }], { closable: false, cls: 'summary' }); }); await sleep(250);
    const rpg = await modalFit();
    check('Charter ' + name + ': the page as it stands (every line, the annex) fits above the controls, no sideways overflow', fits(rpg), rpg);
    await shut(); await sleep(100);
    await p.evaluate(() => { UI.openModal('The report you sent', chRepDebriefHtml(G.ch.rep.grade), [{ label: 'Into the Board papers', meta: { good: true } }], { closable: false, cls: 'summary' }); }); await sleep(250);
    const rdb = await modalFit();
    check('Charter ' + name + ': the report’s debrief table fits, cells on one line', fits(rdb) && !rdb.wrapped.length, rdb);
'''
s = s.replace(anchor, add)
o="  // then the Suppliers pages, and the Policy pages (the scorecard's policy rows, the exception register, the intake, the\n  // policy library and its debrief)."
assert s.count(o)==1
s = s.replace(o, "  // then the Suppliers pages, the Policy pages (the scorecard's policy rows, the exception register, the intake, the\n  // policy library and its debrief), and the Board report's pages (the scorecard's report rows, the editor, its longest\n  // section, the page as it stands and the debrief).")
open(p,'w',encoding='utf-8').write(s)
print('layout ok')
