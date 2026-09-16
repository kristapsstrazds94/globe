"use client";

import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import type { Group, MeshStandardMaterial } from "three";

export type CountryMaterials = {
  default: MeshStandardMaterial;
  hover: MeshStandardMaterial;
  selected: MeshStandardMaterial;
};

type CountriesContextValue = {
  register: (group: Group | null) => void;
  getCountryGroup: () => Group | null;
  registerMaterials: (materials: CountryMaterials | null) => void;
  getCountryMaterials: () => CountryMaterials | null;
};

const CountriesContext = createContext<CountriesContextValue | null>(null);

export function CountriesProvider({ children }: { children: ReactNode }) {
  const groupRef = useRef<Group | null>(null);
  const materialsRef = useRef<CountryMaterials | null>(null);

  const register = useCallback((group: Group | null) => {
    groupRef.current = group;
  }, []);

  const getCountryGroup = useCallback(() => groupRef.current, []);

  const registerMaterials = useCallback((materials: CountryMaterials | null) => {
    materialsRef.current = materials;
  }, []);

  const getCountryMaterials = useCallback(() => materialsRef.current, []);

  const value = useMemo(
    () => ({
      register,
      getCountryGroup,
      registerMaterials,
      getCountryMaterials,
    }),
    [register, getCountryGroup, registerMaterials, getCountryMaterials],
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
