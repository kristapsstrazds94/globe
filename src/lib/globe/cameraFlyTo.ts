import { Spherical, Vector3 } from "three";

import { cameraPositionForViewCenter } from "@/components/globe/earthConfig";
import { geographyBundle } from "@/data/geography";
import { computeGeometryCentroid, type GeoCentroid } from "@/lib/geo/centroid";

const geometryByCountryId = new Map(
  geographyBundle.features.map((feature) => [feature.id, feature.geometry]),
);

const sphericalFrom = new Spherical();
const sphericalTo = new Spherical();
const directionFrom = new Vector3();
const directionTo = new Vector3();

/** Resolve a country's geographic centroid from preprocessed geometry. */
export function getCountryCentroid(countryId: string): GeoCentroid | null {
  const geometry = geometryByCountryId.get(countryId);
  if (!geometry) {
    return null;
  }

  return computeGeometryCentroid(geometry);
}

/** Deterministic camera position that centers a country at the given orbit distance. */
export function getFlyToCameraPosition(
  countryId: string,
  distance: number,
): [number, number, number] | null {
  const centroid = getCountryCentroid(countryId);
  if (!centroid) {
    return null;
  }

  return cameraPositionForViewCenter(centroid.lng, centroid.lat, distance);
}

/** Smoothstep-like easing for fly-to transitions. */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

/** Angular distance between two camera positions on the orbit shell (radians). */
export function getAngularCameraDistance(from: Vector3, to: Vector3): number {
  directionFrom.copy(from).normalize();
  directionTo.copy(to).normalize();
  return directionFrom.angleTo(directionTo);
}

/**
 * Interpolate camera position on a spherical shell using the shortest azimuth path.
 * Handles antimeridian crossings naturally via theta wrapping.
 */
export function interpolateCameraPosition(
  from: Vector3,
  to: Vector3,
  t: number,
  target: Vector3,
): void {
  sphericalFrom.setFromVector3(from);
  sphericalTo.setFromVector3(to);

  let deltaTheta = sphericalTo.theta - sphericalFrom.theta;
  while (deltaTheta > Math.PI) {
    deltaTheta -= Math.PI * 2;
  }
  while (deltaTheta < -Math.PI) {
    deltaTheta += Math.PI * 2;
  }

  const theta = sphericalFrom.theta + deltaTheta * t;
  const phi = sphericalFrom.phi + (sphericalTo.phi - sphericalFrom.phi) * t;
  const radius = sphericalFrom.radius + (sphericalTo.radius - sphericalFrom.radius) * t;

  target.setFromSphericalCoords(radius, phi, theta);
}
