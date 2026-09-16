import { readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  COUNTRY_BORDER_RADIUS,
  COUNTRY_LAYER_RADIUS,
  EARTH_GEOMETRY,
} from "../../src/components/globe/earthConfig";
import { validateGeographyBundle } from "../../src/lib/geo/validateGeographyBundle";
import type { PerformanceBaselineSnapshot } from "../../src/lib/performance/baselineSnapshot";
import { computeGlobeGeometryStats } from "../../src/lib/performance/globeGeometryStats";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");

const GEOGRAPHY_BUNDLE_PATH = "public/generated/geography/countries.json";
const OUTPUT_PATH = "docs/generated/performance-baseline.json";

const TRACKED_ASSETS = [
  "public/generated/geography/countries.json",
] as const;

async function readAssetSize(relativePath: string): Promise<number> {
  const absolutePath = path.join(rootDir, relativePath);
  const fileStat = await stat(absolutePath);
  return fileStat.size;
}

async function collectBuildStats(): Promise<PerformanceBaselineSnapshot["build"]> {
  const staticDir = path.join(rootDir, ".next/static");

  try {
    const { readdir } = await import("node:fs/promises");
    const chunkFiles: { path: string; bytes: number }[] = [];

    async function walk(directory: string, prefix: string): Promise<void> {
      const entries = await readdir(directory, { withFileTypes: true });

      for (const entry of entries) {
        const entryPath = path.join(directory, entry.name);
        const relative = path.posix.join(prefix, entry.name);

        if (entry.isDirectory()) {
          await walk(entryPath, relative);
          continue;
        }

        if (!entry.isFile()) {
          continue;
        }

        const fileStat = await stat(entryPath);
        chunkFiles.push({ path: `.next/static/${relative.replace(/\\/g, "/")}`, bytes: fileStat.size });
      }
    }

    await walk(staticDir, "");

    if (chunkFiles.length === 0) {
      return { available: false, totalStaticBytes: null, largestChunks: [] };
    }

    const totalStaticBytes = chunkFiles.reduce((sum, file) => sum + file.bytes, 0);
    const largestChunks = [...chunkFiles]
      .sort((left, right) => right.bytes - left.bytes)
      .slice(0, 12);

    return {
      available: true,
      totalStaticBytes,
      largestChunks,
    };
  } catch {
    return { available: false, totalStaticBytes: null, largestChunks: [] };
  }
}

async function main(): Promise<void> {
  const bundlePath = path.join(rootDir, GEOGRAPHY_BUNDLE_PATH);
  const rawText = await readFile(bundlePath, "utf8");
  const parsed: unknown = JSON.parse(rawText);
  const validation = validateGeographyBundle(parsed);

  if (!validation.ok) {
    throw new Error(`Invalid geography bundle: ${validation.error}`);
  }

  const bundle = validation.bundle;
  const bundleBytes = Buffer.byteLength(rawText, "utf8");
  const geometry = computeGlobeGeometryStats(
    bundle,
    {
      countryFill: COUNTRY_LAYER_RADIUS,
      countryBorder: COUNTRY_BORDER_RADIUS,
    },
    {
      widthSegments: EARTH_GEOMETRY.widthSegments,
      heightSegments: EARTH_GEOMETRY.heightSegments,
    },
  );

  const assets = await Promise.all(
    TRACKED_ASSETS.map(async (assetPath) => ({
      path: assetPath,
      bytes: await readAssetSize(assetPath),
    })),
  );

  const snapshot: PerformanceBaselineSnapshot = {
    capturedAt: new Date().toISOString(),
    nodeVersion: process.version,
    geography: {
      sourceVersion: bundle.sourceVersion,
      scale: bundle.scale,
      simplifyToleranceDegrees: bundle.simplifyToleranceDegrees,
      featureCount: bundle.featureCount,
      bundleBytes,
      geometry,
    },
    assets,
    build: await collectBuildStats(),
  };

  const outputPath = path.join(rootDir, OUTPUT_PATH);
  await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

  console.log(`Performance baseline written → ${path.relative(rootDir, outputPath)}`);
  console.log(`Countries: ${geometry.countryCount}`);
  console.log(`Country fill triangles: ${geometry.countryFillTriangles.toLocaleString()}`);
  console.log(`Estimated static draw calls: ${geometry.estimatedStaticDrawCalls.minimumTotal}`);
  console.log(`Geography bundle: ${(bundleBytes / 1024).toFixed(1)} KB`);

  if (snapshot.build.available && snapshot.build.totalStaticBytes !== null) {
    console.log(
      `.next/static total: ${(snapshot.build.totalStaticBytes / 1024).toFixed(1)} KB (${snapshot.build.largestChunks.length} files sampled)`,
    );
  } else {
    console.log("Production build not found — run `pnpm build` then `pnpm perf:measure` for JS payload sizes.");
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Performance baseline capture failed: ${message}`);
  process.exitCode = 1;
});
