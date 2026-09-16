import { describe, expect, it } from "vitest";

import {
  GLOBE_INTERACTION_MOTION,
  easeOutCubic,
  getCountryPanelTransitionMs,
  getFlyToDurationMsForAngle,
  getInteractionDurationMs,
} from "@/lib/design/interactionMotion";

describe("GLOBE_INTERACTION_MOTION", () => {
  it("keeps hover timing within docs/DESIGN.md guidance (100–180ms)", () => {
    expect(GLOBE_INTERACTION_MOTION.countryFillMs).toBeGreaterThanOrEqual(100);
    expect(GLOBE_INTERACTION_MOTION.countryFillMs).toBeLessThanOrEqual(180);
    expect(GLOBE_INTERACTION_MOTION.tooltipMs).toBeGreaterThanOrEqual(100);
    expect(GLOBE_INTERACTION_MOTION.tooltipMs).toBeLessThanOrEqual(180);
  });

  it("keeps panel timing within docs/DESIGN.md guidance (180–300ms)", () => {
    expect(GLOBE_INTERACTION_MOTION.panelTransformMs).toBeGreaterThanOrEqual(180);
    expect(GLOBE_INTERACTION_MOTION.panelTransformMs).toBeLessThanOrEqual(300);
    expect(GLOBE_INTERACTION_MOTION.panelOpacityMs).toBeGreaterThanOrEqual(180);
    expect(GLOBE_INTERACTION_MOTION.panelOpacityMs).toBeLessThanOrEqual(300);
  });

  it("keeps fly-to timing within docs/DESIGN.md guidance (500–1000ms)", () => {
    expect(GLOBE_INTERACTION_MOTION.flyToMinMs).toBeGreaterThanOrEqual(500);
    expect(GLOBE_INTERACTION_MOTION.flyToMaxMs).toBeLessThanOrEqual(1000);
    expect(GLOBE_INTERACTION_MOTION.flyToMaxMs).toBeGreaterThan(
      GLOBE_INTERACTION_MOTION.flyToMinMs,
    );
  });
});

describe("getInteractionDurationMs", () => {
  it("returns zero when reduced motion is preferred", () => {
    expect(getInteractionDurationMs(260, true)).toBe(0);
  });

  it("returns the requested duration otherwise", () => {
    expect(getInteractionDurationMs(260, false)).toBe(260);
  });
});

describe("getFlyToDurationMsForAngle", () => {
  it("snaps instantly when reduced motion is preferred", () => {
    expect(getFlyToDurationMsForAngle(Math.PI, true)).toBe(0);
  });

  it("uses the minimum duration for no travel", () => {
    expect(getFlyToDurationMsForAngle(0, false)).toBe(GLOBE_INTERACTION_MOTION.flyToMinMs);
  });

  it("uses the maximum duration at half-orbit travel", () => {
    expect(getFlyToDurationMsForAngle(Math.PI, false)).toBe(GLOBE_INTERACTION_MOTION.flyToMaxMs);
  });

  it("scales linearly between min and max duration", () => {
    const midpoint = getFlyToDurationMsForAngle(Math.PI / 2, false);
    const expected = Math.round(
      GLOBE_INTERACTION_MOTION.flyToMinMs +
        0.5 * (GLOBE_INTERACTION_MOTION.flyToMaxMs - GLOBE_INTERACTION_MOTION.flyToMinMs),
    );

    expect(midpoint).toBe(expected);
  });
});

describe("getCountryPanelTransitionMs", () => {
  it("matches panel transform timing when motion is allowed", () => {
    expect(getCountryPanelTransitionMs(false)).toBe(GLOBE_INTERACTION_MOTION.panelTransformMs);
  });

  it("is instant when reduced motion is preferred", () => {
    expect(getCountryPanelTransitionMs(true)).toBe(0);
  });
});

describe("easeOutCubic", () => {
  it("starts and ends at the expected values", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
});
