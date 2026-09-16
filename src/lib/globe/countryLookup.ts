import { countries } from "@/data/countries";
import type { Country } from "@/types";

const countryById = new Map(countries.map((country) => [country.id, country]));

/** Resolve verified country metadata by stable id (`ADM0_A3`). */
export function getCountryById(id: string): Country | null {
  return countryById.get(id) ?? null;
}

/** Resolve a display name from preprocessed geography data (Natural Earth `NAME`). */
export function getCountryNameById(id: string): string | null {
  return getCountryById(id)?.name ?? null;
}
