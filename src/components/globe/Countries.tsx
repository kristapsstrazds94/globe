"use client";

import { useEffect, useMemo, useRef } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

import { geographyBundle } from "@/data/geography";
import { buildCountryBufferGeometry } from "@/lib/geo/countryGeometry";

import { COUNTRY_MATERIAL } from "./countryConfig";
import { COUNTRY_LAYER_RADIUS } from "./earthConfig";

function createCountryMaterial(): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: COUNTRY_MATERIAL.color,
    roughness: COUNTRY_MATERIAL.roughness,
    metalness: COUNTRY_MATERIAL.metalness,
  });
}

function buildCountryMeshes(material: MeshStandardMaterial): Mesh[] {
  const meshes: Mesh[] = [];

  for (const feature of geographyBundle.features) {
    const geometry = buildCountryBufferGeometry(
      feature.geometry,
      COUNTRY_LAYER_RADIUS,
    );

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

/** Country fill layer — one Three.js mesh per country for future picking (T030). */
export function Countries() {
  const groupRef = useRef<Group>(null);
  const material = useMemo(() => createCountryMaterial(), []);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    const meshes = buildCountryMeshes(material);
    group.add(...meshes);

    return () => {
      for (const mesh of meshes) {
        mesh.geometry.dispose();
        group.remove(mesh);
      }
    };
  }, [material]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return <group ref={groupRef} />;
}
