import { Spherical, Vector3, type PerspectiveCamera } from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLOBE_CAMERA, GLOBE_CAMERA_CONSTRAINTS } from "./cameraConfig";

const offset = new Vector3();
const spherical = new Spherical();

function clampDistance(distance: number): number {
  return Math.min(
    GLOBE_CAMERA_CONSTRAINTS.maxDistance,
    Math.max(GLOBE_CAMERA_CONSTRAINTS.minDistance, distance),
  );
}

/** Orbit the camera around the controls target by azimuth/polar deltas (radians). */
export function orbitGlobeByStep(
  controls: OrbitControls,
  deltaAzimuth: number,
  deltaPolar: number,
): void {
  const camera = controls.object as PerspectiveCamera;
  offset.copy(camera.position).sub(controls.target);
  spherical.setFromVector3(offset);

  spherical.theta += deltaAzimuth;
  spherical.phi = Math.min(
    GLOBE_CAMERA_CONSTRAINTS.maxPolarAngle,
    Math.max(GLOBE_CAMERA_CONSTRAINTS.minPolarAngle, spherical.phi + deltaPolar),
  );

  offset.setFromSpherical(spherical);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

/** Dolly the camera toward or away from the target using a distance multiplier. */
export function zoomGlobeByScale(controls: OrbitControls, scale: number): void {
  const camera = controls.object as PerspectiveCamera;
  offset.copy(camera.position).sub(controls.target);
  const distance = clampDistance(offset.length() * scale);
  offset.normalize().multiplyScalar(distance);
  camera.position.copy(controls.target).add(offset);
  controls.update();
}

/** Restore the default globe camera composition. */
export function resetGlobeView(controls: OrbitControls): void {
  const camera = controls.object as PerspectiveCamera;
  camera.position.set(...GLOBE_CAMERA.position);
  controls.target.set(0, 0, 0);
  controls.update();
}

/** @internal test helper */
export function getCameraDistance(controls: OrbitControls): number {
  return controls.object.position.distanceTo(controls.target);
}
