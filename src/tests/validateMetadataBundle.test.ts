import { describe, expect, it } from "vitest";

import { metadataBundle } from "@/data/metadata";
import { validateMetadataBundle } from "@/lib/metadata/validateMetadataBundle";

describe("validateMetadataBundle", () => {
  it("accepts the shipped preprocessed bundle", () => {
    const result = validateMetadataBundle(metadataBundle);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.bundle.recordCount).toBeGreaterThan(0);
    }
  });

  it("rejects missing data", () => {
    expect(validateMetadataBundle(null)).toEqual({
      ok: false,
      error: "Country metadata is missing or invalid.",
    });
  });

  it("rejects invalid records", () => {
    const result = validateMetadataBundle({
      schemaVersion: 1,
      sourceVersion: "test",
      recordCount: 1,
      records: {
        NOR: {
          population: 0,
          totalAreaKm2: 100,
          landAreaKm2: 90,
          landAreaPercent: 90,
          waterAreaPercent: 10,
          populationDensity: 0,
          languages: [],
          capital: "",
          region: "",
          subregion: "",
        },
      },
    });

    expect(result.ok).toBe(false);
  });
});
