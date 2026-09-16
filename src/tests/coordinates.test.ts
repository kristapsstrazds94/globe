import { SphereGeometry } from "three";
import { describe, expect, it } from "vitest";

import {
  DEFAULT_SPHERE_RADIUS,
  lonLatPositionToSpherePoint,
  lonLatToSpherePoint,
  normalizeLongitude,
  spherePointLengthSquared,
} from "@/lib/geo/coordinates";
import { getSphereRingWinding, processedGeometryToSpherePolygons } from "@/lib/geo/geometry";

const R = DEFAULT_SPHERE_RADIUS;
const EPS = 1e-10;

function expectClose(actual: number, expected: number, tolerance = EPS): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

function expectSpherePoint(
  point: readonly [number, number, number],
  expected: readonly [number, number, number],
  tolerance = EPS,
): void {
  expectClose(point[0], expected[0], tolerance);
  expectClose(point[1], expected[1], tolerance);
  expectClose(point[2], expected[2], tolerance);
}

function expectOnSphere(
  point: readonly [number, number, number],
  radius: number,
  tolerance = EPS,
): void {
  expectClose(spherePointLengthSquared(point), radius * radius, tolerance);
}

describe("lonLatToSpherePoint", () => {
  it("places the north pole at +Y", () => {
    expectSpherePoint(lonLatToSpherePoint(0, 90, R), [0, R, 0]);
    expectSpherePoint(lonLatToSpherePoint(120, 90, R), [0, R, 0]);
  });

  it("places the south pole at -Y", () => {
    expectSpherePoint(lonLatToSpherePoint(0, -90, R), [0, -R, 0]);
    expectSpherePoint(lonLatToSpherePoint(-45, -90, R), [0, -R, 0]);
  });

  it("maps equator cardinal meridians correctly", () => {
    expectSpherePoint(lonLatToSpherePoint(0, 0, R), [R, 0, 0]);
    expectSpherePoint(lonLatToSpherePoint(90, 0, R), [0, 0, R]);
    expectSpherePoint(lonLatToSpherePoint(180, 0, R), [-R, 0, 0]);
    expectSpherePoint(lonLatToSpherePoint(-90, 0, R), [0, 0, -R]);
  });

  it("handles antimeridian longitudes consistently", () => {
    const east = lonLatToSpherePoint(179, 10, R);
    const west = lonLatToSpherePoint(-179, 10, R);
    const plus180 = lonLatToSpherePoint(180, 10, R);
    const minus180 = lonLatToSpherePoint(-180, 10, R);

    expectOnSphere(east, R);
    expectOnSphere(west, R);
    expectSpherePoint(plus180, minus180);
    expectSpherePoint(east, west, 0.05);
  });

  it("normalizes longitude to [-180, 180]", () => {
    expect(normalizeLongitude(540)).toBe(180);
    expect(normalizeLongitude(-540)).toBe(180);
    expect(normalizeLongitude(181)).toBe(-179);
  });

  it("scales with custom radius", () => {
    const radius = 2.5;
    const point = lonLatToSpherePoint(0, 0, radius);
    expectSpherePoint(point, [radius, 0, 0]);
    expectOnSphere(point, radius);
  });

  it("aligns with Three.js SphereGeometry at sampled vertices", () => {
    const radius = 1.25;
    const geometry = new SphereGeometry(radius, 32, 16);
    const positionAttribute = geometry.getAttribute("position");
    expect(positionAttribute).toBeDefined();
    const positions = positionAttribute.array;

    const widthSegments = 32;
    const heightSegments = 16;

    const sample = (ix: number, iy: number) => {
      const index = (iy * (widthSegments + 1) + ix) * 3;
      return [positions[index]!, positions[index + 1]!, positions[index + 2]!] as const;
    };

    const north = sample(0, 0);
    expectSpherePoint(north, lonLatToSpherePoint(0, 90, radius), 1e-5);

    const south = sample(0, heightSegments);
    expectSpherePoint(south, lonLatToSpherePoint(0, -90, radius), 1e-5);

    const primeMeridian = sample(widthSegments / 2, heightSegments / 2);
    expectSpherePoint(primeMeridian, lonLatToSpherePoint(0, 0, radius), 1e-4);

    geometry.dispose();
  });
});

describe("processedGeometryToSpherePolygons", () => {
  it("converts polygon and multipolygon coordinates onto the sphere", () => {
    const polygon = processedGeometryToSpherePolygons({
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    });

    expect(polygon).toHaveLength(1);
    expect(polygon[0]).toHaveLength(1);
    expect(polygon[0]![0]).toHaveLength(5);

    for (const ring of polygon[0]!) {
      for (const point of ring) {
        expectOnSphere(point, R);
      }
    }

    const multi = processedGeometryToSpherePolygons({
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [10, 10],
            [11, 10],
            [11, 11],
            [10, 11],
            [10, 10],
          ],
        ],
        [
          [
            [170, 5],
            [175, 5],
            [175, 8],
            [170, 8],
            [170, 5],
          ],
        ],
      ],
    });

    expect(multi).toHaveLength(2);
    expect(multi[0]![0]![0]).toEqual(lonLatPositionToSpherePoint([10, 10], R));
  });

  it("preserves consistent ring orientation when vertex order is reversed", () => {
    const [polygon] = processedGeometryToSpherePolygons({
      type: "Polygon",
      coordinates: [
        [
          [10, 10],
          [20, 10],
          [20, 20],
          [10, 20],
          [10, 10],
        ],
      ],
    });

    const exterior = polygon![0]!;
    const reversed = [...exterior].reverse();

    const winding = getSphereRingWinding(exterior);
    const reversedWinding = getSphereRingWinding(reversed);

    expect(Math.abs(winding)).toBeGreaterThan(1e-4);
    expect(Math.sign(winding)).toBe(-Math.sign(reversedWinding));
  });
});
