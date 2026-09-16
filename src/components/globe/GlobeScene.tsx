"use client";

import { Earth } from "./Earth";
import { GLOBE_LIGHTING } from "./earthConfig";
import { Stars } from "./Stars";

/** R3F scene — stars and Earth are siblings so stars stay fixed while Earth rotates. */
export function GlobeScene() {
  return (
    <>
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
      <Earth />
    </>
  );
}
