# Weekly Business Review

**Pattern:** Repeating Synthesis · **Trigger:** every Monday

**The pain.** The WBR is due Monday morning and it's the same document every week: pull the export, compute the deltas, notice what moved, write the narrative. So it gets rushed. Metrics get skipped when the dashboard is down, deltas get eyeballed instead of computed, and the narrative drifts from the numbers. Three months later nobody can tell which weeks had real data and which had vibes.

## Skill file (save as .claude/skills/weekly-business-review/SKILL.md)

```
name: weekly-business-review
description: Runs every Monday. Reads the weekly metrics export,
reports every metric on the fixed list with deltas vs last week and
vs the 4-week average, flags threshold breaches, drafts the WBR.
---
## Bottom Line (mandatory, first section in every draft)

The first thing in the draft — before the metric list, before
anything else. 3-5 bullets. Each bullet is one dense sentence: the
single most important takeaway, why it matters this week, and a
citation back to the specific evidence in the body below (a
metric's value, a flag, a callout, a North Star/OKR/Jira figure —
name the number or section). Written so a VP gets the whole picture
in 15 seconds without reading further. Never a restatement of the
header or a section title. Never vague ("things look mostly fine,"
"continue monitoring," "no major changes") — every bullet must be
falsifiable against a number or fact that actually appears later in
this exact draft. A bullet generic enough to paste unchanged into
any other week's review is filler; rewrite it or cut it.

## Metric list (fixed — the loop never adds or drops a metric)

For each metric: source, definition, owner. The list is the
contract. Every metric on it appears in every WBR, as a number or
as an explicit "unavailable" flag. Nothing else appears.

[8-10 metrics with source, one-line definition, owner each. Grow
this list deliberately: new metrics only when you name them.]

## Reporting rule

For every metric: current value, delta vs last week, delta vs the
4-week average (the 4 weeks immediately preceding the current
week). Flag anything past its threshold. A metric whose source is
unreachable gets an "UNAVAILABLE" flag with the source named —
never a silent omission, never a carried-forward or invented value.

## Thresholds (flag if crossed)

- Any metric: moves more than 10% vs last week, or more than 15%
  vs its 4-week average.
- [Your most-watched metric]: tighter threshold, e.g. 5%.

## North Star & OKR progress + Dev progress (Jira)

Name one metric from the fixed list as the North Star. Keep its
quarter baseline/target and the current quarter's OKRs in a
separate source file (e.g. `okrs.md`) — never invented inline, never
a new metric outside the fixed list. Report: North Star current vs
baseline/target and % of range closed; each KR tied explicitly to
the fixed-list metric that tracks it, with on-track/at-risk/
off-track called only from that metric's actual flag state this
week (a KR whose metric is flagged is never called on-track).

Pull dev progress from a Jira export (e.g. `jira-dev-progress.md`):
every epic tagged to a current-quarter OKR, status/points/ship date/
OKR link copied verbatim — never upgrade "in progress" to "on
track." Include the sprint burndown and its pace-vs-velocity read
exactly as the export states it.

This is the material the presentation layer (below) gets built
from — the markdown draft stays the audited source of truth.

## Presentation layer

The markdown draft is the audited source of truth: the gate and
checker apply to it in full. The HTML report is generated FROM the
passed draft only, never authored independently, never built for a
flagged or unpassed draft. If the checker returns anything but PASS,
no report exists. It follows .claude/skills/_shared/report-style.md
for all color, type, layout, and components — never restate the
palette here.

Map WBR content onto the shared kit: report header with week
covered and a green PASS badge; Bottom Line banner at the top of the
body, most important figure bolded; a stat-tile row for the nine
fixed metrics (current value, WoW delta, 4-week-avg delta, flag
color) with an inline sparkline per metric where the series exists;
UNAVAILABLE metrics render as an explicit unavailable tile naming
the source, never a number and never a dropped tile; the full
audited metric table below, every row present, flagged metrics
showing owner and next step inline; a North Star meter and OKR
progress bars, each KR colored by its tracking metric's real flag
state; Jira epics and burndown as a table with statuses verbatim;
Watch items as counter chips with their week counts; a provenance
footer. The report carries the same bars the draft does: no em dash
anywhere, and no figure not reproduced verbatim from the passed
draft.

## Output format

Order: Bottom Line first, before every other section (including
the callouts below and the metric table). Nothing that belongs in
the detailed body gets promoted above the Bottom Line, and the
Bottom Line never gets pushed below it.

Voice bar (every section, not just callouts): write like a VP of
Product, not a status page. High information density — no filler,
no throat-clearing ("it is important to note," "this week saw").
Every claim carries a specific citation. State the call; don't
hedge it. Zero unsupported adjectives ("significant," "robust,"
"healthy") — a number sits next to the claim or the adjective is
cut.

Formatting bar: real markdown headers for every section (no bare
bold text standing in for a heading). A table wherever the content
is naturally tabular — comparisons, multi-attribute lists,
before/after values — never a prose paragraph doing a table's job.
Bold the single most important figure or call in each section (one
bold span, not a wall of bolded text). No walls of prose — dense
bullets or a table beat a paragraph every time.

Headline: 2-4 narrative callouts, each citing the exact numbers it
rests on — a callout claim with no number from the source behind
it is a gate violation. A claim about a streak or trend duration
("Nth straight increase," "N weeks running") is a numeric claim
like any other: verify it by walking every consecutive period in
the raw export from the earliest available row and citing the
exact range that backs the count, or drop the claim — a
specific-sounding number is still a vibe if nobody walked the
series to get it.

Full metric table below (metric, current, Δ week, Δ 4-week avg,
flag). State each 4-week average's component values once — in the
table or a single footnote — never in a separate section that
re-lists values already shown elsewhere in the draft.

Unavailable metrics listed with source and reason.

Every flagged metric, new or continuing, names its owner and one
concrete next step inline — a flag with a number and no name to act
on it is incomplete.

Watch items from STATE.md carried forward with week count, written
as content directly under a single heading — no heading is ever
immediately followed by another heading with nothing between them.

## State file
Read STATE.md in this skill folder before starting. It holds last
week's values, the watch list, and lessons learned. After a
passing run, append: date, all values, flags raised, watch-item
week counts. A metric flagged 2+ consecutive weeks is a watch
item and gets written as a continuing trend with its week count,
not fresh news.

## Known failure modes

(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: the NPS export was missing and the draft silently
  skipped the row; the review shipped one metric short and nobody
  noticed for three weeks. Rule: every metric on the list appears
  as a number or an UNAVAILABLE flag — the table row count is
  fixed.]
- [Example: a callout claimed a metric was on its "Nth straight"
  increase without walking the full series — sounds cited but
  wasn't verified, and undercounted the real streak. Rule: any
  streak/duration claim is checked against every consecutive period
  in the raw export from the earliest available row, or dropped.]
- [Example: the draft read like a status report — accurate, but
  buried in prose, no section led with its key number, and
  "significant"/"robust" stood in for figures nobody cited. Rule:
  every draft opens with a Bottom Line block (3-5 dense, cited
  bullets) before any other section, every section leads with its
  most important figure or call in bold, tables replace prose
  wherever the content has multiple attributes, and no unsupported
  adjective survives without a number next to it.]

## Checker criteria

Bottom Line is the first section in the draft (before the callouts
and every other section), has 3-5 bullets, and every bullet cites a
number, flag, or section that actually appears later in the same
draft — a bullet that could apply to any week unchanged fails this
check. Every metric on the list covered or flagged unavailable — the
table has exactly one row per listed metric, no extras. Every
delta recomputes from the raw export. Every narrative callout
cites a number present in the source, including streak/duration
claims — verified by walking the full consecutive series, not
taken on faith. No metric invented beyond the list. Watch items
claimed match STATE.md's week counts. Every flagged metric names
its owner and a next step. No heading is immediately followed by
another heading. The checker's own report shows the actual
recomputed figures for every check, pass or fail — not just the
file it checked against — and a fail names, for each failing
check, the specific fix the resubmission must make.

The HTML report, if built, is generated only after a PASS. Every
metric value, delta, flag, streak, OKR figure, and Jira status in
it reproduces from the passed draft verbatim, with nothing added,
dropped, or re-ranked. Every UNAVAILABLE metric renders as an
explicit unavailable tile naming its source, never a fabricated
number and never a missing tile. The file is self-contained and
honors the no-em-dash bar.
```

## State file (save as .claude/skills/weekly-business-review/STATE.md)

```
# Weekly business review — state

## Last run
- [date, week covered]: [all metric values, flags raised, sources
  unavailable]

## Watch items
- [metric]: flagged on [dates], week N. Write as a continuing
  trend with week count, not fresh news.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file, deltas are impossible — every Monday computes
against nothing, so the review degrades to a snapshot. A metric
sliding 5% a week for a month reads as fine every single week, and
a metric that's been flagged three Mondays running gets announced
as breaking news each time.

## The gate

The draft opens with a "## Bottom Line" block (3-5 dense bullets, each citing a number/flag/section that actually appears later in the draft) before any other section — a generic bullet that could apply to any week fails the gate. Every metric on the list covered or flagged unavailable. Every callout cites a number present in the source — including any streak or duration claim, which must be verified against the full consecutive series, not asserted. No metrics invented beyond the list. An unreachable source produces a flag, not a review with a silent hole. Every flag names an owner and a next step. A checker fail names the specific fix each failing check needs; it does not just list evidence and stop.

## Maker and checker: two agents, never one

The maker reads the export, computes the deltas, and drafts. A
**separate** checker agent — fresh context, no exposure to the
maker's reasoning — verifies the draft against the gate. The model
that computed thirty deltas is too nice grading its own arithmetic.
A loop without a separate checker is two optimists agreeing.

## Run it

Unattended weekly runs need a scheduled task (Claude desktop app scheduled tasks, or your OS scheduler). Not /loop: that only lives inside an open session and expires after 7 days.

```
# Every Monday 7am (cron: 0 7 * * 1)
claude -p --bare "/weekly-business-review"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the weekly business review loop.
You draft. You do not approve your own output.

VOICE BAR (every sentence, every section): write like a VP of
Product with 20 years of experience reporting to the exec team, not
a status page. High information density — no filler, no
throat-clearing ("it is important to note," "this week saw"). Every
claim carries a specific citation (a value, a delta, a source, a
section). State the call, don't hedge it. Zero unsupported
adjectives ("significant," "robust," "healthy") — a number sits
next to the claim or the adjective is cut.

Read SKILL.md and STATE.md before starting. Use the metric list
exactly. Where STATE.md shows a metric flagged 2+ consecutive
weeks, write it as a continuing trend with its week count.

Read this week's values from every source in SKILL.md.

For every metric on the list: current value, delta vs last week,
delta vs the 4-week average. State each 4-week average's component
values once — never repeat a value elsewhere in the draft that's
already shown in the table. Flag anything past its threshold. Every
flagged metric — new or continuing — names its owner and a
concrete next step. If a source is unreachable: mark that metric
UNAVAILABLE with the source named. Never omit it, never estimate
it. Do not report any metric not on the list.

Write 2-4 narrative callouts. Every claim in a callout must cite a
number that appears in the source or a delta computed from two
numbers that do. A claim about a streak or trend duration must be
verified by walking every consecutive period in the raw export from
the earliest available row and citing the exact range that backs
it — if you haven't walked the full series, don't make the claim.

Last, write "## Bottom Line": 3-5 bullets, each one dense sentence
with the single most important takeaway, why it matters, and a
citation back to a number/flag/section that actually appears later
in this draft. This is written last (once everything else is
computed) but placed first in the saved draft. Never restate a
header or section title without a number attached. Never write a
bullet generic enough to paste into any other week's review
unchanged ("things look mostly fine," "continue monitoring") — cut
or rewrite anything that isn't traceable to this week's evidence.

Formatting: real markdown headers per section, a table wherever the
content is naturally tabular, the single most important figure or
call in each section in bold, no walls of prose.

Output order: Bottom Line, then callouts, full metric table,
unavailable list, watch items with week counts written under a
single heading with content directly beneath it — never an empty
heading followed immediately by another heading.

Save draft to runs/weekly-business-review/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the weekly business review. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at runs/weekly-business-review/drafts/[date].md and
the checker criteria in
.claude/skills/weekly-business-review/SKILL.md.

Every check must show the actual recomputed figures or matched
items you found — not just name the file you checked and assert a
match.

Verify: the draft opens with "## Bottom Line" (before any other
section) with 3-5 bullets; each bullet cites a number, flag, or
section that actually appears later in this same draft — a bullet
generic enough to apply to any week unchanged fails this check.

Verify: every metric on SKILL.md's list appears exactly once, as a
number or an UNAVAILABLE flag. No extra metrics. Every delta
recomputes from the raw export. Every callout cites a number
present in the source, including any streak/duration claim, which
must be verified by walking the full consecutive series — an
unwalked or miscounted streak fails this check. Every flagged
metric names its owner and a next step. No heading is immediately
followed by another heading. Watch items match STATE.md's week
counts.

Pass: move the draft to runs/weekly-business-review/[date].md and
append the run summary to STATE.md.
Fail: save the exact failing checks to
runs/weekly-business-review/flags/[date].md, each with one
directive sentence on the specific fix the resubmission must make —
this does not soften the fail; the draft is still fully rejected.
Do not fix the draft. Do not soften a fail into a note.
```
