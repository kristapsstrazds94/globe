"use client";

import { useEffect, useRef, useState } from "react";

import { CloseIcon } from "@/components/ui/CloseIcon";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { CountryPanelMeta } from "@/components/ui/CountryPanelMeta";
import { getCountryPanelTransitionMs } from "@/lib/design/interactionMotion";
import { getCountryById } from "@/lib/globe/countryLookup";
import { isCountryPanelVisible } from "@/lib/ui/countryPanelVisibility";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useGlobeStore } from "@/stores/globeStore";
import type { Country } from "@/types";

/** Responsive country details panel — side panel on desktop, bottom sheet on mobile. */
export function CountryPanel() {
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const isPanelOpen = useGlobeStore((state) => state.isPanelOpen);
  const setPanelOpen = useGlobeStore((state) => state.setPanelOpen);
  const prefersReducedMotion = usePrefersReducedMotion();
  const country = selectedCountryId ? getCountryById(selectedCountryId) : null;
  const visible = isCountryPanelVisible(isPanelOpen, selectedCountryId, country?.name ?? null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const lastCountryRef = useRef<Country | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [hasOpenClass, setHasOpenClass] = useState(false);

  if (country) {
    lastCountryRef.current = country;
  }

  const displayCountry = country ?? lastCountryRef.current;
  const shouldRender = visible || isClosing;
  const panelTransitionMs = getCountryPanelTransitionMs(prefersReducedMotion);

  useEffect(() => {
    if (visible) {
      setIsClosing(false);
      setHasOpenClass(false);
      const frame = requestAnimationFrame(() => {
        setHasOpenClass(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    setHasOpenClass(false);

    if (lastCountryRef.current) {
      setIsClosing(true);
      const timer = window.setTimeout(() => {
        setIsClosing(false);
        lastCountryRef.current = null;
      }, panelTransitionMs);
      return () => window.clearTimeout(timer);
    }

    setIsClosing(false);
    return undefined;
  }, [visible, panelTransitionMs]);

  useEffect(() => {
    if (!visible || !hasOpenClass) {
      if (!visible && previousFocusRef.current) {
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
  }, [visible, hasOpenClass, setPanelOpen]);

  if (!shouldRender || !displayCountry) {
    return null;
  }

  return (
    <aside
      className={["country-panel", hasOpenClass ? "country-panel--open" : ""]
        .filter(Boolean)
        .join(" ")}
      role="region"
      aria-labelledby="country-panel-title"
      aria-hidden={hasOpenClass ? "false" : "true"}
    >
      <header className="country-panel__header">
        <h2 id="country-panel-title" className="country-panel__title">
          <CountryFlag isoA2={displayCountry.isoA2} className="country-panel__flag" />
          <span className="country-panel__name">{displayCountry.name}</span>
        </h2>
        <button
          ref={closeButtonRef}
          type="button"
          className="country-panel__close"
          aria-label="Close country details"
          onClick={() => setPanelOpen(false)}
        >
          <CloseIcon className="country-panel__close-icon" />
        </button>
      </header>
      <CountryPanelMeta country={displayCountry} />
    </aside>
  );
}
