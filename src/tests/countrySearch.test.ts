import { describe, expect, it } from "vitest";

import { countries } from "@/data/countries";
import { normalizeSearchQuery, searchCountries } from "@/lib/search/countrySearch";

describe("normalizeSearchQuery", () => {
  it("trims, lowercases, and removes diacritics", () => {
    expect(normalizeSearchQuery("  Åland  ")).toBe("aland");
    expect(normalizeSearchQuery("Côte d'Ivoire")).toBe("cote d'ivoire");
  });

  it("collapses whitespace", () => {
    expect(normalizeSearchQuery("south   korea")).toBe("south korea");
  });
});

describe("searchCountries", () => {
  it("returns empty results for blank queries", () => {
    expect(searchCountries("", countries)).toEqual([]);
    expect(searchCountries("   ", countries)).toEqual([]);
  });

  it("matches common country names and aliases", () => {
    const norway = searchCountries("norway", countries)[0];
    expect(norway?.country.id).toBe("NOR");

    const uk = searchCountries("uk", countries)[0];
    expect(uk?.country.id).toBe("GBR");

    const america = searchCountries("america", countries)[0];
    expect(america?.country.id).toBe("USA");

    const ivoryCoast = searchCountries("ivory coast", countries)[0];
    expect(ivoryCoast?.country.id).toBe("CIV");
  });

  it("matches three-letter country ids", () => {
    const result = searchCountries("nor", countries)[0];
    expect(result?.country.id).toBe("NOR");
  });

  it("returns deterministic ordering for tied scores", () => {
    const firstPass = searchCountries("a", countries);
    const secondPass = searchCountries("a", countries);
    expect(secondPass).toEqual(firstPass);
  });

  it("ranks exact matches ahead of partial matches", () => {
    const results = searchCountries("norway", countries);
    expect(results[0]?.country.id).toBe("NOR");
    expect(results[0]?.score).toBeGreaterThan(results[1]?.score ?? 0);
  });
});
