p='/home/claude/uptime/tests/tells.js'; s=open(p,encoding='utf-8').read()
def rep(old,new):
    global s
    assert s.count(old)==1, old[:90]
    s=s.replace(old,new)
rep("/^policy-/.test(b) ? 'ch-policy' : 'ch-prologue'; if (f.startsWith('editions/crossroads/'))", "/^policy-/.test(b) ? 'ch-policy' : /^report-/.test(b) ? 'ch-report' : 'ch-prologue'; if (f.startsWith('editions/crossroads/'))")
rep("const push = (n, kind, items) => lists.push({file: f, line: n.loc.start.line, key: kind, type: listType(top, key, kind), items});",
    "const push = (n, kind, items) => lists.push({file: f, line: n.loc.start.line, key: kind, type: listType(top, key, kind), top: top, items});")
rep("const CH_DISTRICTS = ['ch-prologue', 'ch-budget', 'ch-suppliers', 'ch-policy'];", "const CH_DISTRICTS = ['ch-prologue', 'ch-budget', 'ch-suppliers', 'ch-policy', 'ch-report'];")
rep("  ['Charter: source scan found graded lists in the prologue, Budget, Suppliers and Policy (' + chGraded.length",
    "  ['Charter: source scan found graded lists in the prologue, Budget, Suppliers, Policy and the Board report (' + chGraded.length")
old = "  ['Charter: no lone-feature tell (the same rule as Crossroads); strongest leans: '"
rep(old, "  ['Charter: the Board report’s rows (CH_REP_ROWS, the lines the scorecard grades) are scanned: ' + chRepRowLists.length + ' lists, of ' + chRepRowCount + ' rows in the source, each with exactly one supported wording', chRepRowCount > 0 && chRepRowLists.length === chRepRowCount && chRepRowLists.every(L => L.items.filter(x => x.good).length === 1)],\n" + old)
anchor = "const chLf = CH_DISTRICTS.concat(['ch-all']).map(s => ({s, rows: loneFeatures(chListsIn(s), true)}));"
rep(anchor, anchor + "\n// The Board report's rows (since Charter slice 4): every row's wordings are a scored list, so each must be in the scan.\nconst chRepSrc = fs.existsSync(root + '/editions/charter/report-data.js') ? fs.readFileSync(root + '/editions/charter/report-data.js', 'utf8') : '';\nconst chRepRowCount = ((chRepSrc.split('const CH_REP_ROWS')[1] || '').split('\\n];')[0].match(/^  \\{id: '/gm) || []).length;\nconst chRepRowLists = chGraded.filter(L => L.top === 'CH_REP_ROWS' && /report-data\\.js$/.test(L.file));")
old="// (G:policy) groups held in Policy and across Charter, and the Library's Director by name (N:Strand).\n"
rep(old, old+"// Since slice 4 (District 4, the Board report: report-*.js, district ch-report) the same rules hold there, and the\n// report's rows (CH_REP_ROWS: each row's wordings, the lines the scorecard grades) are checked to be in the scan.\n")
open(p,'w',encoding='utf-8').write(s)
print('tells patched')
