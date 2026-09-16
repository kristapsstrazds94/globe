"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import type { Group } from "three";

type CountriesContextValue = {
  register: (group: Group | null) => void;
  getCountryGroup: () => Group | null;
};

const CountriesContext = createContext<CountriesContextValue | null>(null);

export function CountriesProvider({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group | null>(null);

  const register = useCallback((group: Group | null) => {
    groupRef.current = group;
  }, []);

  const getCountryGroup = useCallback(() => groupRef.current, []);

  const value = useMemo(
    () => ({
      register,
      getCountryGroup,
    }),
    [register, getCountryGroup],
  );

  return <CountriesContext.Provider value={value}>{children}</CountriesContext.Provider>;
}

export function useCountriesContext(): CountriesContextValue {
  const context = useContext(CountriesContext);
  if (!context) {
    throw new Error("useCountriesContext must be used within CountriesProvider");
  }
  return context;
}
