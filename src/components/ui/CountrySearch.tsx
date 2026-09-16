"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

import { countries } from "@/data/countries";
import { searchCountries } from "@/lib/search/countrySearch";
import { useSelectCountry } from "@/lib/ui/useSelectCountry";
import { useGlobeStore } from "@/stores/globeStore";

/** Fast country search with keyboard navigation (T040). */
export function CountrySearch() {
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectCountryFromUI = useSelectCountry();
  const setSearchQuery = useGlobeStore((state) => state.setSearchQuery);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const results = useMemo(() => searchCountries(query, countries), [query]);
  const showResults = isOpen && query.trim().length > 0 && results.length > 0;

  const selectCountry = useCallback(
    (countryId: string) => {
      selectCountryFromUI(countryId);
      setQuery("");
      setSearchQuery("");
      setActiveIndex(-1);
      setIsOpen(false);
      inputRef.current?.blur();
    },
    [selectCountryFromUI, setSearchQuery],
  );

  useEffect(() => {
    setSearchQuery(query);
  }, [query, setSearchQuery]);

  useEffect(() => {
    if (!showResults) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex >= results.length) {
        return results.length - 1;
      }
      return currentIndex;
    });
  }, [results.length, showResults]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      if (!showResults) {
        return;
      }

      event.preventDefault();
      setActiveIndex((currentIndex) => {
        const nextIndex = currentIndex + 1;
        return nextIndex >= results.length ? 0 : nextIndex;
      });
      return;
    }

    if (event.key === "ArrowUp") {
      if (!showResults) {
        return;
      }

      event.preventDefault();
      setActiveIndex((currentIndex) => {
        if (currentIndex <= 0) {
          return results.length - 1;
        }
        return currentIndex - 1;
      });
      return;
    }

    if (event.key === "Enter") {
      if (!showResults) {
        return;
      }

      event.preventDefault();
      const selected = results[activeIndex >= 0 ? activeIndex : 0];
      if (selected) {
        selectCountry(selected.country.id);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div ref={containerRef} className="country-search">
      <label className="country-search__label" htmlFor={`${listboxId}-input`}>
        Search countries
      </label>
      <input
        ref={inputRef}
        id={`${listboxId}-input`}
        className="country-search__input"
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={showResults}
        aria-controls={showResults ? `${listboxId}-listbox` : undefined}
        aria-activedescendant={
          showResults && activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
        }
        aria-describedby="globe-app-instructions"
        placeholder="Search countries"
        autoComplete="off"
        spellCheck={false}
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
      />
      {showResults ? (
        <ul
          id={`${listboxId}-listbox`}
          className="country-search__results"
          role="listbox"
          aria-label="Country search results"
        >
          {results.map((result, index) => (
            <li
              key={result.country.id}
              id={`${listboxId}-option-${index}`}
              className={[
                "country-search__option",
                index === activeIndex ? "country-search__option--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              role="option"
              aria-selected={index === activeIndex}
            >
              <button
                type="button"
                className="country-search__option-button"
                aria-label={`Select ${result.country.name}`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectCountry(result.country.id)}
              >
                {result.country.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
