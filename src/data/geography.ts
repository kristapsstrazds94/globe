import type { ProcessedGeographyBundle } from "@/types";
import { validateGeographyBundle } from "@/lib/geo/validateGeographyBundle";

import countriesData from "../../public/generated/geography/countries.json";

const validation = validateGeographyBundle(countriesData);

/** Preprocessed runtime geography bundle. Regenerate with `pnpm geography:build`. */
export const geographyBundle: ProcessedGeographyBundle = validation.ok
  ? validation.bundle
  : {
      schemaVersion: 1,
      sourceVersion: "invalid",
      scale: "unknown",
      simplifyToleranceDegrees: 0,
      featureCount: 0,
      features: [],
    };

/** Set when build artifacts are missing or fail validation — see GlobeCanvas (T052). */
export const geographyLoadError: string | null = validation.ok ? null : validation.error;
