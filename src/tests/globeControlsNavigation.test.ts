import { describe, expect, it } from "vitest";
import { PerspectiveCamera, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { GLOBE_CAMERA, GLOBE_CAMERA_CONSTRAINTS } from "@/components/globe/cameraConfig";
import {
  getCameraDistance,
  orbitGlobeByStep,
  resetGlobeView,
  zoomGlobeByScale,
} from "@/components/globe/globeControlsNavigation";

function createControls() {
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(...GLOBE_CAMERA.position);
  const controls = new OrbitControls(camera);
  controls.target.set(0, 0, 0);
  controls.minDistance = GLOBE_CAMERA_CONSTRAINTS.minDistance;
  controls.maxDistance = GLOBE_CAMERA_CONSTRAINTS.maxDistance;
  controls.minPolarAngle = GLOBE_CAMERA_CONSTRAINTS.minPolarAngle;
  controls.maxPolarAngle = GLOBE_CAMERA_CONSTRAINTS.maxPolarAngle;
  controls.update();
  return controls;
}

describe("globeControlsNavigation", () => {
  it("orbits the camera around the target", () => {
    const controls = createControls();
    const before = controls.object.position.clone();

    orbitGlobeByStep(controls, 0.2, 0);

    expect(controls.object.position.equals(before)).toBe(false);
    expect(controls.object.position.distanceTo(controls.target)).toBeCloseTo(
      before.distanceTo(controls.target),
      5,
    );
  });

  it("clamps zoom distance to configured bounds", () => {
    const controls = createControls();

    for (let index = 0; index < 40; index += 1) {
      zoomGlobeByScale(controls, 0.5);
    }

    expect(getCameraDistance(controls)).toBeGreaterThanOrEqual(
      GLOBE_CAMERA_CONSTRAINTS.minDistance,
    );

    for (let index = 0; index < 40; index += 1) {
      zoomGlobeByScale(controls, 2);
    }

    expect(getCameraDistance(controls)).toBeLessThanOrEqual(GLOBE_CAMERA_CONSTRAINTS.maxDistance);
  });

  it("resets to the default camera composition", () => {
    const controls = createControls();
    orbitGlobeByStep(controls, 1.2, 0.4);
    zoomGlobeByScale(controls, 0.6);

    resetGlobeView(controls);

    expect(controls.object.position.x).toBeCloseTo(GLOBE_CAMERA.position[0]);
    expect(controls.object.position.y).toBeCloseTo(GLOBE_CAMERA.position[1]);
    expect(controls.object.position.z).toBeCloseTo(GLOBE_CAMERA.position[2]);
    expect(controls.target.equals(new Vector3(0, 0, 0))).toBe(true);
  });
});
