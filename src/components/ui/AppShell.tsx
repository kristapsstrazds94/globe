import Image from "next/image";

import { GlobeCanvas } from "@/components/globe";
import { withBasePath } from "@/lib/basePath";
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
                <div className="globe-app__brand">
                  <Image
                    src={withBasePath("/brand/globe-logo.svg")}
                    alt=""
                    width={128}
                    height={128}
                    className="globe-app__logo"
                    priority
                  />
                  <h1 className="globe-app__title">Pintrip</h1>
                </div>
                <nav className="globe-app__country-nav" aria-label="Country selection">
                  <CountrySearch />
                  <CountryBrowseTrigger />
                </nav>
              </div>
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
