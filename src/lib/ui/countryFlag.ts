/** SVG flag URL from verified ISO 3166-1 alpha-2 (Natural Earth `ISO_A2_EH`). */
export function getCountryFlagSrc(isoA2: string): string | null {
  const code = isoA2.toLowerCase();
  if (!/^[a-z]{2}$/.test(code)) {
    return null;
  }

  return `https://flagcdn.com/w80/${code}.png`;
}
