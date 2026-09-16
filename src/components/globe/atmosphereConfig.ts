import { GLOBE_COLORS } from "@/lib/design/globeTokens";

const MOBILE_BREAKPOINT_PX = 768;
const TABLET_BREAKPOINT_PX = 1024;

export const ATMOSPHERE_GLOW_COLOR = GLOBE_COLORS.atmosphereGlow;

export const ATMOSPHERE_TIER_SETTINGS = {
  high: {
    enabled: true,
    intensity: 0.19,
    power: 3.2,
    segments: 56,
  },
  medium: {
    enabled: true,
    intensity: 0.16,
    power: 3.3,
    segments: 40,
  },
  low: {
    enabled: true,
    intensity: 0.13,
    power: 3.4,
    segments: 28,
  },
  /** Minimal rim when reduced motion is requested. */
  reduced: {
    enabled: true,
    intensity: 0.08,
    power: 3.6,
    segments: 24,
  },
} as const;

export type AtmosphereQualityTier = keyof typeof ATMOSPHERE_TIER_SETTINGS;

export type AtmosphereSettings = {
  enabled: boolean;
  intensity: number;
  power: number;
  segments: number;
};

export const ATMOSPHERE_SHADER = {
  vertex: /* glsl */ `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 glowColor;
    uniform float intensity;
    uniform float power;

    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vNormal);

      float fresnel = 1.0 - clamp(dot(viewDirection, normal), 0.0, 1.0);
      fresnel = pow(fresnel, power);
      float limb = smoothstep(0.12, 1.0, fresnel);

      float alpha = limb * intensity;
      gl_FragColor = vec4(glowColor, alpha);
    }
  `,
} as const;

export function getAtmosphereQualityTier(viewportWidth: number): AtmosphereQualityTier {
  if (viewportWidth < MOBILE_BREAKPOINT_PX) return "low";
  if (viewportWidth < TABLET_BREAKPOINT_PX) return "medium";
  return "high";
}

export function getAtmosphereSettings(
  viewportWidth: number,
  prefersReducedMotion: boolean,
): AtmosphereSettings {
  const tier = prefersReducedMotion ? "reduced" : getAtmosphereQualityTier(viewportWidth);
  return ATMOSPHERE_TIER_SETTINGS[tier];
}
