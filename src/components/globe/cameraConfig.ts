import { cameraPositionForViewCenter, GLOBE_CAMERA_VIEW, GLOBE_RADIUS } from "./earthConfig";

/** Default orbit distance — must stay within {@link GLOBE_CAMERA_CONSTRAINTS}. */
export const GLOBE_CAMERA_DISTANCE = 3.5;

/**
 * Minimum camera far plane at every zoom level — must fit the star dome
 * ({@link STARS_RADIUS} in starsConfig). GlobeControls raises far when zoomed out.
 */
export const GLOBE_CAMERA_MIN_FAR = 50;

/** Default globe camera composition for desktop and mobile viewports. */
export const GLOBE_CAMERA = {
  position: cameraPositionForViewCenter(
    GLOBE_CAMERA_VIEW.longitude,
    GLOBE_CAMERA_VIEW.latitude,
    GLOBE_CAMERA_DISTANCE,
  ),
  fov: 45,
  near: 0.1,
  far: GLOBE_CAMERA_MIN_FAR,
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

/** Dynamic far plane for orbit distance — keeps stars inside the frustum. */
export function getGlobeCameraFar(distance: number): number {
  return Math.max(
    GLOBE_CAMERA_MIN_FAR,
    GLOBE_CAMERA_CONSTRAINTS.maxDistance * 4,
    distance * 8,
  );
}
