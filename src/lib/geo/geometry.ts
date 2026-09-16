import type { CountryGeometryRef } from "@/types";
import type {
  LonLatMultiPolygon,
  LonLatPolygon,
  LonLatRing,
  ProcessedGeometry,
} from "@/types/geography";

import {
  DEFAULT_SPHERE_RADIUS,
  lonLatPositionToSpherePoint,
  type SpherePoint,
} from "./coordinates";

/** Alias for geometry records keyed by stable country ID. */
export type GeometryRef = CountryGeometryRef;

/** Convert a GeoJSON linear ring to 3D sphere points (preserves vertex order). */
export function lonLatRingToSpherePoints(
  ring: LonLatRing,
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint[] {
  return ring.map((position) => lonLatPositionToSpherePoint(position, radius));
}

/** Convert a GeoJSON polygon (outer ring + holes) to 3D rings. */
export function lonLatPolygonToSphereRings(
  polygon: LonLatPolygon,
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint[][] {
  return polygon.map((ring) => lonLatRingToSpherePoints(ring, radius));
}

/** Convert a GeoJSON MultiPolygon to 3D polygon rings. */
export function lonLatMultiPolygonToSpherePolygons(
  multiPolygon: LonLatMultiPolygon,
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint[][][] {
  return multiPolygon.map((polygon) => lonLatPolygonToSphereRings(polygon, radius));
}

/**
 * Convert preprocessed runtime geometry to 3D sphere polygons.
 * Each polygon is an array of rings; MultiPolygons yield multiple polygons.
 */
export function processedGeometryToSpherePolygons(
  geometry: ProcessedGeometry,
  radius: number = DEFAULT_SPHERE_RADIUS,
): SpherePoint[][][] {
  if (geometry.type === "Polygon") {
    return [lonLatPolygonToSphereRings(geometry.coordinates, radius)];
  }

  return lonLatMultiPolygonToSpherePolygons(geometry.coordinates, radius);
}

/**
 * Signed winding proxy for a closed ring on the unit sphere.
 * Reversing vertex order negates the sign — use to keep fill triangulation
 * consistent. GeoJSON ring order is preserved by conversion helpers.
 */
export function getSphereRingWinding(ring: readonly SpherePoint[]): number {
  if (ring.length < 4) {
    return 0;
  }

  let nx = 0;
  let ny = 0;
  let nz = 0;

  for (let index = 0; index < ring.length - 1; index += 1) {
    const [x1, y1, z1] = ring[index]!;
    const [x2, y2, z2] = ring[index + 1]!;
    nx += (y1 - y2) * (z1 + z2);
    ny += (z1 - z2) * (x1 + x2);
    nz += (x1 - x2) * (y1 + y2);
  }

  let cx = 0;
  let cy = 0;
  let cz = 0;

  for (const [x, y, z] of ring) {
    cx += x;
    cy += y;
    cz += z;
  }

  const count = ring.length;
  return nx * (cx / count) + ny * (cy / count) + nz * (cz / count);
}
