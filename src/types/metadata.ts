/** Verified country statistics joined at build time — see scripts/metadata/source.config.ts. */
export type CountryMetadataRecord = {
  population: number;
  totalAreaKm2: number;
  landAreaKm2?: number;
  landAreaPercent?: number;
  waterAreaPercent?: number;
  populationDensity: number;
  languages: readonly string[];
  capital: string;
  region: string;
  subregion: string;
  gdpUsdMillions?: number;
  climate?: string;
  avgAnnualTemperatureC?: number;
  currencies?: readonly string[];
  timezones?: readonly string[];
};

export type ProcessedMetadataBundle = {
  schemaVersion: 1;
  sourceVersion: string;
  recordCount: number;
  records: Record<string, CountryMetadataRecord>;
};
