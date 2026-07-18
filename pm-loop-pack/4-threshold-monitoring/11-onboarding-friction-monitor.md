# Onboarding Friction Monitor

**Pattern:** Threshold Monitoring · **Trigger:** weekly

**The pain.** Onboarding drifts. Drop-off creeps up one step at a time, invisibly, until activation misses the quarter and becomes a project.

## Skill file (save as .claude/skills/onboarding-monitor/SKILL.md)

```
name: onboarding-monitor
description: Runs weekly. Checks drop-off at every onboarding step
against baseline, cross-references onboarding-tagged tickets,
flags the step that's degrading.
---
## Sources
- Funnel: /data/onboarding-funnel-[week].csv (step, entries,
  completions)
- Support: /data/support-onboarding-[week].csv

## Thresholds (flag if crossed)
- Any step's drop-off rises more than 3 points above its 8-week
  baseline
- Onboarding ticket volume rises more than 2x the 4-week average

## Output format rules
Never use an em dash (—) anywhere in the output; use periods or commas
instead. Open the report with a "Plain-language summary" (3-5
sentences, no jargon) stating the biggest friction point and the one
most important next action, BEFORE the header and BEFORE the Bottom
Line / detailed breakdown.

## Output format
Header first. Then, as the FIRST thing after the header (before any
per-flag detail): a "## Bottom Line" block, 3-5 bullets, each ONE dense
sentence fusing the single most important takeaway + why it matters +
a citation to a specific number/ticket_id/source age below. Written
like a VP skimming for 15 seconds, not a restatement of the header and
never generic filler ("continue monitoring"). No flags this week:
still lead with the strongest specific fact (nearest-miss margin, a
source gone stale), never a bare "no flags."
Then, per flag: step, drop-off now vs baseline, related ticket count,
2 verbatim ticket quotes if any exist. Render 2+ flags/metrics and
source health as markdown tables, not prose; bold the one headline
figure per section.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the passed markdown draft. The draft stays the audited
source of truth; the gate and checker apply in full. Never render an
unpassed or flagged draft. Follow
.claude/skills/_shared/report-style.md for color, type, layout, and
components; reference it, never redefine the palette locally.
- Hero: an inline SVG funnel, one bar per activation-funnel step with
  drop-off drawn between consecutive steps, the breached step
  emphasized in --crit (no crit color if no step breached).
- Bottom-line banner: the worst drop-off step and its magnitude vs the
  8-week baseline, the single figure bolded.
- Stat tiles for key step conversions vs baseline (rising drop-off in
  --crit); severity chips (● BREACH) and a left stripe on breached
  rows; audited table of step, conversion now, delta vs baseline, flag,
  owner, next step; provenance footer (sources, run date, PASS).
- No breach: explicit all-clear state naming the nearest-miss step,
  never a blank.
- Every rate, step name, delta, and owner traces to the passed draft
  verbatim; no invented cause or meaning-changing reorder; UNAVAILABLE
  explicit. One self-contained file (inline CSS/SVG). Same no-em-dash
  bar; grep the HTML for the em-dash character before finishing.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: date, steps flagged, numbers vs baseline, source health. A step
flagged 3 consecutive weeks gets escalated in the output as a sustained
degradation, not a fresh flag.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: Funnel export renamed "Step 3: Invite" to "Step 3: Invite
  team." Baseline lookup missed it and the step vanished from the
  report. Match steps by position AND fuzzy name for 2 weeks after any
  rename.]

## Checker criteria
No em dash anywhere in the draft is a FAIL if found. A Plain-language
summary (3-5 sentences, no jargon) opens the draft before the header
and before the Bottom Line, naming the biggest friction point and the
one most important next action — missing or misplaced is a FAIL.
Bottom Line block exists right after the header (3-5 bullets, each
citing a concrete number/ticket_id/source elsewhere in the draft) —
missing, misplaced, wrong bullet count, or a generic/uncited bullet is
a FAIL. Both sources read. Every flag shows the baseline comparison.
Steps flagged in STATE.md 3+ consecutive weeks are marked as sustained,
and new flags are distinguished from repeats. If an HTML report was
generated, verify only after PASS that every step conversion, delta vs
baseline, flag, and threshold in it traces to the passed draft
verbatim, with nothing added, dropped, or re-ranked; the all-clear and
any UNAVAILABLE source are explicit; the report is one self-contained
file; and no em dash appears (grep the HTML, any hit is a FAIL).
```

## State file (save as .claude/skills/onboarding-monitor/STATE.md)

```
# Onboarding monitor — state

## Last run
- [date]: [steps flagged, numbers vs baseline, source health]

## Pattern log
- [step]: flagged [dates]. Escalate as sustained at 3 consecutive weeks.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file, every Monday is week one: the step flagged last week
gets re-announced as news, and a step that dips back under threshold
for one week vanishes silently instead of showing as a wobble. Worse,
a slow degradation rolls into the 8-week baseline and normalizes
itself — the log is the only record that the flag existed at all.

## The gate

Flags compare against an 8-week baseline, not last week, so seasonal noise doesn't page you. Both sources read or you get a flag about the source.

## Maker and checker: two agents, never one

The maker reads the data and drafts the flags. A **separate** checker
agent — fresh context, no exposure to the maker's reasoning — verifies
the draft against the gate. The model that decided a step was fine is
too nice grading its own judgment. A loop without a separate checker is
two optimists agreeing.

## Run it

```
# Every Monday 8am (cron: 0 8 * * 1)
claude -p --bare "/onboarding-monitor"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the weekly onboarding friction monitor.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Where STATE.md shows a
step flagged 3+ consecutive weeks, write it as a sustained
degradation, not a fresh flag.

Compare each step's drop-off to its 8-week baseline. Check
onboarding ticket volume against the 4-week average.

Voice bar: write like a VP of Product, not a status page. High
information density, no filler ("it is important to note"), every
claim cited to a ticket_id/source/number, state the call rather than
hedge, and never an unsupported adjective ("significant", "robust")
without the number that earns it.

Compute your numbers and citations first, then write a "Bottom Line"
block last but place it FIRST in the doc, right after the header:
3-5 bullets, each fusing the single most important takeaway + why it
matters + a citation to a number/ticket_id/source below. No restating
the header, no filler ("continue monitoring").

For each threshold crossing: report the step, the numbers vs
baseline, and up to 2 verbatim ticket quotes that reference it. Render
2+ flags as a table; bold the headline delta.

No crossings: write "No flags this week" in the Bottom Line, but still
lead with the strongest specific fact (nearest-miss margin, a stale
source) rather than a bare non-answer.
Source failed: flag the source, do not guess.

Save draft to /product/onboarding-flags/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the onboarding friction monitor. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /product/onboarding-flags/drafts/[date].md and the
checker criteria in .claude/skills/onboarding-monitor/SKILL.md, plus
STATE.md's pattern log.

Verify: a "Bottom Line" block sits immediately after the header, 3-5
bullets, each citing a concrete number/ticket_id/source found
elsewhere in the draft — missing, misplaced, wrong count, or a
generic/uncited bullet is a FAIL. Both sources were read. Every flag
shows its baseline comparison. Steps at 3+ consecutive weeks in
STATE.md are marked sustained. New flags are distinguished from
repeats.

Pass: move the draft to /product/onboarding-flags/[date].md and
append the run summary to STATE.md.
Fail: save the exact failing checks to
/product/onboarding-flags/flags/[date].md.
Do not fix the draft. Do not soften a fail into a note.
```

Pair this with the onboarding rewrite loop from the full guide: this one detects, that one drafts the fix.
