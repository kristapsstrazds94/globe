"use client";

import { Atmosphere } from "./Atmosphere";
import { CountryBorders } from "./CountryBorders";
import { Countries } from "./Countries";
import { CountriesProvider } from "./CountriesContext";
import { CountryHoverVisual } from "./CountryHoverVisual";
import { CountryPicking } from "./CountryPicking";
import { CountrySelectionVisual } from "./CountrySelectionVisual";
import { Earth } from "./Earth";
import { GLOBE_GEO_SCALE, GLOBE_LIGHTING } from "./earthConfig";
import { GlobeControls } from "./GlobeControls";
import { Stars } from "./Stars";

/** R3F scene — stars stay fixed while the camera orbits the Earth (T014). */
export function GlobeScene() {
  return (
    <CountriesProvider>
      <GlobeControls />
      <CountryPicking />
      <CountryHoverVisual />
      <CountrySelectionVisual />
      <Stars />
      <ambientLight intensity={GLOBE_LIGHTING.ambientIntensity} />
      <directionalLight
        position={GLOBE_LIGHTING.directional.position}
        intensity={GLOBE_LIGHTING.directional.intensity}
      />
      <directionalLight
        position={GLOBE_LIGHTING.fill.position}
        intensity={GLOBE_LIGHTING.fill.intensity}
      />
      <group scale={GLOBE_GEO_SCALE}>
        <Earth />
        <Countries />
        <CountryBorders />
        <Atmosphere />
      </group>
    </CountriesProvider>
  );
}
