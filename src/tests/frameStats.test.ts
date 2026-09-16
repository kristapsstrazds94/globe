import { describe, expect, it } from "vitest";

import { FrameStatsTracker } from "@/lib/performance/frameStats";

describe("FrameStatsTracker", () => {
  it("returns a sample after enough elapsed time", () => {
    const tracker = new FrameStatsTracker();

    expect(tracker.tick(0)).toBeNull();
    expect(tracker.tick(16)).toBeNull();

    const sample = tracker.tick(520);

    expect(sample).not.toBeNull();
    expect(sample?.fps).toBeGreaterThan(0);
    expect(sample?.frameTimeMs).toBeGreaterThan(0);
    expect(sample?.maxFrameTimeMs).toBeGreaterThanOrEqual(sample?.frameTimeMs ?? 0);
  });
});
