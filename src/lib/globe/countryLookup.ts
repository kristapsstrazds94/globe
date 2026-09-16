import { geographyBundle } from "@/data/geography";

const countryNameById = new Map(
  geographyBundle.features.map((feature) => [feature.id, feature.name]),
);

/** Resolve a display name from preprocessed geography data (Natural Earth `NAME`). */
export function getCountryNameById(id: string): string | null {
  return countryNameById.get(id) ?? null;
}
