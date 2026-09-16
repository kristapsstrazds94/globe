"use client";

import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT_PX = 768;
const MOBILE_DPR_CAP = 1.5;
const DESKTOP_DPR_CAP = 2;

/** Cap device pixel ratio per docs/PERFORMANCE.md quality guidance. */
export function getGlobeDpr(
  viewportWidth: number,
  devicePixelRatio: number,
): number {
  const cap =
    viewportWidth < MOBILE_BREAKPOINT_PX ? MOBILE_DPR_CAP : DESKTOP_DPR_CAP;
  return Math.min(devicePixelRatio, cap);
}

export function useGlobeDpr(): number {
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const update = () =>
      setDpr(getGlobeDpr(window.innerWidth, window.devicePixelRatio));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return dpr;
}
