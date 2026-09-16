import { BufferGeometry, Float32BufferAttribute } from "three";

import type { ProcessedGeometry } from "@/types/geography";

import type { SpherePoint } from "./coordinates";
import { processedGeometryToSpherePolygons } from "./geometry";
import { openRingVertices } from "./sphereTriangulation";

const SEGMENT_KEY_PRECISION = 5;

function segmentKey(a: SpherePoint, b: SpherePoint): string {
  const ax = a[0].toFixed(SEGMENT_KEY_PRECISION);
  const ay = a[1].toFixed(SEGMENT_KEY_PRECISION);
  const az = a[2].toFixed(SEGMENT_KEY_PRECISION);
  const bx = b[0].toFixed(SEGMENT_KEY_PRECISION);
  const by = b[1].toFixed(SEGMENT_KEY_PRECISION);
  const bz = b[2].toFixed(SEGMENT_KEY_PRECISION);
  const left = `${ax},${ay},${az}`;
  const right = `${bx},${by},${bz}`;

  return left < right ? `${left}|${right}` : `${right}|${left}`;
}

function appendSegment(
  a: SpherePoint,
  b: SpherePoint,
  positions: number[],
  seen: Set<string>,
): void {
  const key = segmentKey(a, b);

  if (seen.has(key)) {
    return;
  }

  seen.add(key);
  positions.push(a[0], a[1], a[2], b[0], b[1], b[2]);
}

/** Append outer-ring line segments for one country into a shared positions buffer. */
export function appendCountryBorderSegments(
  geometry: ProcessedGeometry,
  radius: number,
  positions: number[],
  seen: Set<string> = new Set(),
): void {
  const polygons = processedGeometryToSpherePolygons(geometry, radius);

  for (const rings of polygons) {
    const outerRing = rings[0];

    if (!outerRing || outerRing.length < 3) {
      continue;
    }

    const vertices = openRingVertices(outerRing);

    if (vertices.length < 3) {
      continue;
    }

    for (let index = 0; index < vertices.length; index += 1) {
      const current = vertices[index]!;
      const next = vertices[(index + 1) % vertices.length]!;
      appendSegment(current, next, positions, seen);
    }
  }
}

/** Build a single merged LineSegments geometry for country outer borders. */
export function buildMergedCountryBordersBufferGeometry(
  geometries: readonly ProcessedGeometry[],
  radius: number,
): BufferGeometry | null {
  const positions: number[] = [];
  const seen = new Set<string>();

  for (const geometry of geometries) {
    appendCountryBorderSegments(geometry, radius, positions, seen);
  }

  if (positions.length === 0) {
    return null;
  }

  const bufferGeometry = new BufferGeometry();
  bufferGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));

  return bufferGeometry;
}
