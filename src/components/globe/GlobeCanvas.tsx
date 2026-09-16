"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { ACESFilmicToneMapping } from "three";

import { GLOBE_TONE_MAPPING } from "@/lib/design/globeTokens";
import { isWebGLAvailable } from "@/lib/webgl";
import { WebGLErrorState } from "@/components/ui/WebGLErrorState";

import { GLOBE_CAMERA } from "./cameraConfig";
import { GlobeScene } from "./GlobeScene";
import { useGlobeDpr } from "./useGlobeDpr";

const CANVAS_PROPS = {
  role: "img" as const,
  "aria-label": "Interactive world globe",
  "data-testid": "globe-canvas",
};

/**
 * Client-only rendering surface for R3F/Three.js (T010).
 * DOM UI lives outside this boundary — see AppShell.
 */
export function GlobeCanvas() {
  const [mounted, setMounted] = useState(false);
  const [webglLost, setWebglLost] = useState(false);
  const dpr = useGlobeDpr();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="globe-canvas" {...CANVAS_PROPS} />;
  }

  if (webglLost || !isWebGLAvailable()) {
    return (
      <div className="globe-canvas" {...CANVAS_PROPS}>
        <WebGLErrorState />
      </div>
    );
  }

  return (
    <div className="globe-canvas" {...CANVAS_PROPS}>
      <Canvas
        camera={{
          position: GLOBE_CAMERA.position,
          fov: GLOBE_CAMERA.fov,
          near: GLOBE_CAMERA.near,
          far: GLOBE_CAMERA.far,
        }}
        dpr={dpr}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        style={{ width: "100%", height: "100%", display: "block" }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = GLOBE_TONE_MAPPING.exposure;

          const canvas = gl.domElement;
          const onContextLost = (event: Event) => {
            event.preventDefault();
            setWebglLost(true);
          };
          canvas.addEventListener("webglcontextlost", onContextLost);
        }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
