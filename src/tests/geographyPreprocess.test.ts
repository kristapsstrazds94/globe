import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { extractCountryRecord } from "../../scripts/geography/lib/extract";
import { normalizeCountryId, normalizeCountryName } from "../../scripts/geography/lib/normalize";
import { processFeatureCollection } from "../../scripts/geography/lib/process";
import {
  roundPolygonCoordinates,
  roundPosition,
} from "../../scripts/geography/lib/round";
import { simplifyGeometry } from "../../scripts/geography/lib/simplify";
import {
  assertFeatureCollection,
  validateCountryFeature,
} from "../../scripts/geography/lib/validate";
import { writeGeographyBundle } from "../../scripts/geography/lib/write";
import { PREPROCESS_CONFIG } from "../../scripts/geography/preprocess.config";

const fixturePath = path.resolve(
  __dirname,
  "../../scripts/geography/fixtures/minimal.geojson",
);

function loadFixture() {
  const parsed: unknown = JSON.parse(readFileSync(fixturePath, "utf8"));
  return assertFeatureCollection(parsed);
}

describe("geography preprocessing helpers", () => {
  it("normalizes stable three-letter country ids", () => {
    expect(normalizeCountryId(" nor ")).toBe("NOR");
    expect(normalizeCountryId("USA")).toBe("USA");
    expect(normalizeCountryId("-99")).toBeNull();
    expect(normalizeCountryId(null)).toBeNull();
  });

  it("rejects empty display names", () => {
    expect(normalizeCountryName(" Norway ")).toBe("Norway");
    expect(normalizeCountryName("")).toBeNull();
  });

  it("validates supported GeoJSON features", () => {
    const collection = loadFixture();
    const feature = validateCountryFeature(collection.features[0], 0);
    expect(feature.geometry.type).toBe("Polygon");
  });

  it("extracts only required fields with deterministic rounding", () => {
    const collection = loadFixture();
    const alpha = extractCountryRecord(
      validateCountryFeature(collection.features[0], 0),
      PREPROCESS_CONFIG.simplifyToleranceDegrees,
      PREPROCESS_CONFIG.coordinatePrecision,
    );

    expect(alpha).toEqual({
      id: "AAA",
      name: "Alpha",
      geometry: {
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
      },
    });
  });

  it("skips features with invalid ids or names", () => {
    const bundle = processFeatureCollection(loadFixture());
    expect(bundle.features.map((feature) => feature.id)).toEqual(["AAA", "BBB"]);
  });

  it("rounds coordinates to a fixed decimal precision", () => {
    expect(roundPosition([0, 0.0000004], 6)).toEqual([0, 0]);
    expect(roundPosition([1.23456789, -9.87654321], 6)).toEqual([
      1.234568,
      -9.876543,
    ]);
  });

  it("simplifies geometry with a fixed tolerance", () => {
    const geometry = {
      type: "Polygon" as const,
      coordinates: [
        [
          [0, 0],
          [0.0000004, 0],
          [1, 0],
          [1, 1],
          [0, 1],
          [0, 0],
        ],
      ],
    };

    const simplified = simplifyGeometry(geometry, 0.000001);
    expect(simplified.type).toBe("Polygon");

    if (simplified.type !== "Polygon") {
      throw new Error("Expected Polygon geometry.");
    }

    const rounded = roundPolygonCoordinates(simplified.coordinates, 6);

    expect(simplified.coordinates[0]?.length).toBeLessThan(6);
    expect(rounded[0]?.[0]).toEqual([0, 0]);
    expect(rounded[0]?.at(-1)).toEqual([0, 0]);
  });

  it("writes sorted bundles for stable output", async () => {
    const tempRoot = mkdtempSync(path.join(tmpdir(), "globe-geography-"));
    const bundle = processFeatureCollection(loadFixture());

    try {
      const outputPath = await writeGeographyBundle(
        bundle,
        "countries.json",
        tempRoot,
      );

      const written = JSON.parse(readFileSync(outputPath, "utf8")) as {
        features: { id: string }[];
      };

      expect(written.features.map((feature) => feature.id)).toEqual([
        "AAA",
        "BBB",
      ]);
    } finally {
      rmSync(tempRoot, { recursive: true, force: true });
    }
  });
});
