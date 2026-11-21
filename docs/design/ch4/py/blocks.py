D='/home/claude/uptime/docs/design/ch4/py/'
p='/home/claude/uptime/tests/charter.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1, a[:90]
    s=s.replace(a,b)
A=open(D+'blockA.js',encoding='utf-8').read(); R=open(D+'blockR.js',encoding='utf-8').read()
anchor = "\n\n  // ======== The systemic invariant (decision 2 of the slice-3 review) ========"
rep(anchor, "\n" + A + anchor)
rep("  check('invariant, override and poor-advice run: six checkpoints (the three Board minutes and the three district ends, Days 67, 74 and 81), none with a finding',\n    Array.isArray(qAud) && qAud.length === 6 && qAud.every(a => !a.bad.length) && qAud.map(a => a.day).join() === '67,67,74,74,81,81', qAud);",
    "  check('invariant, override and poor-advice run: eight checkpoints (the four Board minutes and the four district ends, Days 67, 74, 81 and 88), none with a finding',\n    Array.isArray(qAud) && qAud.length === 8 && qAud.every(a => !a.bad.length) && qAud.map(a => a.day).join() === '67,67,74,74,81,81,88,88', qAud);")
rep("const src = [objective, supObjective, polObjective].map(f => f.toString()).join('\\n'), chain = [];", "const src = [objective, supObjective, polObjective, repObjective].map(f => f.toString()).join('\\n'), chain = [];")
rep("    [/Hawser Badge/, 'chSupBoard'], [/Ballast Badge/, 'chBoard'], [/upgrade is funded|upgrade waits a year/, 'chBoard']];",
    "    [/Hawser Badge/, 'chSupBoard'], [/Ballast Badge/, 'chBoard'], [/upgrade is funded|upgrade waits a year/, 'chBoard'],\n"
    "    // The Board report (slice 4): each drill's outcome, the directive's, the page in the papers (17:00), the badge.\n"
    "    [/that is what the records say, so that is the line|My MFA line is corrected/, 'chRepDrillA'], [/My supplier line is changed|one measure, where it stands/, 'chRepDrillB'], [/My draft line is changed/, 'chRepDrillC'],\n"
    "    [/One line, with the minute’s reference\\. Your page/, 'chRepDirective'], [/Your report is in the papers/, 'chRepSent'], [/The members have your page/, 'chRepDay87'], [/Rolling Hitch/, 'chRepBoard']];")
rep("    qEarly.chain.length > 40 && qEarly.lines.length > 200 && !qEarlyBad.length &&", "    qEarly.chain.length > 55 && qEarly.chain.includes('chRepDay87') && qEarly.lines.length > 250 && !qEarlyBad.length &&")
anchor2 = "    check('recommended run: no console errors or network requests', !R.errors.length && !R.requests.length, { e: R.errors, r: R.requests });"
rep(anchor2, R + anchor2)
open(p,'w',encoding='utf-8').write(s)
print('blocks ok')
