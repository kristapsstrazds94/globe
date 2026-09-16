import { describe, expect, it } from "vitest";

import { geographyBundle } from "@/data/geography";
import { validateGeographyBundle } from "@/lib/geo/validateGeographyBundle";

describe("validateGeographyBundle", () => {
  it("accepts the shipped preprocessed bundle", () => {
    const result = validateGeographyBundle(geographyBundle);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.bundle.features.length).toBeGreaterThan(0);
    }
  });

  it("rejects missing data", () => {
    expect(validateGeographyBundle(null)).toEqual({
      ok: false,
      error: "Geography data is missing or invalid.",
    });
  });

  it("rejects unsupported schema versions", () => {
    const result = validateGeographyBundle({
      schemaVersion: 2,
      sourceVersion: "test",
      features: [
        { id: "NOR", name: "Norway", isoA2: "NO", geometry: { type: "Polygon", coordinates: [] } },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("unsupported format");
    }
  });

  it("rejects bundles with no countries", () => {
    const result = validateGeographyBundle({
      schemaVersion: 1,
      sourceVersion: "test",
      featureCount: 0,
      features: [],
    });

    expect(result).toEqual({
      ok: false,
      error: "Geography data contains no countries.",
    });
  });

  it("rejects mismatched feature counts", () => {
    const result = validateGeographyBundle({
      schemaVersion: 1,
      sourceVersion: "test",
      featureCount: 2,
      features: [
        { id: "NOR", name: "Norway", isoA2: "NO", geometry: { type: "Polygon", coordinates: [] } },
      ],
    });

    expect(result).toEqual({
      ok: false,
      error: "Geography data is incomplete or corrupted.",
    });
  });

  it("rejects countries without geometry", () => {
    const result = validateGeographyBundle({
      schemaVersion: 1,
      sourceVersion: "test",
      features: [
        {
          id: "NOR",
          name: "Norway",
          isoA2: "NO",
          geometry: { type: "Point", coordinates: [0, 0] },
        },
      ],
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("invalid country geometry");
    }
  });
});
