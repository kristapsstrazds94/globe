import { countryGeography } from "@sil/data";
import worldCountries from "world-countries";
import { getAllCountries } from "world-location-data";

import type { ClimateProfile, PackageCountryProfile } from "./types";

function toGeographyProfile(entry: (typeof worldCountries)[number]): PackageCountryProfile {
  return {
    cca2: entry.cca2,
    cca3: entry.cca3,
    capital: entry.capital,
    area: entry.area,
    languages: entry.languages,
    region: entry.region,
    subregion: entry.subregion,
    currencies: entry.currencies,
  };
}

function toPopulationProfile(
  entry: ReturnType<typeof getAllCountries>[number],
): PackageCountryProfile {
  return {
    cca2: entry.iso2,
    cca3: entry.iso3,
    capital: entry.capital ? [entry.capital] : undefined,
    population: entry.population,
    gdpUsdMillions: entry.gdp,
    region: entry.region,
    subregion: entry.subregion,
    timezones: entry.timezones,
  };
}

export function loadMetadataSources(): {
  geographyByCca3: Map<string, PackageCountryProfile>;
  geographyByCca2: Map<string, PackageCountryProfile>;
  populationByIso3: Map<string, PackageCountryProfile>;
  populationByIso2: Map<string, PackageCountryProfile>;
  climateByAlpha2: Map<string, ClimateProfile>;
} {
  const geographyByCca3 = new Map<string, PackageCountryProfile>();
  const geographyByCca2 = new Map<string, PackageCountryProfile>();

  for (const entry of worldCountries) {
    const profile = toGeographyProfile(entry);
    geographyByCca3.set(profile.cca3, profile);
    geographyByCca2.set(profile.cca2, profile);
  }

  const populationByIso3 = new Map<string, PackageCountryProfile>();
  const populationByIso2 = new Map<string, PackageCountryProfile>();

  for (const entry of getAllCountries()) {
    const profile = toPopulationProfile(entry);
    populationByIso3.set(profile.cca3, profile);
    populationByIso2.set(profile.cca2, profile);
  }

  const climateByAlpha2 = new Map<string, ClimateProfile>();

  for (const entry of countryGeography) {
    climateByAlpha2.set(entry.alpha2, {
      climate: entry.climate,
      avgAnnualTemperatureC: entry.avgTemperature,
    });
  }

  return {
    geographyByCca3,
    geographyByCca2,
    populationByIso3,
    populationByIso2,
    climateByAlpha2,
  };
}
