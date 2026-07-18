# The PM Loop Pack

12 working loops for product managers. Each file has the full skill file, the gate, the state file, and separate maker/checker prompts. Copy, fill in the brackets, run.

From the Product Growth deep dive: Loops for PMs. Get the guide at news.aakashg.com.

## New here? Don't read this — run it

Open Claude Code in this folder and say **"get me started."** Claude scans what you have connected (Slack, Notion, Linear, analytics, CRM…), picks the one loop that works with it, and offers to run it so you see your first output in minutes. Nothing connected? Every loop ships with realistic demo data in `data/` — you still get an output this session. The rest of this README is for after you've seen one run.

## Before you run any loop

Ask the four questions:
1. Does this task repeat at least weekly?
2. Can you write the "done" criteria before the agent starts?
3. Is a wrong output caught before it reaches a stakeholder?
4. Does a human review before anything irreversible happens?

All four yes: build the loop. Any no: it's a prompt, not a loop.

## The 12 loops, by task pattern

**Repeating Synthesis** (same sources, same format, new content each cycle)
1. Weekly competitive brief
2. Feedback theme digest (tickets, sales notes, reviews, NPS, and user interviews)
3. Sales deal intelligence
4. Weekly business review

**Event-Triggered Extraction** (fires when something happens)
5. Spec drift check
6. Launch readiness sweep

**Periodic Prep Documents** (recurring docs for the same stakeholders)
7. Product review hardening
8. Sprint prep sweep
9. Stale doc sweep

**Threshold Monitoring** (watches, fires only when a line is crossed)
10. Metric anomaly flag
11. Onboarding friction monitor
12. AI quality watchdog

## How loops actually run

Each loop file names its runner. There are three, and picking the wrong one is the most common setup mistake:

**Scheduled task** (most loops in this pack). Runs unattended on a schedule, no session open. Use the Claude desktop app's scheduled tasks or your OS scheduler calling:

```
claude -p --bare "/skill-name"
```

**/loop** (in-session intervals only). Runs a prompt or skill every N minutes while your session is open:

```
/loop 30m /metric-anomaly
```

It dies when the session closes and recurring tasks expire after 7 days. Right for watching something during launch week. Wrong for the Monday 7am brief.

**Event trigger** (the event-triggered loops). A webhook or automation calls the same headless command when the event fires, or you run it by hand the moment it happens.

**Headless auth gotcha.** Cron and automation contexts don't always inherit your interactive login — `claude -p` can fail with "Not logged in" even when your terminal session works. Test the exact command from your scheduler once before trusting the schedule; set an API key in the scheduler's environment if it can't reach the keychain.

## The six pieces every loop needs

Trigger, skill file, maker, checker, gate, state file. Skip one and the loop keeps running while the output silently drifts. Two are worth spelling out because every loop in this pack depends on them:

**Maker-checker split.** One agent makes. A different agent — fresh context, no exposure to the maker's reasoning — checks. Never the same agent: the model that wrote the brief is too nice grading its own homework. Each loop file has a separate maker prompt and checker prompt; run them as two invocations (or a subagent for the checker), not one prompt with a "checker:" line at the bottom.

**State file.** Every skill folder gets a STATE.md: last run summary, pattern log, lessons learned. The maker reads it at start; the checker appends to it after a pass. Without it the loop restarts from zero every run — yesterday's flag gets re-announced as news, a flagged metric that dips just under threshold vanishes without a trace, and the anomaly rolls into the baseline until the alert extinguishes while the problem stays.

## Need a loop that isn't in the pack?

Tell Claude Code: **"build me a loop that [does X]."** The loop-builder skill runs the 4-question readiness test, asks only what it can't safely assume (sources, done-criteria, thresholds — with proposed defaults), writes all six pieces at the same quality bar as the shipped 12, and test-runs it with a separate checker before handing it over.

## Maintaining your loops

- Never correct a loop in chat. Write every mistake into the skill file's "Known failure modes" section, where it compounds.
- Audit each gate every 6 weeks. Gates rot silently while the status stays green.
- Reread each skill file when your product's position changes. The loop runs on your old strategy until you tell it otherwise.
- Retire any loop whose output you've stopped editing. A loop nobody argues with is a loop nobody's checking.

## The rule that makes all 12 work

Every loop writes to a file. You approve before anything reaches a stakeholder or ships. The loop gathers and drafts. You judge.

Product Growth · Aakash Gupta
