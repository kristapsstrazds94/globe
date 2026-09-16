"use client";

import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useState } from "react";
import { ACESFilmicToneMapping } from "three";

import { geographyLoadError } from "@/data/geography";
import { GLOBE_TONE_MAPPING } from "@/lib/design/globeTokens";
import { isWebGLAvailable } from "@/lib/webgl";
import { GlobeDataErrorState } from "@/components/ui/GlobeDataErrorState";
import { LoadingState } from "@/components/ui/LoadingState";
import { WebGLErrorState } from "@/components/ui/WebGLErrorState";

import { GLOBE_CAMERA } from "./cameraConfig";
import { GlobeErrorBoundary } from "./GlobeErrorBoundary";
import { GlobeScene } from "./GlobeScene";
import { useGlobeDpr } from "./useGlobeDpr";

const CANVAS_PROPS = {
  role: "img" as const,
  "aria-label": "Interactive world globe",
  "data-testid": "globe-canvas",
};

function reloadPage(): void {
  window.location.reload();
}

/**
 * Client-only rendering surface for R3F/Three.js (T010).
 * DOM UI lives outside this boundary — see AppShell.
 */
export function GlobeCanvas() {
  const [mounted, setMounted] = useState(false);
  const [webglLost, setWebglLost] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);
  const dpr = useGlobeDpr();

  useEffect(() => {
    setMounted(true);
  }, []);

  const remountCanvas = useCallback(() => {
    setWebglLost(false);
    setCanvasReady(false);
    setCanvasKey((key) => key + 1);
  }, []);

  const showLoading = !mounted || (!canvasReady && !webglLost && geographyLoadError === null);

  if (!mounted) {
    return (
      <div className="globe-canvas" {...CANVAS_PROPS}>
        <LoadingState />
      </div>
    );
  }

  if (geographyLoadError !== null) {
    return (
      <div className="globe-canvas" {...CANVAS_PROPS}>
        <GlobeDataErrorState onRetry={reloadPage} />
      </div>
    );
  }

  if (webglLost) {
    return (
      <div className="globe-canvas" {...CANVAS_PROPS}>
        <WebGLErrorState recoverable onRetry={remountCanvas} />
      </div>
    );
  }

  if (!isWebGLAvailable()) {
    return (
      <div className="globe-canvas" {...CANVAS_PROPS}>
        <WebGLErrorState />
      </div>
    );
  }

  return (
    <div className="globe-canvas" {...CANVAS_PROPS}>
      {showLoading ? <LoadingState /> : null}
      <GlobeErrorBoundary onRetry={remountCanvas}>
        <Canvas
          key={canvasKey}
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
            setCanvasReady(true);

            const canvas = gl.domElement;
            const onContextLost = (event: Event) => {
              event.preventDefault();
              setWebglLost(true);
              setCanvasReady(false);
            };
            canvas.addEventListener("webglcontextlost", onContextLost);
          }}
        >
          <GlobeScene />
        </Canvas>
      </GlobeErrorBoundary>
    </div>
  );
}
