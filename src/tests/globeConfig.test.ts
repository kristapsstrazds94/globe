import { describe, expect, it } from "vitest";

import {
  GLOBE_CAMERA,
  GLOBE_CAMERA_CONSTRAINTS,
} from "@/components/globe/cameraConfig";
import {
  ATMOSPHERE_RADIUS,
  COUNTRY_LAYER_RADIUS,
  GLOBE_RADIUS,
} from "@/components/globe/earthConfig";

describe("globe scale layers", () => {
  it("places country layer above Earth surface", () => {
    expect(COUNTRY_LAYER_RADIUS).toBeGreaterThan(GLOBE_RADIUS);
  });

  it("places atmosphere outside country layer", () => {
    expect(ATMOSPHERE_RADIUS).toBeGreaterThan(COUNTRY_LAYER_RADIUS);
  });
});

describe("GLOBE_CAMERA_CONSTRAINTS", () => {
  it("keeps min distance outside the globe", () => {
    expect(GLOBE_CAMERA_CONSTRAINTS.minDistance).toBeGreaterThan(GLOBE_RADIUS);
  });

  it("keeps default camera within zoom bounds", () => {
    const distance = Math.hypot(
      GLOBE_CAMERA.position[0],
      GLOBE_CAMERA.position[1],
      GLOBE_CAMERA.position[2],
    );

    expect(distance).toBeGreaterThanOrEqual(GLOBE_CAMERA_CONSTRAINTS.minDistance);
    expect(distance).toBeLessThanOrEqual(GLOBE_CAMERA_CONSTRAINTS.maxDistance);
  });

  it("defines a valid polar angle range", () => {
    expect(GLOBE_CAMERA_CONSTRAINTS.minPolarAngle).toBeLessThan(
      GLOBE_CAMERA_CONSTRAINTS.maxPolarAngle,
    );
  });
});
