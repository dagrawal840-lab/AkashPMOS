# Metric Anomaly Flag

**Pattern:** Threshold Monitoring · **Trigger:** daily, 8am

**The pain.** Your key metric moved Tuesday. You noticed Friday, in a dashboard you opened for a different reason. Three days of the anomaly are now unexplained history.

## Skill file (save as .claude/skills/metric-anomaly/SKILL.md)

```
name: metric-anomaly
description: Runs daily. Checks key metrics against thresholds,
flags anything that moved, drafts a first-cause hypothesis that
names the most recent change as candidate.
---
## Metrics watched
[Your 5-8 key metrics with paths to daily exports:
/data/metrics-[date].csv]

## Thresholds (flag if crossed)
- Any metric: moves more than [X]% vs 7-day average
- [Metric you care most about]: moves more than [tighter X]%

## Hypothesis format
Signal: what moved, by how much, over what window.
Recent changes: last deploy, last campaign, last pricing change.
Candidate cause: one sentence, or "no recent change found."
First step: one action to verify or rule out in the next hour.

## State file
Read STATE.md in this skill folder before starting. It holds open
flags, the last run summary, and lessons learned. After a passing
run, append: date, what crossed, the hypothesis, and any flag still
open from a prior day. A metric flagged 3 consecutive days gets
escalated as a sustained shift, not re-announced as a new anomaly —
and gets excluded from the rolling-average baseline until resolved.

## Output format
Every draft opens with a "## Plain-language summary" (3-5 sentences,
no jargon) stating whether an anomaly was found and the single most
important thing the reader should do next: before any table or
detailed evidence, and before the Bottom Line block below.

Then a "## Bottom Line" block — 3-5 dense bullets,
each with the single most important takeaway, why it matters, and a
citation to specific evidence found later in the draft (a metric, a
delta, a STATE.md day count). Write it last, place it near the top,
right after the plain-language summary. No generic filler ("things
look mostly fine"); every bullet must be traceable to a number or
reference in the body.

No em dashes anywhere in the output, in any section; use periods,
commas, or colons instead.

Use real markdown headers, a table wherever content is naturally
tabular (metric-vs-threshold checks, before/after values), and bold
on the single most important figure or call per section. No walls of
prose.

Voice: dense, no filler or hedges, every claim cited, confident and
precise — state the call. Zero unsupported adjectives ("significant,"
"robust") — a number, or nothing.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the passed markdown draft. The draft stays the
audited source of truth; the gate and checker apply in full. Never
render an unpassed or flagged draft.

Follow .claude/skills/_shared/report-style.md for color, type,
layout, and components. Reference it; do not redefine palette, type,
or components here.

Map this loop: bottom-line banner = the flagged metric and its
breach magnitude (clean-baseline delta vs threshold), or an explicit
"No flags today" all-clear if nothing crossed. Hero inline-SVG
sparkline/area chart of the series with the anomaly point emphasized
and the expected band (threshold around the clean 7-day baseline)
shaded. Stat tiles: current vs clean baseline vs threshold, each
with a direction-colored delta. Severity chip plus left stripe on
the breach (● BREACH, ▲ AT-RISK, ✓ ON-TRACK), with the "OPEN, day N"
count where the draft carries one. Audited table of contributing
segments only if the draft lists them, every row present, no
re-ranking. Owner plus one time-bound next-step line, verbatim.
Provenance footer: source CSVs, run date, checker PASS.

Every value, threshold, name, day count, and owner traces to the
passed draft verbatim; invent no cause and reorder nothing that
changes meaning. UNAVAILABLE shows explicitly, never a blank or
zero. One self-contained file (inline CSS and SVG). Same no-em-dash
bar as the draft.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: signup spike from a bot wave crossed the threshold two
  days straight, then got absorbed into the 7-day average and
  masked a real dip the following week. Rule: anomalous days are
  excluded from the baseline until the flag is closed.]
- [2026-07-17: the draft read like a status log, flat bullets, no
  synthesis, hedged language, key numbers buried mid-paragraph. Rule:
  open every draft with a "Bottom Line" synthesis block (3-5 cited
  takeaways) before any detailed section, use tables for comparisons,
  and write in dense, cited, hedge-free prose.]

## Checker criteria
Hypothesis cites specific data. "Something changed" is not a
hypothesis. Open flags in STATE.md are carried forward or closed —
never silently dropped. A 3-day-running flag is marked sustained,
not repeated as news. The draft opens with a "Bottom Line" block —
3-5 bullets — before any other section; each bullet must cite
something concrete in the body; reject generic filler bullets.
Presentation layer (only when an HTML report is generated): build it
only after PASS; every metric name, value, clean baseline, breach
magnitude, threshold, day count, and owner must trace to the passed
draft verbatim, with nothing added, dropped, or re-ranked. The
all-clear state and any UNAVAILABLE source show explicitly, never a
blank. The report must be one self-contained file (inline CSS and
SVG) with zero em dashes; even one is a fail.
```

## State file (save as .claude/skills/metric-anomaly/STATE.md)

```
# Metric anomaly — state

## Last run
- [date]: [what crossed, hypothesis, flags opened/closed]

## Pattern log
- [metric]: flagged [dates]. Escalate as sustained shift at 3
  consecutive days. Exclude from baseline until closed.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file the loop has no memory: yesterday's flag gets
re-announced as news every morning, a metric that dips back under
the threshold vanishes silently with no one asking whether it
resolved or just wobbled, and the anomaly itself rolls into the
7-day average — the baseline absorbs the problem and the loop goes
blind to it.

## The gate

Flags only on threshold crossings against the rolling average, so one noisy day can't cry wolf. Every hypothesis names specific data.

## Maker and checker: two agents, never one

The maker checks metrics and drafts hypotheses. A **separate**
checker agent — fresh context, no exposure to the maker's reasoning
— verifies the draft against the gate. The model that wrote the
hypothesis is too nice grading its own homework. A loop without a
separate checker is two optimists agreeing.

## Run it

```
# Daily at 8am (cron: 0 8 * * *)
claude -p --bare "/metric-anomaly"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

Launch week, when you want it hot while you work, run it in-session instead:

```
/loop 30m /metric-anomaly
```

/loop only runs while the session is open and expires after 7 days. Fine for launch week. Wrong for every day.

## Maker prompt

```
You are the MAKER for the daily metric anomaly loop.
You draft. You do not approve your own output.

Voice bar: write like a VP of Product. High information density, no
filler or hedges ("it is important to note," "may have"), every
claim cited to a specific number or file, no unsupported adjectives
("significant," "robust") — a number, or nothing. State the call.

Read SKILL.md and STATE.md before starting. Where STATE.md shows a
metric flagged 3+ consecutive days, write it as a sustained shift
and exclude those days from the baseline.

Check every watched metric against its threshold, comparing to
the 7-day rolling average.

For each crossing: write the hypothesis per the format in
SKILL.md, naming the most recent change as candidate cause.

No crossings: write "No flags today" and note any open flags from
STATE.md as resolved or still open.

Last, write a "## Bottom Line" block — 3-5 bullets, each citing
specific evidence from the draft below — and place it first, before
every other section.

Save draft to /product/metric-flags/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the daily metric anomaly flag. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /product/metric-flags/drafts/[date].md, the
checker criteria in .claude/skills/metric-anomaly/SKILL.md, and
STATE.md in the same folder.

Verify: the draft opens with a "Plain-language summary" (3-5
sentences, no jargon, states any anomaly found and the single most
important next action) before anything else, then a "Bottom Line"
block (3-5 bullets) before any other section, and every bullet cites
something concrete in the body: reject generic filler with no number
or reference. Every hypothesis cites specific numbers and a specific
candidate change, or states "no recent change found." Every open flag
in STATE.md is carried forward or closed in the draft. Flags at 3+
consecutive days are marked sustained, not repeated as news. Zero em
dashes anywhere in the draft: even one is a fail.

Pass: move the draft to /product/metric-flags/[date].md, append the
run summary to STATE.md, and if flags were found post to #product
with the metric and the hypothesis.
Fail: save the exact failing checks to /product/metric-flags/flags/[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
