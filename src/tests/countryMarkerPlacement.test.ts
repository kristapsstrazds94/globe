import { describe, expect, it } from "vitest";
import { Quaternion, Vector3 } from "three";

import { COUNTRY_MARKER_RADIUS } from "@/components/globe/markerConfig";
import { lonLatToSpherePoint } from "@/lib/geo/coordinates";
import { getCountryCentroid } from "@/lib/globe/cameraFlyTo";

import {
  getCountryMarkerLabelCenterY,
  getCountryMarkerLabelWorldPosition,
  getCountryMarkerPlacement,
} from "@/lib/globe/countryMarkerPlacement";

describe("getCountryMarkerPlacement", () => {
  it("returns a surface position and outward-facing orientation for a known country", () => {
    const placement = getCountryMarkerPlacement("NOR");

    expect(placement).not.toBeNull();

    const [x, y, z] = placement!.position;
    const radius = Math.hypot(x, y, z);
    expect(radius).toBeCloseTo(COUNTRY_MARKER_RADIUS, 5);

    const centroid = getCountryCentroid("NOR");
    const [expectedX, expectedY, expectedZ] = lonLatToSpherePoint(
      centroid!.lng,
      centroid!.lat,
      COUNTRY_MARKER_RADIUS,
    );

    expect(x).toBeCloseTo(expectedX, 5);
    expect(y).toBeCloseTo(expectedY, 5);
    expect(z).toBeCloseTo(expectedZ, 5);

    const normal = new Vector3(x, y, z).normalize();
    const orientation = new Quaternion(...placement!.quaternion);
    const localUp = new Vector3(0, 1, 0).applyQuaternion(orientation);

    expect(localUp.dot(normal)).toBeCloseTo(1, 5);
  });

  it("returns null for unknown country ids", () => {
    expect(getCountryMarkerPlacement("ZZZ")).toBeNull();
  });
});

describe("getCountryMarkerLabelCenterY", () => {
  it("places the label anchor above the pin head sphere", () => {
    const centerY = getCountryMarkerLabelCenterY();
    const pinTop = 0.045 + 0.014;

    expect(centerY).toBeGreaterThan(pinTop);
  });
});

describe("getCountryMarkerLabelWorldPosition", () => {
  it("applies the geo Z flip when converting to world space", () => {
    const placement = getCountryMarkerPlacement("NOR");
    expect(placement).not.toBeNull();

    const world = new Vector3();
    getCountryMarkerLabelWorldPosition(placement!, world, 0);

    expect(world.z).toBeCloseTo(-placement!.position[2], 5);
  });
});
