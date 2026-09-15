# Cursor agent layer

World Globe encodes product invariants and task protocols in `.cursor/` so agents read `docs/` before changing code. **Entry point:** [`../AGENTS.md`](../AGENTS.md).

## Load order

| Layer | Path | When |
| --- | --- | --- |
| Core router | [`rules/globe-core.mdc`](rules/globe-core.mdc) | Always |
| Product context | [`../AGENTS.md`](../AGENTS.md) | Always |
| Path rules | [`rules/*.mdc`](rules/) | Matching files open, or always for core |
| Skills | [`skills/*/SKILL.md`](skills/) | Task implementation, DoD checks |
| Commands | [`commands/*.md`](commands/) | User types `/…` |

## Source of truth (do not duplicate in rules/skills)

| Doc | Role |
| --- | --- |
| [`../TASKS.md`](../TASKS.md) | Backlog and status |
| [`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md) | Structure and boundaries |
| [`../docs/DESIGN.md`](../docs/DESIGN.md) | Visual system and responsive UI |
| [`../docs/PERFORMANCE.md`](../docs/PERFORMANCE.md) | Budgets and render-loop rules |
| [`../docs/GEOGRAPHY.md`](../docs/GEOGRAPHY.md) | Data pipeline and correctness |
| [`../docs/TESTING.md`](../docs/TESTING.md) | QA strategy |
| [`../docs/WORKFLOW.md`](../docs/WORKFLOW.md) | Implementation workflow |
| [`../docs/DECISIONS.md`](../docs/DECISIONS.md) | Architecture decision records |
| [`../docs/CHECKLIST.md`](../docs/CHECKLIST.md) | Release checklist |

## Skills

| Skill | Trigger |
| --- | --- |
| [`implement-globe-task`](skills/implement-globe-task/SKILL.md) | `/next`, implement task, continue milestone |
| [`definition-of-done`](skills/definition-of-done/SKILL.md) | `/verify`, “is this done”, after `tests passed` review |

## Rules (path-scoped)

| Rule | Globs | Reads from |
| --- | --- | --- |
| `globe-core.mdc` | always | `AGENTS.md`, `TASKS.md`, test handoff |
| `globe-rendering.mdc` | `src/components/globe/**` | `docs/ARCHITECTURE.md`, `docs/PERFORMANCE.md` |
| `globe-geography.mdc` | `scripts/geography/**`, `src/lib/geo/**` | `docs/GEOGRAPHY.md` |
| `globe-ui.mdc` | `src/components/ui/**` | `docs/DESIGN.md` |
| `globe-testing.mdc` | `**/*.{test,spec}.{ts,tsx}` | `docs/TESTING.md` |

## Default commands

| You want | Command |
| --- | --- |
| Next task (manual test gate) | `/next` |
| Check if task is done | `/verify` |

**Test handoff:** `/next` implements and sets `IN PROGRESS`. You run commands manually. Reply **`tests passed`** to mark `DONE` and receive a conventional commit message (e.g. `feat(globe): …`, `chore(ci): …`).
