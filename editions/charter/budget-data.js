/* ============================================================
   UPTIME · editions/charter/budget-data.js
   Charter district 1: Budget (Days 64 to 67). The register's six lines and
   their options (cost, the risk left, what it buys), three drills whose
   evidence is records, the Compact Board's budget round, the Risk & Budget
   terminals, and the directive (an owner asks the CISO to sign her acceptance).
   One decider per decision: the Board decides the budget; each line's business
   owner signs any acceptance for it; Edda decides for the shared services; each
   member decides for itself; counsel decides legal questions; the CISO advises,
   keeps the register and writes each acceptance up.
   Every price, rating, count, time, account and quote is invented (game). The
   recalled Crossroads facts are quoted from Crossroads (charter-timeline.md).
   Real facts: CREDITS.md, section "Charter". Timeline: scratchpad
   charter-timeline.md; every line here is checked against it.
   ============================================================ */
'use strict';

const CH_BUDGET = 480;            // $k for next year's programme lines (game)
const CH_REVIEW_DAY = 155;        // the Board's next quarterly meeting, a Monday
const CH_EXPIRY_DAY = 428;        // next year's budget round, a Monday

/* ---------- The register's six top lines (game). rank 1 = highest; the top five are ranks 1-5 ---------- */
const CH_LINES = [
  {id: 'R1', name: 'Vendor support by hand', cat: 'privacy', catName: 'Data privacy', owner: 'Edda Thornquist', rank: 5, rec: 2,
   interim: 'each member enables vendor support by hand per ticket, as now.',
   opts: [{cost: 0, res: 'Medium', what: 'As now: each member enables vendor support by hand, per ticket; the logs sit in four places.'},
          {cost: 70, res: 'Medium', what: 'Quote A: three members, sessions kept 30 days. Short of the requirement, so the risk stays where it is.'},
          {cost: 110, res: 'Low', what: 'Quote B: all four members, MFA for every vendor user, sessions kept 13 months.'}]},
  {id: 'R2', name: 'Service accounts unreviewed', cat: 'avail', catName: 'Service availability', owner: 'Edda Thornquist', rank: 3, rec: 1,
   interim: 'Beatriz reads the 38 accounts’ sign-ins each month, and anything new goes to Edda.',
   note: 'svc-print stays outside this review, under Rae’s plan.',
   opts: [{cost: 0, res: 'High', what: 'As now: 38 Compact service accounts, none reviewed since svc-fileops was replaced.'},
          {cost: 60, res: 'Medium', what: 'One review: each account split to the member it serves, and its rights cut to what it uses.'},
          {cost: 90, res: 'Low', what: 'That review, then a review with each member every quarter.'}]},
  {id: 'R3', name: 'One restore space', cat: 'avail', catName: 'Service availability', owner: 'Edda Thornquist', rank: 4, rec: 2,
   interim: 'checked restores go on, one member at a time, on the one test server.',
   opts: [{cost: 0, res: 'High', what: 'As now: one test server holds one member’s copies at a time, for checking before a restore.'},
          {cost: 40, res: 'Medium', what: 'A second test server: two members checked in the same week.'},
          {cost: 80, res: 'Low', what: 'An isolated restore space, sized for every member at once.'}]},
  {id: 'R4', name: 'Payment fraud by email', cat: 'fin', catName: 'Financial', owner: 'Oriel Fanshawe', rank: 6, rec: 1,
   interim: 'a call-back on a known number before any bank detail changes.',
   opts: [{cost: 0, res: 'Medium', what: 'As now: fin-ap, the shared accounts-payable mailbox, excepted from MFA; no call-back rule.'},
          {cost: 20, res: 'Low', what: 'Named finance mailboxes with MFA, a scanner that supports it, and a call-back rule.'}]},
  {id: 'R5', name: 'The 911 center’s own segment', cat: 'safety', catName: 'Safety-of-life services', owner: 'Celia Marrow', rank: 1, rec: 1,
   interim: '',
   note: 'Celia’s decision on the Dispatch week: “The center keeps its own segment and its own sign-in … Review at the next budget.”',
   opts: [{cost: 0, res: 'High', what: 'The center folds back onto the county’s general network, as before the Dispatch week.'},
          {cost: 120, res: 'Low', what: 'The Compact’s share of running the center’s own segment and its own sign-in.'}]},
  {id: 'R6', name: 'Platform out of support', cat: 'avail', catName: 'Service availability', owner: 'Edda Thornquist', rank: 2, rec: 1,
   interim: '',
   note: 'Oriel’s figures: $90k now and $250k next year is $340k for the same platform; $250k now saves $90k.',
   opts: [{cost: 0, res: 'High', what: 'As now: the shared-services platform leaves its vendor’s support next year.'},
          {cost: 90, res: 'Medium', what: 'One more year of the vendor’s support. The upgrade waits a year.'},
          {cost: 250, res: 'Low', what: 'The upgrade, in full: Edda’s request.'}]}];

/* ---------- Drills (Day 65, Tuesday). Records are the evidence; two decisive sources each ---------- */
const CH_DRILLS = {
  mfaclaim: {
    id: 'mfaclaim', title: '“MFA on every sign-in”', budget: 3,
    intro: '<p>Edda’s request, filed with Oriel on Friday (Day 61), asks for the platform upgrade in full and says the identity line can wait a year. Beatriz exported the records at 08:40. Is the request’s claim true as written?</p>',
    artefact: '<pre class="art">Request · the shared-services platform (Day 61, game data)\n' +
      'Ask        $250k: the upgrade, in full\n' +
      'Identity   can wait a year:\n' +
      '           “MFA is on for every sign-in\n' +
      '            to the shared services.”</pre>' +
      '<p class="small">The sign-in policy says who must use MFA and who is excepted; the sign-in records say what happened.</p>',
    question: 'Is “MFA is on for every sign-in to the shared services” true?',
    sources: [
      {id: 'word', name: 'Edda’s word', qs: [
        {q: 'Is she sure of it?', kind: 'trap', res: ['“Everyone has MFA. We turned it on for every account last year.”', '(Honest, and from memory. The records decide it.)']}]},
      {id: 'sheet', name: 'The MFA product’s datasheet', qs: [
        {q: 'Can it require MFA for every sign-in?', kind: 'trap', res: ['“Supports MFA for every sign-in, for every user.”', '(What it can do, not what the policy makes it do.)']}]},
      {id: 'policy', name: 'The sign-in policy and its exceptions (08:40 export)', qs: [
        {q: 'Who is excepted from MFA, and since when?', kind: 'focus', key: true,
         res: ['Policy: MFA for every account in the shared directory, except the group MFA-Exempt', 'MFA-Exempt, 8 accounts: six Compact service accounts; fin-ap, the finance office’s shared accounts-payable mailbox; board-display, the Board room’s display PC', 'No exception has an expiry or an owner recorded']},
        {q: 'Every setting in the policy, in full', kind: 'broad', rows: 860,
         wall: ['{t}  setting {i}  session lifetime {n} min', '{t}  setting {i}  allowed method: app', '{t}  setting {i}  named location {n}']}]},
      {id: 'signins', name: 'The shared directory’s sign-in records (30 days to 08:00)', qs: [
        {q: 'Did any excepted account sign in without MFA, and from where?', kind: 'focus', key: true,
         res: ['fin-ap: 212 interactive sign-ins without MFA, all from the finance office’s three PCs', 'board-display: 40, from the Board room’s PC', 'The six service accounts: non-interactive sign-ins only, from their own servers']}]}
    ],
    verdicts: [
      {label: 'Not true: two accounts people use are excepted, and were used 252 times without MFA', good: true, needs: ['policy', 'signins'],
       needsWhy: 'the answer rests on two records: the policy’s exceptions and the sign-in records. You read only one of them.',
       why: 'The policy excepts eight accounts; the records show two of them used by people, without MFA, 252 times in 30 days.'},
      {label: 'True as written: the policy turns MFA on for each account in the shared directory', why: 'For every account but eight. The exceptions list is part of the policy.'},
      {label: 'Not true, and the 6 service accounts are a breach in progress: disable them today', why: 'Nothing in these records shows misuse, and the service accounts sign in from their own servers. Each exception needs an owner and an expiry.'}],
    reasons: [
      {label: 'The exceptions name them, and the directory’s log shows two used without MFA', good: true, why: 'The policy’s own list, and what happened over 30 days.'},
      {label: 'The datasheet says MFA works for any user, so any gap that is left must be a small one', why: 'A datasheet says what a product can do, not what the policy does.'},
      {label: 'Edda says that everyone has MFA, and she owns the shared services', why: 'An honest memory is not a record.'}],
    alts: [
      {label: 'The two accounts used MFA despite the exception', good: true, why: 'Ruled out: the sign-in records show 252 sign-ins without MFA.'},
      {label: 'The six service accounts are people’s accounts', good: true, why: 'Ruled out: their sign-ins are non-interactive, from their own servers.'},
      {label: 'The datasheet is out of date for this version of the product', why: 'Beside the point: the policy and the records decide it.'},
      {label: 'Edda knew of the gap and left it out', why: 'Nothing points to it: an honest claim, from memory.'}],
    path: '<p>“Is the claim true?” is decided by <b>the sign-in policy’s exceptions</b> and <b>the sign-in records</b>. A datasheet says what a product can do, and a person’s memory says what they believe. The records say what the policy does and what happened.</p>',
    response: ['Edda corrects her request’s line before the papers go out: her paper, her decision', 'fin-ap goes to its owner, Oriel: named mailboxes with MFA, in line R4', 'board-display gets an owner (Edda) and an expiry', 'The six service accounts keep their exception, each with an owner and an expiry'],
    techs: [], acts: ['chclaim']
  },
  nightline: {
    id: 'nightline', title: 'The night-cover line', budget: 3,
    intro: '<p>This year’s night-cover line paid for the members’ night thresholds paging the Compact’s on-call lead, and for the rota’s overtime (game). It was meant to cut the time from the first encrypted file to someone acting. Oriel asks before she prices it again: did it?</p>',
    artefact: '<pre class="art">Night-cover line (this year, game data)\n' +
      'Meant to   cut the time from the first\n' +
      '           encrypted file to someone acting\n' +
      'Next year  the same again</pre>' +
      '<p class="small">Edda keeps the Compact’s incident log and its change record.</p>',
    question: 'Did the night-cover line cut the time from the first encrypted file to someone acting?',
    sources: [
      {id: 'spend', name: 'The line’s spend report', qs: [
        {q: 'What did it buy this year?', kind: 'trap', res: ['Pages sent: 41. Overtime: within its budget.', '(Activity, not the outcome it was meant to move.)']}]},
      {id: 'thanks', name: 'The members’ notes of thanks', qs: [
        {q: 'Are the members pleased with it?', kind: 'trap', res: ['Three notes thanking the on-call leads for night calls.', '(Goodwill, not a measure.)']}]},
      {id: 'log', name: 'The Compact’s incident log', qs: [
        {q: 'The first encrypted file, and the first act: the Airport’s Saturday and Night 33', kind: 'focus', key: true,
         res: ['The Airport, Day 27: files encrypted 05:52–06:20; the note found at the front desk 07:40; ap-admin disabled 08:10', 'Night 33: files encrypted 02:31–02:40; the page 02:35; svc-fileops disabled 02:41']},
        {q: 'Every entry in the log this year', kind: 'broad', rows: 1120,
         wall: ['Day {i}  {t}  page  member {n}', 'Day {i}  {t}  ticket closed', 'Day {i}  {t}  night threshold: no page']}]},
      {id: 'changes', name: 'The change record between those two nights', qs: [
        {q: 'What else changed between Day 27 and Night 33?', kind: 'focus', key: true,
         res: ['Day 31: the Airport’s night threshold with the Compact, in writing (its office alerts had none before)', 'Day 31: the operations room opens', 'In force on Night 33: Edda’s runbook. A service account seen encrypting is disabled at once by the on-call lead']}]}
    ],
    verdicts: [
      {label: 'For these two nights, yes: the first look fell from 108 minutes to 4, the runbook helping', good: true, needs: ['log', 'changes'],
       needsWhy: 'the answer rests on two records: the log’s times and what else changed between the nights. You read only one of them.',
       why: 'Nobody acted at the Airport for 108 minutes; on Night 33 the page came 4 minutes in. The 6 minutes to the disable rest on the runbook as well, and two nights are a sample.'},
      {label: 'Yes, and the paging did it alone, and the line should be twice the size next year', why: 'The disable rested on the runbook too, and two nights are a sample, not a trend.'},
      {label: 'No: three shares were still encrypted on Night 33, and the line bought no change at all', why: 'The log shows a page 4 minutes in and the account off 10 minutes in, against 108 minutes before anyone looked at the Airport.'}],
    reasons: [
      {label: 'The log gives both times: the change record shows what else changed between them', good: true, why: 'The measure before and after, and the other causes.'},
      {label: 'Forty-one pages went out this year, which proves the line was used and needed', why: 'Use is activity. The question was the time to act.'},
      {label: 'The members wrote three notes to thank the on-call leads for their night calls this year', why: 'Thanks are goodwill, not a measure.'}],
    alts: [
      {label: 'The runbook, not the page, made Night 33 fast', good: true, why: 'Weighed, and named in the verdict: the page brought the lead in at 02:35, and the runbook let them disable at 02:41.'},
      {label: 'Night 33 was a different kind of night', good: true, why: 'Weighed, and named: other accounts and other members. Two nights are a sample, not a trend.'},
      {label: 'The pages went to the wrong lead', why: 'Nothing points to it: the lead disabled the account at 02:41.'},
      {label: 'The Airport’s clock was wrong that morning', why: 'Nothing points to it: both times come from the same log.'}],
    path: '<p>“Did the spend work?” is decided by <b>the measure before and after</b> and <b>what else changed in between</b>. A spend report counts activity, and thanks count goodwill. Neither is the outcome.</p>',
    response: ['Oriel’s paper says what the log shows: the first look fell from 108 minutes to 4 on these two nights', 'The runbook is credited beside the paging', 'Measure it again at each incident: two nights are a sample'],
    techs: [], acts: ['chmeasure']
  },
  quotes: {
    id: 'quotes', title: 'Two quotes for R1', budget: 3,
    intro: '<p>Two quotes for R1’s gateway reached Oriel on Friday (Day 61). Which one covers the requirement? The price comes after.</p>',
    artefact: '<pre class="art">R1 · vendor support by hand at four members\n' +
      'Quote A    $70k (game data)\n' +
      'Quote B    $110k (game data)</pre>' +
      '<p class="small">The register holds R1’s requirement; each quote has a scope schedule.</p>',
    question: 'Which quote covers R1’s requirement?',
    sources: [
      {id: 'price', name: 'The two prices', qs: [
        {q: 'Which is the cheaper one?', kind: 'trap', res: ['Quote A, by $40k.', '(What you pay, not what you get.)']}]},
      {id: 'brochure', name: 'The suppliers’ brochures', qs: [
        {q: 'Which supplier sounds stronger?', kind: 'trap', res: ['Both: “trusted by public bodies”.', '(Marketing, not scope.)']}]},
      {id: 'req', name: 'R1’s requirement (the register)', qs: [
        {q: 'What must the gateway do?', kind: 'focus', key: true,
         res: ['One way in for vendor support at the Library, the Clinic, Dispatch and the Airport', 'Off until a member’s ticket opens it; MFA for every vendor user', 'Every session recorded and kept 12 months']}]},
      {id: 'scope', name: 'The two quotes’ scope schedules', qs: [
        {q: 'What does each quote cover?', kind: 'focus', key: true,
         res: ['Quote A: the Library, the Clinic, the Airport; on demand per ticket; MFA for every vendor user; sessions kept 30 days. Dispatch: not in scope, priced on request', 'Quote B: all four members; on demand per ticket; MFA for every vendor user; sessions kept 13 months']},
        {q: 'Every page of both quotes', kind: 'broad', rows: 96,
         wall: ['Quote {i}  page {n}  terms', 'Quote {i}  page {n}  references', 'Quote {i}  page {n}  pricing notes']}]}
    ],
    verdicts: [
      {label: 'Quote B: it covers all four members and a year of vendor sessions. A covers neither', good: true, needs: ['req', 'scope'],
       needsWhy: 'the answer rests on two records: the requirement and the quotes’ scope. You read only one of them.',
       why: 'Line by line, only B covers all four members and keeps a year of sessions.'},
      {label: 'Quote A covers it, at $40k less, and Dispatch can be added to it at a later date', why: 'Priced on request is a cost nobody knows, and 30 days of sessions is short of 12 months either way.'},
      {label: 'Both cover it: each has MFA for each user and opens on a ticket, which is what counts', why: 'That is two lines of four. Quote A misses Dispatch and the year of sessions.'}],
    reasons: [
      {label: 'Line by line against the requirement, only B has all four members and a year', good: true, why: 'The requirement, then each quote’s scope.'},
      {label: 'Quote A is cheaper, and cheaper leaves more money for the other lines in the budget', why: 'Cheaper for less cover is not a saving on R1.'},
      {label: 'Both suppliers have a record of public bodies trusting them', why: 'Marketing, not scope.'}],
    alts: [
      {label: 'A’s Dispatch add-on could close the gap', good: true, why: 'Ruled out for now: it is priced on request, and A’s 30 days of sessions stays short.'},
      {label: 'The requirement asks for more than R1 needs', good: true, why: 'Weighed: the register wrote it for R1, and the Board approved a Low privacy appetite on Monday.'},
      {label: 'Company B is the bigger one', why: 'Beside the point: size is not scope.'},
      {label: 'Quote B’s price will rise sharply next year, after the first year', why: 'Nothing in the quote says so.'}],
    path: '<p>“Which quote covers it?” is decided by <b>the requirement</b> and <b>each quote’s scope</b>, line by line. The price comes after: a cheaper quote that covers less buys less.</p>',
    response: ['R1’s options in the allocation: Quote B at $110k brings it to Low', 'Quote A stays on file at $70k: it leaves R1 where it is', 'Supplier A is asked for Dispatch’s price and a year of sessions, for the record'],
    techs: [], acts: ['chquote']
  }
};

/* ---------- The directive (game; Day 66 11:30): Joanna asks you to sign her acceptance ---------- */
const CH_DIRECTIVE = [
  {label: 'Yours to sign, since it’s your airport: I’ll write it up with you', good: true},
  {label: 'Sign it for her: you understand the risk better than she does, and she asked', why: 'Understanding it isn’t owning it. Her airport, her risk, her signature; you write it up with her.'},
  {label: 'Refuse it outright: a trust between directories is never acceptable', why: 'An absolute with a price nobody has counted. She decided to keep it; the acceptance records how and until when.'},
  {label: 'Send it to the Board to sign as the owner of last resort, so the airport isn’t on the hook', why: 'The Board sees every acceptance. Its owner signs it: Joanna.'},
  {label: 'Sign it, and keep it off the register: it would only alarm the members', why: 'An acceptance the Board can’t see isn’t one. It goes on the register, signed by its owner.'}];

/* ---------- The Risk & Budget terminals (Oriel; three puzzles) ---------- */
const CH_DOJO = [
  {q: 'A line is High before a fix and Medium after it. What is the Medium?',
   opts: ['The residual risk: what is left after the fix is in place',
          'The inherent risk: what the line would be with no fix in place',
          'The fix’s cost, written as a rating to compare with other lines'], good: 0,
   explain: 'Residual is what is left. The appetite says how much of it the Board will carry.'},
  {q: 'Fix A costs $70k and leaves a line where it was. Fix B costs $110k and brings it within appetite. Which costs less?',
   opts: ['B: A spends $70k and changes nothing in the risk that is left',
          'A: it is $40k cheaper, and the saving can go to another line',
          'Neither: a fix that costs money is never worth it on a quiet line'], good: 0,
   explain: 'Cost per unit of risk reduced. Spending for no change is the dearest choice.'},
  {q: 'A line stays above appetite. Who signs the acceptance?',
   opts: ['Its business owner, as the risk is theirs, with an expiry and a review',
          'The CISO, who owns the register and understands the risk best',
          'The company whose product carries the risk, under its terms'], good: 0,
   explain: 'The owner decides about the owner’s risk. The CISO writes it up and keeps it on the register.'}];

/* ---------- The Compact Board's budget round (Day 67 14:00; Ivor Penhallow; three rounds) ---------- */
const CH_BOARD_SPECS = () => [
  {title: 'Round 1: two asks, one budget', who: 'Ivor Penhallow',
   ask: '“Two asks for one budget: yours, and Edda’s upgrade. How do we choose?”',
   resp: [{label: 'Both, laid out alike against Monday’s appetite: cost and risk left. You decide', good: true},
          {label: 'Fund security first: an incident would cost the members more than any appetite allows', why: 'Perhaps. Show it line by line against the appetite, and let the Board weigh it.'},
          {label: 'Fund Edda’s first: availability is what your members feel each day', why: 'The Board asked for your advice, laid out beside hers. It decides.'},
          {label: 'Split the money evenly between the two asks, so neither side loses', why: 'Half of each can leave both above appetite. Show what each choice buys.'}]},
  {title: 'Round 2: the cost of the upgrade', who: 'Ivor Penhallow',
   ask: '“If we fund Edda’s upgrade in full, what does it cost us?”',
   resp: [{label: 'The deferred lines go above Monday’s appetite for a year: each owner signs. Edda’s plan saves $90k', good: true},
          {label: 'Nothing that matters: the platform comes first, and the register’s other lines can wait their turn', why: 'They can wait only above the appetite the Board set. Say which, and who signs.'},
          {label: 'Every member’s security, for a year, since no line should go above the appetite', why: 'The Board may choose to. Say what it costs, line by line, and who signs.'},
          {label: 'A breach within 12 months: you can promise the members that much', why: 'Nobody can promise that. Say what each line leaves, against the appetite.'}]},
  {title: 'Round 3: who signs', who: 'Ivor Penhallow',
   ask: '“Will you sign those acceptances for us, as our CISO?”',
   resp: [{label: 'Their owner signs each, not me, so I record it for the Board with a review date', good: true},
          {label: 'Yes: you know these risks better than anyone else in the room', why: 'Knowing a risk isn’t owning it. The owner signs; you write it up.'},
          {label: 'The Board signs them all, as the owner of the whole programme', why: 'The Board sees each one. The owner, who carries the risk, signs it.'},
          {label: 'None is needed: once the Board has decided, the appetite has moved', why: 'A decision leaves a risk. The acceptance says whose it is and until when.'}]}];
