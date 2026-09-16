import type { ProcessedGeographyBundle, ProcessedGeometry } from "@/types/geography";

export type GeographyValidationResult =
  { ok: true; bundle: ProcessedGeographyBundle } | { ok: false; error: string };

function isProcessedGeometry(value: unknown): value is ProcessedGeometry {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const geometry = value as { type?: unknown; coordinates?: unknown };

  if (geometry.type === "Polygon") {
    return Array.isArray(geometry.coordinates);
  }

  if (geometry.type === "MultiPolygon") {
    return Array.isArray(geometry.coordinates);
  }

  return false;
}

/**
 * Validate a preprocessed geography bundle before rendering or search use.
 * Keeps runtime failures understandable when build artifacts are missing or corrupt.
 */
export function validateGeographyBundle(value: unknown): GeographyValidationResult {
  if (typeof value !== "object" || value === null) {
    return { ok: false, error: "Geography data is missing or invalid." };
  }

  const bundle = value as Partial<ProcessedGeographyBundle>;

  if (bundle.schemaVersion !== 1) {
    return { ok: false, error: "Geography data uses an unsupported format." };
  }

  if (typeof bundle.sourceVersion !== "string" || bundle.sourceVersion.length === 0) {
    return { ok: false, error: "Geography data is missing source information." };
  }

  if (!Array.isArray(bundle.features) || bundle.features.length === 0) {
    return { ok: false, error: "Geography data contains no countries." };
  }

  if (typeof bundle.featureCount === "number" && bundle.featureCount !== bundle.features.length) {
    return {
      ok: false,
      error: "Geography data is incomplete or corrupted.",
    };
  }

  for (const feature of bundle.features) {
    if (typeof feature !== "object" || feature === null) {
      return { ok: false, error: "Geography data contains invalid country records." };
    }

    if (typeof feature.id !== "string" || feature.id.length === 0) {
      return { ok: false, error: "Geography data contains countries without identifiers." };
    }

    if (typeof feature.name !== "string" || feature.name.length === 0) {
      return { ok: false, error: "Geography data contains countries without names." };
    }

    if (!isProcessedGeometry(feature.geometry)) {
      return { ok: false, error: "Geography data contains invalid country geometry." };
    }
  }

  return {
    ok: true,
    bundle: bundle as ProcessedGeographyBundle,
  };
}
