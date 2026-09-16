"use client";

import { useEffect, useMemo } from "react";
import { MeshStandardMaterial, SphereGeometry } from "three";

import { EARTH_GEOMETRY, EARTH_MATERIAL } from "./earthConfig";

/** Base Earth sphere — countries, atmosphere, and stars layer on top in later tasks. */
export function Earth() {
  const geometry = useMemo(
    () =>
      new SphereGeometry(
        EARTH_GEOMETRY.radius,
        EARTH_GEOMETRY.widthSegments,
        EARTH_GEOMETRY.heightSegments,
      ),
    [],
  );

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        color: EARTH_MATERIAL.color,
        roughness: EARTH_MATERIAL.roughness,
        metalness: EARTH_MATERIAL.metalness,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <mesh geometry={geometry} material={material} renderOrder={0} />;
}
