# PM Loop Pack — repo instructions

This repo is the working companion to "Loops for PMs: The Ultimate Guide" (Product Growth, Aakash Gupta). It ships 12 loop definitions, their instantiated skills, and realistic demo fixture data. Every loop was tested with blind maker/checker agents and adversarial graders before shipping.

## First session: onboard, don't tour

If `LOOPS.md` does not exist at the repo root, this user has never run a loop. Exception: if their first ask is to build a new loop, go straight to the `loop-builder` skill (it creates `LOOPS.md` itself). Otherwise, whatever they ask first — "what is this", "help", anything exploratory — run the `start-here` skill: scan their connected MCP tools, recommend the ONE loop that works with what they already have, ask "shall I run it now so you can see the output?", and get them a real output this session (bundled fixtures in `data/` if nothing is connected). Do not list all 12 loops. Do not explain the architecture first. Output first, theory after. Once `LOOPS.md` exists, skip this and treat them as onboarded.

## Layout

- `1-repeating-synthesis/` … `4-threshold-monitoring/` — the 12 loop definition files. Each has: skill file spec, state file spec, gate, maker prompt, checker prompt, runner instructions.
- `.claude/skills/<loop-name>/SKILL.md` + `STATE.md` — instantiated, runnable versions of each loop (fixture-backed; swap fixture paths for your real sources).
- `data/<loop-name>/` — realistic fixture inputs each instantiated skill runs against.
- `runs/<loop-name>/` — created on first run: drafts, approved outputs, and flags land here.

## Rules for working in this repo

- Every loop is maker → checker → gate → state. The maker and checker are **separate agent invocations**. Never merge them into one prompt.
- Loops write drafts to files; a human approves before anything reaches a stakeholder. Never wire a loop's output directly to Slack/Notion/email without the gate passing AND human review for irreversible actions.
- When a loop makes a mistake, write it into that skill's "Known failure modes" section — never just fix it in chat.
- The maker reads STATE.md at start. The checker appends to STATE.md after a pass. Keep that contract when editing prompts.
- Loop definition files (the 12 numbered .md files) are the source of truth; regenerate `.claude/skills/` instantiations from them, not the other way around.
- When the user wants a NEW loop that isn't one of the 12, use the `loop-builder` skill — readiness test first, then all six pieces, then a test run with a separate checker. Never hand over an untested loop.

## Running a loop here

```
claude -p --bare "/[skill-name]"          # scheduled/headless (test auth first)
/loop 30m /[skill-name]                   # in-session only, expires after 7 days
```

Headless runs may fail "Not logged in" under cron — set an API key in the scheduler environment.
