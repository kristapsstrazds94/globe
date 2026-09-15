# Agent Workflow

## Before implementation

1. Read AGENTS.md.
2. Read TASKS.md.
3. Identify the first relevant NOT STARTED task.
4. Read the linked technical/design documentation.
5. Inspect existing implementation.
6. Identify dependencies and risks.
7. Change the task to IN PROGRESS.

## During implementation

Keep changes focused.

Prefer incremental commits/changes such as:

```text
foundation
→ globe
→ geography
→ interaction
→ UI
→ accessibility
→ polish
→ performance
→ testing
```

Do not combine unrelated refactors with feature work.

## After implementation

Run the smallest meaningful verification first:

- typecheck
- lint
- unit tests
- build

For UI/rendering tasks additionally perform:

- desktop inspection
- mobile inspection
- touch/keyboard consideration
- reduced-motion check

For geographic tasks additionally inspect:

- poles
- antimeridian
- MultiPolygon
- islands
- representative large countries

## Blockers

If blocked:

1. Set task status to BLOCKED.
2. Add a short blocker note under the task.
3. State what is needed to unblock it.
4. Do not fake completion.
5. Continue only with genuinely independent tasks.

## Completion

When acceptance criteria are satisfied:

1. Run verification.
2. Review diff.
3. Remove debug code/logging.
4. Update TASKS.md to DONE.
5. Add a concise implementation note if the task introduced an important decision.

## Changing architecture

If implementation reveals that architecture must change:

- explain why
- update docs/ARCHITECTURE.md
- update affected tasks
- avoid broad rewrites unless necessary

## Task status format

Use exactly:

```markdown
**Status:** NOT STARTED
```

or:

```markdown
**Status:** IN PROGRESS
```

or:

```markdown
**Status:** BLOCKED

**Blocker:** <specific reason>
**Unblock:** <specific next action>
```

or:

```markdown
**Status:** DONE
```

## Agent final response format

For each completed task, report:

1. What changed
2. Verification performed
3. Any known limitation
4. Next task

Keep the report concise. The canonical status belongs in TASKS.md.
