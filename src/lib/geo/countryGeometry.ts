import {
  BufferGeometry,
  Float32BufferAttribute,
  Uint32BufferAttribute,
} from "three";

import type { ProcessedGeometry } from "@/types/geography";

import { processedGeometryToSpherePolygons } from "./geometry";
import { triangulateSpherePolygon } from "./sphereTriangulation";

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

    positions.push(...triangulation.positions);

    for (const index of triangulation.indices) {
      indices.push(index + vertexBase);
    }

    vertexBase += triangulation.vertexCount;
  }

  if (indices.length === 0) {
    return null;
  }

  const bufferGeometry = new BufferGeometry();
  bufferGeometry.setAttribute(
    "position",
    new Float32BufferAttribute(positions, 3),
  );
  bufferGeometry.setIndex(new Uint32BufferAttribute(indices, 1));
  bufferGeometry.computeVertexNormals();

  return bufferGeometry;
}
