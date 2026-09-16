/**
 * Build-time geography preprocessing settings (T021).
 * Tolerance is in decimal degrees on WGS84 coordinates.
 */
export const PREPROCESS_CONFIG = {
  /** Primary dataset tier processed by default. */
  tier: "primary" as const,
  /** Additional simplification beyond source 50m generalization (~2.8 km at equator). */
  simplifyToleranceDegrees: 0.025,
  /** Decimal places for output coordinates — keeps JSON stable across runs. */
  coordinatePrecision: 6,
  output: {
    /** Runtime bundle consumed by the app (not raw GeoJSON). */
    bundlePath: "public/generated/geography/countries.json",
  },
} as const;
