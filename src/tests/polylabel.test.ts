import { describe, expect, it } from "vitest";

import { computeGeometryCentroid, isPointInOuterRing } from "@/lib/geo/centroid";
import { polylabel } from "@/lib/geo/polylabel";
import { geographyBundle } from "@/data/geography";

describe("polylabel", () => {
  it("places Norway's marker on the mainland, away from the Swedish border", () => {
    const norway = geographyBundle.features.find((feature) => feature.id === "NOR");
    expect(norway).toBeDefined();
    expect(norway!.geometry.type).toBe("MultiPolygon");

    const mainPolygon =
      norway!.geometry.type === "MultiPolygon" ? norway!.geometry.coordinates[0]! : null;
    expect(mainPolygon).not.toBeNull();
    const outer = mainPolygon![0]!;
    const centroid = computeGeometryCentroid(norway!.geometry);

    expect(centroid).not.toBeNull();
    expect(centroid!.lng).toBeLessThan(12);
    expect(centroid!.lng).toBeGreaterThan(7);
    expect(centroid!.lat).toBeGreaterThan(58);
    expect(centroid!.lat).toBeLessThan(66);
    expect(isPointInOuterRing(centroid!.lng, centroid!.lat, outer)).toBe(true);
    expect(polylabel(mainPolygon!, 0.01)).toEqual(centroid);
  });

  it("returns a point inside a concave C-shaped polygon", () => {
    const ring = [
      [0, 0],
      [10, 0],
      [10, 2],
      [2, 2],
      [2, 8],
      [10, 8],
      [10, 10],
      [0, 10],
      [0, 0],
    ] as const;

    const point = polylabel([ring], 0.01);
    expect(point).not.toBeNull();
    expect(isPointInOuterRing(point!.lng, point!.lat, ring)).toBe(true);
    expect(point!.lng).toBeLessThan(2);
    expect(point!.lat).toBeGreaterThan(0);
    expect(point!.lat).toBeLessThan(10);
  });
});
