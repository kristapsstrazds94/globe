import { describe, expect, it } from "vitest";

import { getCountryById, getCountryNameById } from "@/lib/globe/countryLookup";

describe("countryLookup", () => {
  it("returns verified country metadata for a known id", () => {
    expect(getCountryById("NOR")).toMatchObject({
      id: "NOR",
      name: "Norway",
      isoA2: "NO",
      population: expect.any(Number),
      totalAreaKm2: expect.any(Number),
      landAreaPercent: expect.any(Number),
      waterAreaPercent: expect.any(Number),
      populationDensity: expect.any(Number),
      languages: expect.arrayContaining(["Norwegian Bokmål"]),
      capital: "Oslo",
      region: "Europe",
      gdpUsdMillions: expect.any(Number),
      climate: expect.any(String),
      currencies: expect.arrayContaining(["Norwegian krone (kr)"]),
      timezones: expect.arrayContaining([expect.stringContaining("UTC")]),
    });
    expect(getCountryById("USA")).toMatchObject({
      id: "USA",
      name: "United States of America",
      aliases: expect.arrayContaining(["United States", "America"]),
    });
  });

  it("returns a verified display name for a known country id", () => {
    expect(getCountryNameById("NOR")).toBe("Norway");
    expect(getCountryNameById("USA")).toBe("United States of America");
  });

  it("returns null for unknown ids", () => {
    expect(getCountryById("ZZZ")).toBeNull();
    expect(getCountryNameById("ZZZ")).toBeNull();
  });
});
