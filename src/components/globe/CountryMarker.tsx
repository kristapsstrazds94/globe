"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { MeshStandardMaterial, PerspectiveCamera, Sprite, Vector3 } from "three";

import { GLOBE_CAMERA } from "./cameraConfig";

import {
  createCountryLabelMaterial,
  disposeCountryLabelMaterial,
  getCountryLabelWorldScale,
  type CountryLabelLayout,
} from "@/lib/globe/countryMarkerLabel";
import {
  getCountryMarkerLabelWorldPosition,
  getCountryMarkerPlacement,
  type CountryMarkerPlacement,
} from "@/lib/globe/countryMarkerPlacement";
import { getCountryNameById } from "@/lib/globe/countryLookup";
import { useGlobeStore } from "@/stores/globeStore";

import { COUNTRY_MARKER } from "./markerConfig";

const labelWorld = new Vector3();
const cameraDirection = new Vector3();

/** Red pin mesh inside the geo-scaled group. */
function CountryMarkerPin({ placement }: { placement: CountryMarkerPlacement }) {
  const pinMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: COUNTRY_MARKER.pin.color,
        emissive: COUNTRY_MARKER.pin.emissive,
        emissiveIntensity: COUNTRY_MARKER.pin.emissiveIntensity,
        roughness: COUNTRY_MARKER.pin.roughness,
        metalness: COUNTRY_MARKER.pin.metalness,
      }),
    [],
  );

  useEffect(() => () => pinMaterial.dispose(), [pinMaterial]);

  const { height, baseRadius, headRadius } = COUNTRY_MARKER.pin;

  return (
    <group position={placement.position} quaternion={placement.quaternion}>
      <mesh position={[0, height / 2, 0]} material={pinMaterial} renderOrder={3}>
        <coneGeometry args={[baseRadius, height, 12]} />
      </mesh>
      <mesh position={[0, height, 0]} material={pinMaterial} renderOrder={3}>
        <sphereGeometry args={[headRadius, 16, 16]} />
      </mesh>
    </group>
  );
}

/**
 * Billboard label outside the geo-scaled group — avoids screen-space sprite bugs
 * with the Z-flipped parent and keeps text sharp via distance-scaled world size.
 */
function CountryMarkerLabel({
  placement,
  layout,
  labelMaterial,
}: {
  placement: CountryMarkerPlacement;
  layout: CountryLabelLayout;
  labelMaterial: ReturnType<typeof createCountryLabelMaterial>;
}) {
  const spriteRef = useRef<Sprite>(null);

  useEffect(() => () => disposeCountryLabelMaterial(labelMaterial), [labelMaterial]);

  useFrame(({ camera, size }) => {
    const sprite = spriteRef.current;
    if (!sprite) {
      return;
    }

    getCountryMarkerLabelWorldPosition(placement, labelWorld);

    cameraDirection.subVectors(camera.position, labelWorld);
    const distance = cameraDirection.length();
    if (distance > 0) {
      cameraDirection.divideScalar(distance);
    }

    labelWorld.addScaledVector(cameraDirection, COUNTRY_MARKER.label.cameraOffset);
    sprite.position.copy(labelWorld);
    sprite.quaternion.copy(camera.quaternion);

    const fov = camera instanceof PerspectiveCamera ? camera.fov : GLOBE_CAMERA.fov;
    const scale = getCountryLabelWorldScale(distance, size.height, fov, layout);
    sprite.scale.set(scale[0], scale[1], scale[2]);
  });

  return <sprite ref={spriteRef} renderOrder={5} material={labelMaterial} />;
}

/** Pin inside the geo group — rendered from GlobeScene. */
export function CountryMarkerPinLayer() {
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const placement = useMemo(
    () => (selectedCountryId ? getCountryMarkerPlacement(selectedCountryId) : null),
    [selectedCountryId],
  );

  if (!selectedCountryId || !placement) {
    return null;
  }

  return <CountryMarkerPin key={selectedCountryId} placement={placement} />;
}

/** Label outside the geo group — rendered from GlobeScene. */
export function CountryMarkerLabelLayer() {
  const selectedCountryId = useGlobeStore((state) => state.selectedCountryId);
  const countryName = selectedCountryId ? getCountryNameById(selectedCountryId) : null;
  const placement = useMemo(
    () => (selectedCountryId ? getCountryMarkerPlacement(selectedCountryId) : null),
    [selectedCountryId],
  );

  const labelMaterial = useMemo(() => {
    if (!countryName) {
      return null;
    }

    return createCountryLabelMaterial(countryName);
  }, [countryName]);

  const layout = labelMaterial?.userData.labelLayout as CountryLabelLayout | undefined;

  if (!selectedCountryId || !placement || !labelMaterial || !layout) {
    return null;
  }

  return (
    <CountryMarkerLabel
      key={selectedCountryId}
      placement={placement}
      layout={layout}
      labelMaterial={labelMaterial}
    />
  );
}
