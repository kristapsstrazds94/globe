/** Boost border opacity when zoomed out so 1px lines stay legible. */
export function getBorderOpacityForCameraDistance(
  distance: number,
  minDistance: number,
  maxDistance: number,
  baseOpacity: number,
): number {
  if (maxDistance <= minDistance) {
    return baseOpacity;
  }

  const zoomT = Math.min(1, Math.max(0, (distance - minDistance) / (maxDistance - minDistance)));
  const boost = (1 - baseOpacity) * 0.4 * zoomT;

  return Math.min(1, baseOpacity + boost);
}
