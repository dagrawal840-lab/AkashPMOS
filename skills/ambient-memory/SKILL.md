# Skill: Ambient Memory

Manage the append-only capture inbox and nightly brain consolidation.

---

## Trigger phrases

- "capture this" / "log this" / "remember this"
- "consolidate" / "nightly run" / "file inbox"
- "load context for [task space]"
- "what do I know about [topic]"

---

## Workflow 1 — Capture

When the user shares a voice memo, meeting transcript, screenshot description, or any raw context:

1. Append to `memory/inbox.md` using this format exactly:
   ```
   [YYYY-MM-DD HH:MM] - [Source: voice/transcript/screenshot/note] - [Raw content verbatim]
   ```
2. Do NOT summarize, categorize, or interpret at capture time.
3. Confirm: "Captured to inbox."

---

## Workflow 2 — Nightly Consolidation

When the user says "consolidate" or triggers the nightly run:

1. Read all entries in `memory/inbox.md` since last consolidation.
2. For each entry:
   - Extract actionable entities (decisions, people, projects, deadlines).
   - Determine the target task space: `ceo-plans`, `office-hours`, `eng-reviews`, `people`, or `projects`.
   - Check the relevant brain file for existing content on that entity.
   - **If no conflict:** append the new content with source citation `[Source: inbox.md, YYYY-MM-DD]`.
   - **If conflict detected:** do NOT silently overwrite. Log:
     ```
     ### CONFLICT: [Original Concept] vs [New Context]
     - Original: [existing claim] [Source: ...]
     - New: [incoming claim] [Source: inbox.md, YYYY-MM-DD]
     - Status: Pending human review
     ```
3. Add a consolidation timestamp at the top of the target file.
4. Mark processed inbox entries with `<!-- consolidated YYYY-MM-DD -->` (do not delete them).
5. Produce a **daily digest** summary: entities filed, conflicts flagged, links updated.

---

## Workflow 3 — Context Loading (Pre-computation)

When the user starts a task in a specific space (e.g., "I'm going into eng-reviews"):

1. Load only the **headers and entity stubs** from `memory/brain/[task-space]/`.
2. Do NOT load full documents unless the user asks for deep retrieval on a specific entity.
3. Surface: "Loaded [N] entity stubs from eng-reviews. Ask me about any to go deeper."

---

## Anti-patterns

- Never fill a `[NEED: ...]` gap with a guess during consolidation — log it as a gap.
- Never merge conflicting claims silently.
- Never load the full brain unprompted — token discipline is required.
