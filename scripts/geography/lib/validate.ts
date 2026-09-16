import type { Geometry } from "geojson";

import type { RawCountryFeature, RawCountryFeatureCollection } from "./types";

const SUPPORTED_GEOMETRY_TYPES = new Set(["Polygon", "MultiPolygon"]);

export function isSupportedGeometry(geometry: Geometry): geometry is RawCountryFeature["geometry"] {
  return SUPPORTED_GEOMETRY_TYPES.has(geometry.type);
}

export function assertFeatureCollection(value: unknown): RawCountryFeatureCollection {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value) ||
    value.type !== "FeatureCollection" ||
    !("features" in value) ||
    !Array.isArray(value.features)
  ) {
    throw new Error("Expected a GeoJSON FeatureCollection.");
  }

  return value as RawCountryFeatureCollection;
}

export function validateCountryFeature(feature: unknown, index: number): RawCountryFeature {
  if (
    typeof feature !== "object" ||
    feature === null ||
    !("type" in feature) ||
    feature.type !== "Feature" ||
    !("geometry" in feature) ||
    feature.geometry === null ||
    typeof feature.geometry !== "object"
  ) {
    throw new Error(`Feature at index ${index} is not a valid GeoJSON Feature.`);
  }

  const geometry = feature.geometry as Geometry;
  if (!isSupportedGeometry(geometry)) {
    throw new Error(`Feature at index ${index} must be Polygon or MultiPolygon.`);
  }

  return feature as RawCountryFeature;
}
