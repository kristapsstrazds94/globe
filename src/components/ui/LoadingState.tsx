type LoadingStateProps = {
  message?: string;
};

/**
 * Minimal globe loading indicator — preserves dark visual identity (T052).
 */
export function LoadingState({ message = "Loading globe…" }: LoadingStateProps) {
  return (
    <div className="globe-loading" role="status" aria-live="polite">
      <div className="globe-loading__indicator" aria-hidden="true" />
      <p className="globe-loading__message">{message}</p>
    </div>
  );
}
