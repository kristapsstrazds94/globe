"use client";

import { useEffect, useMemo, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

import { geographyBundle } from "@/data/geography";
import { buildCountryBufferGeometry } from "@/lib/geo/countryGeometry";

import {
  COUNTRY_HOVER_MATERIAL,
  COUNTRY_MATERIAL,
  COUNTRY_SELECTION_MATERIAL,
  type CountryFillMaterialConfig,
} from "./countryConfig";
import { useCountriesContext } from "./CountriesContext";
import type { CountryMaterials } from "./CountriesContext";
import { COUNTRY_LAYER_RADIUS } from "./earthConfig";

function createCountryMaterial(config: CountryFillMaterialConfig): MeshStandardMaterial {
  const material = new MeshStandardMaterial({
    color: config.color,
    roughness: config.roughness,
    metalness: config.metalness,
    depthWrite: true,
  });

  if ("emissive" in config && config.emissive) {
    material.emissive.set(config.emissive);
    material.emissiveIntensity = config.emissiveIntensity ?? 0;
  }

  return material;
}

function createCountryMaterials(): CountryMaterials {
  return {
    default: createCountryMaterial(COUNTRY_MATERIAL),
    hover: createCountryMaterial(COUNTRY_HOVER_MATERIAL),
    selected: createCountryMaterial(COUNTRY_SELECTION_MATERIAL),
  };
}

function buildCountryMeshes(material: MeshStandardMaterial): Mesh[] {
  const meshes: Mesh[] = [];

  for (const feature of geographyBundle.features) {
    const geometry = buildCountryBufferGeometry(feature.geometry, COUNTRY_LAYER_RADIUS);

    if (geometry === null) {
      continue;
    }

    const mesh = new Mesh(geometry, material);
    mesh.userData.countryId = feature.id;
    mesh.name = feature.id;
    mesh.renderOrder = 1;
    mesh.frustumCulled = false;
    meshes.push(mesh);
  }

  return meshes;
}

/** Country fill layer — one Three.js mesh per country for picking (T030). */
export function Countries() {
  const groupRef = useRef<Group>(null);
  const { register, registerMaterials } = useCountriesContext();
  const materials = useMemo(() => createCountryMaterials(), []);

  useEffect(() => {
    register(groupRef.current);
    registerMaterials(materials);
    return () => {
      register(null);
      registerMaterials(null);
    };
  }, [materials, register, registerMaterials]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const meshes = buildCountryMeshes(materials.default);
    group.add(...meshes);

    return () => {
      for (const mesh of meshes) {
        mesh.geometry.dispose();
        group.remove(mesh);
      }
    };
  }, [materials.default]);

  useEffect(() => {
    return () => {
      materials.default.dispose();
      materials.hover.dispose();
      materials.selected.dispose();
    };
  }, [materials]);

  return <group ref={groupRef} />;
}
