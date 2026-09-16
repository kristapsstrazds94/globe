import { describe, expect, it } from "vitest";

import { computeTooltipPosition } from "@/lib/ui/tooltipPosition";

describe("computeTooltipPosition", () => {
  it("offsets the tooltip from the pointer by default", () => {
    expect(computeTooltipPosition(100, 80, 80, 24, 800, 600)).toEqual({
      x: 112,
      y: 96,
    });
  });

  it("flips horizontally when the tooltip would overflow the right edge", () => {
    expect(computeTooltipPosition(780, 80, 80, 24, 800, 600)).toEqual({
      x: 688,
      y: 96,
    });
  });

  it("flips vertically when the tooltip would overflow the bottom edge", () => {
    expect(computeTooltipPosition(100, 580, 80, 24, 800, 600)).toEqual({
      x: 112,
      y: 540,
    });
  });

  it("clamps to viewport padding when space is tight", () => {
    expect(computeTooltipPosition(2, 2, 120, 24, 100, 100)).toEqual({
      x: 8,
      y: 18,
    });
  });
});
