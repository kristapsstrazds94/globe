import { GLOBE_COLORS, GLOBE_LIGHTING, GLOBE_MATERIAL } from "@/lib/design/globeTokens";
import { lonLatToSpherePoint } from "@/lib/geo/coordinates";

/** Unit-sphere radius — geographic layers use GLOBE_RADIUS plus offsets below. */
export const GLOBE_RADIUS = 1;

/** Corrects east–west mirroring with the default +X camera (see GlobeScene). */
export const GLOBE_GEO_SCALE: [number, number, number] = [1, 1, -1];

/** Default map focus — central Europe at page load. */
export const GLOBE_CAMERA_VIEW = {
  longitude: 10,
  latitude: 50,
} as const;

/**
 * Camera position on a sphere around the origin so {@link GLOBE_CAMERA_VIEW}
 * appears centered (accounts for {@link GLOBE_GEO_SCALE}).
 */
export function cameraPositionForViewCenter(
  longitude: number,
  latitude: number,
  distance: number,
): [number, number, number] {
  const [x, y, z] = lonLatToSpherePoint(longitude, latitude, 1);
  const wx = x * GLOBE_GEO_SCALE[0];
  const wy = y * GLOBE_GEO_SCALE[1];
  const wz = z * GLOBE_GEO_SCALE[2];
  const length = Math.hypot(wx, wy, wz);

  return [(wx / length) * distance, (wy / length) * distance, (wz / length) * distance];
}

/**
 * Radial layer elevations only — avoid polygon offset on fill; it pushes
 * countries behind the Earth in the depth buffer and muddies colors under light.
 */
export const COUNTRY_LAYER_ELEVATION = 0.0003;
export const COUNTRY_BORDER_ELEVATION = 0.0025;

/** Country fill — nearly flush with Earth, wins by radius over the ocean sphere (T023). */
export const COUNTRY_LAYER_RADIUS = GLOBE_RADIUS + COUNTRY_LAYER_ELEVATION;

/** Country borders — above fill, still well below the old 0.7% shell (T024). */
export const COUNTRY_BORDER_RADIUS = GLOBE_RADIUS + COUNTRY_BORDER_ELEVATION;

/** Atmosphere shell sits outside the surface (T013). */
export const ATMOSPHERE_RADIUS = GLOBE_RADIUS * 1.06;

export const EARTH_GEOMETRY = {
  radius: GLOBE_RADIUS,
  widthSegments: 64,
  heightSegments: 64,
} as const;

/** Deep blue-gray Earth — colors from {@link GLOBE_COLORS}. */
export const EARTH_MATERIAL = {
  color: GLOBE_COLORS.earth,
  roughness: GLOBE_MATERIAL.earth.roughness,
  metalness: GLOBE_MATERIAL.earth.metalness,
} as const;

export { GLOBE_LIGHTING };
