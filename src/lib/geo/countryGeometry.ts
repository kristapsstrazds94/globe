import { BufferGeometry, Float32BufferAttribute, Uint32BufferAttribute } from "three";

import type { ProcessedGeometry } from "@/types/geography";

import { processedGeometryToSpherePolygons } from "./geometry";
import { triangulateSpherePolygon } from "./sphereTriangulation";

/** Append without spread — large meshes exceed the JS argument limit. */
function appendNumbers(target: number[], source: readonly number[]): void {
  for (let index = 0; index < source.length; index += 1) {
    target.push(source[index]!);
  }
}

/** Flip triangles whose face normal points toward the sphere interior. */
function ensureOutwardFacingIndices(positions: number[], indices: number[]): void {
  for (let index = 0; index < indices.length; index += 3) {
    const ia = indices[index]! * 3;
    const ib = indices[index + 1]! * 3;
    const ic = indices[index + 2]! * 3;

    const ax = positions[ia]!;
    const ay = positions[ia + 1]!;
    const az = positions[ia + 2]!;
    const bx = positions[ib]!;
    const by = positions[ib + 1]!;
    const bz = positions[ib + 2]!;
    const cx = positions[ic]!;
    const cy = positions[ic + 1]!;
    const cz = positions[ic + 2]!;

    const abx = bx - ax;
    const aby = by - ay;
    const abz = bz - az;
    const acx = cx - ax;
    const acy = cy - ay;
    const acz = cz - az;

    const nx = aby * acz - abz * acy;
    const ny = abz * acx - abx * acz;
    const nz = abx * acy - aby * acx;

    const mx = (ax + bx + cx) / 3;
    const my = (ay + by + cy) / 3;
    const mz = (az + bz + cz) / 3;

    if (nx * mx + ny * my + nz * mz < 0) {
      const tmp = indices[index + 1]!;
      indices[index + 1] = indices[index + 2]!;
      indices[index + 2] = tmp;
    }
  }
}

/** Build a single BufferGeometry for one country (Polygon or MultiPolygon). */
export function buildCountryBufferGeometry(
  geometry: ProcessedGeometry,
  radius: number,
): BufferGeometry | null {
  const polygons = processedGeometryToSpherePolygons(geometry, radius);
  const positions: number[] = [];
  const indices: number[] = [];
  let vertexBase = 0;

  for (const rings of polygons) {
    const triangulation = triangulateSpherePolygon(rings, radius);

    if (triangulation.indices.length === 0) {
      continue;
    }

    appendNumbers(positions, triangulation.positions);

    for (const index of triangulation.indices) {
      indices.push(index + vertexBase);
    }

    vertexBase += triangulation.vertexCount;
  }

  if (indices.length === 0) {
    return null;
  }

  ensureOutwardFacingIndices(positions, indices);

  const bufferGeometry = new BufferGeometry();
  bufferGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  bufferGeometry.setIndex(new Uint32BufferAttribute(indices, 1));
  bufferGeometry.computeVertexNormals();

  return bufferGeometry;
}
