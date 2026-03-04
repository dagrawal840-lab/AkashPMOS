# CLAUDE.md for Product Managers

> Drop in your project root. Claude Code loads this automatically every session.

---

## My Context

- Role: [FILL IN] (e.g., Senior PM, B2B SaaS)
- Company: [FILL IN]
- Product: [FILL IN]
- Target users: [FILL IN]
- Current focus: [FILL IN] (e.g., Q1: mobile app launch)
- Primary metric: [FILL IN] (e.g., weekly active users)
- Guardrails: [FILL IN] (e.g., churn rate, latency)
- OKRs: [FILL IN] (e.g., O1: 7-day activation from 23% → 35%)
- Terminology: [FILL IN] (e.g., "Tiger team" = cross-functional sprint, "P0" = drop everything)

---

## Writing Rules

- Direct and concise. No filler. Active voice. Short paragraphs.
- Lead with the ask or recommendation, then context.
- Match the audience: casual for Slack, structured for docs, precise for specs.
- Banned words: delve, landscape, synergy, leverage, robust, streamline, cutting-edge.
- Flag missing info with `[NEED: data from X]` — never fabricate data, quotes, or metrics.
- Use RICE scoring when I ask to prioritize.

---

## Sub-Agent Roles

When I say "review as [role]," adopt that perspective fully:

| Role | Lens | Key Questions |
|------|------|---------------|
| **Engineer** | Feasibility | What's missing from the spec? Edge cases? Technical risks? |
| **Designer** | Usability | Is the flow clear? Where do users get confused or drop off? |
| **Executive** | Strategy | Does this align with OKRs? What's the ROI case? |
| **Skeptic** | Risk | What could go wrong? What assumptions are untested? |
| **Customer** | Value | Would I use this? What's confusing? Would I pay for this? |
| **Data Analyst** | Measurement | Are metrics precise? Baselines documented? Instrumentation in place? |

Chain them for better output: write a PRD → "review as engineer" → fix gaps → "review as skeptic" → tighten assumptions → "review as customer" → simplify the value prop. Three passes, three minutes, dramatically better spec.

---

## Skills (Progressive Disclosure)

Skills live in `.claude/skills/` and load on demand — keeping this file lean. Only universal rules go here. Domain knowledge belongs in skills.

```
.claude/skills/
├── prd-writer/           # "write a PRD" → clarifying Qs, then structured spec
├── competitive-analysis/ # "analyze competitor" → smart/weak/implications
├── launch-checklist/     # "launch checklist" → risk-scaled plan
├── metrics-definer/      # "define metrics" → primary, guardrail, anti-metrics
├── sprint-planner/       # "plan sprint" → capacity-checked sprint
└── user-research/        # "synthesize research" → evidence-ranked findings
```

Create new skills anytime: "Create a skill in `.claude/skills/[name]/SKILL.md` that triggers when I ask to [task]."

Skills auto-trigger on natural language. If one doesn't fire, use the explicit form: "Use the prd-writer skill to write a PRD for X."

---

## @ References (Don't Paste, Point)

Never paste large docs into chat. Reference them:

```
Read @templates/prd-template.md and use that structure.
Check @docs/okrs-q1.md for current objectives.
Summarize @meeting-notes/standup-03-04.md into action items.
Compare @competitor-notes/notion.md against @competitor-notes/monday.md.
```

Claude reads the file on demand. Your context window stays clean. Use this for transcripts, research docs, Slack exports — anything over ~50 lines.

---

## Plan Mode (Shift+Tab)

Toggle before any complex task. Forces Claude to outline its approach before executing. You review, adjust, approve — then it runs.

**When to use:**
- PRDs with multiple stakeholders or open questions
- Multi-file edits or cross-document consistency changes
- Anything where "undo" is expensive or risky
- Research tasks where you want to shape the approach first

**When to skip:** Single-file edits, quick questions, status updates.

---

## Hooks (Guaranteed Automation)

Instructions in this file are advisory — Claude follows them most of the time. Hooks are deterministic — they run every time, no exceptions.

```bash
# Examples of hooks to ask Claude to set up:
"Write a hook that spell-checks every file after I edit it"
"Write a hook that blocks writes to /templates/ and /docs/approved/"
"Write a hook that sends a desktop notification when a long task finishes"
"Write a hook that runs a word count check — block any PRD over 1500 words"
```

Configure via `/hooks` or edit `.claude/settings.json` directly.

**How they work:**
- Hooks fire on events: `PreToolUse`, `PostToolUse`, `Notification`
- Exit code 0 = proceed
- Exit code 2 = block the action + send feedback to Claude (Claude adjusts and retries)
- Use `PreToolUse` hooks to enforce guardrails. Use `PostToolUse` hooks for validation and formatting.

---

## Session Management

### Context Hygiene

- **`/clear` between unrelated tasks.** Context bleed is the #1 quality killer. A PRD session contaminates a status update. A research session contaminates a writing task. Always clear.
- **Cap conversations at ~50 exchanges.** Quality degrades as context fills up. If you're past 40 exchanges, wrap up or hand off.
- **Use Shift+Tab before complex multi-step work.** Plan first, execute after approval. This prevents Claude from going down the wrong path for 10 steps.

### Session Handoffs

Long projects span multiple sessions. Use this pattern:

1. Before ending: "Write a HANDOFF.md — current state, decisions made, open questions, and next steps."
2. Next session: "Read @HANDOFF.md and continue."
3. Or use `claude --continue` to resume your last session directly.
4. For specific past sessions: `claude --resume` to pick from history.

### Parallel Sessions

Run multiple terminal windows with Claude Code simultaneously:

```bash
# Terminal 1: Write the PRD
claude "Write a PRD for the calendar feature using the prd-writer skill"

# Terminal 2: Research competitors
claude "Analyze Calendly vs Cal.com vs Reclaim using the competitive-analysis skill"

# Terminal 3: Define metrics
claude "Define success metrics for the calendar feature using the metrics-definer skill"
```

Each instance gets its own context window. Merge the outputs when all three finish. This is the fastest way to produce a complete feature package.

---

## Self-Improving CLAUDE.md

This file should get smarter every session:

1. Claude makes a mistake → correct it in conversation.
2. Then: "Add a rule to CLAUDE.md so you don't make that mistake again."
3. Claude proposes the rule. You approve. It edits this file.
4. Next session, the rule is loaded automatically.

**Maintenance rules:**
- Prune quarterly. For each line, ask: "Would removing this cause Claude to make mistakes?" If not, cut it.
- Keep this file under 150 lines. Beyond that, Claude starts ignoring instructions. Move domain knowledge into skills.
- Never duplicate what's already in a skill. This file is for universal rules — skills handle task-specific logic.

---

## MCP Connections

[FILL IN any MCP servers you've connected, e.g.:]
- Notion: reading/writing product docs
- Linear/Jira: creating and updating tickets
- Slack: sending messages, reading channels
- Google Drive: accessing shared docs
- GitHub: PRs, issues, code search

MCP tools appear as native Claude actions. Once connected, you can say "create a Jira ticket for this bug" or "post this update to #product-updates in Slack" and Claude handles the API.

---

## Quick Reference

```
/clear              Reset context (CLAUDE.md reloads automatically)
/hooks              Configure automation hooks interactively
/init               Generate a starter CLAUDE.md from your project
/permissions        Set tool access with wildcard syntax
Shift+Tab           Toggle Plan Mode (outline before executing)
Esc                 Cancel current generation
claude --continue   Resume last session
claude --resume     Pick a specific past session
claude -p "prompt"  Non-interactive: run a single prompt and exit
```

---

> **Want the full PM OS?** This starter covers the fundamentals. The complete system has 41+ skills, 7 sub-agent perspectives, a context library, and templates for every PM workflow. [Get it here →](https://www.news.aakashg.com/p/pm-os)
