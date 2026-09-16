import { GLOBE_COLORS, GLOBE_MATERIAL } from "@/lib/design/globeTokens";

/** Muted country fill — slightly lighter than Earth for contrast. */
export const COUNTRY_MATERIAL = {
  color: GLOBE_COLORS.countryDefault,
  roughness: GLOBE_MATERIAL.countryDefault.roughness,
  metalness: GLOBE_MATERIAL.countryDefault.metalness,
} as const;

/** Brighter cool blue hover fill. */
export const COUNTRY_HOVER_MATERIAL = {
  color: GLOBE_COLORS.countryHover,
  roughness: GLOBE_MATERIAL.countryHover.roughness,
  metalness: GLOBE_MATERIAL.countryHover.metalness,
} as const;

/** Warm amber selection — pops against green land and hover. */
export const COUNTRY_SELECTION_MATERIAL = {
  color: GLOBE_COLORS.countrySelected,
  emissive: GLOBE_COLORS.countrySelectedEmissive,
  roughness: GLOBE_MATERIAL.countrySelected.roughness,
  metalness: GLOBE_MATERIAL.countrySelected.metalness,
  emissiveIntensity: GLOBE_MATERIAL.countrySelected.emissiveIntensity,
} as const;

export type CountryFillMaterialConfig =
  typeof COUNTRY_MATERIAL | typeof COUNTRY_HOVER_MATERIAL | typeof COUNTRY_SELECTION_MATERIAL;
