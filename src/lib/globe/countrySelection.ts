/** Maximum pointer movement (px) that still counts as a tap/click for country selection. */
export const COUNTRY_TAP_THRESHOLD_PX = 5;

export type CountryVisualMaterial = "default" | "hover" | "selected";

export type PointerPoint = Pick<PointerEvent, "clientX" | "clientY">;

/** True when pointer down/up are close enough to be a tap rather than a drag. */
export function isTapGesture(
  start: PointerPoint,
  end: PointerPoint,
  thresholdPx = COUNTRY_TAP_THRESHOLD_PX,
): boolean {
  const dx = end.clientX - start.clientX;
  const dy = end.clientY - start.clientY;
  return dx * dx + dy * dy <= thresholdPx * thresholdPx;
}

/** Resolve fill material for a country — selection outranks hover. */
export function resolveCountryVisualMaterial(
  countryId: string,
  hoveredCountryId: string | null,
  selectedCountryId: string | null,
): CountryVisualMaterial {
  if (selectedCountryId === countryId) {
    return "selected";
  }

  if (hoveredCountryId === countryId) {
    return "hover";
  }

  return "default";
}

/** Map a pick result to a store action for country selection (T032). */
export function resolveSelectionFromPick(
  pickedCountryId: string | null,
): { type: "select"; countryId: string } | { type: "clear" } {
  if (pickedCountryId !== null) {
    return { type: "select", countryId: pickedCountryId };
  }

  return { type: "clear" };
}
