# Release Checklist

## Foundation

- [ ] Production build succeeds
- [ ] Typecheck succeeds
- [ ] Lint succeeds
- [ ] Tests pass
- [ ] No unnecessary dependencies

## Globe

- [ ] Earth renders
- [ ] Stars render
- [ ] Atmosphere renders
- [ ] Rotation works
- [ ] Zoom works
- [ ] Reset works
- [ ] WebGL failure is handled

## Geography

- [ ] Country boundaries align
- [ ] MultiPolygon countries work
- [ ] Antimeridian cases checked
- [ ] Poles checked
- [ ] Source/license/version documented
- [ ] Geometry preprocessing reproducible

## Interaction

- [ ] Hover works on pointer devices
- [ ] Tap works on touch
- [ ] Country selection works
- [ ] Tooltip works
- [ ] Country panel works
- [ ] Fly-to works
- [ ] Search works

## Accessibility

- [ ] Keyboard-only flow works
- [ ] Screen reader labels exist
- [ ] Focus states are visible
- [ ] Reduced motion works
- [ ] Hover is not required
- [ ] Touch targets are appropriate

## Responsive

- [ ] Small mobile
- [ ] Large mobile
- [ ] Tablet portrait
- [ ] Tablet landscape
- [ ] Laptop
- [ ] Desktop
- [ ] Large desktop
- [ ] No horizontal overflow
- [ ] Safe-area behavior checked

## Performance

- [ ] Desktop interaction is smooth
- [ ] Mobile interaction is responsive
- [ ] DPR is bounded
- [ ] Geometry is optimized
- [ ] No frame-loop allocations found
- [ ] No unnecessary React updates
- [ ] Optional effects degrade appropriately

## Browser QA

- [ ] Chromium
- [ ] Firefox
- [ ] Safari
- [ ] iOS Safari
- [ ] Android Chrome
