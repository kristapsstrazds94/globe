"use client";

import { useEffect, useRef } from "react";
import type { Mesh } from "three";

import { resolveCountryVisualMaterial } from "@/lib/globe/countrySelection";
import { useGlobeStore } from "@/stores/globeStore";

import { useCountriesContext } from "./CountriesContext";

/** Applies persistent selected styling without React re-renders per frame (T032). */
export function CountrySelectionVisual() {
  const { getCountryGroup, getCountryMaterials } = useCountriesContext();
  const selectedMeshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const applySelected = (selectedId: string | null) => {
      const materials = getCountryMaterials();
      const selectedMesh = selectedMeshRef.current;

      if (selectedMesh && materials) {
        const countryId = selectedMesh.userData.countryId as string;
        const { hoveredCountryId } = useGlobeStore.getState();
        const visual = resolveCountryVisualMaterial(countryId, hoveredCountryId, null);
        selectedMesh.material = materials[visual];
        selectedMeshRef.current = null;
      }

      if (selectedId === null || !materials) {
        return;
      }

      const group = getCountryGroup();
      if (!group) {
        return;
      }

      let nextMesh: Mesh | undefined;
      for (const child of group.children) {
        if (child.userData.countryId === selectedId) {
          nextMesh = child as Mesh;
          break;
        }
      }

      if (!nextMesh) {
        return;
      }

      nextMesh.material = materials.selected;
      selectedMeshRef.current = nextMesh;
    };

    applySelected(useGlobeStore.getState().selectedCountryId);

    let previousId = useGlobeStore.getState().selectedCountryId;

    return useGlobeStore.subscribe((state) => {
      const nextId = state.selectedCountryId;
      if (nextId === previousId) {
        return;
      }

      previousId = nextId;
      applySelected(nextId);
    });
  }, [getCountryGroup, getCountryMaterials]);

  return null;
}
