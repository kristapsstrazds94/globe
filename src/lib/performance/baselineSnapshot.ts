import type { GlobeGeometryStats } from "./globeGeometryStats";

export type PerformanceAssetEntry = {
  path: string;
  bytes: number;
};

export type PerformanceBuildChunkEntry = {
  path: string;
  bytes: number;
};

/** Machine-readable baseline captured by `pnpm perf:measure`. */
export type PerformanceBaselineSnapshot = {
  capturedAt: string;
  nodeVersion: string;
  geography: {
    sourceVersion: string;
    scale: string;
    simplifyToleranceDegrees: number;
    featureCount: number;
    bundleBytes: number;
    geometry: GlobeGeometryStats;
  };
  assets: PerformanceAssetEntry[];
  build: {
    available: boolean;
    totalStaticBytes: number | null;
    largestChunks: PerformanceBuildChunkEntry[];
  };
};
