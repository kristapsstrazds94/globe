# AGENTS.md — World Globe Project

## Mission

You are implementing a production-quality interactive 3D world globe. Prioritize correctness, visual quality, accessibility, responsive behavior, runtime performance, and maintainability.

You are working with Cursor Agent / Composer 2.5. Treat these documents as project-level instructions.

## Mandatory reading

Before changing code, read:

- `TASKS.md`
- `docs/ARCHITECTURE.md`
- `docs/DESIGN.md`
- `docs/PERFORMANCE.md`
- `docs/GEOGRAPHY.md`
- `docs/TESTING.md`
- `docs/WORKFLOW.md`

If a task touches a specialized area, read the corresponding document fully.

## Non-negotiable rules

### 1. Task discipline

- Work on one task at a time unless the task explicitly contains independent subtasks.
- Do not silently expand scope.
- Update the task status in `TASKS.md`.
- If blocked, set `BLOCKED` and document the exact blocker and next action.
- Never mark a task `DONE` without satisfying its acceptance criteria.

### 2. Architecture

- Keep rendering concerns separate from application UI.
- Keep rapidly changing frame-level state out of React state where possible.
- Use React for declarative scene composition and HTML UI.
- Use Three.js/R3F for rendering.
- Use Zustand only for durable application state, not per-frame state.
- Do not introduce a second state-management library without an explicit architectural reason.
- Avoid unnecessary abstraction until a repeated pattern is proven.

### 3. Performance

- Avoid React re-renders on pointer movement, camera movement, or animation frames.
- Reuse geometries, materials, textures, and GPU resources.
- Never allocate objects inside `useFrame` unless unavoidable.
- Prefer `BufferGeometry`.
- Preprocess geographic data at build time.
- Do not ship unnecessarily high-resolution geographic geometry.
- Avoid rendering DOM elements for every country.
- Avoid per-country React component trees when geometry can be batched.
- Lazy-load expensive non-critical visualization features.
- Respect `prefers-reduced-motion`.
- Keep mobile as a first-class target, not a desktop fallback.

### 4. Visual quality

- The globe should remain the dominant visual element.
- Use restrained color, subtle lighting, and intentional motion.
- Avoid excessive bloom, gradients, glows, shadows, and UI chrome.
- Transitions should be smooth and short enough to preserve direct manipulation.
- Never sacrifice readability for visual effects.

### 5. Accessibility

- Every interactive country must have an accessible alternative.
- Do not rely on hover as the only way to discover information.
- Keyboard users must be able to search and select countries.
- Focus states must be visible.
- Use semantic HTML for UI.
- Provide labels for icon-only controls.
- Respect reduced motion.
- Do not trap keyboard focus inside the canvas.
- The canvas must not be the only source of country information.

### 6. Responsive behavior

Support:

- small mobile phones
- large phones
- tablets in portrait and landscape
- laptops
- large desktop monitors
- high-DPI displays

Do not assume a mouse exists.
Do not assume touch exists.
Do not assume a large viewport exists.

### 7. Dependencies

Before adding a dependency:

- Check whether an existing dependency already solves the problem.
- Prefer mature, focused packages.
- Avoid packages that duplicate Three.js/R3F functionality.
- Explain meaningful dependency additions in the implementation notes.

### 8. Data correctness

- Never invent country metadata.
- Preserve stable country identifiers.
- Keep geographic geometry and metadata separate.
- Handle MultiPolygon countries and territories explicitly.
- Document source, version, license, and preprocessing steps for geographic datasets.

### 9. Error handling

- The globe must fail gracefully if optional assets/data fail.
- Provide a useful loading state.
- Avoid blank screens.
- Do not expose raw implementation errors to users.

### 10. Code quality

- TypeScript strictness should remain enabled.
- Avoid `any`.
- Keep functions/components focused.
- Name geographic concepts precisely.
- Add comments only where the reason is non-obvious.
- Prefer deterministic behavior.

## Agent operating loop

For each task:

1. Read relevant docs.
2. Inspect existing code before modifying it.
3. Identify the smallest implementation that satisfies the task.
4. Implement.
5. Run formatting/lint/typecheck/tests relevant to the task (use **`pnpm`**, never `npm` — see `docs/TESTING.md`).
6. Manually verify responsive behavior if UI/rendering changed.
7. Check for performance regressions.
8. Update `TASKS.md`.
9. Summarize changes, verification, and remaining risks.

## Never do this

- Rewrite the project architecture without a task requiring it.
- Replace working libraries just because another library is familiar.
- Add fake data to make UI appear complete.
- Ignore mobile because the desktop version looks good.
- Add effects before the baseline rendering is performant.
- Mark tasks done based only on "the code compiles."
