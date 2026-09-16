"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { LineBasicMaterial, LineSegments } from "three";

import { geographyBundle } from "@/data/geography";
import { buildMergedCountryBordersBufferGeometry } from "@/lib/geo/countryBorderGeometry";
import { getBorderOpacityForCameraDistance } from "@/lib/globe/borderVisibility";

import { COUNTRY_BORDER_MATERIAL } from "./borderConfig";
import { GLOBE_CAMERA_CONSTRAINTS } from "./cameraConfig";
import { COUNTRY_BORDER_RADIUS } from "./earthConfig";

function createBorderMaterial(): LineBasicMaterial {
  return new LineBasicMaterial({
    color: COUNTRY_BORDER_MATERIAL.color,
    transparent: true,
    opacity: COUNTRY_BORDER_MATERIAL.opacity,
    depthTest: true,
    depthWrite: false,
  });
}

/** Single merged border layer — one draw call for all country outlines (T024). */
export function CountryBorders() {
  const lineRef = useRef<LineSegments>(null);
  const material = useMemo(() => createBorderMaterial(), []);

  useFrame(({ camera }) => {
    material.opacity = getBorderOpacityForCameraDistance(
      camera.position.length(),
      GLOBE_CAMERA_CONSTRAINTS.minDistance,
      GLOBE_CAMERA_CONSTRAINTS.maxDistance,
      COUNTRY_BORDER_MATERIAL.opacity,
    );
  });

  useEffect(() => {
    const line = lineRef.current;
    if (!line) {
      return;
    }

    const geometries = geographyBundle.features.map((feature) => feature.geometry);
    const geometry = buildMergedCountryBordersBufferGeometry(geometries, COUNTRY_BORDER_RADIUS);

    if (geometry === null) {
      return;
    }

    line.geometry = geometry;
    line.renderOrder = 3;

    return () => {
      geometry.dispose();
    };
  }, []);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  return <lineSegments ref={lineRef} material={material} renderOrder={3} />;
}
