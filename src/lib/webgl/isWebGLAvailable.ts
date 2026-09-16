type CanvasLike = {
  getContext: (contextId: string) => unknown;
};

/**
 * Detect WebGL support before mounting an R3F canvas.
 * Injectable canvas factory keeps the check unit-testable outside a browser.
 */
export function isWebGLAvailable(
  createCanvas: () => CanvasLike = () => document.createElement("canvas"),
): boolean {
  try {
    const canvas = createCanvas();
    const gl =
      canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    return gl !== null;
  } catch {
    return false;
  }
}
