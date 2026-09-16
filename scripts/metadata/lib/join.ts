import { ISO_A2_FALLBACK_BLOCKLIST } from "../source.config";
import { formatClimateLabel, formatCurrencyList, formatTimezoneList } from "./formatPackageValues";
import type { FactbookAreaProfile } from "./loadFactbook";
import type { ClimateProfile, CountryMetadataRecord, PackageCountryProfile } from "./types";

export type GeographyFeatureRef = {
  id: string;
  isoA2: string;
};

function resolveProfile(
  geographyId: string,
  isoA2: string,
  byCca3: ReadonlyMap<string, PackageCountryProfile>,
  byCca2: ReadonlyMap<string, PackageCountryProfile>,
): PackageCountryProfile | null {
  const direct = byCca3.get(geographyId);
  if (direct) {
    return direct;
  }

  if (ISO_A2_FALLBACK_BLOCKLIST.has(geographyId)) {
    return null;
  }

  return byCca2.get(isoA2) ?? null;
}

function mergeProfiles(
  geography: PackageCountryProfile,
  population: PackageCountryProfile | undefined,
  climate: ClimateProfile | undefined,
): PackageCountryProfile {
  return {
    cca2: geography.cca2,
    cca3: geography.cca3,
    capital: geography.capital ?? population?.capital,
    area: geography.area ?? population?.area,
    languages: geography.languages ?? population?.languages,
    region: geography.region ?? population?.region,
    subregion: geography.subregion ?? population?.subregion,
    population: population?.population ?? geography.population,
    gdpUsdMillions: population?.gdpUsdMillions ?? geography.gdpUsdMillions,
    currencies: geography.currencies ?? population?.currencies,
    timezones: population?.timezones ?? geography.timezones,
    climate: climate?.climate,
    avgAnnualTemperatureC: climate?.avgAnnualTemperatureC,
  };
}

function roundDensity(population: number, areaKm2: number): number {
  const density = population / areaKm2;
  const rounded = Math.round(density * 10) / 10;

  if (rounded === 0 && density > 0) {
    return Math.round(density * 100) / 100;
  }

  return rounded;
}

/** Join package datasets onto a Natural Earth map unit. Returns null when no verified profile exists. */
export function joinCountryMetadata(
  feature: GeographyFeatureRef,
  geographyByCca3: ReadonlyMap<string, PackageCountryProfile>,
  geographyByCca2: ReadonlyMap<string, PackageCountryProfile>,
  populationByIso3: ReadonlyMap<string, PackageCountryProfile>,
  populationByIso2: ReadonlyMap<string, PackageCountryProfile>,
  climateByAlpha2: ReadonlyMap<string, ClimateProfile>,
  factbookAreaByIsoA2: ReadonlyMap<string, FactbookAreaProfile>,
): CountryMetadataRecord | null {
  const geographyProfile = resolveProfile(
    feature.id,
    feature.isoA2,
    geographyByCca3,
    geographyByCca2,
  );

  if (!geographyProfile) {
    return null;
  }

  const populationProfile =
    populationByIso3.get(geographyProfile.cca3) ??
    populationByIso2.get(geographyProfile.cca2) ??
    undefined;

  const climateProfile = climateByAlpha2.get(geographyProfile.cca2);
  const merged = mergeProfiles(geographyProfile, populationProfile, climateProfile);
  const languages = merged.languages ? [...new Set(Object.values(merged.languages))].sort() : [];
  const capital = merged.capital?.[0]?.trim() ?? "";
  const region = merged.region?.trim() ?? "";
  const subregion = merged.subregion?.trim() ?? "";
  const population = merged.population;
  const factbookArea = factbookAreaByIsoA2.get(merged.cca2);
  const fallbackAreaKm2 = merged.area;
  const totalAreaKm2 = factbookArea?.totalAreaKm2 ?? fallbackAreaKm2;
  const densityAreaKm2 = factbookArea?.landAreaKm2 ?? totalAreaKm2;
  const currencies = formatCurrencyList(merged.currencies);
  const timezones = formatTimezoneList(merged.timezones);

  if (
    languages.length === 0 ||
    capital.length === 0 ||
    region.length === 0 ||
    subregion.length === 0 ||
    typeof totalAreaKm2 !== "number" ||
    totalAreaKm2 <= 0 ||
    typeof densityAreaKm2 !== "number" ||
    densityAreaKm2 <= 0 ||
    typeof population !== "number" ||
    population <= 0
  ) {
    return null;
  }

  const record: CountryMetadataRecord = {
    population,
    totalAreaKm2,
    populationDensity: roundDensity(population, densityAreaKm2),
    languages,
    capital,
    region,
    subregion,
  };

  if (factbookArea) {
    record.landAreaKm2 = factbookArea.landAreaKm2;
    record.landAreaPercent = factbookArea.landAreaPercent;
    record.waterAreaPercent = factbookArea.waterAreaPercent;
  }

  if (typeof merged.gdpUsdMillions === "number" && merged.gdpUsdMillions > 0) {
    record.gdpUsdMillions = merged.gdpUsdMillions;
  }

  if (merged.climate) {
    record.climate = formatClimateLabel(merged.climate);
  }

  if (typeof merged.avgAnnualTemperatureC === "number") {
    record.avgAnnualTemperatureC = merged.avgAnnualTemperatureC;
  }

  if (currencies.length > 0) {
    record.currencies = currencies;
  }

  if (timezones.length > 0) {
    record.timezones = timezones;
  }

  return record;
}
