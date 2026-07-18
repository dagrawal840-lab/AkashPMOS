# North Star & OKRs — Relay, Q3 2026 (Jul–Sep)

## North Star metric

**weekly_active_accounts** — paid accounts with ≥1 workflow run that
week (source: `metrics-history.csv`, owner: Marcus, Core PM). Chosen
because it's the closest single number to "customers getting value
this week," and every other metric on the WBR list is either a feeder
into it (new_trials → trial_to_paid_conversion → weekly_active_accounts)
or a consequence of it (net_new_arr, churned_arr, support_ticket_volume).

Target for Q3 2026: 6,000 by 2026-09-28 (quarter end). Baseline at
quarter start (2026-06-29): 5,433.

## OKRs

### O1 — Grow active usage of Relay
- KR1: weekly_active_accounts 5,433 → 6,000 by end of Q3 (quarter start → target)
- KR2: ai_assist_adoption 24.5% → 40% by end of Q3 (quarter start → target)

### O2 — Convert trial interest into paid usage
- KR1: trial_to_paid_conversion held ≥ 17% weekly average across Q3
  (quarter-start run-rate was ~18%; this KR is at risk — see WBR watch
  item on trial_to_paid_conversion)
- KR2: new_trials weekly volume ≥ 420 average across Q3

### O3 — Protect the reliability bar while shipping AI Assist v2
- KR1: api_uptime ≥ 99.9% every week of Q3 (hard floor, zero
  tolerance — same threshold as the WBR metric list)
- KR2: support_ticket_volume weekly average ≤ 650 across Q3

Owner for all OKRs: Marcus (Core PM), reviewed monthly with the exec
team; weekly progress is tracked via the metrics already on the WBR
list — no new metrics are introduced by the OKR layer, only the target
lines drawn against them.
