# PRD: Guided Setup Checklist (Activation)

**Author:** Priya Raman (PM, Growth) · **Draft v0.4** · Last edited 2026-07-14
**Reviewers:** Dan Okafor (Eng Lead), Mei Lin (Design), Sasha Bell (Data)
**Review scheduled:** 2026-07-17, 10:00 PT

---

## 1. Hypothesis

If we replace the empty-state dashboard with a guided setup checklist for new workspace admins, 7-day activation will rise from 23% to 30% within one quarter, because admins who complete three core setup actions in their first session retain at roughly 3x the rate of those who don't.

## 2. Problem

New workspace admins land on an empty dashboard after signup and 61% take no action in their first session (Amplitude, `new_workspace_created` cohort, May 2026, n=4,812). Support tags show "how do I get started" as the #2 ticket category for accounts under 14 days old (Zendesk, Q2). Our 7-day activation rate has been flat at 22–24% for three quarters.

Sales-assisted accounts don't have this problem because a CSM walks them through setup. Self-serve accounts — 78% of new signups since the March pricing change — get nothing.

## 3. Strategic fit

Q3 O1 is activation (KR1: 7-day activation 23% → 35%). This is the highest-RICE item on the activation backlog (score 128 vs. 96 for onboarding emails rework). Since most new admins arrive from the Chrome extension install flow, the checklist will be their first meaningful in-product touchpoint, which is why we're prioritizing it over lifecycle email.

## 4. Solution

Replace the empty dashboard for new workspace admins with a 4-step checklist card:

1. **Invite a teammate** — opens the existing invite modal, pre-filled with domain-matched suggestions.
2. **Connect a data source** — deep-links into the integrations catalog, top 3 sources pinned (Salesforce, HubSpot, Postgres).
3. **Create your first report** — launches the report builder with the "Pipeline overview" template pre-selected.
4. **Set a weekly digest** — one-click enable, defaults to Monday 9am workspace-local time.

Checklist state persists per-admin in `workspace_settings.onboarding`. Completing all four steps triggers a confetti moment and collapses the card to a dismissible banner. The card auto-dismisses after 21 days regardless of completion.

Steps can be completed in any order. Progress is shown as "2 of 4 complete."

If the admin invites a teammate who then becomes an admin, the second admin sees the checklist reflecting workspace-level progress.

## 5. Success metrics

- **Primary:** activation rate improves from 23% to 30% for the treated cohort by end of quarter.
- **Secondary:** checklist completion rate (all 4 steps) ≥ 35% within 7 days of workspace creation.
- **Guardrail:** support ticket volume for sub-14-day accounts does not increase; time-to-first-report does not regress for the control group.

We'll run this as a 50/50 experiment on new self-serve workspaces, evaluated after 4 weeks of enrollment plus a 7-day maturation window. Sasha's team owns the readout.

## 6. Rollout

- Week 1–2: build behind `guided_setup_v1` flag.
- Week 3: internal dogfood on staging workspaces.
- Week 4: 50/50 experiment starts for new self-serve workspaces (existing workspaces are excluded).
- Ship decision at 4 weeks + maturation.

## 7. Non-goals

- **Mobile:** the checklist ships web-only. Mobile admins (~9% of new admin sessions) see the current empty state. A mobile variant is deliberately out of scope for v1 and tracked as GROW-2214 for Q4.
- **Localization:** English only for v1.
- Sales-assisted accounts: excluded entirely; CSM playbooks already cover setup.
- Reworking the invite modal or integrations catalog themselves — we deep-link into them as-is.

## 8. Open questions

- Copy review with brand (owner: Mei, due 7/16).
- Confetti asset — reuse the one from the referral launch?

---

*Appendix A: Amplitude cohort definitions available in the #growth-analytics canvas. Figma flows: GS-checklist-v4.*
