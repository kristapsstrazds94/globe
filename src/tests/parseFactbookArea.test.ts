import { describe, expect, it } from "vitest";

import { parseFactbookAreaSqKm, roundPercent } from "../../scripts/metadata/lib/parseFactbookArea";

describe("parseFactbookAreaSqKm", () => {
  it("parses CIA Factbook area strings", () => {
    expect(parseFactbookAreaSqKm("323,802 sq km")).toBe(323_802);
    expect(parseFactbookAreaSqKm("1,426 sq km")).toBe(1_426);
  });

  it("returns null for invalid values", () => {
    expect(parseFactbookAreaSqKm(undefined)).toBeNull();
    expect(parseFactbookAreaSqKm("unknown")).toBeNull();
  });
});

describe("roundPercent", () => {
  it("rounds to one decimal place", () => {
    expect(roundPercent(94.031)).toBe(94);
  });
});
