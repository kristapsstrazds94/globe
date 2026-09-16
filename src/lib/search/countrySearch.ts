import type { Country } from "@/types";

export type CountrySearchResult = {
  country: Country;
  score: number;
};

export const MAX_COUNTRY_SEARCH_RESULTS = 8;

/** Normalize a search query for deterministic matching. */
export function normalizeSearchQuery(query: string): string {
  return query.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/\s+/g, " ");
}

function scoreLabelMatch(label: string, normalizedQuery: string): number | null {
  const normalizedLabel = normalizeSearchQuery(label);
  if (!normalizedQuery || !normalizedLabel) {
    return null;
  }

  if (normalizedLabel === normalizedQuery) {
    return 100;
  }

  if (normalizedLabel.startsWith(normalizedQuery)) {
    return 80;
  }

  if (normalizedLabel.includes(` ${normalizedQuery}`)) {
    return 60;
  }

  if (normalizedLabel.includes(normalizedQuery)) {
    return 40;
  }

  return null;
}

function scoreCountry(country: Country, normalizedQuery: string): number | null {
  const normalizedId = country.id.toLowerCase();
  if (normalizedQuery.length === 3 && normalizedId === normalizedQuery) {
    return 95;
  }

  const nameScore = scoreLabelMatch(country.name, normalizedQuery);
  let bestScore = nameScore;

  for (const alias of country.aliases ?? []) {
    const aliasScore = scoreLabelMatch(alias, normalizedQuery);
    if (aliasScore === null) {
      continue;
    }

    const adjustedAliasScore = aliasScore === 100 ? 95 : aliasScore - 5;
    bestScore = bestScore === null ? adjustedAliasScore : Math.max(bestScore, adjustedAliasScore);
  }

  return bestScore;
}

function compareSearchResults(a: CountrySearchResult, b: CountrySearchResult): number {
  if (b.score !== a.score) {
    return b.score - a.score;
  }

  const nameCompare = a.country.name.localeCompare(b.country.name, "en");
  if (nameCompare !== 0) {
    return nameCompare;
  }

  return a.country.id.localeCompare(b.country.id, "en");
}

/** Search countries by name, alias, or three-letter id. Results are deterministic. */
export function searchCountries(query: string, countries: Country[]): CountrySearchResult[] {
  const normalizedQuery = normalizeSearchQuery(query);
  if (!normalizedQuery) {
    return [];
  }

  const results: CountrySearchResult[] = [];

  for (const country of countries) {
    const score = scoreCountry(country, normalizedQuery);
    if (score === null) {
      continue;
    }

    results.push({ country, score });
  }

  return results.sort(compareSearchResults).slice(0, MAX_COUNTRY_SEARCH_RESULTS);
}
