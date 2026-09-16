import { describe, expect, it, vi } from "vitest";

import { isWebGLAvailable } from "@/lib/webgl/isWebGLAvailable";
import { getGlobeDpr } from "@/components/globe/useGlobeDpr";

describe("isWebGLAvailable", () => {
  it("returns false when getContext returns null", () => {
    const mockCanvas = {
      getContext: vi.fn().mockReturnValue(null),
    };

    expect(
      isWebGLAvailable(() => mockCanvas as unknown as HTMLCanvasElement),
    ).toBe(false);
  });

  it("returns true when webgl2 context is available", () => {
    const mockCanvas = {
      getContext: vi.fn((type: string) => (type === "webgl2" ? {} : null)),
    };

    expect(
      isWebGLAvailable(() => mockCanvas as unknown as HTMLCanvasElement),
    ).toBe(true);
  });

  it("returns true when only webgl context is available", () => {
    const mockCanvas = {
      getContext: vi.fn((type: string) => (type === "webgl" ? {} : null)),
    };

    expect(
      isWebGLAvailable(() => mockCanvas as unknown as HTMLCanvasElement),
    ).toBe(true);
  });

  it("returns false when getContext throws", () => {
    const mockCanvas = {
      getContext: vi.fn().mockImplementation(() => {
        throw new Error("WebGL blocked");
      }),
    };

    expect(
      isWebGLAvailable(() => mockCanvas as unknown as HTMLCanvasElement),
    ).toBe(false);
  });
});

describe("getGlobeDpr", () => {
  it("caps DPR on mobile viewports", () => {
    expect(getGlobeDpr(375, 3)).toBe(1.5);
  });

  it("caps DPR on desktop viewports", () => {
    expect(getGlobeDpr(1280, 3)).toBe(2);
  });
});
