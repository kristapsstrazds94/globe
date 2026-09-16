import { describe, expect, it } from "vitest";

import {
  appendCountryBorderSegments,
  buildMergedCountryBordersBufferGeometry,
} from "@/lib/geo/countryBorderGeometry";
import { DEFAULT_SPHERE_RADIUS, spherePointLengthSquared } from "@/lib/geo/coordinates";
import type { ProcessedGeometry } from "@/types/geography";

const BORDER_R = DEFAULT_SPHERE_RADIUS * 1.005;

function expectOnSphere(x: number, y: number, z: number, radius: number, tolerance = 1e-5): void {
  expect(Math.abs(spherePointLengthSquared([x, y, z]) - radius * radius)).toBeLessThanOrEqual(
    tolerance,
  );
}

const squarePolygon: ProcessedGeometry = {
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
};

describe("appendCountryBorderSegments", () => {
  it("emits closed outer-ring segments for a polygon", () => {
    const positions: number[] = [];
    appendCountryBorderSegments(squarePolygon, BORDER_R, positions);

    expect(positions.length).toBeGreaterThan(4 * 2 * 3);

    for (let index = 0; index < positions.length; index += 3) {
      expectOnSphere(positions[index]!, positions[index + 1]!, positions[index + 2]!, BORDER_R);
    }
  });

  it("skips interior rings (holes)", () => {
    const polygonWithHole: ProcessedGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [4, 0],
          [4, 4],
          [0, 4],
          [0, 0],
        ],
        [
          [1, 1],
          [3, 1],
          [3, 3],
          [1, 3],
          [1, 1],
        ],
      ],
    };

    const outerOnly: number[] = [];
    const withHole: number[] = [];

    appendCountryBorderSegments(
      { type: "Polygon", coordinates: [polygonWithHole.coordinates[0]!] },
      BORDER_R,
      outerOnly,
    );
    appendCountryBorderSegments(polygonWithHole, BORDER_R, withHole);

    expect(withHole).toEqual(outerOnly);
    expect(withHole.length).toBeGreaterThan(4 * 2 * 3);
  });
});

describe("buildMergedCountryBordersBufferGeometry", () => {
  it("merges multiple countries into one geometry", () => {
    const multiPolygon: ProcessedGeometry = {
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
            [3, 0],
            [4, 0],
            [4, 1],
            [3, 1],
            [3, 0],
          ],
        ],
      ],
    };

    const geometry = buildMergedCountryBordersBufferGeometry(
      [squarePolygon, multiPolygon],
      BORDER_R,
    );

    expect(geometry).not.toBeNull();

    const positions = geometry!.getAttribute("position").array as Float32Array;
    expect(positions.length).toBeGreaterThan(0);

    for (let index = 0; index < positions.length; index += 3) {
      expectOnSphere(positions[index]!, positions[index + 1]!, positions[index + 2]!, BORDER_R);
    }

    geometry!.dispose();
  });

  it("deduplicates shared border segments between countries", () => {
    const sharedEdgeA: ProcessedGeometry = {
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
    };
    const sharedEdgeB: ProcessedGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [2, 0],
          [4, 0],
          [4, 2],
          [2, 2],
          [2, 0],
        ],
      ],
    };

    const withDedup = buildMergedCountryBordersBufferGeometry([sharedEdgeA, sharedEdgeB], BORDER_R);
    const withoutDedup: number[] = [];

    appendCountryBorderSegments(sharedEdgeA, BORDER_R, withoutDedup);
    appendCountryBorderSegments(sharedEdgeB, BORDER_R, withoutDedup);

    expect(withDedup!.getAttribute("position").count).toBeLessThan(withoutDedup.length / 3);

    withDedup!.dispose();
  });

  it("returns null when no border segments are produced", () => {
    const empty: ProcessedGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [0, 0],
        ],
      ],
    };

    expect(buildMergedCountryBordersBufferGeometry([empty], BORDER_R)).toBeNull();
  });
});
