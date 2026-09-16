import { GlobeCanvas } from "@/components/globe";

/**
 * Application shell — DOM UI overlay separate from the WebGL canvas.
 * @see docs/ARCHITECTURE.md — UI / canvas layering
 */
export function AppShell() {
  return (
    <div className="globe-app">
      <div className="globe-app__background" aria-hidden="true" />
      <GlobeCanvas />
      <div className="globe-app__overlay">
        <header className="globe-app__header">
          <h1 className="globe-app__title">World Globe</h1>
          <p className="globe-app__subtitle">
            Interactive 3D globe — drag and explore in later milestones.
          </p>
        </header>
      </div>
    </div>
  );
}
