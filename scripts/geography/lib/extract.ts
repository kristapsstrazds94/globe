import { GEOGRAPHY_SOURCE } from "../source.config";
import { normalizeCountryId, normalizeCountryName } from "./normalize";
import {
  roundMultiPolygonCoordinates,
  roundPolygonCoordinates,
} from "./round";
import { simplifyGeometry } from "./simplify";
import type {
  ProcessedCountryRecord,
  ProcessedGeometry,
  RawCountryFeature,
} from "./types";

export function extractCountryRecord(
  feature: RawCountryFeature,
  simplifyToleranceDegrees: number,
  coordinatePrecision: number,
): ProcessedCountryRecord | null {
  const properties = feature.properties ?? {};
  const id = normalizeCountryId(
    properties[GEOGRAPHY_SOURCE.identifiers.primary],
  );
  const name = normalizeCountryName(
    properties[GEOGRAPHY_SOURCE.identifiers.displayName],
  );

  if (id === null || name === null) {
    return null;
  }

  const simplified = simplifyGeometry(
    feature.geometry,
    simplifyToleranceDegrees,
  );

  const geometry: ProcessedGeometry =
    simplified.type === "Polygon"
      ? {
          type: "Polygon",
          coordinates: roundPolygonCoordinates(
            simplified.coordinates,
            coordinatePrecision,
          ),
        }
      : {
          type: "MultiPolygon",
          coordinates: roundMultiPolygonCoordinates(
            simplified.coordinates,
            coordinatePrecision,
          ),
        };

  return { id, name, geometry };
}
