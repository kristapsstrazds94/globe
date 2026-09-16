"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group, Mesh } from "three";

import {
  GLOBE_INTERACTION_MOTION,
  easeOutCubic,
  getInteractionDurationMs,
} from "@/lib/design/interactionMotion";
import {
  snapCountryFillTransitions,
  startCountryFillTransition,
  stepCountryFillTransitions,
} from "@/lib/globe/countryFillTransition";
import { resolveCountryVisualMaterial } from "@/lib/globe/countrySelection";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useGlobeStore } from "@/stores/globeStore";

import { useCountriesContext } from "./CountriesContext";

function findCountryMesh(group: Group, countryId: string): Mesh | undefined {
  for (const child of group.children) {
    if (child.userData.countryId === countryId) {
      return child as Mesh;
    }
  }

  return undefined;
}

function collectAffectedCountryIds(
  previousHover: string | null,
  nextHover: string | null,
  previousSelected: string | null,
  nextSelected: string | null,
): Set<string> {
  const affected = new Set<string>();

  if (previousHover !== nextHover) {
    if (previousHover) {
      affected.add(previousHover);
    }
    if (nextHover) {
      affected.add(nextHover);
    }
  }

  if (previousSelected !== nextSelected) {
    if (previousSelected) {
      affected.add(previousSelected);
    }
    if (nextSelected) {
      affected.add(nextSelected);
    }
  }

  return affected;
}

/** Hover and selection fill styling with short crossfades (T051). */
export function CountryFillVisual() {
  const { getCountryGroup, getCountryMaterials } = useCountriesContext();
  const prefersReducedMotion = usePrefersReducedMotion();
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  prefersReducedMotionRef.current = prefersReducedMotion;
  const initializedRef = useRef(false);

  useEffect(() => {
    let previousHover = useGlobeStore.getState().hoveredCountryId;
    let previousSelected = useGlobeStore.getState().selectedCountryId;

    const applyToAffected = (
      affected: Set<string>,
      hoveredCountryId: string | null,
      selectedCountryId: string | null,
    ) => {
      const materials = getCountryMaterials();
      const group = getCountryGroup();
      if (!materials || !group) {
        return;
      }

      const durationMs = getInteractionDurationMs(
        GLOBE_INTERACTION_MOTION.countryFillMs,
        prefersReducedMotionRef.current,
      );

      for (const countryId of affected) {
        const mesh = findCountryMesh(group, countryId);
        if (!mesh) {
          continue;
        }

        const visual = resolveCountryVisualMaterial(countryId, hoveredCountryId, selectedCountryId);
        startCountryFillTransition(mesh, visual, materials, durationMs);
      }
    };

    return useGlobeStore.subscribe((state) => {
      const nextHover = state.hoveredCountryId;
      const nextSelected = state.selectedCountryId;

      if (nextHover === previousHover && nextSelected === previousSelected) {
        return;
      }

      const affected = collectAffectedCountryIds(
        previousHover,
        nextHover,
        previousSelected,
        nextSelected,
      );

      previousHover = nextHover;
      previousSelected = nextSelected;

      applyToAffected(affected, nextHover, nextSelected);
    });
  }, [getCountryGroup, getCountryMaterials]);

  useEffect(() => {
    if (!prefersReducedMotion) {
      return;
    }

    const materials = getCountryMaterials();
    if (materials) {
      snapCountryFillTransitions(materials);
    }
  }, [prefersReducedMotion, getCountryMaterials]);

  useFrame(() => {
    const materials = getCountryMaterials();
    if (!materials) {
      return;
    }

    if (!initializedRef.current) {
      const group = getCountryGroup();
      if (group && group.children.length > 0) {
        initializedRef.current = true;
        const { hoveredCountryId, selectedCountryId } = useGlobeStore.getState();

        for (const child of group.children) {
          const countryId = child.userData.countryId as string;
          const visual = resolveCountryVisualMaterial(
            countryId,
            hoveredCountryId,
            selectedCountryId,
          );
          (child as Mesh).material = materials[visual];
        }
      }
    }

    stepCountryFillTransitions(performance.now(), easeOutCubic, materials);
  });

  return null;
}
