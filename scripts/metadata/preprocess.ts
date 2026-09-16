import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { joinCountryMetadata } from "./lib/join";
import { loadFactbookAreas } from "./lib/loadFactbook";
import { loadMetadataSources } from "./lib/loadSources";
import type { ProcessedMetadataBundle } from "./lib/types";
import { writeMetadataBundle } from "./lib/write";
import { METADATA_PREPROCESS_CONFIG } from "./preprocess.config";
import { METADATA_SOURCES } from "./source.config";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "../..");

type GeographyFeature = {
  id: string;
  isoA2: string;
};

async function loadGeographyFeatures(): Promise<GeographyFeature[]> {
  const geographyPath = path.resolve(rootDir, "public/generated/geography/countries.json");
  const rawText = await readFile(geographyPath, "utf8");
  const parsed = JSON.parse(rawText) as { features?: GeographyFeature[] };

  if (!Array.isArray(parsed.features) || parsed.features.length === 0) {
    throw new Error("Geography bundle is missing or empty. Run `pnpm geography:build` first.");
  }

  return parsed.features.map((feature) => ({
    id: feature.id,
    isoA2: feature.isoA2,
  }));
}

async function main(): Promise<void> {
  console.log("Country metadata preprocess");

  const features = await loadGeographyFeatures();
  const sources = loadMetadataSources();
  const factbook = await loadFactbookAreas();
  const records: ProcessedMetadataBundle["records"] = {};

  for (const feature of features) {
    const metadata = joinCountryMetadata(
      feature,
      sources.geographyByCca3,
      sources.geographyByCca2,
      sources.populationByIso3,
      sources.populationByIso2,
      sources.climateByAlpha2,
      factbook.areaByIsoA2,
    );

    if (metadata) {
      records[feature.id] = metadata;
    }
  }

  const bundle: ProcessedMetadataBundle = {
    schemaVersion: 1,
    sourceVersion: `${METADATA_SOURCES.geography.languages.version}+${METADATA_SOURCES.geography.population.version}+${METADATA_SOURCES.geography.climate.version}+${METADATA_SOURCES.geography.area.version}`,
    sources: METADATA_SOURCES.geography,
    recordCount: Object.keys(records).length,
    records,
  };

  const outputPath = await writeMetadataBundle(
    bundle,
    METADATA_PREPROCESS_CONFIG.output.bundlePath,
    rootDir,
  );

  console.log(
    `Wrote ${bundle.recordCount} metadata records → ${path.relative(rootDir, outputPath)}`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Country metadata preprocess failed: ${message}`);
  process.exitCode = 1;
});
