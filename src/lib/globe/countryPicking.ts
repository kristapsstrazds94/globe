import type { Intersection, Object3D } from "three";
import { Vector2 } from "three";

/** True when the object is a country fill mesh registered for picking. */
export function isCountryPickTarget(object: Object3D): boolean {
  return typeof object.userData.countryId === "string";
}

/** Read a stable country identifier from a pick target, if present. */
export function extractCountryIdFromObject(object: Object3D): string | null {
  const id = object.userData.countryId;
  return typeof id === "string" ? id : null;
}

/** Return the first country ID from raycast hits (closest first). */
export function pickCountryFromIntersections(intersections: Intersection[]): string | null {
  for (const hit of intersections) {
    const id = extractCountryIdFromObject(hit.object);
    if (id !== null) {
      return id;
    }
  }

  return null;
}

/** Convert a pointer event to normalized device coordinates for raycasting. */
export function pointerToNdc(
  event: Pick<PointerEvent, "clientX" | "clientY">,
  canvas: Pick<HTMLElement, "getBoundingClientRect">,
  out: Vector2,
): Vector2 {
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 1;
  const height = rect.height || 1;

  out.x = ((event.clientX - rect.left) / width) * 2 - 1;
  out.y = -((event.clientY - rect.top) / height) * 2 + 1;

  return out;
}
