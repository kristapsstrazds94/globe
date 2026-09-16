"use client";

import { useEffect, useMemo, useState } from "react";
import { BufferAttribute, BufferGeometry, ShaderMaterial } from "three";

import { usePrefersReducedMotion } from "@/lib/hooks";

import {
  STARS_MATERIAL,
  STARS_RADIUS,
  STARS_SHADER,
  buildStarField,
  getStarCount,
} from "./starsConfig";

/** Realistic static star dome — varied size and color, never rotates with Earth. */
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
    const field = buildStarField(starCount, STARS_RADIUS);
    const starGeometry = new BufferGeometry();
    starGeometry.setAttribute("position", new BufferAttribute(field.positions, 3));
    starGeometry.setAttribute("aColor", new BufferAttribute(field.colors, 3));
    starGeometry.setAttribute("aSize", new BufferAttribute(field.sizes, 1));
    return starGeometry;
  }, [starCount]);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          opacity: { value: STARS_MATERIAL.opacity },
          sizeAttenuation: { value: STARS_MATERIAL.sizeAttenuation },
        },
        vertexShader: STARS_SHADER.vertex,
        fragmentShader: STARS_SHADER.fragment,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={-1} />;
}
