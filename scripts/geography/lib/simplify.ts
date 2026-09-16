import { feature } from "@turf/helpers";
import simplify from "@turf/simplify";
import type { MultiPolygon, Polygon } from "geojson";

/** Deterministic Douglas–Peucker simplification in decimal degrees. */
export function simplifyGeometry(
  geometry: Polygon | MultiPolygon,
  toleranceDegrees: number,
): Polygon | MultiPolygon {
  const simplified = simplify(feature(geometry), {
    tolerance: toleranceDegrees,
    highQuality: true,
    mutate: false,
  });

  return simplified.geometry as Polygon | MultiPolygon;
}
