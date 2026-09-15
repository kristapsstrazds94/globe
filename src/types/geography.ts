/**
 * Runtime geography types. Heavy geometry lives in preprocessed build artifacts.
 */
export type CountryGeometryRef = {
  countryId: string;
};

export type ProcessedGeographyBundle = {
  version: string;
  features: CountryGeometryRef[];
};
