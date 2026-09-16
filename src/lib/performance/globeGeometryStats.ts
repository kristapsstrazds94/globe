import { buildMergedCountryBordersBufferGeometry } from "@/lib/geo/countryBorderGeometry";
import { buildCountryBufferGeometry } from "@/lib/geo/countryGeometry";
import type { ProcessedGeographyBundle } from "@/types/geography";

export type GlobeLayerRadii = {
  countryFill: number;
  countryBorder: number;
};

export type SphereMeshSegments = {
  widthSegments: number;
  heightSegments: number;
};

export type GlobeGeometryStats = {
  countryCount: number;
  countryFillMeshes: number;
  countryFillVertices: number;
  countryFillTriangles: number;
  borderVertices: number;
  borderLineSegments: number;
  earthVertices: number;
  earthTriangles: number;
  estimatedStaticDrawCalls: {
    earth: number;
    countryFill: number;
    borders: number;
    atmosphere: number;
    stars: number;
    minimumTotal: number;
  };
};

function countSphereMesh(segments: SphereMeshSegments): { vertices: number; triangles: number } {
  const vertices = (segments.widthSegments + 1) * (segments.heightSegments + 1);
  const triangles = segments.widthSegments * segments.heightSegments * 2;

  return { vertices, triangles };
}

function countBufferGeometry(geometry: ReturnType<typeof buildCountryBufferGeometry>): {
  vertices: number;
  triangles: number;
} {
  if (geometry === null) {
    return { vertices: 0, triangles: 0 };
  }

  const position = geometry.getAttribute("position");
  const index = geometry.getIndex();
  const vertices = position?.count ?? 0;
  const triangles = index ? index.count / 3 : 0;

  return { vertices, triangles };
}

/** Summarize GPU geometry derived from the runtime geography bundle. */
export function computeGlobeGeometryStats(
  bundle: ProcessedGeographyBundle,
  radii: GlobeLayerRadii,
  earthSegments: SphereMeshSegments,
): GlobeGeometryStats {
  let countryFillVertices = 0;
  let countryFillTriangles = 0;
  let countryFillMeshes = 0;

  for (const feature of bundle.features) {
    const geometry = buildCountryBufferGeometry(feature.geometry, radii.countryFill);

    if (geometry === null) {
      continue;
    }

    const counts = countBufferGeometry(geometry);
    countryFillVertices += counts.vertices;
    countryFillTriangles += counts.triangles;
    countryFillMeshes += 1;
    geometry.dispose();
  }

  const borderGeometry = buildMergedCountryBordersBufferGeometry(
    bundle.features.map((feature) => feature.geometry),
    radii.countryBorder,
  );

  const borderVertices = borderGeometry?.getAttribute("position")?.count ?? 0;
  const borderLineSegments = borderVertices / 2;
  const hasBorderGeometry = borderGeometry !== null;
  borderGeometry?.dispose();

  const earth = countSphereMesh(earthSegments);

  const estimatedStaticDrawCalls = {
    earth: 1,
    countryFill: countryFillMeshes,
    borders: hasBorderGeometry ? 1 : 0,
    atmosphere: 1,
    stars: 1,
    minimumTotal: 0,
  };

  estimatedStaticDrawCalls.minimumTotal =
    estimatedStaticDrawCalls.earth +
    estimatedStaticDrawCalls.countryFill +
    estimatedStaticDrawCalls.borders +
    estimatedStaticDrawCalls.atmosphere +
    estimatedStaticDrawCalls.stars;

  return {
    countryCount: bundle.features.length,
    countryFillMeshes,
    countryFillVertices,
    countryFillTriangles,
    borderVertices,
    borderLineSegments,
    earthVertices: earth.vertices,
    earthTriangles: earth.triangles,
    estimatedStaticDrawCalls,
  };
}
