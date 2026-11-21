#!/bin/bash
cd /home/claude/uptime
L=/home/claude/uptime/docs/design/ch4/logs/full; export UPTIME_OUT=/tmp/uptime-out-full
echo "other bots before phone: $(pgrep -af 'node tests/bot' | wc -l)" >> $L/summary.txt
run() { n=$1; shift; s=$(date +%s); "$@" > $L/$n.log 2>&1; echo "$n exit $? $(( $(date +%s)-s ))s" >> $L/summary.txt; }
run phone-th node tests/bot.js phone $UPTIME_OUT/pth
run phone-crm env UPTIME_EDITION=crossroads TRACK=manager node tests/bot.js phone $UPTIME_OUT/pcrm
run phone-crd env UPTIME_EDITION=crossroads TRACK=dfir node tests/bot.js phone $UPTIME_OUT/pcrd
run phone-ch env UPTIME_EDITION=charter node tests/bot.js phone $UPTIME_OUT/pch
echo "PHONE DONE" >> $L/summary.txt
