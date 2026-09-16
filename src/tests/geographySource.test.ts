import { describe, expect, it } from "vitest";

import { GEOGRAPHY_SOURCE } from "../../scripts/geography/source.config";

describe("GEOGRAPHY_SOURCE", () => {
  it("documents a public-domain-compatible license", () => {
    expect(GEOGRAPHY_SOURCE.license.toLowerCase()).toContain("public domain");
    expect(GEOGRAPHY_SOURCE.licenseUrl).toMatch(/^https:\/\//);
  });

  it("selects a primary dataset with stable identifiers and MultiPolygon support", () => {
    const { primary } = GEOGRAPHY_SOURCE.datasets;

    expect(primary.format).toBe("GeoJSON");
    expect(primary.url).toMatch(/ne_50m_admin_0_countries\.geojson$/);
    expect(GEOGRAPHY_SOURCE.identifiers.primary).toBe("ADM0_A3");
    expect(GEOGRAPHY_SOURCE.geometryTypes).toContain("MultiPolygon");
  });

  it("records boundary and attribution conventions", () => {
    expect(GEOGRAPHY_SOURCE.boundaryConvention).toBe("de_facto");
    expect(GEOGRAPHY_SOURCE.disputedTerritoriesNote.length).toBeGreaterThan(0);
    expect(GEOGRAPHY_SOURCE.attributionRequired).toBe(false);
  });

  it("lists known limitations for downstream preprocessing", () => {
    expect(GEOGRAPHY_SOURCE.knownLimitations.length).toBeGreaterThanOrEqual(3);
    expect(GEOGRAPHY_SOURCE.knownLimitations.some((note) => note.includes("antimeridian"))).toBe(
      true,
    );
  });
});
