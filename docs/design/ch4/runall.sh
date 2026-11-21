#!/bin/bash
cd /home/claude/uptime
L=/home/claude/uptime/docs/design/ch4/logs/full
mkdir -p $L; export UPTIME_OUT=/tmp/uptime-out-full; mkdir -p $UPTIME_OUT
run() { n=$1; shift; s=$(date +%s); "$@" > $L/$n.log 2>&1; echo "$n exit $? $(( $(date +%s)-s ))s" >> $L/summary.txt; }
: > $L/summary.txt
for t in frontdesk mailroom clerks market records basement server water council quiet crossroads charter layout modalfit highlight doors sprites settings tells; do run $t node tests/$t.js; done
run highlight-charter env UPTIME_EDITION=charter node tests/highlight.js
run doors-crossroads env UPTIME_EDITION=crossroads node tests/doors.js
run doors-charter env UPTIME_EDITION=charter node tests/doors.js
run lentell node tools/lentell.js
run tells2 node tools/tells2.js
run bot-th node tests/bot.js desktop $UPTIME_OUT/bth
run bot-crm env UPTIME_EDITION=crossroads TRACK=manager node tests/bot.js desktop $UPTIME_OUT/bcrm
run bot-crd env UPTIME_EDITION=crossroads TRACK=dfir node tests/bot.js desktop $UPTIME_OUT/bcrd
run bot-ch env UPTIME_EDITION=charter node tests/bot.js desktop $UPTIME_OUT/bch
run bot-gamer env GAMER=1 node tests/bot.js desktop $UPTIME_OUT/bgamer
echo "DESKTOP DONE" >> $L/summary.txt
