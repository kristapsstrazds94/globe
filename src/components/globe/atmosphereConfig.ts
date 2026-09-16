const MOBILE_BREAKPOINT_PX = 768;
const TABLET_BREAKPOINT_PX = 1024;

/** Cool blue rim glow — restrained per docs/DESIGN.md. */
export const ATMOSPHERE_GLOW_COLOR = "#5a9fd4";

export const ATMOSPHERE_TIER_SETTINGS = {
  high: {
    enabled: true,
    intensity: 0.52,
    power: 2.75,
    segments: 48,
  },
  medium: {
    enabled: true,
    intensity: 0.4,
    power: 3.0,
    segments: 36,
  },
  low: {
    enabled: true,
    intensity: 0.26,
    power: 3.25,
    segments: 24,
  },
  /** Minimal rim when reduced motion is requested. */
  reduced: {
    enabled: true,
    intensity: 0.16,
    power: 3.5,
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
      float fresnel = 1.0 - clamp(dot(viewDirection, vNormal), 0.0, 1.0);
      fresnel = pow(fresnel, power);
      fresnel = smoothstep(0.0, 1.0, fresnel);
      float alpha = fresnel * intensity;
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
