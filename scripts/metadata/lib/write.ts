import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { ProcessedMetadataBundle } from "./types";

export async function writeMetadataBundle(
  bundle: ProcessedMetadataBundle,
  outputPath: string,
  rootDir: string,
): Promise<string> {
  const resolvedPath = path.resolve(rootDir, outputPath);
  await mkdir(path.dirname(resolvedPath), { recursive: true });

  const sortedRecords = Object.fromEntries(
    Object.entries(bundle.records).sort(([leftId], [rightId]) => leftId.localeCompare(rightId)),
  );

  const payload: ProcessedMetadataBundle = {
    ...bundle,
    recordCount: Object.keys(sortedRecords).length,
    records: sortedRecords,
  };

  await writeFile(resolvedPath, `${JSON.stringify(payload)}\n`, "utf8");
  return resolvedPath;
}
