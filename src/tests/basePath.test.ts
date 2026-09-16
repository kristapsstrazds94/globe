import { afterEach, describe, expect, it, vi } from "vitest";

async function loadBasePathModule() {
  vi.resetModules();
  return import("@/lib/basePath");
}

describe("withBasePath", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns the path unchanged when no base path is configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "");
    const { withBasePath } = await loadBasePathModule();

    expect(withBasePath("/brand/globe-logo.webp")).toBe("/brand/globe-logo.webp");
  });

  it("prefixes absolute paths with the GitHub Pages subpath", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/globe");
    const { withBasePath } = await loadBasePathModule();

    expect(withBasePath("/brand/globe-logo.webp")).toBe("/globe/brand/globe-logo.webp");
  });
});
