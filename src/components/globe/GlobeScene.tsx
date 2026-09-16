"use client";

import { Atmosphere } from "./Atmosphere";
import { Countries } from "./Countries";
import { Earth } from "./Earth";
import { GLOBE_LIGHTING } from "./earthConfig";
import { GlobeControls } from "./GlobeControls";
import { Stars } from "./Stars";

/** R3F scene — stars stay fixed while the camera orbits the Earth (T014). */
export function GlobeScene() {
  return (
    <>
      <GlobeControls />
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
      <group>
        <Earth />
        <Countries />
        <Atmosphere />
      </group>
    </>
  );
}
