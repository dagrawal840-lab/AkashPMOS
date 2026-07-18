# Launch Readiness Sweep

**Pattern:** Event-Triggered Extraction · **Trigger:** launch date minus 3 days

**The pain.** Launches slip on small forgotten things: the help doc nobody updated, the empty state nobody designed, the metric nobody instrumented. Each one is a 10-minute fix found at the worst time.

## Skill file (save as .claude/skills/launch-sweep/SKILL.md)

```
name: launch-sweep
description: Runs 3 days before launch. Checks the feature against
the launch rubric, files a readiness report with every gap. PM
triages the gaps.
---
## The rubric (edit for your team)
- Help doc exists and describes shipped behavior
- Changelog entry drafted
- Success metric instrumented and firing in staging
- Empty states and error states specified
- Support team briefed (or briefing doc exists)
- Rollback plan named
- Pricing/packaging impact confirmed with [owner]

## Output format
Open with a plain-language summary (3-5 sentences, no jargon): the
overall readiness call and the single most important thing the
reader should do, before any header or checklist.

Then Key Insights: 3-5 bullets right after the header, before any
rubric detail. Each bullet is one dense sentence, the single biggest
takeaway, why it matters to the launch call, and a citation to the
specific evidence below (a rubric verdict, a gap count, a pattern-log
streak). No bullet generic enough to fit any run ("things look mostly
fine") survives; cut it if so.

Then one line per rubric item: PASS with evidence, or GAP with what's
missing and who owns it.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML readiness report FROM the passed markdown draft. The markdown
draft stays the audited source of truth; the gate and checker apply
to it in full. Never render an unpassed or flagged draft.

Follow .claude/skills/_shared/report-style.md for color, type,
layout, and components; do not redefine the palette or component kit
here, reference that file. Map it to this loop: a bottom-line banner
carrying the overall GO / NO-GO / CONDITIONAL verdict with the gap
count as the single boldest element; a readiness meter or area status
grid (eng, QA, docs, support, marketing, legal), each area ready /
at-risk / blocked in its semantic color; blockers as crit severity
chips plus a left stripe with owner, due date, and next step; the
main audited checklist table, one row per rubric item in draft order
with a status chip (PASS / GAP / CLOSED / CARRIED OVER) and evidence;
a process-failure crit banner at the top if the draft has one; a
provenance footer with sources, run timestamp, and checker PASS.

Rules: every status, name, date, and event traces to the passed draft
verbatim. Add no item, upgrade no status (a GAP never renders as
ready, a CONDITIONAL never as GO), reorder nothing in a way that
changes meaning. Any UNAVAILABLE or "could not verify" shows an
explicit unavailable state, never a blank or green cell. One
self-contained file, inline CSS and SVG only. Same no-em-dash bar:
never use an em dash (—); use a period, comma, or colon.

## Formatting rules
Never use an em dash (—) anywhere in the output. Use a period, comma,
or colon instead. Use real markdown headers, a table for anything
with multiple attributes per row (rubric results, event checks,
pattern-log streaks), and bold the single most important figure per
section. No walls of prose.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: feature, date, gap count, which rubric items gapped, who owned
them. A rubric item that gaps on 3 consecutive launches gets called out
at the top of the report as a process failure, not a one-off gap.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: Metric "firing in staging" passed because an old event with
  the same name was firing. Verify the event's first-seen date is after
  the feature branch merged.]
- [Example, 2026-07-17: Reports read like a flat checklist with no
  synthesis and unsupported adjectives ("significant risk"). Added a
  Key Insights block right after the header (cited, non-generic
  bullets) and a VP-of-Product voice bar: no filler, every claim
  cited, a number or nothing instead of an adjective.]

## Checker criteria
Every rubric item has a PASS or GAP. Every PASS cites evidence
(a file, a dashboard, a message). No item skipped. Rubric items
flagged as repeat offenders in STATE.md's pattern log are called
out as such in the report. A plain-language summary (3-5 sentences,
no jargon) opens the report before the checklist, stating the
overall call and the most important next step. No em dash (—)
appears anywhere in the report. Key Insights sits right after the
header with 3-5 bullets, each citing something concrete from the
body; reject generic bullets that could fit any run. If an HTML
presentation report was generated, verify it was built only after
this PASS and only from the passed draft: every status, name, date,
and event traces to the draft verbatim, no item added, no status
upgraded (no GAP shown as ready, no CONDITIONAL shown as GO), nothing
reordered to change meaning. Any UNAVAILABLE renders as an explicit
unavailable state, never a blank or green cell. The report is one
self-contained file, inline CSS and SVG, no external assets, and
carries no em dash anywhere.
```

## State file (save as .claude/skills/launch-sweep/STATE.md)

```
# Launch sweep — state

## Last run
- [feature, date]: [gap count, which items gapped, owners]

## Pattern log
- [rubric item]: gapped on [features/dates]. Call as process failure
  at 3 consecutive launches.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file every sweep is the first sweep: the help doc gaps on
launch after launch and each report treats it as a fresh surprise, so
nobody sees that documentation is structurally late. Owners who never
close their gaps look identical to owners who always do. With it, the
third missing changelog entry reads as a process failure with a name
attached, not another 10-minute fix.

## The gate

Every rubric item resolved to PASS with evidence or GAP with an owner. "Probably fine" fails the gate.

## Maker and checker: two agents, never one

The maker sweeps and drafts the report. A **separate** checker agent —
fresh context, no exposure to the maker's reasoning — verifies the
report against the gate. The model that marked an item PASS is too nice
grading its own evidence. A loop without a separate checker is two
optimists agreeing that the launch is probably fine.

## Run it

```
# Launch minus 3 days
claude -p --bare "/launch-sweep [feature-name] [launch-date]"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the launch readiness sweep.
You draft. You do not approve your own output.

Launching: [FEATURE_NAME] on [DATE]

Read SKILL.md and STATE.md before starting. Check every rubric item.
Where STATE.md's pattern log shows an item gapped on 3+ consecutive
launches, call it out at the top as a process failure.

For each item: PASS with the evidence you found, or GAP with
what's missing and the likely owner.

Do not soften gaps. A missing help doc 3 days out is a GAP,
not a "should be fine." If you could not verify an item, mark it
GAP with reason "could not verify."

Open the report with a plain-language summary (3-5 sentences, no
jargon) stating the overall readiness call and the single most
important thing the reader should do, before the header. Then write
Key Insights right after the header: 3-5 dense bullets, each with the
takeaway, why it matters, and a citation to evidence in the body. No
generic bullets.

Voice bar for the whole draft: no filler, no throat-clearing. Every
claim cites its source. State the call, do not hedge it. No
unsupported adjectives ("significant," "robust"), a number or
nothing. Never use an em dash (—) anywhere in the draft; use a
period, comma, or colon instead.

Save draft to /launches/drafts/[feature]-readiness-[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the launch readiness sweep. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /launches/drafts/[feature]-readiness-[date].md,
the checker criteria in .claude/skills/launch-sweep/SKILL.md, and
STATE.md's pattern log.

Verify: every rubric item in SKILL.md has a PASS or GAP verdict.
Every PASS cites evidence (a file, a dashboard, a message). No item
skipped. Repeat offenders in STATE.md's pattern log are called out
as such. The report opens with a plain-language summary (3-5
sentences, no jargon) stating the overall call and the most
important next step, before the header. Key Insights sits right
after the header with 3-5 bullets, each citing something concrete in
the body; fail any generic bullet. No em dash (—) appears anywhere in
the report; flag and require a fix if one does.

Pass: move the draft to /launches/[feature]-readiness-[date].md,
append the run summary to STATE.md, and post the gap count to
#product: "[feature]: X gaps, Y passes. Report: [path]"
Fail: save the exact failing checks to /launches/flags/[feature]-[date].md.
Do not fix the report. Do not soften a fail into a note.
```
