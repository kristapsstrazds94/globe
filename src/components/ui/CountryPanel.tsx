"use client";

import { useEffect, useRef } from "react";

import { getCountryById } from "@/lib/globe/countryLookup";
import { isCountryPanelVisible } from "@/lib/ui/countryPanelVisibility";
import { useGlobeStore } from "@/stores/globeStore";

/** Responsive country details panel — side panel on desktop, bottom sheet on mobile. */
export function CountryPanel() {
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const isPanelOpen = useGlobeStore((state) => state.isPanelOpen);
  const setPanelOpen = useGlobeStore((state) => state.setPanelOpen);
  const country = selectedCountryId ? getCountryById(selectedCountryId) : null;
  const visible = isCountryPanelVisible(isPanelOpen, selectedCountryId, country?.name ?? null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!visible) {
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
      return;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPanelOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [visible, setPanelOpen]);

  if (!country) {
    return null;
  }

  return (
    <aside
      className={["country-panel", visible ? "country-panel--open" : ""].filter(Boolean).join(" ")}
      role="region"
      aria-labelledby="country-panel-title"
      aria-hidden={visible ? "false" : "true"}
      hidden={!visible}
    >
      <header className="country-panel__header">
        <h2 id="country-panel-title" className="country-panel__title">
          {country.name}
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="country-panel__close"
          aria-label="Close country details"
          onClick={() => setPanelOpen(false)}
        >
          Close
        </button>
      </header>
      <dl className="country-panel__meta">
        <div className="country-panel__meta-row">
          <dt className="country-panel__meta-label">Country code</dt>
          <dd className="country-panel__meta-value">{country.id}</dd>
        </div>
      </dl>
    </aside>
  );
}
