import { describe, expect, it } from "vitest";

import { GLOBE_COLORS, GLOBE_LIGHTING, GLOBE_MATERIAL } from "@/lib/design/globeTokens";

function hexLuminance(hex: string): number {
  const normalized = hex.replace("#", "");
  const r = Number.parseInt(normalized.slice(0, 2), 16) / 255;
  const g = Number.parseInt(normalized.slice(2, 4), 16) / 255;
  const b = Number.parseInt(normalized.slice(4, 6), 16) / 255;

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

describe("globe visual token hierarchy", () => {
  it("keeps ocean darker than land for readable country contrast", () => {
    expect(hexLuminance(GLOBE_COLORS.earth)).toBeLessThan(
      hexLuminance(GLOBE_COLORS.countryDefault),
    );
  });

  it("separates land green from ocean blue by hue", () => {
    const earthGreen = Number.parseInt(GLOBE_COLORS.earth.slice(3, 5), 16);
    const landGreen = Number.parseInt(GLOBE_COLORS.countryDefault.slice(3, 5), 16);

    expect(landGreen - earthGreen).toBeGreaterThan(50);
  });

  it("uses a warm selection hue distinct from green land", () => {
    const landRed = Number.parseInt(GLOBE_COLORS.countryDefault.slice(1, 3), 16);
    const selectedRed = Number.parseInt(GLOBE_COLORS.countrySelected.slice(1, 3), 16);

    expect(selectedRed).toBeGreaterThan(landRed + 120);
  });

  it("ramps hover brighter than default land fill", () => {
    const defaultLum = hexLuminance(GLOBE_COLORS.countryDefault);
    const hoverLum = hexLuminance(GLOBE_COLORS.countryHover);

    expect(hoverLum).toBeGreaterThan(defaultLum);
  });

  it("keeps selection warm-dominant so it reads apart from green land", () => {
    const selectedRed = Number.parseInt(GLOBE_COLORS.countrySelected.slice(1, 3), 16);
    const selectedBlue = Number.parseInt(GLOBE_COLORS.countrySelected.slice(5, 7), 16);

    expect(selectedRed).toBeGreaterThan(selectedBlue + 100);
  });

  it("keeps borders between default fill and hover brightness", () => {
    const defaultLum = hexLuminance(GLOBE_COLORS.countryDefault);
    const borderLum = hexLuminance(GLOBE_COLORS.border);
    const hoverLum = hexLuminance(GLOBE_COLORS.countryHover);

    expect(borderLum).toBeGreaterThan(defaultLum);
    expect(borderLum).toBeLessThan(hoverLum);
  });

  it("uses restrained material opacity and lighting intensities", () => {
    expect(GLOBE_MATERIAL.border.opacity).toBeGreaterThan(0);
    expect(GLOBE_MATERIAL.border.opacity).toBeLessThanOrEqual(1);
    expect(GLOBE_MATERIAL.star.opacity).toBeLessThanOrEqual(1);
    expect(GLOBE_LIGHTING.directional.intensity).toBeLessThanOrEqual(1.5);
    expect(GLOBE_LIGHTING.hemisphere.intensity).toBeLessThanOrEqual(0.6);
  });

  it("uses contrasting hemisphere colors for warm/cool surface tint", () => {
    expect(GLOBE_LIGHTING.hemisphere.skyColor).not.toBe(GLOBE_LIGHTING.hemisphere.groundColor);
  });
});
