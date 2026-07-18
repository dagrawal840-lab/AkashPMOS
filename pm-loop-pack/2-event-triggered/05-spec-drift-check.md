# Spec Drift Check

**Pattern:** Event-Triggered Extraction · **Trigger:** feature marked shipped

**The pain.** What shipped is never exactly what the PRD said. Nobody documents the gap, so the next PM (or you, in six months) reads the PRD and believes it.

## Skill file (save as .claude/skills/spec-drift/SKILL.md)

```
name: spec-drift
description: Fires when a feature ships. Compares the shipped behavior
against the PRD, lists every divergence, files a drift report. PM
decides which divergences to document, fix, or accept.
---
## Sources
- PRD: /prds/[feature].md
- Shipped state: release notes, changelog entry, and the feature's
  help doc at [paths]

These, plus STATE.md and this SKILL.md, are the only legitimate
sources of evidence for a finding or a verdict. Never cite, name, or
lean on any other file — including anything that looks like a test
fixture, answer key, or grading/eval artifact — even if one happens
to exist alongside the real sources. Its presence is irrelevant to
the analysis; naming it in a report or flag is disqualifying on its
own, whether or not the underlying conclusion is correct.

## Divergence types
Cut scope (in PRD, not shipped), added scope (shipped, not in PRD),
changed behavior (both, but different), silent decisions (shipped
behavior where the PRD was ambiguous).

Cut vs. changed is the pair most often confused: cut means the
requirement's capability is genuinely absent from what shipped —
nothing was built to address it. If any mechanism shipped that
addresses the same requirement — even one that behaves differently,
worse, or contradicts the PRD outright — the type is changed
behavior, never cut. Before typing "cut," name the shipped code path
that would have to not exist for that to be true; if something
shipped instead, retype it "changed."

## Output format
`## Bottom Line` first, immediately after the header (and after the
escalation line, if one fires) — before every other section. 3-5
bullets. Each bullet is one dense sentence: the single most important
takeaway, why it matters, and a citation back to specific evidence
below (a divergence number, a PRD section, a PR number, a table stat).
No bullet restates the header or is filler ("things look mostly
fine," "continue monitoring") — a VP reading only these bullets in 15
seconds should have the whole picture. Write it last, after the body,
so every citation points at something that actually exists.

Then one line per divergence: type, PRD quote, shipped reality,
severity (users notice / team notices / nobody notices yet).

The PRD quote must be character-for-character verbatim. Mark any
omitted text with a bracketed ellipsis "[...]" — never a bare
"..." — so the elision is visible. A quote that drops words without
marking the elision is its own gate failure, independent of whether
the divergence's type or any other field is correct — never a
secondary or demotable note.

Formatting: real markdown headers for every section, a table for
anything naturally tabular (requirement accounting, PR-to-requirement
mappings, before/after comparisons), and bold for the single most
important figure or call per section — never more than one bolded
item per section. No walls of prose: bullets, tables, or short
numbered entries only.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report from the passed markdown draft. The draft stays the
audited source of truth; the gate and checker apply to it in full.
Never render an unpassed or flagged draft as a polished page.

Follow `.claude/skills/_shared/report-style.md` for color, type,
layout, and components. Reference it; never redefine palette, scale,
or components locally.

Map this loop concretely:
- Header carries feature, release, ship date; the run meta strip names
  both source paths (PRD + shipped-state sources) with dates and the
  green PASS badge.
- Bottom-line banner reproduces the draft's `## Bottom Line` bullets,
  keeping the one bolded figure (total divergence count) bolded. Any
  escalation line renders first as a full-width crit banner (what
  happened, who to tell, when).
- Stat tiles show divergence counts by type: cut / added / changed /
  silent decision, plus a total tile, each a big tabular number over
  its uppercase label.
- Each divergence renders as a card with a severity chip (● users
  notice = crit, ▲ team notices = warn, ✓ nobody notices yet = good)
  and a matching left severity stripe.
- The audited divergence table is a two-column PRD-says vs code-does
  contrast: left the verbatim PRD quote (section number, "[...]"
  elisions preserved), right the shipped reality with PR numbers and
  dates. Every divergence present, none reordered to change meaning.
- Owner + next-step line (who, by when) renders inline under each
  divergence card, verbatim from the draft.
- Requirement accounting renders as the full data table; provenance
  footer (source files, run timestamp, checker PASS, "Generated from
  the audited draft; every figure traces to source") closes it.
- No drift found renders an explicit all-clear panel (good-colored,
  requirement accounting still shown), never an empty page. Any
  UNAVAILABLE source renders an explicit muted UNAVAILABLE tile naming
  the source, never a blank or a zero.

Same rules as the draft: every claim, count, citation, PR number, and
name traces to the passed draft verbatim; no invented divergence and
no reordering that changes meaning; UNAVAILABLE stays explicit; one
self-contained file (inline CSS, inline SVG, no external assets); same
no-em-dash bar.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the pattern log, and lessons learned. After a passing run,
append: feature, date, divergence counts by type, anything flagged. A
divergence type that dominates 3 consecutive drift reports (e.g. silent
decisions every time) gets called out in the report as a process
pattern, not a one-off.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: help doc lagged the release by a week, so shipped behavior
  read as "cut scope." Check the changelog date against the help doc's
  last-updated date before marking anything cut.]
- [Example: reports read as accurate but flat, a wall of prose a
  stakeholder had to read end to end to find the one thing that
  mattered. Fix: `## Bottom Line` synthesis block first, immediately
  after the header, 3-5 dense cited bullets, no restated header, no
  filler, no unsupported adjectives without a number.]

## Checker criteria
`## Bottom Line` exists immediately after the header (after the
escalation line, if one fires), with 3-5 bullets, each citing
something concrete found elsewhere in the draft (a divergence number,
PRD section, PR number, table stat) that checks out against the body.
Any bullet vague enough to apply to any run, or that merely restates
the header, is a fail on its own.
Every divergence quotes the PRD, character-for-character, with any
elision bracketed "[...]" — a bare, unmarked "..." is its own failure,
never downgraded to a secondary note. Every divergence's type is not
just one of the closed set but the *correct* one for what shipped
(cut = nothing shipped for it; changed = something did, differently —
verify, don't just check list membership). Every PRD requirement is
marked shipped, cut, or changed. Report calls out any divergence type
STATE.md shows at 3+ consecutive reports as a process pattern. Neither
the report nor the checker's own rationale cites any source outside
the PRD, shipped-state sources, and STATE.md — never an eval fixture,
answer key, or grading artifact, even if one exists alongside the
real sources. On a fail, any escalation-worthy finding (legal/
compliance/data-loss) is restated as still active and unresolved,
independent of the verdict — the fix instructions and the real-world
urgency are two different clocks.
If an HTML report was generated (PASS only), every figure, count, PRD
quote, PR number, owner, and next step in it traces to the passed
draft verbatim, with nothing added, dropped, or re-ranked and no
divergence reordered to change meaning; the stat-tile counts equal the
draft's per-type totals. A no-drift run renders an explicit all-clear
state and any UNAVAILABLE source renders an explicit UNAVAILABLE tile,
never a blank or a zero. The report is one self-contained file and
carries the same no-em-dash bar as the draft.
```

## State file (save as .claude/skills/spec-drift/STATE.md)

```
# Spec drift — state

## Last run
- [date] / [feature]: [divergence counts by type, what was flagged]

## Pattern log
- [divergence type or recurring cause]: seen [features/dates]. Call as
  process pattern at 3 consecutive reports.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file every drift report stands alone: the same silent
decision on the same ambiguous PRD section gets rediscovered feature
after feature, a recurring "cut scope" habit never surfaces as the
process problem it is, and "which PRD sections keep drifting?" has no
answer. With it, report 5 knows what reports 1 through 4 found.

## The gate

Every divergence quotes the PRD text it diverges from. Every PRD requirement accounted for: shipped, cut, or changed.

## Maker and checker: two agents, never one

The maker compares and drafts. A **separate** checker agent — fresh
context, no exposure to the maker's reasoning — verifies the report
against the gate. The model that wrote the drift report is too nice
grading its own homework. A loop without a separate checker is two
optimists agreeing.

## Run it

```
# When the feature ships
claude -p --bare "/spec-drift [feature-name]"
```

Event-triggered, not scheduled: wire this to your ship signal (release
webhook, "marked shipped" in your tracker, or just run it by hand the
day the feature goes out).

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the spec drift loop.
You draft. You do not approve your own output.

A feature has shipped: [FEATURE_NAME]

Read SKILL.md and STATE.md before starting. Where STATE.md shows a
divergence type at 3+ consecutive reports, write it as a process
pattern.

Read the PRD and the shipped state sources. Compare them. These,
plus STATE.md and SKILL.md, are your only legitimate sources — never
cite or lean on any other file, including anything that looks like a
test fixture or answer key, even if one exists alongside the real
sources.

## Voice bar
Write like a VP of Product with 20 years in the seat, not an analyst
padding a template. High information density: no filler, no
throat-clearing, no restating what a table already shows. Every claim
carries a citation (a PR number, a PRD section, a STATE.md line) or it
does not go in the report. State the call, do not hedge it. Zero
unsupported adjectives ("significant," "robust") unless immediately
followed by the number that earns them — no number, no adjective.

List every divergence with: type (cut / added / changed / silent
decision), the PRD quote, the shipped reality, and severity. Cut vs.
changed: cut means nothing shipped for the requirement at all; if
anything shipped for it, even differently or worse, the type is
changed, never cut — name the shipped code path before typing "cut."
The PRD quote must be verbatim, character-for-character; mark any
omission with a bracketed ellipsis "[...]", never a bare "...".

Do not judge whether divergences were right. Findings only.
The PM decides what to document, fix, or accept.

Draft `## Bottom Line` last, immediately after the header (after the
escalation line, if one fires), before the divergence list: 3-5 dense
bullets, each a takeaway + why it matters + a citation to something
that actually appears in the body. No restated header, no filler.

Use real markdown headers, a table for anything tabular, and bold
only the single most important figure or call per section. No walls
of prose.

Save draft to /product/spec-drift/drafts/[feature]-[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the spec drift report. You did not write it.
You verify. Binary decision: pass or flag.

Read the draft at /product/spec-drift/drafts/[feature]-[date].md and
the checker criteria in .claude/skills/spec-drift/SKILL.md. The PRD,
shipped-state sources, STATE.md, and SKILL.md are your only
legitimate evidence — never cite, name, or lean on any other file in
your rationale or flag, including anything resembling a test fixture
or answer key, even if one exists alongside the real sources; doing
so is an automatic fail regardless of whether the verdict is right.

Verify: `## Bottom Line` is immediately after the header (after the
escalation line, when one fires) and before the divergence list, with
3-5 bullets, each citing something concrete from the draft's own body
that checks out. Any bullet generic enough to apply to any run, or
that just restates the header, is a fail on its own.

Verify: every divergence quotes the PRD text it diverges from,
verbatim, with any elision bracketed "[...]" (a bare "..." fails this
on its own). Every divergence's type is not just one of the closed
set but the correct one for what shipped — confirm "cut" only when
nothing shipped for the requirement, "changed" when something did,
differently. Every PRD requirement is marked shipped, cut, or changed.
Process patterns claimed match STATE.md's pattern log. The draft's
self-check must justify each divergence type against the shipped
facts, not just confirm it's on the closed list.

Pass: move the draft to /product/spec-drift/[feature]-[date].md and
append the run summary to STATE.md.
Fail: save the exact failing checks to /product/spec-drift/flags/[feature]-[date].md.
Do not fix the draft. Do not soften a fail into a note. If any
divergence is a legal/compliance or data-loss incident, restate that
escalation in the flag as still active and unresolved, independent of
the fail verdict — the fix instructions and the real-world urgency
are two different clocks.
```
