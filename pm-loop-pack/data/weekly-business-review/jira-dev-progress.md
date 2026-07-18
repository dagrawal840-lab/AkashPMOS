# Jira dev progress — Relay, sprint export (as of 2026-07-17)

Source: Jira export, project RELAY, filtered to epics tagged Q3-OKR.
Sprint 2026-07-13 → 2026-07-24 ("Sprint 29"), day 3 of 10.

| Epic | Linked OKR | Status | Story points (done / total) | Target ship | Notes |
|---|---|---|---|---|---|
| RELAY-1180 — AI Assist v2 (prep cards, CRM context) | O1-KR2 (ai_assist_adoption) | In progress | 18 / 34 | 2026-07-31 | On track; CRM-context surfacing (deal amount, thread summary) is the last unstarted story (RELAY-1191, 8pts) |
| RELAY-1142 — Trial activation redesign | O2-KR1 (trial_to_paid_conversion) | In progress | 9 / 21 | 2026-08-07 | Started 2026-07-06 in direct response to the conversion watch item; first A/B cohort ships with Sprint 30 |
| RELAY-1205 — Workflow run reliability (root-causing the support ticket spike) | O3-KR2 (support_ticket_volume) | In progress | 5 / 13 | 2026-07-24 | Opened 2026-07-14, one day after this week's WBR flagged support_ticket_volume; root cause identified as a connector timeout in the Salesforce integration (RELAY-1206), fix in code review |
| RELAY-1160 — API uptime hardening (failover automation) | O3-KR1 (api_uptime) | Done | 13 / 13 | 2026-07-10 (shipped) | Closed 2026-07-10; api_uptime has stayed at or above 99.95% every week since |
| RELAY-1090 — Onboarding checklist v2 | O1-KR1 (weekly_active_accounts) | Done | 21 / 21 | 2026-06-26 (shipped) | Shipped 2026-06-26; weekly_active_accounts has grown every week since (5,301 → 5,512) |

## Sprint 29 burndown (points remaining, RELAY-1180/1142/1205 only)

| Day | Points remaining |
|---|---|
| Day 1 (2026-07-13) | 60 |
| Day 2 (2026-07-14) | 55 |
| Day 3 (2026-07-15) | 44 |

Day 3 pace (44 remaining, 7 days left in sprint) implies ~6.3 pts/day
needed to close Sprint 29's committed scope — team's trailing velocity
is 5.8 pts/day (Sprint 28 actuals), so Sprint 29 is trending ~1-2 points
short absent a scope cut or velocity increase.
