# Architecture Decisions

This file records decisions that should not be casually reversed.

## ADR-001 — R3F + Three.js

**Decision:** Use React Three Fiber over direct Three.js scene management.

**Reason:** The project is a React application and benefits from declarative scene composition while retaining direct Three.js access where needed.

## ADR-002 — DOM UI outside the canvas

**Decision:** Tooltips, search, panels, and controls are HTML/React UI.

**Reason:** Better accessibility, typography, responsiveness, focus management, and maintainability.

## ADR-003 — Build-time geography preprocessing

**Decision:** Heavy geographic processing happens before runtime.

**Reason:** Reduces startup work, browser CPU usage, and runtime complexity.

## ADR-004 — Zustand for semantic application state

**Decision:** Zustand stores semantic UI/application state; frame-level rendering state remains in R3F/Three.js.

**Reason:** Prevents React render storms and keeps rendering concerns local.

## ADR-005 — Mobile is first-class

**Decision:** Mobile behavior is designed and tested from the beginning.

**Reason:** WebGL interaction, touch gestures, viewport size, DPR, memory, and browser constraints make mobile fundamentally different from desktop.

## ADR-006 — Effects are progressive enhancement

**Decision:** Atmosphere, clouds, bloom, city lights, and similar effects must not compromise core interaction.

**Reason:** The globe must remain functional on constrained hardware.

## ADR-007 — Country identity separate from geometry

**Decision:** Geometry references stable IDs; metadata is separate.

**Reason:** Keeps data compact and makes metadata updates independent of geographic geometry.
