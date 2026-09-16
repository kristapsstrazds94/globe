import { Color, Mesh, MeshStandardMaterial } from "three";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { CountryMaterials } from "@/components/globe/CountriesContext";
import {
  resetCountryFillTransitions,
  startCountryFillTransition,
  stepCountryFillTransitions,
} from "@/lib/globe/countryFillTransition";
import { easeOutCubic } from "@/lib/design/interactionMotion";

function createMaterials(): CountryMaterials {
  return {
    default: new MeshStandardMaterial({ color: new Color("#111111") }),
    hover: new MeshStandardMaterial({ color: new Color("#222222") }),
    selected: new MeshStandardMaterial({
      color: new Color("#333333"),
      emissive: new Color("#444444"),
      emissiveIntensity: 0.5,
    }),
  };
}

describe("countryFillTransition", () => {
  afterEach(() => {
    resetCountryFillTransitions();
  });

  it("assigns the shared target material instantly when duration is zero", () => {
    const materials = createMaterials();
    const mesh = new Mesh(undefined, materials.default);

    startCountryFillTransition(mesh, "hover", materials, 0);

    expect(mesh.material).toBe(materials.hover);
  });

  it("crossfades toward the target material over time", () => {
    let now = 1_000;
    const nowSpy = vi.spyOn(performance, "now").mockImplementation(() => now);

    const materials = createMaterials();
    const mesh = new Mesh(undefined, materials.default);

    startCountryFillTransition(mesh, "hover", materials, 150);
    now = 1_075;
    stepCountryFillTransitions(now, easeOutCubic, materials);

    const transitionMaterial = mesh.material as MeshStandardMaterial;
    const startR = materials.default.color.r;
    const endR = materials.hover.color.r;

    expect(transitionMaterial).not.toBe(materials.default);
    expect(transitionMaterial).not.toBe(materials.hover);
    expect(transitionMaterial.color.r).toBeGreaterThan(startR);
    expect(transitionMaterial.color.r).toBeLessThan(endR);

    now = 1_150;
    stepCountryFillTransitions(now, easeOutCubic, materials);
    expect(mesh.material).toBe(materials.hover);

    nowSpy.mockRestore();
  });
});
