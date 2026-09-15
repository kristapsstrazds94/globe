# World Globe — Cursor Agent Documentation

This folder is the single source of truth for implementing the interactive 3D world globe.

## How to use

Place this entire folder in the repository root (or keep it as a dedicated project-docs folder) and instruct Cursor to read:

1. `AGENTS.md`
2. `TASKS.md`
3. `docs/ARCHITECTURE.md`
4. `docs/DESIGN.md`
5. `docs/PERFORMANCE.md`
6. `docs/GEOGRAPHY.md`
7. `docs/TESTING.md`
8. `docs/WORKFLOW.md`

The agent should then work task-by-task from `TASKS.md`.

## Source of truth

- `TASKS.md` = execution backlog and status.
- `AGENTS.md` = non-negotiable agent rules.
- `docs/ARCHITECTURE.md` = technical architecture and boundaries.
- `docs/DESIGN.md` = visual system and responsive behavior.
- `docs/PERFORMANCE.md` = performance budgets and optimization rules.
- `docs/GEOGRAPHY.md` = geographic data pipeline and correctness.
- `docs/TESTING.md` = quality gates and test strategy.
- `docs/WORKFLOW.md` = implementation workflow and Definition of Done.

## Status vocabulary

Every task must use exactly one status:

- `NOT STARTED`
- `IN PROGRESS`
- `BLOCKED`
- `DONE`

When a task is completed, the agent must update `TASKS.md` before moving to the next task.

## Product goal

Build a premium, responsive, interactive 3D world globe for the web.

Core interaction:
- Rotate the globe with pointer/touch gestures.
- Zoom with wheel/pinch.
- Hover countries on pointer-capable devices.
- Tap/click countries on all devices.
- Show country name and selection state.
- Smoothly fly the camera/globe to a selected country.
- Provide country search.
- Provide accessible non-globe alternatives for navigation and selection.
- Remain usable on mobile, tablet, desktop, and reduced-motion environments.

The globe is the hero. UI should support the visualization rather than obscure it.
