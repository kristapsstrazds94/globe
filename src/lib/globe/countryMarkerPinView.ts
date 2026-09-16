import type { Vector3 } from "three";

/** Alignment between surface normal and view direction (1 = facing camera). */
export function getSurfaceViewAlignment(
  surfaceNormal: Vector3,
  surfaceWorldPosition: Vector3,
  cameraWorldPosition: Vector3,
  viewDirection: Vector3,
): number {
  viewDirection.subVectors(cameraWorldPosition, surfaceWorldPosition);
  const distance = viewDirection.length();
  if (distance === 0) {
    return 1;
  }

  viewDirection.divideScalar(distance);
  return surfaceNormal.dot(viewDirection);
}
