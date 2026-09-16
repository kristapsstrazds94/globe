import { Earcut } from "three/src/extras/Earcut.js";

import type { SpherePoint } from "./coordinates";

type Ring2D = {
  flat: number[];
  points3d: SpherePoint[];
};

/** Drop GeoJSON closing duplicate when the ring repeats its first vertex. */
export function openRingVertices(ring: readonly SpherePoint[]): readonly SpherePoint[] {
  if (ring.length < 4) {
    return ring;
  }

  const first = ring[0]!;
  const last = ring[ring.length - 1]!;

  if (first[0] === last[0] && first[1] === last[1] && first[2] === last[2]) {
    return ring.slice(0, -1);
  }

  return ring;
}

function normalizePoint(point: SpherePoint, radius: number): SpherePoint {
  const [x, y, z] = point;
  const length = Math.hypot(x, y, z);

  if (length < 1e-12) {
    return [0, radius, 0];
  }

  const scale = radius / length;
  return [x * scale, y * scale, z * scale];
}

function ringCentroidNormal(ring: readonly SpherePoint[]): SpherePoint {
  let cx = 0;
  let cy = 0;
  let cz = 0;

  for (const [x, y, z] of ring) {
    cx += x;
    cy += y;
    cz += z;
  }

  const length = Math.hypot(cx, cy, cz);

  if (length < 1e-12) {
    return [0, 1, 0];
  }

  return [cx / length, cy / length, cz / length];
}

function createTangentBasis(normal: SpherePoint): {
  u: SpherePoint;
  v: SpherePoint;
} {
  const [nx, ny, nz] = normal;
  const reference: SpherePoint = Math.abs(ny) < 0.9 ? [0, 1, 0] : [1, 0, 0];

  let ux = reference[1] * nz - reference[2] * ny;
  let uy = reference[2] * nx - reference[0] * nz;
  let uz = reference[0] * ny - reference[1] * nx;

  const uLength = Math.hypot(ux, uy, uz);
  ux /= uLength;
  uy /= uLength;
  uz /= uLength;

  const vx = ny * uz - nz * uy;
  const vy = nz * ux - nx * uz;
  const vz = nx * uy - ny * ux;

  return {
    u: [ux, uy, uz],
    v: [vx, vy, vz],
  };
}

function projectPointTo2D(
  point: SpherePoint,
  u: SpherePoint,
  v: SpherePoint,
): readonly [number, number] {
  const [x, y, z] = point;
  return [x * u[0] + y * u[1] + z * u[2], x * v[0] + y * v[1] + z * v[2]];
}

function signedArea2D(flat: readonly number[]): number {
  let area = 0;
  const vertexCount = flat.length / 2;

  for (let index = 0; index < vertexCount; index += 1) {
    const next = (index + 1) % vertexCount;
    area += flat[index * 2]! * flat[next * 2 + 1]!;
    area -= flat[next * 2]! * flat[index * 2 + 1]!;
  }

  return area / 2;
}

function reverseRing2D(ring: Ring2D): Ring2D {
  const reversedFlat: number[] = [];
  const reversedPoints = [...ring.points3d].reverse();

  for (let index = reversedPoints.length - 1; index >= 0; index -= 1) {
    const sourceIndex = index * 2;
    reversedFlat.push(ring.flat[sourceIndex]!, ring.flat[sourceIndex + 1]!);
  }

  return {
    flat: reversedFlat,
    points3d: reversedPoints,
  };
}

/** Max straight chord length before bisecting (≈2° arc on the unit sphere). */
const MAX_RING_EDGE_LENGTH = 0.035;

/** Max pane edge length after fan triangulation (≈2.9° arc). */
const MAX_PANE_EDGE_LENGTH = 0.05;

/** Subdivide ring edges on the sphere — shared by country fill and border paths. */
export function subdivideRingOnSphere(
  ring: readonly SpherePoint[],
  radius: number,
  maxEdgeLength: number = MAX_RING_EDGE_LENGTH,
): SpherePoint[] {
  return subdivideRingEdges(ring, radius, maxEdgeLength).map((point) =>
    normalizePoint(point, radius),
  );
}

function subdivideRingEdges(
  ring: readonly SpherePoint[],
  radius: number,
  maxEdgeLength: number = MAX_RING_EDGE_LENGTH,
): SpherePoint[] {
  let points = [...openRingVertices(ring)];

  if (points.length < 3) {
    return points;
  }

  let subdivided = true;

  while (subdivided) {
    subdivided = false;
    const next: SpherePoint[] = [];

    for (let index = 0; index < points.length; index += 1) {
      const current = points[index]!;
      const following = points[(index + 1) % points.length]!;
      next.push(current);

      const edgeLength = Math.hypot(
        current[0] - following[0],
        current[1] - following[1],
        current[2] - following[2],
      );

      if (edgeLength > maxEdgeLength) {
        next.push(
          normalizePoint(
            [current[0] + following[0], current[1] + following[1], current[2] + following[2]],
            radius,
          ),
        );
        subdivided = true;
      }
    }

    points = next;
  }

  return points;
}

function ringTo2D(
  ring: readonly SpherePoint[],
  radius: number,
  u: SpherePoint,
  v: SpherePoint,
): Ring2D {
  const points3d = subdivideRingEdges(ring, radius).map((point) => normalizePoint(point, radius));
  const flat: number[] = [];

  for (const point of points3d) {
    const [px, py] = projectPointTo2D(point, u, v);
    flat.push(px, py);
  }

  return { flat, points3d };
}

function orientRingsForEarcut(outer: Ring2D, holes: Ring2D[]): { outer: Ring2D; holes: Ring2D[] } {
  let orientedOuter = outer;
  if (signedArea2D(outer.flat) < 0) {
    orientedOuter = reverseRing2D(outer);
  }

  const orientedHoles = holes.map((hole) => {
    if (signedArea2D(hole.flat) > 0) {
      return reverseRing2D(hole);
    }
    return hole;
  });

  return { outer: orientedOuter, holes: orientedHoles };
}

export type SphereTriangulation = {
  positions: number[];
  indices: number[];
  vertexCount: number;
};

function edgeLength(positions: number[], a: number, b: number): number {
  const ax = positions[a * 3]!;
  const ay = positions[a * 3 + 1]!;
  const az = positions[a * 3 + 2]!;
  const bx = positions[b * 3]!;
  const by = positions[b * 3 + 1]!;
  const bz = positions[b * 3 + 2]!;

  return Math.hypot(ax - bx, ay - by, az - bz);
}

/** Split long pane edges until every triangle edge hugs the sphere surface. */
function subdivideSphereMesh(
  positions: number[],
  indices: number[],
  radius: number,
  maxEdgeLength: number = MAX_PANE_EDGE_LENGTH,
): { positions: number[]; indices: number[] } {
  let nextPositions = positions;
  let nextIndices = indices;

  let subdivided = true;

  while (subdivided) {
    subdivided = false;
    const outputPositions = [...nextPositions];
    const outputIndices: number[] = [];
    let vertexCount = outputPositions.length / 3;

    for (let index = 0; index < nextIndices.length; index += 3) {
      const a = nextIndices[index]!;
      const b = nextIndices[index + 1]!;
      const c = nextIndices[index + 2]!;

      const edges: [number, number, number][] = [
        [a, b, edgeLength(outputPositions, a, b)],
        [b, c, edgeLength(outputPositions, b, c)],
        [c, a, edgeLength(outputPositions, c, a)],
      ];

      edges.sort((left, right) => right[2] - left[2]);
      const [ea, eb, longest] = edges[0]!;

      if (longest <= maxEdgeLength) {
        outputIndices.push(a, b, c);
        continue;
      }

      subdivided = true;

      const mid = sphereMidpoint(
        [outputPositions[ea * 3]!, outputPositions[ea * 3 + 1]!, outputPositions[ea * 3 + 2]!],
        [outputPositions[eb * 3]!, outputPositions[eb * 3 + 1]!, outputPositions[eb * 3 + 2]!],
        radius,
      );

      outputPositions.push(mid[0], mid[1], mid[2]);
      const midIndex = vertexCount;
      vertexCount += 1;

      const third = [a, b, c].find((vertex) => vertex !== ea && vertex !== eb)!;
      outputIndices.push(ea, midIndex, third, midIndex, eb, third);
    }

    nextPositions = outputPositions;
    nextIndices = outputIndices;
  }

  return { positions: nextPositions, indices: nextIndices };
}

function sphereMidpoint(a: SpherePoint, b: SpherePoint, radius: number): SpherePoint {
  return normalizePoint([a[0] + b[0], a[1] + b[1], a[2] + b[2]], radius);
}

const EMPTY_TRIANGULATION: SphereTriangulation = {
  positions: [],
  indices: [],
  vertexCount: 0,
};

/**
 * Simple spherical panes — fan from a centroid vertex to each boundary edge.
 * Avoids long Earcut diagonals that caused dark holes on large countries.
 */
export function triangulateSphereFan(
  outerRing: readonly SpherePoint[],
  radius: number,
): SphereTriangulation {
  const boundary = subdivideRingOnSphere(outerRing, radius);

  if (boundary.length < 3) {
    return EMPTY_TRIANGULATION;
  }

  const first = boundary[0]!;
  let maxSpan = 0;

  for (const point of boundary) {
    maxSpan = Math.max(
      maxSpan,
      Math.hypot(point[0] - first[0], point[1] - first[1], point[2] - first[2]),
    );
  }

  if (maxSpan < 1e-6) {
    return EMPTY_TRIANGULATION;
  }

  const [nx, ny, nz] = ringCentroidNormal(boundary);
  const center: SpherePoint = [nx * radius, ny * radius, nz * radius];

  const positions: number[] = [center[0], center[1], center[2]];

  for (const point of boundary) {
    positions.push(point[0], point[1], point[2]);
  }

  const indices: number[] = [];
  const boundaryCount = boundary.length;

  for (let index = 0; index < boundaryCount; index += 1) {
    const next = (index + 1) % boundaryCount;
    indices.push(0, 1 + index, 1 + next);
  }

  const subdivided = subdivideSphereMesh(positions, indices, radius);

  return {
    positions: subdivided.positions,
    indices: subdivided.indices,
    vertexCount: subdivided.positions.length / 3,
  };
}

/** Planar Earcut on a local tangent projection — respects concave borders. */
function triangulateSpherePolygonEarcut(
  rings: readonly (readonly SpherePoint[])[],
  radius: number,
): SphereTriangulation {
  if (rings.length === 0 || !rings[0] || openRingVertices(rings[0]).length < 3) {
    return EMPTY_TRIANGULATION;
  }

  const outerRing = openRingVertices(rings[0]!);
  const normal = ringCentroidNormal(outerRing);
  const { u, v } = createTangentBasis(normal);

  const outer = ringTo2D(rings[0]!, radius, u, v);
  const holes = rings.slice(1).map((ring) => ringTo2D(ring, radius, u, v));
  const oriented = orientRingsForEarcut(outer, holes);

  const flat2d: number[] = [...oriented.outer.flat];
  const positions: number[] = [];
  const holeIndices: number[] = [];
  let vertexCount = 0;

  for (const point of oriented.outer.points3d) {
    positions.push(point[0], point[1], point[2]);
  }
  vertexCount += oriented.outer.points3d.length;

  for (const hole of oriented.holes) {
    if (hole.points3d.length < 3) {
      continue;
    }

    holeIndices.push(vertexCount);
    flat2d.push(...hole.flat);

    for (const point of hole.points3d) {
      positions.push(point[0], point[1], point[2]);
    }

    vertexCount += hole.points3d.length;
  }

  if (oriented.outer.points3d.length < 3) {
    return EMPTY_TRIANGULATION;
  }

  const indices = Earcut.triangulate(flat2d, holeIndices, 2);

  return {
    positions,
    indices,
    vertexCount,
  };
}

/**
 * Triangulate a sphere polygon (outer ring + optional holes).
 * Earcut preserves concave shapes; mesh subdivision removes long diagonal artifacts.
 */
export function triangulateSpherePolygon(
  rings: readonly (readonly SpherePoint[])[],
  radius: number,
): SphereTriangulation {
  if (rings.length === 0 || !rings[0] || openRingVertices(rings[0]).length < 3) {
    return EMPTY_TRIANGULATION;
  }

  const earcut = triangulateSpherePolygonEarcut(rings, radius);

  if (earcut.indices.length === 0) {
    return earcut;
  }

  const subdivided = subdivideSphereMesh(earcut.positions, earcut.indices, radius);

  return {
    positions: subdivided.positions,
    indices: subdivided.indices,
    vertexCount: subdivided.positions.length / 3,
  };
}
