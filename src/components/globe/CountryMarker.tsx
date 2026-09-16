"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Group, MeshStandardMaterial, PerspectiveCamera, Quaternion, Sprite, Vector3 } from "three";

import { GLOBE_CAMERA } from "./cameraConfig";
import { GLOBE_GEO_SCALE } from "./earthConfig";

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
import { getSurfaceViewAlignment } from "@/lib/globe/countryMarkerPinView";
import { getCountryNameById } from "@/lib/globe/countryLookup";
import { useGlobeStore } from "@/stores/globeStore";

import { COUNTRY_MARKER } from "./markerConfig";

const labelWorld = new Vector3();
const pinWorld = new Vector3();
const surfaceNormal = new Vector3();
const viewDirection = new Vector3();

/** Red pin mesh inside the geo-scaled group. */
function CountryMarkerPin({ placement }: { placement: CountryMarkerPlacement }) {
  const groupRef = useRef<Group>(null);
  const worldQuaternion = useRef(new Quaternion());
  const pinMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        color: COUNTRY_MARKER.pin.color,
        emissive: COUNTRY_MARKER.pin.emissive,
        emissiveIntensity: COUNTRY_MARKER.pin.emissiveIntensity,
        roughness: COUNTRY_MARKER.pin.roughness,
        metalness: COUNTRY_MARKER.pin.metalness,
        depthTest: true,
        depthWrite: true,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2,
      }),
    [],
  );

  useEffect(() => () => pinMaterial.dispose(), [pinMaterial]);

  useFrame(({ camera }) => {
    const group = groupRef.current;
    if (!group) {
      return;
    }

    group.getWorldPosition(pinWorld);
    group.getWorldQuaternion(worldQuaternion.current);
    surfaceNormal.set(0, 1, 0).applyQuaternion(worldQuaternion.current);

    const alignment = getSurfaceViewAlignment(
      surfaceNormal,
      pinWorld,
      camera.position,
      viewDirection,
    );

    // Hide on the back hemisphere — keep full height on the visible side.
    group.visible = alignment > 0;
  });

  const { height, baseRadius, headRadius } = COUNTRY_MARKER.pin;

  return (
    <group ref={groupRef} position={placement.position} quaternion={placement.quaternion}>
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

    pinWorld.set(
      placement.position[0] * GLOBE_GEO_SCALE[0],
      placement.position[1] * GLOBE_GEO_SCALE[1],
      placement.position[2] * GLOBE_GEO_SCALE[2],
    );
    surfaceNormal.copy(pinWorld).normalize();

    sprite.visible =
      getSurfaceViewAlignment(surfaceNormal, pinWorld, camera.position, viewDirection) > 0;
    if (!sprite.visible) {
      return;
    }

    getCountryMarkerLabelWorldPosition(placement, labelWorld);
    labelWorld.addScaledVector(surfaceNormal, COUNTRY_MARKER.label.radialOffset);

    sprite.position.copy(labelWorld);
    sprite.quaternion.copy(camera.quaternion);

    const viewDistance = camera.position.distanceTo(labelWorld);
    const fov = camera instanceof PerspectiveCamera ? camera.fov : GLOBE_CAMERA.fov;
    const scale = getCountryLabelWorldScale(viewDistance, size.height, fov, layout);
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
