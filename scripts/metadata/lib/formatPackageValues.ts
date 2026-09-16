import type { PackageCountryProfile } from "./types";

export function formatCurrencyList(currencies: PackageCountryProfile["currencies"]): string[] {
  if (!currencies) {
    return [];
  }

  return Object.entries(currencies)
    .map(([code, currency]) => {
      const symbol = currency.symbol?.trim();
      return symbol ? `${currency.name} (${symbol})` : `${currency.name} (${code})`;
    })
    .sort();
}

export function formatTimezoneList(timezones: PackageCountryProfile["timezones"]): string[] {
  if (!timezones || timezones.length === 0) {
    return [];
  }

  const labels = timezones.map((timezone) => {
    const name = timezone.tzName?.trim() || timezone.zoneName;
    const offset = timezone.gmtOffsetName?.trim();
    return offset ? `${name} (${offset})` : name;
  });

  return [...new Set(labels)];
}

export function formatClimateLabel(climate: string): string {
  return climate
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
