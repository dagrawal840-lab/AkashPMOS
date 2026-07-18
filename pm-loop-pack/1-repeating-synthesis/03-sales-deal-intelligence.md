# Sales Deal Intelligence

**Pattern:** Repeating Synthesis · **Trigger:** every Friday

**The pain.** Sales knows things product needs and product knows things sales needs, and the exchange happens quarterly, in a slide, six weeks after the deals that mattered. The AE who lost to a competitor's real-time feature last Tuesday tells nobody in product; the PM who could have unblocked an open deal with one paragraph of positioning never hears about the objection until the deal is dead.

## Skill file (save as .claude/skills/sales-deal-intelligence/SKILL.md)

```
name: sales-deal-intelligence
description: Runs every Friday. Reads the CRM export of open-pipeline
deals and deals closed this week, plus AE notes. Files a PM takeaways
brief: where PM can help close open deals, roadmap learnings from
closed deals tagged against the five win/loss dimensions, and
repeating-pattern alerts.
---
## Sources
- Deals export: /data/deals-[week].csv (open pipeline + closed this week)
- AE notes: /data/ae-notes/[week]/

## Win/loss dimensions (fixed — the tagging taxonomy)
Price, features, competition, timing, champion strength.
A closed deal "cites" a dimension when the sources substantively
discuss it for that deal — even if it didn't decide the outcome.
Absent from the sources = not cited. Decoys: "budget" can mean
amount (price) or fiscal calendar (timing) — verify before tagging.
"Revisit in N months" is a pipeline note, not timing evidence.

## Output format
Bottom Line first: the mandatory synthesis block, immediately after
the header and before any detailed section. 3-5 bullets, written
last (once a/b/c exist), each one dense sentence: the single most
important takeaway, why it matters, and a citation back to specific
evidence below (a deal ID, a dimension + streak count, a section
reference). Never a restatement of the header, never generic
("things look mostly fine," "continue monitoring") — a synthesis a
VP could read in 15 seconds and have the whole picture.

Then three sections. (a) Open deals where PM can help — per deal:
the live objection, and a concrete PM assist (explanation,
positioning, objection handling). NEVER a feature promise, date, or
roadmap commitment. (b) Roadmap learnings from closed deals — per
deal: outcome, dimensions cited with one line of evidence each. (c)
Repeating patterns — any dimension cited in 3+ consecutive closed
deals, with the deal IDs in the streak.

Format and voice: real markdown headers, a table wherever content
is naturally tabular (deal lists, dimension counts), bold the
single most important figure or call per section, no walls of
prose. Write like a VP of Product: dense, every claim cited,
confident calls instead of hedges, zero unsupported adjectives
("significant," "robust") unless a number follows.

## Presentation layer
After the checker returns PASS, the maker generates a self-contained
HTML report FROM the passed markdown draft. The draft stays the audited
source of truth; the gate and checker apply to it in full. Never render
an unpassed or flagged draft.
- Follow .claude/skills/_shared/report-style.md for color, type, layout,
  and components. Do not redefine the palette or type scale here.
- Header: eyebrow "Deal Intelligence Brief" + week ending date, H1
  title, run-meta strip naming sources read and a green PASS badge.
- Bottom line banner: the draft's Bottom Line bullets verbatim at the top
  of the body, the single most important figure bolded.
- Stat tiles: ARR at stake across open deals, open deal count, closed
  count (won/lost split), dimensions at a 3+ streak. Figures copied
  verbatim; an UNAVAILABLE source shows the explicit unavailable state.
- Chips: closed outcomes as won (good) / lost (crit) chips, open deals
  with a competitive mention or roadmap gap as AT-RISK (warn), a 3+
  streak dimension as BREACH; chipped rows carry a left severity stripe.
- Main audited table: the closed-deal list (deal, account, outcome,
  amount, dimensions cited) primary and in draft order; the open-deal
  table and the repeating-patterns table render in full alongside it.
- Owner + next-step: each open deal renders its PM assist inline; each
  pattern hit renders its recommended product action and owner.
- Provenance footer: source files, run timestamp, checker PASS, and
  "Generated from the audited draft; every figure traces to source."
- Every figure, quote, deal ID, account, and dimension traces to the
  passed draft verbatim. No invented data, no reordering that changes
  meaning, UNAVAILABLE stays explicit. One self-contained HTML file
  (inline CSS and SVG), same no-em-dash bar.

## Coverage rule
Every deal in the export appears in the brief exactly once: in the
open-deals section, the closed-deals section, or an explicit
insufficient-data flag (deal ID + what's missing). Every takeaway
cites a deal ID. Silent omissions are a coverage failure.

## State file
Read STATE.md in this skill folder before starting. It holds last
week's run summary, the pattern log (per-dimension consecutive
counts across closed deals, with deal IDs), and lessons learned.
After a passing run, the checker appends: date, deals covered,
dimension counts, updated streaks, flags. A dimension reaching 3+
consecutive closed deals is a repeating pattern and stays flagged
until a closed deal breaks the streak.

## Known failure modes
(Write every mistake here the day it happens. This becomes the most
valuable part of the skill file.)
- [Example: a "PM assist" suggested telling the prospect a connector
  was "coming soon" — that is a feature commitment wearing a helpful
  hat. Assists explain what exists today, nothing else.]

## Checker criteria
Every deal in the export covered or explicitly flagged
insufficient-data. Every takeaway cites a deal ID that exists in the
export. No feature commitments, dates, or roadmap promises anywhere
in the open-deals assists. Dimension streaks recomputed against
STATE.md's pattern log, not eyeballed. No em dash (—) anywhere in
the output: use a period, comma, or colon instead. The Bottom Line
block exists, runs first, and every bullet cites something concrete
in the body below; a generic or uncited bullet fails the run. No
unsupported adjectives or hedging language anywhere in the brief.
The presentation layer (built only after PASS) is generated from the
passed draft, never an unpassed or flagged one. Every figure, quote,
deal ID, account, and dimension in the HTML report traces to the draft
verbatim, with nothing added, dropped, or re-ranked in a way that
changes meaning, and every UNAVAILABLE source shows an explicit
unavailable state. The report is one self-contained file (inline CSS
and SVG) holding the same no-em-dash bar.
```

## State file (save as .claude/skills/sales-deal-intelligence/STATE.md)

```
# Sales deal intelligence — state

## Last run
- [date]: [deals covered open/closed, dimensions cited per closed
  deal, flags]

## Pattern log
- [dimension]: cited in closed deals [IDs, in close-date order].
  [N] consecutive. Alert at 3.

## Lessons learned
- [date]: [what broke, what the fix was, what rule was added]
```

Without this file, every Friday starts from zero. "Competition has come
up in the last four closed deals" — the single most valuable sentence
this loop can produce — is invisible, because each run only sees this
week's deals. The streak counter has nothing to count against, so the
repeating-pattern alert never fires, or fires on a streak the brief
can't actually show.

## The gate

Every deal covered or explicitly flagged insufficient-data. Every takeaway cites a deal ID. No feature commitments in the help suggestions. A brief that quietly skips a deal, or "helps" an AE by promising the roadmap, goes to flags, not to stakeholders.

## Maker and checker: two agents, never one

The maker reads the export and the notes and drafts the brief. A
**separate** checker agent — fresh context, no exposure to the maker's
reasoning — verifies the draft against the gate. The model that wrote
"just tell them the integration is planned" will not catch itself
making a feature commitment. A loop without a separate checker is two
optimists agreeing.

## Run it

Unattended weekly runs need a scheduled task (Claude desktop app scheduled tasks, or your OS scheduler). Not /loop: that only lives inside an open session and expires after 7 days.

```
# Every Friday 4pm (cron: 0 16 * * 5)
claude -p --bare "/sales-deal-intelligence"
```

Headless runs don't always inherit your interactive login (cron and
automation contexts can't reach the keychain). Test `claude -p` from a
plain terminal first; if it says "Not logged in," set an API key in the
scheduler's environment.

## Maker prompt

```
You are the MAKER for the weekly sales deal intelligence loop.
You draft. You do not approve your own output.

Read SKILL.md and STATE.md before starting. Transcribe the pattern
log's per-dimension consecutive counts and their deal IDs into your
working notes. A dimension at 2 consecutive is one citation from
alert — treat that as the default expectation to confirm or break.

Read the week's deals export and every AE note file.

For each OPEN deal: state the live objection (with deal ID and
source), then one concrete PM assist — an explanation, a positioning
angle, or objection handling using what the product does today.
Never promise a feature, a date, or a roadmap item. If the only
honest assist would be a promise, write "no assist available —
roadmap gap" instead.

For each CLOSED deal (close-date order): outcome, then the win/loss
dimensions it cites — price, features, competition, timing, champion
strength — one line of evidence per cited dimension. Substantively
discussed = cited, even if non-deciding. Flag insufficient data
explicitly when the sources are too thin to tag.

Recompute every dimension streak: STATE.md count, +1 per citing
closed deal in order, reset to 0 on a non-citing closed deal.
Declare any dimension at 3+ consecutive with its deal IDs — state
the count or state the break, never hedge.

Every deal in the export lands in exactly one place: open section,
closed section, or an insufficient-data flag.

Draft like a VP of Product: dense, no filler, no throat-clearing,
every claim cited to a deal ID or figure, confident calls instead
of hedges, zero unsupported adjectives ("significant," "robust")
unless a number follows. Use real markdown headers, tables wherever
the content is tabular, and bold the single most important figure
per section.

Once (a), (b), and (c) are drafted, write the Bottom Line last: 3-5
bullets placed first, right after the header — each one the single
most important takeaway, why it matters, and a citation back to
specific evidence already in your draft. No generic filler bullet.

Save draft to /deal-intel/drafts/[date].md
```

## Checker prompt (separate agent — give it only this)

```
You are the CHECKER for the weekly sales deal intelligence brief.
You did not write it. You verify. Binary decision: pass or flag.

Read the draft at /deal-intel/drafts/[date].md, the checker criteria
in .claude/skills/sales-deal-intelligence/SKILL.md, and STATE.md's
pattern log.

Verify: every deal ID in the export appears in the brief exactly
once — open, closed, or flagged insufficient-data. Every takeaway
cites a deal ID that exists in the export. No PM assist contains a
feature promise, ship date, or roadmap commitment ("coming soon"
counts). Dimension streaks recomputed by you from STATE.md plus this
week's closed deals in close-date order; every 3+ streak is declared
with its deal IDs, and no declared streak is wrong. The Bottom Line
block runs first, has 3-5 bullets, and every bullet cites something
concrete found in the body below; a bullet generic enough to fit
any week's run fails the brief even if nothing else is wrong. No
unsupported adjectives or hedges anywhere in the brief.

Pass: move the draft to /deal-intel/weekly-[date].md and append the
run summary and updated pattern log to STATE.md.
Fail: save the exact failing checks to /deal-intel/flags/[date].md.
Do not fix the draft. Do not soften a fail into a note.
```
