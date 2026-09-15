---
name: definition-of-done
description: >-
  Checks World Globe task acceptance criteria and universal DoD before marking
  TASKS.md done. Use when the user says tests passed, /verify, is this done,
  definition of done, DoD, or ready to mark a task complete.
---

# Definition of done

A task is incomplete until **both** lists are satisfied.

## Task acceptance criteria

Read `TASKS.md` for the task ID. Every acceptance criterion must be demonstrated (code, test, or verified manual check) — not narrated.

## Universal (every task)

From `AGENTS.md` and `docs/WORKFLOW.md`:

- [ ] Scope matches one task only; no silent scope expansion.
- [ ] Relevant docs were read before implementation.
- [ ] TypeScript strict; avoid `any`.
- [ ] Rendering/UI boundaries respected (`docs/ARCHITECTURE.md`).
- [ ] No obvious performance anti-patterns (`docs/PERFORMANCE.md`).
- [ ] Accessibility considered when UI or interaction changed.
- [ ] `TASKS.md` status is accurate.

## By area (when the task touches them)

**Rendering** (`docs/PERFORMANCE.md`, `globe-rendering` rule):

- [ ] No broad React re-renders on pointer/camera frames.
- [ ] GPU resources reused where applicable.
- [ ] Mobile/constrained behavior considered.

**Geography** (`docs/GEOGRAPHY.md`):

- [ ] Stable IDs; geometry/metadata separated.
- [ ] Build-time preprocessing; no runtime GeoJSON parsing.
- [ ] Edge cases considered (poles, antimeridian, MultiPolygon).

**UI** (`docs/DESIGN.md`):

- [ ] Globe remains dominant; UI does not obscure it unnecessarily.
- [ ] Keyboard/search path exists where interaction was added.
- [ ] Reduced motion respected for animations.

**Testing** (`docs/TESTING.md`):

- [ ] Required tests exist for logic added in this task.
- [ ] User has run verification commands and confirmed success (or you are on the `tests passed` turn).

## Report format

```
Task: <id>
Acceptance: <met / not met — which criterion>
DoD: <met / not met — which box>
Tests run: user confirmed / pending
TASKS.md: <current status>
Remaining: <none | list blockers>
Commit: <type>(<scope>): <imperative summary> — only on `tests passed` turn
```

## When to set DONE

Set `TASKS.md` to **`DONE`** only when:

1. The user explicitly said **`tests passed`** (or clear equivalent), **and**
2. Every acceptance criterion for that task is met, **and**
3. No open DoD boxes remain for the work in scope.

Do not set **`DONE`** if tests have not been run and confirmed by the user (except documenting pre-existing `DONE` rows).

Do not start the next task after marking **`DONE`** unless the user asks or runs `/next`.

## Commit message (required on `tests passed` turn)

After marking **`DONE`**, always print a copy-paste conventional commit subject in a `text` fence:

```text
<type>(<scope>): <imperative summary, ≤72 chars>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`

**Scopes (examples):** `globe`, `ui`, `geo`, `app`, `ci`, `build`

No task ID in the subject. Imperative mood, specific to what changed. Do not `git commit` unless the user asks.
