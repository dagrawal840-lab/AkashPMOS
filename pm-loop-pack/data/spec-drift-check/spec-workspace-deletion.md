# Spec: Workspace Deletion & Recovery

- **Owner:** Priya Nair (PM, Core Platform)
- **Eng lead:** Marcus Feld
- **Status:** Shipped 2026-07-14 (release 2026.28)
- **Linear epic:** CORE-2214
- **Last edited:** 2026-06-02

## 1. Hypothesis

Letting workspace owners delete workspaces themselves (with a recovery window) will cut "delete my workspace" support tickets by 60% without increasing accidental data loss.

## 2. Problem

Support handles ~140 workspace-deletion requests/month (Zendesk tag `ws-delete`, May 2026). Median resolution: 2.3 days. Owners can't self-serve; deletion is a manual runbook run by SRE. Three incidents in Q1 where the wrong workspace was deleted (INC-881, INC-904, INC-917).

## 3. Requirements

### 3.1 Soft delete with 30-day recovery

When an owner deletes a workspace, the workspace enters a `pending_deletion` state and is **retained for 30 days**. During this window the owner can restore it from Settings → Danger Zone with all data intact (docs, members, integrations, audit log). Hard deletion of the underlying data happens only after the 30-day window expires, via the nightly purge job. This is a hard requirement from Legal (see DPA addendum v4, §7 — customer data recoverability).

### 3.2 Deletion permission

Only users with the **workspace owner** role may initiate deletion. (Note: original draft said "owner or admin"; narrowed to owner-only on 2026-06-02 per security review SR-2026-041.)

### 3.3 Confirmation flow

Deletion requires typing the workspace slug into a confirmation dialog. The dialog must display the recovery window ("You can restore this workspace within 30 days").

### 3.4 Notification email

On deletion, all workspace admins receive an email stating who deleted the workspace, when, and the restore deadline.

### 3.5 Pre-deletion export

Before confirming deletion, the owner is offered a one-click full workspace export (ZIP: docs as markdown, members CSV, audit log JSON). Export generation must complete or be explicitly skipped before the delete button enables. **Target: ship with the deletion flow.**

## 4. Success metrics

- `ws-delete` Zendesk tickets: 140/mo → ≤55/mo within 60 days of launch
- Restore rate during recovery window as accidental-deletion proxy: expect 3–8%
- Guardrail: zero unrecoverable-deletion escalations

## 5. Non-goals

- Org-level (multi-workspace) bulk deletion
- Per-document trash/restore (separate spec, CORE-1980)
- Self-serve data-residency migration
