# AI Quality Watchdog

**Pattern:** Threshold Monitoring · **Trigger:** nightly

**The pain.** Your AI feature degrades quietly: model updates, prompt changes, inputs you never tested. You find out from support tickets, which means customers found out first.

## Skill file (save as .claude/skills/ai-watchdog/SKILL.md)

```
name: ai-watchdog
description: Runs nightly. Scores the eval set against the live
feature, compares pass rate to the 7-day average, alerts on drops
with the failing examples attached.
---
## Sources
- Eval set: /evals/eval-set.json (30-50 real anonymized inputs,
  each with pass criteria: what a correct output must contain,
  must not contain, or must match)
- History: /evals/history.csv

## Threshold
Pass rate drops more than 5 points below the 7-day rolling
average.

## Escalation rule
Any example failing 3+ consecutive nights gets its own line in
the alert.

## State file
Read STATE.md in this skill folder before starting. It holds the
last run summary, the pattern log of open flags, and lessons
learned. After a passing run, append: date, pass rate, which
examples failed and why, which flags cleared. An example failing
3+ consecutive nights per STATE.md gets escalated in the alert as
a confirmed regression, not a new failure.

## Report format
Every nightly report opens with a **Bottom Line** block — the first
thing after the title, before any other section. 3-5 bullets. Each
bullet is one dense sentence: the single most important takeaway, why
it matters, and a citation to specific evidence in the body below (an
example ID, a STATE.md pattern-log count, an unrounded number, a
section heading). No bullet may restate the header or be generic
enough to fit any night's run ("things look mostly fine," "continue
monitoring" — banned). A VP reading only Bottom Line should have the
whole picture in 15 seconds.

Below Bottom Line: real markdown headers for every section, a table
wherever the content is naturally tabular (failing examples, cleared
flags, before/after pass-rate numbers), and bold on the single most
important figure or call in each section. No walls of prose.

## Presentation layer

After the checker returns PASS, the maker generates a self-contained
HTML report FROM the passed markdown draft. The draft stays the
audited source of truth; the gate and checker apply to it in full.
Never render an unpassed or flagged draft as a polished report.

Follow .claude/skills/_shared/report-style.md for color, type,
layout, and components. Reference it; do not redefine the palette,
type scale, or component kit here.

Map this loop concretely:

- Bottom-line banner: the quality metric that breached and by how
  much (tonight's pass rate vs the 7-day rolling average, the point
  drop bolded), or an explicit all-clear state ("All metrics in-band,
  no regression") when nothing crossed threshold.
- Stat tiles: pass rate (with the 7-day baseline delta), refusal
  rate, and latency, each vs its threshold with a direction-colored
  delta line; where a series exists, an inline-SVG sparkline of the
  metric's recent nights with the current point emphasized.
- Severity chips + left stripe on each breach (BREACH for a confirmed
  regression, AT-RISK for known-intermittent, ON-TRACK / all-clear),
  colored by the draft's flag, with the "failed N of last 7 nights"
  or consecutive-night count where the draft carries one.
- Failing-examples section: the sampled failing examples rendered as
  mono cards showing the input then the output (input -> output),
  quoted from the draft exactly, never paraphrased or invented.
- Audited table: metric -> value -> threshold -> flag -> owner ->
  next step, every listed row present, no re-ranking.
- Owner + next-step line: the owner or team to page and the one
  concrete first-look action, verbatim from the draft.
- Provenance footer: source files, run date, checker PASS.

Every metric, value, threshold, example, name, and count traces to
the passed draft verbatim; sampled examples are quoted exactly, never
paraphrased or invented. Add no figure and do no reordering that
changes meaning. Where the draft says UNAVAILABLE, show an explicit
unavailable state, never a blank or a zero. One self-contained file
(inline CSS and SVG, no external assets). Same no-em-dash bar as the
draft: one em dash in the report is a fail.

## Known failure modes
(Write every mistake here the day it happens. This becomes the
most valuable part of the skill file.)
- [Example: Live feature timed out on 4 examples and they were
  scored FAIL. Timeouts are "no result," not failures — retry
  once, then flag the run as incomplete.]

## Output quality rules
- Never use an em dash (—) anywhere in the report, alert, or state
  append. Use a period or comma instead.
- Every nightly report opens with a Plain-Language Summary (3-5
  sentences, no jargon) stating the overall AI-quality verdict and the
  single most important thing the reader should do, before the
  detailed eval breakdown.

## Checker criteria
No em dash appears anywhere in the draft; flag and reject if one is
found. The report opens with the Plain-Language Summary described
above. Every example ran. Every score has a one-line reason. Consecutive-
night failure counts match STATE.md's pattern log. Alert compares
against the 7-day rolling average, not last night alone. The report
opens with a Bottom Line block (3-5 bullets, each citing specific
evidence in the body) before any other section; reject a generic or
uncited Bottom Line the same as a missing one.

Presentation layer (only when an HTML report is generated): build it
only after PASS. Every metric name, value, threshold, flag, pass-rate
delta, consecutive-night or intermittent count, owner, and next step
must trace to the passed draft verbatim, with nothing added, dropped,
or re-ranked; sampled failing examples must be quoted exactly as the
draft has them, never paraphrased or invented. The all-clear state and
any UNAVAILABLE source must be shown explicitly, never as a blank or a
zero. The report must be one self-contained file (inline CSS and SVG,
no external assets) and carry zero em dashes; even one is a fail.
```

## State file (save as .claude/skills/ai-watchdog/STATE.md)

```
# AI watchdog — state

## Last run
- [date]: [pass rate, failures, flags raised or cleared]

## Pattern log
- [example id]: failing since [date]. Escalate at 3 consecutive
  nights.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file, last night's failing example gets re-announced
every night as fresh news, and an example that failed two nights
then squeaked past vanishes silently instead of staying on watch.
Worse, a sustained drop rolls into the 7-day average and becomes
the new baseline — the watchdog normalizes the very regression it
exists to catch.

## The gate

Every example scored with a reason, and the alert compares against the rolling average, so one noisy night can't fire a false alarm.

## Maker and checker: two agents, never one

The maker runs the evals and drafts the report. A **separate**
checker agent — fresh context, no exposure to the maker's scoring
decisions — verifies the draft against the gate. The model that
scored the evals is too nice grading its own homework. A loop
without a separate checker is two optimists agreeing.

## Run it

```
# Nightly at 2am (cron: 0 2 * * *)
claude -p --bare "/ai-watchdog"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the nightly AI quality watchdog.
You draft. You do not approve your own output.

Write like a VP of Product with 20 years in the seat, not an analyst
narrating a spreadsheet. High information density, no filler, no
throat-clearing ("it is important to note," "in order to"). Every
claim carries a citation (an example ID, a STATE.md line, a number) or
it gets cut. State the call, don't hedge it. No unsupported adjectives
("significant," "robust") unless a number sits next to them.

Read SKILL.md and STATE.md before starting. Use the pass criteria
exactly. Where STATE.md shows an example failing 3+ consecutive
nights, write it as a confirmed regression.

Run every example in the eval set against the live feature.
Score each PASS or FAIL with a one-line reason.

Compare tonight's pass rate to the 7-day average.

Drop of more than 5 points: include a Slack alert draft for
#product with the failing examples and reasons.

Open the draft with a Bottom Line block (3-5 bullets, each citing
specific evidence in the body below) before any other section — write
it last, after the rest of the draft exists. Format the draft in real
markdown: headers per section, tables for tabular content, bold on
the single most important figure per section.

Save draft to /evals/drafts/[date].md. Do not touch history.
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the nightly AI quality watchdog. You did
not run the evals. You verify. Binary decision: pass or flag.

Read the draft at /evals/drafts/[date].md, the checker criteria in
.claude/skills/ai-watchdog/SKILL.md, and STATE.md's pattern log.

Verify: no em dash (—) appears anywhere in the draft. The draft opens
with a Plain-Language Summary (3-5 sentences, no jargon, states the
overall verdict and the single most important next action), then a
Bottom Line block (3-5 bullets) before
any other section, and each bullet's citation actually appears in the
body — quote the match; reject a generic or uncited bullet. Every
example in the eval set has a score. Every score has a one-line
reason. Consecutive-night failure counts match STATE.md. Any drop over
5 points below the 7-day average carries an alert with failing
examples attached. Markdown headers, tables for tabular content, and
bold on each section's key figure are all present.

Pass: move the draft to /evals/nightly-[date].md, append tonight's
results to /evals/history.csv, post the alert to #product if one
is due, and append the run summary to STATE.md.
Fail: save the exact failing checks to /evals/flags/[date].md. Do
not touch history. Do not fix the draft. Do not soften a fail into
a note.
```

Pair this with the prompt tune-up loop: the watchdog catches the drop, the tune-up fixes it.
