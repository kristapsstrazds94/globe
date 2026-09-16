"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/** Imperative globe navigation API exposed to DOM UI (T014). */
export type GlobeControlsApi = {
  rotateLeft: () => void;
  rotateRight: () => void;
  rotateUp: () => void;
  rotateDown: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  reset: () => void;
};

/** Country fly-to controller registered from the R3F layer (T034). */
export type GlobeFlyToController = {
  start: (countryId: string) => void;
  cancel: () => void;
};

type GlobeControlsContextValue = {
  register: (api: GlobeControlsApi | null) => void;
  getApi: () => GlobeControlsApi | null;
  registerOrbitControls: (controls: OrbitControls | null) => void;
  getOrbitControls: () => OrbitControls | null;
  registerFlyTo: (controller: GlobeFlyToController | null) => void;
  getFlyToController: () => GlobeFlyToController | null;
};

const GlobeControlsContext = createContext<GlobeControlsContextValue | null>(null);

export function GlobeControlsProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef<GlobeControlsApi | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const flyToRef = useRef<GlobeFlyToController | null>(null);

  const register = useCallback((api: GlobeControlsApi | null) => {
    apiRef.current = api;
  }, []);

  const getApi = useCallback(() => apiRef.current, []);

  const registerOrbitControls = useCallback((controls: OrbitControls | null) => {
    controlsRef.current = controls;
  }, []);

  const getOrbitControls = useCallback(() => controlsRef.current, []);

  const registerFlyTo = useCallback((controller: GlobeFlyToController | null) => {
    flyToRef.current = controller;
  }, []);

  const getFlyToController = useCallback(() => flyToRef.current, []);

  const value = useMemo(
    () => ({
      register,
      getApi,
      registerOrbitControls,
      getOrbitControls,
      registerFlyTo,
      getFlyToController,
    }),
    [register, getApi, registerOrbitControls, getOrbitControls, registerFlyTo, getFlyToController],
  );

  return <GlobeControlsContext.Provider value={value}>{children}</GlobeControlsContext.Provider>;
}

export function useGlobeControlsContext(): GlobeControlsContextValue {
  const context = useContext(GlobeControlsContext);
  if (!context) {
    throw new Error("useGlobeControlsContext must be used within GlobeControlsProvider");
  }
  return context;
}

/** Read-only access for DOM controls UI. */
export function useGlobeControlsApi(): GlobeControlsApi | null {
  const { getApi } = useGlobeControlsContext();
  return getApi();
}
