import { GlobeCanvas } from "@/components/globe";
import { GlobeControlsProvider } from "@/components/globe/GlobeControlsContext";

import { GlobeControlsUI } from "./GlobeControlsUI";

/**
 * Application shell — DOM UI overlay separate from the WebGL canvas.
 * @see docs/ARCHITECTURE.md — UI / canvas layering
 */
export function AppShell() {
  return (
    <GlobeControlsProvider>
      <div className="globe-app">
        <div className="globe-app__background" aria-hidden="true" />
        <GlobeCanvas />
        <div className="globe-app__overlay">
          <header className="globe-app__header">
            <h1 className="globe-app__title">World Globe</h1>
            <p className="globe-app__subtitle">
              Drag to rotate, scroll or pinch to zoom. Focus the globe and use
              arrow keys, or use the navigation controls.
            </p>
          </header>
          <GlobeControlsUI />
        </div>
      </div>
    </GlobeControlsProvider>
  );
}
