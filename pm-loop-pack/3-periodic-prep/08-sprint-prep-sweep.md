# Sprint Prep Sweep

**Pattern:** Periodic Prep · **Trigger:** the day before sprint planning

**The pain.** Planning starts, someone opens the first ticket, and it has no acceptance criteria. Twenty minutes of the meeting evaporate writing them live. The unsized ticket gets a hallway estimate, the blocked one gets pulled in anyway, and the dead spec link isn't discovered until mid-sprint. Nobody's job is "check the backlog the day before," so nobody does.

## Skill file (save as .claude/skills/sprint-prep-sweep/SKILL.md)

```
name: sprint-prep-sweep
description: Runs the day before sprint planning. Sweeps every ticket
in the sprint candidate list against a fixed readiness checklist and
drafts a prep report ranked by severity. Findings only — it never
edits tickets.
---
## Sources
- Backlog export: [path or Jira/Linear MCP query for the next-sprint
  candidate filter]
- Sprint goal: [path to sprint goal doc]

## Output style rules (apply to every section)
- Never use an em dash (—) anywhere in the report. Use a period or
  comma instead, or restructure the sentence. A single em dash
  anywhere in the draft is an automatic checker FAIL.
- The report opens with a plain-language summary, before the header
  and detailed backlog breakdown: 3-5 sentences, no jargon (no raw
  ticket IDs, checklist item names, or severity labels without plain
  explanation), stating whether the sprint looks ready to plan, a
  rough count of tickets in good shape versus needing attention, and
  the single most important action the reader should take before
  planning.

## Readiness checklist (fixed — every ticket, every item)
1. Acceptance criteria present.
2. Sized (estimate field populated).
3. No unresolved blocking dependency.
4. Linked spec/design exists and is current.
5. No open questions in comments.

These five items are the entire readiness bar. Whether a ticket is
named in the goal doc's prose, or looks like a scope surprise, is not
a checklist item — never raise it as a reason to doubt a ticket that
passes all five.

## Bottom Line (mandatory synthesis block)
Immediately after the header, before the detailed backlog breakdown:
3-5 bullets, each a dense sentence naming the single most important
takeaway, why it matters to planning, and a citation to specific
evidence below (a ticket ID, a section name, a sweep count, a
number). No bullet restates the header or the plain-language
summary, and none is filler that could describe any sweep ("things
look mostly fine," "continue monitoring") — either is a checker FAIL.
Draft it last, after the sweep and findings exist, so every citation
resolves to something real in the draft.

## Output format
Findings ranked by severity — tickets that would block planning
first. Per finding: ticket ID, checklist item failed, the missing or
failing element quoted from the ticket. Tickets with no findings are
listed explicitly as ready, never omitted. Close with a short
"planning risks" summary tied to the sprint goal — discussing only
tickets that have a finding or repeat-offender status. Never
re-litigate a Ready ticket's scope fit there; passing the checklist
is the only bar for Ready.

Real markdown headers per section. Anything with more than one
attribute per item (repeat offenders, findings, ready tickets) is a
table, not a paragraph per ticket. Bold the single most important
figure or call per section. No walls of prose — a section running
past three sentences of prose becomes a table or bullet list instead.

This loop never edits tickets. Findings only; a human fixes.

## Presentation layer
After the checker returns PASS, the maker generates one self-contained
HTML report from the passed markdown draft. The draft stays the
audited source of truth; the gate and checker apply in full. Never
render an unpassed or flagged draft as a polished page.

Follow .claude/skills/_shared/report-style.md for color, type,
layout, and components; reference it, never redefine the palette,
type scale, or component kit here.

Map this sweep concretely: report header with an eyebrow (sweep name
+ run date and sprint), H1, and a run-meta strip naming the backlog
export and sprint goal sources plus a green PASS badge. A bottom-line
banner stating how many candidate tickets are planning-ready versus
blocked, the blocked count bolded as the loudest figure. Three stat
tiles, Ready / Fix-before-planning / Blocks-planning counts, each
colored by severity; an UNAVAILABLE source shows the muted
UNAVAILABLE state, never a fake zero. Each not-ready ticket carries a
severity chip (● BLOCKS PLANNING, ▲ FIX BEFORE PLANNING) and a left
stripe in the same hue, labeled by the missing checklist item
(acceptance criteria, estimate, blocking dependency, spec/design
link, open question). The main audited table maps every ticket to its
missing piece(s), owner, and one-line next step, every listed row
present with quoted evidence intact. A provenance footer names source
files, run timestamp, and checker PASS.

Every ticket ID, field, name, and count traces to the passed draft
verbatim; invent no ticket and never reorder findings in a way that
changes severity meaning. UNAVAILABLE stays explicit. Ship one
self-contained HTML file (inline CSS and SVG, no external assets).
The same no-em-dash bar applies: a single em dash in the HTML is a
FAIL.

## State file
Read STATE.md in this skill folder before starting. It holds the last
run summary, the repeat-offender log, and lessons learned. A ticket
failing the same check 2+ consecutive sweeps is labeled a repeat
offender with its owner named — not re-listed as a fresh finding.

STATE.md's recorded sweep count for a repeat offender is always as
of the last time the file was updated, never this run's count. If the
ticket fails the same check again, this run's count is the recorded
number **plus one** — never restate the old number unchanged, and
never re-derive it by counting dates (the file isn't guaranteed to
log every historical date, only the most recent one).

After a passing run, update — don't blindly append — three sections
that each appear exactly once: the last-run summary (date, tickets
swept, findings by severity) is replaced wholesale, not stacked under
a second heading; each repeat-offender line is updated in place with
its new count or removed once resolved, never duplicated under a
second heading; the lessons-learned log alone is true append-only.
Two headings with the same name means it was done wrong.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: a ticket with "AC: see spec" was passed as having
  acceptance criteria. A pointer is not criteria — follow the link
  and verify the criteria actually exist there.]

## Checker criteria
No em dash (—) appears anywhere in the draft, searched over the full
text including any summary or paraphrase. The draft opens with a
plain-language, jargon-free summary (before the header) stating
sprint readiness, a rough ready-versus-needs-attention count, and the
single most important reader action; missing, misplaced, oversized,
or a restatement of the findings list is a FAIL.
The Bottom Line block exists right after the header, has 3-5
bullets, and every bullet cites something concrete that actually
exists elsewhere in the draft (a ticket ID, a named section, a sweep
count, a number) — resolve each citation yourself. A bullet that
only restates the header or plain-language summary, or that's
generic enough to fit any run ("continue monitoring," "things look
mostly fine"), is a FAIL.
Every candidate ticket is checked against every checklist item.
Every finding cites a ticket ID and quotes the missing or failing
element. Ready tickets are listed explicitly, not omitted. Tickets
failing the same check 2+ sweeps in STATE.md are labeled repeat
offenders, with the sweep count recomputed as STATE.md's recorded
count **plus one** — restating the old number unchanged is a FAIL.
No ticket was edited. The planning-risks summary raises no scope or
goal-alignment doubt about a ticket in the Ready list — that is a
FAIL too. On pass, STATE.md is updated in place (last-run section
replaced, repeat-offender lines updated/removed, lessons-learned
appended) with no duplicate section headings, before the pass is
recorded.
If an HTML presentation-layer report was generated, it was built only
after this PASS, and every ticket ID, checklist item, quoted element,
owner, and count in it traces verbatim to the passed draft. Nothing
was added, dropped, or re-ranked in a way that changes severity
meaning, and every UNAVAILABLE stays explicit rather than a zero or
blank. The report is one self-contained file (inline CSS and SVG, no
external assets) and carries no em dash anywhere. Any divergence is a
FAIL.
```

## State file (save as .claude/skills/sprint-prep-sweep/STATE.md)

```
# Sprint prep sweep — state

## Last run
- [date]: [tickets swept, findings by severity, repeat offenders]
  (replace this line each run — do not stack prior runs beneath it)

## Repeat offenders
- [ticket ID + failed check]: consecutive sweeps failing: [N], as of
  [date of this entry] (first failed [date]). Owner: [name].
  (a ticket earns a line here once it fails the same check on 2+
  consecutive sweeps; if it fails again next sweep, update [N] to
  [N+1] in place — never restate [N] unchanged and never add a
  second line for the same ticket + check; remove the line the
  sweep it passes)

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
  (append-only — never edit or remove a prior entry here)
```

Without this file every sweep rediscovers the same never-sized ticket
as if it were news, and nobody can tell a fresh gap from one that's
been ignored for three sprints. The tickets that fail the same check
every single sweep — the ones that need a conversation, not another
finding — never surface as a pattern.

Each section above appears exactly once. The most common way this
file rots is treating "update STATE.md" as "append text to it" —
that leaves two "## Last run" or two "## Repeat offenders" headings,
and a future sweep can read the stale one by mistake. Only "Lessons
learned" is meant to grow line by line; the other two sections are
edited in place, every run.

## The gate

Every candidate ticket checked against every checklist item. Every finding cites a ticket ID and quotes the missing or failing element. A ticket with no findings appears explicitly in the ready list — omission is not readiness. "This ticket seems thin" fails the gate. A ticket that passes all five checklist items is Ready, full stop — the gate does not entertain scope or goal-alignment doubts about it. Repeat-offender sweep counts are STATE.md's recorded count plus one, never the old number restated — the gate treats a stale count as a fail, not a rounding error. No em dash appears anywhere in the report, and the report opens with a plain-language summary before the detailed breakdown — both are gate failures on their own, independent of the findings themselves. A Bottom Line block of 3-5 dense, cited bullets immediately follows the header — missing it, having fewer than 3 or more than 5 bullets, or a bullet that doesn't cite something concrete found elsewhere in the report, is also a gate failure on its own.

## Maker and checker: two agents, never one

The maker sweeps and drafts. A **separate** checker agent — fresh
context, no exposure to the maker's reasoning — verifies the findings
against the gate. The model that wrote the findings is too nice
grading its own homework. A loop without a separate checker is two
optimists agreeing.

## Run it

```
# Day before planning, e.g. every other Tuesday 3pm (cron: 0 15 * * 2)
claude -p --bare "/sprint-prep-sweep"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the sprint prep sweep.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Where STATE.md shows a
ticket failing the same check 2+ consecutive sweeps, write it as a
repeat offender with its owner, not as a fresh finding. STATE.md's
recorded sweep count is as of the last run, not this one — if the
ticket fails the same check again, this run's count is the recorded
number plus one; never restate the old number unchanged.

Read the sprint goal, then sweep every ticket in the candidate list
against all five checklist items: acceptance criteria, sizing,
blocking dependencies, spec/design link current, open questions in
comments.

Per finding: ticket ID, checklist item failed, the missing or
failing element quoted from the ticket. Rank by severity — blockers
to planning first. List every clean ticket explicitly as ready.
Close with a "planning risks" summary tied to the sprint goal,
covering only tickets with a finding or repeat-offender status —
never raise scope or goal-alignment doubt about a ticket already in
the ready list.

Never edit a ticket. Findings only.

Never use an em dash (—) anywhere in the draft; use a period or
comma instead. Before the header, write a plain-language summary,
3-5 sentences, no jargon, stating sprint readiness, a rough count of
tickets in good shape versus needing attention, and the single most
important action the reader should take before planning.

Right after the header, write the Bottom Line: 3-5 dense bullets,
each naming the single most important takeaway, why it matters to
planning, and a citation to specific evidence below (a ticket ID, a
section name, a sweep count, a number). No filler bullet, no bullet
that just restates the header or the plain-language summary. Write
it last, after the sweep and findings exist, so every citation
resolves to something real.

Write like a VP with 20 years in the seat: dense, no filler or
throat-clearing, every claim cited, confident calls instead of
hedges, no unsupported adjectives (a number backs it or it's cut).
Use real headers, tables for anything with multiple attributes per
item, and bold the one figure that matters most per section.

Save draft to runs/sprint-prep-sweep/drafts/prep-[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the sprint prep sweep. You did not write it.
You verify. Binary decision: pass or flag.

Read the draft at runs/sprint-prep-sweep/drafts/prep-[date].md, the
checker criteria in .claude/skills/sprint-prep-sweep/SKILL.md, and
the repeat-offender log in STATE.md.

Verify: every candidate ticket appears in the report — as a finding
or in the ready list — and was checked against every checklist item.
Every finding cites a ticket ID and quotes the missing or failing
element from the source. Tickets failing the same check 2+ sweeps
are labeled repeat offenders with the sweep count recomputed as
STATE.md's recorded count plus one — a count restated unchanged from
STATE.md, or re-derived by counting dates instead of doing the +1,
is a FAIL. No ticket was edited. The planning-risks summary raises no
scope or goal-alignment doubt about a ticket in the ready list — that
is also a FAIL.

Verify the Bottom Line block too: it exists right after the header,
has 3-5 bullets, and every bullet cites something concrete you can
actually find elsewhere in the draft (a ticket ID, a section name, a
sweep count, a number). A bullet that just restates the header or
plain-language summary, or that's generic enough to describe any
sweep, is a FAIL — resolve every citation yourself, don't take the
draft's word for it.

Pass: move the draft to runs/sprint-prep-sweep/prep-[date].md. Update
STATE.md in place — replace the last-run section, update or remove
repeat-offender lines, append a lessons-learned bullet if applicable
— never leaving two headings with the same name.
Fail: save the exact failing checks to
runs/sprint-prep-sweep/flags/prep-[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
