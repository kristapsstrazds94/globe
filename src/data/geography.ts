import type { ProcessedGeographyBundle } from "@/types";

import countriesData from "../../public/generated/geography/countries.json";

/** Preprocessed runtime geography bundle. Regenerate with `pnpm geography:build`. */
export const geographyBundle = countriesData as unknown as ProcessedGeographyBundle;
