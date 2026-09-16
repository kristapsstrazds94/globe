"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

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

type GlobeControlsContextValue = {
  register: (api: GlobeControlsApi | null) => void;
  getApi: () => GlobeControlsApi | null;
};

const GlobeControlsContext = createContext<GlobeControlsContextValue | null>(
  null,
);

export function GlobeControlsProvider({ children }: { children: ReactNode }) {
  const apiRef = useRef<GlobeControlsApi | null>(null);

  const register = useCallback((api: GlobeControlsApi | null) => {
    apiRef.current = api;
  }, []);

  const getApi = useCallback(() => apiRef.current, []);

  const value = useMemo(
    () => ({
      register,
      getApi,
    }),
    [register, getApi],
  );

  return (
    <GlobeControlsContext.Provider value={value}>
      {children}
    </GlobeControlsContext.Provider>
  );
}

export function useGlobeControlsContext(): GlobeControlsContextValue {
  const context = useContext(GlobeControlsContext);
  if (!context) {
    throw new Error(
      "useGlobeControlsContext must be used within GlobeControlsProvider",
    );
  }
  return context;
}

/** Read-only access for DOM controls UI. */
export function useGlobeControlsApi(): GlobeControlsApi | null {
  const { getApi } = useGlobeControlsContext();
  return getApi();
}
