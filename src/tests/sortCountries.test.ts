import { describe, expect, it } from "vitest";

import { countries } from "@/data/countries";
import { sortCountriesByName } from "@/lib/ui/sortCountries";
import type { Country } from "@/types";

describe("sortCountriesByName", () => {
  it("sorts countries alphabetically by name", () => {
    const sample: Country[] = [
      { id: "ZWE", name: "Zimbabwe" },
      { id: "ALB", name: "Albania" },
      { id: "NOR", name: "Norway" },
    ];

    expect(sortCountriesByName(sample).map((country) => country.id)).toEqual(["ALB", "NOR", "ZWE"]);
  });

  it("breaks ties by country id", () => {
    const sample: Country[] = [
      { id: "BBB", name: "Example" },
      { id: "AAA", name: "Example" },
    ];

    expect(sortCountriesByName(sample).map((country) => country.id)).toEqual(["AAA", "BBB"]);
  });

  it("returns deterministic ordering for the full dataset", () => {
    const firstPass = sortCountriesByName(countries);
    const secondPass = sortCountriesByName(countries);
    expect(secondPass).toEqual(firstPass);
    expect(firstPass.length).toBe(countries.length);
  });
});
