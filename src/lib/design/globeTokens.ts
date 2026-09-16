/**
 * Globe visual design tokens — realistic Earth palette for travel discovery.
 * Ocean, land, space, and UI accents share one coherent source of truth.
 */
export const GLOBE_COLORS = {
  /** Deep space background — matches the app shell. */
  background: "#020408",
  /** Sunlit ocean blue — deep enough for land to read clearly on top. */
  earth: "#0a3560",
  /** Saturated land green — strong contrast against ocean. */
  countryDefault: "#42a062",
  /** Brighter land green on hover. */
  countryHover: "#5ec482",
  /** Warm amber selection — complementary contrast against green land. */
  countrySelected: "#e8a830",
  /** Emissive lift so selection pops on click in daylight. */
  countrySelectedEmissive: "#8a5a08",
  /** Soft coastline / border stroke. */
  border: "#6db88a",
  /** Cool sky-blue atmospheric rim. */
  atmosphereGlow: "#7ec8ff",
  /** Reference star white — individual stars vary at runtime. */
  star: "#e8eef8",
} as const;

export const GLOBE_MATERIAL = {
  earth: {
    roughness: 0.86,
    metalness: 0.04,
  },
  countryDefault: {
    roughness: 0.78,
    metalness: 0.05,
  },
  countryHover: {
    roughness: 0.72,
    metalness: 0.06,
  },
  countrySelected: {
    roughness: 0.45,
    metalness: 0.04,
    emissiveIntensity: 0.45,
  },
  border: {
    opacity: 0.88,
  },
  star: {
    minSize: 0.35,
    maxSize: 2.4,
    opacity: 0.45,
  },
} as const;

/** Daylight — warm sun key, cool fill, readable contrast as the globe rotates. */
export const GLOBE_LIGHTING = {
  ambientIntensity: 0.18,
  hemisphere: {
    skyColor: "#d8e8f8",
    groundColor: "#3a5570",
    intensity: 0.48,
  },
  directional: {
    position: [6, 3, 4] as const,
    color: "#ffe8cc",
    intensity: 1.25,
  },
  fill: {
    position: [-4, 1, -3] as const,
    color: "#8aaec8",
    intensity: 0.38,
  },
} as const;

/** ACES tone mapping — daylight exposure. */
export const GLOBE_TONE_MAPPING = {
  exposure: 1.12,
} as const;
