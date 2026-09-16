/**
 * Verified country metadata. Geometry references `id` only — see docs/ARCHITECTURE.md.
 */
export type Country = {
  id: string;
  name: string;
  isoA2: string;
  aliases?: readonly string[];
  population?: number;
  totalAreaKm2?: number;
  landAreaKm2?: number;
  landAreaPercent?: number;
  waterAreaPercent?: number;
  populationDensity?: number;
  languages?: readonly string[];
  capital?: string;
  region?: string;
  subregion?: string;
  gdpUsdMillions?: number;
  climate?: string;
  avgAnnualTemperatureC?: number;
  currencies?: readonly string[];
  timezones?: readonly string[];
};
