import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import {
  COUNTRY_BORDER_RADIUS,
  COUNTRY_LAYER_RADIUS,
  EARTH_GEOMETRY,
} from "@/components/globe/earthConfig";
import { validateGeographyBundle } from "@/lib/geo/validateGeographyBundle";
import { computeGlobeGeometryStats } from "@/lib/performance/globeGeometryStats";

describe("computeGlobeGeometryStats", () => {
  it("summarizes country fill and border geometry from the runtime bundle", () => {
    const bundlePath = path.join(
      process.cwd(),
      "public/generated/geography/countries.json",
    );
    const parsed: unknown = JSON.parse(readFileSync(bundlePath, "utf8"));
    const validation = validateGeographyBundle(parsed);

    expect(validation.ok).toBe(true);
    if (!validation.ok) {
      return;
    }

    const stats = computeGlobeGeometryStats(
      validation.bundle,
      {
        countryFill: COUNTRY_LAYER_RADIUS,
        countryBorder: COUNTRY_BORDER_RADIUS,
      },
      {
        widthSegments: EARTH_GEOMETRY.widthSegments,
        heightSegments: EARTH_GEOMETRY.heightSegments,
      },
    );

    expect(stats.countryCount).toBeGreaterThan(100);
    expect(stats.countryFillMeshes).toBe(stats.countryCount);
    expect(stats.countryFillVertices).toBeGreaterThan(0);
    expect(stats.countryFillTriangles).toBeGreaterThan(0);
    expect(stats.borderLineSegments).toBeGreaterThan(0);
    expect(stats.earthVertices).toBe(
      (EARTH_GEOMETRY.widthSegments + 1) * (EARTH_GEOMETRY.heightSegments + 1),
    );
    expect(stats.estimatedStaticDrawCalls.minimumTotal).toBeGreaterThan(stats.countryCount);
  });
});
