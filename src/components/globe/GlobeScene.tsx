"use client";

import { Earth } from "./Earth";
import { GLOBE_LIGHTING } from "./earthConfig";

/** R3F scene — Earth base layer; stars, atmosphere, and countries follow in later tasks. */
export function GlobeScene() {
  return (
    <>
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
