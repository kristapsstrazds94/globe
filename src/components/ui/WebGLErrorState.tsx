/**
 * Shown when WebGL is unavailable or the GPU context is lost.
 */
export function WebGLErrorState() {
  return (
    <div className="globe-webgl-error" role="alert">
      <p className="globe-webgl-error__title">3D view unavailable</p>
      <p className="globe-webgl-error__message">
        Your browser or device does not support WebGL, or hardware acceleration is disabled. Use
        country search or the browse list to select countries and view details.
      </p>
    </div>
  );
}
