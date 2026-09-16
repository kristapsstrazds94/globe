import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { ensureRawDataset } from "./lib/download";
import { processFeatureCollection } from "./lib/process";
import { assertFeatureCollection } from "./lib/validate";
import { writeGeographyBundle } from "./lib/write";
import { PREPROCESS_CONFIG } from "./preprocess.config";
import { GEOGRAPHY_SOURCE } from "./source.config";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");

async function main(): Promise<void> {
  const fetchOnly = process.argv.includes("--fetch-only");
  const dataset = GEOGRAPHY_SOURCE.datasets[PREPROCESS_CONFIG.tier];

  console.log(
    `Geography preprocess — ${GEOGRAPHY_SOURCE.provider} ${dataset.scale}`,
  );

  const rawPath = await ensureRawDataset(dataset, rootDir);
  console.log(`Raw dataset: ${path.relative(rootDir, rawPath)}`);

  if (fetchOnly) {
    console.log("Fetch complete (--fetch-only).");
    return;
  }

  const rawText = await readFile(rawPath, "utf8");
  const parsed: unknown = JSON.parse(rawText);
  const collection = assertFeatureCollection(parsed);
  const bundle = processFeatureCollection(collection);

  const outputPath = await writeGeographyBundle(
    bundle,
    PREPROCESS_CONFIG.output.bundlePath,
    rootDir,
  );

  console.log(
    `Wrote ${bundle.featureCount} countries → ${path.relative(rootDir, outputPath)}`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Geography preprocess failed: ${message}`);
  process.exitCode = 1;
});
