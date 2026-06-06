# Claude Code Memory Layer

A memory layer for the **Claude Code harness** that drops onto any OS you've built — PM-OS,
the [Job Search OS](https://www.news.aakashg.com/p/claude-code-job-search-os),
[Team OS](https://github.com/aakashg/product-growth-team-os), or a bare project. It turns the
host OS's knowledge store from a folder you forget to update into an auditable brain that
enforces its own schema and consolidates at the end of each session.

It's **store-agnostic.** It installs its own pipeline at a detected memory root and maps
promotion onto whatever store the host already uses:

| Host OS | Store shape | Memory root |
|---|---|---|
| PM-OS | `context-library/` with rich subfolders | `context-library/` |
| Job Search OS | `context-library/`, flat files | `context-library/` |
| Team OS | `product-development/` + `team/`, own `.claude/` hooks | `memory/` |
| Your own | anything | `context-library/` if present, else `memory/` |

This is the answer to "I read about GBrain, but I live in Claude Code at my desk, not on my
phone all day — what do I actually do here?" GBrain is the right memory modality for an
ambient, phone-first harness (OpenClaw, Hermes): it auto-captures everything you say and
consolidates on a nightly cron. That same design is the wrong fit for Claude Code, where
you're already in a terminal with the files open. So this layer makes the opposite trades:

| | GBrain (ambient / phone harness) | This layer (Claude Code harness) |
|---|---|---|
| Capture | Automatic, conversational, zero friction | Explicit (`/ingest`) — a little friction, on purpose |
| Promotion to durable memory | Auto-consolidated by the night cycle | **Judgment-gated** — you sign off, noise stays out |
| Schema enforcement | After the fact, at 3am | **In the loop**, at write time (PostToolUse hook) |
| Consolidation trigger | Cron on an always-on host | **Session-end** Stop hook, human-in-loop |
| Store | Local DB + markdown, vector index | Plain markdown in your git repo. No DB, no index |
| Failure modes | Sleeping-laptop cron, single-writer DB crash, latency | None of those — it's just files and hooks |

Neither is "better." They match different harnesses. Run GBrain on your phone *and* this in
Claude Code if you live in both.

## What's in the box

```
CLAUDE-CODE-MEMORY/
├── README.md                          ← you are here
├── MEMORY-OPERATING-MANUAL.md         ← appended to your PM-OS CLAUDE.md at install
├── .claude/
│   ├── settings.json                  ← wires both hooks
│   ├── hooks/
│   │   ├── validate_memory_file.py    ← PostToolUse: blocks orphan evidence at write time
│   │   └── session_consolidate.py     ← Stop: nudges consolidation when the brain is dirty
│   ├── skills/pm-memory/SKILL.md       ← the installer / orchestrator
│   └── commands/{ingest,recall,prep,review}.md   ← the four verbs
└── context-library-schemas/
    ├── PROVENANCE.md                  ← the provenance enum the hook enforces
    ├── decisions/_SCHEMA.md
    └── hypotheses/{_SCHEMA.md,INDEX.md}
```

## Install

You need a Claude Code project with a `CLAUDE.md` and `python3` on PATH. From the project
root, point Claude Code at this package:

```
> Follow CLAUDE-CODE-MEMORY/.claude/skills/pm-memory/SKILL.md and install the memory layer.
```

The skill detects your host OS, picks a memory root, writes a promotion map
(`.memory-config.md`) onto your store, copies the hooks/commands/schemas in (merging into any
existing `.claude/` config rather than clobbering it — important for Team OS), appends the
operating manual to your `CLAUDE.md`, and runs a self-test that confirms the write-time block
actually fires. It won't report success until it does — an unenforced schema is exactly the
failure this layer exists to prevent.

## The loop, once installed

1. **`/ingest`** a transcript, note, or screenshot → it lands in `source/` (verbatim) and
   `ingestion/` (synthesized), and anything that crosses the promotion bar fans out into the
   durable layer.
2. **`/recall`** anything → answered from the files, with citations you can click.
3. **`/prep <name>`** before a 1:1 → a briefing built from the touchpoint log.
4. **`/review`** Friday → the six-check sweep that keeps the brain from rotting.

While you work, the PostToolUse hook blocks any evidence row that doesn't wear a provenance
tag, and the Stop hook nudges you to consolidate and commit before the session ends.

## How it relates to GBrain in this repo

The GBrain skillpack in this repo (`SKILLS/`) runs inside Hermes on your phone. This layer
runs inside Claude Code on your laptop. They write to the same `context-library/`, so
whichever harness you're in, your slash commands fire on fresh signal.

## Credit

The cognition pipeline (source → ingestion → durable), the provenance enum, the
hypothesis/decision split, and the write-time validator are adapted from
[Pawel Huryn's](https://www.news.aakashg.com/p/ai-pms-guide-to-claude) open-source
[PM Brain](https://github.com/phuryn/pm-brain), re-tuned for PM-OS's
`context-library/` and for the Claude Code harness (settings.json hooks rather than a
standalone brain repo, session-end consolidation rather than a separate sweep cadence).
