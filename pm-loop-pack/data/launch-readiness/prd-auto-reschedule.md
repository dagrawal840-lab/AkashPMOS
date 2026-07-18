# PRD — Auto-Reschedule (v1.3, approved 2026-06-20)

**Author:** Priya Nair · **Reviewers:** Marcus Webb, Jules Tran, R. Iyer

## 1. Hypothesis
If Hatchboard automatically proposes new times when a booking conflict appears, hosts will recover ≥40% of would-be-cancelled meetings without manual back-and-forth.

## 2. Problem
14% of Pro-tier bookings hit a conflict within 24h of creation (Amplitude, May 2026). Hosts currently cancel or email manually; 61% of those meetings never rebook.

## 3. Solution (summary)
When a conflict is detected, Auto-Reschedule proposes up to 3 alternative slots to all attendees and books the first slot all parties accept.

## 5. States
Empty state, no-slots-found error, and attendee-declined flows specified in Figma (HB-frames 112–119, signed off by Jules 2026-07-10).

## 7. Success metrics & instrumentation
Primary: reschedule recovery rate = accepted suggestions / conflicts detected. Target ≥40% by week 4.

Required events (must fire in staging before launch):

- `auto_reschedule_enabled` — host toggles the feature on
- `auto_reschedule_conflict_detected` — conflict found on an existing booking
- `auto_reschedule_suggestion_shown` — suggestion set rendered to attendee
- `auto_reschedule_suggestion_accepted` — attendee accepts a proposed slot

Guardrail: no increase in `booking_cancelled` rate for Pro tier.

## 8. Non-goals
No cross-org rescheduling; no SMS notifications in v1.
