import { GLOBE_RADIUS } from "./earthConfig";

/** Default globe camera composition for desktop and mobile viewports. */
export const GLOBE_CAMERA = {
  position: [0, 0, 3.5] as [number, number, number],
  fov: 45,
  near: 0.1,
  far: 100,
} as const;

/**
 * Orbit/zoom limits consumed by globe controls in T014.
 * Default camera position must stay within these bounds.
 */
export const GLOBE_CAMERA_CONSTRAINTS = {
  minDistance: GLOBE_RADIUS * 1.85,
  maxDistance: GLOBE_RADIUS * 8,
  minPolarAngle: 0.15,
  maxPolarAngle: Math.PI - 0.15,
} as const;
