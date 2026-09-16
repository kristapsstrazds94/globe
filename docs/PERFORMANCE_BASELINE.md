# Performance baseline (T060)

Recorded starting point before Milestone 6 optimization work. Use this to compare regressions and track improvements.

## How to refresh automated measurements

```bash
pnpm build          # optional — includes .next/static payload sizes
pnpm perf:measure   # writes docs/generated/performance-baseline.json
```

The JSON snapshot includes geography bundle size, GPU geometry counts, estimated static draw calls, and (after a production build) the largest `.next/static` chunks.

## Dev FPS / frame-time overlay

During local development, append `?perf=1` to the URL (for example `http://localhost:3000/?perf=1`).

The overlay shows:

- rolling FPS and average frame time (updated about every 500 ms)
- peak frame time within each sample window
- JavaScript heap usage when the browser exposes `performance.memory` (Chromium)

Use it while:

- dragging the globe continuously for ~10 s
- moving the pointer over countries (picking)
- running a fly-to transition
- opening/closing the country panel

Record the **lowest sustained FPS** and **highest average frame time** you observe during each scenario.

## Manual frame-time profiling

For deeper investigation, use browser DevTools:

1. Open **Performance** (Chromium) or **Performance tool** (Firefox).
2. Record 5–10 s while rotating the globe and hovering countries.
3. Note median frame time, long tasks on the main thread, and GPU activity if available.

## Test profiles

Record observations per profile. Update browser/device versions when re-measuring.

| Profile | Viewport | DPR cap | Device / browser | Notes |
| --- | --- | --- | --- | --- |
| Desktop | ≥ 1280 × 800 | 2.0 | _fill in_ | Primary development target |
| Tablet | 768–1024 portrait | 2.0 | _fill in_ | Touch drag + pinch |
| Mobile | ≤ 390 × 844 | 1.5 | _fill in_ | Constrained GPU / thermals |

### Frame-time observations (manual)

| Scenario | Desktop FPS (sustained) | Desktop frame time (ms) | Mobile FPS | Mobile frame time (ms) |
| --- | --- | --- | --- | --- |
| Idle (no interaction) | _fill in_ | _fill in_ | _fill in_ | _fill in_ |
| Globe drag | _fill in_ | _fill in_ | _fill in_ | _fill in_ |
| Country hover / picking | _fill in_ | _fill in_ | _fill in_ | _fill in_ |
| Fly-to transition | _fill in_ | _fill in_ | _fill in_ | _fill in_ |

Target: ~60 FPS (~16.7 ms frame time) on capable desktop during normal interaction (`docs/PERFORMANCE.md`).

### Memory observations (manual)

| Scenario | Desktop JS heap | Mobile JS heap | Notes |
| --- | --- | --- | --- |
| Initial load | _fill in_ | _fill in_ | After first paint + geography ready |
| After 2 min navigation | _fill in_ | _fill in_ | Search, select, fly-to, clear selection |

Chrome exposes heap size in the perf overlay. Safari/Firefox require DevTools memory tools.

## Automated snapshot summary

See `docs/generated/performance-baseline.json` for the latest machine-readable capture:

- geography source version, scale, and on-disk bundle size
- country fill vertices / triangles and border line segments
- estimated static draw calls (Earth, countries, borders, atmosphere, stars)
- largest production JS chunks (after `pnpm build`)

Re-run `pnpm perf:measure` after geography preprocessing or significant bundle changes.
