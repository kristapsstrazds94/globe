import { COUNTRY_BORDER_RADIUS } from "./earthConfig";

/** Marker base sits above country borders on the unit sphere. */
export const COUNTRY_MARKER_RADIUS = COUNTRY_BORDER_RADIUS + 0.008;

export const COUNTRY_MARKER = {
  pin: {
    height: 0.045,
    baseRadius: 0.012,
    headRadius: 0.014,
    color: "#e83838",
    emissive: "#8a1010",
    emissiveIntensity: 0.35,
    roughness: 0.45,
    metalness: 0.05,
  },
  label: {
    /** Gap above the pin head sphere in local marker space. */
    offsetY: 0.012,
    /** Extra pull toward the camera so the label clears the pin at grazing angles. */
    cameraOffset: 0.04,
    paddingX: 12,
    paddingY: 8,
    fontSize: 14,
    fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
    fontWeight: "500",
    textColor: "#e8edf5",
    backgroundColor: "rgba(12, 20, 36, 0.92)",
    borderColor: "#2a3a52",
    borderWidth: 1,
    borderRadius: 4,
    minWidth: 48,
  },
} as const;
