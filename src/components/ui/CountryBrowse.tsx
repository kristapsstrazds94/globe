"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

import { countries } from "@/data/countries";
import { sortCountriesByName } from "@/lib/ui/sortCountries";
import { useSelectCountry } from "@/lib/ui/useSelectCountry";
import { useGlobeStore } from "@/stores/globeStore";

type CountryBrowseContextValue = {
  open: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const CountryBrowseContext = createContext<CountryBrowseContextValue | null>(null);

function useCountryBrowseContext(): CountryBrowseContextValue {
  const context = useContext(CountryBrowseContext);
  if (!context) {
    throw new Error("CountryBrowse components must be used within CountryBrowseProvider");
  }
  return context;
}

function focusFirstCountryButton(dialog: HTMLDialogElement) {
  dialog.querySelector<HTMLButtonElement>(".country-browse__option")?.focus();
}

/** Provider for keyboard-accessible country browse dialog (T041). */
export function CountryBrowseProvider({ children }: { children: ReactNode }) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectCountry = useSelectCountry();
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const sortedCountries = useMemo(() => sortCountriesByName(countries), []);

  const closeDialog = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const openDialog = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    dialog.showModal();
    requestAnimationFrame(() => {
      focusFirstCountryButton(dialog);
    });
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleClose = () => {
      triggerRef.current?.focus();
    };

    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, []);

  const handleSelect = (countryId: string) => {
    selectCountry(countryId);
    closeDialog();
  };

  return (
    <CountryBrowseContext.Provider value={{ open: openDialog, triggerRef }}>
      {children}
      <dialog
        ref={dialogRef}
        className="country-browse"
        aria-labelledby={titleId}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
      >
        <header className="country-browse__header">
          <h2 id={titleId} className="country-browse__title">
            Browse countries
          </h2>
          <button
            type="button"
            className="country-browse__close"
            aria-label="Close country browse"
            onClick={closeDialog}
          >
            Close
          </button>
        </header>
        <ul id="country-browse-list" className="country-browse__list" role="list">
          {sortedCountries.map((country) => {
            const isSelected = country.id === selectedCountryId;
            return (
              <li key={country.id} className="country-browse__item">
                <button
                  type="button"
                  className={[
                    "country-browse__option",
                    isSelected ? "country-browse__option--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`Select ${country.name}`}
                  onClick={() => handleSelect(country.id)}
                >
                  {country.name}
                </button>
              </li>
            );
          })}
        </ul>
      </dialog>
    </CountryBrowseContext.Provider>
  );
}

/** Opens the alphabetical country list dialog. */
export function CountryBrowseTrigger() {
  const { open, triggerRef } = useCountryBrowseContext();

  return (
    <button
      ref={triggerRef}
      id="country-browse-trigger"
      type="button"
      className="country-browse__trigger"
      aria-haspopup="dialog"
      aria-controls="country-browse-list"
      aria-label="Browse countries"
      onClick={open}
    >
      <span
        aria-hidden="true"
        className="country-browse__trigger-text country-browse__trigger-text--full"
      >
        Browse countries
      </span>
      <span
        aria-hidden="true"
        className="country-browse__trigger-text country-browse__trigger-text--compact"
      >
        Browse
      </span>
    </button>
  );
}

/** Skip link for keyboard users to reach the country list without hover. */
export function CountryBrowseSkipLink() {
  const { open } = useCountryBrowseContext();

  return (
    <a
      href="#country-browse-list"
      className="globe-app__skip-link"
      onClick={(event) => {
        event.preventDefault();
        open();
      }}
    >
      Skip to country list
    </a>
  );
}
