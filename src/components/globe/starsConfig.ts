import { GLOBE_COLORS, GLOBE_MATERIAL } from "@/lib/design/globeTokens";

import { GLOBE_CAMERA_MIN_FAR } from "./cameraConfig";

/** Large inward-facing star dome — camera sits near the origin inside this shell. */
export const STARS_RADIUS = GLOBE_CAMERA_MIN_FAR * 0.85;

export const STARS_MAX_COUNT = 3500;

export const STAR_TIER_COUNTS = {
  high: 3200,
  medium: 1800,
  low: 950,
  /** Minimal static field when reduced motion is requested. */
  reduced: 420,
} as const;

export type StarQualityTier = keyof typeof STAR_TIER_COUNTS;

export type StarFieldData = {
  positions: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
};

const MOBILE_BREAKPOINT_PX = 768;
const TABLET_BREAKPOINT_PX = 1024;

/** Star color palette — cool, warm, and neutral whites for natural variation. */
const STAR_PALETTE: readonly [number, number, number][] = [
  [0.72, 0.78, 0.92],
  [0.82, 0.86, 0.96],
  [0.92, 0.94, 1.0],
  [1.0, 0.98, 0.94],
  [0.94, 0.9, 0.82],
  [0.86, 0.92, 1.0],
];

export function getStarQualityTier(viewportWidth: number): StarQualityTier {
  if (viewportWidth < MOBILE_BREAKPOINT_PX) return "low";
  if (viewportWidth < TABLET_BREAKPOINT_PX) return "medium";
  return "high";
}

export function getStarCount(viewportWidth: number, prefersReducedMotion: boolean): number {
  if (prefersReducedMotion) return STAR_TIER_COUNTS.reduced;
  return STAR_TIER_COUNTS[getStarQualityTier(viewportWidth)];
}

function createStarRng(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}

/** Deterministic star field with varied brightness, size, and color. */
export function buildStarField(count: number, radius: number): StarFieldData {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const random = createStarRng(0x9e3779b9);
  const { minSize, maxSize } = GLOBE_MATERIAL.star;

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
    const base = i * 3;
    positions[base] = x * invLength * radius;
    positions[base + 1] = y * invLength * radius;
    positions[base + 2] = z * invLength * radius;

    const palette = STAR_PALETTE[Math.floor(random() * STAR_PALETTE.length)]!;
    const brightness = 0.45 + random() * random() * 0.55;
    colors[base] = palette[0] * brightness;
    colors[base + 1] = palette[1] * brightness;
    colors[base + 2] = palette[2] * brightness;

    const sizeT = random() * random();
    sizes[i] = minSize + sizeT * (maxSize - minSize);
  }

  return { positions, colors, sizes };
}

/** Positions-only helper — used by legacy tests and tooling. */
export function buildStarPositions(count: number, radius: number): Float32Array {
  return buildStarField(count, radius).positions;
}

export const STARS_MATERIAL = {
  color: GLOBE_COLORS.star,
  opacity: GLOBE_MATERIAL.star.opacity,
  sizeAttenuation: 280,
} as const;

export const STARS_SHADER = {
  vertex: /* glsl */ `
    attribute float aSize;
    attribute vec3 aColor;

    varying vec3 vColor;

    uniform float sizeAttenuation;

    void main() {
      vColor = aColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (sizeAttenuation / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: /* glsl */ `
    uniform float opacity;

    varying vec3 vColor;

    void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) {
        discard;
      }

      float core = 1.0 - smoothstep(0.0, 0.22, dist);
      float halo = 1.0 - smoothstep(0.18, 0.5, dist);
      float alpha = max(core, halo * 0.35) * opacity;

      gl_FragColor = vec4(vColor, alpha);
    }
  `,
} as const;
