import { describe, expect, it } from "vitest";

import {
  STARS_MAX_COUNT,
  STARS_RADIUS,
  buildStarField,
  buildStarPositions,
  getStarCount,
  getStarQualityTier,
} from "@/components/globe/starsConfig";
import { GLOBE_CAMERA_MIN_FAR, getGlobeCameraFar, GLOBE_CAMERA_CONSTRAINTS } from "@/components/globe/cameraConfig";

describe("getStarQualityTier", () => {
  it("uses low tier on mobile widths", () => {
    expect(getStarQualityTier(375)).toBe("low");
  });

  it("uses medium tier on tablet widths", () => {
    expect(getStarQualityTier(900)).toBe("medium");
  });

  it("uses high tier on desktop widths", () => {
    expect(getStarQualityTier(1280)).toBe("high");
  });
});

describe("getStarCount", () => {
  it("never exceeds the configured maximum", () => {
    expect(getStarCount(1920, false)).toBeLessThanOrEqual(STARS_MAX_COUNT);
    expect(getStarCount(375, false)).toBeLessThanOrEqual(STARS_MAX_COUNT);
  });

  it("returns a reduced count when reduced motion is preferred", () => {
    const desktop = getStarCount(1280, false);
    const reduced = getStarCount(1280, true);

    expect(reduced).toBeLessThan(desktop);
  });
});

describe("buildStarField", () => {
  it("varies star size and color across the field", () => {
    const field = buildStarField(64, STARS_RADIUS);
    const uniqueSizes = new Set(Array.from(field.sizes).map((size) => size.toFixed(3)));
    const uniqueColors = new Set(
      Array.from({ length: 64 }, (_, i) => {
        const base = i * 3;
        return `${field.colors[base]!.toFixed(2)},${field.colors[base + 1]!.toFixed(2)},${field.colors[base + 2]!.toFixed(2)}`;
      }),
    );

    expect(uniqueSizes.size).toBeGreaterThan(1);
    expect(uniqueColors.size).toBeGreaterThan(1);
  });

  it("is deterministic for the same count", () => {
    const first = buildStarField(16, STARS_RADIUS);
    const second = buildStarField(16, STARS_RADIUS);

    expect(Array.from(first.positions)).toEqual(Array.from(second.positions));
    expect(Array.from(first.colors)).toEqual(Array.from(second.colors));
    expect(Array.from(first.sizes)).toEqual(Array.from(second.sizes));
  });
});

describe("buildStarPositions", () => {
  it("places stars on the requested radius shell", () => {
    const radius = 50;
    const positions = buildStarPositions(32, radius);

    for (let i = 0; i < 32; i++) {
      const base = i * 3;
      const x = positions[base]!;
      const y = positions[base + 1]!;
      const z = positions[base + 2]!;
      const distance = Math.hypot(x, y, z);

      expect(distance).toBeCloseTo(radius, 4);
    }
  });

  it("is deterministic for the same count", () => {
    const first = buildStarPositions(16, STARS_RADIUS);
    const second = buildStarPositions(16, STARS_RADIUS);

    expect(Array.from(first)).toEqual(Array.from(second));
  });
});

describe("STARS_RADIUS", () => {
  it("fits within the camera far plane at minimum zoom", () => {
    const farAtMinZoom = getGlobeCameraFar(GLOBE_CAMERA_CONSTRAINTS.minDistance);
    expect(STARS_RADIUS).toBeLessThan(farAtMinZoom);
  });

  it("fits within the static minimum far plane", () => {
    expect(STARS_RADIUS).toBeLessThan(GLOBE_CAMERA_MIN_FAR);
  });
});
