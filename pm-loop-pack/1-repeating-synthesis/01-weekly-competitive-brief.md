# Weekly Competitive Brief

**Pattern:** Repeating Synthesis · **Trigger:** every Monday, 7am

**The pain.** 40 minutes every Monday. Same sources, same format, same "so what for roadmap" question.

## Skill file (save as .claude/skills/competitive-brief/SKILL.md)

```
name: competitive-brief
description: Runs every Monday 7am. Pulls competitor changes from fixed
sources, formats against the tracked dimensions, checks coverage, files
the brief.
---
## Sources
- [Competitor 1]: changelog URL, blog URL
- [Competitor 2]: changelog URL, press page URL
- [Competitor 3]: blog URL

## Dimensions tracked
Features, pricing, positioning, announcements.

## Output format
Opens with a "## Executive summary": one line per competitor naming
its single biggest move this week, plus a "Key takeaways" list of 3-5
bullets synthesized across ALL competitors. Each takeaway is one dense
sentence with three parts: the single most important insight, why it
matters to your product, and a citation back to the specific evidence
below (a competitor name plus figure/date/version, or a Trend
citation) — something a reader could Ctrl-F and find verbatim. No
takeaway may restate the header or be generic enough to fit any week
("things look mostly fine," "continue monitoring").

Then one section per competitor. 3-4 bullets max. Every bullet ends
with "Implication: [one sentence connecting this change to your
product area]." Where the source provides a URL, cite it inline on
the bullet; if a competitor's sources have none, say so once under
its heading rather than inventing a link. Where a source references an
image or screenshot, note "[screenshot: ...]" on the bullet; if none
exists, say so once under the heading.

Formatting: real markdown headers (H2 per section, never bold text
standing in for a header). A table wherever content is naturally
tabular (comparisons, multi-attribute lists, before/after values).
Bold the single most important figure or call per section. No walls
of prose — bullets and tables only.

Voice: VP-of-Product. Dense, no filler ("it is important to note"),
every claim cites a specific source/figure, state the call instead of
hedging, no unsupported adjective ("significant", "robust") without
the number that earns it.

Style rule: never use an em dash anywhere in the brief. Use a period,
comma, or colon instead.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the already-passed markdown brief. The markdown draft
stays the audited source of truth; the gate and checker apply to it in
full. Never render an unpassed or flagged draft as a polished page.
Follow .claude/skills/_shared/report-style.md for all color, type,
layout, and components. Do not restate the palette here.

Map this weekly competitive brief onto the shared kit:
- Header eyebrow: "Competitive brief" plus the reporting week; H1
  title; run-meta strip naming the sources and the green PASS badge.
- Bottom-line banner: the Executive summary's sharpest call this week,
  key figure bolded.
- Stat tiles: the numbers that moved become tiles, e.g. a price delta
  old -> new, a competitor's ship count, or a trend's consecutive-week
  count. A source with no figure shows an explicit UNAVAILABLE state.
- Severity chips: each competitor's biggest move gets a chip by threat
  level (● BREACH, ▲ AT-RISK, ✓ ON-TRACK) with a matching left stripe;
  "Trend:" items carry a counter chip with their week count.
- Main audited table: the per-competitor moves table (competitor x
  dimension x old -> new value), reproduced in full, every row present.
- Owner + next-step: each move renders its Implication's concrete next
  action inline, with the named owner or ticket where present.
- Provenance footer: source paths, run timestamp, checker PASS, and
  "Generated from the audited brief; every figure traces to source."

Every figure, name, price, and citation in the HTML traces to the
passed brief verbatim; no invented figure and no reordering that
changes meaning. UNAVAILABLE and "No material change this week" stay
explicit states. One self-contained file (inline CSS and SVG, no
external assets), and the same no-em-dash bar as the brief.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: date, what was found, what was flagged, any pattern now seen 3+
weeks running. A pattern seen 3 consecutive weeks gets called out in the
brief as a trend, not a news item.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: Competitor 2 moved changelog to /news. Update source URL
  AND check both paths for 2 weeks.]

## Checker criteria
Brief opens with an Executive summary (per-competitor line plus 3-5
cross-competitor Key takeaways). Each Key takeaway names an insight,
states why it matters, and cites evidence findable verbatim in a
bullet below — a takeaway with no findable citation, or generic
enough to fit any week, fails. All competitors covered. All sources
within 7 days. Every bullet cites a source URL when available (or
states none exists) and a screenshot reference when available (or
states none exists). No em dash anywhere in the brief. Every section
has an Implication line. Brief references STATE.md trends where a
pattern repeats. Real headers, a table for any tabular content, and
one bolded figure/call per section are all present.
The HTML presentation report is generated only after the brief passes.
Every figure, flag, name, and citation in it reproduces from the passed
brief with nothing added, dropped, or re-ranked. Any UNAVAILABLE or "No
material change this week" state is rendered explicitly, never blanked
or faked. The report is one self-contained file (inline CSS and SVG, no
external assets) and honors the no-em-dash bar; a single em dash, an
invented figure, or a page built from an unpassed draft is a fail.
```

## State file (save as .claude/skills/competitive-brief/STATE.md)

```
# Competitive brief — state

## Last run
- [date]: [what was found, what was flagged, source health]

## Pattern log
- [pattern]: seen [dates]. Call as trend at 3 consecutive weeks.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file the loop restarts from zero every Monday: the same
pattern surfaces week after week as news, and "what changed over the
last 6 weeks?" has no answer. With it, run 5 starts where run 4 ended.

## The gate

All competitors covered, all sources within 7 days, no empty sections, Executive summary present with cited (not generic) Key takeaways. Unreachable source: you get a flag, not a brief.

## Maker and checker: two agents, never one

The maker gathers and drafts. A **separate** checker agent — fresh
context, no exposure to the maker's reasoning — verifies the draft
against the gate. The model that wrote the brief is too nice grading
its own homework. A loop without a separate checker is two optimists
agreeing.

## Run it

Unattended weekly runs need a scheduled task (Claude desktop app scheduled tasks, or your OS scheduler). Not /loop: that only lives inside an open session and expires after 7 days.

```
# Every Monday 7am (cron: 0 7 * * 1)
claude -p --bare "/competitive-brief"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the weekly competitive intelligence loop.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Follow the output format
exactly. Where STATE.md shows a pattern at 3+ consecutive weeks, write
it as a trend.

Pull what changed in the past 7 days from every source in SKILL.md.

For each competitor, extract:
1. Product or feature changes
2. Pricing or packaging shifts
3. Positioning or messaging updates
4. Notable announcements or press

If a source has no changes in 7 days: write "No changes this week."
If a source is unreachable: flag it and stop. Do not file the brief.

Write in VP-of-Product voice: dense, no filler ("it is important to
note"), every claim cites a specific source/figure, state the call
instead of hedging, and never use an unsupported adjective
("significant", "robust") without the number that earns it.

Open the brief with an "## Executive summary": one line per competitor
naming its biggest move, plus 3-5 "Key takeaways" bullets synthesized
across all competitors. Each takeaway is one dense sentence: the
single most important insight, why it matters, and a citation back to
the specific evidence below (competitor name + figure/date/version, or
a Trend citation) that a reader could Ctrl-F and find verbatim. Never
restate the header or write a takeaway generic enough to fit any
week's brief. Cite each bullet's source URL when the source provides
one (else say none is available for that competitor); note a
screenshot reference when the source has one (else say none is
available). Never use an em dash anywhere in the brief.

Use real markdown headers, a table wherever content is naturally
tabular, and bold the single most important figure or call in each
section. No walls of prose.

Save draft to /competitive/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the weekly competitive brief. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /competitive/drafts/[date].md and the checker
criteria in .claude/skills/competitive-brief/SKILL.md.

Verify: the brief opens with an Executive summary (per-competitor line
plus 3-5 cross-competitor Key takeaways). Each Key takeaway names an
insight, states why it matters, and cites evidence you can find
verbatim in a bullet below — no findable citation, or a takeaway
generic enough to fit any week, fails. Every competitor in SKILL.md
has a section. Every section's sources are dated within 7 days. Every
bullet cites a source URL or states none is available, and a
screenshot reference or states none is available. No em dash appears
anywhere in the brief. Every bullet ends with an Implication line.
Trends claimed match STATE.md's pattern log. Real headers, a table for
any tabular content, and a bolded key figure per section are all
present.

Pass: move the draft to /competitive/weekly-[date].md and append the
run summary to STATE.md.
Fail: save the exact failing checks to /competitive/flags/[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
