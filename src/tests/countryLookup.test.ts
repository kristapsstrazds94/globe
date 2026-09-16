import { describe, expect, it } from "vitest";

import { getCountryById, getCountryNameById } from "@/lib/globe/countryLookup";

describe("countryLookup", () => {
  it("returns verified country metadata for a known id", () => {
    expect(getCountryById("NOR")).toEqual({ id: "NOR", name: "Norway" });
    expect(getCountryById("USA")).toEqual({
      id: "USA",
      name: "United States of America",
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
