/**
 * Authoritative geography source selection (T020).
 * Consumed by the preprocessing pipeline in T021+.
 */

export type GeographyDatasetTier = "primary" | "lowDetail";

export type GeographyDataset = {
  tier: GeographyDatasetTier;
  name: string;
  scale: string;
  resolutionMeters: number;
  format: "GeoJSON";
  version: string;
  url: string;
  localPath: string;
  approximateFeatureCount: number;
  approximateUncompressedBytes: number;
};

export type GeographySourceConfig = {
  provider: string;
  theme: string;
  version: string;
  releaseDate: string;
  license: string;
  licenseUrl: string;
  attributionRequired: boolean;
  attributionText: string;
  datasets: Record<GeographyDatasetTier, GeographyDataset>;
  identifiers: {
    /** Stable internal primary key — never a sentinel value in source data. */
    primary: "ADM0_A3";
    /** Preferred ISO 3166-1 alpha-3 for external metadata joins. */
    externalJoin: "ISO_A3_EH";
    /** Short cartographic label — not suitable as a primary key. */
    displayName: "NAME";
    longName: "NAME_LONG";
    region: "CONTINENT";
    subregion: "SUBREGION";
  };
  geometryTypes: readonly ["Polygon", "MultiPolygon"];
  boundaryConvention: "de_facto";
  countryDefinition: string;
  disputedTerritoriesNote: string;
  knownLimitations: readonly string[];
};

export const GEOGRAPHY_SOURCE: GeographySourceConfig = {
  provider: "Natural Earth",
  theme: "Admin 0 – Countries",
  version: "5.1.1",
  releaseDate: "2022-05",
  license: "Public Domain",
  licenseUrl: "https://www.naturalearthdata.com/about/terms-of-use/",
  attributionRequired: false,
  attributionText: "Made with Natural Earth.",
  datasets: {
    primary: {
      tier: "primary",
      name: "ne_50m_admin_0_countries",
      scale: "1:50m",
      resolutionMeters: 50_000,
      format: "GeoJSON",
      version: "5.1.1",
      url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_50m_admin_0_countries.geojson",
      localPath: "scripts/geography/raw/ne_50m_admin_0_countries.geojson",
      approximateFeatureCount: 258,
      approximateUncompressedBytes: 800_000,
    },
    lowDetail: {
      tier: "lowDetail",
      name: "ne_110m_admin_0_countries",
      scale: "1:110m",
      resolutionMeters: 110_000,
      format: "GeoJSON",
      version: "5.1.1",
      url: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.1/geojson/ne_110m_admin_0_countries.geojson",
      localPath: "scripts/geography/raw/ne_110m_admin_0_countries.geojson",
      approximateFeatureCount: 177,
      approximateUncompressedBytes: 210_000,
    },
  },
  identifiers: {
    primary: "ADM0_A3",
    externalJoin: "ISO_A3_EH",
    displayName: "NAME",
    longName: "NAME_LONG",
    region: "CONTINENT",
    subregion: "SUBREGION",
  },
  geometryTypes: ["Polygon", "MultiPolygon"],
  boundaryConvention: "de_facto",
  countryDefinition:
    "Natural Earth Admin 0 map units at metropolitan/homeland granularity. Greenland is separate from Denmark; French overseas regions are not broken out as separate units in this theme.",
  disputedTerritoriesNote:
    "Boundaries follow de facto control (who holds the territory on the ground), not de jure claims. Disputed areas may appear merged with the administering unit. A separate Natural Earth disputed-areas theme exists for alternative political views.",
  knownLimitations: [
    "Raw ISO_A3 and ISO_A2 use -99 for France, Norway, Kosovo, Northern Cyprus, and Somaliland — use ISO_A3_EH / ISO_A2_EH for external joins.",
    "50m/110m scales omit the smallest islands and simplify coastlines; additional simplification happens at build time.",
    "Countries crossing the antimeridian (e.g. Russia, Fiji, United States) require preprocessing before sphere tessellation.",
    "Population/GDP and other thematic attributes in the source are vintage estimates — not verified product metadata.",
  ],
} as const;
