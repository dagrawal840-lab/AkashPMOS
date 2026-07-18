# Product Review Hardening

**Pattern:** Periodic Prep · **Trigger:** the night before any product review

**The pain.** Your doc — PRD, one-pager, launch plan, strategy memo — goes to review with holes you can't see because you wrote it. Each one surfaces as a meeting question that costs a day of async back-and-forth.

## Skill file (save as .claude/skills/product-review-hardening/SKILL.md)

```
name: product-review-hardening
description: Runs the night before a product review. Attacks any
review-bound doc — PRD, one-pager, launch plan, strategy memo — from
four angles, files findings ranked by severity. PM fixes the top
ones before anyone else reads the doc.
---
## Attack angles
1. Unstated assumptions treated as facts
2. Edge cases with no specified behavior
3. Metrics without definition, source, or baseline
4. Questions engineering will ask that the doc doesn't answer

## Team context
[Recurring questions from your last five product reviews.]
[Engineering's known sore spots: migration cost, rollback, API changes.]

## Output format
- Never use an em dash (—) anywhere in the output. Use periods or
  commas or colons instead.
- Open the report with a **Bottom Line** section, before any
  findings: 3-5 bullets, each one dense sentence carrying the single
  most important takeaway, why it matters, and a citation to specific
  evidence below it (a finding ID, a section, a recomputed count).
  Never restate the header. Never use filler that could paste into
  any run unchanged ("things look mostly fine," "continue monitoring").
- Formatting bar: real markdown headers for every section, a table
  wherever content is naturally tabular, bold the single most
  important figure or call per section, no walls of prose.

Per finding: severity (blocks-review / weakens-review / minor),
section, quoted text, one-line suggested fix.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the already-passed markdown draft. The markdown draft
stays the audited source of truth; the gate and checker apply to it in
full. Never render an unpassed or flagged draft as a polished page.
Follow .claude/skills/_shared/report-style.md for all color, type,
layout, and components. Do not restate the palette here.

Map this review-hardening report onto the shared kit:
- Header eyebrow: "Product review hardening" plus the hardened doc
  name, its type, and the review date; H1 title; run-meta strip naming
  the draft source path, the STATE.md Last run line, and the PASS badge.
- Bottom-line banner: the single biggest exposure renders first as a
  full-width crit banner naming the meeting-killer, the finding IDs it
  traces to, and what tomorrow's review breaks on, with the readiness
  call (e.g. not ready for review) bolded.
- Stat tiles: gap counts by severity from the recomputed summary table,
  blocks-review / weakens-review / minor plus a total tile. An
  UNAVAILABLE count shows an explicit UNAVAILABLE state.
- Severity chips: each hard question or gap gets a chip by severity
  (● blocks-review, ▲ weakens-review, ✓ minor) with a matching left
  stripe, grouped under its attack angle.
- Main audited table: one row per finding, question or weakness
  (verbatim quote) x why it bites x suggested answer or fix x owner,
  reproduced in full, every finding present, none reordered; any
  not-a-Non-goals-violation note renders inline on its row.
- Owner + next-step: each card renders its "Top fixes before review"
  action inline, tied to its finding ID and named owner.
- Provenance footer: draft source path and STATE.md, run timestamp,
  checker PASS, and "Generated from the audited draft; every finding
  traces to source." Pattern references and promotion-eligible flags
  carry through verbatim.

Every finding ID, count, quote, fix, and name in the HTML traces to
the passed draft verbatim; no invented gap and no reordering that
changes meaning. UNAVAILABLE stays an explicit state. One
self-contained file (inline CSS and SVG, no external assets), and the
same no-em-dash bar as the draft.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: date, doc name and type, findings count by severity, which
angles hit. A finding type that appears in 3 consecutive docs gets
promoted into the Team context section — it's not a finding anymore,
it's a rule your drafts should already follow.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: Flagged "no rollback plan" on a doc that covered it in an
  appendix. Rule added: read appendices before filing angle-4 findings.]

## Checker criteria
The Bottom Line section exists, sits first, has 3-5 bullets, and
every bullet cites concrete evidence in the body (a finding ID,
section, or count) that actually resolves: genericness that could
paste into any run is a fail. Every finding cites a section and
quotes the draft. Findings that match a promoted pattern in STATE.md
reference it. The HTML presentation report is generated only after the
draft passes: every finding ID, count, quote, fix, and owner name in it
reproduces from the passed draft verbatim with nothing added, dropped,
or re-ranked, and no finding reordered in a way that changes meaning.
Any UNAVAILABLE source renders as an explicit state, never a blank or a
fabricated value. The report is one self-contained file (inline CSS and
SVG, no external assets) and honors the no-em-dash bar. The output
contains zero em dashes anywhere: any instance is a fail.
```

## State file (save as .claude/skills/product-review-hardening/STATE.md)

```
# Product review hardening — state

## Last run
- [date]: [doc name and type, findings by severity, angles that hit]

## Pattern log
- [finding type]: seen in [doc names/dates]. Promote to Team context
  at 3 consecutive docs.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file every hardening run rediscovers the same holes: the
undefined activation metric gets flagged in doc after doc instead of
becoming a rule you write to by default. And "what does engineering
keep catching us on?" has no answer — the recurring questions that
should feed Team context evaporate after each run.

## The gate

Every finding quotes the draft. "Section 4 names activation but never defines the activation event" passes. "This section feels thin" fails.

## Maker and checker: two agents, never one

The maker attacks the draft and files findings. A **separate** checker
agent — fresh context, no exposure to the maker's reasoning — verifies
every finding against the gate. The model that wrote the findings is
too nice grading its own homework. A loop without a separate checker
is two optimists agreeing.

## Run it

```
# The night before the review
claude -p --bare "/product-review-hardening docs/[name]-draft.md"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the product review hardening loop.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Apply all four attack
angles — they work on any review-bound doc: PRD, one-pager, launch
plan, strategy memo. Where STATE.md shows a finding type promoted to
Team context, check it first.

Read the draft at /docs/[name]-draft.md

Never use an em dash anywhere in the output. Use periods, commas, or
colons instead.

Voice bar: write like a VP of Product with 20 years in the seat, not
an analyst. High information density, no filler, no throat-clearing.
Every claim carries its citation in the same sentence. State the call
instead of hedging. Zero unsupported adjectives ("significant,"
"robust") — a number or nothing.

List findings per angle. Each finding: severity, section, quoted
text, one-line fix.

Once findings are filed, write the **Bottom Line** section and place
it first in the saved file, immediately after the STATE.md header
line, before any finding: 3-5 bullets, each one dense sentence, the
single most important takeaway, why it matters, and a citation to
evidence already in the body (a finding ID, section, or count). No
restating the header, no filler.

Do not rewrite the doc. Findings only.

Save draft to /docs/drafts/[name]-hardening-[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the product review hardening loop. You did
not write the findings. You verify. Binary decision: pass or flag.

Read the draft at /docs/drafts/[name]-hardening-[date].md and the
checker criteria in .claude/skills/product-review-hardening/SKILL.md.

Verify: a **Bottom Line** section appears immediately after the
STATE.md header line, before the first finding, with 3-5 bullets;
every bullet's citation (finding ID, section, or count) must actually
resolve against the body, and a bullet generic enough to paste into
any run unchanged ("continue monitoring," "overall in good shape") is
a fail. Every finding has a severity, cites a section, and quotes
the doc draft verbatim. Findings matching a promoted pattern
reference STATE.md. The output contains zero em dashes anywhere: any
instance is a fail.

Pass: move the draft to /docs/[name]-hardening-[date].md and append
the run summary to STATE.md.
Fail: save the exact failing checks to /docs/flags/[name]-[date].md.
Do not fix the findings. Do not soften a fail into a note.
```
