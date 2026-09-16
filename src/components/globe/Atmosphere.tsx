"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Color,
  NormalBlending,
  ShaderMaterial,
  SphereGeometry,
} from "three";

import { usePrefersReducedMotion } from "@/lib/hooks";

import {
  ATMOSPHERE_GLOW_COLOR,
  ATMOSPHERE_SHADER,
  getAtmosphereSettings,
} from "./atmosphereConfig";
import { ATMOSPHERE_RADIUS } from "./earthConfig";

/** Subtle Fresnel rim shell — quality tier adapts to viewport and reduced motion. */
export function Atmosphere() {
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

  const settings = getAtmosphereSettings(viewportWidth, prefersReducedMotion);

  const geometry = useMemo(
    () =>
      new SphereGeometry(
        ATMOSPHERE_RADIUS,
        settings.segments,
        settings.segments,
      ),
    [settings.segments],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          glowColor: { value: new Color(ATMOSPHERE_GLOW_COLOR) },
          intensity: { value: settings.intensity },
          power: { value: settings.power },
        },
        vertexShader: ATMOSPHERE_SHADER.vertex,
        fragmentShader: ATMOSPHERE_SHADER.fragment,
        transparent: true,
        depthWrite: false,
        blending: NormalBlending,
      }),
    [settings.intensity, settings.power],
  );

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  if (!settings.enabled) {
    return null;
  }

  return (
    <mesh geometry={geometry} material={material} renderOrder={1} />
  );
}
