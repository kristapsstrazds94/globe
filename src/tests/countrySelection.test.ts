import { describe, expect, it } from "vitest";

import {
  COUNTRY_TAP_THRESHOLD_PX,
  isTapGesture,
  resolveCountryVisualMaterial,
  resolveSelectionFromPick,
} from "@/lib/globe/countrySelection";

describe("countrySelection", () => {
  describe("isTapGesture", () => {
    it("returns true when movement is within the tap threshold", () => {
      expect(isTapGesture({ clientX: 100, clientY: 200 }, { clientX: 103, clientY: 201 })).toBe(
        true,
      );
    });

    it("returns false when movement exceeds the tap threshold", () => {
      expect(
        isTapGesture(
          { clientX: 0, clientY: 0 },
          { clientX: COUNTRY_TAP_THRESHOLD_PX + 1, clientY: 0 },
        ),
      ).toBe(false);
    });
  });

  describe("resolveCountryVisualMaterial", () => {
    it("prefers selected over hover for the same country", () => {
      expect(resolveCountryVisualMaterial("NOR", "NOR", "NOR")).toBe("selected");
    });

    it("returns hover when only hovered", () => {
      expect(resolveCountryVisualMaterial("NOR", "NOR", null)).toBe("hover");
    });

    it("returns selected when only selected", () => {
      expect(resolveCountryVisualMaterial("NOR", null, "NOR")).toBe("selected");
    });

    it("returns default when neither hovered nor selected", () => {
      expect(resolveCountryVisualMaterial("NOR", "SWE", "FIN")).toBe("default");
    });
  });

  describe("resolveSelectionFromPick", () => {
    it("selects when a country is picked", () => {
      expect(resolveSelectionFromPick("NOR")).toEqual({ type: "select", countryId: "NOR" });
    });

    it("clears when the pick misses countries", () => {
      expect(resolveSelectionFromPick(null)).toEqual({ type: "clear" });
    });
  });
});
