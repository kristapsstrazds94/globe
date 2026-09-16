import { describe, expect, it } from "vitest";

import { computeGeometryCentroid, sphereUnitToLonLat } from "@/lib/geo/centroid";
import { lonLatToSpherePoint, normalizeLongitude } from "@/lib/geo/coordinates";
import type { ProcessedGeometry } from "@/types/geography";

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

  it("handles MultiPolygon countries by averaging outer rings", () => {
    const geometry: ProcessedGeometry = {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [170, 10],
            [175, 10],
            [175, 15],
            [170, 15],
            [170, 10],
          ],
        ],
        [
          [
            [-175, -10],
            [-170, -10],
            [-170, -5],
            [-175, -5],
            [-175, -10],
          ],
        ],
      ],
    };

    const centroid = computeGeometryCentroid(geometry);
    expect(centroid).not.toBeNull();
    expect(Math.abs(centroid!.lng)).toBeLessThan(180);
    expect(Number.isFinite(centroid!.lat)).toBe(true);
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
