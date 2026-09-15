# Testing and QA

## Test layers

Use multiple layers:

- unit tests
- component/integration tests
- browser/E2E tests
- manual visual QA
- performance profiling
- accessibility QA

## Unit tests

Prioritize deterministic pure functions:

- longitude/latitude → Cartesian conversion
- centroid calculations
- country ID normalization
- country search normalization
- search ranking
- camera target calculation
- geometry preprocessing helpers

## Component/integration tests

Test:

- country search
- keyboard selection
- selected country panel
- close behavior
- loading state
- error state
- reduced-motion behavior
- responsive UI logic

Do not rely on fragile WebGL pixel snapshots as the primary test strategy.

## E2E

Minimum scenarios:

### Initial load

- page loads
- globe is visible
- no console errors
- no layout overflow

### Mouse

- drag rotates globe
- wheel zoom works
- hover identifies a country
- click selects country

### Touch

- drag rotates globe
- pinch zoom works where supported
- tap selects country
- page does not unexpectedly scroll during globe manipulation

### Search

- open search
- type country
- navigate results
- select result
- globe moves to selected country

### Keyboard

- search can be reached
- result list can be navigated
- country can be selected without hover
- panel can be closed
- focus remains visible

### Reduced motion

- reduced-motion preference is respected
- no long camera animation
- decorative animation is reduced

## Browser matrix

At minimum verify current stable:

- Chromium-based browser
- Firefox
- Safari

Also verify:

- iOS Safari
- Android Chrome

WebGL support varies by device. Always maintain a graceful failure path.

## Responsive viewports

Verify at representative dimensions:

- 320×568
- 375×667
- 390×844
- 430×932
- 768×1024
- 1024×768
- 1280×800
- 1440×900
- 1920×1080
- ultrawide if the product targets it

These are representative QA sizes, not hardcoded design breakpoints.

## Accessibility

Check:

- keyboard-only navigation
- visible focus
- semantic headings
- button names
- search labels
- screen reader country selection
- contrast
- reduced motion
- touch target sizing
- no hover-only critical information

## Visual QA checklist

Check:

- globe centered correctly
- country borders align
- atmosphere does not overpower countries
- tooltip stays inside viewport
- selected panel does not obscure essential globe content
- mobile bottom sheet does not cover critical controls
- landscape mode works
- no clipping
- no horizontal scrollbar
- no blurry text
- no obvious aliasing at normal DPR

## Performance QA

Record:

- frame time during drag
- frame time during picking
- startup time
- asset sizes
- geometry size
- draw calls where measurable
- memory behavior during repeated navigation

Test at least one constrained mobile profile.

## Definition of Done for visual changes

A visual task is not done until:

- desktop verified
- mobile verified
- keyboard behavior considered
- reduced motion considered
- no obvious performance regression
- acceptance criteria in TASKS.md are satisfied
