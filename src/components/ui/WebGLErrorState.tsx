type WebGLErrorStateProps = {
  /** When true, show a retry action (e.g. after GPU context loss). */
  recoverable?: boolean;
  onRetry?: () => void;
};

/**
 * Shown when WebGL is unavailable or the GPU context is lost.
 */
export function WebGLErrorState({ recoverable = false, onRetry }: WebGLErrorStateProps) {
  return (
    <div className="globe-webgl-error" role="alert">
      <p className="globe-webgl-error__title">3D view unavailable</p>
      <p className="globe-webgl-error__message">
        {recoverable
          ? "The 3D view stopped responding. Try reloading the globe, or use country search and the browse list to select countries."
          : "Your browser or device does not support WebGL, or hardware acceleration is disabled. Use country search or the browse list to select countries and view details."}
      </p>
      {recoverable && onRetry ? (
        <button type="button" className="globe-webgl-error__retry" onClick={onRetry}>
          Reload globe
        </button>
      ) : null}
    </div>
  );
}
