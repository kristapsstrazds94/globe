/** Whether the country details panel should be visible in the DOM. */
export function isCountryPanelVisible(
  isPanelOpen: boolean,
  selectedCountryId: string | null,
  countryName: string | null,
): boolean {
  return isPanelOpen && selectedCountryId !== null && countryName !== null;
}
