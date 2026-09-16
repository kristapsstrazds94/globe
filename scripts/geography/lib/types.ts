import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";

export type RawCountryFeature = Feature<Polygon | MultiPolygon>;

export type RawCountryFeatureCollection = FeatureCollection<Polygon | MultiPolygon>;

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

/** Compact runtime record — geometry only, metadata joins by `id`. */
export type ProcessedCountryRecord = {
  id: string;
  name: string;
  isoA2: string;
  geometry: ProcessedGeometry;
};

export type ProcessedGeographyOutput = {
  schemaVersion: 1;
  sourceVersion: string;
  scale: string;
  simplifyToleranceDegrees: number;
  featureCount: number;
  features: ProcessedCountryRecord[];
};
