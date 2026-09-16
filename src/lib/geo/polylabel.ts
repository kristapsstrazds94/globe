import type { LonLatRing } from "@/types/geography";

import { normalizeLongitude } from "./coordinates";
import type { GeoCentroid } from "./centroid";

function unwrapRingLongitudes(ring: LonLatRing): Point[] {
  if (ring.length === 0) {
    return [];
  }

  const unwrapped: Point[] = [[ring[0]![0], ring[0]![1]]];
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

type Point = [lng: number, lat: number];
type Polygon = Point[][];

type Cell = {
  x: number;
  y: number;
  h: number;
  d: number;
  max: number;
};

function pointToSegmentDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  let x = ax;
  let y = ay;
  let dx = bx - ax;
  let dy = by - ay;

  if (dx !== 0 || dy !== 0) {
    const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
    if (t > 1) {
      x = bx;
      y = by;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = px - x;
  dy = py - y;

  return dx * dx + dy * dy;
}

function pointToPolygonDistance(x: number, y: number, polygon: Polygon): number {
  let inside = false;
  let minDistanceSq = Number.POSITIVE_INFINITY;

  for (const ring of polygon) {
    for (
      let index = 0, previous = ring.length - 1;
      index < ring.length;
      previous = index, index += 1
    ) {
      const [xi, yi] = ring[index]!;
      const [xj, yj] = ring[previous]!;

      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }

      minDistanceSq = Math.min(minDistanceSq, pointToSegmentDistance(x, y, xi, yi, xj, yj));
    }
  }

  return (inside ? 1 : -1) * Math.sqrt(minDistanceSq);
}

function createCell(x: number, y: number, h: number, polygon: Polygon): Cell {
  const distance = pointToPolygonDistance(x, y, polygon);
  return {
    x,
    y,
    h,
    d: distance,
    max: distance + h * Math.SQRT2,
  };
}

function createCentroidCell(
  polygon: Polygon,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): Cell {
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  const outer = polygon[0]!;

  for (const [lng, lat] of outer) {
    sumX += lng;
    sumY += lat;
    count += 1;
  }

  const x = count > 0 ? sumX / count : (minX + maxX) / 2;
  const y = count > 0 ? sumY / count : (minY + maxY) / 2;

  return createCell(x, y, 0, polygon);
}

function compareCellPriority(left: Cell, right: Cell): number {
  return right.max - left.max;
}

function ringsToPolygon(rings: readonly LonLatRing[]): Polygon {
  return rings.map((ring) => unwrapRingLongitudes(ring));
}

/**
 * Pole-of-inaccessibility label point — stays visually inside concave countries.
 * Adapted from Mapbox polylabel (ISC license).
 */
export function polylabel(rings: readonly LonLatRing[], precision = 0.01): GeoCentroid | null {
  if (rings.length === 0 || rings[0]!.length === 0) {
    return null;
  }

  const polygon = ringsToPolygon(rings);
  const outer = polygon[0]!;

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const [lng, lat] of outer) {
    if (lng < minX) {
      minX = lng;
    }
    if (lng > maxX) {
      maxX = lng;
    }
    if (lat < minY) {
      minY = lat;
    }
    if (lat > maxY) {
      maxY = lat;
    }
  }

  const width = maxX - minX;
  const height = maxY - minY;
  const cellSize = Math.min(width, height);

  if (cellSize === 0) {
    return { lng: normalizeLongitude(minX), lat: minY };
  }

  let h = cellSize / 2;
  const cellQueue: Cell[] = [];

  for (let x = minX; x < maxX; x += cellSize) {
    for (let y = minY; y < maxY; y += cellSize) {
      cellQueue.push(createCell(x + h, y + h, h, polygon));
    }
  }

  let bestCell = createCentroidCell(polygon, minX, minY, maxX, maxY);

  const bboxCell = createCell(minX + width / 2, minY + height / 2, 0, polygon);
  if (bboxCell.d > bestCell.d) {
    bestCell = bboxCell;
  }

  cellQueue.sort(compareCellPriority);

  while (cellQueue.length > 0) {
    const cell = cellQueue.shift()!;

    if (cell.d > bestCell.d) {
      bestCell = cell;
    }

    if (cell.max - bestCell.d <= precision) {
      continue;
    }

    h = cell.h / 2;
    cellQueue.push(
      createCell(cell.x - h, cell.y - h, h, polygon),
      createCell(cell.x + h, cell.y - h, h, polygon),
      createCell(cell.x - h, cell.y + h, h, polygon),
      createCell(cell.x + h, cell.y + h, h, polygon),
    );
    cellQueue.sort(compareCellPriority);
  }

  return {
    lng: normalizeLongitude(bestCell.x),
    lat: bestCell.y,
  };
}
