import { describe, expect, it } from "vitest";

import {
  computeGeometryCentroid,
  isPointInOuterRing,
  planarRingArea,
  planarRingCentroid,
  sphereUnitToLonLat,
  unwrapRingLongitudes,
} from "@/lib/geo/centroid";
import { lonLatToSpherePoint, normalizeLongitude } from "@/lib/geo/coordinates";
import type { LonLatRing, ProcessedGeometry } from "@/types/geography";

describe("computeGeometryCentroid", () => {
  it("returns the centroid direction for a degenerate single-point polygon", () => {
    const geometry: ProcessedGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [5, 5],
          [5, 5],
        ],
      ],
    };

    const centroid = computeGeometryCentroid(geometry);
    expect(centroid).toEqual({ lng: 5, lat: 5 });
  });

  it("places a small patch centroid in the expected quadrant on the sphere", () => {
    const geometry: ProcessedGeometry = {
      type: "Polygon",
      coordinates: [
        [
          [0, 0],
          [10, 0],
          [10, 10],
          [0, 10],
          [0, 0],
        ],
      ],
    };

    const centroid = computeGeometryCentroid(geometry);
    expect(centroid).not.toBeNull();
    expect(centroid!.lng).toBeGreaterThan(0);
    expect(centroid!.lng).toBeLessThan(10);
    expect(centroid!.lat).toBeGreaterThan(0);
    expect(centroid!.lat).toBeLessThan(10);
  });

  it("uses the largest polygon for MultiPolygon countries", () => {
    const geometry: ProcessedGeometry = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [0, 0],
            [10, 0],
            [10, 10],
            [0, 10],
            [0, 0],
          ],
        ],
        [
          [
            [170, 10],
            [175, 10],
            [175, 15],
            [170, 15],
            [170, 10],
          ],
        ],
      ],
    };

    const centroid = computeGeometryCentroid(geometry);
    expect(centroid).not.toBeNull();
    expect(centroid!.lng).toBeGreaterThan(0);
    expect(centroid!.lng).toBeLessThan(10);
    expect(centroid!.lat).toBeGreaterThan(0);
    expect(centroid!.lat).toBeLessThan(10);
  });

  it("returns null for empty geometry", () => {
    expect(
      computeGeometryCentroid({
        type: "Polygon",
        coordinates: [],
      }),
    ).toBeNull();
  });
});

describe("unwrapRingLongitudes", () => {
  it("unwraps longitudes across the antimeridian", () => {
    const unwrapped = unwrapRingLongitudes([
      [170, 0],
      [175, 0],
      [-175, 0],
      [-170, 0],
      [170, 0],
    ]);

    expect(unwrapped.map(([lng]) => lng)).toEqual([170, 175, 185, 190, 170]);
  });
});

describe("planarRingCentroid", () => {
  it("returns the center of a square patch", () => {
    expect(
      planarRingCentroid([
        [0, 0],
        [10, 0],
        [10, 10],
        [0, 10],
        [0, 0],
      ]),
    ).toEqual({ lng: 5, lat: 5 });
  });
});

describe("isPointInOuterRing", () => {
  it("detects interior and exterior points", () => {
    const ring: LonLatRing = [
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ];

    expect(isPointInOuterRing(5, 5, ring)).toBe(true);
    expect(isPointInOuterRing(15, 5, ring)).toBe(false);
  });
});

describe("planarRingArea", () => {
  it("ranks larger polygons higher", () => {
    const small = planarRingArea([
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
      [0, 0],
    ]);
    const large = planarRingArea([
      [0, 0],
      [10, 0],
      [10, 10],
      [0, 10],
      [0, 0],
    ]);

    expect(large).toBeGreaterThan(small);
  });
});

describe("sphereUnitToLonLat", () => {
  it("round-trips cardinal equator points", () => {
    for (const [lng, lat] of [
      [0, 0],
      [90, 0],
      [180, 0],
      [-90, 0],
    ] as const) {
      const [x, y, z] = lonLatToSpherePoint(lng, lat, 1);
      const roundTrip = sphereUnitToLonLat(x, y, z);
      expect(normalizeLongitude(roundTrip.lng)).toBeCloseTo(normalizeLongitude(lng), 5);
      expect(roundTrip.lat).toBeCloseTo(lat, 5);
    }
  });

  it("places the north pole at latitude 90", () => {
    expect(sphereUnitToLonLat(0, 1, 0)).toEqual({ lng: 0, lat: 90 });
  });
});
