import type { CountryMetadataRecord, ProcessedMetadataBundle } from "@/types/metadata";

export type MetadataValidationResult =
  { ok: true; bundle: ProcessedMetadataBundle } | { ok: false; error: string };

function isMetadataRecord(value: unknown): value is CountryMetadataRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Partial<CountryMetadataRecord>;

  return (
    typeof record.population === "number" &&
    record.population > 0 &&
    typeof record.totalAreaKm2 === "number" &&
    record.totalAreaKm2 > 0 &&
    (record.landAreaKm2 === undefined ||
      (typeof record.landAreaKm2 === "number" && record.landAreaKm2 > 0)) &&
    (record.landAreaPercent === undefined ||
      (typeof record.landAreaPercent === "number" && record.landAreaPercent > 0)) &&
    (record.waterAreaPercent === undefined ||
      (typeof record.waterAreaPercent === "number" && record.waterAreaPercent >= 0)) &&
    typeof record.populationDensity === "number" &&
    record.populationDensity > 0 &&
    Array.isArray(record.languages) &&
    record.languages.every((language) => typeof language === "string" && language.length > 0) &&
    typeof record.capital === "string" &&
    record.capital.length > 0 &&
    typeof record.region === "string" &&
    record.region.length > 0 &&
    typeof record.subregion === "string" &&
    record.subregion.length > 0 &&
    (record.gdpUsdMillions === undefined ||
      (typeof record.gdpUsdMillions === "number" && record.gdpUsdMillions > 0)) &&
    (record.climate === undefined ||
      (typeof record.climate === "string" && record.climate.length > 0)) &&
    (record.avgAnnualTemperatureC === undefined ||
      typeof record.avgAnnualTemperatureC === "number") &&
    (record.currencies === undefined ||
      (Array.isArray(record.currencies) &&
        record.currencies.every(
          (currency) => typeof currency === "string" && currency.length > 0,
        ))) &&
    (record.timezones === undefined ||
      (Array.isArray(record.timezones) &&
        record.timezones.every((timezone) => typeof timezone === "string" && timezone.length > 0)))
  );
}

/** Validate preprocessed metadata before joining into runtime country records. */
export function validateMetadataBundle(value: unknown): MetadataValidationResult {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "Country metadata is missing or invalid." };
  }

  const bundle = value as Partial<ProcessedMetadataBundle>;

  if (bundle.schemaVersion !== 1) {
    return { ok: false, error: "Country metadata uses an unsupported format." };
  }

  if (typeof bundle.sourceVersion !== "string" || bundle.sourceVersion.length === 0) {
    return { ok: false, error: "Country metadata is missing source information." };
  }

  if (typeof bundle.records !== "object" || bundle.records === null) {
    return { ok: false, error: "Country metadata contains no records." };
  }

  const entries = Object.entries(bundle.records);
  if (entries.length === 0) {
    return { ok: false, error: "Country metadata contains no records." };
  }

  if (typeof bundle.recordCount === "number" && bundle.recordCount !== entries.length) {
    return { ok: false, error: "Country metadata is incomplete or corrupted." };
  }

  for (const [countryId, record] of entries) {
    if (countryId.length === 0) {
      return { ok: false, error: "Country metadata contains records without identifiers." };
    }

    if (!isMetadataRecord(record)) {
      return { ok: false, error: `Country metadata record for "${countryId}" is invalid.` };
    }
  }

  return {
    ok: true,
    bundle: {
      schemaVersion: 1,
      sourceVersion: bundle.sourceVersion,
      recordCount: entries.length,
      records: bundle.records as Record<string, CountryMetadataRecord>,
    },
  };
}
