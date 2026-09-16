import { afterEach, describe, expect, it, vi } from "vitest";

import { isPerfQueryEnabled } from "@/lib/performance/isPerfOverlayEnabled";

describe("isPerfQueryEnabled", () => {
  it("requires perf=1", () => {
    expect(isPerfQueryEnabled("")).toBe(false);
    expect(isPerfQueryEnabled("?perf=0")).toBe(false);
    expect(isPerfQueryEnabled("?perf=1")).toBe(true);
    expect(isPerfQueryEnabled("?foo=1&perf=1")).toBe(true);
  });
});

describe("isPerfOverlayEnabled", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is disabled outside development", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.resetModules();

    const { isPerfOverlayEnabled } = await import("@/lib/performance/isPerfOverlayEnabled");
    expect(isPerfOverlayEnabled()).toBe(false);
  });
});
