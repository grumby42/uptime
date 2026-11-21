# Uptime — career ladder beyond "security team lead" (design spec)

Spec written 2026-11-01 (UTC). Research only: the repo (/home/claude/uptime-repo) was read, not edited. Inputs read: README.md, CREDITS.md (Frameworks, Council Chambers and its NICE / CSF lines), SPEC_council.md, council-timeline.md, BACKLOG.md (the 2026-10-29 "Career ladder beyond Tier 3" item), engine/drill.js (`needs`), council-data.js (delegation leads).

Labels used below:
- **(game design)**: my proposal, not from any source.
- **Quoted text** is verbatim from the source named, checked on 1 November 2026 with WebFetch. Some long statements were read in pieces by the fetch tool; "..." marks where a quotation is cut, never where words were changed.
- Every URL is listed again in **Sources** at the end.

---

## 0. Where the series stands

Town Hall's ranks so far: Intern → Tier 1 (Front Desk) → Tier 2 (Clerks' Row) → Tier 3 senior analyst (IT Basement) → Tier 3 lead investigator (Server Room) → **Security team lead** (Council Chambers, the finale). The finale already teaches: a one-page IR plan mapped to SP 800-61 Rev. 3's example roles, a risk register with business owners (CSF 2.0 Govern), the delegation mini-game (eight leads, each with skills, a load and a capacity of 3), plain-words council briefings, the road-budget directive, and incident command. The Quiet Thread's suspicion file has been handed to the town attorney, the council's risk committee and **an outside incident-response firm (game)**, and is still open. SPEC_council.md says the ladder beyond team lead is "NOT built here (separate backlog item)". This document is that item's design spec.

### NICE Framework version used here
- **Version used here: 2.0.0**, the NICE Framework version the CISA NICCS role and task pages show (corrected 21 November 2026 in the Charter finale build; this line said v2.2.0 before). Every role and task below is quoted as NICCS shows it. NIST has published later component releases (v2.1.0, 3 December 2025; v2.2.0, 28 April 2026, per NIST's "Current Version" page and news release); their summaries of changes list no change to the roles and tasks cited here, and nothing below is quoted from them. The structure document is still NIST SP 800-181 Rev. 1 (November 2020).
- **What NIST's later releases changed** (change log, for reference only): v2.2.0 added one work role, "Cybersecurity Supply Chain Risk Management (C-SCRM) Work Role (OG-WRL-017)". v2.1.0 (3 December 2025) made a "Comprehensive revision of Cybercrime Investigation (IN-WRL-001)". v2.0.0 (5 March 2025) added DD-WRL-009 and removed the Cyberspace Effects and Cyberspace Intelligence categories. No change log entry renames or retires a role used below.
- **How it was checked:** work-role **IDs and names** were checked against NIST's work-role list (nist.gov, NICE Framework work role videos page). Role **descriptions and task statements** were read from the CISA NICCS pages for each role and task. Its role pages say "Version: 2.0.0", the version this document uses (some task pages show another number, or none, and its NICE landing page says Components v1.0.0). NIST's change log records no change after v2.0.0 to the roles cited here. Each task the editions quote is re-read on its own NICCS page before use and logged in CREDITS.md with the version NICCS shows.
- Minor source quirk: the NIST videos page prints "Incident Response" against both PD-WRL-003 and PD-WRL-004. PD-WRL-004 is Infrastructure Support (its description on that page is about infrastructure). This document does not use PD-WRL-004.

### Plain caveats that apply to every rung
- **Titles vary by organisation.** "SOC lead", "IR manager", "principal DFIR consultant", "CISO", "vCISO", "fractional CISO" and "CIO" are job titles. NICE work roles describe *groupings of work*, not titles. One person often covers several roles and one role is often split across people. The mappings below are "closest", never "equals".
- **NICE has no work role named for a team lead, an IR manager, a principal consultant, a CISO, a vCISO/fractional CISO or a CIO.** The names in the work-role list (version 2.0.0 on NICCS) carry no seniority level and no employment model (in-house vs contracted). "Principal", "fractional" and "virtual" are market terms with no NICE equivalent.
- **"CISO" does have a federal-law counterpart.** FISMA's "senior agency information security officer", and NIST's glossary says organisations "may use the term" CISO for it. "CIO" also has one: the agency CIO in 40 U.S.C. § 11315. Both are US federal-agency definitions, not definitions for a town or a company. Both are cited where useful below.
- **No salaries or statistics** unless from a primary source. The only figure in this document is the BLS one in §5. It covers a broad occupation, not any one title.

---

## 1. Rung 1 — Security team lead / SOC lead (built: Town Hall finale)

### Closest NICE work roles (version 2.0.0, as NICCS shows it)
**No clean match.** This is the same conclusion already in CREDITS.md and the Field Manual. The two closest roles:
- **PD-WRL-003 Incident Response**: "Responsible for investigating, analyzing, and responding to network cybersecurity incidents." (NICCS role page)
- **OG-WRL-014 Systems Security Management**: "Responsible for managing the cybersecurity of a program, organization, system, or enclave." (NICCS)

### Responsibilities and decisions (sourced)
- PD-WRL-003 tasks (NICCS role page): **T0510** "Coordinate incident response functions"; **T1110** "Coordinate technical support to enterprise-wide cybersecurity defense technicians"; **T1252** "Determine the scope, urgency, and impact of cyber defense incidents"; **T1315** "Track cyber defense incidents from initial detection through final resolution"; **T1333** "Communicate incident findings to appropriate constituencies"; **T1485** "Prepare after action reviews (AARs)".
- OG-WRL-014 tasks: **T1304** "Recommend organizational cybersecurity resource allocations" (already cited in CREDITS); **T1060** "Advise senior management on organizational cybersecurity efforts" (shared with OG-WRL-003, -007 and others).
- CSF 2.0: **RS.MA-01** "The incident response plan is executed in coordination with relevant third parties once an incident is declared"; **ID.IM-04** "Incident response plans and other cybersecurity plans that affect operations are established, communicated, ..." (CSWP 29).
- SP 800-61 Rev. 3 §2.2 example roles and "an incident lead for each incident" (RS.MA-01, C1). Already verified and cited in CREDITS.md (Council Chambers).
- Shift coverage, coaching, fatigue and growth of analysts: **(game design)**. These come from Ted's BACKLOG note. No NICE task names fatigue or coaching; the nearest workforce tasks belong to OG-WRL-003 (Rung 2A).

### What an edition at this rung teaches
Town Hall's finale already covers the core. If Ted wants a fuller team-lead edition, or a team-lead prologue to the next edition **(game design)**:
1. Delegation is matching skill and load, then reading the close, not redoing the work.
2. A close is only as good as its decisive source. This is the `needs` rule, applied to someone else's work.
3. Coverage is a risk decision the business owns (the road-budget directive, scaled up).
4. Coaching in private and fixing the template is better than reprimanding in the channel (already in drill 1).
5. Every decision has a named owner.

- **Carries over:** drills with `needs` (review a lead's close; their query log is the evidence); the delegation mini-game; boards; directives; dojo; the Quiet Thread.
- **New (game design):** shift rota (night coverage gaps visible on the map); analyst fatigue (load above capacity for several shifts lowers accuracy); growth (a lead given stretch work with review gains a skill); hand-offs between shifts (a missing hand-off note drops an alert).
- **Scorecard:** keep the built five (mean time to assign, busiest person's load, decisions with a named owner, council briefings on time, post-incident actions closed). Add **(game design)**: hours with no one on shift, alerts lost at hand-off, leads who gained a skill.

### Candidate real case for a boss
- **Target, 2013.** Source: US Senate Committee on Commerce, Science and Transportation, Majority Staff Report, *A "Kill Chain" Analysis of the 2013 Target Data Breach* (26 March 2014). Key lines:
  - "Target gave network access to a third-party vendor, a small Pennsylvania HVAC company"
  - "Target appears to have failed to respond to multiple automated warnings from the company's anti-intrusion software"
  - "Target's Symantec antivirus software also detected malicious behavior around November 28"
  - "On December 19, 2013, Target publicly confirmed that some 40 million credit and debit card accounts were exposed."

  It fits a SOC-lead boss: alerts fired, and the team did not act on them. **Caveats:** the report hedges ("appears"), and some of its facts are attributed to press reporting (for example, the 12 November access date is from a New York Times report it cites). A retelling should use only the report's own findings, in outline, and keep its hedges. Town Hall's own boss for this rung is game-original and already built, so this case is optional.

---

## 2. Rung 2 — the branch

### 2A. IR manager (management track)

**Closest NICE roles: no clean match.** The closest are a combination:
- **PD-WRL-003 Incident Response**, for the IR work itself (T0510, T1252, T1333, T1485 above).
- **OG-WRL-003 Cybersecurity Workforce Management**: "Responsible for developing cybersecurity workforce plans, assessments, strategies, and guidance ..." (NICCS; the description was read only up to this point). Tasks (NICCS):
  - **T1450** "Allocate and distribute human capital assets"
  - **T1552** "Identify cyber workforce planning and management issues"
  - **T1553** "Address cyber workforce planning and management issues"
  - **T1056** "Acquire resources to support cybersecurity program goals and objectives"
  - **T1059** "Perform cost/benefit analyses of cybersecurity programs, policies, processes, systems, and elements"
  - **T1114** "Establish the enterprise continuity of operations program"
  - **T1036** "Integrate leadership priorities"
- **OG-WRL-014 Systems Security Management**, for running the programme: T1304, T1060; **T1057** "Conduct an effective enterprise continuity of operations program".

**Responsibilities and decisions (sourced):**
- Run the IR programme between incidents. CSF 2.0: **ID.IM-02** "Improvements are identified from security tests and exercises, including those done in coordination with suppliers ..."; **ID.IM-04** (above). CISA's Tabletop Exercise Packages are already cited in CREDITS.
- Bring in outside help and agencies. **GV.SC-08** "Relevant suppliers and other third parties are included in incident planning, response, and recovery activities"; RS.MA-01.
- Staffing and money: T1450, T1056, T1059.
- Retainer selection, on-call rota design, budget variance: **(game design)**.

**What the edition teaches (game design):**
1. The plan is only real once it has been exercised. Tabletops produce actions, and actions get owners and dates.
2. Staff are capacity. Hiring, rota and burnout are risk decisions with numbers.
3. Knowing when to call outside help (retainer, insurer's panel, law enforcement) and what to hand over.
4. The manager advises and the executive decides. Ransom, shutdown and disclosure are not the IR manager's call (see the Colonial case below).
5. The after-action review: blameless, specific, closed.

- **Carries over:** delegation (now two layers: you assign to leads, leads assign to analysts); drills with `needs` (now on AARs and staffing records); tabletop cards; boards; directives.
- **New (game design):** an IR budget (retainer hours, tooling, overtime); a hiring mini-game (role, skill gaps, time to hire); exercise planning (pick scenarios from risk-register entries); a retainer activation clock.
- **Scorecard (game design):** exercises run and their actions closed (%); mean time to contain across incidents; time to activate outside help; rota gaps (hours); AAR actions closed by due date; budget variance.

**Candidate real case:**
- **Colonial Pipeline, May 2021.** Source: Joseph Blount (CEO), written testimony to the Senate Homeland Security and Governmental Affairs Committee, 8 June 2021. Key lines:
  - discovered "when one of our employees identified the ransom note on a system in the IT network"
  - "Shutting down the pipeline was absolutely the right decision"
  - the attack "did not spread to the Operational Technology (OT) network"
  - "we believe the attacker exploited a legacy virtual private network (VPN) profile that was not intended to be in use"
  - "We retained a leading forensic firm, Mandiant"
  - "we proactively reached out to the Federal Bureau of Investigation (FBI)"
  - "I made the decision that Colonial Pipeline would pay the ransom"
  - pipelines returned to service from "Wednesday evening, May 12"

  It teaches an IR-manager lesson: the CEO, not the IR team, made the shutdown and payment decisions. **Overlap warning:** Records Hall already retells Atlanta (ransomware, pay decision) and the Water Plant did OT. Use Colonial only if the edition's angle is the manager's coordination (outside firm, FBI and CISA calls, the executive decision), not the technical response. The testimony states no ransom amount, so the game must not state one from this source.

### 2B. Principal DFIR consultant (technical track)

**Closest NICE roles:** a reasonable match on the *work*, none on the *seniority* or the *consulting* model.
- **PD-WRL-002 Digital Forensics**: "Responsible for analyzing digital evidence from computer security incidents to derive useful information ..." (NICCS; the description was read only up to this point). Tasks (NICCS):
  - **T1370** "Collect intrusion artifacts" (shared with PD-WRL-003 and IN-WRL-002)
  - **T1510** "Preserve digital evidence"
  - **T1301** "Report forensic artifacts indicative of a particular operating system"
  - **T1617** "Prepare cyber defense reports"
  - **T1372** "Advise law enforcement personnel as technical expert"
  - **T0168** "Perform data comparison against established database"
- **IN-WRL-002 Digital Evidence Analysis** (Investigation category): "Responsible for identifying, collecting, examining, and preserving digital evidence using controlled and documented ..." (NICCS; the description was read only up to this point). Tasks (NICCS):
  - **T2015** "Collect devices containing digital evidence"
  - **T2019** "Process data into readable format"
  - **T2022** "Create derivative evidence from findings report"
  - **T2023** "Serve as subject expert in training fact witnesses for testifying"
- **Expert witness:** BACKLOG's "expert witness-style reporting" has **no NICE task worded as being an expert witness**. The nearest are T1372 (advise law enforcement as technical expert) and T2023 (train *fact* witnesses). Say so in the Field Manual. Do not claim NICE describes expert testimony.
- Multi-client consulting, scoping letters, engagement through counsel: **(game design)**, apart from the Capital One case below.

**Responsibilities and decisions (sourced):**
- Preserve before acting: T1510. This is already a recurring Town Hall rule ("never restore, wipe or rebuild before preserving").
- Report what the evidence supports, and say what it does not: the CSRB case below.
- Who the report is for, and why, decides what happens to it: the Capital One case below.

**What the edition teaches (game design):**
1. Every finding cites its artefact. A report is a chain of `needs`, not a story.
2. "Unknown" is a finding. Write it, give the next step, and correct published errors fast.
3. Scope comes from the evidence, not the client's hope (the blast radius, as in the Server Room, now across clients).
4. Evidence handling: preservation, hashing, custody notes, derivative evidence.
5. Purpose and audience: the same facts written for counsel, for the board and for the technical team.

- **Carries over:** drills with `needs` become the core loop, at higher difficulty (several decisive sources per verdict; a report section scores only if every claim's `needs` was queried); the Forensics, Log Analysis and NTA dojos; the boss as a long investigation.
- **New (game design):**
  - a report-writing mini-game: assemble findings and choose the wording "confirmed / likely / unknown"; overclaiming is graded like a wrong verdict;
  - a custody log;
  - several clients at once with separate evidence stores (never mix them);
  - a cross-examination-style review where opposing questions probe each claim (game framing; NICE has no such task).
- **Scorecard (game design):** findings with every `needs` met (%); claims later corrected; scope accuracy (hosts found vs the true set); custody gaps; time to first defensible finding; clients in parallel.

**Candidate real cases:**
- **Cyber Safety Review Board, *Review of the Summer 2023 Microsoft Exchange Online Intrusion*** (report dated 20 March 2024, published by CISA/DHS):
  - "The Board finds that this intrusion was preventable and should never have occurred"
  - Storm-0558 "was able to succeed because of a cascade of security failures at Microsoft"
  - "As of the date of this report, Microsoft does not know how or when Storm-0558 obtained the signing key"
  - Microsoft's crash-dump theory: "Microsoft has no evidence or logs showing the stolen key's presence in or exfiltration from a crash dump"
  - the Board "is troubled that Microsoft neglected to publicly correct this known error for many months"
  - detection: the State Department's custom alert ("Big Yellow Taxi") on the MailItemsAccessed log, available because of its premium logging tier; 22 organisations and over 500 individuals affected
  - recommendation: "Security-related logging should be a core element of cloud offerings"

  It suits a DFIR boss: an honest "unknown" and a public correction. Retell in outline as a game-original cloud tenant compromise.
- **In re Capital One Consumer Data Security Breach Litigation**, E.D. Va., MDL No. 1:19md2915 (AJT/JFA), Memorandum Opinion and Order, Judge Trenga, 25 June 2020. It affirmed the magistrate judge's order of 26 May 2020 that the Mandiant report was **not** protected work product. Reasoning: the 2019 statement of work was "virtually identical" to the pre-existing arrangement; Capital One "failed ... to satisfy the 'because of' test"; the report's distribution showed it "was significant for regulatory and business reasons". This is a dojo case, not a boss: why an engagement's purpose and paperwork matter to a consultant. **Sourcing caveat:** the opinion was read from a copy hosted by a law firm (robinsonbradshaw.com), not from the court's docket. Before CREDITS, fetch it from PACER/CourtListener or govinfo. The game must teach "counsel decides privilege", never give legal advice.

### How the branch works in game (game design)
- **The choice.** At the start of edition 2, the Mayor offers to make the IR programme permanent (IR manager). At the same time, the outside firm that took the suspicion file offers you a place on the team working it (principal DFIR consultant). This uses the hand-off already in council-timeline.md ("to the outside incident-response firm (game)"). Same Quiet Thread, seen from inside the town or from the firm.
- **What differs.**
  - The IR manager's loop is people, money, exercises and coordination. Drills are reviews of others' work and records.
  - The DFIR consultant's loop is evidence-heavy drills and reports for several clients. The Quiet Thread is investigated hands-on across the town and one or two other client towns. AA24-038A describes Volt Typhoon in many critical-infrastructure victims; in the game, the other client towns are invented.
  - Same map backbone, different fieldwork and scorecards. Shared districts keep build cost down.
- **Do they rejoin?** Recommended yes, at CISO. Both are plausible routes to a CISO post; this is an assumption, since no primary source gives route statistics and none is claimed. Each track carries a perk (game):
  - IR manager → CISO starts with the budget and staffing dojo cleared and a trusted deputy.
  - DFIR → CISO starts with "credibility": board questions about incidents start with Evidence higher, and one free expert review per edition.

  The other track's content stays replayable from the series menu (series save records `editions.<id>.track`).
- **Permanence:** recommend the choice is locked per save, with a New Game+ to try the other track. This is an open decision for Ted (§7).

---

## 3. Rung 3 — CISO

**Closest NICE role: OG-WRL-007 Executive Cybersecurity Leadership.** It is the nearest match, not equal to the title. Description (NICCS): "Responsible for establishing vision and direction for an organization's cybersecurity operations and resources and their impact on digital and physical spaces. Possesses authority to make and execute decisions that impact an organization broadly, including policy approval and stakeholder engagement."

Federal-law counterpart: under 44 U.S.C. § 3554(a)(3)(A), the agency CIO designates "a senior agency information security officer". That officer must "have information security duties as that official's primary duty" and "head an office with the mission and resources to assist in ensuring agency compliance". NIST's glossary sends "chief information security officer" to that entry, and notes organisations "may use the term" CISO. Note the reporting line in that statute: the CISO carries out "the Chief Information Officer's responsibilities". Who reports to whom is itself a design choice (Rung 5).

**Responsibilities and decisions (sourced).**

OG-WRL-007 tasks (NICCS role page):
- **T1227** "Manage cybersecurity budget, staffing, and contracting"
- **T1059** "Perform cost/benefit analyses of cybersecurity programs, policies, processes, systems, and elements"
- **T1088** "Communicate the value of cybersecurity to organizational stakeholders"
- **T1060** "Advise senior management on organizational cybersecurity efforts"
- **T1518** "Develop organizational cybersecurity strategy"
- **T1308** "Coordinate cybersecurity policy review and approval processes"
- **T1906** "Establish a cybersecurity risk management program"
- **T1862** "Establish cybersecurity risk assessment processes"
- **T1221** "Disseminate incident and other Computer Network Defense (CND) information"
- **T1310** "Implement protective or corrective measures when a cybersecurity incident or vulnerability is discovered"
- **T0006** "Advocate organization's official position in legal and legislative proceedings"
- **T1376** / **T1377** "Develop / Implement critical infrastructure protection policies and procedures"

Note: no OG-WRL-007 task mentions a board, risk acceptance or vendors by name.

CSF 2.0 Govern (CSWP 29):
- **GV.RR-01** "Organizational leadership is responsible and accountable for cybersecurity risk ..."
- **GV.RR-03** "Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies"
- **GV.RM-02** "Risk appetite and risk tolerance statements are established, communicated, and maintained"
- **GV.RM-03** "Cybersecurity risk management activities and outcomes are included in enterprise risk management processes"
- **GV.PO-01** "Policy for managing cybersecurity risks is established based on organizational context, cybersecurity strategy, and priorities ..."
- **GV.PO-02** "Policy ... is reviewed, updated, communicated, and enforced ..."
- **GV.OV-01** "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction"
- **GV.OV-03** "Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed"
- Supply chain: **GV.SC-04** "Suppliers are known and prioritized by criticality"; **GV.SC-05** "Requirements to address cybersecurity risks in supply chains are established, prioritized, and integrated into contracts ..."; **GV.SC-06** "Planning and due diligence are performed to reduce risks before entering into formal supplier or other third-party ..."; **GV.SC-07** "The risks posed by a supplier, their products and services, and other third parties are understood, recorded, prioritized, ..."; **GV.SC-10** (provisions "after the conclusion" of a relationship).
- Not on the version 2.0.0 pages used here: **OG-WRL-017** Cybersecurity Supply Chain Risk Management, added in NIST's later v2.2.0 release (28 April 2026), where its ID and name were confirmed; its description and tasks were **not** verified here.

Board reporting:
- **US public companies:** SEC final rule, press release 2023-139 (26 July 2023). Form 8-K Item 1.05 discloses material incidents, generally within four business days of determining materiality. Regulation S-K Item 106 requires describing "the board of directors' oversight of risks from cybersecurity threats" and "management's role and expertise in assessing and managing material risks from cybersecurity threats".
- **Financial institutions under the FTC Safeguards Rule:** 16 CFR 314.4(i). The Qualified Individual reports "in writing, regularly and at least annually, to your board of directors ... or equivalent governing body", covering "The overall status of the information security program and your compliance with this part" and "Material matters related to the information security program, addressing issues such as risk assessment, ... recommendations for changes in the information security program." (eCFR, up to date as of 10 August 2026.)
- **The town:** neither rule applies to a US town as such. The game's town council is the "governing body" by analogy (game). Keep the council framing and cite these rules only as real-world examples.

**What the edition teaches (game design):**
1. Risk appetite first. Every later decision (budget, exception, vendor) is measured against a stated appetite (GV.RM-02).
2. Budget is risk allocation. Spend follows the register, and the cost/benefit is shown (GV.RR-03, T1059, T1227).
3. Reporting to the governing body: status plus material matters, in its language, on a schedule. Tell the truth that internal records show (the Uber and SolarWinds lessons below).
4. Suppliers are part of the attack surface. Tier them by criticality, write requirements into contracts, keep them in IR plans (GV.SC-04/05/08).
5. Policy with enforcement: exceptions with an owner, an expiry and a review. This is the fd-admin lesson from Front Desk and Council drill 3, now at programme scale.

- **Carries over:** drills with `needs`, where the evidence is records (sign-in logs, contracts, exception lists, board minutes). Council drill 3, the insurer's MFA question, is exactly this rung's drill type. Also boards (the governing body), directives, dojo, delegation (to managers, who delegate on), and the Quiet Thread (now a risk-committee and disclosure matter).
- **New (game design):**
  - **Budget allocation**: a fixed sum across the register's risks; residual risk shown per risk; the council can override and must sign a risk acceptance.
  - **Board report**: assemble a quarterly report from the scorecard; graded for completeness (status, material matters) and for claims not supported by records.
  - **Vendor/contract management**: a supplier list to tier; contract clauses (notification time, logging, MFA, right to audit, exit) to negotiate within budget; a vendor incident where missing clauses cost time.
  - **Policy lifecycle**: draft, approve, communicate, enforce, review.
  - **Disclosure clock**: counsel decides; the CISO supplies facts on time.
- **Scorecard (game design):** risks within appetite (%); register risks with a business owner and review date (%); budget spent against top-five risks (%); governing-body reports on time and with no unsupported claim; critical suppliers with security clauses (%); policy exceptions with an expiry (%); disclosure facts to counsel within the plan's time.

**Candidate real cases (handle with care: real, named people):**
- **Uber / Joseph Sullivan (former Chief Security Officer).** DOJ, N.D. Cal. On 5 October 2022 a jury convicted Sullivan of obstruction of FTC proceedings (18 U.S.C. § 1505) and misprision of felony (18 U.S.C. § 4). On 5 May 2023 he was sentenced to three years' probation and a $50,000 fine. Per DOJ, Uber paid the hackers "$100,000 in bitcoin" in December 2016 for non-disclosure agreements that falsely stated no data was taken. Sullivan told a subordinate they "can't let this get out". The breach involved about 57 million users and drivers and was disclosed in November 2017. Lesson: concealment is a choice with personal consequences; the facts go to counsel. This is the strongest primary-sourced CISO boss. The appeal is verified (21 November 2026, on the courts' own pages; docs/design/facts_slice5.md): the Ninth Circuit affirmed in a published opinion (No. 23-927; filed 13 March 2025, amended 12 November 2025, rehearing en banc denied), in the court's words "Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary"; the Supreme Court denied certiorari on 29 June 2026 (No. 25-1082). The court said it need not decide whether a bug bounty program may give researchers prior authorisation (footnote 6), so nothing here says bug bounty payments are illegal.
- **SEC v. SolarWinds Corp. and Timothy G. Brown** (S.D.N.Y., No. 1:23-cv-09518):
  - The SEC charged the company and its CISO on 30 October 2023 (press release 2023-227). Its allegations included internal presentations saying the "current state of security leaves us in a very vulnerable state for our critical assets".
  - On 20 November 2025 the SEC filed a joint stipulation "to dismiss, with prejudice", "in the exercise of its discretion" (Litigation Release 26423).
  - **These were allegations, never findings**, and the case ended in dismissal. If used at all, use it as a dojo discussion of the gap between internal reports and public statements, with the outcome stated. Do not use it as a boss. The July 2024 ruling is now read on the court's own site (S.D.N.Y., 23 Civ. 9518 (PAE), filed 18 July 2024): the court "denies in part, but grants in large part, the motion to dismiss", sustaining at the pleading stage only the fraud claims based on the pre-incident Security Statement (facts_slice5.md).

---

## 4. Rung 4 — fractional CISO / vCISO

**Closest NICE role: none.** "Fractional CISO" and "vCISO" are market terms: a part-time or contracted CISO serving several organisations. NICE has no role for them and no employment-model dimension. The work is OG-WRL-007's, done for several organisations at once. BACKLOG already folds vCISO and fractional CISO into one variant; this spec agrees.

**Primary-source footing for a contracted security lead:** the FTC Safeguards Rule, 16 CFR 314.4(a):
- "Designate a qualified individual responsible for overseeing and implementing your information security program ..."
- "The Qualified Individual may be employed by you, an affiliate, or a service provider."
- If a service provider is used, the organisation must "Retain responsibility for compliance with this part"
- and "Designate a senior member of your personnel responsible for direction and oversight of the Qualified Individual"
- and require the provider to maintain a programme that protects it.

This is a US rule for the financial institutions it covers, not a general definition of vCISO. Its structure is the core game mechanic: **the client keeps the accountability; you advise and run the programme; each client names an internal owner who directs you.**

**Responsibilities and decisions:** OG-WRL-007's tasks (Rung 3) per client, plus Govern outcomes per client. **GV.RR-02** "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, ..." becomes the engagement letter. Hours per client, conflicts of interest and cross-client confidentiality: **(game design)**.

**What the edition teaches (game design):**
1. Accountability stays with the client (314.4(a)(1)). You recommend; the client's governing body decides and signs.
2. Triage across clients: limited hours, competing emergencies, contracted response times.
3. One shared supplier, many victims. Third-party risk looks different when you see several clients' supplier lists.
4. Confidentiality walls: one client's incident details never reach another, even when the attacker is the same.
5. Write it down: the engagement scope, who directs you, what you were not asked to do.

- **Carries over:** everything from CISO, multiplied, at lighter depth per client. Delegation now goes to each client's internal staff, who have no obligation to you. Drills with `needs` run per client, and evidence from client A cannot satisfy a `needs` in client B (a separate-store rule).
- **New (game design):**
  - **Multi-client juggling**: three or four small organisations (another town, a water co-op, a clinic, a school district; all invented), each with its own map room, scorecard, budget and named internal owner;
  - **An hours budget per week** with contracted response times;
  - **Conflict-of-interest prompts**;
  - **A cross-client incident**: one supplier compromised, several clients hit, a separate response for each.
  - This fits the series: the Quiet Thread can be seen moving between clients, as AA24-038A describes for Volt Typhoon across many victims.
- **Scorecard (game design):** per-client scorecard (Rung 3 metrics); contracted hours used vs bought; client decisions signed by the client (%); response-time breaches; confidentiality breaches (target 0); clients retained.

**Candidate real case:**
- **Kaseya VSA, July 2021.** CISA and FBI, *Guidance for MSPs and their Customers Affected by the Kaseya VSA Supply-Chain Ransomware Attack* (CISA current-activity page; the URL is dated 4 July 2021, and the page cites "Kaseya's Important Notice July 3rd, 2021"). It describes a "supply-chain ransomware attack leveraging a vulnerability in Kaseya VSA software" against multiple MSPs and their customers. It advises MSPs to "Enable and enforce multi-factor authentication (MFA) on every single account ...", allowlisting for RMM, and RMM admin interfaces behind a VPN or firewall. It advises customers to keep backups "air-gapped" and "Revert to a manual patch management process ...". This case is the mechanic itself: one provider, many clients, separate responses. Retell in outline (game-original RMM vendor).

---

## 5. Rung 5 — CIO

**Closest NICE role: none for the title.** CIO is a business title. The nearest work roles:
- **OG-WRL-015 Technology Portfolio Management**: "Responsible for managing a portfolio of technology investments that align with the overall needs of mission and enterprise priorities." (NICCS). Tasks:
  - **T1227** "Manage cybersecurity budget, staffing, and contracting"
  - **T1026** "Determine procurement requirements"
  - **T1369** "Determine if acquisitions, procurement, and outsourcing efforts address cybersecurity requirements"
  - **T1399** "Develop supply chain, system, network, and operational security contract language"
  - **T1498** "Determine if cybersecurity requirements included in contracts are delivered"
  - **T1472** "Gather customer satisfaction and service performance feedback"
  - **T1622** "Prepare risk management reports"
- **OG-WRL-010 Program Management**: "Responsible for leading, coordinating, and the overall success of a defined program." (NICCS landing page.) Tasks T1145 / T1146 "Develop / Maintain strategic plans" (shared with OG-WRL-007).

NICE is a *cybersecurity* workforce framework, so it covers the CIO's security-relevant work, not IT delivery as a whole.

**Primary-source duties (US federal agencies):** 40 U.S.C. § 11315.
- (b)(2): "developing, maintaining, and facilitating the implementation of a sound, secure, and integrated information technology architecture"
- (b)(3): "promoting the effective and efficient design and operation of all major information resources management processes"
- (c)(2): the CIO "monitors the performance of information technology programs of the agency, evaluates the performance of those programs on the basis of the applicable performance measurements, and advises the head of the agency regarding whether to continue, modify, or terminate a program or project"
- (c)(3)(C): "develops strategies and specific plans for hiring, training, and professional development"
- FISMA (44 U.S.C. § 3554(a)(3)(A)): the agency CIO designates the senior agency information security officer.

These bind federal agencies, not towns; use them as a model.

**BLS (the only salary figure in this spec).** Occupational Outlook Handbook, *Computer and Information Systems Managers* (page last modified 27 August 2026):
- median pay "$175,140 per year" (2025)
- 685,800 jobs (2025)
- projected growth 16% from 2025 to 2035
- "These managers may have other titles, such as chief information officer (CIO), chief technology officer (CTO) ..."
- "an IT security manager may need to have worked as an information security analyst"

This is a broad occupation. It is not a CIO salary and it does not mention CISOs. Recommendation: the game shows no pay at all (open decision).

**What the edition teaches (game design):**
1. Security is one input among uptime, cost, delivery and user satisfaction. The CIO trades them off openly.
2. Portfolio decisions: continue, modify or terminate (§ 11315(c)(2)). Retiring legacy is a security win and a delivery cost.
3. Change and availability are risks too. A non-malicious outage can do as much damage as an attack (both cases below).
4. Procurement is where security is cheapest: requirements in contracts (T1369, T1399, T1498).
5. The CISO is a peer with a different scorecard. Disagree in writing, and let the governing body decide.

- **Carries over:** boards; directives (now the CIO issues them, and the player sees why: the SIEM-licence cut in the Basement was Audra Finch's); delegation; drills with `needs` (outage root cause: the change record and system logs decide, the vendor's first statement is a trap).
- **New (game design):**
  - **An IT portfolio**: projects and services with cost, value, risk and age; a yearly continue/modify/terminate round;
  - **A service-availability board** (uptime targets per service);
  - **A change-management mini-game** (staged rollout, rollback plan);
  - **Technical-debt retirement**;
  - **A CISO counterpart NPC** whose requests compete for the same budget.
  - BACKLOG suggests the CIO is "best as a counterpart NPC ... possibly a playable late-game perspective". This spec agrees: build Audra Finch as the CIO counterpart first, and a playable CIO edition last.
- **Scorecard (game design):** availability of critical services vs target; portfolio spend on legacy (%); projects on time/budget; failed changes (%) and mean time to restore; security findings remediated by IT within the agreed time; user satisfaction (a T1472-style survey).

**Candidate real cases:**
- **CrowdStrike content update, 19 July 2024.** CISA alert, 19 July 2024: "widespread outage affecting Microsoft Windows hosts due to an issue with a recent CrowdStrike update". CrowdStrike attributed it to a Falcon content update, "not to malicious cyber activity". CISA warned of "threat actors taking advantage of this incident for phishing and other malicious activity". A CIO boss: mass recovery, prioritising services, phishing riding on the outage.
- **FAA NOTAM outage, 11 January 2023.** FAA statements:
  - 11 January: "The FAA has ordered airlines to pause all domestic departures until 9 a.m. Eastern Time"
  - preliminary cause: "a damaged database file"
  - 19 January: "contract personnel unintentionally deleted files while working to correct synchronization between the live primary database and a backup database"
  - "The agency has so far found no evidence of a cyber-attack or malicious intent"

  A CIO boss about a contractor change, primary/backup synchronisation and resilience. Not an attack, and the game must say so.

---

## 6. Recommended order of editions (game design, with reasoning)

1. **Edition 2: the Branch (IR manager / principal DFIR consultant), with a short team-lead prologue.**
   - The story hook already exists: the suspicion file went to an outside IR firm. The DFIR track joins that firm; the IR-manager track stays in the town.
   - Mechanics carry over almost unchanged (`needs` drills, delegation, boards).
   - It keeps hands-on investigation in the game. A run of executive-only editions would lose the drill loop that is Uptime's core.
   - The fuller team-lead mechanics (rota, fatigue, growth) fit the prologue, so team lead needs no separate edition.
   - The Quiet Thread can come close to resolution here: DFIR finds it, the manager coordinates the eviction. Ted decides.
2. **Edition 3: CISO** (the two tracks rejoin).
   - Adds budget, governing-body reporting, vendor contracts and policy.
   - Council Chambers already prototyped the risk register, insurer and directive mechanics, and drill 3 is the CISO drill type.
   - The Quiet Thread becomes a risk-acceptance and disclosure matter (eviction cost, what the council is told).
3. **Edition 4: fractional CISO / vCISO.**
   - Needs CISO mechanics first, then multiplies them across invented client organisations.
   - Best suited to the cross-edition Quiet Thread (the same actor in several clients) and to a Kaseya-style shared-supplier boss.
4. **Edition 5: CIO.**
   - Introduce Audra Finch as a recurring CIO counterpart in editions 3–4 first, so the conflict is felt before it is played.
   - A playable CIO edition is the furthest from the defender-RPG core, so it goes last, or stays an NPC-only perspective.

Why not CISO straight after Town Hall: the jump from team lead to executive skips the rung where the player still investigates. The branch also gives the series its only real choice, and that is best placed early.

---

## 7a. Ted's decisions (answered 2026-11-07 UTC)
- **Branch shape:** one edition, two tracks on a shared map; choice locked per save; New Game+ unlocks the other track; both tracks rejoin at CISO (perks in §2 stand as placeholders).
- **Setting:** same town, bigger scope. Federal/FTC/SEC sources appear only as comparisons, labelled as not binding a town.
- **Quiet Thread:** resolved only in the final edition. Edition 2 advances it (new verified-technique clues, a clearer picture) but must not resolve it.
- **CIO:** playable, last edition; Audra Finch appears as the CIO counterpart in the CISO and vCISO editions first.
- **Taken as recommended until Ted says otherwise:** team lead gets a short prologue in edition 2, not its own edition (1); no pay data (8); US-framed (9); at least three `needs` drills per district in executive editions (10); the build agent re-verifies NICE tasks on their NICCS pages (version 2.0.0, as NICCS shows it) and fetches Capital One from CourtListener/govinfo before citing (11). Real-person retellings (6) are deferred to the CISO edition.

## 7. Open decisions only Ted can make

1. **Team lead:** is the Council Chambers finale enough, or does team lead get the fuller prologue (rota, fatigue, growth from BACKLOG) or its own edition?
2. **Branch shape:**
   - one edition with two tracks on a shared map (cheaper), or two separate editions (deeper, about twice the work)?
   - is the choice locked per save, with New Game+ for the other track?
3. **Rejoin:** do both tracks converge at CISO? What does each carry (the perks proposed in §2 are placeholders)?
4. **Setting:** stay in the same town (CISO of the town), move to a larger organisation, or use several invented clients (vCISO)? This decides how far the US federal and FTC/SEC sources apply. They do not bind a town.
5. **Quiet Thread:** which edition resolves it, and from which seat (consultant, manager, CISO)? It is currently open by design.
6. **Real people in retellings:** Uber/Sullivan (convicted) and SolarWinds/Brown (charged, then dismissed with prejudice) involve named individuals. Options:
   - outline only, unnamed, with a source note;
   - named, with the outcome;
   - left out.

   I recommend Uber only, in outline, with the conviction stated, and SolarWinds left out or kept to a dojo discussion with its dismissal stated.
7. **CIO:** a playable edition, or an NPC counterpart only?
8. **Pay data:** show any? The only primary figure (BLS median $175,140, May 2025) covers a broad occupation that includes CIOs and is not a title-specific salary. I recommend none.
9. **Jurisdiction:** keep it US-framed (the town is a US town, as CREDITS says) or add international comparisons, as Market Square did with the UK ICO?
10. **Executive editions' share of hands-on drills:** how much `needs`-drill content to keep once the player is a CISO, vCISO or CIO. I suggest at least three drills per district, with records as the evidence.
11. **Re-verification before build:** who re-checks the NICE task lists on NICCS (version 2.0.0, as shown there), and the Capital One opinion against the court docket? Neither could be fetched from this session.

---

## Sources (all checked 1 November 2026)

**NICE Framework**
- NIST, NICE Framework "Current Version" page (lists the later Components v2.2.0 release; JSON/XLSX links; the version used here is NICCS's 2.0.0): https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version
- NIST, NICE Framework change logs: https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-resource-center/current-version/change-logs
- NIST news, "NICE Releases NICE Framework Components v2.2.0" (28 April 2026; OG-WRL-017; a later release, not the version used here): https://www.nist.gov/news-events/news/2026/04/nice-releases-nice-framework-components-v220
- NIST, NICE Framework work role list (IDs and names): https://www.nist.gov/itl/applied-cybersecurity/nice/nice-framework-work-role-videos
- NICCS, NICE Framework landing page (role descriptions; says v1.0.0): https://niccs.cisa.gov/workforce-development/nice-framework
- NICCS role pages:
  - Executive Cybersecurity Leadership (tasks): https://niccs.cisa.gov/workforce-development/nice-framework/work-role/executive-cybersecurity-leadership
  - Incident Response PD-WRL-003: https://niccs.cisa.gov/workforce-development/nice-framework/work-role/incident-response
  - Technology Portfolio Management OG-WRL-015: https://niccs.cisa.gov/tools/nice-framework/work-role/technology-portfolio-management
- NICCS skill pages (Digital Forensics and Digital Evidence Analysis descriptions): https://niccs.cisa.gov/tools/nice-framework/skill/s0834 · https://niccs.cisa.gov/tools/nice-framework/skill/s0156
- NICCS skill page (Cybersecurity Workforce Management description): https://niccs.cisa.gov/tools/nice-framework/skill/s0398
- NICCS task pages:
  - T1238: https://niccs.cisa.gov/tools/nice-framework/task/t1238
  - T1226: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1226
  - T1377: https://niccs.cisa.gov/tools/nice-framework/task/t1377
  - T1234: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1234
  - T1779: https://niccs.cisa.gov/tools/nice-framework/task/t1779
  - T1057: https://niccs.cisa.gov/tools/nice-framework/task/t1057
  - T1145: https://niccs.cisa.gov/tools/nice-framework/task/t1145
  - T1146: https://niccs.cisa.gov/tools/nice-framework/task/t1146
  - T1060: https://niccs.cisa.gov/tools/nice-framework/task/t1060
  - T1036: https://niccs.cisa.gov/tools/nice-framework/task/t1036
  - T1059: https://niccs.cisa.gov/tools/nice-framework/task/t1059
  - T1056: https://niccs.cisa.gov/tools/nice-framework/task/t1056
  - T1450: https://niccs.cisa.gov/tools/nice-framework/task/t1450
  - T1552: https://niccs.cisa.gov/tools/nice-framework/task/t1552
  - T1553: https://niccs.cisa.gov/tools/nice-framework/task/t1553
  - T1114: https://niccs.cisa.gov/tools/nice-framework/task/t1114
  - T1862: https://niccs.cisa.gov/tools/nice-framework/task/t1862
  - T1485: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1485
  - T0168: https://niccs.cisa.gov/workforce-development/nice-framework/task/t0168
  - T1488: https://niccs.cisa.gov/tools/nice-framework/task/t1488
  - T1301: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1301
  - T1617: https://niccs.cisa.gov/tools/nice-framework/task/t1617
  - T1372: https://niccs.cisa.gov/tools/nice-framework/task/t1372
  - T1510: https://niccs.cisa.gov/tools/nice-framework/task/t1510
  - T1370: https://niccs.cisa.gov/tools/nice-framework/task/t1370
  - T2015: https://niccs.cisa.gov/tools/nice-framework/task/t2015
  - T2019: https://niccs.cisa.gov/tools/nice-framework/task/t2019
  - T2022: https://niccs.cisa.gov/tools/nice-framework/task/t2022
  - T2023: https://niccs.cisa.gov/tools/nice-framework/task/t2023
- T1304 and OG-WRL-014's description: as already cited in CREDITS.md, https://niccs.cisa.gov/workforce-development/nice-framework/task/t1304

**NIST CSF 2.0 and NIST glossary**
- NIST CSWP 29, The NIST Cybersecurity Framework (CSF) 2.0 (26 February 2024; Govern, ID.IM and RS.MA text): https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf
- NIST CSRC glossary, chief information security officer → senior agency information security officer: https://csrc.nist.gov/glossary/term/chief_information_security_officer

**Statutes and regulations**
- 44 U.S.C. § 3554 (FISMA agency responsibilities; senior agency information security officer): https://www.law.cornell.edu/uscode/text/44/3554
- 40 U.S.C. § 11315 (Agency Chief Information Officer), US Code 2023 via govinfo: https://www.govinfo.gov/content/pkg/USCODE-2023-title40/html/USCODE-2023-title40-subtitleIII-chap113-subchapII-sec11315.htm
- 16 CFR 314.4 (FTC Safeguards Rule; Qualified Individual; board report), eCFR: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-314/section-314.4
- SEC press release 2023-139, cybersecurity risk management, governance and incident disclosure rules (26 July 2023): https://sec.gov/news/press-release/2023-139

**BLS**
- Occupational Outlook Handbook, Computer and Information Systems Managers: https://www.bls.gov/ooh/management/computer-and-information-systems-managers.htm (and ?pg=2 for the CIO/CTO titles text)

**Cases**
- Senate Commerce Committee, press release, Target staff report (25 March 2014): https://www.commerce.senate.gov/2014/3/rockefeller-staff-report-details-target-s-missed-opportunities-to-stop-massive-data-breach
- The report itself, *A "Kill Chain" Analysis of the 2013 Target Data Breach* (26 March 2014): https://commerce.senate.gov/services/files/6E528123-41FC-4C22-A696-A224BBADB6B5
- Colonial Pipeline, Joseph Blount written testimony, Senate HSGAC (8 June 2021): https://www.hsgac.senate.gov/imo/media/doc/Testimony-Blount-2021-06-08.pdf
- CSRB, Review of the Summer 2023 Microsoft Exchange Online Intrusion (20 March 2024), PDF: https://www.cisa.gov/sites/default/files/2024-04/CSRB_Review_of_the_Summer_2023_MEO_Intrusion_Final_508c.pdf
- CSRB report landing page: https://cisa.gov/resources-tools/resources/CSRB-Review-Summer-2023-MEO-Intrusion
- In re Capital One Consumer Data Security Breach Litigation, E.D. Va. MDL No. 1:19md2915, Memorandum Opinion and Order (25 June 2020). Read via a law firm's copy (court copy still to fetch): https://www.robinsonbradshaw.com/assets/htmldocuments/Capital_One.pdf
- DOJ N.D. Cal., Sullivan convicted (5 October 2022): https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-convicted-federal-charges-covering-data-breach
- DOJ N.D. Cal., Sullivan sentenced (5 May 2023): https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-sentenced-three-years-probation-covering-data
- US Court of Appeals for the Ninth Circuit, United States v. Sullivan, No. 23-927, opinion (filed 13 March 2025): https://cdn.ca9.uscourts.gov/datastore/opinions/2025/03/13/23-927.pdf ; amended opinion and order (12 November 2025): https://cdn.ca9.uscourts.gov/datastore/opinions/2025/11/12/23-927.pdf (checked 21 November 2026)
- Supreme Court of the United States, docket No. 25-1082, Sullivan v. United States ("Petition DENIED", 29 June 2026): https://www.supremecourt.gov/docket/docketfiles/html/public/25-1082.html (checked 21 November 2026)
- S.D.N.Y., SEC v. SolarWinds Corp., 23 Civ. 9518 (PAE), opinion and order (filed 18 July 2024): https://nysd.uscourts.gov/sites/default/files/2024-07/SolarWinds%20Opinion%20Dkt.%20125-1.pdf (checked 21 November 2026)
- SEC press release 2023-227, charges against SolarWinds and its CISO (30 October 2023): https://www.sec.gov/news/press-release/2023-227
- SEC Litigation Release 26423, dismissal with prejudice (20 November 2025): https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26423
- CISA-FBI, Guidance for MSPs and their Customers Affected by the Kaseya VSA Supply-Chain Ransomware Attack (July 2021): https://us-cert.cisa.gov/ncas/current-activity/2021/07/04/cisa-fbi-guidance-msps-and-their-customers-affected-kaseya-vsa
- CISA alert, Widespread IT Outage Due to CrowdStrike Update (19 July 2024): https://cisa.gov/news-events/alerts/2024/07/19/widespread-it-outage-due-crowdstrike-update
- FAA, NOTAM statement (updates of 11 and 19 January 2023): https://www.faa.gov/newsroom/faa-notam-statement

**Already in CREDITS.md and relied on here, not re-fetched:** NIST SP 800-61 Rev. 3; CISA CTEP; AA24-038A; CIRCIA status.

**Looked at but not relied on:**
- SFIA prototype NICE-to-SFIA mapping (nist.gov/document/nicerolessfialeveled2026pdf): secondary, and contains copy errors.
- stigviewer.com/nice/PD-WRL-003: a secondary mirror. It agrees with the NICCS Incident Response task list and labels itself v2.2.0 (its own label; the version used here is NICCS's 2.0.0).
- Perkins Coie alert on SolarWinds: secondary; replaced by the SEC releases.
- A Ninth Circuit PDF that turned out to be a different Uber case (Doe v. Uber).

**Not verified, so not used:**
- OG-WRL-017's description and tasks.
- ~~Any appeal outcome in US v. Sullivan.~~ Verified 21 November 2026 (see §3 and Sources).
- ~~The July 2024 SolarWinds ruling (secondary only).~~ Read on the court's own site 21 November 2026 (see §3 and Sources).
- Any statistic on career paths into CISO, team size, or vCISO market size.
- Any NICE task about expert-witness testimony (none found).
