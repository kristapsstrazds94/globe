import type { Country } from "@/types";
import { countrySearchAliases } from "@/lib/search/countrySearchAliases";

import { geographyBundle } from "./geography";
import { metadataBundle } from "./metadata";

/** Verified metadata derived from preprocessed geography and build-time package joins. */
export const countries: Country[] = geographyBundle.features.map((feature) => {
  const stats = metadataBundle.records[feature.id];

  return {
    id: feature.id,
    name: feature.name,
    isoA2: feature.isoA2,
    aliases: countrySearchAliases[feature.id],
    population: stats?.population,
    totalAreaKm2: stats?.totalAreaKm2,
    landAreaKm2: stats?.landAreaKm2,
    landAreaPercent: stats?.landAreaPercent,
    waterAreaPercent: stats?.waterAreaPercent,
    populationDensity: stats?.populationDensity,
    languages: stats?.languages,
    capital: stats?.capital,
    region: stats?.region,
    subregion: stats?.subregion,
    gdpUsdMillions: stats?.gdpUsdMillions,
    climate: stats?.climate,
    avgAnnualTemperatureC: stats?.avgAnnualTemperatureC,
    currencies: stats?.currencies,
    timezones: stats?.timezones,
  };
});
