p='/home/claude/uptime/tests/bot.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1, a[:80]
    s=s.replace(a,b)
rep("if (CH && p.extra && p.extra.chPolSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) break;",
    "if (CH && p.extra && p.extra.chRepSummary && p.ui && p.ui.type === 'modal' && p.ui.options[0].label.startsWith('Keep exploring')) break;")
rep("    if (CH && p.ui && p.ui.type === 'modal' && !stats.shots.library && /^The policy library · review dates/.test(await page.textContent('#modal .mhead'))) { stats.shots.library = 1; await shot('charter-library'); }\n",
    "    if (CH && p.ui && p.ui.type === 'modal' && !stats.shots.library && /^The policy library · review dates/.test(await page.textContent('#modal .mhead'))) { stats.shots.library = 1; await shot('charter-library'); }\n"
    "    if (CH && p.ui && p.ui.type === 'modal' && !stats.shots.report && /^The report · the page/.test(await page.textContent('#modal .mhead'))) { stats.shots.report = 1; await shot('charter-report'); }\n"
    "    if (CH && p.ui && p.ui.type === 'modal' && !stats.shots.reportSec && /^The report · Risks against appetite/.test(await page.textContent('#modal .mhead'))) { stats.shots.reportSec = 1; await shot('charter-report-section'); }\n"
    "    if (CH && p.ui && p.ui.type === 'modal' && !stats.shots.reportSent && /^Send the report\\?/.test(await page.textContent('#modal .mhead'))) { stats.shots.reportSent = 1; await shot('charter-report-send'); }\n")
rep("let savedCheckCh = null, savedCheckChSup = null, savedCheckChPol = null,", "let savedCheckCh = null, savedCheckChSup = null, savedCheckChPol = null, savedCheckChRep = null,")
rep("    if (CH && !savedCheckChPol && p.map === 'choffice' && p.f.chPolRegister && !p.f.chPolConsult) { savedCheckChPol = await saveReload(); continue; }\n",
    "    if (CH && !savedCheckChPol && p.map === 'choffice' && p.f.chPolRegister && !p.f.chPolConsult) { savedCheckChPol = await saveReload(); continue; }\n"
    "    if (CH && !savedCheckChRep && p.map === 'choffice' && p.f.chRepDrillA && !p.f.chRepDrillB) { savedCheckChRep = await saveReload(); continue; }\n")
rep("saveReloadPolicy: savedCheckChPol,", "saveReloadPolicy: savedCheckChPol, saveReloadReport: savedCheckChRep,")
rep("      noHorizontalScroll: hscroll.sw <= hscroll.iw, hscroll, seriesCharter:",
    "      report: ch && ch.rep && { sent: ch.rep.sent && ch.rep.sent.picks, grade: ch.rep.grade && { lines: ch.rep.grade.lines, score: ch.rep.grade.score, claims: ch.rep.grade.claims, required: ch.rep.grade.required, decide: ch.rep.grade.decide, weak: ch.rep.grade.weak, omitted: ch.rep.grade.omitted }, needs: ch.rep.needs, directive: ch.rep.directive, board: ch.rep.board, dojo: ch.rep.dojo, minute: ch.rep.minute },\n"
    "      noHorizontalScroll: hscroll.sw <= hscroll.iw, hscroll, seriesCharter:")
rep("    // The systemic invariant (Charter slice-3 review): six checkpoints (three minutes, three district ends), none with a finding.\n    const audOk = ch && Array.isArray(ch.audit) && ch.audit.length === 6 && ch.audit.every(a => !a.bad.length);",
    "    // The systemic invariant (Charter slice-3 review; slice 4 adds the report's minute and district end): eight checkpoints\n    // (four minutes, four district ends), none with a finding.\n    const audOk = ch && Array.isArray(ch.audit) && ch.audit.length === 8 && ch.audit.every(a => !a.bad.length);")
rep("    process.exit(errors.length || requests.length || !savedCheckCh",
    "    const rep = ch && ch.rep;\n    const repOk = rep && rep.sent && rep.grade && fin.metrics.chRepClaims === 100 && fin.metrics.chRepRequired === 100 && fin.metrics.chRepDecide === 100 && rep.grade.score === 100 && !rep.grade.weak.length && !rep.grade.omitted.length && rep.grade.lines <= 10 && fin.f.chRollingHitch && rep.needs.met === 3 && !!rep.minute;\n"
    "    process.exit(errors.length || requests.length || !savedCheckChRep || !savedCheckChRep.restored || !savedCheckChRep.exportRoundTrip || !fin.extra.chRepSummary || ser.editions.charter.report !== true || !repOk || !savedCheckCh")
rep("// the directive, the policy library, the terminals, the Policy round) to its summary, with a save/reload mid-Policy; it\n// checks the series record, the acceptances, the supplier and policy scorecards and the register.\n",
    "// the directive, the policy library, the terminals, the Policy round) to its summary, with a save/reload mid-Policy, then\n// District 4, the Board report (the drills, the quarter's records, the directive, the terminals, the report sent as\n// recommended, the members' questions) to its summary, with a save/reload mid-report; it checks the series record, the\n// acceptances, the supplier, policy and report scorecards, the register and the invariant at all eight checkpoints.\n")
open(p,'w',encoding='utf-8').write(s)
print('bot patched')
