import { describe, expect, it } from "vitest";

import {
  ATMOSPHERE_TIER_SETTINGS,
  getAtmosphereQualityTier,
  getAtmosphereSettings,
} from "@/components/globe/atmosphereConfig";

describe("getAtmosphereQualityTier", () => {
  it("uses low tier on mobile widths", () => {
    expect(getAtmosphereQualityTier(375)).toBe("low");
  });

  it("uses medium tier on tablet widths", () => {
    expect(getAtmosphereQualityTier(900)).toBe("medium");
  });

  it("uses high tier on desktop widths", () => {
    expect(getAtmosphereQualityTier(1280)).toBe("high");
  });
});

describe("getAtmosphereSettings", () => {
  it("reduces intensity on smaller viewports", () => {
    const desktop = getAtmosphereSettings(1280, false);
    const mobile = getAtmosphereSettings(375, false);

    expect(mobile.intensity).toBeLessThan(desktop.intensity);
    expect(mobile.segments).toBeLessThanOrEqual(desktop.segments);
  });

  it("returns reduced settings when reduced motion is preferred", () => {
    const normal = getAtmosphereSettings(1280, false);
    const reduced = getAtmosphereSettings(1280, true);

    expect(reduced.intensity).toBeLessThan(normal.intensity);
    expect(reduced.intensity).toBe(
      ATMOSPHERE_TIER_SETTINGS.reduced.intensity,
    );
  });

  it("keeps atmosphere enabled across tiers", () => {
    expect(getAtmosphereSettings(1280, false).enabled).toBe(true);
    expect(getAtmosphereSettings(375, false).enabled).toBe(true);
    expect(getAtmosphereSettings(1280, true).enabled).toBe(true);
  });
});
