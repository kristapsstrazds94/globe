"use client";

import { Atmosphere } from "./Atmosphere";
import { CountryBorders } from "./CountryBorders";
import { Countries } from "./Countries";
import { CountriesProvider } from "./CountriesContext";
import { CountryFlyTo } from "./CountryFlyTo";
import { CountryMarkerLabelLayer, CountryMarkerPinLayer } from "./CountryMarker";
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
      <CountryFlyTo />
      <CountryPicking />
      <CountryHoverVisual />
      <CountrySelectionVisual />
      <CountryMarkerLabelLayer />
      <Stars />
      <group scale={GLOBE_GEO_SCALE}>
        <hemisphereLight
          args={[
            GLOBE_LIGHTING.hemisphere.skyColor,
            GLOBE_LIGHTING.hemisphere.groundColor,
            GLOBE_LIGHTING.hemisphere.intensity,
          ]}
        />
        <ambientLight intensity={GLOBE_LIGHTING.ambientIntensity} />
        <directionalLight
          position={GLOBE_LIGHTING.directional.position}
          color={GLOBE_LIGHTING.directional.color}
          intensity={GLOBE_LIGHTING.directional.intensity}
        />
        <directionalLight
          position={GLOBE_LIGHTING.fill.position}
          color={GLOBE_LIGHTING.fill.color}
          intensity={GLOBE_LIGHTING.fill.intensity}
        />
        <Earth />
        <Countries />
        <CountryBorders />
        <CountryMarkerPinLayer />
        <Atmosphere />
      </group>
    </CountriesProvider>
  );
}
