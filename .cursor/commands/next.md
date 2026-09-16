---
description: Implement the next TASKS.md item; wait for manual tests before marking done
---

Follow `.cursor/skills/implement-globe-task/SKILL.md`.

Read `AGENTS.md`, `TASKS.md`, and mandatory docs for the chosen task per the skill’s doc table.

## Pick one task

Choose **one** task that can continue **now**:

1. Walk milestones in order (M0 → M1 → …). Within a milestone, pick the lowest task ID (e.g. T001 before T002).
2. Skip if status is `DONE` or `BLOCKED`.
3. Prefer an `IN PROGRESS` row that still has remaining work. Otherwise pick the first `NOT STARTED` row in that milestone.
4. Do not start a later milestone while an earlier one still has an incomplete task that can continue.
5. Implement **only** the chosen task. Do not silently expand scope or start the next task.

State briefly:

- Chosen task ID and title
- Why it is next
- **Docs read** (required list from skill)

## Implement

Follow `AGENTS.md`, the skill, and the task’s acceptance criteria.

- Keep changes focused on this task only.
- Inspect existing code before modifying it.
- Write or update tests when the task calls for them, but **do not run** lint, typecheck, test, or build commands yourself.

## Finish (same chat — do not wait for tests yet)

1. Set the task in `TASKS.md` to **`IN PROGRESS`** if it was `NOT STARTED`. **Never set `DONE` in this step.**
2. Set **`BLOCKED`** only if there is a genuine external blocker; document **Blocker** and **Unblock** under the task.
3. Print the **manual verification commands** the user should run (only what applies to this task). **Always use `pnpm`, never `npm`.**
4. List any manual checks from the acceptance criteria that cannot be automated.
5. End with one line: reply **`tests passed`** when verification is green.
6. **Stop.** Keep the message short — commands and manual checks first, minimal recap. Do not print a commit message on this turn.

## When the user replies `tests passed`

Follow `.cursor/skills/definition-of-done/SKILL.md`. Only after explicit confirmation:

1. Re-read the task acceptance criteria and confirm they are satisfied.
2. Set the task in `TASKS.md` to **`DONE`**.
3. Print a copy-paste conventional commit subject in a `text` fence: `<type>(<scope>): <imperative summary>`. No task ID. Do not `git commit` unless asked.
4. Confirm in one short line which task was marked done.
5. **Stop.** Do not start the next task unless the user runs `/next` again or asks you to continue.

## When the user reports failures

If the user pastes test output, errors, or failed manual checks:

1. Fix **only** what those failures require.
2. Reprint the updated verification commands.
3. Wait again for **`tests passed`**. Do **not** set `DONE`.
