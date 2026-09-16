"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { usePrefersReducedMotion } from "@/lib/hooks";
import { getFlyToCameraPosition, interpolateCameraPosition } from "@/lib/globe/cameraFlyTo";
import { useGlobeStore } from "@/stores/globeStore";

import { GLOBE_CAMERA_FLY_TO } from "./flyToConfig";
import { getCameraDistance } from "./globeControlsNavigation";
import { useGlobeControlsContext } from "./GlobeControlsContext";

type FlyAnimation = {
  from: Vector3;
  to: Vector3;
  startTime: number;
  duration: number;
};

const targetPosition = new Vector3();

/** Smooth camera transition to the selected country; cancellable by user input (T034). */
export function CountryFlyTo() {
  const { camera, gl } = useThree();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { registerFlyTo, getOrbitControls } = useGlobeControlsContext();
  const animationRef = useRef<FlyAnimation | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const prefersReducedMotionRef = useRef(prefersReducedMotion);
  const cameraRef = useRef(camera);
  const getOrbitControlsRef = useRef(getOrbitControls);

  prefersReducedMotionRef.current = prefersReducedMotion;
  cameraRef.current = camera;
  getOrbitControlsRef.current = getOrbitControls;

  const cancelFlyToRef = useRef<() => void>(() => {});
  const startFlyToRef = useRef<(countryId: string) => void>(() => {});

  cancelFlyToRef.current = () => {
    const controls = controlsRef.current ?? getOrbitControlsRef.current();
    if (!animationRef.current) {
      return;
    }

    animationRef.current = null;
    if (controls) {
      controls.enabled = true;
    }
  };

  startFlyToRef.current = (countryId: string) => {
    const controls = getOrbitControlsRef.current();
    if (!controls) {
      return;
    }

    controlsRef.current = controls;

    const distance = getCameraDistance(controls);
    const nextPosition = getFlyToCameraPosition(countryId, distance);
    if (!nextPosition) {
      return;
    }

    targetPosition.set(...nextPosition);

    if (prefersReducedMotionRef.current) {
      cancelFlyToRef.current();
      cameraRef.current.position.copy(targetPosition);
      controls.update();
      return;
    }

    animationRef.current = {
      from: cameraRef.current.position.clone(),
      to: targetPosition.clone(),
      startTime: performance.now(),
      duration: GLOBE_CAMERA_FLY_TO.durationMs,
    };
    controls.enabled = false;
  };

  useEffect(() => {
    registerFlyTo({
      cancel: () => cancelFlyToRef.current(),
      start: (countryId) => startFlyToRef.current(countryId),
    });

    return () => {
      registerFlyTo(null);
      cancelFlyToRef.current();
    };
  }, [registerFlyTo]);

  useEffect(() => {
    return useGlobeStore.subscribe((state, prevState) => {
      const selectedCountryId = state.selectedCountryId;
      const previousSelectedCountryId = prevState.selectedCountryId;
      if (selectedCountryId === null || selectedCountryId === previousSelectedCountryId) {
        return;
      }

      startFlyToRef.current(selectedCountryId);
    });
  }, []);

  useEffect(() => {
    const canvas = gl.domElement;

    const onUserIntent = () => {
      cancelFlyToRef.current();
    };

    canvas.addEventListener("pointerdown", onUserIntent);
    canvas.addEventListener("wheel", onUserIntent, { passive: true });
    canvas.addEventListener("touchstart", onUserIntent, { passive: true });

    return () => {
      canvas.removeEventListener("pointerdown", onUserIntent);
      canvas.removeEventListener("wheel", onUserIntent);
      canvas.removeEventListener("touchstart", onUserIntent);
    };
  }, [gl]);

  useFrame(() => {
    const animation = animationRef.current;
    const controls = controlsRef.current ?? getOrbitControlsRef.current();
    if (!animation || !controls) {
      return;
    }

    const elapsed = performance.now() - animation.startTime;
    const linearT = Math.min(1, elapsed / animation.duration);
    const easedT = GLOBE_CAMERA_FLY_TO.easing(linearT);

    interpolateCameraPosition(animation.from, animation.to, easedT, cameraRef.current.position);
    controls.update();

    if (linearT >= 1) {
      cancelFlyToRef.current();
    }
  });

  return null;
}
