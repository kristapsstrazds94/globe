/**
 * WGS84 decimal degrees → scene Cartesian on a sphere.
 *
 * Matches Three.js `SphereGeometry` (Y-up): north pole at +Y, prime meridian
 * on the equator at +X. Differs from the illustrative formula in
 * `docs/GEOGRAPHY.md` — orientation is chosen for scene consistency.
 */
export type SpherePoint = readonly [number, number, number];

const DEG_TO_RAD = Math.PI / 180;

/** Default unit-sphere radius — matches `GLOBE_RADIUS` in earth config. */
export const DEFAULT_SPHERE_RADIUS = 1;

/** Normalize longitude to [-180, 180]. */
export function normalizeLongitude(longitude: number): number {
  const wrapped = ((((longitude + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

/**
 * Convert WGS84 longitude/latitude (degrees) to a point on a sphere.
 *
 * @param longitude East-positive degrees; any value accepted (periodic).
 * @param latitude North-positive degrees in [-90, 90].
 * @param radius Sphere radius (defaults to unit sphere).
 */
export function lonLatToSpherePoint(
  longitude: number,
  latitude: number,
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint {
  const clampedLat = Math.max(-90, Math.min(90, latitude));
  const phi = Math.PI - longitude * DEG_TO_RAD;
  const theta = (90 - clampedLat) * DEG_TO_RAD;

  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  return [-radius * cosPhi * sinTheta, radius * cosTheta, radius * sinPhi * sinTheta];
}

/** Convert a GeoJSON `[lon, lat]` position to a sphere point. */
export function lonLatPositionToSpherePoint(
  position: readonly [number, number],
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint {
  const [longitude, latitude] = position;
  return lonLatToSpherePoint(longitude, latitude, radius);
}

/** Squared distance from origin — useful for asserting points lie on the sphere. */
export function spherePointLengthSquared(point: SpherePoint): number {
  const [x, y, z] = point;
  return x * x + y * y + z * z;
}
