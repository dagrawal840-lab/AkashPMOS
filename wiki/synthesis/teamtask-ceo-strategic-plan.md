---
title: "TeamTask CEO Strategic Plan — Discovery Phase"
category: decision
created: 2026-06-06
last_updated: 2026-06-06
source_count: 1
---

Synthesized from the [[teamtask-mark-discovery-interview]] discovery interview. This plan translates Mark's pain points into a CEO-level strategic roadmap for TeamTask's initial product direction, GTM positioning, and growth hypothesis.

[Source: raw/2026-06-06-teamtask-mark-discovery-interview.md]

---

## Executive Summary

[DECISION] TeamTask's winning position is **radical simplicity for cross-functional campaign teams** — not another feature-rich PM tool. The market gap is not missing features; it's missing adoption. One interview confirmed the pattern; validate with 5–10 more before committing to build.

---

## 1. Strategic Bets

### Bet 1: Win on Adoption, Not Features
[HYPOTHESIS] Teams like Mark's have already tried "full-featured" PM tools and abandoned them. TeamTask wins by being the tool that actually gets used — frictionless onboarding, zero maintenance overhead, and a UI that non-PMs can operate without training.

**Implication:** Every feature decision goes through an adoption gate: *Will a freelance contractor use this on day one with no training?*

### Bet 2: Visibility as the Core Value Prop
[HYPOTHESIS] The primary job-to-be-done is not task management — it's **status transparency**. Mark's 10 PM late night was caused by invisible blockers, not missing features. The product must make "what's blocked and who owns it" the default view, not a custom report.

**Implication:** The homepage/dashboard IS the product. Everything else is secondary.

### Bet 3: Dependency Notifications as the Killer Feature
[HYPOTHESIS] The spring launch incident was caused by a missing handoff notification (writer → designer). Automated blocking-task alerts directly prevent this class of failure. No competitor in the "simple PM" tier solves this well.

**Implication:** Prioritize task dependency detection and proactive alerts in V1 over advanced features (timelines, resource planning, integrations).

---

## 2. Target Customer

**Primary ICP (Ideal Customer Profile):**
- Marketing, creative, or content teams at SMBs (20–200 employees)
- Mix of FTEs and freelancers/contractors
- Runs time-sensitive, multi-asset campaigns (launches, drops, content calendars)
- Has tried and abandoned a major PM tool
- Decision-maker is a team lead or manager, not an IT buyer

**Anti-ICP (do not optimize for):**
- Engineering/dev teams (Jira-native, different workflow)
- Enterprise (long sales cycle, compliance requirements, not aligned to simplicity bet)
- Solo users (no coordination problem to solve)

---

## 3. Product Priorities (V1 Scope)

| Priority | Feature | Rationale |
|----------|---------|-----------|
| P0 | Status dashboard — asset, owner, on-track/behind | Core value prop; first thing Mark described |
| P0 | Task dependency links + automated blocker alerts | Directly prevents the critical incident pattern |
| P0 | Freelancer/external collaborator access with zero-onboarding UX | Adoption hard constraint; freelance designer is a real user |
| P1 | Simple task check-off flow (mobile-friendly) | Writers and designers just need to mark done |
| P1 | Deadline and overdue notifications | Replaces Mark's manual Slack pings |
| P2 | Slack integration (read/write task status from Slack) | Meet teams where they already are |
| Out of scope V1 | Custom views, folder hierarchies, resource planning, time tracking | These killed adoption at Mark's prior tool |

---

## 4. Go-to-Market Hypothesis

[HYPOTHESIS] **Bottom-up PLG (Product-Led Growth)** via the frustrated manager persona.

- Channel: SEO and content targeting "alternatives to [major PM tool]" + "simple project management for marketing teams"
- Motion: Free tier for teams ≤5 users; paid per seat above that
- Activation hook: "Set up your first launch in 5 minutes" — onboarding flow ends with a live dashboard showing one real campaign
- Expansion: Managers invite freelancers → freelancers bring TeamTask to other clients → organic cross-company spread

**Key GTM assumption to validate:** Mark is not an outlier. Run 10 more discovery interviews with marketing/creative team leads to confirm the ICP and the adoption-failure pattern.

---

## 5. Success Metrics (Year 1)

| Metric | Target | Why |
|--------|--------|-----|
| Weekly Active Teams | 500 | Proxy for real adoption, not just sign-ups |
| Day-30 Retention | >50% | Adoption bet lives or dies here |
| Time-to-First-Dashboard | <5 min | Onboarding hard constraint |
| Paid Conversion (free→paid) | >15% | PLG viability signal |
| NPS | >40 | "Simple and it works" brand signal |

[NEED: baseline retention and conversion benchmarks from comparable PLG tools in the SMB PM space]

---

## 6. Risks and Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Single interview skews ICP | High | Run 9 more interviews before committing roadmap |
| "Simple" is subjective; teams disagree on what simple means | Medium | Usability test the dashboard with 3 real users before dev |
| Slack integration becomes must-have for adoption, not P2 | Medium | Prototype a Slack-native interaction in parallel |
| Competitor launches a simpler tier before we ship | Low-Medium | Speed is the moat; ship V1 in ≤12 weeks |
| Freelancer UX conflicts with manager UX (different needs) | Medium | Design both personas' flows before building |

---

## 7. Immediate Next Steps (CEO Action Items)

1. **Validate ICP** — schedule 9 more discovery interviews with marketing/creative team leads at SMBs. Target 2 interviews/week.
2. **Define "simple" concretely** — run a 3-person usability test on a dashboard mockup before writing a single line of code.
3. **Prototype the dependency alert** — build a clickable prototype of the blocker notification flow; show it to Mark or a similar persona for reaction.
4. **Set a V1 ship date** — commit to a public beta in ≤12 weeks. Simplicity erodes if the roadmap grows unchecked.
5. **Hire/contract a designer** — the entire value prop lives in the dashboard UX; this is not an engineering-first build.
