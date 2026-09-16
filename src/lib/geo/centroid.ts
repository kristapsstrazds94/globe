import type { LonLatRing, ProcessedGeometry } from "@/types/geography";

import { lonLatPositionToSpherePoint, normalizeLongitude } from "./coordinates";

/** Geographic centroid in degrees. */
export type GeoCentroid = {
  lng: number;
  lat: number;
};

const RAD_TO_DEG = 180 / Math.PI;

/** Convert a unit-sphere direction to WGS84 degrees (inverse of lonLatToSpherePoint). */
export function sphereUnitToLonLat(x: number, y: number, z: number): GeoCentroid {
  const clampedY = Math.max(-1, Math.min(1, y));
  const theta = Math.acos(clampedY);
  const lat = 90 - theta * RAD_TO_DEG;
  const phi = Math.atan2(z, -x);
  const lng = normalizeLongitude((Math.PI - phi) * RAD_TO_DEG);
  return { lng, lat };
}

function accumulateOuterRing(ring: LonLatRing): { x: number; y: number; z: number; count: number } {
  let x = 0;
  let y = 0;
  let z = 0;
  let count = 0;

  for (const position of ring) {
    const [px, py, pz] = lonLatPositionToSpherePoint(position);
    x += px;
    y += py;
    z += pz;
    count += 1;
  }

  return { x, y, z, count };
}

/**
 * Area-free centroid from outer rings on the unit sphere.
 * Averages 3D directions so antimeridian-spanning countries stay stable.
 */
export function computeGeometryCentroid(geometry: ProcessedGeometry): GeoCentroid | null {
  let x = 0;
  let y = 0;
  let z = 0;
  let count = 0;

  if (geometry.type === "Polygon") {
    const outer = geometry.coordinates[0];
    if (!outer) {
      return null;
    }

    const ringSum = accumulateOuterRing(outer);
    x += ringSum.x;
    y += ringSum.y;
    z += ringSum.z;
    count += ringSum.count;
  } else {
    for (const polygon of geometry.coordinates) {
      const outer = polygon[0];
      if (!outer) {
        continue;
      }

      const ringSum = accumulateOuterRing(outer);
      x += ringSum.x;
      y += ringSum.y;
      z += ringSum.z;
      count += ringSum.count;
    }
  }

  if (count === 0) {
    return null;
  }

  const length = Math.hypot(x, y, z);
  if (length === 0) {
    return null;
  }

  return sphereUnitToLonLat(x / length, y / length, z / length);
}
