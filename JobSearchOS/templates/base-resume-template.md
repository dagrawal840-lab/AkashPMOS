# Base Resume Template

This is your master resume. Every `/resume-tailor` output starts from this base and selects/rewrites bullets to match a specific JD. Keep this file comprehensive -- include everything. Tailoring is about selecting the right subset, not writing from scratch each time.

## Instructions

1. Paste your current resume below, following the structure
2. Run: "Help me organize my base resume using the experience library"
3. Claude will cross-reference `context-library/experience-library.md` and fill in the structured version
4. Review, add anything missing, remove anything outdated
5. This file should have MORE bullets than any single tailored resume (tailored resumes select the best 3-5 per role)

---

## [YOUR FULL NAME]

**Contact:**
[Email] | [Phone] | [LinkedIn URL] | [City, State]

---

### Summary

<!--
Write 2-3 versions below. /resume-tailor selects the best one based on the JD
and may modify it to incorporate addressing-weaknesses strategy from career-plan.md.
Keep each under 3 lines. Lead with your strongest qualification for the target role type.
-->

**Version A (for [role type, e.g., "Growth PM roles"]):**
[2-3 sentence summary emphasizing growth/metrics experience. Include years of experience, biggest scope/impact metric, and the skill that most differentiates you.]

**Version B (for [role type, e.g., "AI/ML PM roles"]):**
[2-3 sentence summary emphasizing technical/AI experience. Reframe your experience toward this domain.]

**Version C (for [role type, e.g., "Platform PM roles"]):**
[2-3 sentence summary emphasizing platform/infrastructure experience.]

---

### Experience

<!--
For each role, include ALL bullets you might ever use.
/resume-tailor selects the best 3-5 per role based on the JD.
Tag each bullet with the skill category it demonstrates.
Use this format: metric + context + action + result.
Every bullet should have a number in it. If it doesn't, add one or flag it for the experience library.
-->

#### [Job Title] | [Company Name] | [Start Date] - [End Date/Present]
[One-line scope statement: team size, product area, user base, revenue responsibility]

- [GROWTH] [Bullet with specific metric, e.g., "Increased user activation from 23% to 38% (65% lift) by redesigning the onboarding flow, impacting 2M+ new users annually"]
- [GROWTH] [Another growth/metrics bullet]
- [TECHNICAL] [Bullet demonstrating technical depth]
- [LEADERSHIP] [Bullet demonstrating cross-functional leadership, include team size]
- [STRATEGY] [Bullet demonstrating strategic thinking]
- [EXECUTION] [Bullet demonstrating shipping/execution ability]
- [CUSTOMER] [Bullet demonstrating customer insight or research]

#### [Previous Job Title] | [Company Name] | [Start Date] - [End Date]
[One-line scope statement]

- [TAG] [Bullet]
- [TAG] [Bullet]
- [TAG] [Bullet]
- [TAG] [Bullet]
- [TAG] [Bullet]

#### [Previous Job Title] | [Company Name] | [Start Date] - [End Date]
[One-line scope statement]

- [TAG] [Bullet]
- [TAG] [Bullet]
- [TAG] [Bullet]

<!--
Add as many roles as relevant. For older roles (5+ years ago), keep to 2-3 bullets.
For your most recent 2 roles, include 5-8 bullets each.
-->

---

### Skills

<!--
Organize by category. /resume-tailor reorders these to match JD keywords.
Include both the full term and abbreviation for ATS matching.
Only include skills you can speak to in an interview.
-->

**Product Management:** [e.g., Roadmapping, A/B Testing (Experimentation), PRDs, User Stories, OKRs, Product Strategy, Go-to-Market]

**Technical:** [e.g., SQL, Python, Data Analysis, API Design, Machine Learning (ML), Agile/Scrum]

**Tools:** [e.g., Amplitude, Mixpanel, Tableau, Figma, Jira, Notion, dbt]

**Domain:** [e.g., Fintech, Payments, Consumer Products, B2B SaaS, Marketplace]

---

### Education

#### [Degree] | [University Name] | [Graduation Year]
[Honors, relevant coursework, or activities -- only if notable or role-relevant]

#### [Degree] | [University Name] | [Graduation Year]
[Same as above]

---

### Certifications / Additional (Optional)

- [Certification, e.g., "AWS Cloud Practitioner"]
- [Notable achievement, e.g., "Speaker, ProductCon 2024"]
- [Publication, e.g., "Author, product-growth.com (50K subscribers)"]
- [Language skills if relevant to role/location]

---

## Bullet Tag Reference

Use these tags when adding new bullets so `/resume-tailor` can efficiently match them to JD requirements:

| Tag | What It Demonstrates | When JD Asks For |
|---|---|---|
| GROWTH | Revenue, engagement, or adoption metrics | "Drive growth," "improve metrics," "data-driven" |
| TECHNICAL | Engineering collaboration, technical decisions, APIs, ML | "Technical PM," "work with engineers," "system design" |
| LEADERSHIP | Managing people, cross-functional work, influence | "Lead a team," "cross-functional," "stakeholder management" |
| STRATEGY | Vision, roadmap, competitive analysis, market sizing | "Product strategy," "product vision," "market analysis" |
| EXECUTION | Shipping products, project management, deadlines | "Ship products," "execution-oriented," "deliver results" |
| CUSTOMER | User research, customer interviews, insight-driven decisions | "Customer-focused," "user research," "voice of customer" |
| DOMAIN | Industry-specific knowledge | Specific industry mentioned in JD |

## Maintenance

- Update this file when you get new metrics or ship something notable
- After each `/resume-tailor` run, check if the selected bullets are the strongest available -- if not, improve the base
- Quarterly: remove outdated bullets, add recent accomplishments
- Cross-reference with `context-library/experience-library.md` to ensure nothing is missing
