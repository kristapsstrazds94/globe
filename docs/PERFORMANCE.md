# Performance

## Goals

Performance is a first-class feature.

The experience should feel fluid during:

- globe rotation
- hover/picking
- camera transitions
- panel animation
- search
- resize/orientation changes

## Budgets

Use these as engineering targets, not excuses to compromise correctness.

### Rendering

- Target ~60 FPS on capable desktop hardware during normal interaction.
- Avoid sustained frame times above ~16.7ms on target desktop hardware.
- Mobile target should remain responsive even if visual quality is adaptively reduced.

### Main thread

- Avoid long synchronous tasks during interaction.
- Do not parse/process large geography datasets during initial interaction if preprocessing can move the work to build time.

### JavaScript

- Keep the initial route lean.
- Lazy-load optional data layers and expensive effects.

### GPU

- Reuse materials/geometries.
- Avoid unnecessary transparency.
- Avoid multiple full-screen post-processing passes.
- Limit particle counts.
- Avoid high DPR by default on mobile.

## Device quality tiers

Consider three runtime quality tiers:

### High

- desktop/high-performance laptop
- full atmosphere
- high-quality geometry
- higher DPR cap

### Medium

- tablet / average laptop
- moderate geometry
- reduced particle count
- reduced post-processing

### Low

- low-power mobile
- simplified atmosphere
- reduced stars
- lower DPR cap
- minimal post-processing

Quality tier detection should be conservative and should never block the user from interacting with the globe.

## Device pixel ratio

Do not blindly render at native DPR 3+.

Use a sensible maximum DPR and adjust based on performance.

Example strategy:

- desktop: cap around 1.5–2
- mobile: cap around 1.25–1.5

Measure before locking final values.

## React performance

Avoid:

```text
mousemove → setState → entire app re-render → every frame
```

Prefer:

```text
mousemove → Three.js/R3F interaction state
```

Only update React/Zustand when semantic state changes:

- country ID changed
- selection changed
- search changed

## useFrame rules

Inside frame loops:

- no object creation unless necessary
- no arrays/maps created every frame
- reuse vectors/quaternions/colors
- do not call expensive DOM APIs
- do not trigger React state every frame

## Geometry

Country geometry should be:

- simplified
- indexed where beneficial
- stored in buffers
- loaded from a compact runtime format

Measure:

- vertex count
- triangle count
- draw calls
- asset size

## Picking

If every country is an independent mesh, picking is straightforward but can increase draw calls.

If performance becomes an issue:

- batch geometry
- use an ID/picking pass
- use spatial indexing
- or use other GPU-friendly picking strategies

Do not optimize prematurely. Measure first.

## Textures

- Compress textures where supported.
- Use appropriate texture dimensions.
- Avoid giant Earth textures if the visual design does not require them.
- Lazy-load optional cloud/night-light textures.

## Effects

Bloom and post-processing are optional.

If used:

- keep intensity low
- reduce resolution when possible
- provide lower-quality mobile behavior
- avoid stacking multiple expensive effects

## Loading

Prioritize:

1. app shell
2. basic globe
3. essential country geometry
4. metadata
5. decorative effects
6. optional data layers

The user should see a meaningful globe as early as practical.

## Performance measurement

Before claiming optimization:

- profile with browser Performance tools
- inspect GPU/rendering behavior
- measure bundle/asset sizes
- test on at least one constrained mobile device/profile

### Baseline (T060)

Establish and refresh measurements with:

```bash
pnpm build          # optional — includes .next/static sizes
pnpm perf:measure
```

- **Automated snapshot:** `docs/generated/performance-baseline.json`
- **Manual recording guide:** `docs/PERFORMANCE_BASELINE.md`
- **Dev overlay:** `?perf=1` during `pnpm dev` (FPS, frame time, Chromium heap)

Record meaningful findings in the baseline doc when re-measuring on real devices.

## Performance anti-patterns

Never:

- create one React DOM element per country
- update all country state every frame
- parse large GeoJSON in a render component
- recreate materials each render
- use huge textures by default
- run expensive geometry calculations on pointer move
- assume desktop FPS means mobile performance is acceptable
