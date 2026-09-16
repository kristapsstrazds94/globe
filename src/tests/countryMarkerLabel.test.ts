import { describe, expect, it } from "vitest";

import {
  getCountryLabelPixelRatio,
  getCountryLabelWorldScale,
  measureCountryLabelLayout,
} from "@/lib/globe/countryMarkerLabel";

describe("measureCountryLabelLayout", () => {
  it("grows width with longer country names", () => {
    const short = measureCountryLabelLayout("Peru", () => 28);
    const long = measureCountryLabelLayout("United Kingdom", () => 120);

    expect(long.width).toBeGreaterThan(short.width);
    expect(short.height).toBe(long.height);
  });

  it("respects a minimum label width", () => {
    const layout = measureCountryLabelLayout("A", () => 8);

    expect(layout.width).toBeGreaterThanOrEqual(48);
  });
});

describe("getCountryLabelPixelRatio", () => {
  it("defaults to at least 2x for sharp canvas rendering", () => {
    expect(getCountryLabelPixelRatio()).toBeGreaterThanOrEqual(2);
  });
});

describe("getCountryLabelWorldScale", () => {
  it("increases world scale with camera distance to preserve screen size", () => {
    const layout = { width: 120, height: 30 };
    const near = getCountryLabelWorldScale(2.5, 800, 45, layout);
    const far = getCountryLabelWorldScale(5, 800, 45, layout);

    expect(far[0]).toBeGreaterThan(near[0]);
    expect(far[1]).toBeGreaterThan(near[1]);
  });
});
