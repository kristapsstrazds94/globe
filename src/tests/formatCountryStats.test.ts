import { describe, expect, it } from "vitest";

import {
  formatAreaKm2,
  formatAreaPercent,
  formatClimate,
  formatGdpUsdMillions,
  formatLanguageList,
  formatPopulation,
  formatPopulationDensity,
} from "@/lib/ui/formatCountryStats";

describe("formatCountryStats", () => {
  it("formats population compactly", () => {
    expect(formatPopulation(5_606_944)).toBe("5.6M");
  });

  it("formats density with units", () => {
    expect(formatPopulationDensity(17.3)).toBe("17.3/km²");
  });

  it("joins language names", () => {
    expect(formatLanguageList(["Norwegian Bokmål", "Sami"])).toBe("Norwegian Bokmål, Sami");
  });

  it("formats GDP from USD millions", () => {
    expect(formatGdpUsdMillions(504_276)).toBe("$504.3B");
  });

  it("formats climate with mean annual temperature", () => {
    expect(formatClimate("Subarctic", 2)).toBe("Subarctic · 2°C avg annual");
  });

  it("formats area and percentages", () => {
    expect(formatAreaKm2(323_802)).toBe("323,802 km²");
    expect(formatAreaPercent(94)).toBe("94%");
  });
});
