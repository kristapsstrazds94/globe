"use client";

/**
 * Client-only rendering surface for R3F/Three.js (T010+).
 * DOM UI lives outside this boundary — see AppShell.
 */
export function GlobeCanvas() {
  return (
    <div
      className="globe-canvas"
      role="img"
      aria-label="Interactive world globe"
      data-testid="globe-canvas"
    />
  );
}
