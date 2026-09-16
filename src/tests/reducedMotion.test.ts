import { describe, expect, it } from "vitest";

import { GLOBE_CONTROLS, getControlsDampingSettings } from "@/components/globe/controlsConfig";
import { GLOBE_CAMERA_FLY_TO, getFlyToDurationMs } from "@/components/globe/flyToConfig";
import { getAtmosphereSettings } from "@/components/globe/atmosphereConfig";
import { getStarCount } from "@/components/globe/starsConfig";

describe("getFlyToDurationMs", () => {
  it("snaps instantly when reduced motion is preferred", () => {
    expect(getFlyToDurationMs(true)).toBe(GLOBE_CAMERA_FLY_TO.reducedMotionDurationMs);
    expect(getFlyToDurationMs(true)).toBe(0);
  });

  it("uses the minimum duration for no travel otherwise", () => {
    expect(getFlyToDurationMs(false)).toBe(GLOBE_CAMERA_FLY_TO.durationMs);
    expect(getFlyToDurationMs(false, Math.PI)).toBe(GLOBE_CAMERA_FLY_TO.maxDurationMs);
  });
});

describe("getControlsDampingSettings", () => {
  it("disables inertial damping when reduced motion is preferred", () => {
    expect(getControlsDampingSettings(true)).toEqual({
      enableDamping: false,
      dampingFactor: 0,
    });
  });

  it("enables inertial damping otherwise", () => {
    expect(getControlsDampingSettings(false)).toEqual({
      enableDamping: true,
      dampingFactor: GLOBE_CONTROLS.dampingFactor,
    });
  });
});

describe("decorative rendering tiers", () => {
  it("reduces star count when reduced motion is preferred", () => {
    const normal = getStarCount(1280, false);
    const reduced = getStarCount(1280, true);

    expect(reduced).toBeLessThan(normal);
  });

  it("reduces atmosphere intensity when reduced motion is preferred", () => {
    const normal = getAtmosphereSettings(1280, false);
    const reduced = getAtmosphereSettings(1280, true);

    expect(reduced.intensity).toBeLessThan(normal.intensity);
    expect(reduced.enabled).toBe(true);
  });
});
