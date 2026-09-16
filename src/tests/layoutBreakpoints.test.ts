import { describe, expect, it } from "vitest";

import {
  isDesktopLayoutWidth,
  isMobileLayoutWidth,
  isTabletLayoutWidth,
  LAYOUT_BREAKPOINTS_REM,
} from "@/lib/ui/layoutBreakpoints";

describe("layoutBreakpoints", () => {
  it("defines content-driven mobile, tablet, and desktop tiers", () => {
    expect(LAYOUT_BREAKPOINTS_REM.mobileMax).toBeLessThan(LAYOUT_BREAKPOINTS_REM.tabletMin);
    expect(LAYOUT_BREAKPOINTS_REM.tabletMax).toBeLessThan(LAYOUT_BREAKPOINTS_REM.desktopMin);
  });

  it("classifies mobile widths", () => {
    expect(isMobileLayoutWidth(320)).toBe(true);
    expect(isMobileLayoutWidth(767)).toBe(true);
    expect(isMobileLayoutWidth(768)).toBe(false);
  });

  it("classifies tablet widths", () => {
    expect(isTabletLayoutWidth(768)).toBe(true);
    expect(isTabletLayoutWidth(1023)).toBe(true);
    expect(isTabletLayoutWidth(767)).toBe(false);
    expect(isTabletLayoutWidth(1024)).toBe(false);
  });

  it("classifies desktop widths", () => {
    expect(isDesktopLayoutWidth(1024)).toBe(true);
    expect(isDesktopLayoutWidth(1920)).toBe(true);
    expect(isDesktopLayoutWidth(1023)).toBe(false);
  });
});
