/** Whether the location search enables the dev perf overlay. */
export function isPerfQueryEnabled(search: string): boolean {
  return new URLSearchParams(search).get("perf") === "1";
}

/** Dev-only overlay — append `?perf=1` to the URL. Never enabled in production builds. */
export function isPerfOverlayEnabled(): boolean {
  if (process.env.NODE_ENV !== "development") {
    return false;
  }

  if (typeof window === "undefined") {
    return false;
  }

  return isPerfQueryEnabled(window.location.search);
}
