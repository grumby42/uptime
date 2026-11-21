p='/home/claude/uptime/tests/charter.js'; s=open(p,encoding='utf-8').read()
def rep(a,b):
    global s
    assert s.count(a)==1, a[:90]
    s=s.replace(a,b)
rep("// partial control; document owners; POL-1's review date in the minute; the scored write-ups; the Sheet Bend Badge.\n",
"// partial control; document owners; POL-1's review date in the minute; the scored write-ups; the Sheet Bend Badge.\n"
"// District 4, the Board report (slice 4): the report built from the player's own records (on the override and poor-advice\n"
"// run: R2 and R3 above appetite by the Board's decision, Inkmere C1 left out, EX-04 the Board's under 6.3; on the\n"
"// recommended run: none of these, the upgrade back at the next budget cycle); the claim grades (each row one supported\n"
"// wording, the weak ones unsupported, overstated or misplaced); the omission and length penalties (a dull report beats a\n"
"// flashy one with an omission); the metrics on the report as sent; the records' times before the report's; the drills\n"
"// (one played from one source, unsupported; who accepted R2 and R3 read from the minute and the acceptances on each\n"
"// path); the directive's false start; the members' questions keyed to the report as sent (the omission first, then the\n"
"// misplaced lines) and the minute's corrections; the Rolling Hitch Badge; the summary (\"Next: The finale\"); the Quiet\n"
"// Thread as one open item with no conclusion; GV.OV-01 and GV.OV-03 word for word; the invariant at all eight\n"
"// checkpoints, with the report's required rows read against the records (rules and records agree), and its failures\n"
"// re-created and caught; the outcome-rule NPC test over the report week too.\n")
rep("qPS2.ser.policy === true && qPS2.obj.done && /^Policy done\\. Next: The Board report\\.$/.test(qPS2.obj.text) &&",
    "qPS2.ser.policy === true && !qPS2.obj.done && /^Next week, Monday: your desk\\.$/.test(qPS2.obj.text) &&")
rep("with the unscored register line; the series records Policy; the objective done; the earlier saves byte-for-byte as seeded',",
    "with the unscored register line; the series records Policy; the objective moves on to the Board report; the earlier saves byte-for-byte as seeded',")
open(p,'w',encoding='utf-8').write(s)
print('hdr ok')
