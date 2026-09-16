import { GLOBE_CAMERA } from "./cameraConfig";

/** Large inward-facing star dome — camera sits near the origin inside this shell. */
export const STARS_RADIUS = GLOBE_CAMERA.far * 0.85;

export const STARS_MAX_COUNT = 2500;

export const STAR_TIER_COUNTS = {
  high: 2500,
  medium: 1500,
  low: 800,
  /** Minimal static field when reduced motion is requested. */
  reduced: 350,
} as const;

export type StarQualityTier = keyof typeof STAR_TIER_COUNTS;

const MOBILE_BREAKPOINT_PX = 768;
const TABLET_BREAKPOINT_PX = 1024;

export function getStarQualityTier(viewportWidth: number): StarQualityTier {
  if (viewportWidth < MOBILE_BREAKPOINT_PX) return "low";
  if (viewportWidth < TABLET_BREAKPOINT_PX) return "medium";
  return "high";
}

export function getStarCount(
  viewportWidth: number,
  prefersReducedMotion: boolean,
): number {
  if (prefersReducedMotion) return STAR_TIER_COUNTS.reduced;
  return STAR_TIER_COUNTS[getStarQualityTier(viewportWidth)];
}

/** Deterministic positions on a sphere — stable across renders and hot reloads. */
export function buildStarPositions(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  let seed = 0x9e3779b9;

  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    let lengthSq = 0;

    do {
      x = random() * 2 - 1;
      y = random() * 2 - 1;
      z = random() * 2 - 1;
      lengthSq = x * x + y * y + z * z;
    } while (lengthSq > 1 || lengthSq === 0);

    const invLength = 1 / Math.sqrt(lengthSq);
    positions[i * 3] = x * invLength * radius;
    positions[i * 3 + 1] = y * invLength * radius;
    positions[i * 3 + 2] = z * invLength * radius;
  }

  return positions;
}

export const STARS_MATERIAL = {
  color: "#c8d4e8",
  size: 1.15,
  opacity: 0.62,
} as const;
