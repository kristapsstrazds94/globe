/** Unit-sphere radius — geographic layers use GLOBE_RADIUS plus offsets below. */
export const GLOBE_RADIUS = 1;

/** Country fill sits slightly above the surface to avoid z-fighting (T023). */
export const COUNTRY_LAYER_RADIUS = GLOBE_RADIUS * 1.002;

/** Atmosphere shell sits outside the surface (T013). */
export const ATMOSPHERE_RADIUS = GLOBE_RADIUS * 1.06;

export const EARTH_GEOMETRY = {
  radius: GLOBE_RADIUS,
  widthSegments: 64,
  heightSegments: 64,
} as const;

/** Deep blue-gray Earth per docs/DESIGN.md color direction. */
export const EARTH_MATERIAL = {
  color: "#1a2840",
  roughness: 0.82,
  metalness: 0.12,
} as const;

export const GLOBE_LIGHTING = {
  ambientIntensity: 0.22,
  directional: {
    position: [4, 2, 5] as [number, number, number],
    intensity: 1.0,
  },
  fill: {
    position: [-3, -1, -2] as [number, number, number],
    intensity: 0.25,
  },
} as const;
