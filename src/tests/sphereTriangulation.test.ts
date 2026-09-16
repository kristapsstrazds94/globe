import { BufferGeometry } from "three";
import { describe, expect, it } from "vitest";

import { buildCountryBufferGeometry } from "@/lib/geo/countryGeometry";
import {
  DEFAULT_SPHERE_RADIUS,
  lonLatPositionToSpherePoint,
  spherePointLengthSquared,
} from "@/lib/geo/coordinates";
import { processedGeometryToSpherePolygons } from "@/lib/geo/geometry";
import {
  openRingVertices,
  triangulateSpherePolygon,
} from "@/lib/geo/sphereTriangulation";

const R = DEFAULT_SPHERE_RADIUS;
const COUNTRY_R = R * 1.002;

function expectOnSphere(
  x: number,
  y: number,
  z: number,
  radius: number,
  tolerance = 1e-5,
): void {
  expect(Math.abs(spherePointLengthSquared([x, y, z]) - radius * radius)).toBeLessThanOrEqual(
    tolerance,
  );
}

describe("openRingVertices", () => {
  it("removes a closing duplicate vertex", () => {
    const ring = [
      lonLatPositionToSpherePoint([0, 0], R),
      lonLatPositionToSpherePoint([1, 0], R),
      lonLatPositionToSpherePoint([1, 1], R),
      lonLatPositionToSpherePoint([0, 0], R),
    ] as const;

    expect(openRingVertices(ring)).toHaveLength(3);
  });
});

describe("triangulateSpherePolygon", () => {
  it("triangulates a simple quadrilateral on the sphere", () => {
    const rings = processedGeometryToSpherePolygons(
      {
        type: "Polygon",
        coordinates: [
          [
            [0, 0],
            [2, 0],
            [2, 2],
            [0, 2],
            [0, 0],
          ],
        ],
      },
      COUNTRY_R,
    );

    const result = triangulateSpherePolygon(rings[0]!, COUNTRY_R);

    expect(result.vertexCount).toBe(4);
    expect(result.indices.length).toBeGreaterThanOrEqual(6);

    for (let index = 0; index < result.positions.length; index += 3) {
      expectOnSphere(
        result.positions[index]!,
        result.positions[index + 1]!,
        result.positions[index + 2]!,
        COUNTRY_R,
      );
    }
  });

  it("returns empty triangulation for degenerate rings", () => {
    const result = triangulateSpherePolygon(
      [[lonLatPositionToSpherePoint([0, 0], R)]],
      COUNTRY_R,
    );

    expect(result.indices).toHaveLength(0);
  });
});

describe("buildCountryBufferGeometry", () => {
  it("builds geometry for Polygon and MultiPolygon features", () => {
    const polygon = buildCountryBufferGeometry(
      {
        type: "Polygon",
        coordinates: [
          [
            [10, 10],
            [12, 10],
            [12, 12],
            [10, 12],
            [10, 10],
          ],
        ],
      },
      COUNTRY_R,
    );

    expect(polygon).toBeInstanceOf(BufferGeometry);
    expect(polygon!.getIndex()?.count).toBeGreaterThan(0);

    const multi = buildCountryBufferGeometry(
      {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [0, 0],
              [1, 0],
              [1, 1],
              [0, 1],
              [0, 0],
            ],
          ],
          [
            [
              [5, 5],
              [6, 5],
              [6, 6],
              [5, 6],
              [5, 5],
            ],
          ],
        ],
      },
      COUNTRY_R,
    );

    expect(multi).toBeInstanceOf(BufferGeometry);
    expect(multi!.getIndex()!.count).toBeGreaterThan(polygon!.getIndex()!.count);

    polygon!.dispose();
    multi!.dispose();
  });

  it("returns null for empty geometry", () => {
    expect(
      buildCountryBufferGeometry(
        {
          type: "Polygon",
          coordinates: [[[0, 0], [0, 0], [0, 0], [0, 0]]],
        },
        COUNTRY_R,
      ),
    ).toBeNull();
  });
});
