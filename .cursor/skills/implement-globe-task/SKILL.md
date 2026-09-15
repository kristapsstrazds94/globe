---
name: implement-globe-task
description: >-
  Implements a World Globe TASKS.md item (T001+) with mandatory doc reads and
  manual test handoff. Use when the user runs /next, names a task ID, asks to
  implement the next task, or continue a milestone.
---

# Implement a globe task

## Test handoff (required)

Two turns in the **same chat**:

1. **Implement turn** — Code + tests (write only). Set `TASKS.md` to `IN PROGRESS`. End with verification commands. **Stop.** Do not run lint/typecheck/test/build. Do not set `DONE`.
2. **`tests passed` turn** — User ran checks and replied **`tests passed`**. Self-check with `.cursor/skills/definition-of-done/SKILL.md`. Set `TASKS.md` to **`DONE`**. Print a copy-paste conventional commit subject in a `text` fence (see section 6). Confirm in one short line. **Stop.** Do not start the next task. Do not `git commit` unless asked.

If the user pastes failures: fix only those, reprint commands, wait again.

**Implement-turn output (keep short):** task ID, **Docs read** list, copy-paste commands, one line asking them to reply **`tests passed`**. Do not print the commit message on the implement turn.

Copy this checklist and keep it updated:

```
Task: <id>
- [ ] 1. Read mandatory docs (see table below)
- [ ] 2. Load acceptance criteria from TASKS.md
- [ ] 3. Inspect existing code
- [ ] 4. Implement smallest change that satisfies criteria
- [ ] 5. Write tests when required — do not run them
- [ ] 6. Set TASKS.md to IN PROGRESS
- [ ] 7. Print manual verification commands and stop
```

## 1. Mandatory doc reads

Always read **`AGENTS.md`** and **`TASKS.md`** for the chosen task.

Then read by task ID (read linked docs **fully**):

| Task IDs  | Also read                                                          |
| --------- | ------------------------------------------------------------------ |
| T001–T003 | `docs/ARCHITECTURE.md`, `docs/WORKFLOW.md`                         |
| T010–T014 | `docs/ARCHITECTURE.md`, `docs/PERFORMANCE.md`, `docs/DESIGN.md`    |
| T020–T024 | `docs/GEOGRAPHY.md`, `docs/PERFORMANCE.md`, `docs/ARCHITECTURE.md` |
| T030–T034 | `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/PERFORMANCE.md`    |
| T040–T043 | `docs/DESIGN.md`, `docs/TESTING.md`, `docs/ARCHITECTURE.md`        |
| T050–T052 | `docs/DESIGN.md`, `docs/PERFORMANCE.md`, `docs/TESTING.md`         |
| T060–T064 | `docs/PERFORMANCE.md`                                              |
| T070–T077 | `docs/TESTING.md`, `docs/CHECKLIST.md`, `docs/WORKFLOW.md`         |

If editing path-scoped code, also follow the matching rule:

- `src/components/globe/**` → `.cursor/rules/globe-rendering.mdc`
- `scripts/geography/**`, `src/lib/geo/**` → `.cursor/rules/globe-geography.mdc`
- `src/components/ui/**` → `.cursor/rules/globe-ui.mdc`
- `**/*.{test,spec}.{ts,tsx}` → `.cursor/rules/globe-testing.mdc`

State **Docs read:** in the pick report. Do not implement without reading the mandatory docs for that task ID.

## 2. Pick one task (`/next`)

1. Walk milestones M0 → M7 in order.
2. Within a milestone, lowest task ID first (T001 before T002).
3. Skip `DONE` and `BLOCKED`.
4. Prefer `IN PROGRESS` with remaining work; else first `NOT STARTED`.
5. Do not start a later milestone while an earlier one has an incomplete continuable task.
6. Implement **only** that task.

Report: chosen ID + title, why it is next, **Docs read**.

## 3. Read before write

Inspect existing code. Match local structure from `docs/ARCHITECTURE.md`. Do not mechanically create every suggested file before the task requires it.

## 4. Hard stops (from AGENTS.md)

- No frame-level camera/pointer state in React/Zustand.
- No allocations in `useFrame` when avoidable.
- No invented country metadata.
- No hover-only critical information.
- No marking `DONE` on implement turn.
- No starting the next task unless asked.
- No `git commit` unless asked.

## 5. Finish (implement turn)

1. Set `TASKS.md` to **`IN PROGRESS`** (never **`DONE`** here).
2. Print verification commands that apply (only what exists after this task), e.g.:
   - `npm run lint`
   - `npm run typecheck`
   - `npm test`
   - `npm run build`
   - `npm run dev` (when manual UI/WebGL check is needed)
3. List manual checks from acceptance criteria (responsive, keyboard, reduced-motion, geography edge cases).
4. One line: reply **`tests passed`** when green.
5. **Stop.** Do not print a commit message on this turn.

## 6. When the user replies `tests passed`

Follow `.cursor/skills/definition-of-done/SKILL.md`, then set **`DONE`** in `TASKS.md`.

Print a conventional commit message for the user to copy (do not run `git commit`):

```text
<type>(<scope>): <imperative summary, ≤72 chars>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`

**Scopes (examples):** `globe`, `ui`, `geo`, `app`, `ci`, `build` — pick the best fit; omit scope only when none applies.

**Examples:**

```text
feat(globe): add R3F canvas shell with responsive sizing
chore(ci): add lint, typecheck, and build quality gates
fix(ui): keep country tooltip inside viewport bounds
```

No task ID in the subject. Confirm which task was marked done in one short line. **Stop.**
