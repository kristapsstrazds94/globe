import { GlobeCanvas } from "@/components/globe";
import { GlobeControlsProvider } from "@/components/globe/GlobeControlsContext";

import {
  CountryBrowseProvider,
  CountryBrowseSkipLink,
  CountryBrowseTrigger,
} from "./CountryBrowse";
import { CountryPanel } from "./CountryPanel";
import { CountrySearch } from "./CountrySearch";
import { CountryTooltip } from "./CountryTooltip";
import { GlobeControlsUI } from "./GlobeControlsUI";

/**
 * Application shell — DOM UI overlay separate from the WebGL canvas.
 * @see docs/ARCHITECTURE.md — UI / canvas layering
 */
export function AppShell() {
  return (
    <GlobeControlsProvider>
      <CountryBrowseProvider>
        <div className="globe-app">
          <div className="globe-app__background" aria-hidden="true" />
          <GlobeCanvas />
          <div className="globe-app__overlay">
            <CountryBrowseSkipLink />
            <header className="globe-app__header">
              <div className="globe-app__header-row">
                <div className="globe-app__header-main">
                  <h1 className="globe-app__title">World Globe</h1>
                </div>
                <nav className="globe-app__country-nav" aria-label="Country selection">
                  <CountrySearch />
                  <CountryBrowseTrigger />
                </nav>
              </div>
              <p id="globe-app-instructions" className="globe-app__subtitle">
                Drag to rotate, scroll or pinch to zoom. Search or browse the country list to
                select without the globe. Focus the globe and use arrow keys, or use the navigation
                controls.
              </p>
            </header>
            <GlobeControlsUI />
          </div>
          <CountryTooltip />
          <CountryPanel />
        </div>
      </CountryBrowseProvider>
    </GlobeControlsProvider>
  );
}
