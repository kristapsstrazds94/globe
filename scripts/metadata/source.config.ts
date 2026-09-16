/**
 * Authoritative country metadata sources for build-time enrichment.
 * Runtime reads preprocessed JSON only — no third-party API calls.
 */

export type MetadataSource = {
  packageName: string;
  version: string;
  license: string;
  licenseUrl: string;
  role: string;
  url: string;
};

export const METADATA_SOURCES = {
  geography: {
    languages: {
      packageName: "world-countries",
      version: "5.1.0",
      license: "Open Database License (ODbL) v1.0",
      licenseUrl: "https://opendatacommons.org/licenses/odbl/1-0/",
      role: "Official languages, land area, capital, region, subregion, and currencies (ISO 3166-1).",
      url: "https://github.com/mledoze/countries",
    },
    population: {
      packageName: "world-location-data",
      version: "1.0.0",
      license: "MIT",
      licenseUrl: "https://opensource.org/licenses/MIT",
      role: "Population, GDP (USD millions), and timezones keyed by ISO 3166-1 alpha-2/alpha-3.",
      url: "https://www.npmjs.com/package/world-location-data",
    },
    climate: {
      packageName: "@sil/data",
      version: "0.1.13",
      license: "MIT",
      licenseUrl: "https://opensource.org/licenses/MIT",
      role: "Country-level climate zone and mean annual temperature (°C).",
      url: "https://www.npmjs.com/package/@sil/data",
    },
    area: {
      packageName: "factbook.json",
      version: "1.0.0",
      license: "Public Domain",
      licenseUrl: "https://github.com/factbook/factbook.json",
      role: "Total, land, and water area with derived land/water percentages (CIA World Factbook).",
      url: "https://www.npmjs.com/package/factbook.json",
    },
  },
} as const satisfies Record<string, Record<string, MetadataSource>>;

/** Natural Earth map units where ISO_A2_EH points at a sovereign state but metadata must not. */
export const ISO_A2_FALLBACK_BLOCKLIST = new Set([
  "ATC", // Ashmore and Cartier Islands — shares AU
  "IOA", // Indian Ocean Territories — shares AU
]);
