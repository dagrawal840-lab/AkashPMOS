# Ambient Memory System & Routing

## 1. Capture Inbox (Append-only)
Whenever you capture context (voice memos, meeting transcripts, or screenshots), append them as raw text to `inbox.md`. Do not let the agent categorize these immediately.
- Format: `[YYYY-MM-DD HH:MM] - [Context Source / Screenshot / Audio transcript]`

## 2. Consolidation Process (Nightly Run)
At the end of the day, prompt the agent to read `inbox.md` and file them into your permanent markdown brain. 
- Instruct the agent: "Review the raw inputs, extract actionable entities, link to existing documents, and record the source on every claim."

## 3. Conflict Resolution
If the agent encounters conflicting information during consolidation, it must log the conflict explicitly instead of a silent overwrite:
- Marker: `### CONFLICT: [Original Concept] vs [New Context]`
- The agent will flag this in your daily digest for human review.

## 4. Pre-computation Pushing
Push context to the agent, scoped by the specific task space (e.g., `ceo-plans`, `office-hours`, `eng-reviews`). 
- Maintain a token compression discipline by only loading document headers or entity stubs unless deep memory retrieval is required.
Use code with caution.
