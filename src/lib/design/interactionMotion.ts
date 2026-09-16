/**
 * Interaction motion tokens — durations and easing aligned with docs/DESIGN.md (T051).
 * DOM CSS in globals.css mirrors these values via custom properties.
 */
export const GLOBE_INTERACTION_MOTION = {
  /** Country hover fill crossfade (~100–180ms). */
  countryFillMs: 150,
  /** HTML tooltip fade. */
  tooltipMs: 140,
  /** Country panel slide — transform duration (~180–300ms). */
  panelTransformMs: 260,
  /** Country panel fade alongside slide. */
  panelOpacityMs: 200,
  /** Search results dropdown entrance. */
  searchResultsMs: 180,
  /** Shortest camera fly-to (~500–1000ms by travel distance). */
  flyToMinMs: 550,
  /** Longest camera fly-to at half-orbit and beyond. */
  flyToMaxMs: 950,
  /** Snap instantly when reduced motion is enabled. */
  reducedMotionDurationMs: 0,
} as const;

/** CSS cubic-bezier for UI enter/exit — physical ease without overshoot. */
export const GLOBE_INTERACTION_EASING = {
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  enter: "cubic-bezier(0, 0, 0.2, 1)",
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

/** Out-cubic easing for short fill transitions. */
export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

/** Resolve a motion duration — zero when reduced motion is preferred. */
export function getInteractionDurationMs(
  durationMs: number,
  prefersReducedMotion: boolean,
): number {
  return prefersReducedMotion ? GLOBE_INTERACTION_MOTION.reducedMotionDurationMs : durationMs;
}

/**
 * Fly-to duration scaled by angular travel (0 → min, π → max).
 * @see docs/DESIGN.md — country fly-to ~500–1000ms depending on distance
 */
export function getFlyToDurationMsForAngle(
  angleRadians: number,
  prefersReducedMotion: boolean,
): number {
  if (prefersReducedMotion) {
    return GLOBE_INTERACTION_MOTION.reducedMotionDurationMs;
  }

  const travelT = Math.min(1, Math.max(0, angleRadians) / Math.PI);
  const { flyToMinMs, flyToMaxMs } = GLOBE_INTERACTION_MOTION;

  return Math.round(flyToMinMs + travelT * (flyToMaxMs - flyToMinMs));
}

/** Panel transition duration for exit animation timing. */
export function getCountryPanelTransitionMs(prefersReducedMotion: boolean): number {
  return getInteractionDurationMs(GLOBE_INTERACTION_MOTION.panelTransformMs, prefersReducedMotion);
}
