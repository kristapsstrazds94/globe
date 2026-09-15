# Design System

## Visual direction

Target: dark cinematic scientific instrument.

The globe is the hero. UI should feel like an exploration interface, not a traditional dashboard.

Desired qualities:

- calm
- premium
- precise
- atmospheric
- technical
- restrained

Avoid:

- rainbow country maps
- excessive glassmorphism
- giant shadows
- excessive neon
- dense dashboards
- decorative UI that competes with Earth

## Layout

### Desktop

Globe occupies most of the viewport.

UI:

- compact top-left identity
- search near top/right or integrated into header
- country panel anchored to an edge
- minimal controls

### Tablet

Give the globe more room than desktop UI.

Country panel can become a narrower overlay or bottom sheet depending on orientation.

### Mobile

The globe should remain the main experience.

Recommended structure:

```text
┌─────────────────────┐
│ World       Search  │
│                     │
│                     │
│        EARTH        │
│                     │
│                     │
│                     │
├─────────────────────┤
│ Norway              │
│ Europe              │
│ Population ...      │
└─────────────────────┘
```

Use a bottom sheet for selected-country details.

Do not place tiny controls around the globe.

## Interaction states

Every country should have:

- default
- hover
- selected
- unavailable/error if applicable

Hover must be subtle.

Selected must be persistent and unmistakable.

## Color

Suggested starting direction:

- Background: near-black blue
- Earth: deep blue/gray
- Country fill: muted blue-gray
- Hover: brighter cool blue
- Selection: restrained cyan/teal accent
- Text: warm white / light gray
- Secondary text: muted gray-blue

Treat these as design tokens, not hardcoded values throughout components.

## Typography

Use one primary sans-serif family.

Optional technical/metadata font may be monospace.

Hierarchy:

- product name: compact
- country name: strong
- metadata labels: small uppercase or compact
- values: readable, not overly condensed

## Motion

Motion should communicate state changes.

Suggested durations:

- hover: ~100–180ms
- panel: ~180–300ms
- country fly-to: ~500–1000ms depending on distance

Use easing that feels physical but does not create overshoot unless intentional.

All animation must respect reduced motion.

## Tooltips

Tooltips:

- use HTML, not 3D text
- have sufficient contrast
- never block the pointer interaction target
- remain inside viewport bounds
- disappear on selection or touch as appropriate

## Country panel

Desktop:

- side panel
- compact width
- subtle background separation

Mobile:

- bottom sheet
- large enough touch targets
- clear close affordance
- no tiny draggable handle unless actually implementing drag-to-dismiss

## Controls

Controls should be minimal.

Possible controls:

- reset globe
- zoom in/out
- search
- data layer selector later

Do not add controls for functionality that can be handled naturally by direct manipulation.

## Accessibility

Target WCAG-conscious design:

- readable contrast
- visible focus
- touch-friendly targets
- no hover-only information
- semantic labels
- reduced-motion support

## Responsive breakpoints

Do not design around framework defaults blindly.

Use content-driven breakpoints based on when:

- panel no longer fits beside globe
- search becomes cramped
- controls overlap
- typography becomes unreadable

## Safe areas

On mobile, respect:

- browser UI
- device safe-area insets
- landscape notch areas

Do not position critical controls directly against viewport edges.

## Empty/loading states

Loading should preserve the visual identity:

- dark background
- subtle progress indicator
- short status message if needed

Avoid a generic white spinner page.
