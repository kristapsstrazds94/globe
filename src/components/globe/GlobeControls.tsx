"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { usePrefersReducedMotion } from "@/lib/hooks";

import { GLOBE_CAMERA_CONSTRAINTS } from "./cameraConfig";
import { GLOBE_CONTROLS } from "./controlsConfig";
import {
  orbitGlobeByStep,
  resetGlobeView,
  zoomGlobeByScale,
} from "./globeControlsNavigation";
import { useGlobeControlsContext } from "./GlobeControlsContext";

function applyDamping(
  controls: ThreeOrbitControls,
  prefersReducedMotion: boolean,
): void {
  controls.enableDamping = !prefersReducedMotion;
  controls.dampingFactor = prefersReducedMotion ? 0 : GLOBE_CONTROLS.dampingFactor;
}

/** Pointer, touch, and wheel/pinch orbit controls with camera limits (T014). */
export function GlobeControls() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<ThreeOrbitControls | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { register } = useGlobeControlsContext();

  useEffect(() => {
    const controls = new ThreeOrbitControls(camera, gl.domElement);
    controls.target.set(0, 0, 0);
    controls.enablePan = false;
    controls.rotateSpeed = GLOBE_CONTROLS.rotateSpeed;
    controls.zoomSpeed = GLOBE_CONTROLS.zoomSpeed;
    controls.minDistance = GLOBE_CAMERA_CONSTRAINTS.minDistance;
    controls.maxDistance = GLOBE_CAMERA_CONSTRAINTS.maxDistance;
    controls.minPolarAngle = GLOBE_CAMERA_CONSTRAINTS.minPolarAngle;
    controls.maxPolarAngle = GLOBE_CAMERA_CONSTRAINTS.maxPolarAngle;
    controls.saveState();
    controlsRef.current = controls;

    gl.domElement.tabIndex = 0;

    const step = GLOBE_CONTROLS.keyboardRotateStep;
    const zoomScale = GLOBE_CONTROLS.keyboardZoomScale;

    const api = {
      rotateLeft: () => orbitGlobeByStep(controls, step, 0),
      rotateRight: () => orbitGlobeByStep(controls, -step, 0),
      rotateUp: () => orbitGlobeByStep(controls, 0, -step),
      rotateDown: () => orbitGlobeByStep(controls, 0, step),
      zoomIn: () => zoomGlobeByScale(controls, 1 / zoomScale),
      zoomOut: () => zoomGlobeByScale(controls, zoomScale),
      reset: () => resetGlobeView(controls),
    };

    register(api);

    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          api.rotateLeft();
          break;
        case "ArrowRight":
          event.preventDefault();
          api.rotateRight();
          break;
        case "ArrowUp":
          event.preventDefault();
          api.rotateUp();
          break;
        case "ArrowDown":
          event.preventDefault();
          api.rotateDown();
          break;
        case "+":
        case "=":
          event.preventDefault();
          api.zoomIn();
          break;
        case "-":
        case "_":
          event.preventDefault();
          api.zoomOut();
          break;
        case "Home":
          event.preventDefault();
          api.reset();
          break;
        default:
          break;
      }
    };

    gl.domElement.addEventListener("keydown", onKeyDown);

    return () => {
      gl.domElement.removeEventListener("keydown", onKeyDown);
      controls.dispose();
      controlsRef.current = null;
      register(null);
    };
  }, [camera, gl, register]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    applyDamping(controls, prefersReducedMotion);
  }, [prefersReducedMotion]);

  useFrame(() => {
    controlsRef.current?.update();
  });

  return null;
}
