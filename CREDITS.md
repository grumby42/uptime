# Credits

Uptime is an original game. The story, characters (Rae Okafor, Vex, Marisol Diaz, Imani Brooks, Hal Benning, Bea Lindqvist, Ines Calloway, Wren Takahashi and others), tools (Sentry, Lanternkeep, Ledger, Keyling, Sieve, Sifter, Drillbit, Reportbird), the Tally assistant, threats, rules, the Quiet Thread and the pixel art are all original.

## Frameworks
- MITRE ATT&CK® technique IDs and names. © 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.
- MITRE ATT&CK® and ATT&CK® are registered trademarks of The MITRE Corporation.
- Technique IDs were re-checked against attack.mitre.org on 28 October 2026 (ATT&CK v20.0, released 13 October 2026); none of the IDs used changed between v19 and v20. In v19, Clear Windows Event Logs moved from T1070.001 to T1685.005 (Disable or Modify Tools), under the new Defense Impairment tactic; the game uses the current ID and mentions the old one.
- Defensive actions are written in our own words, in the style of MITRE D3FEND. No D3FEND content is reproduced.
- Function names come from the NIST Cybersecurity Framework (CSF) 2.0.

## Facts used
- Verizon 2025 Data Breach Investigations Report. Initial access (breaches where the vector was known, excluding Error and Misuse): credential abuse 22%, vulnerability exploitation 20%, phishing 16%. The game's malicious-alert weights keep these 2025 shares, labelled with the year.
- Verizon 2026 Data Breach Investigations Report, executive summary: exploitation of vulnerabilities "has risen to 31%" and is now the top known initial access vector; "credential abuse—the previous leader—is down to 13%". https://www.verizon.com/business/resources/executivebriefs/2026-dbir-executive-summary.pdf Ransomware appeared in 88% of breaches at small and medium organisations, against 39% at large ones.
- Critical Start 2021 SOC professional survey (100 respondents): 68% said 25–75% of the alerts they investigate daily are false positives.
- NIST SP 800-63B-4 (2025), §3.1.1.2: passwords used on their own must be at least 15 characters; verifiers must not impose composition rules or periodic changes, must force a change on evidence of compromise, and must check new passwords against a blocklist. https://pages.nist.gov/800-63-4/sp800-63b/authenticators/
- Joint Cybersecurity Advisory AA24-038A, *PRC State-Sponsored Actors Compromise and Maintain Persistent Access to U.S. Critical Infrastructure* (CISA, NSA, FBI and partner agencies, 7 February 2024), on Volt Typhoon: access to some victim IT environments for at least five years, valid accounts, living-off-the-land tools, selective log clearing, compromised small-office/home-office routers, and pre-positioning for disruption of operational technology. It is the real-world basis for the Quiet Thread, which is a composite: its people, hosts, times and events are invented (game). https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-038a

## Facts used in the Mail Room
- FBI Internet Crime Complaint Center, *2025 Internet Crime Report* (released April 2026): 24,768 business email compromise complaints with reported losses of $3,046,598,558; the Financial Fraud Kill Chain handled 3,900 incidents, $1.16 billion attempted, $679 million frozen (58%); advice to contact your financial institution immediately to request a recall and to file at ic3.gov regardless of the amount. https://www.ic3.gov/AnnualReport/Reports/2025_IC3Report.pdf
- IETF RFC 9989, DMARC (May 2026; obsoletes RFC 7489 and RFC 9091): alignment, what a pass does and does not prove. https://www.rfc-editor.org/rfc/rfc9989.html
- IETF RFC 7208 (SPF), RFC 6376 (DKIM), RFC 8601 (Authentication-Results), RFC 5321 (SMTP; Received trace lines added at the top). RFC 2606 (.example) and RFC 5737 (documentation IP ranges) for the invented domains and addresses.
- CISA, *Implementing Number Matching in MFA Applications* (October 2022). https://www.cisa.gov/sites/default/files/publications/fact-sheet-implement-number-matching-in-mfa-applications-508c.pdf
- US Federal Trade Commission press release, April 2025: consumers reported losing $470 million to scams that started with text messages in 2024; the five most-reported scams (fake package delivery, bogus job offers, fake fraud alerts, fake unpaid tolls, “wrong number” texts); forward spam texts to 7726. https://www.ftc.gov/news-events/news/press-releases/2025/04/new-ftc-data-show-top-text-message-scams-2024-overall-losses-text-scams-hit-470-million
- Chromium `ui/base/page_transition_types.h` for the browser-history transition names (LINK, FORM_SUBMIT, server/client redirect, chain start/end). Checked 28 October 2026: CLIENT_REDIRECT is “Redirects caused by JavaScript or a meta refresh tag on the page”, SERVER_REDIRECT is “Redirects sent from the server by HTTP headers”, CHAIN_START is “The beginning of a navigation chain”, CHAIN_END is “The last transition in a redirect chain”, and FORM_SUBMIT is not always recorded. https://chromium.googlesource.com/chromium/src/+/refs/heads/main/ui/base/page_transition_types.h
- Microsoft Threat Intelligence, *From cookie theft to BEC: Attackers use AiTM phishing sites as entry point to further financial fraud* (12 July 2022): an adversary-in-the-middle proxy captures the password and the session cookie; with the cookie the attacker can “skip the authentication process, even if the target's MFA is enabled”; the attackers then set inbox rules to hide BEC; mitigations include phish-resistant MFA (FIDO2, certificate-based). Basis for drill 1. https://www.microsoft.com/en-us/security/blog/2022/07/12/from-cookie-theft-to-bec-attackers-use-aitm-phishing-sites-as-entry-point-to-further-financial-fraud/
- Microsoft Learn, *Token theft playbook* (tokens replayed “even if that user has satisfied multifactor authentication”; containment pairs a password reset with revoking current tokens) and *Refresh tokens in the Microsoft identity platform* (revocation table: some token and cookie classes “stay alive” after a user password change). Basis for “revoke sessions first” and for the consent-phishing note that a reset may not cut off an app’s token. https://learn.microsoft.com/security/operations/token-theft-playbook · https://learn.microsoft.com/en-ca/entra/identity-platform/refresh-tokens
- IETF RFC 6238 (TOTP), §4 and §5.2: default time step 30 seconds; at most one time step of network delay recommended. Why a code captured minutes earlier could not have been used, so drill 1 relays a push approval instead. Read via the IETF datatracker copy of draft-mraihi-totp-timebased-08, published as RFC 6238. https://www.rfc-editor.org/rfc/rfc6238
- UK National Cyber Security Centre, *Phishing attacks: defending your organisation*: “Avoid creating a punishment or blame-oriented culture around phishing”; “Users who fear reprisals will not report mistakes promptly, if at all”; “Quickly provide feedback on what action has been taken, and make it clear that their contributions make a difference.” Basis for the reporting-culture feedback (a report of safe mail is never a mistake). https://www.ncsc.gov.uk/pdfs/guidance/phishing.pdf
- Microsoft Learn, *Control automatic external email forwarding in Microsoft 365*: disabling automatic forwarding disables inbox rules that redirect to external addresses; the default changed to off in 2021 for most, but not all, organisations. Context for the Quiet Thread’s forwarding-rule clue (a control gap, not an undetectable rule). https://learn.microsoft.com/en-us/defender-office-365/outbound-spam-policies-external-email-forwarding
- NIST CSWP 29, *The NIST Cybersecurity Framework (CSF) 2.0*: preserving incident data and its provenance (RS.AN-07) and incident reporting and communication (RS.CO) are Respond functions, used for the tabletop cards. https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf
- Mail Room ATT&CK IDs were checked on attack.mitre.org in October 2026 (ATT&CK v20): T1566.001, T1566.002, T1566.004, T1586.002, T1684.001, T1657, T1621, T1528, T1660 (ATT&CK for Mobile), T1098.005, T1564.008, T1114.003, T1589.002, T1592.002, T1593.001, T1078. The supplier-mailbox BEC maps to T1586.002 (plus T1684.001 and T1657), not T1534 Internal Spearphishing, which covers lateral movement from an already-compromised account inside the victim organisation.

## Inspiration only
These works inspired the genre; no names, art, cards or other material from them are used, and Uptime is not affiliated with or endorsed by any of them:
- classic handheld monster-collecting RPGs
- the 1990s CGI series set inside a computer
- incident-response card games such as Backdoors & Breaches by Black Hills Information Security
- the National Cyber League / Cyber Skyline
- the investigation drills: Chris Sanders's Investigation Path posts (inspiration only; every case is original and none of his material is reproduced)

Uptime is an independent learning game. It is not affiliated with, sponsored by or endorsed by Nintendo, The Pokémon Company, Mainframe Entertainment or any other rights holder of ReBoot, Black Hills Information Security, the National Cyber League, Cyber Skyline, or The MITRE Corporation. Their names and marks belong to their owners.

Anything invented for play is labelled "(game)" in the in-game Field Manual.

## MITRE ATT&CK® licence

Reproduced exactly from MITRE's Terms of Use (https://attack.mitre.org/resources/legal-and-branding/terms-of-use/; same text as MITRE's published LICENSE.txt for ATT&CK data), as the licence requires. The same text is on the in-game Credits screen.

```
License
-------
The MITRE Corporation (MITRE) hereby grants you a non-exclusive, royalty-free license to use ATT&CK® for research,
development, and commercial purposes. Any copy you make for such purposes is authorized provided that you reproduce
MITRE's copyright designation and this license in any such copy.

"© 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation."

Disclaimers
-----------
MITRE does not claim ATT&CK enumerates all possibilities for the types of actions and behaviors documented as part
of its adversary model and framework of techniques. Using the information contained within ATT&CK to address or cover
full categories of techniques will not guarantee full defensive coverage as there may be undisclosed techniques or
variations on existing techniques not documented by ATT&CK.

ALL DOCUMENTS AND THE INFORMATION CONTAINED THEREIN ARE PROVIDED ON AN "AS IS" BASIS AND THE CONTRIBUTOR, THE
ORGANIZATION HE/SHE REPRESENTS OR IS SPONSORED BY (IF ANY), THE MITRE CORPORATION, ITS BOARD OF TRUSTEES, OFFICERS,
AGENTS, AND EMPLOYEES, DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTY THAT
THE USE OF THE INFORMATION THEREIN WILL NOT INFRINGE ANY RIGHTS OR ANY IMPLIED WARRANTIES OF MERCHANTABILITY OR
FITNESS FOR A PARTICULAR PURPOSE.
```

