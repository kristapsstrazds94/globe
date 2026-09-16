"use client";

import { useCallback } from "react";

import { useGlobeControlsContext } from "@/components/globe/GlobeControlsContext";
import { useGlobeStore } from "@/stores/globeStore";

/** Select a country from DOM UI and re-fly when the same country is chosen again. */
export function useSelectCountry() {
  const { getFlyToController } = useGlobeControlsContext();
  const setSelectedCountryId = useGlobeStore((state) => state.setSelectedCountryId);

  return useCallback(
    (countryId: string) => {
      const previousSelectedCountryId = useGlobeStore.getState().selectedCountryId;
      setSelectedCountryId(countryId);
      if (previousSelectedCountryId === countryId) {
        getFlyToController()?.start(countryId);
      }
    },
    [getFlyToController, setSelectedCountryId],
  );
}
