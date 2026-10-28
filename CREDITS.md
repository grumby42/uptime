# Credits

Uptime is an original game. The story, characters (Rae Okafor, Vex, Marisol Diaz, Imani Brooks, Hal Benning, Bea Lindqvist, Ines Calloway, Wren Takahashi and others), tools (Sentry, Lanternkeep, Ledger, Keyling, Sieve, Sifter, Drillbit, Reportbird), the Tally assistant, threats, rules, the Quiet Thread and the pixel art are all original.

## Frameworks
- MITRE ATT&CK® technique IDs and names. © The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.
- ATT&CK is a registered trademark of The MITRE Corporation.
- Technique IDs were checked against attack.mitre.org in October 2026 (ATT&CK v19). In v19, Clear Windows Event Logs moved from T1070.001 to T1685.005 (Disable or Modify Tools), under the new Defense Impairment tactic; the game uses the current ID and mentions the old one.
- Defensive actions are written in our own words, in the style of MITRE D3FEND. No D3FEND content is reproduced.
- Function names come from the NIST Cybersecurity Framework (CSF) 2.0.

## Facts used
- Verizon 2025 Data Breach Investigations Report. Initial access: credential abuse 22%, vulnerability exploitation 20%, phishing 16%. Ransomware appeared in 88% of breaches at small and medium organisations, against 39% at large ones.
- Critical Start 2021 SOC professional survey (100 respondents): 68% said 25–75% of the alerts they investigate daily are false positives.
- NIST SP 800-63B: favours password length over composition rules.
- Joint Cybersecurity Advisory AA24-038A, *PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure* (CISA, NSA, FBI and partner agencies, 7 February 2024), on Volt Typhoon: access to some victim IT environments for at least five years, valid accounts, living-off-the-land tools, selective log clearing, compromised small-office/home-office routers, and pre-positioning for disruption of operational technology. It is the real-world basis for the Quiet Thread, which is a composite: its people, hosts, times and events are invented (game). https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a

## Facts used in the Mail Room
- FBI Internet Crime Complaint Center, *2025 Internet Crime Report* (released April 2026): 24,768 business email compromise complaints with reported losses of $3,046,598,558; the Financial Fraud Kill Chain handled 3,900 incidents, $1.16 billion attempted, $679 million frozen (58%); advice to contact your financial institution immediately to request a recall and to file at ic3.gov regardless of the amount. https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf
- IETF RFC 9989, DMARC (May 2026; obsoletes RFC 7489 and RFC 9091): alignment, what a pass does and does not prove. https://www.rfc-editor.org/rfc/rfc9989.html
- IETF RFC 7208 (SPF), RFC 6376 (DKIM), RFC 8601 (Authentication-Results), RFC 5321 (SMTP; Received trace lines added at the top). RFC 2606 (.example) and RFC 5737 (documentation IP ranges) for the invented domains and addresses.
- CISA, *Implementing Number Matching in MFA Applications* (October 2022). https://www.cisa.gov/sites/default/files/publications/fact-sheet-implement-number-matching-in-mfa-applications-508c.pdf
- US Federal Trade Commission press release, April 2025: $470 million lost to text scams in 2024; common lures; forward spam texts to 7726. https://www.ftc.gov/news-events/news/press-releases/2025/04/new-ftc-data-show-top-text-message-scams-2024-overall-losses-text-scams-hit-470-million
- Chromium `ui/base/page_transition_types.h` for the browser-history transition names (LINK, FORM_SUBMIT, server/client redirect). https://chromium.googlesource.com/chromium/src/+/refs/heads/main/ui/base/page_transition_types.h
- Mail Room ATT&CK IDs were checked on attack.mitre.org in October 2026 (ATT&CK v20): T1566.001, T1566.002, T1566.004, T1586.002, T1684.001, T1657, T1621, T1528, T1660 (ATT&CK for Mobile), T1098.005, T1564.008, T1114.003, T1589.002, T1592.002, T1593.001. The supplier-mailbox BEC maps to T1586.002 (plus T1684.001 and T1657), not T1534 Internal Spearphishing, which covers lateral movement from an already-compromised account inside the victim organisation.

## Inspiration only
These works inspired the genre; no names, art, cards or other material from them are used:
- classic handheld monster-collecting RPGs
- the 1990s CGI series set inside a computer
- incident-response card games such as Backdoors & Breaches by Black Hills Information Security
- the National Cyber League / Cyber Skyline
- the investigation drills: Chris Sanders's Investigation Path posts (inspiration only; every case is original and none of his material is reproduced)

Anything invented for play is labelled "(game)" in the in-game Field Manual.
