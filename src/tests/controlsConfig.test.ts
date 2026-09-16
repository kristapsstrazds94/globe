import { describe, expect, it } from "vitest";

import { GLOBE_CONTROLS } from "@/components/globe/controlsConfig";

describe("GLOBE_CONTROLS", () => {
  it("uses positive interaction tuning values", () => {
    expect(GLOBE_CONTROLS.dampingFactor).toBeGreaterThan(0);
    expect(GLOBE_CONTROLS.rotateSpeed).toBeGreaterThan(0);
    expect(GLOBE_CONTROLS.zoomSpeed).toBeGreaterThan(0);
    expect(GLOBE_CONTROLS.keyboardRotateStep).toBeGreaterThan(0);
    expect(GLOBE_CONTROLS.keyboardZoomScale).toBeGreaterThan(1);
  });
});
