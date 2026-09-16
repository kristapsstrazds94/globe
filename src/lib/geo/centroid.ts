import type { LonLatPolygon, LonLatRing, ProcessedGeometry } from "@/types/geography";

import { lonLatPositionToSpherePoint, normalizeLongitude } from "./coordinates";
import { polylabel } from "./polylabel";

/** Geographic centroid in degrees. */
export type GeoCentroid = {
  lng: number;
  lat: number;
};

const RAD_TO_DEG = 180 / Math.PI;

type UnwrappedPosition = [lng: number, lat: number];

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

/** Keep longitudes continuous so antimeridian-spanning rings have a valid planar centroid. */
export function unwrapRingLongitudes(ring: LonLatRing): UnwrappedPosition[] {
  if (ring.length === 0) {
    return [];
  }

  const unwrapped: UnwrappedPosition[] = [[ring[0]![0], ring[0]![1]]];
  let offset = 0;

  for (let index = 1; index < ring.length; index += 1) {
    const [sourceLng, lat] = ring[index]!;
    let lng = sourceLng + offset;
    const previousLng = unwrapped[index - 1]![0];

    while (lng - previousLng > 180) {
      lng -= 360;
      offset -= 360;
    }

    while (lng - previousLng < -180) {
      lng += 360;
      offset += 360;
    }

    unwrapped.push([lng, lat]);
  }

  return unwrapped;
}

/** Signed planar area in degree space — sufficient for comparing polygon sizes. */
export function planarRingArea(ring: LonLatRing): number {
  const unwrapped = unwrapRingLongitudes(ring);
  let area = 0;

  for (let index = 0; index < unwrapped.length - 1; index += 1) {
    const [x1, y1] = unwrapped[index]!;
    const [x2, y2] = unwrapped[index + 1]!;
    area += x1 * y2 - x2 * y1;
  }

  return Math.abs(area / 2);
}

/** Planar polygon centroid in geographic degrees. */
export function planarRingCentroid(ring: LonLatRing): GeoCentroid | null {
  const unwrapped = unwrapRingLongitudes(ring);
  if (unwrapped.length < 3) {
    return null;
  }

  let area = 0;
  let centroidX = 0;
  let centroidY = 0;

  for (let index = 0; index < unwrapped.length - 1; index += 1) {
    const [x1, y1] = unwrapped[index]!;
    const [x2, y2] = unwrapped[index + 1]!;
    const cross = x1 * y2 - x2 * y1;
    area += cross;
    centroidX += (x1 + x2) * cross;
    centroidY += (y1 + y2) * cross;
  }

  area /= 2;
  if (area === 0) {
    return null;
  }

  const factor = 1 / (6 * area);

  return {
    lng: normalizeLongitude(centroidX * factor),
    lat: centroidY * factor,
  };
}

/** Ray-cast point-in-polygon test on the outer ring (planar lon/lat). */
export function isPointInOuterRing(lng: number, lat: number, ring: LonLatRing): boolean {
  let inside = false;

  for (
    let index = 0, previous = ring.length - 1;
    index < ring.length;
    previous = index, index += 1
  ) {
    const [xi, yi] = ring[index]!;
    const [xj, yj] = ring[previous]!;

    const intersects = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function computeOuterRingSphereCentroid(ring: LonLatRing): GeoCentroid | null {
  const ringSum = accumulateOuterRing(ring);
  if (ringSum.count === 0) {
    return null;
  }

  const length = Math.hypot(ringSum.x, ringSum.y, ringSum.z);
  if (length === 0) {
    return null;
  }

  return sphereUnitToLonLat(ringSum.x / length, ringSum.y / length, ringSum.z / length);
}

function getPolygons(geometry: ProcessedGeometry): LonLatPolygon[] {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.length > 0 ? [geometry.coordinates] : [];
  }

  return geometry.coordinates.filter((polygon) => polygon.length > 0);
}

function computePrimaryPolygonCentroid(polygon: LonLatPolygon): GeoCentroid | null {
  const outer = polygon[0];
  if (!outer) {
    return null;
  }

  const labelPoint = polylabel(polygon, 0.01);
  if (labelPoint && isPointInOuterRing(labelPoint.lng, labelPoint.lat, outer)) {
    return labelPoint;
  }

  const planar = planarRingCentroid(outer);
  if (planar && isPointInOuterRing(planar.lng, planar.lat, outer)) {
    return planar;
  }

  return computeOuterRingSphereCentroid(outer);
}

/**
 * Centroid for camera fly-to and map markers.
 * Uses the largest land polygon so overseas territories do not pull the point offshore.
 */
export function computeGeometryCentroid(geometry: ProcessedGeometry): GeoCentroid | null {
  const polygons = getPolygons(geometry);
  if (polygons.length === 0) {
    return null;
  }

  let largestPolygon = polygons[0]!;
  let largestArea = planarRingArea(largestPolygon[0]!);

  for (let index = 1; index < polygons.length; index += 1) {
    const polygon = polygons[index]!;
    const outer = polygon[0];
    if (!outer) {
      continue;
    }

    const area = planarRingArea(outer);
    if (area > largestArea) {
      largestPolygon = polygon;
      largestArea = area;
    }
  }

  return computePrimaryPolygonCentroid(largestPolygon);
}
