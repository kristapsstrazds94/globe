import { describe, expect, it } from "vitest";

import {
  GLOBE_CAMERA,
  GLOBE_CAMERA_CONSTRAINTS,
  GLOBE_CAMERA_DISTANCE,
} from "@/components/globe/cameraConfig";
import {
  ATMOSPHERE_RADIUS,
  cameraPositionForViewCenter,
  COUNTRY_BORDER_RADIUS,
  COUNTRY_LAYER_RADIUS,
  GLOBE_CAMERA_VIEW,
  GLOBE_GEO_SCALE,
  GLOBE_RADIUS,
} from "@/components/globe/earthConfig";

describe("globe scale layers", () => {
  it("places country layer above Earth surface", () => {
    expect(COUNTRY_LAYER_RADIUS).toBeGreaterThan(GLOBE_RADIUS);
  });

  it("places country borders above fill layer", () => {
    expect(COUNTRY_BORDER_RADIUS).toBeGreaterThan(COUNTRY_LAYER_RADIUS);
  });

  it("places atmosphere outside country layer", () => {
    expect(ATMOSPHERE_RADIUS).toBeGreaterThan(COUNTRY_BORDER_RADIUS);
  });
});

describe("GLOBE_GEO_SCALE", () => {
  it("flips Z to preserve east–west orientation at the default camera", () => {
    expect(GLOBE_GEO_SCALE).toEqual([1, 1, -1]);
  });
});

describe("GLOBE_CAMERA position", () => {
  it("faces the configured view center at page load", () => {
    expect(GLOBE_CAMERA.position).toEqual(
      cameraPositionForViewCenter(
        GLOBE_CAMERA_VIEW.longitude,
        GLOBE_CAMERA_VIEW.latitude,
        GLOBE_CAMERA_DISTANCE,
      ),
    );
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
