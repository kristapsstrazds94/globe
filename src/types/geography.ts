/**
 * Runtime geography types. Heavy geometry lives in preprocessed build artifacts.
 */

export type LonLatPosition = readonly [number, number];

export type LonLatRing = readonly LonLatPosition[];

export type LonLatPolygon = readonly LonLatRing[];

export type LonLatMultiPolygon = readonly LonLatPolygon[];

export type ProcessedGeometry =
  | {
      type: "Polygon";
      coordinates: LonLatPolygon;
    }
  | {
      type: "MultiPolygon";
      coordinates: LonLatMultiPolygon;
    };

/** Compact runtime record — geometry keyed by stable country id. */
export type ProcessedCountryRecord = {
  id: string;
  name: string;
  isoA2: string;
  geometry: ProcessedGeometry;
};

export type ProcessedGeographyBundle = {
  schemaVersion: 1;
  sourceVersion: string;
  scale: string;
  simplifyToleranceDegrees: number;
  featureCount: number;
  features: ProcessedCountryRecord[];
};

/** Lightweight geometry reference for GPU layers (T023+). */
export type CountryGeometryRef = {
  countryId: string;
};
