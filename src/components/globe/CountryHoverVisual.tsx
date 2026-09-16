"use client";

import { useEffect, useRef } from "react";
import type { Mesh } from "three";

import { useGlobeStore } from "@/stores/globeStore";

import { useCountriesContext } from "./CountriesContext";

/** Swaps the hovered country mesh to the hover material without React re-renders per frame. */
export function CountryHoverVisual() {
  const { getCountryGroup, getCountryMaterials } = useCountriesContext();
  const hoveredMeshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const applyHover = (hoveredId: string | null) => {
      const materials = getCountryMaterials();
      const hoveredMesh = hoveredMeshRef.current;

      if (hoveredMesh && materials) {
        hoveredMesh.material = materials.default;
        hoveredMeshRef.current = null;
      }

      if (hoveredId === null || !materials) {
        return;
      }

      const group = getCountryGroup();
      if (!group) {
        return;
      }

      let nextMesh: Mesh | undefined;
      for (const child of group.children) {
        if (child.userData.countryId === hoveredId) {
          nextMesh = child as Mesh;
          break;
        }
      }

      if (!nextMesh) {
        return;
      }

      nextMesh.material = materials.hover;
      hoveredMeshRef.current = nextMesh;
    };

    applyHover(useGlobeStore.getState().hoveredCountryId);

    let previousId = useGlobeStore.getState().hoveredCountryId;

    return useGlobeStore.subscribe((state) => {
      const nextId = state.hoveredCountryId;
      if (nextId === previousId) {
        return;
      }

      previousId = nextId;
      applyHover(nextId);
    });
  }, [getCountryGroup, getCountryMaterials]);

  return null;
}
