/** Parse CIA Factbook area strings such as "323,802 sq km". */
export function parseFactbookAreaSqKm(text: string | undefined): number | null {
  if (!text) {
    return null;
  }

  const match = text.match(/([\d,]+(?:\.\d+)?)\s*sq\s*km/i);
  if (!match?.[1]) {
    return null;
  }

  const value = Number(match[1].replaceAll(",", ""));
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}
