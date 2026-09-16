import { PerspectiveCamera, Vector3 } from "three";
import { describe, expect, it } from "vitest";

import { GLOBE_CAMERA } from "@/components/globe/cameraConfig";
import { GLOBE_CAMERA_VIEW, GLOBE_GEO_SCALE } from "@/components/globe/earthConfig";
import { lonLatToSpherePoint } from "@/lib/geo/coordinates";

/** Project a lon/lat through the globe group transforms and default camera. */
function projectToScreen(longitude: number, latitude: number): Vector3 {
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(...GLOBE_CAMERA.position);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const point = new Vector3(...lonLatToSpherePoint(longitude, latitude, 1.002));
  point.multiply(new Vector3(...GLOBE_GEO_SCALE));
  point.project(camera);

  return point;
}

describe("geographic orientation at default view", () => {
  it("centers the configured view on screen", () => {
    const center = projectToScreen(GLOBE_CAMERA_VIEW.longitude, GLOBE_CAMERA_VIEW.latitude);

    expect(Math.abs(center.x)).toBeLessThan(0.05);
    expect(Math.abs(center.y)).toBeLessThan(0.05);
  });

  it("places western Europe left of the Horn of Africa", () => {
    const spain = projectToScreen(-5, 40);
    const horn = projectToScreen(48, 10);

    expect(spain.x).toBeLessThan(horn.x);
  });

  it("places the UK east of Iberia and west of the Horn", () => {
    const spain = projectToScreen(-5, 40);
    const uk = projectToScreen(-3, 52);
    const horn = projectToScreen(48, 10);

    expect(uk.x).toBeGreaterThan(spain.x);
    expect(uk.x).toBeLessThan(horn.x);
  });

  it("places India east of the Horn of Africa", () => {
    const horn = projectToScreen(48, 10);
    const india = projectToScreen(78, 20);

    expect(horn.x).toBeLessThan(india.x);
  });

  it("keeps north above south for Europe and Africa", () => {
    const spain = projectToScreen(-5, 40);
    const horn = projectToScreen(48, 10);

    expect(spain.y).toBeGreaterThan(horn.y);
  });
});
