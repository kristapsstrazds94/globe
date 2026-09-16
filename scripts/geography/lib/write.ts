import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ProcessedGeographyOutput } from "./types";

export async function writeGeographyBundle(
  bundle: ProcessedGeographyOutput,
  outputPath: string,
  rootDir: string,
): Promise<string> {
  const resolvedPath = path.resolve(rootDir, outputPath);
  await mkdir(path.dirname(resolvedPath), { recursive: true });

  const sortedFeatures = [...bundle.features].sort((left, right) =>
    left.id.localeCompare(right.id),
  );

  const payload: ProcessedGeographyOutput = {
    ...bundle,
    featureCount: sortedFeatures.length,
    features: sortedFeatures,
  };

  await writeFile(resolvedPath, `${JSON.stringify(payload)}\n`, "utf8");
  return resolvedPath;
}
