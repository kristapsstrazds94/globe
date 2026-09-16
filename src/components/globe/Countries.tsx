"use client";

import { useEffect, useMemo, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

import { geographyBundle } from "@/data/geography";
import { buildCountryBufferGeometry } from "@/lib/geo/countryGeometry";

import { COUNTRY_HOVER_MATERIAL, COUNTRY_MATERIAL } from "./countryConfig";
import { useCountriesContext } from "./CountriesContext";
import { COUNTRY_LAYER_RADIUS } from "./earthConfig";

function createCountryMaterials(): {
  default: MeshStandardMaterial;
  hover: MeshStandardMaterial;
} {
  return {
    default: new MeshStandardMaterial({
      color: COUNTRY_MATERIAL.color,
      roughness: COUNTRY_MATERIAL.roughness,
      metalness: COUNTRY_MATERIAL.metalness,
    }),
    hover: new MeshStandardMaterial({
      color: COUNTRY_HOVER_MATERIAL.color,
      roughness: COUNTRY_HOVER_MATERIAL.roughness,
      metalness: COUNTRY_HOVER_MATERIAL.metalness,
    }),
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
    };
  }, [materials]);

  return <group ref={groupRef} />;
}
