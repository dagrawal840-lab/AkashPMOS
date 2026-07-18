# Metric definitions — weekly business review

Product: Relay (B2B SaaS workflow automation). Weeks run Monday–Sunday
and are keyed by their Monday (`week_start`).

Warehouse export lands every Monday ~05:00 PT at
`data/weekly-business-review/metrics-history.csv`
(columns: week_start,metric,value,unit). One row per metric per week.

NPS is the exception: it comes from the survey vendor's separate
export at `data/weekly-business-review/nps-export.csv`, which the
vendor delivers on its own schedule and sometimes not at all.

| Metric | Source | Definition | Owner |
|---|---|---|---|
| new_trials | metrics-history.csv | New workspaces starting a 14-day trial that week | Priya (Growth) |
| trial_to_paid_conversion | metrics-history.csv | % of trials started 14 days prior that converted to a paid plan | Priya (Growth) |
| weekly_active_accounts | metrics-history.csv | Paid accounts with ≥1 workflow run that week | Marcus (Core PM) |
| ai_assist_adoption | metrics-history.csv | % of weekly active accounts using AI Assist ≥1x | Marcus (Core PM) |
| net_new_arr | metrics-history.csv | New + expansion ARR booked that week, $k | Dana (RevOps) |
| churned_arr | metrics-history.csv | ARR lost to churn + contraction that week, $k | Dana (RevOps) |
| support_ticket_volume | metrics-history.csv | Tickets opened that week, all tiers | Jonah (Support) |
| api_uptime | metrics-history.csv | Weekly API availability, % | Elena (Platform) |
| nps | nps-export.csv | Rolling 4-week NPS from in-app survey | Priya (Growth) |
