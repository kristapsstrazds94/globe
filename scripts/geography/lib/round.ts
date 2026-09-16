import type { Position } from "geojson";

import type { LonLatMultiPolygon, LonLatPolygon, LonLatPosition } from "./types";

/** Round WGS84 coordinates for deterministic JSON output. */
export function roundPosition(position: Position, precision: number): LonLatPosition {
  const lon = position[0] ?? 0;
  const lat = position[1] ?? 0;
  const factor = 10 ** precision;

  return [Math.round(lon * factor) / factor, Math.round(lat * factor) / factor];
}

export function roundPolygonCoordinates(
  coordinates: Position[][],
  precision: number,
): LonLatPolygon {
  return coordinates.map((ring) => ring.map((position) => roundPosition(position, precision)));
}

export function roundMultiPolygonCoordinates(
  coordinates: Position[][][],
  precision: number,
): LonLatMultiPolygon {
  return coordinates.map((polygon) => roundPolygonCoordinates(polygon, precision));
}
