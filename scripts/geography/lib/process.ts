import { GEOGRAPHY_SOURCE } from "../source.config";
import { PREPROCESS_CONFIG } from "../preprocess.config";
import { extractCountryRecord } from "./extract";
import type {
  ProcessedGeographyOutput,
  RawCountryFeatureCollection,
} from "./types";
import { validateCountryFeature } from "./validate";

export function processFeatureCollection(
  collection: RawCountryFeatureCollection,
): ProcessedGeographyOutput {
  const dataset = GEOGRAPHY_SOURCE.datasets[PREPROCESS_CONFIG.tier];
  const seenIds = new Set<string>();
  const features = [];

  for (const [index, rawFeature] of collection.features.entries()) {
    const feature = validateCountryFeature(rawFeature, index);
    const record = extractCountryRecord(
      feature,
      PREPROCESS_CONFIG.simplifyToleranceDegrees,
      PREPROCESS_CONFIG.coordinatePrecision,
    );

    if (record === null) {
      continue;
    }

    if (seenIds.has(record.id)) {
      throw new Error(`Duplicate country id "${record.id}" in source data.`);
    }

    seenIds.add(record.id);
    features.push(record);
  }

  if (features.length === 0) {
    throw new Error("No valid country features were extracted.");
  }

  return {
    schemaVersion: 1,
    sourceVersion: GEOGRAPHY_SOURCE.version,
    scale: dataset.scale,
    simplifyToleranceDegrees: PREPROCESS_CONFIG.simplifyToleranceDegrees,
    featureCount: features.length,
    features,
  };
}
