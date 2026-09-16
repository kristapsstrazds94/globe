import { Color, Mesh, MeshStandardMaterial } from "three";

import type { CountryMaterials } from "@/components/globe/CountriesContext";
import type { CountryVisualMaterial } from "@/lib/globe/countrySelection";

type MaterialSnapshot = {
  color: Color;
  emissive: Color;
  emissiveIntensity: number;
  roughness: number;
  metalness: number;
};

type ActiveTransition = {
  material: MeshStandardMaterial;
  from: MaterialSnapshot;
  to: MaterialSnapshot;
  targetVisual: CountryVisualMaterial;
  startTime: number;
  durationMs: number;
};

const activeTransitions = new Map<Mesh, ActiveTransition>();

const scratchColor = new Color();
const scratchEmissive = new Color();

function snapshotMaterial(material: MeshStandardMaterial): MaterialSnapshot {
  return {
    color: material.color.clone(),
    emissive: material.emissive.clone(),
    emissiveIntensity: material.emissiveIntensity,
    roughness: material.roughness,
    metalness: material.metalness,
  };
}

function snapshotFromVisual(
  visual: CountryVisualMaterial,
  materials: CountryMaterials,
): MaterialSnapshot {
  const source = materials[visual];
  const snapshot: MaterialSnapshot = {
    color: new Color(),
    emissive: new Color(),
    emissiveIntensity: 0,
    roughness: source.roughness,
    metalness: source.metalness,
  };

  snapshot.color.set(source.color);
  if ("emissive" in source && source.emissive) {
    snapshot.emissive.set(source.emissive);
    snapshot.emissiveIntensity = source.emissiveIntensity ?? 0;
  }

  return snapshot;
}

function finishTransition(
  mesh: Mesh,
  materials: CountryMaterials,
  visual: CountryVisualMaterial,
): void {
  const transition = activeTransitions.get(mesh);
  if (transition) {
    transition.material.dispose();
    activeTransitions.delete(mesh);
  }

  mesh.material = materials[visual];
}

function lerpSnapshot(
  material: MeshStandardMaterial,
  from: MaterialSnapshot,
  to: MaterialSnapshot,
  t: number,
): void {
  scratchColor.copy(from.color).lerp(to.color, t);
  scratchEmissive.copy(from.emissive).lerp(to.emissive, t);
  material.color.copy(scratchColor);
  material.emissive.copy(scratchEmissive);
  material.emissiveIntensity =
    from.emissiveIntensity + (to.emissiveIntensity - from.emissiveIntensity) * t;
  material.roughness = from.roughness + (to.roughness - from.roughness) * t;
  material.metalness = from.metalness + (to.metalness - from.metalness) * t;
}

/** Begin or update a country fill crossfade on a single mesh. */
export function startCountryFillTransition(
  mesh: Mesh,
  targetVisual: CountryVisualMaterial,
  materials: CountryMaterials,
  durationMs: number,
): void {
  const sharedTarget = materials[targetVisual];
  if (mesh.material === sharedTarget) {
    return;
  }

  if (durationMs === 0) {
    finishTransition(mesh, materials, targetVisual);
    return;
  }

  const existing = activeTransitions.get(mesh);
  const fromSnapshot = existing
    ? snapshotMaterial(existing.material)
    : snapshotMaterial(mesh.material as MeshStandardMaterial);
  const toSnapshot = snapshotFromVisual(targetVisual, materials);

  let transitionMaterial = existing?.material;
  if (!transitionMaterial) {
    transitionMaterial = (mesh.material as MeshStandardMaterial).clone();
    mesh.material = transitionMaterial;
  }

  activeTransitions.set(mesh, {
    material: transitionMaterial,
    from: fromSnapshot,
    to: toSnapshot,
    targetVisual,
    startTime: performance.now(),
    durationMs,
  });
}

/** Advance active fill transitions; assigns shared materials when complete. */
export function stepCountryFillTransitions(
  now: number,
  easing: (t: number) => number,
  materials: CountryMaterials,
): void {
  for (const [mesh, transition] of activeTransitions) {
    const linearT = Math.min(1, (now - transition.startTime) / transition.durationMs);
    const easedT = easing(linearT);

    lerpSnapshot(transition.material, transition.from, transition.to, easedT);

    if (linearT >= 1) {
      finishTransition(mesh, materials, transition.targetVisual);
    }
  }
}

/** Snap all in-flight fill transitions to their targets (reduced motion). */
export function snapCountryFillTransitions(materials: CountryMaterials): void {
  for (const [mesh, transition] of activeTransitions) {
    finishTransition(mesh, materials, transition.targetVisual);
  }
}

/** Clear transition state — for tests. */
export function resetCountryFillTransitions(): void {
  for (const transition of activeTransitions.values()) {
    transition.material.dispose();
  }
  activeTransitions.clear();
}
