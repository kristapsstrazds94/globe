"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  PointsMaterial,
} from "three";

import { usePrefersReducedMotion } from "@/lib/hooks";

import {
  STARS_MATERIAL,
  STARS_RADIUS,
  buildStarPositions,
  getStarCount,
} from "./starsConfig";

/** Subtle static star dome — scene-root sibling so it never rotates with Earth. */
export function Stars() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [viewportWidth, setViewportWidth] = useState(
    typeof window === "undefined" ? 1024 : window.innerWidth,
  );

  useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const starCount = getStarCount(viewportWidth, prefersReducedMotion);

  const geometry = useMemo(() => {
    const positions = buildStarPositions(starCount, STARS_RADIUS);
    const starGeometry = new BufferGeometry();
    starGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    return starGeometry;
  }, [starCount]);

  const material = useMemo(
    () =>
      new PointsMaterial({
        color: STARS_MATERIAL.color,
        size: STARS_MATERIAL.size,
        transparent: true,
        opacity: STARS_MATERIAL.opacity,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return (
    <points
      geometry={geometry}
      material={material}
      frustumCulled={false}
      renderOrder={-1}
    />
  );
}
