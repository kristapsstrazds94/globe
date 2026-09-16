type GlobeDataErrorStateProps = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

const DEFAULT_TITLE = "Map data unavailable";
const DEFAULT_MESSAGE =
  "Country boundaries could not be loaded. Reload the page to try again, or use search and browse once the map data is available.";

/**
 * Shown when preprocessed geography data fails validation or cannot be loaded.
 */
export function GlobeDataErrorState({
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  onRetry,
}: GlobeDataErrorStateProps) {
  return (
    <div className="globe-data-error" role="alert">
      <p className="globe-data-error__title">{title}</p>
      <p className="globe-data-error__message">{message}</p>
      {onRetry ? (
        <button type="button" className="globe-data-error__retry" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}
