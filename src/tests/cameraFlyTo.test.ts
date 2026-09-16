import { describe, expect, it } from "vitest";
import { Vector3 } from "three";

import { GLOBE_CAMERA, GLOBE_CAMERA_CONSTRAINTS } from "@/components/globe/cameraConfig";
import { cameraPositionForViewCenter } from "@/components/globe/earthConfig";
import {
  easeInOutCubic,
  getCountryCentroid,
  getFlyToCameraPosition,
  interpolateCameraPosition,
} from "@/lib/globe/cameraFlyTo";

describe("getCountryCentroid", () => {
  it("returns a centroid for a known country id", () => {
    const centroid = getCountryCentroid("NOR");
    expect(centroid).not.toBeNull();
    expect(centroid!.lat).toBeGreaterThan(50);
    expect(centroid!.lng).toBeGreaterThan(-20);
    expect(centroid!.lng).toBeLessThan(40);
  });

  it("returns null for unknown ids", () => {
    expect(getCountryCentroid("ZZZ")).toBeNull();
  });
});

describe("getFlyToCameraPosition", () => {
  it("returns deterministic camera positions for the same country", () => {
    const first = getFlyToCameraPosition("NOR", 3.5);
    const second = getFlyToCameraPosition("NOR", 3.5);

    expect(first).toEqual(second);
    expect(first).not.toBeNull();
  });

  it("matches cameraPositionForViewCenter for the country centroid", () => {
    const distance = 3.5;
    const centroid = getCountryCentroid("NOR");
    const expected = cameraPositionForViewCenter(centroid!.lng, centroid!.lat, distance);

    expect(getFlyToCameraPosition("NOR", distance)).toEqual(expected);
  });
});

describe("interpolateCameraPosition", () => {
  it("uses the shortest azimuth path across the antimeridian", () => {
    const from = new Vector3(...cameraPositionForViewCenter(170, 0, 3.5));
    const to = new Vector3(...cameraPositionForViewCenter(-170, 0, 3.5));
    const midpoint = new Vector3();

    interpolateCameraPosition(from, to, 0.5, midpoint);

    const fromDir = from.clone().normalize();
    const toDir = to.clone().normalize();
    const midDir = midpoint.clone().normalize();

    const totalAngle = fromDir.angleTo(toDir);
    const firstLeg = fromDir.angleTo(midDir);
    const secondLeg = midDir.angleTo(toDir);

    expect(firstLeg + secondLeg).toBeCloseTo(totalAngle, 3);
    expect(totalAngle).toBeLessThan(Math.PI / 2);
  });

  it("preserves endpoints", () => {
    const from = new Vector3(...GLOBE_CAMERA.position);
    const to = new Vector3(
      ...cameraPositionForViewCenter(-74, 40, GLOBE_CAMERA_CONSTRAINTS.minDistance),
    );
    const start = new Vector3();
    const end = new Vector3();

    interpolateCameraPosition(from, to, 0, start);
    interpolateCameraPosition(from, to, 1, end);

    expect(start.distanceTo(from)).toBeLessThan(1e-6);
    expect(end.distanceTo(to)).toBeLessThan(1e-6);
  });
});

describe("easeInOutCubic", () => {
  it("starts and ends at the expected values", () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(1)).toBe(1);
  });
});
