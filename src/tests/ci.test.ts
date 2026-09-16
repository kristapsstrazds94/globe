import { describe, expect, it } from "vitest";

import type { SpherePoint } from "@/lib/geo/coordinates";

describe("CI smoke", () => {
  it("runs the test runner and resolves path aliases", () => {
    const point: SpherePoint = [0, 0, 1];
    expect(point).toHaveLength(3);
  });
});
