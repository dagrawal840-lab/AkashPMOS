# Feedback Theme Digest

**Pattern:** Repeating Synthesis · **Trigger:** every Friday

**The pain.** Feedback lands in six places. Nobody reads it all weekly, so it piles up until someone skims 400 items at quarter-end and calls it a synthesis.

## Skill file (save as .claude/skills/feedback-digest/SKILL.md)

```
name: feedback-digest
description: Runs every Friday. Reads the week's feedback from all
sources, tags each item against the theme taxonomy, ranks themes by
growth, files a one-page digest.
---
## Sources
- Support tickets: /data/support-tickets-[week].csv
- Sales notes: /data/sales-notes/[week]/
- App reviews: /data/app-reviews-[week].csv
- NPS verbatims: /data/nps-verbatims-[week].csv
- User-interview notes: /data/interview-notes/[week]/

## Theme taxonomy
[10-15 named themes, one-line definition each. Grow this list
deliberately: new themes only when you name them.]

## Counting rule
One mention per customer per theme per week. One loud customer
cannot fake a trend. Interview quotes are tagged against the same
taxonomy and counted the same way — an interview is one customer,
not ten mentions.

## Output format
Formatting bar: real markdown headers for every section (never bold
standing in for a heading), a table wherever content is naturally
tabular, bold the single most important figure or call per section,
no walls of prose.

Bottom Line first: immediately after the header, before any detailed
section, 3-5 bullets, the single most important takeaway per bullet,
why it matters, and a citation to specific evidence in the body below
(a theme + growth %, a source ID, a number). No filler, no restating
the header, no generic bullet that could describe any week's run.

Top 3 themes by week-over-week growth, with counts and 2 verbatim
quotes each (quotes may come from any source, interviews included),
plus a "This week:" action line (a concrete, PM-actionable next
step tied to the cited evidence, not a restatement of the
complaint) and an "Owner:" line naming the team the evidence
implies (Eng, Support, Docs, Sales/CS, Billing, Design). Full theme
table below. Unclustered items at the end.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the passed markdown draft. The draft stays the
audited source of truth; the gate and checker apply to it in full.
Never render an unpassed or flagged draft.
Follow .claude/skills/_shared/report-style.md for all color, type,
layout, and components. Do not restate the palette here.
Header carries the loop name, week-ending date, and a green PASS
badge. Bottom Line renders as the top banner with the key growth %
bolded. Stat tiles show total items, per-source counts, and the
unclustered count; an UNAVAILABLE source shows a muted UNAVAILABLE
tile, never a zero. Each top-3 theme is a card with a severity chip
and left stripe colored by growth direction, its "N. Theme, last to
this (+X%)" heading, an inline sparkline where a series exists, its
2 verbatim quotes as blockquotes with customer name and source ID,
and the "This week" action plus "Owner:" team as the next-step line.
The full six-theme table is the audited data table, every row and
growth % present. Unclustered and Omitted notes sit above a
provenance footer with sources, timestamp, and checker PASS. Every
figure, quote, and name traces to the passed draft verbatim: add
nothing, drop nothing, reorder nothing that changes meaning, keep
UNAVAILABLE explicit. One self-contained file, inline CSS and SVG,
same no-em-dash bar.

## Traceability rule
Every citation of a customer, anywhere in the digest (not just
inside quote blocks), needs an identifier the reader can actually
follow up on: a ticket/review/NPS ID, or a sales-note/interview-note
file path plus entry or section. A bare paraphrase with no
identifier is not a citation.

## Style rule
Never use an em dash (—) anywhere in the digest's own prose. Use a
period, comma, or colon instead. Verbatim quotes are exempt only if
the source text itself contains one.

## State file
Read STATE.md in this skill folder before starting. It holds last
week's theme counts, the pattern log, and lessons learned. After a
passing run, append: date, theme counts, top growers, unclustered
count. A theme in the top 3 by growth for 3 consecutive weeks gets
called out as a sustained shift, not a weekly blip.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: sales notes folder was empty because the week rolled
  over Saturday, not Friday. Check both week folders when Friday is
  month-end.]
- 2026-07-17: output read like a generic analyst summary: no
  synthesis up top, prose-heavy sections, unsupported adjectives with
  no number attached. Added a mandatory Bottom Line block (3-5 cited
  bullets, first after the header), a VP-of-Product voice bar (no
  filler, no hedges, every adjective needs a number or gets cut), and
  a stronger formatting bar (real headers, tables, bolded key
  figures).

## Checker criteria
Bottom Line block exists first, after the header, with 3-5 bullets,
each citing concrete evidence in the body below. Generic filler or a
restated header fails the block.
Every source read. Every item tagged or listed as unclustered.
Growth ranks computed against last week's counts in STATE.md.
Sustained shifts claimed match STATE.md's pattern log.
Any HTML report is generated only after the run PASSes. Every figure,
quote, theme, and flag in the HTML reproduces from the passed draft
with nothing added, dropped, or re-ranked. UNAVAILABLE sources stay
explicit, never a zero. The file is fully self-contained (inline CSS
and SVG) and honors the same no-em-dash bar.
```

## State file (save as .claude/skills/feedback-digest/STATE.md)

```
# Feedback digest — state

## Last run
- [date]: [theme counts, top growers, unclustered count, source health]

## Pattern log
- [theme]: top-3 growth on [dates]. Call as sustained shift at 3
  consecutive weeks.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file, week-over-week growth is impossible — every Friday
computes ranks against nothing, so the digest degrades to raw volume
and the loudest theme wins forever. A theme climbing steadily for a
month reads as fresh news each week, and unclustered items pile up
with no memory that the same unclustered complaint appeared three
weeks running.

## The gate

Every source read — the interview-notes directory included — every item tagged or flagged. An unreachable source produces a flag, not a digest with a silent hole.

## Maker and checker: two agents, never one

The maker reads and tags and drafts. A **separate** checker agent —
fresh context, no exposure to the maker's reasoning — verifies the
draft against the gate. The model that tagged 200 items is too nice
grading its own tagging. A loop without a separate checker is two
optimists agreeing.

## Run it

Unattended weekly runs need a scheduled task (Claude desktop app scheduled tasks, or your OS scheduler). Not /loop: that only lives inside an open session and expires after 7 days.

```
# Every Friday 4pm (cron: 0 16 * * 5)
claude -p --bare "/feedback-digest"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the weekly feedback digest loop.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Use the theme taxonomy
exactly. Where STATE.md shows a theme in the top 3 for 3+ consecutive
weeks, write it as a sustained shift.

Read this week's items from every source in SKILL.md.

Tag each item to one theme. If no theme fits: add it to
"unclustered." Do not invent new themes. Interview notes are tagged
quote by quote against the same taxonomy — one interview is one
customer.

Count one mention per customer per theme. Rank by week-over-week
growth against last week's counts in STATE.md, not raw volume.

Write like a VP of Product, not a summarizer: no filler, no hedges,
state the call, cite every claim, and cut any adjective
("significant", "robust") that isn't immediately followed by the
number that earns it.

Output: a Bottom Line first, 3-5 dense bullets, each citing specific
evidence below, no filler, then top 3 growing themes with counts and
2 quotes each, full table below, unclustered list at the end.

If a source failed: flag it and stop. Do not file the digest.

Save draft to /feedback/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the weekly feedback digest. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /feedback/drafts/[date].md and the checker
criteria in .claude/skills/feedback-digest/SKILL.md.

Verify: a Bottom Line block exists first, after the header, with 3-5
bullets, each one traceable to concrete evidence in the draft body.
Reject generic filler or a restated header. Every source in SKILL.md
was read. Every item is tagged or listed as unclustered. Growth ranks
match last week's counts in STATE.md. Sustained shifts claimed match
STATE.md's pattern log.

Pass: move the draft to /feedback/weekly-[date].md and append the
run summary to STATE.md.
Fail: save the exact failing checks to /feedback/flags/[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
