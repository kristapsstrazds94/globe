import type { Country } from "@/types";

/** Deterministic alphabetical sort for accessible country browse (T041). */
export function sortCountriesByName(countries: readonly Country[]): Country[] {
  return [...countries].sort((a, b) => {
    const nameCompare = a.name.localeCompare(b.name, "en");
    if (nameCompare !== 0) {
      return nameCompare;
    }
    return a.id.localeCompare(b.id, "en");
  });
}
