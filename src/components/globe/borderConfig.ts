import { GLOBE_COLORS, GLOBE_MATERIAL } from "@/lib/design/globeTokens";

/** Subtle country border stroke — slightly lighter than fill for legibility. */
export const COUNTRY_BORDER_MATERIAL = {
  color: GLOBE_COLORS.border,
  opacity: GLOBE_MATERIAL.border.opacity,
} as const;
