import { describe, expect, it } from "vitest";

import { getBorderOpacityForCameraDistance } from "@/lib/globe/borderVisibility";

describe("getBorderOpacityForCameraDistance", () => {
  const min = 1.85;
  const max = 8;
  const base = 0.88;

  it("returns base opacity at minimum zoom distance", () => {
    expect(getBorderOpacityForCameraDistance(min, min, max, base)).toBe(base);
  });

  it("increases opacity when zoomed out", () => {
    const zoomedOut = getBorderOpacityForCameraDistance(max, min, max, base);
    expect(zoomedOut).toBeGreaterThan(base);
    expect(zoomedOut).toBeLessThanOrEqual(1);
  });

  it("never exceeds 1", () => {
    expect(getBorderOpacityForCameraDistance(100, min, max, 0.99)).toBeLessThanOrEqual(1);
  });
});
