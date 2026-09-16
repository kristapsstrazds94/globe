/** True when the primary input supports hover (mouse/trackpad), not touch-only. */
export function isHoverCapableDevice(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
