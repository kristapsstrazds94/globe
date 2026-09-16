import { Quaternion, Vector3 } from "three";

import { COUNTRY_MARKER, COUNTRY_MARKER_RADIUS } from "@/components/globe/markerConfig";
import { GLOBE_GEO_SCALE } from "@/components/globe/earthConfig";
import { lonLatToSpherePoint } from "@/lib/geo/coordinates";
import { getCountryCentroid } from "@/lib/globe/cameraFlyTo";

const LOCAL_UP = new Vector3(0, 1, 0);
const normal = new Vector3();
const quaternion = new Quaternion();
const localOffset = new Vector3();

export type CountryMarkerPlacement = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
};

/** Place a radial pin on the unit sphere at a country's geographic centroid. */
export function getCountryMarkerPlacement(
  countryId: string,
  surfaceRadius: number = COUNTRY_MARKER_RADIUS,
): CountryMarkerPlacement | null {
  const centroid = getCountryCentroid(countryId);
  if (!centroid) {
    return null;
  }

  const [x, y, z] = lonLatToSpherePoint(centroid.lng, centroid.lat, surfaceRadius);
  normal.set(x, y, z).normalize();
  quaternion.setFromUnitVectors(LOCAL_UP, normal);

  return {
    position: [x, y, z],
    quaternion: [quaternion.x, quaternion.y, quaternion.z, quaternion.w],
  };
}

/** Local Y anchor for the label — sits above the pin head sphere. */
export function getCountryMarkerLabelCenterY(): number {
  const { height, headRadius } = COUNTRY_MARKER.pin;
  const { offsetY } = COUNTRY_MARKER.label;

  return height + headRadius + offsetY;
}

/**
 * World-space anchor for the label sprite.
 * Applies the geo group's Z flip so labels can live outside that group.
 */
export function getCountryMarkerLabelWorldPosition(
  placement: CountryMarkerPlacement,
  target: Vector3,
  localAnchorY: number = getCountryMarkerLabelCenterY(),
): void {
  localOffset.set(0, localAnchorY, 0);
  localOffset.applyQuaternion(new Quaternion(...placement.quaternion));

  target.set(placement.position[0], placement.position[1], placement.position[2]);
  target.add(localOffset);
  target.x *= GLOBE_GEO_SCALE[0];
  target.y *= GLOBE_GEO_SCALE[1];
  target.z *= GLOBE_GEO_SCALE[2];
}
