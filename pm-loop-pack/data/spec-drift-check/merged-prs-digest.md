# Merged PRs & commits digest — workspace-deletion epic (CORE-2214)

Generated 2026-07-15 by `scripts/pr-digest.sh --epic CORE-2214 --since 2026-06-01`. Covers `platform-api` and `web-app` repos, merged to `main`.

---

## PR #4812 — Workspace deletion endpoint + confirmation flow
- **Repo:** platform-api · **Merged:** 2026-06-19 · **Author:** mfeld
- **Linear:** CORE-2216
- Adds `DELETE /v1/workspaces/:id`. Permission check: caller must have `role == "owner"` on the workspace (403 otherwise).
- Confirmation handled client-side (see web-app #2287); API requires `confirm_slug` param matching workspace slug.

## PR #2287 — Danger Zone: delete workspace dialog
- **Repo:** web-app · **Merged:** 2026-06-20 · **Author:** t.okafor
- Confirmation dialog with slug-typing gate. Copy: "This will permanently delete **{slug}**. You can restore this workspace within 30 days."
- Delete button disabled until slug matches. Screenshot in PR description.

## PR #4820 — Rename `wsRecord` → `workspaceEntity` across deletion module
- **Repo:** platform-api · **Merged:** 2026-06-24 · **Author:** j.lindqvist
- Pure refactor: renames the `wsRecord` struct and 61 call sites to `workspaceEntity` for consistency with the entity-layer naming RFC. Also extracts `validateSlugConfirmation()` helper from the handler. No behavior change; test suite untouched and green.
- Reviewer note (mfeld): "diff is big but it's mechanical, verified with `git diff --word-diff`."

## PR #4831 — Deletion execution: drop workspace rows on confirm
- **Repo:** platform-api · **Merged:** 2026-06-27 · **Author:** d.reyes
- On confirmed delete, runs `PurgeWorkspace(ctx, wsID)` **synchronously in the request path**: deletes workspace row, cascades to docs, members, integrations tables; S3 attachments enqueued to `attachment-reaper` queue (processed within ~1h).
- Removed the `pending_deletion` state stub from #4812 — per PR description: "purge job isn't built yet and we needed delete to actually delete for the 07/14 cut; state machine added complexity. Can revisit."
- Restore path returns `404 workspace_not_found` after deletion (tested in `deletion_e2e_test.go:114`).

## PR #2301 — Deletion notification email
- **Repo:** web-app (notification-service config) · **Merged:** 2026-07-01 · **Author:** t.okafor
- Sends `workspace_deleted` email to **workspace owners only** (not all admins): actor, timestamp, restore deadline (computed as deleted_at + 30d). PR description: "scoped to owners per Priya's 07/02 decision — admin blast flagged as noisy in beta."
- Template: `emails/workspace_deleted.mjml`.

## PR #4844 — Admin role removed from deletion permission matrix
- **Repo:** platform-api · **Merged:** 2026-07-03 · **Author:** mfeld
- Follow-up to security review SR-2026-041: deletion permission is owner-only. Removes `admin` from the `workspace.delete` grant that briefly existed on a feature branch. Adds regression test.

## PR #4851 — Feature flag cleanup + launch checklist
- **Repo:** platform-api · **Merged:** 2026-07-11 · **Author:** d.reyes
- Removes `ff_workspace_self_delete` flag, enables for all tenants. Launch checklist in PR body notes: "export-before-delete (CORE-2219) still open, tracked for 2026.30 — not blocking launch per Priya 07/08 standup."

---

*No merged PRs reference CORE-2219 (pre-deletion export) as of this digest.*
