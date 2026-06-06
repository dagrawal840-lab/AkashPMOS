# Memory Operating Manual (append to your OS's CLAUDE.md)

> This block teaches Claude Code how to treat your knowledge store as a brain, not a folder.
> The `/pm-memory` skill appends it to your `CLAUDE.md` at install. It is the
> Claude-Code-native answer to "where does memory live and when does the bookkeeping run,"
> and it works on top of any OS you've built — PM-OS, the Job Search OS, Team OS, or your own.

## The memory root and the promotion map

The pipeline lives under a single **memory root** chosen at install (`context-library/` for
PM-OS and the Job Search OS; `memory/` for Team OS or a bare project), marked with a
`.memory-root` file. Where durable knowledge gets **promoted to** is host-specific and
recorded in `<memory-root>/.memory-config.md`. Read that config before promoting — it tells
you whether a stakeholder lands in `research/stakeholders/<slug>.md` (PM-OS), in
`connection-tracker.md` (Job Search OS), or under `team/` (Team OS). The whole point is to
feed the host OS's existing files so its slash commands fire on fresh signal, not to build a
parallel store.

## The cognition pipeline

Evidence flows one direction and fans out at the durable layer. Nothing skips a stage.

```
<memory-root>/source/      (immutable copy of the raw input — the audit anchor)
        ↓
<memory-root>/ingestion/   (working memory — observations tagged, synthesis lives here)
        ↓  promote only what crosses the bar
<memory-root>/hypotheses/  feature-scoped bets, evidence-state
<memory-root>/decisions/   committed choices, append-only, "what would reverse this"
        +
the host OS's durable files, per .memory-config.md (e.g. PM-OS research/ + stakeholders/,
   Job Search OS connection-tracker.md, Team OS product-development/ + team/)
```

`source/`, `ingestion/`, `hypotheses/`, and `decisions/` are the folders the memory layer
adds under the memory root. Promotion also writes into the host OS's own knowledge files so
its slash commands (e.g. PM-OS `/prd-draft`, Job Search OS `/company-research`) work from
fresh signal instead of stale templates.

## Capture is ambient, not a command — hard rule

You do not wait for `/ingest`. Whenever the operator pastes a transcript, shares a link,
or reaches a conclusion in the course of a session, capture it as part of responding:
copy the raw artifact to `source/`, write the synthesis to `ingestion/`, and promote what
crosses the bar. `/ingest` exists as an explicit router for when the operator wants a
specific artifact handled in a specific shape, but the default is ambient capture inside
the session you're already having. The session is the capture unit, not a command.

## Pre-task load, post-task update — hard rule

Before any task, load the relevant area files. After any task, update them. The
session-end Stop hook will block your turn from finishing if you leave the brain dirty
and uncommitted — that's the consolidation pass, by design, and it is what makes capture
*guaranteed* rather than merely instructed (see § The self-updating harness).

## The self-updating harness — why this is reliable, not advisory

A `CLAUDE.md` rule like "remember to capture meetings" is **advisory**: the agent follows
it most of the time and silently drops it as context fills. Advisory self-update is exactly
why a context-library goes stale. This layer makes self-update reliable by stacking three
mechanisms, in increasing order of guarantee:

1. **Advisory** — the ambient-capture rule above. Good for nuance, not sufficient alone.
2. **Deterministic** — the hooks. The Stop hook is "self-update at session end": the session
   cannot close with the brain dirty without consolidating and committing. The PostToolUse
   hook enforces the schema at write time. This is the layer that turns self-update into a
   property instead of a hope.
3. **Self-improvement** — when the operator corrects *how* you work (not what you know),
   propose a new rule and append it to `CLAUDE.md` (via Claude Code's `#` shortcut or
   `/memory`). This stays operator-approved on purpose: rewriting your own operating rules is
   judgment work, the same reason memory promotion is judgment-gated.

Knowledge self-update is made deterministic (the Stop hook). Behavior self-update stays
human-in-loop. That split is deliberate.

## Source preservation — hard rule

**Before** synthesizing or routing any ingested artifact, copy it verbatim to
`<memory-root>/source/<kind>/YYYY-MM-DD-<slug>.md`. It is never edited after creation.
The matching `ingestion/<kind>/<same-name>.md` is where synthesis lives and gets revised.
Skipping `source/` to save a step makes the brain epistemically unfalsifiable. Don't.

## Provenance — every load-bearing claim wears a tag

See [`PROVENANCE.md`](context-library-schemas/PROVENANCE.md). The PostToolUse hook rejects
orphan evidence rows at write time. This is the thing a nightly cron can't do: enforcement
in the loop, the moment the file is written.

## Knowledge hygiene — facts vs interpretations

Tag content as **observation** (directly verifiable), **interpretation** (inference),
**hypothesis** (testable belief), **decision** (committed choice), or **assumption**
(unverified premise). Stakeholder motivations and synthesized insights are interpretations
by default. Never store an interpretation as a fact.

## Evidence hierarchy

When sources conflict, weight roughly: (1) explicit decisions, (2) strategy, (3) direct
customer evidence, (4) product analytics, (5) stakeholder opinions, (6) market signals,
(7) internal speculation. Don't silently overwrite a higher-confidence source with a
lower one — surface the tension and let the PM resolve it.

**Recency is not strength.** Prefer repeated patterns over fresh anecdotes. A single new
interview adds evidence, not a verdict. An analytics snapshot is correlational until its
methodology says otherwise — record sample size and confounders, and don't bump a
hypothesis's confidence on one correlational signal.

## Memory promotion — working vs durable (judgment, not automation)

Raw `ingestion/` is **not durable knowledge.** It gets promoted into its canonical home
(per `.memory-config.md` — the host OS's knowledge files, or the pipeline's own
`hypotheses/` / `decisions/`) only if it is recurring (2+ independent sources),
decision-relevant, strategy-relevant, or clearly useful beyond one session. One-offs stay
in ingestion until they accumulate.

This is the deliberate split from auto-consolidating brains: **you sign off on what becomes
durable.** Auto-promotion fills the durable layer with noise. The friction is the feature.
When you promote a pattern, the audit trail in its canonical file must be complete in the
same turn: each supporter named by source slug, dissent preserved under a `Contradictions`
heading, not flattened into "diverse feedback."

## Escalation — act vs ask

**Act autonomously** for: routing, cross-linking, drafting (decisions, hypotheses,
stakeholder snapshots), synthesis, stale-note cleanup, promotion within the bar above,
anything reversible in `ingestion/`.

**Ask the PM before:** changing `strategy/`, resolving a strategy tension, promoting or
killing a major hypothesis, rewriting stakeholder motivations, deleting historical
knowledge, making externally visible commitments, archiving a feature.

## INDEX maintenance — hard rule

When you create a file under `hypotheses/`, `decisions/`, or any host area that ships an
INDEX, update that area's INDEX in the same turn.

## What this is not

Not a fully autonomous PM. Not maximum capture — it deliberately throws one-offs out. Not a
fact-checker — garbage in is citation-laden garbage out, so input discipline still matters.
The brain preserves provenance and contradictions; it does not resolve genuinely ambiguous
reality for you.
