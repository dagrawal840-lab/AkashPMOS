# Memory Config

> Written once at install by the `/pm-memory` skill, then read at the top of every
> `/ingest` and `/review` so promotion lands in the host OS's real files. Lives at
> `<memory-root>/.memory-config.md`. Edit it if your OS's layout changes.

## Host OS
<!-- pm-os | job-search-os | team-os | custom -->
custom

## Memory root
<!-- where the pipeline (source/ ingestion/ hypotheses/ decisions/) lives -->
context-library/

## Promotion map — signal type → canonical home (relative to repo root)
<!-- Where each kind of durable signal gets promoted TO. Fill in for the host OS.
     Leave the pipeline defaults where the host has no obvious home. -->

| Signal type | Canonical home |
|---|---|
| Person / stakeholder | `<fill in — e.g. context-library/research/stakeholders/<slug>.md>` |
| Recurring user / market insight | `<fill in — e.g. context-library/research/insights.md>` |
| Competitive intelligence | `<fill in — e.g. context-library/research/competitors/<slug>.md>` |
| Decision | `context-library/decisions/<date>-<slug>.md` |
| Feature hypothesis | `context-library/hypotheses/<slug>.md` |
| Interview / meeting record | `<fill in — e.g. context-library/meetings/>` |

## Renamed commands
<!-- If the host OS already had a /review (or similar), record the rename here. -->
none
