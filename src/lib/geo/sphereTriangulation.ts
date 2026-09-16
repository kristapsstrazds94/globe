import { Earcut } from "three/src/extras/Earcut.js";

import type { SpherePoint } from "./coordinates";

type Ring2D = {
  flat: number[];
  points3d: SpherePoint[];
};

/** Drop GeoJSON closing duplicate when the ring repeats its first vertex. */
export function openRingVertices(
  ring: readonly SpherePoint[],
): readonly SpherePoint[] {
  if (ring.length < 4) {
    return ring;
  }

  const first = ring[0]!;
  const last = ring[ring.length - 1]!;

  if (
    first[0] === last[0] &&
    first[1] === last[1] &&
    first[2] === last[2]
  ) {
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
  const reference: SpherePoint =
    Math.abs(ny) < 0.9 ? [0, 1, 0] : [1, 0, 0];

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
  return [
    x * u[0] + y * u[1] + z * u[2],
    x * v[0] + y * v[1] + z * v[2],
  ];
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

function ringTo2D(
  ring: readonly SpherePoint[],
  radius: number,
  u: SpherePoint,
  v: SpherePoint,
): Ring2D {
  const points3d = openRingVertices(ring).map((point) =>
    normalizePoint(point, radius),
  );
  const flat: number[] = [];

  for (const point of points3d) {
    const [px, py] = projectPointTo2D(point, u, v);
    flat.push(px, py);
  }

  return { flat, points3d };
}

function orientRingsForEarcut(
  outer: Ring2D,
  holes: Ring2D[],
): { outer: Ring2D; holes: Ring2D[] } {
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

/**
 * Triangulate a sphere polygon (outer ring + optional holes) using a local
 * tangent-plane projection and Three.js Earcut.
 */
export function triangulateSpherePolygon(
  rings: readonly (readonly SpherePoint[])[],
  radius: number,
): SphereTriangulation {
  const empty: SphereTriangulation = {
    positions: [],
    indices: [],
    vertexCount: 0,
  };

  if (rings.length === 0 || !rings[0] || openRingVertices(rings[0]).length < 3) {
    return empty;
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
    return empty;
  }

  const indices = Earcut.triangulate(flat2d, holeIndices, 2);

  return {
    positions,
    indices,
    vertexCount,
  };
}
