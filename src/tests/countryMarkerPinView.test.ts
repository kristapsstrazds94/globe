import { describe, expect, it } from "vitest";
import { Vector3 } from "three";

import { getSurfaceViewAlignment } from "@/lib/globe/countryMarkerPinView";

describe("getSurfaceViewAlignment", () => {
  it("returns 1 when the camera looks straight at the surface point", () => {
    const normal = new Vector3(0, 0, 1);
    const surface = new Vector3(0, 0, 1);
    const camera = new Vector3(0, 0, 3);
    const viewDirection = new Vector3();

    expect(getSurfaceViewAlignment(normal, surface, camera, viewDirection)).toBeCloseTo(1, 5);
  });

  it("returns 0 at the limb", () => {
    const normal = new Vector3(0, 0, 1);
    const surface = new Vector3(0, 0, 1);
    const camera = new Vector3(0, 3, 1);
    const viewDirection = new Vector3();

    expect(getSurfaceViewAlignment(normal, surface, camera, viewDirection)).toBeCloseTo(0, 5);
  });

  it("returns a negative value on the back hemisphere", () => {
    const normal = new Vector3(0, 0, 1);
    const surface = new Vector3(0, 0, 1);
    const camera = new Vector3(0, 0, -3);
    const viewDirection = new Vector3();

    expect(getSurfaceViewAlignment(normal, surface, camera, viewDirection)).toBeLessThan(0);
  });
});
