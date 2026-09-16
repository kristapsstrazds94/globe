import type { Country } from "@/types";
import { countrySearchAliases } from "@/lib/search/countrySearchAliases";

import { geographyBundle } from "./geography";

/** Verified metadata (id + display name) derived from preprocessed Natural Earth geography. */
export const countries: Country[] = geographyBundle.features.map((feature) => ({
  id: feature.id,
  name: feature.name,
  isoA2: feature.isoA2,
  aliases: countrySearchAliases[feature.id],
}));
