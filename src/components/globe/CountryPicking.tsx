"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Raycaster, Vector2 } from "three";

import { pickCountryFromIntersections, pointerToNdc } from "@/lib/globe/countryPicking";
import { useGlobeStore } from "@/stores/globeStore";

import { useCountriesContext } from "./CountriesContext";

/** Pointer raycasting against country fill meshes (T030). */
export function CountryPicking() {
  const { camera, gl } = useThree();
  const { getCountryGroup } = useCountriesContext();
  const raycasterRef = useRef(new Raycaster());
  const pointerRef = useRef(new Vector2());
  const lastHoveredRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = gl.domElement;
    const raycaster = raycasterRef.current;
    const pointer = pointerRef.current;
    let pendingPointer: Pick<PointerEvent, "clientX" | "clientY"> | null = null;
    let pickFrame = 0;

    const pickAt = (event: Pick<PointerEvent, "clientX" | "clientY">): string | null => {
      const group = getCountryGroup();
      if (!group || group.children.length === 0) {
        return null;
      }

      pointerToNdc(event, canvas, pointer);
      raycaster.setFromCamera(pointer, camera);
      const intersections = raycaster.intersectObjects(group.children, false);
      return pickCountryFromIntersections(intersections);
    };

    const setHovered = (id: string | null) => {
      if (lastHoveredRef.current === id) {
        return;
      }

      lastHoveredRef.current = id;
      useGlobeStore.getState().setHoveredCountryId(id);
    };

    const flushPick = () => {
      pickFrame = 0;
      if (!pendingPointer) {
        return;
      }

      const nextPointer = pendingPointer;
      pendingPointer = null;
      setHovered(pickAt(nextPointer));
    };

    const schedulePick = (event: Pick<PointerEvent, "clientX" | "clientY">) => {
      pendingPointer = event;
      if (pickFrame !== 0) {
        return;
      }

      pickFrame = requestAnimationFrame(flushPick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.buttons !== 0) {
        return;
      }

      schedulePick(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      schedulePick(event);
    };

    const onPointerLeave = () => {
      pendingPointer = null;
      if (pickFrame !== 0) {
        cancelAnimationFrame(pickFrame);
        pickFrame = 0;
      }
      setHovered(null);
    };

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      if (pickFrame !== 0) {
        cancelAnimationFrame(pickFrame);
      }
      setHovered(null);
    };
  }, [camera, gl, getCountryGroup]);

  return null;
}
