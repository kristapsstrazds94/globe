import { validateMetadataBundle } from "@/lib/metadata/validateMetadataBundle";
import type { ProcessedMetadataBundle } from "@/types/metadata";

import metadataData from "../../public/generated/metadata/countries.json";

const validation = validateMetadataBundle(metadataData);

/** Preprocessed country metadata. Regenerate with `pnpm metadata:build`. */
export const metadataBundle: ProcessedMetadataBundle = validation.ok
  ? validation.bundle
  : {
      schemaVersion: 1,
      sourceVersion: "invalid",
      recordCount: 0,
      records: {},
    };

/** Set when build artifacts are missing or fail validation. */
export const metadataLoadError: string | null = validation.ok ? null : validation.error;
