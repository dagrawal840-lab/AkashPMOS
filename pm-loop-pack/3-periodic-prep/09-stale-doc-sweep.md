# Stale Doc Sweep

**Pattern:** Periodic Prep · **Trigger:** first Monday of the month

**The pain.** Your team's docs describe the product as it was two quarters ago. New joiners learn wrong things confidently. Nobody owns "checking the docs" because it's everyone's job.

## Skill file (save as .claude/skills/stale-doc-sweep/SKILL.md)

```
name: stale-doc-sweep
description: Runs monthly. Cross-references team docs against the
last 90 days of shipped changes, flags every doc section that
describes outdated behavior.
---
## Sources
- Docs to sweep: [paths to team wiki / help docs / onboarding docs]
- Ground truth: /product/changelog.md (last 90 days)

## Staleness test
A doc section is stale if it describes behavior the changelog
shows was changed, removed, or renamed.

## Writing style
Never use an em dash (—) anywhere in the report. Use a period,
comma, or colon instead.

## Output format
The report opens with a plain-language summary (3-5 sentences, no
jargon) above everything else, stating how many stale docs were
found and the single most important thing the reader should do next.
Right after that, before any detailed section, comes a "Bottom Line"
of 3-5 bullets: the single most important takeaway, why it matters,
and a citation to the specific evidence for it further down in the
report (a doc path, an owner, a recomputed figure, a STATE.md sweep
count). Never a restatement of the header, never generic filler
("things look mostly fine").
Then per stale section: doc path, the outdated claim (quoted), the
changelog entry that contradicts it, suggested one-line fix. Use
real markdown headers and a table wherever a section is naturally
tabular (multiple flags, multiple attributes); bold the single most
important figure or call per section.

## Presentation layer
After the checker returns PASS, and only then, the maker generates a
self-contained HTML report FROM the passed markdown draft. The draft
stays the audited source of truth; gate and checker apply in full.
Never render an unpassed or flagged draft. Follow
.claude/skills/_shared/report-style.md for color, type, layout, and
components; never redefine the palette or component kit here.
Map this sweep: bottom-line banner = how many docs are stale and how
many are critical; stat tiles = total scanned / stale / critical; each
stale doc gets a severity chip and left stripe keyed by staleness
severity (chronic or direct contradiction = crit, carried-over = warn,
new = accent) matching its draft disposition; the main audited table
lists doc -> last updated / age -> why stale (verbatim quote plus
contradicting changelog entry) -> owner -> refresh or archive, every
listed doc present in draft order; a provenance footer names sources,
run time, and checker PASS. Every doc, date, name, quote, and figure
traces to the passed draft verbatim: no invented staleness, no
reordering that changes meaning, UNAVAILABLE stays explicit. One
self-contained file (inline CSS and SVG). Same no-em-dash bar.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: date, docs swept, flags raised, which prior flags are still
unfixed. A doc flagged 3 consecutive sweeps gets escalated in the
report as a chronic doc, with its owner named — not re-listed as a
fresh flag.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: onboarding doc was reorganized; old section anchors moved.
  Match flags by quoted claim, not by section heading, for 2 sweeps.]

## Checker criteria
Every flag pairs a doc quote with a changelog entry. No flags
based on style or tone. Flags open 3+ sweeps in STATE.md are
escalated as chronic, not repeated as new. The report opens with a
plain-language summary (3-5 sentences, no jargon) stating the stale
doc count and the single most important next action, followed by a
"Bottom Line" of 3-5 bullets, each citing a concrete fact found in
the body (doc path, owner, figure, sweep count). Reject any bullet
that restates the header or is generic filler. No em dash anywhere
in the report. If an HTML presentation report was generated, it was
built only after PASS and every doc, date, owner, quote, and figure
in it traces verbatim to the passed draft, with nothing added,
dropped, or re-ranked and no severity chip that contradicts the
draft. UNAVAILABLE sources show an explicit unavailable state, never
a zero. The file is self-contained (inline CSS and SVG) and carries
no em dash.
```

## State file (save as .claude/skills/stale-doc-sweep/STATE.md)

```
# Stale doc sweep — state

## Last run
- [date]: [docs swept, flags raised, flags carried over]

## Pattern log
- [doc path + claim]: flagged [dates]. Escalate as chronic at 3
  consecutive sweeps.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file every sweep flags the same stale sections as if
discovered for the first time, and nobody can tell a fresh flag from
one that's been ignored since March. Fixed docs get re-checked from
scratch instead of skipped, and the chronic offenders — the docs
nobody ever updates — never surface as a pattern.

## The gate

Every flag pairs a quoted doc claim with the changelog entry that contradicts it. "This doc feels old" fails the gate.

## Maker and checker: two agents, never one

The maker sweeps and drafts. A **separate** checker agent — fresh
context, no exposure to the maker's reasoning — verifies the flags
against the gate. The model that wrote the flags is too nice grading
its own homework. A loop without a separate checker is two optimists
agreeing.

## Run it

```
# First Monday of the month (cron: 0 9 1-7 * 1)
claude -p --bare "/stale-doc-sweep"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the monthly stale doc sweep.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Where STATE.md shows a
flag open 3+ consecutive sweeps, write it as chronic, not as a new
flag.

Read the changelog (last 90 days), then sweep every doc in the
list. Flag each section that describes changed, removed, or
renamed behavior.

Per flag: doc path, quoted outdated claim, the contradicting
changelog entry, one-line suggested fix.

Content accuracy only. Do not flag style, tone, or formatting.

Open the draft with a plain-language summary (3-5 sentences, no
jargon): how many stale docs were found and the single most
important thing the reader should do next. Never use an em dash
anywhere in the draft.

Right after that, before any detailed section, write a "Bottom
Line" of 3-5 bullets: the single most important takeaway, why it
matters, and a citation to specific evidence further down in the
draft. Write it last, once the sweep is done, so every bullet cites
something real. Write like a VP of Product: dense, no filler, every
claim cited, no unsupported adjectives ("significant," "robust")
without a number attached.

Save draft to /docs/drafts/stale-sweep-[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the monthly stale doc sweep. You did not
write it. You verify. Binary decision: pass or flag.

Read the draft at /docs/drafts/stale-sweep-[date].md, the checker
criteria in .claude/skills/stale-doc-sweep/SKILL.md, and the
pattern log in STATE.md.

Verify: every flag pairs a quoted doc claim with a changelog entry.
No flag is based on style or tone. Flags open 3+ sweeps in STATE.md
are marked chronic, not listed as new. The draft opens with a
plain-language summary (3-5 sentences, no jargon, stale doc count,
single most important next action). No em dash appears anywhere.

Right after that summary, a "Bottom Line" of 3-5 bullets exists,
before any detailed section. Each bullet states a takeaway, why it
matters, and cites something concrete elsewhere in the draft (a doc
path, an owner, a recomputed figure). Fail any bullet that restates
the header or is generic filler that could apply to any sweep.

Pass: move the draft to /docs/stale-sweep-[date].md and append the
run summary to STATE.md.
Fail: save the exact failing checks to /docs/flags/stale-sweep-[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
