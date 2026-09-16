# TASKS — Interactive World Globe

Status values: `NOT STARTED` | `IN PROGRESS` | `BLOCKED` | `DONE`

## Milestone 0 — Project foundation

### T001 — Initialize project

**Status:** DONE

Set up the application with Next.js, React, TypeScript, strict TypeScript configuration, ESLint, formatting, and a reproducible package manager setup.

**Acceptance criteria**

- App boots locally.
- Production build succeeds.
- Typecheck succeeds.
- Lint succeeds.
- No unnecessary dependencies.
- README explains local setup.

### T002 — Establish project structure

**Status:** DONE

Create clear boundaries for globe rendering, geographic data, application state, UI, utilities, tests, and build-time data processing.

**Acceptance criteria**

- Structure follows `docs/ARCHITECTURE.md`.
- Rendering and DOM UI are separated.
- No circular dependencies.
- Shared types have an intentional home.

### T003 — Establish CI quality gates

**Status:** DONE

Add automated checks for install, lint, typecheck, unit tests, and production build.

**Acceptance criteria**

- CI fails on lint/type errors/test failures/build failures.
- Commands are documented.
- CI does not require secrets for baseline checks.

---

## Milestone 1 — Rendering foundation

### T010 — Create R3F canvas shell

**Status:** DONE

Create the Three.js/R3F rendering surface with responsive sizing and a controlled camera.

**Acceptance criteria**

- Canvas fills the intended viewport.
- Resize/orientation changes work.
- No layout shift caused by canvas initialization.
- WebGL failure produces a graceful fallback.

### T011 — Build base Earth sphere

**Status:** DONE

Render a clean sphere with appropriate scale, lighting, material, and camera composition.

**Acceptance criteria**

- Sphere looks intentional at desktop and mobile sizes.
- No visible z-fighting with future layers.
- Lighting is stable.
- Camera constraints are defined.

### T012 — Add star field

**Status:** DONE

Create a subtle, performant star background that does not distract from the Earth.

**Acceptance criteria**

- Stars are stable and do not visibly rotate with the Earth.
- Particle count is bounded.
- Mobile performance remains acceptable.
- Reduced-motion behavior is respected.

### T013 — Add atmosphere

**Status:** DONE

Implement a subtle atmospheric rim/glow, preferably with a lightweight shader or layered material.

**Acceptance criteria**

- Atmosphere reads clearly without looking like heavy bloom.
- No obvious banding/artifacts.
- Performance remains within budget.
- Effect can be disabled/reduced on constrained devices.

### T014 — Add globe controls

**Status:** DONE

Implement pointer and touch rotation, wheel/pinch zoom, inertia where appropriate, and sensible camera limits.

**Acceptance criteria**

- Mouse drag rotates naturally.
- Touch drag rotates.
- Wheel/pinch zoom works.
- No accidental page scroll/gesture conflict in the globe interaction area.
- Keyboard users have an alternative navigation mechanism.
- Reduced motion disables unnecessary inertial animation.

---

## Milestone 2 — Geographic data

### T020 — Select and document geography source

**Status:** NOT STARTED

Choose a reliable country boundary dataset and document source, version, license, resolution, and known limitations.

**Acceptance criteria**

- Source is documented in `docs/GEOGRAPHY.md`.
- Stable country identifiers are available.
- MultiPolygon geometry is supported.
- Data license is compatible with the project.

### T021 — Build geography preprocessing pipeline

**Status:** NOT STARTED

Create a build-time script that converts raw geographic data into a runtime-efficient representation.

**Acceptance criteria**

- Raw data is not unnecessarily shipped to the browser.
- Geometry simplification is deterministic.
- Output contains only required fields.
- Script can be rerun from a clean checkout.

### T022 — Convert geographic coordinates to globe geometry

**Status:** NOT STARTED

Implement robust longitude/latitude to 3D sphere coordinate conversion.

**Acceptance criteria**

- Equator, poles, and antimeridian cases are correct.
- Country shapes are positioned on the globe correctly.
- Geometry orientation is consistent.
- Unit tests cover conversion edge cases.

### T023 — Render country layer

**Status:** NOT STARTED

Render all countries/required geographic entities above the Earth surface.

**Acceptance criteria**

- Countries align with the Earth.
- No visible floating/glaring gaps at normal viewing distance.
- MultiPolygon countries render correctly.
- Geometry does not create obvious performance regressions.

### T024 — Render country borders

**Status:** NOT STARTED

Add subtle borders without excessive geometry or line thickness.

**Acceptance criteria**

- Borders remain legible at supported view sizes.
- No severe aliasing at normal DPR.
- Border rendering does not dominate the globe.

---

## Milestone 3 — Interaction

### T030 — Country raycasting

**Status:** NOT STARTED

Implement pointer picking from rendered geographic geometry.

**Acceptance criteria**

- Hover/click identifies the correct country.
- Picking works after globe rotation.
- No excessive allocations occur during pointer movement.
- Picking does not cause React render storms.

### T031 — Hover state

**Status:** NOT STARTED

Add subtle hover feedback and an HTML tooltip.

**Acceptance criteria**

- Hover feedback is immediate.
- Tooltip follows pointer without jitter.
- Tooltip does not block globe interaction.
- Tooltip disappears correctly.
- Touch devices do not depend on hover.

### T032 — Country selection

**Status:** NOT STARTED

Implement click/tap selection and persistent selected styling.

**Acceptance criteria**

- Tap/click selects a country.
- Clicking empty globe clears selection where appropriate.
- Selection is visually distinct from hover.
- Selection is reflected in application state.

### T033 — Country details panel

**Status:** NOT STARTED

Create responsive country information UI.

**Acceptance criteria**

- Desktop panel does not obscure the globe unnecessarily.
- Mobile panel is usable as a bottom sheet or equivalent.
- Panel has close behavior.
- Focus handling is correct.
- Data is sourced from verified metadata only.

### T034 — Fly-to-country camera transition

**Status:** NOT STARTED

Implement smooth orientation/camera movement to a selected country.

**Acceptance criteria**

- Destination is deterministic.
- Animation does not fight user input.
- New user input can interrupt/cancel the transition.
- Reduced-motion mode skips or minimizes animation.
- Antimeridian cases are handled naturally.

---

## Milestone 4 — Search and accessibility

### T040 — Country search

**Status:** NOT STARTED

Add fast country search with keyboard navigation.

**Acceptance criteria**

- Search supports common country names.
- Results are deterministic.
- Keyboard arrows and Enter work.
- Selecting a result flies to and selects the country.
- Search works on mobile.

### T041 — Accessible country selection

**Status:** NOT STARTED

Provide a non-canvas accessible country navigation path.

**Acceptance criteria**

- Every country can be reached without hover.
- Screen reader users receive country names.
- Keyboard-only users can select countries.
- Focus states are visible.

### T042 — Reduced-motion support

**Status:** NOT STARTED

Respect `prefers-reduced-motion`.

**Acceptance criteria**

- Inertial rotation is reduced/disabled as appropriate.
- Camera fly-to transitions become instant or very short.
- Decorative animation is reduced.
- Core functionality remains intact.

### T043 — Responsive UI system

**Status:** NOT STARTED

Implement mobile/tablet/desktop layouts according to `docs/DESIGN.md`.

**Acceptance criteria**

- No horizontal overflow.
- Portrait and landscape layouts work.
- Touch targets meet accessible sizing expectations.
- Text remains readable.
- Country panel/search controls remain usable.

---

## Milestone 5 — Visual polish

### T050 — Lighting and material polish

**Status:** NOT STARTED

Tune Earth material, lighting, atmosphere, stars, country colors, and borders.

**Acceptance criteria**

- Visual hierarchy is clear.
- No excessive effects.
- Dark mode/cinematic visual direction is consistent.
- Screenshots at mobile/tablet/desktop meet the visual bar.

### T051 — Interaction animation polish

**Status:** NOT STARTED

Tune hover, selection, panel, search, and camera transitions.

**Acceptance criteria**

- No animation exceeds intended interaction timing.
- Interruptible animations behave correctly.
- No layout jumps.
- Reduced motion remains correct.

### T052 — Loading and error states

**Status:** NOT STARTED

Design polished loading, WebGL unsupported, data failure, and recoverable error states.

**Acceptance criteria**

- No blank screen.
- Loading state is minimal and does not obscure the experience.
- Errors are understandable.
- Retry behavior exists where useful.

---

## Milestone 6 — Performance

### T060 — Measure baseline performance

**Status:** NOT STARTED

Establish performance measurements on representative desktop, tablet, and mobile profiles.

**Acceptance criteria**

- Document FPS/frame-time observations.
- Document initial JS payload and key asset sizes.
- Document memory observations where possible.
- Record test devices/browser versions.

### T061 — Optimize geographic geometry

**Status:** NOT STARTED

Profile and optimize country geometry, materials, draw calls, and data size.

**Acceptance criteria**

- Geometry is simplified without unacceptable visual loss.
- Draw calls are measured and reduced where practical.
- No per-country DOM explosion.
- Runtime data size is documented.

### T062 — Optimize interaction/render loop

**Status:** NOT STARTED

Remove unnecessary allocations and React renders from pointer and frame loops.

**Acceptance criteria**

- Pointer movement does not trigger broad React updates.
- No avoidable allocations in `useFrame`.
- Picking remains responsive.
- Performance is stable during rotation.

### T063 — DPR and device adaptation

**Status:** NOT STARTED

Adapt pixel ratio/render quality to device capability while maintaining visual quality.

**Acceptance criteria**

- High-DPI devices do not render at an unnecessarily expensive resolution.
- Low-power/mobile devices receive sensible quality settings.
- Resize behavior is stable.
- Quality changes do not break geometry.

### T064 — Performance regression guard

**Status:** NOT STARTED

Document and, where practical, automate performance expectations.

**Acceptance criteria**

- Performance budgets exist in `docs/PERFORMANCE.md`.
- Significant regressions are detectable during development.
- Known exceptions are documented.

---

## Milestone 7 — Testing and release

### T070 — Unit tests

**Status:** NOT STARTED

Test geographic conversion, metadata lookup, search normalization, selection logic, and camera target calculations.

### T071 — Component/integration tests

**Status:** NOT STARTED

Test search, selection, panel state, loading/error states, and keyboard behavior.

### T072 — Browser/E2E tests

**Status:** NOT STARTED

Test desktop and mobile interaction flows.

Minimum flows:

- load globe
- rotate
- hover where supported
- select country
- search country
- fly to country
- close country panel
- keyboard navigation

### T073 — Cross-browser verification

**Status:** NOT STARTED

Verify current stable versions of major Chromium, Firefox, and Safari browsers, including mobile Safari/Chrome where available.

### T074 — Production build verification

**Status:** NOT STARTED

Verify production build, asset loading, route behavior, caching, and graceful failure.

### T075 — Final responsive QA

**Status:** NOT STARTED

Manually inspect representative small phone, large phone, tablet portrait, tablet landscape, laptop, desktop, and large desktop viewports.

### T076 — Final accessibility QA

**Status:** NOT STARTED

Verify keyboard navigation, focus, labels, reduced motion, contrast, screen-reader semantics, and non-hover access.

### T077 — Final task audit

**Status:** NOT STARTED

Review every task and ensure status, acceptance criteria, known limitations, and documentation are current.
