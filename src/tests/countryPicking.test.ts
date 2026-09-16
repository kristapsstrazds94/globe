import { describe, expect, it } from "vitest";
import { Mesh, Vector2 } from "three";

import {
  extractCountryIdFromObject,
  isCountryPickTarget,
  pickCountryFromIntersections,
  pointerToNdc,
} from "@/lib/globe/countryPicking";

describe("countryPicking", () => {
  it("identifies country pick targets by userData.countryId", () => {
    const mesh = new Mesh();
    mesh.userData.countryId = "NOR";

    expect(isCountryPickTarget(mesh)).toBe(true);
    expect(extractCountryIdFromObject(mesh)).toBe("NOR");
  });

  it("ignores objects without a country id", () => {
    const mesh = new Mesh();

    expect(isCountryPickTarget(mesh)).toBe(false);
    expect(extractCountryIdFromObject(mesh)).toBeNull();
  });

  it("returns the closest country id from intersections", () => {
    const near = new Mesh();
    near.userData.countryId = "SWE";
    const far = new Mesh();
    far.userData.countryId = "NOR";

    expect(
      pickCountryFromIntersections([
        { object: near, distance: 1 } as never,
        { object: far, distance: 2 } as never,
      ]),
    ).toBe("SWE");
  });

  it("skips non-country hits and returns null when none match", () => {
    const border = new Mesh();

    expect(
      pickCountryFromIntersections([{ object: border, distance: 1 } as never]),
    ).toBeNull();
  });

  it("converts pointer coordinates to normalized device coordinates", () => {
    const canvas = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        right: 200,
        bottom: 100,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    };

    const ndc = pointerToNdc({ clientX: 150, clientY: 25 }, canvas, new Vector2());

    expect(ndc.x).toBeCloseTo(0.5);
    expect(ndc.y).toBeCloseTo(0.5);
  });
});
