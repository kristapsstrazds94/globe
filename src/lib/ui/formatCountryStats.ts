const populationFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const densityFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
});

const gdpFormatter = new Intl.NumberFormat("en", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const areaFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("en", {
  maximumFractionDigits: 1,
});

export function formatPopulation(value: number): string {
  return populationFormatter.format(value);
}

export function formatPopulationDensity(value: number): string {
  return `${densityFormatter.format(value)}/km²`;
}

export function formatAreaKm2(value: number): string {
  return `${areaFormatter.format(value)} km²`;
}

export function formatAreaPercent(value: number): string {
  return `${percentFormatter.format(value)}%`;
}

/** GDP stored as USD millions from world-location-data. */
export function formatGdpUsdMillions(value: number): string {
  return gdpFormatter.format(value * 1_000_000);
}

export function formatClimate(climate: string, avgAnnualTemperatureC?: number): string {
  if (avgAnnualTemperatureC === undefined) {
    return climate;
  }

  const temperature = new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(avgAnnualTemperatureC);

  return `${climate} · ${temperature}°C avg annual`;
}

export function formatLanguageList(languages: readonly string[]): string {
  return languages.join(", ");
}

export function formatList(values: readonly string[]): string {
  return values.join(", ");
}
