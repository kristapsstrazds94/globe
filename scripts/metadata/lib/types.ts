import type { METADATA_SOURCES } from "../source.config";

export type PackageTimezone = {
  zoneName: string;
  gmtOffsetName?: string;
  abbreviation?: string;
  tzName?: string;
};

export type PackageCurrency = {
  name: string;
  symbol?: string;
};

export type CountryMetadataRecord = {
  population: number;
  totalAreaKm2: number;
  landAreaKm2?: number;
  landAreaPercent?: number;
  waterAreaPercent?: number;
  populationDensity: number;
  languages: string[];
  capital: string;
  region: string;
  subregion: string;
  gdpUsdMillions?: number;
  climate?: string;
  avgAnnualTemperatureC?: number;
  currencies?: string[];
  timezones?: string[];
};

export type ProcessedMetadataBundle = {
  schemaVersion: 1;
  sourceVersion: string;
  sources: typeof METADATA_SOURCES.geography;
  recordCount: number;
  records: Record<string, CountryMetadataRecord>;
};

export type PackageCountryProfile = {
  cca2: string;
  cca3: string;
  capital?: string[];
  area?: number;
  languages?: Record<string, string>;
  region?: string;
  subregion?: string;
  population?: number;
  gdpUsdMillions?: number | null;
  currencies?: Record<string, PackageCurrency>;
  timezones?: PackageTimezone[];
  climate?: string;
  avgAnnualTemperatureC?: number;
};

export type ClimateProfile = {
  climate: string;
  avgAnnualTemperatureC: number;
};
