import { describe, expect, it } from "vitest";

import { isCountryPanelVisible } from "@/lib/ui/countryPanelVisibility";

describe("isCountryPanelVisible", () => {
  it("is visible when the panel is open with a resolved country", () => {
    expect(isCountryPanelVisible(true, "NOR", "Norway")).toBe(true);
  });

  it("is hidden when the panel is closed", () => {
    expect(isCountryPanelVisible(false, "NOR", "Norway")).toBe(false);
  });

  it("is hidden when no country is selected", () => {
    expect(isCountryPanelVisible(true, null, null)).toBe(false);
  });

  it("is hidden when metadata cannot be resolved", () => {
    expect(isCountryPanelVisible(true, "ZZZ", null)).toBe(false);
  });
});
