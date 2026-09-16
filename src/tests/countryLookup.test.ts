import { describe, expect, it } from "vitest";

import { getCountryNameById } from "@/lib/globe/countryLookup";

describe("countryLookup", () => {
  it("returns a verified display name for a known country id", () => {
    expect(getCountryNameById("NOR")).toBe("Norway");
    expect(getCountryNameById("USA")).toBe("United States of America");
  });

  it("returns null for unknown ids", () => {
    expect(getCountryNameById("ZZZ")).toBeNull();
  });
});
