# Charter (ed. 3) slice 5 finale: primary-source fact check

All fetches: **21 November 2026 (UTC)**. Primary sources only.

**Method caveat (read first).** Direct download (curl) of justice.gov, cdn.ca9.uscourts.gov and nist.gov was refused by this session's egress proxy (403, host not allowed), so no raw copy of any document was saved. Every quote below comes through WebFetch. WebFetch passes the page through an extraction model and caps each quote at 125 characters. I asked for exact text each time, and long sentences were returned as consecutive fragments, which are shown as separate quoted pieces joined by " / ". Treat the quotes as high-confidence but not byte-exact. **Before any line ships in game text, spot-check it in a browser at the URL given.** Known OCR artefacts are noted where they occur.

---

## 1. United States v. Joseph Sullivan (former Uber CSO)

### 1a. DOJ verdict press release
URL: https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-convicted-federal-charges-covering-data-breach (fetched 2026-11-21)

- Date line: "Wednesday, October 5, 2022"
- Opening: "SAN FRANCISCO – A federal jury convicted Joseph Sullivan, the former Chief Security Officer of Uber Technologies, Inc." ... "of obstruction of proceedings of the Federal Trade Commission (“FTC”) and misprision of felony"
- Statutes: "in violation of 18 U.S.C. § 1505" (obstruction); "in violation of 18 U.S.C. § 4" (misprision)
- Trial: "following a four week trial before the Hon. William H. Orrick, United States District Judge."
- Verdict date: the first sentence does not say "today". The FBI SAC quote says "The message in today's guilty verdict is clear", which dates the verdict to the release date, 5 October 2022.
- Maximum penalties: "Sullivan faces a maximum of five years in prison for the obstruction charge" / "a maximum three years in prison for the misprision charge"
- Scale: "of user data, which included records on approximately 57 million Uber users and 600,000 driver license numbers."
- Payment: "Uber paid the hackers $100,000 in bitcoin in December 2016"
- NDAs: "contained the false representation that the hackers did not take or store any data in their hack"
- Quote attributed to Sullivan: "can’t let this get out"
- **Who was not told:** "The evidence showed that, despite knowing in great detail that Uber had suffered another data breach" / "directly responsive to the FTC's inquiry, Sullivan continued to work with the Uber lawyers" / "handling or overseeing that inquiry, including the General Counsel of Uber, and never mentioned the incident to them."
- Also: "Sullivan affirmatively worked to hide the data breach from the Federal Trade Commission"
- Later disclosure: "disclosed the breach publicly, and to the FTC, in November 2017"
- U.S. Attorney Stephanie Hinds: "We expect those companies to protect that data and to alert customers and appropriate authorities" / "when such data is stolen by hackers." and "We will not tolerate concealment of important information from the public by corporate executives" / "more interested in protecting their reputation and that of their employers than in protecting users."
- FBI SAC Robert Tripp: "companies storing their customers' data have a responsibility to protect that data" / "and do the right thing when breaches occur."
- Counts: the release names **two offences** (one § 1505 obstruction, one § 4 misprision). It does not number the counts. The sentencing release says "two felonies".
- Docket number: not on the page (it appears in the Ninth Circuit caption, below).

### 1b. DOJ sentencing press release
URL: https://www.justice.gov/usao-ndca/pr/former-chief-security-officer-uber-sentenced-three-years-probation-covering-data (fetched 2026-11-21)

- Date line: "Friday, May 5, 2023"
- Sentence: "was sentenced to serve a three-year term of probation and ordered to pay a fine of $50,000"
- Conviction: "after a jury found Sullivan guilty of two felonies in October 2022."
- Timing: "As established at trial, ten days after his sworn FTC testimony, Sullivan learned that Uber had been hacked again."
- NDA drafting: "Those contracts, drafted by Sullivan and a lawyer assigned to his team," / "falsely represented that the hackers did not take or store any data in their hack."
- **Who was not told:** "Thereafter, Sullivan continued to work with the Uber lawyers handling or overseeing the FTC investigation," / "including the General Counsel of Uber, but he withheld information about the breach from all of them."
- "As part of the negotiations, Sullivan learned that the FTC was relying on false information" / "previously provided by Uber, but he failed to alert any of Uber's lawyers or the FTC."
- Payment and NDAs: "He also arranged to pay off the hackers in exchange for them signing non-disclosure agreements" / "in which the hackers promised not to reveal the hack to anyone."
- 2017: "When asked by Uber's new CEO what had happened, Sullivan lied about the circumstances of the breach" and "Sullivan lied again to Uber's outside lawyers who were conducting an investigation into the incident."
- The release has no quote from the First Assistant U.S. Attorney about lessons.

### 1c. The appeal: Ninth Circuit's own opinion (VERIFIED)
- Original opinion: https://cdn.ca9.uscourts.gov/datastore/opinions/2025/03/13/23-927.pdf (fetched 2026-11-21)
- Amended opinion and order: https://cdn.ca9.uscourts.gov/datastore/opinions/2025/11/12/23-927.pdf (fetched 2026-11-21)

Details:
- Caption: "UNITED STATES OF AMERICA," v. "JOSEPH SULLIVAN,"; "No. 23-927"; "D.C. No." "3:20-cr-00337-WHO-1"; "FOR PUBLICATION"
- "Argued and Submitted October 8, 2024"; "Filed March 13, 2025"; "Amended November 12, 2025"
- Panel: "Before: M. Margaret McKeown, Anthony D. Johnstone, and Ana de Alba, Circuit Judges." Opinion by Judge McKeown. No dissent or concurrence was found.
- Outcome: "AFFIRMED."
- November 2025 order: "The opinion filed March 13, 2025, is hereby amended." / "The petition for rehearing en banc is DENIED." / "No future petitions for rehearing or rehearing en banc will be entertained."
- Conclusion (amended opinion): "The verdict is not tainted by any of the claimed instructional or evidentiary errors," / "nor can it be overturned for insufficiency of the evidence." / "We affirm the district court in all relevant respects."
- Opening (amended): "Cybersecurity has become a major preoccupation of businesses as network hacks and data breaches multiply." / "Companies now turn to seasoned experts to address these challenges."
- **General counsel (court's own words):** "Sullivan did not inform Uber’s general counsel of these developments, despite telling other employees to the contrary." Also: "In August 2016, Sullivan took on the additional title of Deputy General Counsel."
- Misprision holding: "Because the hackers had not been given authorization by the time of access, their access was unauthorized." / "Their illegal conduct could not be laundered through an NDA." (The March 2025 staff summary words this as "could not be laundered through Uber's post hoc authorization". Use the amended opinion's sentence.)
- Bug bounty: "In ostensible exercise of the Bug Bounty Program, Uber paid the hackers $100,000" / "in exchange for their signatures on an NDA and an agreement to delete the downloaded data." In footnote 6 the court declines to decide: "We need not decide whether a bug bounty program may endow qualified researchers" / "with prior authorization to access protected computers."
- Duty: "Sullivan concedes that “Uber was duty-bound to respond to formal FTC inquiries issued to Uber.”"
- On § 1505, per the WebFetch paraphrase: the court held that circuit precedent (*Bhagat*) forecloses a separate "nexus" instruction. It found any error in the "duty to disclose" instruction harmless: "there is no reasonable possibility that the jury rested its conviction[]" on the invalid theory alone. **The game does not need this holding. Keep it out.**
- The opinion carries a staff summary that "constitutes no part of the opinion of the court". Quote the opinion, not the summary.

### 1d. Supreme Court (beyond the brief, verified because it ends the story)
URL: https://www.supremecourt.gov/docket/docketfiles/html/public/25-1082.html (fetched 2026-11-21)
- "Joseph Sullivan, Petitioner v. United States", No. 25-1082. The petition was filed 12 March 2026. The docket entry for 29 June 2026 reads: "Petition DENIED."

### Safe to state in game (framed as "what the court record says")
- On 5 October 2022 a federal jury in San Francisco convicted Uber's former Chief Security Officer of obstructing an FTC proceeding (18 U.S.C. § 1505) and of misprision of felony (18 U.S.C. § 4), two felonies.
- On 5 May 2023 he was sentenced to three years' probation and a $50,000 fine.
- Per DOJ: about 57 million users' records and 600,000 driver licence numbers; $100,000 in bitcoin in December 2016; NDAs that falsely said no data was taken; "can’t let this get out".
- Per DOJ: he kept working with the lawyers handling the FTC inquiry, including the General Counsel, and "never mentioned the incident to them".
- Per the Ninth Circuit: "Sullivan did not inform Uber’s general counsel of these developments".
- New management disclosed the breach publicly and to the FTC in November 2017.
- The Ninth Circuit affirmed in a published opinion (No. 23-927, filed 13 March 2025, amended 12 November 2025, rehearing en banc denied). The Supreme Court denied certiorari on 29 June 2026.
- The court's own line: "Their illegal conduct could not be laundered through an NDA."

### Must not say
- Any characterisation beyond the record: "cover-up mastermind", motives, his character, what he "should" have felt. Officials' quotes may be used only as quotes, with attribution.
- That he went to prison. He did not; the sentence was probation and a fine.
- That a bug bounty payment is itself illegal. The court expressly did not decide that (footnote 6).
- That the CSO had a legal duty to disclose to the public. The opinion contains the sentence "Section 2(b) also does not require a defendant to have a duty to disclose if prosecuted for inaction". Its surrounding context was not retrieved, so do not use it or turn it into a general rule.
- The exact number of counts in the indictment, which these documents do not give beyond "two felonies".
- Anything about civil suits, Uber's own settlements, or his current employment. None of it was verified.
- Quotes from the staff summary as though they were the court's words.

---

## 2. SEC v. SolarWinds Corp. and Timothy G. Brown

### 2a. Litigation Release 26423 (CONFIRMED)
URL: https://www.sec.gov/enforcement-litigation/litigation-releases/lr-26423 (fetched 2026-11-21)
- "Litigation Release No. 26423 / November 20, 2025"
- "Securities and Exchange Commission v. SolarWinds Corp. and Timothy G. Brown"; "No. 1:23-cv-09518-PAE (S.D.N.Y. filed Oct. 30, 2023)"
- Heading: "SEC Dismisses Civil Enforcement Action Against SolarWinds and Chief Information Security Officer"
- Body: "The U.S. Securities and Exchange Commission today filed a joint stipulation with Defendants" / "SolarWinds Corporation and its Chief Information Security Officer, Timothy G. Brown," / "to dismiss, with prejudice, the Commission’s ongoing civil enforcement action." / "As stated in the joint stipulation, the Commission’s decision to seek dismissal is" / "“in the exercise of its discretion”" / "and “does not necessarily reflect the Commission’s position on any other case.”"

### 2b. SDNY partial-dismissal opinion (fetched from the court's own site)
URL: https://nysd.uscourts.gov/sites/default/files/2024-07/SolarWinds%20Opinion%20Dkt.%20125-1.pdf (fetched 2026-11-21; first 100k of ~237k characters read)
- "23 Civ. 9518 (PAE)"; "OPINION & ORDER"; "Filed 07/18/24"; the judge is Paul A. Engelmayer ("PAUL A. ENGELMA YER, District Judge:" is OCR spacing).
- "For the reasons that follow, the Court denies in part, but grants in large part, the motion to dismiss."
- "As to pre-SUNBURST disclosures, the Court sustains the SEC's claims of securities fraud" / "based on the company's Security Statement."
- "The Court, however, dismisses the claims of securities fraud and false filings" / "based on other statements and filings."
- "As to post-SUNBURST disclosures, the Court dismisses all claims." / "These do not plausibly plead actionable deficiencies in the company's reporting of the cybersecurity hack."
- "Finally, the Court dismisses as ill-pied [OCR for "ill-pled"] the SEC's claims relating to SolarWinds' internal" / "accounting and disclosure controls and procedures."
- Standard of review (footnote 2): "the Court assumes all well-pied [OCR: "well-pled"] facts to be true and draws all reasonable inferences in favor of plaintiffs." This is why even the sustained claims were allegations only.

### 2c. SEC charging press release 2023-227 (the allegations)
URL: https://www.sec.gov/news/press-release/2023-227 (fetched 2026-11-21)
- Date: 30 October 2023. Title: "SEC Charges SolarWinds and Chief Information Security Officer with Fraud, Internal Control Failures"
- "The complaint alleges that, from at least its October 2018 initial public offering..."
- "SolarWinds allegedly misled investors by disclosing only generic and hypothetical risks..."
- The press release attributes this quote to Brown's 2018/2019 presentations: "current state of security leaves us in a very vulnerable state for our critical assets". The surrounding sentence came back paraphrased. **Re-check the exact framing in a browser before quoting it.**
- "its internal assessments, including a 2018 presentation prepared by a company engineer and shared internally"

### Safe to state in game (dojo discussion only, never a boss)
- In October 2023 the SEC *alleged* that SolarWinds and its CISO misled investors about cybersecurity practices and known risks.
- In July 2024 the court (Judge Engelmayer, S.D.N.Y.) "grants in large part" the motion to dismiss. It let only claims based on the pre-incident "Security Statement" proceed, at the pleading stage. It dismissed "all claims" about the post-incident disclosures, and the internal-controls claims.
- On 20 November 2025 the SEC filed a joint stipulation to dismiss the case "with prejudice", "in the exercise of its discretion" (Litigation Release No. 26423).
- Discussion frame: the gap between internal assessments and public statements is what the SEC *alleged*, and the case ended without any finding.

### Must not say
- That SolarWinds or Brown committed fraud, lied, or were found liable. There were no findings.
- That the court "found" the Security Statement false. It held the claim "viably pled", taking the allegations as true.
- Any reason the SEC dismissed, beyond the quoted "exercise of its discretion" language.
- Settlement terms, penalties, or payments. There were none in these documents.

---

## 3. SEC Form 8-K Item 1.05 (labelled comparison only)

URLs (fetched 2026-11-21):
- Fact sheet: https://www.sec.gov/files/33-11216-fact-sheet.pdf (title "Public Company Cybersecurity Disclosures; Final Rules"; no date printed in the fetched text)
- Final rule, Federal Register: https://www.govinfo.gov/content/pkg/FR-2023-08-04/html/2023-16194.htm. Header: "Release Nos. 33-11216; 34-97989; File No. S7-09-22". "Effective date: The amendments are effective September 5, 2023." The rule text was read at offset 360000.

**Rule text (codified amendments):**
- Item 1.05(a): "If the registrant experiences a cybersecurity incident that is determined by the registrant to be material," / "describe the material aspects of the nature, scope, and timing of the incident," / "and the material impact or reasonably likely material impact on the registrant," / "including its financial condition and results of operations."
- Timing, General Instruction B.1: "A report pursuant to Item 1.05 is to be filed within four business days after the registrant determines" / "that it has experienced a material cybersecurity incident."
- Materiality, Instruction 1 to Item 1.05: "A registrant's materiality determination regarding a cybersecurity incident must be made" / "without unreasonable delay after discovery of the incident."
- Delay, Item 1.05(c): "if the United States Attorney General determines that disclosure required by paragraph (a)" / "of this Item 1.05 poses a substantial risk to national security or public safety," / "and notifies the Commission of such determination in writing," ... "Disclosure may be delayed for an additional period of up to 30 days" ... "In extraordinary circumstances, disclosure may be delayed for a final additional period of up to 60 days". The preamble describes the initial period as up to 30 days.

**Fact sheet wording:**
- "file an Item 1.05 Form 8-K generally within four business days of such determination."
- "Registrants must determine the materiality of an incident without unreasonable delay"
- "The disclosure may be delayed if the United States Attorney General determines that immediate disclosure" / "would pose a substantial risk to national security or public safety and notifies the Commission of such" / "determination in writing."
- Item 106: "Item 106 will also require registrants to describe the board of directors’ oversight of risks" / "from cybersecurity threats and management’s role and expertise in assessing and managing material risks" / "from cybersecurity threats."

### Safe to state (labelled "real-world comparison: US public companies")
- The clock starts at the materiality *determination*, not at discovery: four business days after it.
- The determination itself must be made "without unreasonable delay after discovery".
- Only the US Attorney General can trigger the national-security or public-safety delay, by notifying the SEC in writing. The company cannot decide this itself.
- The determination is made "by the registrant". The rule does not say which officer makes it.

### Must not say
- That the rule applies to the Compact or the town. It does not; they are not SEC registrants.
- That the CISO makes the materiality determination. The rule says "the registrant".
- "Four days" or "four calendar days". It is business days, counted from the determination.
- That the delay can run indefinitely. Its periods are capped as quoted, subject to the rule's further provisions, which are not covered here.

---

## 4. NIST CSF 2.0 Implementation Examples

URL: https://www.nist.gov/system/files/documents/2024/02/21/CSF%202.0%20Implementation%20Examples.pdf. Printed title "NIST CSF 2.0 Implementation Examples", date "February 26, 2024". Fetched 2026-11-21.
Cross-check: NIST CSWP 29, https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf ("The NIST Cybersecurity Framework (CSF) 2.0", February 26, 2024). Fetched 2026-11-21.

**DISCREPANCY.** For GV.OV-03, the Implementation Examples PDF says "is **measured** and reviewed". CSWP 29 says "is **evaluated** and reviewed". I re-checked both. Use the CSWP 29 wording (the normative Core), which matches CAREER_LADDER §3.

**GV.OV (category, CSWP 29):** "Results of organization-wide cybersecurity risk management activities and performance are used to inform," / "improve, and adjust the risk management strategy"

- **GV.OV-01:** "Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction"
  - Ex1: "Measure how well the risk management strategy and risk results have helped leaders make decisions and" / "achieve organizational objectives"
  - Ex2: "Examine whether cybersecurity risk strategies that impede operations or innovation should be adjusted"
- **GV.OV-02:** "The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational" / "requirements and risks"
  - Ex1: "Review audit findings to confirm whether the existing cybersecurity strategy has ensured compliance with" / "internal and external requirements"
  - Ex2: "Review the performance oversight of those in cybersecurity-related roles to determine whether policy" / "changes are necessary"
  - Ex3: "Review strategy in light of cybersecurity incidents"
- **GV.OV-03 (CSWP 29):** "Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed"
  - Ex1: "Review key performance indicators (KPIs) to ensure that organization-wide policies and procedures achieve objectives"
  - Ex2: "Review key risk indicators (KRIs) to identify risks the organization faces, including likelihood and potential impact"
  - **Ex3 (reporting to leadership):** "Collect and communicate metrics on cybersecurity risk management with senior leadership"
- **GV.RR-01:** "Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is" / "risk-aware, ethical, and continually improving"
  - Ex1: "Leaders (e.g., directors) agree on their roles and responsibilities in developing, implementing, and assessing" / "the organization’s cybersecurity strategy"
  - Ex2: "Share leaders’ expectations regarding a secure and ethical culture, especially when current events present the" / "opportunity to highlight positive or negative examples of cybersecurity risk management"
  - Ex3: "Leaders direct the CISO to maintain a comprehensive cybersecurity risk strategy and review and update it" / "at least annually and after major events"
  - Ex4: "Conduct reviews to ensure adequate authority and coordination among those responsible for managing cybersecurity risk"
- **GV.RR-02:** "Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated," / "understood, and enforced"
  - Ex1: "Document risk management roles and responsibilities in policy"
  - **Ex2 (who is consulted and informed):** "Document who is responsible and accountable for cybersecurity risk management activities and how those teams" / "and individuals are to be consulted and informed"
  - Ex3: "Include cybersecurity responsibilities and performance requirements in personnel descriptions"
  - Ex4: "Document performance goals for personnel with cybersecurity risk management responsibilities, and periodically" / "measure performance to identify areas for improvement"
  - Ex5: "Clearly articulate cybersecurity responsibilities within operations, risk functions, and internal audit functions"

**RS.CO (category, both docs):** "Response activities are coordinated with internal and external stakeholders as required by laws," / "regulations, or policies"

- **RS.CO-02:** "Internal and external stakeholders are notified of incidents"
  - Ex1: "Follow the organization’s breach notification procedures after discovering a data breach incident," / "including notifying affected customers"
  - Ex2: "Notify business partners and customers of incidents in accordance with contractual requirements"
  - **Ex3 (notification needs management approval):** "Notify law enforcement agencies and regulatory bodies of incidents based on criteria in the incident response plan" / "and management approval"
- **RS.CO-03:** "Information is shared with designated internal and external stakeholders"
  - Ex1: "Securely share information consistent with response plans and information sharing agreements"
  - Ex2: "Voluntarily share information about an attacker’s observed TTPs, with all sensitive data removed," / "with an Information Sharing and Analysis Center (ISAC)"
  - Ex3: "Notify HR when malicious insider activity occurs"
  - **Ex4 (reporting to leadership):** "Regularly update senior leadership on the status of major incidents"
  - Ex5: "Follow the rules and protocols defined in contracts for incident information sharing between the organization" / "and its suppliers"
  - Ex6: "Coordinate crisis communication methods between the organization and its critical suppliers"

### Safe to state
- All of the subcategory texts above, using the CSWP 29 wording for GV.OV-03.
- The examples, labelled as "Implementation Examples". NIST offers them as illustrations, not requirements.
- RS.CO-02 Ex3 ties regulator and law-enforcement notification to "criteria in the incident response plan and management approval". This is the closest CSF text to "the disclosure decision isn't the CSO's alone".
- RS.CO-03 Ex4: "Regularly update senior leadership on the status of major incidents".

### Must not say
- That CSF 2.0 *requires* any of the examples, or that CSF names counsel. None of these texts mentions counsel or lawyers.
- The GV.OV-03 "measured" wording as the Core text.

---

## 5. NICE OG-WRL-007 Executive Cybersecurity Leadership

Role page: https://niccs.cisa.gov/tools/nice-framework/work-role/executive-cybersecurity-leadership (fetched 2026-11-21). The page lists 37 tasks and cites "NIST SP 800-181 Rev 1, Version 2.0.0".
**Version note:** CAREER_LADDER §3 says v2.2.0, but the NICCS page fetched today shows "Version 2.0.0". The extractor could not see the role ID or description on the role page. The ID **OG-WRL-007** is confirmed on each task page below ("Executive Cybersecurity Leadership (OG-WRL-007)").

Tasks that bear on incident reporting to leadership or external parties:

| Task | Exact text | Own NICCS page |
|---|---|---|
| T1221 | "Disseminate incident and other Computer Network Defense (CND) information" | **UNVERIFIED on its own page.** The page was not found by search, and direct fetch was refused. Confirmed only on the role page. |
| T1060 | "Advise senior management on organizational cybersecurity efforts" | Confirmed: https://niccs.cisa.gov/tools/nice-framework/task/t1060. Lists OG-WRL-007 among 5 roles. |
| T1310 | "Implement protective or corrective measures when a cybersecurity incident or vulnerability is discovered" | Confirmed: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1310. Roles OG-WRL-001, -007, -014. |
| T1054 | "Scope analysis reports to various audiences that accounts for data sharing classification restrictions" | Confirmed: https://niccs.cisa.gov/tools/nice-framework/task/t1054 (the grammar is NICE's own). |
| T0006 | "Advocate organization's official position in legal and legislative proceedings" | Confirmed: https://niccs.cisa.gov/tools/nice-framework/task/t0006. Roles OG-WRL-006 (Cybersecurity Legal Advice) and OG-WRL-007. |
| T1234 | "Develop Computer Network Defense (CND) guidance for organizational stakeholders" | Confirmed: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1234 |
| T1779 | "Coordinate strategic planning efforts with internal and external partners" | Confirmed: https://niccs.cisa.gov/tools/nice-framework/task/t1779. OG-WRL-007 is the only role. |
| T1476 | "Promote awareness of cybersecurity policy and strategy among management" | Confirmed: https://niccs.cisa.gov/tools/nice-framework/task/t1476 |
| T1020 | "Determine the operational and safety impacts of cybersecurity lapses" | Confirmed: https://niccs.cisa.gov/workforce-development/nice-framework/task/t1020. Shared by 51 roles, so it is not distinctive. |

### Safe to state
- T1060, T1310, T1054, T0006, T1234, T1779 and T1476 as OG-WRL-007 tasks, quoted exactly.
- T1221 as listed on the OG-WRL-007 role page. Cite the role page, not a task page.
- T0006 is shared with OG-WRL-006 Cybersecurity Legal Advice. This is a sourced link between the CISO and legal roles.

### Must not say
- That any OG-WRL-007 task mentions disclosure deadlines, regulators, a board, or counsel by name. None does.
- That OG-WRL-007 *is* the CISO job. It is the "closest" role (CAREER_LADDER §3).
- "v2.2.0" for the role page, unless it is re-checked. NICCS shows 2.0.0.

---

## Defender-side lessons the record supports

1. **The facts go to counsel.** DOJ says Sullivan worked with "the Uber lawyers handling or overseeing that inquiry, including the General Counsel of Uber, and never mentioned the incident to them". The Ninth Circuit says he "did not inform Uber’s general counsel". The record treats this silence as part of the offence conduct.
2. **Paperwork cannot rewrite what happened.** "Their illegal conduct could not be laundered through an NDA" (9th Cir.). NDAs that "falsely represented that the hackers did not take or store any data" were part of the concealment (DOJ).
3. **The disclosure decision belongs to the organisation's process, not to one person.** Under the SEC rule, materiality is determined "by the registrant" "without unreasonable delay after discovery", and the clock is four business days from that determination. CSF RS.CO-02 Ex3 ties regulator and law-enforcement notification to "criteria in the incident response plan and management approval". Only the Attorney General can grant a national-security or public-safety delay. (These are comparisons only; the Compact is not a registrant.)
4. **Keep leadership informed on a schedule.** CSF RS.CO-03 Ex4: "Regularly update senior leadership on the status of major incidents". GV.OV-03 Ex3: "Collect and communicate metrics on cybersecurity risk management with senior leadership". NICE T1060: "Advise senior management on organizational cybersecurity efforts".
5. **Write down who is told.** GV.RR-02 Ex2: "Document who is responsible and accountable ... and how those teams and individuals are to be consulted and informed".
6. **Public statements should match internal assessments.** This rests only on allegations (SEC v. SolarWinds), so it is framed as a question and never as a finding. The case was dismissed with prejudice on 20 November 2025.
