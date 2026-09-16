import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type GlobeStoreState = {
  hoveredCountryId: string | null;
  selectedCountryId: string | null;
  searchQuery: string;
  isPanelOpen: boolean;
};

export type GlobeStoreActions = {
  setHoveredCountryId: (id: string | null) => void;
  setSelectedCountryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setPanelOpen: (open: boolean) => void;
  clearSelection: () => void;
};

export type GlobeStore = GlobeStoreState & GlobeStoreActions;

export const useGlobeStore = create<GlobeStore>()(
  devtools(
    (set) => ({
      hoveredCountryId: null,
      selectedCountryId: null,
      searchQuery: "",
      isPanelOpen: false,
      setHoveredCountryId: (id) =>
        set(
          (state) => (state.hoveredCountryId === id ? state : { hoveredCountryId: id }),
          false,
          "setHoveredCountryId",
        ),
      setSelectedCountryId: (id) =>
        set(
          {
            selectedCountryId: id,
            isPanelOpen: id !== null,
          },
          false,
          "setSelectedCountryId",
        ),
      setSearchQuery: (query) => set({ searchQuery: query }, false, "setSearchQuery"),
      setPanelOpen: (open) => set({ isPanelOpen: open }, false, "setPanelOpen"),
      clearSelection: () =>
        set({ selectedCountryId: null, isPanelOpen: false }, false, "clearSelection"),
    }),
    {
      name: "GlobeStore",
      enabled: process.env.NODE_ENV === "development",
      /** Cap Redux DevTools history — hover changes can arrive in quick bursts. */
      maxAge: 50,
    },
  ),
);
