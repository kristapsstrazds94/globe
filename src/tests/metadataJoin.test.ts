import { describe, expect, it } from "vitest";

import { joinCountryMetadata } from "../../scripts/metadata/lib/join";
import type { PackageCountryProfile } from "../../scripts/metadata/lib/types";

function profile(overrides: Partial<PackageCountryProfile>): PackageCountryProfile {
  return {
    cca2: "NO",
    cca3: "NOR",
    capital: ["Oslo"],
    area: 323_802,
    languages: { nob: "Norwegian Bokmål", nno: "Norwegian Nynorsk" },
    region: "Europe",
    subregion: "Northern Europe",
    population: 5_606_944,
    gdpUsdMillions: 504_276,
    currencies: { NOK: { name: "Norwegian krone", symbol: "kr" } },
    timezones: [
      {
        zoneName: "Europe/Oslo",
        gmtOffsetName: "UTC+01:00",
        tzName: "Central European Time",
      },
    ],
    climate: "subarctic",
    avgAnnualTemperatureC: 2,
    ...overrides,
  };
}

const climateByAlpha2 = new Map([
  ["NO", { climate: "subarctic", avgAnnualTemperatureC: 2 }],
  ["XK", { climate: "continental", avgAnnualTemperatureC: 10 }],
]);

const factbookAreaByIsoA2 = new Map([
  [
    "NO",
    {
      totalAreaKm2: 323_802,
      landAreaKm2: 304_282,
      waterAreaKm2: 19_520,
      landAreaPercent: 94,
      waterAreaPercent: 6,
    },
  ],
  [
    "XK",
    {
      totalAreaKm2: 10_908,
      landAreaKm2: 10_887,
      waterAreaKm2: 21,
      landAreaPercent: 99.8,
      waterAreaPercent: 0.2,
    },
  ],
]);

describe("joinCountryMetadata", () => {
  it("joins metadata by ADM0_A3 id", () => {
    const byCca3 = new Map([["NOR", profile({})]]);
    const byCca2 = new Map([["NO", profile({})]]);

    const result = joinCountryMetadata(
      { id: "NOR", isoA2: "NO" },
      byCca3,
      byCca2,
      byCca3,
      byCca2,
      climateByAlpha2,
      factbookAreaByIsoA2,
    );

    expect(result).toMatchObject({
      population: 5_606_944,
      totalAreaKm2: 323_802,
      landAreaPercent: 94,
      waterAreaPercent: 6,
      capital: "Oslo",
      region: "Europe",
      languages: ["Norwegian Bokmål", "Norwegian Nynorsk"],
      gdpUsdMillions: 504_276,
      climate: "Subarctic",
      avgAnnualTemperatureC: 2,
      currencies: ["Norwegian krone (kr)"],
      timezones: ["Central European Time (UTC+01:00)"],
    });
  });

  it("falls back to ISO alpha-2 when ADM0_A3 differs from ISO alpha-3", () => {
    const kosovo = profile({
      cca2: "XK",
      cca3: "UNK",
      capital: ["Pristina"],
      languages: { sqi: "Albanian", srp: "Serbian" },
      region: "Europe",
      subregion: "Southeast Europe",
    });

    const byCca3 = new Map<string, PackageCountryProfile>();
    const byCca2 = new Map([["XK", kosovo]]);

    const result = joinCountryMetadata(
      { id: "KOS", isoA2: "XK" },
      byCca3,
      byCca2,
      byCca3,
      byCca2,
      climateByAlpha2,
      factbookAreaByIsoA2,
    );

    expect(result?.capital).toBe("Pristina");
    expect(result?.languages).toEqual(["Albanian", "Serbian"]);
  });

  it("skips ambiguous ISO alpha-2 fallbacks for dependent territories", () => {
    const australia = profile({
      cca2: "AU",
      cca3: "AUS",
      capital: ["Canberra"],
      region: "Oceania",
      subregion: "Australia and New Zealand",
    });

    const byCca3 = new Map<string, PackageCountryProfile>();
    const byCca2 = new Map([["AU", australia]]);

    expect(
      joinCountryMetadata(
        { id: "ATC", isoA2: "AU" },
        byCca3,
        byCca2,
        byCca3,
        byCca2,
        climateByAlpha2,
        factbookAreaByIsoA2,
      ),
    ).toBeNull();
  });
});
