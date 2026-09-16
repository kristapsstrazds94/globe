import { describe, expect, it } from "vitest";

import { getCountryFlagSrc } from "@/lib/ui/countryFlag";

describe("getCountryFlagSrc", () => {
  it("returns a flag CDN URL for valid alpha-2 codes", () => {
    expect(getCountryFlagSrc("NO")).toBe("https://flagcdn.com/w80/no.png");
    expect(getCountryFlagSrc("us")).toBe("https://flagcdn.com/w80/us.png");
  });

  it("returns null for invalid codes", () => {
    expect(getCountryFlagSrc("-99")).toBeNull();
    expect(getCountryFlagSrc("")).toBeNull();
  });
});
